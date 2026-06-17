// Band of Agents API Integration — real multi-agent coordination layer
// Each CyberGuard agent has its OWN Band identity (UUID + API key + handle).
// Band is the actual message bus: agents join a shared chat room, post
// findings as themselves, @mention the next agent to hand off, and the
// next agent's prompt is built by reading Band's room context — not a
// local JS variable. This is what makes Band the real coordination layer
// rather than a notification log.

const BAND_API_BASE = 'https://app.band.ai/api/v1/agent'

// Registered Band agent identities — created as Remote Agents in the
// Band dashboard. Each has its own API key, so each agent authenticates
// to Band as itself when posting messages.
export const BAND_AGENTS = {
  triage: {
    uuid: 'fbfa79b4-108f-4d16-93dd-75e841cda1d3',
    handle: '@mani/triage',
    apiKeyEnv: 'BAND_KEY_TRIAGE',
  },
  threatIntel: {
    uuid: '988c5fd6-ab3e-4c11-85c0-1c4b1a39aa90',
    handle: '@mani/threatintel',
    apiKeyEnv: 'BAND_KEY_THREATINTEL',
  },
  rootCause: {
    uuid: '21618e90-58dc-43ae-9a58-89c51d923c81',
    handle: '@mani/rootcause',
    apiKeyEnv: 'BAND_KEY_ROOTCAUSE',
  },
  riskAssessment: {
    uuid: 'a8e17dc3-83fd-4396-97a5-a610c50b400c',
    handle: '@mani/riskassessment',
    apiKeyEnv: 'BAND_KEY_RISKASSESSMENT',
  },
  remediation: {
    uuid: '9afe8580-2108-4ff5-9d7c-7402369387e4',
    handle: '@mani/remediation',
    apiKeyEnv: 'BAND_KEY_REMEDIATION',
  },
  executive: {
    uuid: '397a9a17-c243-41ab-9fd5-bc4ba29bf7f3',
    handle: '@mani/executivereport',
    apiKeyEnv: 'BAND_KEY_EXECUTIVE',
  },
}

// All Band calls go through our Vercel proxy (/api/band) since each
// agent's API key must stay server-side, same pattern as the Claude key.
const BAND_PROXY = '/api/band'

async function bandCall(action, payload) {
  const res = await fetch(BAND_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Band proxy error ${res.status}`)
  }
  return res.json()
}

// Triage creates the room (it's always first in the pipeline)
export async function createInvestigationRoom(incidentTitle) {
  return bandCall('create_room', { incidentTitle })
}

// Add all 5 other agents as participants in the room Triage created
export async function addAllParticipants(roomId) {
  return bandCall('add_participants', { roomId })
}

// Post a message to Band AS a specific agent, @mentioning the next agent
export async function postAgentFinding(roomId, agentKey, content, nextAgentKey) {
  return bandCall('post_message', { roomId, agentKey, content, nextAgentKey })
}

// Fetch the room context FOR a specific agent (their mentions + their own sent messages)
// This is what builds the next agent's prompt — reading from Band, not local JS state.
export async function getAgentContext(roomId, agentKey) {
  return bandCall('get_context', { roomId, agentKey })
}

