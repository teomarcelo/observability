import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import type { AgentType, InnerTab, Metric } from '../../data/types'
import {
  saEffectivenessMetrics, saUsageMetrics, saQualityMetrics, saHealthMetrics, saTrustMetrics, saVoiceMetrics,
  eaEffectivenessMetrics, eaUsageMetrics, eaSatisfactionMetrics,
  chartDataMap, sessionOutcomeData, usageChartData, qualityChartData, latencyChartData,
} from '../../data/mockData'

interface Props {
  agentType: AgentType
  innerTab: InnerTab
  onOpenModal: (key: string) => void
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

function getChartToggles(tab: InnerTab): string[] {
  switch (tab) {
    case 'effectiveness': return ['Deflection Rate', 'Escalation Rate', 'Abandonment Rate', 'Engagement Rate', 'Success Rate']
    case 'usage': return ['Total Sessions']
    case 'quality': return ['Quality Score']
    case 'health': return ['Latency']
    default: return ['Deflection Rate']
  }
}

function getChartData(tab: InnerTab, activeToggle: string) {
  if (tab === 'usage') return usageChartData
  if (tab === 'quality') return qualityChartData
  if (tab === 'health') return latencyChartData
  return chartDataMap[activeToggle] || chartDataMap['Deflection Rate']
}

function getPanelTitle(tab: InnerTab): string {
  switch (tab) {
    case 'effectiveness': return 'Aggregated Effectiveness Metrics'
    case 'usage': return 'Usage Metrics'
    case 'quality': return 'Quality Metrics'
    case 'health': return 'Health & Performance Metrics'
    case 'trust': return 'Trust & Safety Metrics'
    case 'voice': return 'Voice Channel Metrics'
    case 'user-satisfaction': return 'User Satisfaction Metrics'
    default: return 'Metrics'
  }
}

export function OverviewTab({ agentType, innerTab, onOpenModal }: Props) {
  const metrics = getMetrics(agentType, innerTab)
  const toggles = getChartToggles(innerTab)
  const [activeToggle, setActiveToggle] = useState(toggles[0])
  const chartData = getChartData(innerTab, activeToggle)

  return (
    <div className="tab-panel">
      <div className="panel-title">{getPanelTitle(innerTab)}</div>
      <div className="panel-body">
        {/* Metrics Column */}
        <div className="metrics">
          {metrics.map(m => (
            <div key={m.label} className="metric" onClick={() => onOpenModal(m.modalKey)}>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">{m.value}</div>
              <div className={`metric-delta ${m.deltaType === 'good' ? 'delta-good' : 'delta-bad'}`}>
                {m.delta}
              </div>
              <div className="metric-hint">Click to learn more</div>
            </div>
          ))}
        </div>

        {/* Chart Column */}
        <div className="chart-area">
          {toggles.length > 1 && (
            <div className="chart-toggles">
              {toggles.map(t => (
                <button
                  key={t}
                  className={activeToggle === t ? 'active' : ''}
                  onClick={() => setActiveToggle(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <div className="chart-title">Timeframe</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0070D2" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Session Outcome section (only for effectiveness) */}
      {innerTab === 'effectiveness' && (
        <div className="section-divider">
          <div className="section-header">
            <h3>Session Outcome Distribution</h3>
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionOutcomeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="resolved" stackId="a" fill="#1a7a40" name="Resolved" />
                <Bar dataKey="escalated" stackId="a" fill="#e67e22" name="Escalated" />
                <Bar dataKey="abandoned" stackId="a" fill="#c0392b" name="Abandoned" />
                <Bar dataKey="pending" stackId="a" fill="#95a5a6" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
