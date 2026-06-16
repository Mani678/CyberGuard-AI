import React, { useState, useEffect } from 'react'
import { getBandApiKey, setBandApiKey } from '../lib/band'

export default function SettingsPanel({ onClose }) {
  const [bandKey, setBandKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const k = getBandApiKey()
    if (k) setBandKey(k)
  }, [])

  const handleSave = () => {
    if (bandKey.trim()) setBandApiKey(bandKey.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 16, width: 480, padding: 28,
        animation: 'slideIn 0.2s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>⚙️ API Configuration</div>
            <div style={{ color: 'var(--text2)', fontSize: 12, marginTop: 4 }}>Connect CyberGuard AI to Band of Agents</div>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '4px 10px' }}>✕</button>
        </div>

        {/* Band API */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text1)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Band of Agents API Key
          </label>
          <input
            type="password"
            value={bandKey}
            onChange={e => setBandKey(e.target.value)}
            placeholder="band_sk_..."
            style={{
              width: '100%', padding: '10px 14px',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text0)', fontSize: 13,
              fontFamily: 'var(--mono)', outline: 'none'
            }}
          />
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6 }}>
            Get your key at <a href="https://band.ai" target="_blank" rel="noreferrer"
              style={{ color: 'var(--accent)' }}>band.ai</a> — use promo code <strong>BANDHACK26</strong> for free Pro
          </div>
        </div>

        {/* Info box */}
        <div style={{
          background: 'var(--accent-glow)', border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: 'var(--text1)', lineHeight: 1.6
        }}>
          <strong style={{ color: 'var(--accent2)' }}>ℹ️ Without Band API key:</strong> Agents collaborate using the Claude API directly
          with simulated Band handoffs shown in the UI. Add your Band key to enable real Band room
          creation and cross-agent message passing.
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={handleSave} style={{ flex: 1 }}>
            {saved ? '✓ Saved!' : 'Save Configuration'}
          </button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
