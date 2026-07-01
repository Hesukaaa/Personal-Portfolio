const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function sendJson(res, statusCode, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(statusCode).json(payload);
}

function fallbackReply(prompt) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes('contact') || normalized.includes('email')) {
    return 'You can reach Joel through the contact form or directly at dibdibjoel4@gmail.com. He usually replies promptly.';
  }

  if (normalized.includes('services') || normalized.includes('what can you do')) {
    return 'Joel builds responsive websites, frontend interfaces, UI/UX design, and branded portfolio projects with modern visuals and clean code.';
  }

  if (normalized.includes('portfolio') || normalized.includes('work')) {
    return 'This portfolio highlights Joel’s services, projects, skills, and contact details. Browse the sections to see more.';
  }

  if (normalized.includes('price') || normalized.includes('cost')) {
    return 'Pricing depends on the scope of your project. Share your requirements and Joel will provide a clear quote.';
  }

  if (normalized.includes('hello') || normalized.includes('hi') || normalized.includes('hey')) {
    return 'Hello! I’m Joel Assistant. Ask me anything about the portfolio, services, or projects.';
  }

  return 'Thanks for your question. Joel will review your request and reply shortly. If you want a richer answer, configure OPENAI_API_KEY in your environment.';
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
    return sendJson(res, 405, { success: false, message: 'Method not allowed. Use POST.' });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return sendJson(res, 400, { success: false, message: 'Prompt is required.' });
  }

  if (!OPENAI_API_KEY) {
    const reply = fallbackReply(prompt);
    return sendJson(res, 200, {
      success: true,
      reply,
      warning: 'OPENAI_API_KEY is not configured. Returning fallback responses only.',
    });
  }

  try {
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are Joel Assistant, a helpful AI assistant for a portfolio website. Answer any question clearly and politely. If the user asks about contact, services, pricing, or the portfolio, give concise and helpful responses.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      console.error('OpenAI request failed:', data);
      return sendJson(res, 502, {
        success: false,
        message: 'OpenAI request failed.',
        details: data,
      });
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return sendJson(res, 500, {
        success: false,
        message: 'OpenAI returned an empty reply.',
      });
    }

    return sendJson(res, 200, { success: true, reply });
  } catch (error) {
    console.error('Assistant API error:', error);
    const reply = fallbackReply(prompt);
    return sendJson(res, 200, {
      success: true,
      reply,
      warning: 'OpenAI API call failed; returning a fallback response instead.',
    });
  }
}
