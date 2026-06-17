import React, { useEffect, useRef } from 'react'

const AGENT_COLORS = {
  triage: '#3b82f6',
  threatIntel: '#6366f1',
  rootCause: '#d97706',
  riskAssessment: '#dc2626',
  remediation: '#16a34a',
  executive: '#2563eb',
}

const STATUS_STYLES = {
  thinking: { color: '#d97706', label: 'Thinking' },
  working: { color: '#3b82f6', label: 'Analyzing' },
  handoff: { color: '#6366f1', label: 'Handoff' },
  complete: { color: '#16a34a', label: 'Complete' },
  waiting: { color: '#5a6472', label: 'Waiting' },
  error: { color: '#dc2626', label: 'Error' },
}

function AgentBubble({ message, isNew }) {
  const { agent, content, type, timestamp } = message
  const color = AGENT_COLORS[agent.id] || '#64748b'

  return (
    <div style={{
      display: 'flex', gap: 12, marginBottom: 14, paddingBottom: 14,
      borderBottom: '1px solid var(--border)',
      animation: isNew ? 'slideIn 0.3s ease forwards' : 'none',
      opacity: isNew ? 0 : 1,
      animationFillMode: 'forwards'
    }}>
      {/* Status indicator bar */}
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <div style={{
          width: 3, height: '100%', minHeight: 20, borderRadius: 1,
          background: color
        }} />
      </div>

      {/* Message content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
            {timestamp}
          </span>
          <span style={{ fontWeight: 700, fontSize: 11.5, color, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
            {agent.shortName.toUpperCase()}
          </span>
          {type && STATUS_STYLES[type] && (
            <span style={{
              fontSize: 9.5, fontWeight: 600, padding: '1px 7px', borderRadius: 3,
              background: `${STATUS_STYLES[type].color}12`,
              color: STATUS_STYLES[type].color,
              border: `1px solid ${STATUS_STYLES[type].color}28`,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              fontFamily: 'var(--mono)'
            }}>
              {STATUS_STYLES[type].label}
            </span>
          )}
        </div>

        <div style={{
          color: 'var(--text1)',
          fontSize: 13,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          paddingLeft: 0
        }}>
          {type === 'thinking' ? (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 5, height: 5, borderRadius: '50%', background: color,
                  animation: `pulse 1.4s ease ${i * 0.2}s infinite`
                }} />
              ))}
              <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>processing...</span>
            </div>
          ) : (
            <>
              {type === 'handoff' && (
                <div style={{
                  fontSize: 10.5, color, fontWeight: 700, marginBottom: 5,
                  textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--mono)'
                }}>
                  → handoff: {message.handoffTo}
                </div>
              )}
              {content}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AgentPanel({ messages, activeAgents, bandRoomId }) {
  const bottomRef = useRef(null)
  const prevLen = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const newStartIdx = prevLen.current
  useEffect(() => { prevLen.current = messages.length }, [messages.length])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--bg1)',
    }}>
      {/* Panel header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--bg2)', flexShrink: 0
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Agent Activity Log</div>
          <div style={{ fontSize: 10.5, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
            {bandRoomId ? `band room: ${bandRoomId.slice(0, 16)}` : 'band of agents — real-time handoffs'}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {Object.entries(activeAgents).map(([id, status]) => (
            <div key={id} title={id} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: status === 'working' ? AGENT_COLORS[id] :
                          status === 'complete' ? '#16a34a' :
                          status === 'error' ? '#dc2626' : '#2a2f36',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
        {messages.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 10.5, color: 'var(--green)', fontWeight: 700, fontFamily: 'var(--mono)'
          }}>
            <span className="pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
            LIVE
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', gap: 14,
            color: 'var(--text2)', textAlign: 'center'
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)' }}>AGENTS STANDING BY</div>
            <div style={{ fontSize: 12, maxWidth: 240, lineHeight: 1.6 }}>
              Select a demo incident or submit logs to activate the investigation pipeline
            </div>
            <div style={{
              display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8
            }}>
              {['Triage', 'Threat Intel', 'Root Cause', 'Risk', 'Remediation', 'Exec Report'].map(a => (
                <span key={a} style={{
                  padding: '3px 9px', borderRadius: 4,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  fontSize: 10.5, color: 'var(--text2)', fontFamily: 'var(--mono)'
                }}>{a}</span>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <AgentBubble key={msg.id} message={msg} isNew={i >= newStartIdx} />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
