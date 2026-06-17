import React from 'react'
import { BAND_AGENTS } from '../lib/band'

// Settings is now informational only — each agent's Band API key lives
// server-side as a Vercel environment variable (BAND_KEY_TRIAGE, etc.),
// not entered by the user at runtime. This panel shows connection status
// and the registered agent identities for transparency.

export default function SettingsPanel({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 16, width: 480, maxWidth: 'calc(100vw - 32px)', padding: 28,
        animation: 'slideIn 0.2s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Band Agents</div>
            <div style={{ color: 'var(--text2)', fontSize: 12, marginTop: 4 }}>Registered identities for this investigation</div>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '4px 10px' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {Object.entries(BAND_AGENTS).map(([key, agent]) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 12px', borderRadius: 8,
              background: 'var(--bg3)', border: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{key}</span>
              <span style={{ fontSize: 11.5, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{agent.handle}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--accent-dim)', border: '1px solid rgba(37,99,235,0.25)',
          borderRadius: 8, padding: '12px 16px', fontSize: 12, color: 'var(--text1)', lineHeight: 1.6
        }}>
          Each agent above authenticates to Band with its own API key, stored
          server-side as a Vercel environment variable. Findings are posted to
          a shared Band room with real @mentions to hand off work between agents.
        </div>
      </div>
    </div>
  )
}
