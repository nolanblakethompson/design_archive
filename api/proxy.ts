// /api/proxy.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const targetUrl = req.query.url;

  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).json({ error: 'Missing ?url=' });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body: req.method === 'POST' ? req.body : undefined,
    });

    const text = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(response.status).send(text);
  } catch (err: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: err.message });
  }
}
