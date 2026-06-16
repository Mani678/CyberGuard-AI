// Vercel Serverless Function — proxies requests to Anthropic's API
// Keeps the API key server-side, avoids CORS issues from direct browser calls.
// Deployed automatically by Vercel from /api/claude.js -> POST /api/claude

export default async function handler(req, res) {
  // CORS headers — allow your deployed frontend to call this function
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY env var' })
  }

  try {
    const { model, max_tokens, system, messages } = req.body

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model, max_tokens, system, messages })
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } })
  }
}