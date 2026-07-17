import type { Nav } from '../../hooks/useNavigation'
import type { AgentType } from '../../data/types'
import type { Selection } from '../../data/mockData'
import {
  AGENT_FILTER_OPTIONS, TIMEFRAME_OPTIONS, CHANNEL_OPTIONS, MODALITY_OPTIONS,
} from '../../data/mockData'
import { Dropdown } from '../shared/Dropdown'
import { InfoDot } from '../shared/InfoDot'
import { OverviewTab } from './OverviewTab'
import { PerformanceInsightsTab } from './PerformanceInsightsTab'

interface Props {
  nav: Nav
  onOpenModal: (key: string) => void
}

const AGENT_TYPE_OPTIONS = ['Service Agent', 'Employee Agent']

export function AnalyticsPage({ nav, onOpenModal }: Props) {
  const { agentType, setAgentType, analyticsTab, setAnalyticsTab } = nav
  const isService = agentType === 'service'
  const title = isService ? 'Service Agent Analytics' : 'Employee Agent Analytics'

  const sel: Selection = {
    agentType, agent: nav.agent, timeframe: nav.timeframe, channel: nav.channel, modality: nav.modality,
  }

  return (
    <div className="analytics-page">
      <div className="page-head">
        <div className="page-head-left">
          <div className="page-icon" aria-hidden>&#128202;</div>
          <div>
            <div className="page-eyebrow">Agent Analytics</div>
            <h1 className="page-title">{title}</h1>
          </div>
          <div className="agent-type">
            <button className="field-label" onClick={() => onOpenModal('agent-type')}>Agent Type</button>
            <Dropdown
              value={isService ? 'Service Agent' : 'Employee Agent'}
              options={AGENT_TYPE_OPTIONS}
              onChange={v => setAgentType((v === 'Service Agent' ? 'service' : 'employee') as AgentType)}
              width={180}
              ariaLabel="Agent Type"
            />
          </div>
        </div>
        <button className="help-btn" onClick={() => onOpenModal('agent-analytics-help')}>
          &#128218; Agent Analytics Help
        </button>
      </div>

      <div className="filter-bar">
        <span className="filter-by">Filter by:</span>
        <Field label="Agent" modal="filter-agent" value={nav.agent} options={AGENT_FILTER_OPTIONS} onChange={nav.setAgent} onOpenModal={onOpenModal} />
        <Field label="Timeframe" modal="filter-timeframe" value={nav.timeframe} options={TIMEFRAME_OPTIONS} onChange={nav.setTimeframe} onOpenModal={onOpenModal} />
        <Field label="Channel" modal="filter-channel" value={nav.channel} options={CHANNEL_OPTIONS} onChange={nav.setChannel} onOpenModal={onOpenModal} />
        {isService && (
          <Field label="Modality" modal="filter-modality" value={nav.modality} options={MODALITY_OPTIONS} onChange={nav.setModality} onOpenModal={onOpenModal} />
        )}
      </div>

      <div className="analytics-tabs">
        <span className="tab-info-wrap">
          <button className={`atab ${analyticsTab === 'overview' ? 'active' : ''}`} onClick={() => setAnalyticsTab('overview')}>Overview</button>
          <InfoDot modalKey="tab-overview" onOpenModal={onOpenModal} label="Overview" />
        </span>
        <span className="tab-info-wrap">
          <button className={`atab ${analyticsTab === 'performance-insights' ? 'active' : ''}`} onClick={() => setAnalyticsTab('performance-insights')}>Performance Insights</button>
          <InfoDot modalKey="tab-performance-insights" onOpenModal={onOpenModal} label="Performance Insights" />
        </span>
      </div>

      <div className="analytics-body">
        {analyticsTab === 'overview'
          ? <OverviewTab nav={nav} sel={sel} onOpenModal={onOpenModal} />
          : <PerformanceInsightsTab nav={nav} onOpenModal={onOpenModal} />}
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  modal: string
  value: string
  options: string[]
  onChange: (v: string) => void
  onOpenModal: (key: string) => void
}

function Field({ label, modal, value, options, onChange, onOpenModal }: FieldProps) {
  return (
    <div className="filter-field">
      <button className="field-label" onClick={() => onOpenModal(modal)}>{label}</button>
      <Dropdown value={value} options={options} onChange={onChange} width={150} ariaLabel={label} />
    </div>
  )
}
