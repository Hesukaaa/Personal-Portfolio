import http from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'messages.json');
const requestedPort = Number(process.env.SERVER_PORT || process.env.PORT) || 3001;
const smtpUser = process.env.GMAIL_USER?.trim();
const smtpPass = process.env.GMAIL_APP_PASSWORD?.trim();
const toEmail = 'dibdibjoel4@gmail.com';


const transporter = smtpUser && smtpPass
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : null;

const sendgridKey = process.env.SENDGRID_API_KEY?.trim();
if (sendgridKey) {
  try {
    sgMail.setApiKey(sendgridKey);
    console.log('SendGrid API key configured');
  } catch (e) {
    console.error('Failed to configure SendGrid:', e);
  }
}

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(dataFile, 'utf8');
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      await writeFile(dataFile, '[]', 'utf8');
      return;
    }

    throw error;
  }
}

async function loadMessages() {
  await ensureDataFile();
  const contents = await readFile(dataFile, 'utf8');

  try {
    return JSON.parse(contents);
  } catch {
    return [];
  }
}

async function saveMessages(messages) {
  await ensureDataFile();
  await writeFile(dataFile, JSON.stringify(messages, null, 2), 'utf8');
}

async function sendContactEmail(message) {
  // Prefer SendGrid API when configured
  if (sendgridKey) {
    const msg = {
      to: toEmail,
      from: smtpUser || toEmail,
      replyTo: message.email,
      subject: `New portfolio message from ${message.name}`,
      text: [
        `Name: ${message.name}`,
        `Email: ${message.email}`,
        '',
        message.message,
      ].join('\n'),
      html: `
        <h3>New portfolio message</h3>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.message.replace(/\n/g, '<br />')}</p>
      `,
    };

    await sgMail.send(msg);
    return true;
  }

  if (!transporter || !toEmail) {
    console.warn('Email delivery is not configured. Message was saved locally only.');
    return false;
  }

  await transporter.sendMail({
    from: `Portfolio Contact <${smtpUser}>`,
    to: toEmail,
    replyTo: message.email,
    subject: `New portfolio message from ${message.name}`,
    text: [
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      '',
      message.message,
    ].join('\n'),
    html: `
      <h3>New portfolio message</h3>
      <p><strong>Name:</strong> ${message.name}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.message.replace(/\n/g, '<br />')}</p>
    `,
  });

  return true;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

const handler = async (req, res) => {
  const requestUrl = new URL(req.url || '/', 'http://localhost');
  console.log('REQUEST', req.method, requestUrl.pathname);
  console.log('HEADERS:', req.headers);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (requestUrl.pathname === '/api/health') {
    sendJson(res, 200, { success: true, message: 'Backend is running' });
    return;
  }

  if (requestUrl.pathname === '/api/contact' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1000000) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        console.log('RAW REQUEST BODY:', body);
        let data = {};

        try {
          data = body ? JSON.parse(body) : {};
          console.log('Parsed data:', data);
        } catch (parseErr) {
          console.error('JSON parse error:', parseErr);
          console.error('Body causing parse error:', body);
          sendJson(res, 400, { success: false, message: 'Invalid JSON payload.' });
          return;
        }
        const name = typeof data.name === 'string' ? data.name.trim() : '';
        const email = typeof data.email === 'string' ? data.email.trim() : '';
        const message = typeof data.message === 'string' ? data.message.trim() : '';

        if (!name || !email || !message) {
          sendJson(res, 400, { success: false, message: 'Name, email, and message are required.' });
          return;
        }

        console.log('About to load messages from disk');
        const messages = await loadMessages();
        console.log('Loaded messages count:', Array.isArray(messages) ? messages.length : 'unknown');

        const newMessage = {
          id: Date.now(),
          name,
          email,
          message,
          createdAt: new Date().toISOString()
        };
        try {
          messages.push(newMessage);
          await saveMessages(messages);
          console.log('Message saved to local file');
        } catch (saveErr) {
          console.error('Error saving message:', saveErr);
        }

        let emailSent = false;
        try {
          emailSent = await sendContactEmail(newMessage);
          console.log('Email send attempted, result:', emailSent);
        } catch (mailErr) {
          console.error('Error sending email:', mailErr);
          emailSent = false;
        }

        sendJson(res, 200, {
          success: true,
          message: emailSent
            ? 'Message received and emailed successfully.'
            : 'Message received and saved locally. Configure SMTP to send email.',
          data: newMessage,
        });
      } catch (error) {
        console.error('Handler error:', error);
        sendJson(res, 400, { success: false, message: 'Invalid request payload.' });
      }
    });

    return;
  }

  sendJson(res, 404, { success: false, message: 'Not found' });
};

function startServer(portToUse) {
  const server = http.createServer(handler);

  server.on('error', (error) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EADDRINUSE') {
      console.error(`Port ${portToUse} is already in use. Please stop the process using that port or change PORT in .env and restart.`);
      process.exit(1);
    }

    console.error(error);
    process.exit(1);
  });

  server.listen(portToUse, () => {
    console.log(`Backend running on http://localhost:${portToUse}`);
  });
}

startServer(requestedPort);
