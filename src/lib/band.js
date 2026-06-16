// Band of Agents API Integration Layer
// Set your Band API key in localStorage: localStorage.setItem('band_api_key', 'your-key')
// Or set VITE_BAND_API_KEY in .env

const BAND_API_BASE = 'https://api.band.ai/v1'

export function getBandApiKey() {
  return localStorage.getItem('band_api_key') || import.meta.env?.VITE_BAND_API_KEY || null
}

export function setBandApiKey(key) {
  localStorage.setItem('band_api_key', key)
}

// Create a Band room for agent collaboration
export async function createBandRoom(incidentId, incidentTitle) {
  const apiKey = getBandApiKey()
  if (!apiKey) throw new Error('No Band API key configured')

  const res = await fetch(`${BAND_API_BASE}/rooms`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `CyberGuard — ${incidentTitle}`,
      description: `Incident ${incidentId} multi-agent investigation`,
      metadata: { incident_id: incidentId, platform: 'cyberguard-ai' }
    })
  })
  if (!res.ok) throw new Error(`Band room creation failed: ${res.status}`)
  return res.json()
}

// Post an agent message to a Band room
export async function postAgentMessage(roomId, agentName, content, metadata = {}) {
  const apiKey = getBandApiKey()
  if (!apiKey) throw new Error('No Band API key configured')

  const res = await fetch(`${BAND_API_BASE}/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agent: agentName,
      content,
      metadata: { ...metadata, platform: 'cyberguard-ai' }
    })
  })
  if (!res.ok) throw new Error(`Band message post failed: ${res.status}`)
  return res.json()
}

// Get all messages from a Band room
export async function getBandRoomMessages(roomId) {
  const apiKey = getBandApiKey()
  if (!apiKey) throw new Error('No Band API key configured')

  const res = await fetch(`${BAND_API_BASE}/rooms/${roomId}/messages`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  if (!res.ok) throw new Error(`Band room fetch failed: ${res.status}`)
  return res.json()
}

// List all Band rooms
export async function listBandRooms() {
  const apiKey = getBandApiKey()
  if (!apiKey) throw new Error('No Band API key configured')

  const res = await fetch(`${BAND_API_BASE}/rooms`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  if (!res.ok) throw new Error(`Band list failed: ${res.status}`)
  return res.json()
}

// Invite an agent to a room
export async function inviteAgentToRoom(roomId, agentConfig) {
  const apiKey = getBandApiKey()
  if (!apiKey) throw new Error('No Band API key configured')

  const res = await fetch(`${BAND_API_BASE}/rooms/${roomId}/agents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(agentConfig)
  })
  if (!res.ok) throw new Error(`Band agent invite failed: ${res.status}`)
  return res.json()
}

// Handoff context between agents (structured context passing)
export async function handoffContext(roomId, fromAgent, toAgent, context) {
  return postAgentMessage(roomId, fromAgent, JSON.stringify({
    type: 'HANDOFF',
    to: toAgent,
    context,
    timestamp: new Date().toISOString()
  }), { handoff: true, to_agent: toAgent })
}
