import React, { useEffect, useRef } from 'react'

const AGENT_COLORS = {
  triage: '#3b82f6',
  threatIntel: '#8b5cf6',
  rootCause: '#f97316',
  riskAssessment: '#ef4444',
  remediation: '#10b981',
  executive: '#06b6d4',
}

const STATUS_STYLES = {
  thinking: { color: '#f59e0b', label: 'Thinking...' },
  working: { color: '#3b82f6', label: 'Analyzing' },
  handoff: { color: '#8b5cf6', label: 'Handing off' },
  complete: { color: '#10b981', label: 'Complete' },
  waiting: { color: '#64748b', label: 'Waiting' },
  error: { color: '#ef4444', label: 'Error' },
}

function AgentBubble({ message, isNew }) {
  const { agent, content, type, timestamp } = message
  const color = AGENT_COLORS[agent.id] || '#64748b'

  return (
    <div style={{
      display: 'flex', gap: 12, marginBottom: 16,
      animation: isNew ? 'slideIn 0.35s ease forwards' : 'none',
      opacity: isNew ? 0 : 1,
      animationFillMode: 'forwards'
    }}>
      {/* Agent avatar */}
      <div style={{ flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `${color}20`,
          border: `1.5px solid ${color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, position: 'relative'
        }}>
          {agent.icon}
          {type === 'thinking' && (
            <div style={{
              position: 'absolute', bottom: -3, right: -3,
              width: 10, height: 10, borderRadius: '50%',
              background: '#f59e0b',
              animation: 'pulse 1.5s infinite'
            }} />
          )}
          {type === 'complete' && (
            <div style={{
              position: 'absolute', bottom: -3, right: -3,
              width: 10, height: 10, borderRadius: '50%',
              background: '#10b981'
            }} />
          )}
        </div>
      </div>

      {/* Message content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 12, color, fontFamily: 'var(--mono)' }}>
            {agent.shortName}
          </span>
          {type && STATUS_STYLES[type] && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
              background: `${STATUS_STYLES[type].color}15`,
              color: STATUS_STYLES[type].color,
              border: `1px solid ${STATUS_STYLES[type].color}30`,
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              {STATUS_STYLES[type].label}
            </span>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
            {timestamp}
          </span>
        </div>

        <div style={{
          background: type === 'handoff' ? `${color}08` : 'var(--bg3)',
          borderRadius: '4px 12px 12px 12px',
          padding: '10px 14px',
          border: `1px solid ${type === 'handoff' ? color + '30' : 'var(--border)'}`,
          borderLeft: `3px solid ${color}`,
          color: 'var(--text1)',
          fontSize: 13,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {type === 'thinking' ? (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: color,
                  animation: `pulse 1.4s ease ${i * 0.2}s infinite`
                }} />
              ))}
              <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text2)' }}>Processing...</span>
            </div>
          ) : (
            <>
              {type === 'handoff' && (
                <div style={{
                  fontSize: 11, color, fontWeight: 700, marginBottom: 6,
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  ⟶ Handing off to {message.handoffTo}
                </div>
              )}
              {content}
            </>
          )}
        </div>

        {/* Handoff arrow */}
        {type === 'handoff' && message.nextAgent && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
            fontSize: 11, color: 'var(--text2)'
          }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}40, transparent)` }} />
            <span>context passed to {message.nextAgent}</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${AGENT_COLORS[message.nextAgentId]}40)` }} />
          </div>
        )}
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
          <div style={{ fontWeight: 700, fontSize: 13 }}>Agent Collaboration</div>
          <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
            {bandRoomId ? `Band Room: ${bandRoomId.slice(0, 16)}...` : 'Band of Agents — Real-time Handoffs'}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {Object.entries(activeAgents).map(([id, status]) => (
            <div key={id} title={id} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: status === 'working' ? AGENT_COLORS[id] :
                          status === 'complete' ? '#10b981' :
                          status === 'error' ? '#ef4444' : '#374151',
              transition: 'all 0.3s',
              boxShadow: status === 'working' ? `0 0 6px ${AGENT_COLORS[id]}` : 'none'
            }} />
          ))}
        </div>
        {messages.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, color: 'var(--green)', fontWeight: 600
          }}>
            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
            LIVE
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', gap: 16,
            color: 'var(--text2)', textAlign: 'center'
          }}>
            <div style={{ fontSize: 40 }}>🤖</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Agents Standing By</div>
            <div style={{ fontSize: 12, maxWidth: 240, lineHeight: 1.6 }}>
              Upload security logs or select a demo incident to activate the agent collaboration panel
            </div>
            <div style={{
              display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8
            }}>
              {['🔍 Triage', '🕵️ Threat Intel', '🔬 Root Cause', '⚠️ Risk', '🛡️ Remediation', '📊 Exec Report'].map(a => (
                <span key={a} style={{
                  padding: '4px 10px', borderRadius: 12,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  fontSize: 11, color: 'var(--text2)'
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
