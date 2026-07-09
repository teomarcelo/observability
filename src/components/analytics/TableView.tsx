import type { AgentType, InnerTab, Metric } from '../../data/types'
import {
  saEffectivenessMetrics, saUsageMetrics, saQualityMetrics, saHealthMetrics, saTrustMetrics, saVoiceMetrics,
  eaEffectivenessMetrics, eaUsageMetrics, eaSatisfactionMetrics,
} from '../../data/mockData'

interface Props {
  agentType: AgentType
  innerTab: InnerTab
}

function getMetrics(agentType: AgentType, tab: InnerTab): Metric[] {
  if (agentType === 'service') {
    switch (tab) {
      case 'effectiveness': return saEffectivenessMetrics
      case 'usage': return saUsageMetrics
      case 'quality': return saQualityMetrics
      case 'health': return saHealthMetrics
      case 'trust': return saTrustMetrics
      case 'voice': return saVoiceMetrics
      default: return saEffectivenessMetrics
    }
  } else {
    switch (tab) {
      case 'effectiveness': return eaEffectivenessMetrics
      case 'usage': return eaUsageMetrics
      case 'user-satisfaction': return eaSatisfactionMetrics
      case 'quality': return saQualityMetrics
      case 'health': return saHealthMetrics
      case 'trust': return saTrustMetrics
      default: return eaEffectivenessMetrics
    }
  }
}

export function TableView({ agentType, innerTab }: Props) {
  const metrics = getMetrics(agentType, innerTab)

  return (
    <div className="tab-panel">
      <table className="scorers-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Current Value</th>
            <th>Change vs. Prior Period</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(m => (
            <tr key={m.label}>
              <td style={{ fontWeight: 600 }}>{m.label}</td>
              <td style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-navy)' }}>{m.value}</td>
              <td>
                <span className={m.deltaType === 'good' ? 'delta-good' : 'delta-bad'}>
                  {m.delta}
                </span>
              </td>
              <td>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  background: m.deltaType === 'good' ? '#d4edda' : '#fde8e8',
                  color: m.deltaType === 'good' ? '#1a7a40' : '#c0392b',
                }}>
                  {m.deltaType === 'good' ? 'Improving' : 'Declining'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
