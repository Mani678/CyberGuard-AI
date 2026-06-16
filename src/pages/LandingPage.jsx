import React, { useEffect, useRef, useState } from 'react'

const FEATURES = [
  { icon: '🔍', title: 'Alert Triage', desc: 'Instantly categorizes and prioritizes alerts, eliminating false positives with AI-powered analysis.' },
  { icon: '🕵️', title: 'Threat Intelligence', desc: 'Enriches findings with real-time threat context, MITRE ATT&CK mapping, and IOC correlation.' },
  { icon: '🔬', title: 'Root Cause Analysis', desc: 'Reconstructs full attack chains to identify patient zero, entry vectors, and attacker objectives.' },
  { icon: '⚠️', title: 'Risk Assessment', desc: 'Calculates business impact, data exposure risk, and compliance implications in seconds.' },
  { icon: '🛡️', title: 'Remediation Planning', desc: 'Generates prioritized containment, eradication, and recovery playbooks automatically.' },
  { icon: '📊', title: 'Executive Reporting', desc: 'Produces board-ready incident summaries with timelines, metrics, and recommendations.' },
]

const STATS = [
  { value: '< 90s', label: 'Mean Time to Analysis' },
  { value: '6', label: 'Specialized AI Agents' },
  { value: '100%', label: 'Powered by Band of Agents' },
  { value: 'SOC2', label: 'Audit-Ready Reports' },
]

export default function LandingPage({ onEnter }) {
  const [typed, setTyped] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const phrase = 'Multi-Agent Incident Commander'
  const idx = useRef(0)

  useEffect(() => {
    const t = setInterval(() => {
      if (idx.current < phrase.length) {
        setTyped(phrase.slice(0, ++idx.current))
      } else {
        clearInterval(t)
      }
    }, 55)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setShowCursor(c => !c), 500)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg0)', overflowX: 'hidden' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 64,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,11,16,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 0 16px rgba(59,130,246,0.4)'
          }}>🛡️</div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
            CyberGuard <span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 32, color: 'var(--text1)', fontSize: 13 }}>
          {['Features', 'Agents', 'How It Works'].map(l => (
            <span key={l} style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text0)'}
              onMouseLeave={e => e.target.style.color = 'var(--text1)'}>{l}</span>
          ))}
        </div>
        <button className="btn-primary" onClick={onEnter} style={{ fontSize: 13, padding: '8px 18px' }}>
          Launch Platform →
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', padding: '120px 40px 100px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)'
        }} />
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '20%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '15%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--bg3)', border: '1px solid var(--border2)',
          borderRadius: 20, padding: '6px 16px', marginBottom: 32,
          color: 'var(--accent2)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em'
        }}>
          <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          POWERED BY BAND OF AGENTS • MULTI-AGENT SOC PLATFORM
        </div>

        <h1 style={{
          fontSize: 'clamp(36px,5vw,72px)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8,
          maxWidth: 800,
        }}>
          CyberGuard<span style={{ color: 'var(--accent)' }}> AI</span>
        </h1>
        <h2 style={{
          fontSize: 'clamp(20px,3vw,36px)', fontWeight: 400,
          color: 'var(--text1)', letterSpacing: '-0.02em', marginBottom: 32,
          minHeight: 48, display: 'flex', alignItems: 'center', gap: 2
        }}>
          <span style={{ fontFamily: 'var(--mono)' }}>{typed}</span>
          <span style={{ opacity: showCursor ? 1 : 0, color: 'var(--accent)', borderRight: '2px solid var(--accent)' }}>&nbsp;</span>
        </h2>
        <p style={{ maxWidth: 640, color: 'var(--text1)', fontSize: 18, lineHeight: 1.7, marginBottom: 48 }}>
          Six specialized AI agents collaborate in real time to investigate security incidents,
          determine root cause, assess business impact, and generate executive reports —
          all through <strong style={{ color: 'var(--text0)' }}>Band of Agents</strong>.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={onEnter} style={{ fontSize: 15, padding: '14px 32px' }}>
            🚀 Launch Incident Commander
          </button>
          <button className="btn-ghost" style={{ fontSize: 15, padding: '14px 32px' }}>
            Watch Demo ▶
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24,
          marginTop: 80, width: '100%', maxWidth: 800
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--mono)', letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agent collaboration preview */}
      <section style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--bg3)'
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ color: 'var(--text2)', fontSize: 12, marginLeft: 8, fontFamily: 'var(--mono)' }}>
              cyberguard-ai — agent collaboration panel
            </span>
            <span className="pulse" style={{
              marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
              background: 'var(--green)', display: 'inline-block'
            }} />
            <span style={{ color: 'var(--green)', fontSize: 11, fontWeight: 600 }}>LIVE</span>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { agent: '🔍 Triage', color: '#3b82f6', msg: 'Analyzing 23 alerts. Identified 4 CRITICAL events. Mass file encryption + C2 beacon detected on WORKSTATION-047. Filtering 8 false positives. Handing off to Threat Intel.' },
              { agent: '🕵️ Threat Intel', color: '#8b5cf6', msg: 'IOC 185.220.101.47 matches known REvil infrastructure (HIGH confidence). MITRE T1486 (Data Encrypted for Impact) + T1055 (Process Injection). Attribution: Ransomware-as-a-Service operator. Handing off to Root Cause.' },
              { agent: '🔬 Root Cause', color: '#f97316', msg: 'Attack chain reconstructed. Initial access: phishing email with malicious macro → PowerShell dropper → Mimikatz → lateral movement via SMB → ransomware deployment. Patient zero: jsmith on WORKSTATION-047. Dwell time: ~45 minutes.' },
              { agent: '⚠️ Risk', color: '#ef4444', msg: 'Severity Score: 94/100 CRITICAL. Est. business impact: $2.4M–$8.7M. 2,847 files encrypted. GDPR notification required within 72 hours. Handing off to Remediation.' },
            ].map((m, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12,
                animation: `slideIn 0.4s ease ${i * 0.1}s both`
              }}>
                <div style={{
                  flexShrink: 0, padding: '6px 12px', borderRadius: 6,
                  background: `${m.color}18`, border: `1px solid ${m.color}33`,
                  color: m.color, fontSize: 11, fontWeight: 700,
                  fontFamily: 'var(--mono)', whiteSpace: 'nowrap', alignSelf: 'flex-start'
                }}>{m.agent}</div>
                <div style={{
                  background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px',
                  color: 'var(--text1)', fontSize: 13, lineHeight: 1.6, flex: 1,
                  borderLeft: `2px solid ${m.color}44`
                }}>{m.msg}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em' }}>Six Agents. One Mission.</h2>
          <p style={{ color: 'var(--text1)', marginTop: 12, fontSize: 16 }}>Each agent specializes in one phase of incident response</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card" style={{
              transition: 'all 0.2s', cursor: 'default',
              borderColor: 'var(--border)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg3)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)' }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{f.title}</div>
              <div style={{ color: 'var(--text1)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Ready to investigate?
        </h2>
        <p style={{ color: 'var(--text1)', fontSize: 16, marginBottom: 40 }}>
          Upload your security logs and watch six agents collaborate to protect your organization.
        </p>
        <button className="btn-primary" onClick={onEnter} style={{ fontSize: 16, padding: '16px 40px' }}>
          🚀 Launch CyberGuard AI
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--text2)', fontSize: 12
      }}>
        <span>🛡️ CyberGuard AI — Powered by Band of Agents</span>
        <span>Built for the Band of Agents Hackathon 2026</span>
      </footer>
    </div>
  )
}
