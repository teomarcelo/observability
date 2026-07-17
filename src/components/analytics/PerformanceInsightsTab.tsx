import type { Nav } from '../../hooks/useNavigation'
import type { PerfBreakdown } from '../../data/types'
import { computeBreakdown, PERF_METRIC_OPTIONS, PERF_BREAKDOWN_LABELS } from '../../data/mockData'
import { Dropdown } from '../shared/Dropdown'
import { InfoDot } from '../shared/InfoDot'

interface Props {
  nav: Nav
  onOpenModal: (key: string) => void
}

const BREAKDOWNS: PerfBreakdown[] = ['subagents', 'intents', 'actions']

export function PerformanceInsightsTab({ nav, onOpenModal }: Props) {
  const { perfBreakdown, setPerfBreakdown, perfSelectItem, setPerfSelectItem, perfMetric, setPerfMetric, perfItems } = nav
  const labels = PERF_BREAKDOWN_LABELS[perfBreakdown]
  const rows = computeBreakdown(perfBreakdown, perfSelectItem, perfMetric)
  const max = Math.max(1, ...rows.map(r => r.value))
  const scoreMode = perfMetric === 'Average Quality Score'

  // group rows by agentName for the table layout (Agent Name spans its items)
  const grouped: { agent: string; items: typeof rows }[] = []
  for (const r of rows) {
    let g = grouped.find(x => x.agent === r.agentName)
    if (!g) { g = { agent: r.agentName, items: [] }; grouped.push(g) }
    g.items.push(r)
  }

  return (
    <div className="perf-insights">
      <div className="perf-header">
        <button className="heading-btn section-title" onClick={() => onOpenModal('perf-breakdowns')}>
          Breakdowns
          <InfoDot modalKey="perf-breakdowns" onOpenModal={onOpenModal} label="Breakdowns" />
        </button>
        <div className="view-toggle-group">
          <div className="view-toggle wide">
            {BREAKDOWNS.map(bd => (
              <button
                key={bd}
                className={perfBreakdown === bd ? 'active' : ''}
                onClick={() => setPerfBreakdown(bd)}
              >
                {PERF_BREAKDOWN_LABELS[bd].toggle}
              </button>
            ))}
          </div>
          <InfoDot modalKey={`perf-${perfBreakdown}`} onOpenModal={onOpenModal} label={PERF_BREAKDOWN_LABELS[perfBreakdown].toggle} />
        </div>
      </div>

      <div className="perf-card">
        <button className="perf-explore" onClick={() => onOpenModal(`perf-${perfBreakdown}`)}>
          {labels.explore}
        </button>
        <div className="perf-selects">
          <div className="perf-field">
            <button className="field-label" onClick={() => onOpenModal('perf-select-item')}>{labels.select}</button>
            <Dropdown value={perfSelectItem} options={perfItems} onChange={setPerfSelectItem} width={260} ariaLabel={labels.select} />
          </div>
          <div className="perf-field">
            <button className="field-label" onClick={() => onOpenModal('perf-select-metric')}>Select Metric</button>
            <Dropdown value={perfMetric} options={PERF_METRIC_OPTIONS} onChange={setPerfMetric} width={260} ariaLabel="Select Metric" />
          </div>
        </div>

        <div className="breakdown-table">
          <div className="bt-head">
            <div className="bt-agent">Agent Name</div>
            <div className="bt-label">{labels.col}</div>
            <div className="bt-bar">{perfMetric}</div>
          </div>
          {grouped.map(g => (
            <div className="bt-group" key={g.agent}>
              {g.items.map((r, i) => (
                <div className="bt-row" key={r.label}>
                  <div className="bt-agent">{i === 0 ? g.agent : ''}</div>
                  <button className="bt-label link" onClick={() => onOpenModal(`perf-${perfBreakdown}`)}>{r.label}</button>
                  <div className="bt-bar">
                    <div className="bar" style={{ width: `${(r.value / max) * 100}%` }}>
                      <span className="bar-value">{scoreMode ? r.value.toFixed(1) : r.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {rows.length === 0 && <div className="bt-empty">No results to show</div>}
        </div>
      </div>
    </div>
  )
}
