// Vercel Serverless Function — proxies requests to Band's Agent API.
// Each CyberGuard agent has its own Band API key (set as separate env vars
// on Vercel), so this function authenticates AS whichever agent is acting,
// keeping all 6 keys off the client exactly like /api/claude does for Anthropic.

const BAND_BASE = 'https://app.band.ai/api/v1/agent'

const AGENTS = {
  triage: { uuid: 'fbfa79b4-108f-4d16-93dd-75e841cda1d3', handle: '@mani/triage', envKey: 'BAND_KEY_TRIAGE' },
  threatIntel: { uuid: '988c5fd6-ab3e-4c11-85c0-1c4b1a39aa90', handle: '@mani/threatintel', envKey: 'BAND_KEY_THREATINTEL' },
  rootCause: { uuid: '21618e90-58dc-43ae-9a58-89c51d923c81', handle: '@mani/rootcause', envKey: 'BAND_KEY_ROOTCAUSE' },
  riskAssessment: { uuid: 'a8e17dc3-83fd-4396-97a5-a610c50b400c', handle: '@mani/riskassessment', envKey: 'BAND_KEY_RISKASSESSMENT' },
  remediation: { uuid: '9afe8580-2108-4ff5-9d7c-7402369387e4', handle: '@mani/remediation', envKey: 'BAND_KEY_REMEDIATION' },
  executive: { uuid: '397a9a17-c243-41ab-9fd5-bc4ba29bf7f3', handle: '@mani/executivereport', envKey: 'BAND_KEY_EXECUTIVE' },
}

function keyFor(agentKey) {
  const agent = AGENTS[agentKey]
  if (!agent) throw new Error(`Unknown agent: ${agentKey}`)
  const apiKey = process.env[agent.envKey]
  if (!apiKey) throw new Error(`Missing env var ${agent.envKey} for agent ${agentKey}`)
  return { agent, apiKey }
}

async function bandFetch(path, apiKey, options = {}) {
  const res = await fetch(`${BAND_BASE}${path}`, {
    ...options,
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error?.message || data.message || `Band API error ${res.status}`)
  }
  return data
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { action } = req.body

  try {
    if (action === 'create_room') {
      // Triage always creates the room since it's first in the pipeline
      const { apiKey } = keyFor('triage')
      const room = await bandFetch('/chats', apiKey, {
        method: 'POST',
        body: JSON.stringify({ chat: {} })
      })
      return res.status(200).json({ roomId: room.data.id })
    }

    if (action === 'add_participants') {
      const { roomId } = req.body
      const { apiKey } = keyFor('triage')
      const others = Object.keys(AGENTS).filter(k => k !== 'triage')
      const results = []
      for (const key of others) {
        try {
          const r = await bandFetch(`/chats/${roomId}/participants`, apiKey, {
            method: 'POST',
            body: JSON.stringify({ participant: { participant_id: AGENTS[key].uuid } })
          })
          results.push({ agent: key, ok: true, data: r.data })
        } catch (e) {
          results.push({ agent: key, ok: false, error: e.message })
        }
      }
      return res.status(200).json({ results })
    }

    if (action === 'post_message') {
      const { roomId, agentKey, content, nextAgentKey } = req.body
      const { apiKey } = keyFor(agentKey)
      const mentionAgent = nextAgentKey ? AGENTS[nextAgentKey] : null

      const messageContent = mentionAgent
        ? `${mentionAgent.handle} ${content}`
        : content

      const mentions = mentionAgent
        ? [{ id: mentionAgent.uuid, handle: mentionAgent.handle.replace('@', ''), name: nextAgentKey }]
        : []

      const result = await bandFetch(`/chats/${roomId}/messages`, apiKey, {
        method: 'POST',
        body: JSON.stringify({
          message: { content: messageContent, mentions }
        })
      })
      return res.status(200).json({ data: result.data })
    }

    if (action === 'get_context') {
      const { roomId, agentKey } = req.body
      const { apiKey } = keyFor(agentKey)
      const result = await bandFetch(`/chats/${roomId}/context?limit=50`, apiKey, {
        method: 'GET'
      })
      return res.status(200).json({ messages: result.data || [] })
    }

    return res.status(400).json({ error: `Unknown action: ${action}` })
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } })
  }
}
