import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

const toEmail = process.env.TO_EMAIL || 'dibdibjoel4@gmail.com';

const smtpUser = process.env.GMAIL_USER?.trim();
const smtpPass = process.env.GMAIL_APP_PASSWORD?.trim();

const transporter =
  smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      })
    : null;

const sendgridKey = process.env.SENDGRID_API_KEY?.trim();
if (sendgridKey) {
  try {
    sgMail.setApiKey(sendgridKey);
  } catch (e) {
    console.error('Failed to configure SendGrid:', e);
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function ensureDataFile(dataFile) {
  const dataDir = path.dirname(dataFile);
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

function safeJsonParse(contents) {
  try {
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  let data = req.body ?? {};
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      res.status(400).json({ success: false, message: 'Invalid JSON payload.' });
      return;
    }
  }

  const name = typeof data?.name === 'string' ? data.name.trim() : '';
  const email = typeof data?.email === 'string' ? data.email.trim() : '';
  const message = typeof data?.message === 'string' ? data.message.trim() : '';

  if (!name || !email || !message) {
    res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    return;
  }

  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  // Best-effort local persistence (ephemeral on Vercel)
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dataFile = path.join(__dirname, '..', '..', 'data', 'messages.json');

    await ensureDataFile(dataFile);

    const contents = await readFile(dataFile, 'utf8');
    const messages = safeJsonParse(contents);

    messages.push(newMessage);
    await writeFile(dataFile, JSON.stringify(messages, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist message locally:', e);
  }

  try {
    if (sendgridKey) {
      await sgMail.send({
        to: toEmail,
        from: smtpUser || toEmail,
        replyTo: email,
        subject: `New portfolio message from ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, '', message].join('\n'),
        html: `
          <h3>New portfolio message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${String(message).replace(/\n/g, '<br />')}</p>
        `,
      });
    } else if (transporter && toEmail) {
      await transporter.sendMail({
        from: `Portfolio Contact <${smtpUser}>`,
        to: toEmail,
        replyTo: email,
        subject: `New portfolio message from ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, '', message].join('\n'),
        html: `
          <h3>New portfolio message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${String(message).replace(/\n/g, '<br />')}</p>
        `,
      });
    } else {
      // No mail configured
      res.status(200).json({
        success: true,
        message: 'Message received and saved locally. Configure SMTP/SendGrid to send email.',
        data: newMessage,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Message received and emailed successfully.',
      data: newMessage,
    });
  } catch (e) {
    console.error('Email send error:', e);
    res.status(200).json({
      success: true,
      message: 'Message received, but email delivery failed.',
      data: newMessage,
    });
  }
}
