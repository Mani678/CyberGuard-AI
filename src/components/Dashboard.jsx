import React from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

function RiskGauge({ score }) {
  const color = score >= 80 ? '#ef4444' : score >= 60 ? '#f97316' : score >= 40 ? '#f59e0b' : '#10b981'
  const label = score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW'

  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius={50} outerRadius={75}
          startAngle={180} endAngle={-180} data={[
            { value: 100, fill: '#1c2535' },
            { value: score, fill: color }
          ]}>
          <RadialBar dataKey="value" cornerRadius={8} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'var(--mono)', lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon, sub }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: color || 'var(--text0)', fontFamily: 'var(--mono)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text2)' }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard({ findings, incident, agentStatuses }) {
  const riskScore = findings?.riskAssessment?.severity_score || 0
  const triageData = findings?.triage
  const riskData = findings?.riskAssessment
  const remediationData = findings?.remediation

  const priorityData = triageData ? [
    { name: 'Critical', value: triageData.priority_count?.critical || 0, color: '#ef4444' },
    { name: 'High', value: triageData.priority_count?.high || 0, color: '#f97316' },
    { name: 'Medium', value: triageData.priority_count?.medium || 0, color: '#f59e0b' },
    { name: 'Low', value: triageData.priority_count?.low || 0, color: '#10b981' },
  ].filter(d => d.value > 0) : []

  const completedAgents = Object.values(agentStatuses).filter(s => s === 'complete').length
  const totalAgents = 6

  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%' }}>
      {/* Incident header */}
      {incident && (
        <div style={{
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 20,
          borderLeft: `4px solid ${incident.severity === 'CRITICAL' ? '#ef4444' : incident.severity === 'HIGH' ? '#f97316' : '#f59e0b'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Active Incident
              </div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{incident.title}</div>
              <div style={{ color: 'var(--text1)', fontSize: 13, marginTop: 4 }}>{incident.description}</div>
            </div>
            <span className={`badge badge-${incident.severity?.toLowerCase()}`}>{incident.severity}</span>
          </div>

          {/* Agent progress bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: 'var(--text2)' }}>
              <span>Investigation Progress</span>
              <span>{completedAgents}/{totalAgents} agents complete</span>
            </div>
            <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${(completedAgents / totalAgents) * 100}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--green))',
                borderRadius: 2, transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Risk score + stats */}
      {riskScore > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div className="card" style={{ gridRow: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Risk Score</div>
            <RiskGauge score={riskScore} />
            <div style={{ fontSize: 11, color: 'var(--text2)', textAlign: 'center' }}>
              {riskData?.severity_level} severity
            </div>
          </div>
          <StatCard label="Affected Assets" icon="🖥️"
            value={riskData?.affected_assets?.length || '—'}
            color="#f97316"
            sub={riskData?.data_exposure?.types?.join(', ')} />
          <StatCard label="Estimated Loss" icon="💰"
            value={riskData?.business_impact?.estimated_loss || '—'}
            color="#ef4444"
            sub="business impact range" />
        </div>
      )}

      {/* Priority breakdown */}
      {priorityData.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 16, color: 'var(--text1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Alert Priority Breakdown
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 100, height: 100, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} dataKey="value" paddingAngle={2}>
                    {priorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {priorityData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: d.color }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MITRE ATT&CK */}
      {findings?.threatIntel?.mitre_ttps?.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: 'var(--text1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            MITRE ATT&CK Techniques
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {findings.threatIntel.mitre_ttps.slice(0, 4).map((ttp, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '8px 10px', borderRadius: 8,
                background: 'var(--bg3)', border: '1px solid var(--border)'
              }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                  color: 'var(--purple)', background: 'var(--purple-dim)',
                  padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1
                }}>{ttp.id}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{ttp.technique}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{ttp.tactic}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remediation timeline */}
      {remediationData?.timeline && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: 'var(--text1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Remediation Timeline
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(remediationData.timeline).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'capitalize' }}>{key}</span>
                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 600, color: key === 'total' ? 'var(--accent)' : 'var(--text0)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top threat */}
      {triageData?.top_threat && (
        <div style={{
          padding: '12px 16px', borderRadius: 8,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          fontSize: 12, color: 'var(--text1)', lineHeight: 1.6
        }}>
          <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 4, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚠ Top Threat</div>
          {triageData.top_threat}
        </div>
      )}
    </div>
  )
}
