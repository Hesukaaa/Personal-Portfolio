import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY?.trim();
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY?.trim();
const sanitizeDomain = (value) => value?.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '') ?? '';
const sanitizeUrl = (value) => value?.trim().replace(/\/+$/, '') ?? '';
const MAILGUN_DOMAIN = sanitizeDomain(process.env.MAILGUN_DOMAIN);
const MAILGUN_BASE_URL = sanitizeUrl(process.env.MAILGUN_BASE_URL) || 'https://api.mailgun.net/v3';
const SMTP_USER = process.env.GMAIL_USER?.trim();
const SMTP_PASS = process.env.GMAIL_APP_PASSWORD?.trim();
const MAILGUN_FROM = process.env.MAILGUN_FROM?.trim();
const SENDGRID_FROM = process.env.SENDGRID_FROM?.trim();
const TO_EMAIL = process.env.CONTACT_RECIPIENT?.trim() || process.env.TO_EMAIL?.trim() || 'dibdibjoel4@gmail.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const isSendGridEnabled = Boolean(SENDGRID_API_KEY);
const isMailgunEnabled = Boolean(MAILGUN_API_KEY && MAILGUN_DOMAIN);
const isSmtpEnabled = Boolean(SMTP_USER && SMTP_PASS);
const isEmailEnabled = isSendGridEnabled || isMailgunEnabled || isSmtpEnabled;

function buildEmailBody({ name, email, message }) {
  return {
    subject: `New portfolio message from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message,
    ].join('\n'),
    html: `
      <h3>New portfolio message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `,
  };
}

async function sendViaSendGrid({ name, email, message }) {
  const body = buildEmailBody({ name, email, message });

  const fromAddress = SENDGRID_FROM || SMTP_USER || TO_EMAIL;

  await sgMail.send({
    to: TO_EMAIL,
    from: fromAddress,
    replyTo: email,
    subject: body.subject,
    text: body.text,
    html: body.html,
  });
}

async function sendViaMailgun({ name, email, message }) {
  const form = new URLSearchParams();
  const fromAddress = MAILGUN_FROM || `Portfolio Contact <postmaster@${MAILGUN_DOMAIN}>`;
  form.append('from', fromAddress);
  form.append('to', TO_EMAIL);
  form.append('subject', `New portfolio message from ${name}`);
  form.append('text', [
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    message,
  ].join('\n'));
  form.append('h:Reply-To', email);
  form.append('html', `
    <h3>New portfolio message</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br />')}</p>
  `);

  const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
  const apiUrl = `${MAILGUN_BASE_URL}/${MAILGUN_DOMAIN}/messages`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Mailgun response status:', response.status, 'body:', text);
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        'Mailgun authentication failed. Verify MAILGUN_API_KEY, MAILGUN_DOMAIN, and whether your recipient is authorized for a sandbox domain.'
      );
    }
    throw new Error(`Mailgun error: ${response.status} ${text}`);
  }
}

async function sendViaSmtp({ name, email, message }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const body = buildEmailBody({ name, email, message });

  await transporter.sendMail({
    from: `Portfolio Contact <${SMTP_USER}>`,
    to: TO_EMAIL,
    replyTo: email,
    subject: body.subject,
    text: body.text,
    html: body.html,
  });
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, message: 'Method not allowed.' });
    return;
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    return;
  }

  if (!isEmailEnabled) {
    res.status(500).json({
      success: false,
      message: 'Email service is not configured. Please contact me directly at ' + TO_EMAIL,
    });
    return;
  }

  try {
    if (isSendGridEnabled) {
      await sendViaSendGrid({ name, email, message });
    } else if (isMailgunEnabled) {
      try {
        await sendViaMailgun({ name, email, message });
      } catch (mailgunError) {
        console.error('Mailgun failed, falling back to SMTP:', mailgunError);
        if (isSmtpEnabled) {
          await sendViaSmtp({ name, email, message });
        } else {
          throw mailgunError;
        }
      }
    } else {
      await sendViaSmtp({ name, email, message });
    }

    res.status(200).json({ success: true, message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Contact API error:', error);
    res.status(500).json({
      success: false,
      message:
        isMailgunEnabled && isSmtpEnabled
          ? 'Mailgun failed and SMTP could not send the message. Check your email configs.'
          : 'Unable to send message at this time. Please email me directly.',
    });
  }
}
