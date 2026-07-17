import type { Nav } from '../../hooks/useNavigation'
import type { InnerTab } from '../../data/types'
import type { Selection } from '../../data/mockData'
import { tabsFor, tabDef, computeMetrics, GRANULARITY_OPTIONS } from '../../data/mockData'
import { Dropdown } from '../shared/Dropdown'
import { InfoDot } from '../shared/InfoDot'
import { MetricChart } from './MetricChart'
import { TableView } from './TableView'

interface Props {
  nav: Nav
  sel: Selection
  onOpenModal: (key: string) => void
}

const TAB_MODAL: Record<InnerTab, string> = {
  effectiveness: 'tab-effectiveness',
  usage: 'tab-usage',
  quality: 'tab-quality',
  health: 'tab-health',
  trust: 'tab-trust',
  voice: 'tab-voice',
  'user-satisfaction': 'tab-user-satisfaction',
}

export function OverviewTab({ nav, sel, onOpenModal }: Props) {
  const { agentType, innerTab, setInnerTab, viewMode, setViewMode, granularity, setGranularity } = nav
  const tabs = tabsFor(agentType)
  const current = tabDef(agentType, innerTab)
  const heading = agentType === 'service' ? 'Agent Performance' : 'Agent Performance Overview'

  return (
    <div className="overview-tab">
      <div className="perf-header">
        <button className="heading-btn section-title" onClick={() => onOpenModal('tab-overview')}>
          {heading}
          <InfoDot modalKey="tab-overview" onOpenModal={onOpenModal} label={heading} />
        </button>
        <div className="perf-controls">
          <div className="perf-control-field">
            <button className="field-label" onClick={() => onOpenModal('granularity')}>Granularity</button>
            <Dropdown value={granularity} options={GRANULARITY_OPTIONS} onChange={setGranularity} width={110} ariaLabel="Granularity" />
          </div>
          <div className="view-toggle-group">
            <div className="view-toggle">
              <button className={viewMode === 'cards' ? 'active' : ''} onClick={() => setViewMode('cards')}>
                {agentType === 'employee' ? 'Metric Cards' : 'Metric Card'}
              </button>
              <button className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')}>Table View</button>
            </div>
            <InfoDot
              modalKey={viewMode === 'cards' ? 'view-cards' : 'view-table'}
              onOpenModal={onOpenModal}
              label={viewMode === 'cards' ? 'Metric Cards View' : 'Table View'}
            />
          </div>
        </div>
      </div>

      <div className="inner-tabs">
        {tabs.map(t => (
          <span className="tab-info-wrap" key={t.id}>
            <button
              className={`inner-tab ${innerTab === t.id ? 'active' : ''}`}
              onClick={() => setInnerTab(t.id)}
            >
              {t.label}
            </button>
            <InfoDot modalKey={TAB_MODAL[t.id]} onOpenModal={onOpenModal} label={t.label} />
          </span>
        ))}
      </div>

      {current?.disabled ? (
        <div className="disabled-state">
          <h3>{current.disabled.title}</h3>
          <p>{current.disabled.body}</p>
          <button className="link-btn" onClick={() => onOpenModal(innerTab === 'trust' ? 'trust-disabled' : 'usersat-disabled')}>
            {current.disabled.cta}
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <TableView sel={sel} onOpenModal={onOpenModal} />
      ) : (
        <CardsView nav={nav} sel={sel} onOpenModal={onOpenModal} />
      )}
    </div>
  )
}

function CardsView({ nav, sel, onOpenModal }: Props) {
  const { agentType, innerTab, subMetric, setSubMetric, granularity } = nav
  const current = tabDef(agentType, innerTab)
  const metrics = current?.metrics ?? []
  const computed = computeMetrics(sel, metrics)
  const selectedDef = metrics.find(m => m.key === subMetric) ?? metrics[0]

  return (
    <div className="cards-view">
      <div className="cards-view-head">
        <button className="heading-btn aggregated-title" onClick={() => onOpenModal(TAB_MODAL[innerTab])}>
          {current?.heading}
          <InfoDot modalKey={TAB_MODAL[innerTab]} onOpenModal={onOpenModal} label={current?.heading} />
        </button>
        {metrics.length > 1 && (
          <div className="submetric-group">
            <div className="submetric-toggle">
              {metrics.map(m => (
                <button
                  key={m.key}
                  className={`submetric ${subMetric === m.key ? 'active' : ''}`}
                  onClick={() => setSubMetric(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {selectedDef && (
              <InfoDot modalKey={selectedDef.modalKey} onOpenModal={onOpenModal} label={selectedDef.label} />
            )}
          </div>
        )}
      </div>

      <div className="cards-chart-grid">
        <div className="metric-cards">
          {computed.map(c => (
            <button key={c.def.key} className="metric-card" onClick={() => onOpenModal(c.def.modalKey)}>
              <div className="metric-card-label">{c.def.label}</div>
              <div className="metric-card-value">{c.value}</div>
              <div className={`metric-card-delta ${c.deltaType}`}>{c.delta}</div>
            </button>
          ))}
        </div>
        {selectedDef && <MetricChart sel={sel} metric={selectedDef} granularity={granularity} onOpenModal={onOpenModal} />}
      </div>
    </div>
  )
}
