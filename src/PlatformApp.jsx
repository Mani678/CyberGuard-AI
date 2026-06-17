import React, { useState, useCallback, useRef } from 'react'
import AgentPanel from './components/AgentPanel.jsx'
import Dashboard from './components/Dashboard.jsx'
import ExecutiveReport from './components/ExecutiveReport.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import { AGENTS, callAgent, parseAgentResponse } from './lib/agents.js'
import { INCIDENT_TEMPLATES } from './lib/sampleData.js'
import { createInvestigationRoom, addAllParticipants, postAgentFinding, getAgentContext } from './lib/band.js'

const AGENT_ORDER = ['triage', 'threatIntel', 'rootCause', 'riskAssessment', 'remediation', 'executive']

function now() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

let msgId = 0

export default function PlatformApp({ onBack }) {
  const [tab, setTab] = useState('dashboard') // dashboard | report
  const [messages, setMessages] = useState([])
  const [findings, setFindings] = useState({})
  const [incident, setIncident] = useState(null)
  const [agentStatuses, setAgentStatuses] = useState({
    triage: 'waiting', threatIntel: 'waiting', rootCause: 'waiting',
    riskAssessment: 'waiting', remediation: 'waiting', executive: 'waiting'
  })
  const [isRunning, setIsRunning] = useState(false)
  const [logInput, setLogInput] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [bandRoomId, setBandRoomId] = useState(null)
  const [error, setError] = useState(null)
  const findingsRef = useRef({})

  const addMessage = useCallback((agent, content, type = 'message', extra = {}) => {
    const msg = { id: ++msgId, agent, content, type, timestamp: now(), ...extra }
    setMessages(prev => [...prev, msg])
    return msg
  }, [])

  const setAgentStatus = useCallback((agentId, status) => {
    setAgentStatuses(prev => ({ ...prev, [agentId]: status }))
  }, [])

  const runInvestigation = useCallback(async (logsText, incidentMeta) => {
    setIsRunning(true)
    setError(null)
    setMessages([])
    setFindings({})
    findingsRef.current = {}
    setAgentStatuses({
      triage: 'waiting', threatIntel: 'waiting', rootCause: 'waiting',
      riskAssessment: 'waiting', remediation: 'waiting', executive: 'waiting'
    })

    setIncident(incidentMeta)

    // Band room creation is MANDATORY — Band is the real coordination
    // layer for this app, not an optional add-on. Triage creates the
    // room, then all 5 other agents are added as participants so they
    // can see @mentions directed at them.
    let roomId = null
    try {
      addMessage(AGENTS.triage, 'Creating Band investigation room...', 'system')
      const room = await createInvestigationRoom(incidentMeta.title)
      roomId = room.roomId
      setBandRoomId(roomId)

      await addAllParticipants(roomId)
      addMessage(AGENTS.triage, `Band room ${roomId.slice(0, 8)} created. All 6 agents joined as participants.`, 'system')
    } catch (e) {
      addMessage(AGENTS.triage, `Band room setup failed: ${e.message}`, 'error')
      setError(`Band setup failed: ${e.message}. Check your Band API keys are configured in Vercel environment variables.`)
      setIsRunning(false)
      return
    }

    let previousContext = logsText

    for (const agentId of AGENT_ORDER) {
      const agent = AGENTS[agentId]
      setAgentStatus(agentId, 'working')

      // Show thinking
      addMessage(agent, '', 'thinking')

      try {
        let agentPrompt

        if (agentId === 'triage') {
          // First agent — no Band context yet, just the raw logs
          agentPrompt = `Analyze these security logs and alerts:\n\n${logsText}`
        } else {
          // Every subsequent agent's prompt is built from what's actually
          // in the Band room — this is the real handoff mechanism. We
          // fetch this agent's Band context (messages that @mentioned it)
          // rather than passing a local JS variable between loop iterations.
          const context = await getAgentContext(roomId, agentId)
          const mentionedContent = (context.messages || [])
            .filter(m => m.message_type === 'text')
            .map(m => m.content)
            .join('\n\n')

          agentPrompt = mentionedContent
            ? `You were mentioned in the Band investigation room with this handoff:\n\n${mentionedContent}\n\nNow perform your ${agent.role} analysis.`
            : `Here are the findings from previous agents:\n\n${previousContext}\n\nNow perform your ${agent.role} analysis.`
        }

        const response = await callAgent(agent, agentPrompt, [], agentId === 'executive' ? 1100 : undefined)
        const parsed = parseAgentResponse(response)

        // Remove thinking bubble, add real response
        setMessages(prev => prev.filter(m => !(m.agent.id === agentId && m.type === 'thinking')))

        // Format readable summary from parsed data
        let summary = ''
        if (agentId === 'triage') {
          const c = parsed.priority_count || {}
          summary = `${parsed.summary || ''}\n\n📊 Priority Breakdown: ${c.critical || 0} Critical, ${c.high || 0} High, ${c.medium || 0} Medium, ${c.low || 0} Low\n🚨 Top Threat: ${parsed.top_threat || 'Unknown'}`
        } else if (agentId === 'threatIntel') {
          const ttps = (parsed.mitre_ttps || []).slice(0, 3).map(t => `${t.id}: ${t.technique}`).join(', ')
          summary = `${parsed.summary || ''}\n\n🎯 MITRE Techniques: ${ttps || 'Analyzing...'}\n🦹 Threat Actor: ${(parsed.threat_actors || [])[0]?.name || 'Unknown'}`
        } else if (agentId === 'rootCause') {
          summary = `${parsed.summary || ''}\n\n⛓️ Initial Access: ${parsed.initial_access?.method || 'Unknown'}\n🎯 Patient Zero: ${parsed.patient_zero?.system || 'Unknown'} (${parsed.patient_zero?.user || 'Unknown'})\n⏱️ Dwell Time: ${parsed.dwell_time || 'Unknown'}`
        } else if (agentId === 'riskAssessment') {
          summary = `${parsed.summary || ''}\n\n📊 Risk Score: ${parsed.severity_score || 0}/100 (${parsed.severity_level || 'Unknown'})\n💰 Est. Loss: ${parsed.business_impact?.estimated_loss || 'Calculating...'}\n🖥️ Assets Affected: ${(parsed.affected_assets || []).length}`
        } else if (agentId === 'remediation') {
          const actions = (parsed.immediate_actions || []).slice(0, 2).map(a => a.action).join('; ')
          summary = `${parsed.summary || ''}\n\n🚨 Immediate Actions: ${actions || 'See full plan'}\n⏱️ Total Recovery: ${parsed.timeline?.total || 'Estimating...'}`
        } else if (agentId === 'executive') {
          summary = parsed.executive_summary || parsed.summary || 'Executive report generated.'
        }

        addMessage(agent, summary || parsed.summary || response.slice(0, 500), 'complete')

        // Post this agent's finding TO BAND, @mentioning the next agent.
        // This IS the handoff — Band routes it, the next agent's context
        // fetch above is what picks it up. Not a courtesy log afterward.
        const nextAgentId = AGENT_ORDER[AGENT_ORDER.indexOf(agentId) + 1]
        if (nextAgentId) {
          const handoffText = parsed.handoff_context || summary || `Findings ready for ${AGENTS[nextAgentId]?.name}`
          addMessage(agent, handoffText, 'handoff', {
            handoffTo: AGENTS[nextAgentId]?.name,
            nextAgent: AGENTS[nextAgentId]?.name,
            nextAgentId
          })

          await postAgentFinding(roomId, agentId, handoffText, nextAgentId)
        }

        // Store findings for the dashboard/report UI
        findingsRef.current[agentId] = parsed
        setFindings({ ...findingsRef.current })

        // Fallback context chain (used only if a Band context fetch ever
        // comes back empty — keeps the demo resilient to a flaky Band call)
        if (agentId === 'remediation') {
          previousContext = AGENT_ORDER
            .slice(0, AGENT_ORDER.indexOf(agentId) + 1)
            .map(id => findingsRef.current[id]?.summary ? `${AGENTS[id].name}: ${findingsRef.current[id].summary}` : '')
            .filter(Boolean)
            .join('\n')
          previousContext += `\n\nRemediation plan: ${parsed.handoff_context || parsed.summary || ''}`
        } else {
          previousContext = parsed.handoff_context || parsed.summary || JSON.stringify(parsed).slice(0, 800)
        }

        setAgentStatus(agentId, 'complete')

        // Switch to report tab when exec report is done
        if (agentId === 'executive') {
          setTimeout(() => setTab('report'), 800)
        }

        // Small delay between agents for visual effect
        await new Promise(r => setTimeout(r, 600))

      } catch (err) {
        setMessages(prev => prev.filter(m => !(m.agent.id === agentId && m.type === 'thinking')))
        addMessage(agent, `Error: ${err.message}`, 'error')
        setAgentStatus(agentId, 'error')
        setError(`${agent.name} failed: ${err.message}`)
        break
      }
    }

    setIsRunning(false)
  }, [addMessage, setAgentStatus])

  const handleSubmitLogs = useCallback(() => {
    if (!logInput.trim()) return
    const meta = {
      id: `INC-${Date.now()}`,
      title: 'Manual Log Analysis',
      severity: 'UNKNOWN',
      description: 'User-submitted security logs',
    }
    runInvestigation(logInput, meta)
  }, [logInput, runInvestigation])

  const handleTemplate = useCallback((template) => {
    setLogInput(template.logs)
    runInvestigation(template.logs, template)
  }, [runInvestigation])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg0)' }}>
      {/* Top bar */}
      <div className="top-bar" style={{
        height: 56, display: 'flex', alignItems: 'center', padding: '0 20px',
        borderBottom: '1px solid var(--border)', background: 'var(--bg1)',
        gap: 16, flexShrink: 0
      }}>
        <button onClick={onBack} style={{ color: 'var(--text2)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 5,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
            fontWeight: 700, color: '#fff', fontFamily: 'var(--mono)'
          }}>CG</div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>
            CyberGuard <span style={{ color: 'var(--text2)' }}>AI</span>
          </span>
        </div>

        {/* Agent status dots */}
        <div className="top-bar-status-dots" style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 8 }}>
          {AGENT_ORDER.map(id => (
            <div key={id} title={AGENTS[id].name} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 12,
              background: agentStatuses[id] === 'working' ? `${AGENTS[id].color}15` : 'var(--bg3)',
              border: `1px solid ${agentStatuses[id] === 'working' ? AGENTS[id].color + '40' : 'var(--border)'}`,
              fontSize: 10, fontWeight: 600, color: agentStatuses[id] === 'working' ? AGENTS[id].color :
                agentStatuses[id] === 'complete' ? '#10b981' : agentStatuses[id] === 'error' ? '#ef4444' : 'var(--text2)',
              transition: 'all 0.3s'
            }}>
              <span>{AGENTS[id].icon}</span>
              <span style={{ display: agentStatuses[id] !== 'waiting' ? 'inline' : 'none' }}>
                {agentStatuses[id] === 'working' ? '●' : agentStatuses[id] === 'complete' ? '✓' : '✕'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          {bandRoomId && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: 'var(--accent2)', fontFamily: 'var(--mono)',
              background: 'var(--accent-dim)', padding: '4px 10px', borderRadius: 5,
              border: '1px solid rgba(37,99,235,0.25)'
            }}>
              Band: {bandRoomId.slice(0, 8)}
            </div>
          )}
          <button className="btn-ghost" onClick={() => setShowSettings(true)} style={{ fontSize: 12, padding: '6px 12px' }}>
            Settings
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="platform-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 340px', overflow: 'hidden' }}>

        {/* LEFT — Input panel */}
        <div className="platform-left" style={{
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          background: 'var(--bg1)'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🚨 Incident Input</div>

            {/* Demo templates */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Demo Incidents
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {INCIDENT_TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => handleTemplate(t)}
                    disabled={isRunning}
                    style={{
                      textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                      background: 'var(--bg3)', border: '1px solid var(--border)',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s', opacity: isRunning ? 0.5 : 1
                    }}
                    onMouseEnter={e => !isRunning && (e.currentTarget.style.borderColor = 'var(--border2)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className={`badge badge-${t.severity.toLowerCase()}`}>{t.severity}</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{t.title.split('—')[0].trim()}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.4 }}>{t.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Log input */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Custom Logs / SIEM Alerts
            </div>
            <textarea
              value={logInput}
              onChange={e => setLogInput(e.target.value)}
              placeholder="Paste security logs, SIEM alerts, or incident data here..."
              disabled={isRunning}
              style={{
                flex: 1, resize: 'none', background: 'var(--bg3)',
                border: '1px solid var(--border)', borderRadius: 8,
                padding: 12, color: 'var(--text1)', fontSize: 11,
                fontFamily: 'var(--mono)', lineHeight: 1.6, outline: 'none',
                marginBottom: 10
              }}
            />
            <button
              className="btn-primary"
              onClick={handleSubmitLogs}
              disabled={isRunning || !logInput.trim()}
              style={{ width: '100%', justifyContent: 'center', opacity: (!logInput.trim() || isRunning) ? 0.5 : 1 }}>
              {isRunning ? (
                <>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Investigating...
                </>
              ) : '🚀 Investigate'}
            </button>
            {error && (
              <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 6, background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.3)', fontSize: 11, color: '#ef4444' }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* CENTER — Agent collaboration panel */}
        <div className="platform-center" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <AgentPanel messages={messages} activeAgents={agentStatuses} bandRoomId={bandRoomId} />
        </div>

        {/* RIGHT — Dashboard / Report */}
        <div className="platform-right" style={{
          borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          background: 'var(--bg1)'
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid var(--border)',
            background: 'var(--bg2)', flexShrink: 0
          }}>
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'report', label: '📋 Exec Report', badge: findings.executive },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '12px 8px', fontSize: 12, fontWeight: 600,
                  borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                  color: tab === t.id ? 'var(--text0)' : 'var(--text2)',
                  transition: 'all 0.2s', position: 'relative'
                }}>
                {t.label}
                {t.badge && (
                  <span style={{
                    marginLeft: 6, width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--green)', display: 'inline-block'
                  }} />
                )}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            {tab === 'dashboard' ? (
              <Dashboard findings={findings} incident={incident} agentStatuses={agentStatuses} />
            ) : (
              <ExecutiveReport report={findings.executive} incident={incident} />
            )}
          </div>
        </div>
      </div>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  )
}
