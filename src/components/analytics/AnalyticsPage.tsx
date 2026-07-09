import { useState } from 'react'
import type { AgentType, AnalyticsTab, InnerTab, PerfBreakdown } from '../../data/types'
import { OverviewTab } from './OverviewTab'
import { PerformanceInsightsTab } from './PerformanceInsightsTab'
import { TableView } from './TableView'

type ViewMode = 'cards' | 'table'

interface Props {
  agentType: AgentType
  onAgentTypeChange: (t: AgentType) => void
  analyticsTab: AnalyticsTab
  onAnalyticsTabChange: (t: AnalyticsTab) => void
  innerTab: InnerTab
  onInnerTabChange: (t: InnerTab) => void
  perfBreakdown: PerfBreakdown
  onPerfBreakdownChange: (b: PerfBreakdown) => void
  onOpenModal: (key: string) => void
}

export function AnalyticsPage({
  agentType, onAgentTypeChange,
  analyticsTab, onAnalyticsTabChange,
  innerTab, onInnerTabChange,
  perfBreakdown, onPerfBreakdownChange,
  onOpenModal,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('cards')

  const innerTabs: { key: InnerTab; label: string }[] = agentType === 'service'
    ? [
        { key: 'effectiveness', label: 'Effectiveness' },
        { key: 'usage', label: 'Usage' },
        { key: 'quality', label: 'Quality' },
        { key: 'health', label: 'Health' },
        { key: 'trust', label: 'Trust' },
        { key: 'voice', label: 'Voice' },
      ]
    : [
        { key: 'effectiveness', label: 'Effectiveness' },
        { key: 'usage', label: 'Usage' },
        { key: 'user-satisfaction', label: 'User Satisfaction' },
        { key: 'quality', label: 'Quality' },
        { key: 'health', label: 'Health' },
        { key: 'trust', label: 'Trust' },
      ]

  return (
    <>
      {/* Analytics Header */}
      <div className="analytics-header">
        <div className="analytics-title">
          <span>&#x1F4C8;</span>
          <span>Agent Analytics</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Agent Type</span>
          <select
            className="agent-type-select"
            value={agentType}
            onChange={e => onAgentTypeChange(e.target.value as AgentType)}
          >
            <option value="service">Service Agent</option>
            <option value="employee">Employee Agent</option>
          </select>
        </div>
        <button className="help-btn">&#x1F4CA; Agent Analytics Help</button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <span style={{ fontWeight: 600, fontSize: 13, color: '#555' }}>Filter by:</span>
        <span>
          <label>Agent:</label>
          <select>
            <option>All</option>
            <option>VariableManagement</option>
            <option>RAG Agent</option>
            <option>HelloWorld Agent</option>
            <option>Pronto Service Agent</option>
            <option>NOT_SET</option>
          </select>
        </span>
        <span>
          <label>Timeframe:</label>
          <select>
            <option>Last 30 Days</option>
            <option>All</option>
            <option>Custom</option>
            <option disabled>── Calendar Year ──</option>
            <option>Current Year</option>
            <option>Previous Year</option>
            <option>Next Year</option>
            <option>Current Year to Date</option>
            <option>Previous Year to Date</option>
            <option disabled>── Calendar Quarter ──</option>
            <option>Current Quarter</option>
            <option>Previous Quarter</option>
            <option>Next Quarter</option>
            <option>Current Quarter to Date</option>
            <option>Previous Quarter to Date</option>
            <option disabled>── Calendar Month ──</option>
            <option>Current Month</option>
            <option>Previous Month</option>
            <option>Next Month</option>
            <option>Current Month to Date</option>
            <option>Previous Month to Date</option>
            <option disabled>── Last ──</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 60 Days</option>
            <option>Last 90 Days</option>
            <option>Last 120 Days</option>
          </select>
        </span>
        <span>
          <label>Channel:</label>
          <select>
            <option>All</option>
            <option>Builder</option>
          </select>
        </span>
      </div>

      {/* Top bar */}
      <div className="topbar">
        <div className="title">Agent Performance Overview</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <select className="granularity-select">
            <option>Day</option>
            <option>Week</option>
            <option>Month</option>
            <option>Year</option>
          </select>
          <div className="btn-group">
            <button className={viewMode === 'cards' ? 'active' : ''} onClick={() => setViewMode('cards')}>Metric Cards</button>
            <button className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')}>Table View</button>
          </div>
        </div>
      </div>

      {/* Tab nav: Overview | Performance Insights */}
      <div className="tab-nav">
        <button
          className={analyticsTab === 'overview' ? 'active' : ''}
          onClick={() => onAnalyticsTabChange('overview')}
        >
          Overview
        </button>
        <button
          className={analyticsTab === 'performance-insights' ? 'active' : ''}
          onClick={() => onAnalyticsTabChange('performance-insights')}
        >
          Performance Insights
        </button>
      </div>

      {/* Inner tab nav (only for Overview) */}
      {analyticsTab === 'overview' && (
        <div className="inner-tab-nav">
          {innerTabs.map(t => (
            <button
              key={t.key}
              className={innerTab === t.key ? 'active' : ''}
              onClick={() => onInnerTabChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {analyticsTab === 'overview' && viewMode === 'cards' && (
        <OverviewTab
          agentType={agentType}
          innerTab={innerTab}
          onOpenModal={onOpenModal}
        />
      )}
      {analyticsTab === 'overview' && viewMode === 'table' && (
        <TableView agentType={agentType} innerTab={innerTab} />
      )}
      {analyticsTab === 'performance-insights' && (
        <PerformanceInsightsTab
          breakdown={perfBreakdown}
          onBreakdownChange={onPerfBreakdownChange}
        />
      )}
    </>
  )
}
