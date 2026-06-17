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
      <nav className="site-nav" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 56,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,12,15,0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 5,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--mono)'
          }}>CG</div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>
            CyberGuard <span style={{ color: 'var(--text2)' }}>AI</span>
          </span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 28, color: 'var(--text1)', fontSize: 13 }}>
          {[{ label: 'Features', id: 'features' }, { label: 'Agents', id: 'agent-log-preview' }, { label: 'How It Works', id: 'how-it-works' }].map(l => (
            <span key={l.id} style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              onMouseEnter={e => e.target.style.color = 'var(--text0)'}
              onMouseLeave={e => e.target.style.color = 'var(--text1)'}>{l.label}</span>
          ))}
        </div>
        <button className="btn-primary" onClick={onEnter} style={{ fontSize: 13, padding: '8px 18px' }}>
          Launch Platform →
        </button>
      </nav>

      {/* Hero */}
      <section id="how-it-works" className="hero-section" style={{
        position: 'relative', padding: '110px 40px 90px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        overflow: 'hidden', borderBottom: '1px solid var(--border)'
      }}>
        {/* Subtle dot grid - restrained, not neon */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.5,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 4, padding: '5px 12px', marginBottom: 28,
          color: 'var(--text1)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
          fontFamily: 'var(--mono)'
        }}>
          <span className="pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          POWERED BY BAND OF AGENTS
        </div>

        <h1 style={{
          fontSize: 'clamp(34px,4.5vw,60px)', fontWeight: 700,
          letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8,
          maxWidth: 800,
        }}>
          CyberGuard<span style={{ color: 'var(--accent2)' }}> AI</span>
        </h1>
        <h2 style={{
          fontSize: 'clamp(18px,2.4vw,28px)', fontWeight: 400,
          color: 'var(--text1)', letterSpacing: '-0.01em', marginBottom: 28,
          minHeight: 40, display: 'flex', alignItems: 'center', gap: 2

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
          <button className="btn-ghost" style={{ fontSize: 15, padding: '14px 32px' }}
            onClick={() => document.getElementById('agent-log-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            Watch Agents Collaborate ▶
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24,
          marginTop: 64, width: '100%', maxWidth: 760,
          paddingTop: 32, borderTop: '1px solid var(--border)'
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--text0)', fontFamily: 'var(--mono)', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agent collaboration preview - styled as live ops log */}
      <section id="agent-log-preview" style={{ padding: '56px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 10, overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 18px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--bg3)'
          }}>
            <span style={{ color: 'var(--text1)', fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 600, letterSpacing: '0.03em' }}>
              AGENT ACTIVITY LOG
            </span>
            <span style={{ color: 'var(--text2)', fontSize: 11, fontFamily: 'var(--mono)' }}>
              incident: INC-2024-0147
            </span>
            <span className="pulse" style={{
              marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
              background: 'var(--green)', display: 'inline-block'
            }} />
            <span style={{ color: 'var(--green)', fontSize: 10.5, fontWeight: 700, fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>LIVE</span>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { t: '02:14:31', agent: 'TRIAGE', color: '#3b82f6', msg: 'Analyzing 23 alerts. Identified 4 CRITICAL events. Mass file encryption + C2 beacon detected on WORKSTATION-047. Filtering 8 false positives. Handing off to Threat Intel.' },
              { t: '02:14:48', agent: 'THREAT_INTEL', color: '#6366f1', msg: 'IOC 185.220.101.47 matches known REvil infrastructure (HIGH confidence). MITRE T1486 + T1055. Attribution: Ransomware-as-a-Service operator. Handing off to Root Cause.' },
              { t: '02:15:12', agent: 'ROOT_CAUSE', color: '#d97706', msg: 'Attack chain reconstructed. Initial access: phishing email with malicious macro → PowerShell dropper → Mimikatz → lateral movement via SMB. Patient zero: jsmith on WORKSTATION-047. Dwell time: ~45 min.' },
              { t: '02:15:40', agent: 'RISK', color: '#dc2626', msg: 'Severity Score: 94/100 CRITICAL. Est. business impact: $2.4M–$8.7M. 2,847 files encrypted. GDPR notification required within 72 hours. Handing off to Remediation.' },
            ].map((m, i) => (
              <div key={i} className="log-row" style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                animation: `slideIn 0.4s ease ${i * 0.1}s both`,
                fontFamily: 'var(--mono)'
              }}>
                <span className="log-time" style={{ color: 'var(--text2)', fontSize: 11.5, paddingTop: 2, whiteSpace: 'nowrap' }}>{m.t}</span>
                <span className="log-agent" style={{
                  color: m.color, fontSize: 11, fontWeight: 700,
                  whiteSpace: 'nowrap', paddingTop: 2, minWidth: 90
                }}>{m.agent}</span>
                <span style={{ color: 'var(--text1)', fontSize: 12.5, lineHeight: 1.65, fontFamily: 'var(--font)' }}>{m.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features */}
      <section id="features" style={{ padding: '64px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--accent2)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10 }}>
            INVESTIGATION PIPELINE
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>Six specialized agents, one investigation</h2>
          <p style={{ color: 'var(--text1)', marginTop: 8, fontSize: 14 }}>Each agent owns one phase of incident response and hands off context through Band</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: 'var(--border)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: 'var(--bg2)', padding: 20,
              transition: 'background 0.15s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)' }}>0{i + 1}</span>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>{f.title}</div>
              <div style={{ color: 'var(--text1)', fontSize: 12.5, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '70px 40px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 14 }}>
          Ready to investigate?
        </h2>
        <p style={{ color: 'var(--text1)', fontSize: 14, marginBottom: 32 }}>
          Upload security logs and watch six agents collaborate to protect your organization.
        </p>
        <button className="btn-primary" onClick={onEnter} style={{ fontSize: 14, padding: '12px 28px' }}>
          Launch CyberGuard AI
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--text2)', fontSize: 11.5, fontFamily: 'var(--mono)'
      }}>
        <span>CyberGuard AI — Powered by Band of Agents</span>
        <span>Built for the Band of Agents Hackathon 2026</span>
      </footer>
    </div>
  )
}
