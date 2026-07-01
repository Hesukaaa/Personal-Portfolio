import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY?.trim();
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY?.trim();
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN?.trim();
const SMTP_USER = process.env.GMAIL_USER?.trim();
const SMTP_PASS = process.env.GMAIL_APP_PASSWORD?.trim();
const TO_EMAIL = process.env.CONTACT_RECIPIENT?.trim() || 'dibdibjoel4@gmail.com';

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

  await sgMail.send({
    to: TO_EMAIL,
    from: SMTP_USER || TO_EMAIL,
    replyTo: email,
    subject: body.subject,
    text: body.text,
    html: body.html,
  });
}

async function sendViaMailgun({ name, email, message }) {
  const form = new URLSearchParams();
  form.append('from', `Portfolio Contact <${email}>`);
  form.append('to', TO_EMAIL);
  form.append('subject', `New portfolio message from ${name}`);
  form.append('text', [
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    message,
  ].join('\n'));

  const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
  const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Mailgun error: ${text}`);
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
      await sendViaMailgun({ name, email, message });
    } else {
      await sendViaSmtp({ name, email, message });
    }

    res.status(200).json({ success: true, message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Contact API error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to send message at this time. Please email me directly.',
    });
  }
}
