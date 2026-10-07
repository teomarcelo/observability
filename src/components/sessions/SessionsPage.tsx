import { useState } from 'react'
import type { Nav } from '../../hooks/useNavigation'
import type { SessionRow } from '../../data/types'
import {
  AGENT_FILTER_OPTIONS, TIMEFRAME_OPTIONS, CHANNEL_OPTIONS, MODALITY_OPTIONS,
  SESSION_COLUMNS, processedSessions, unprocessedSessions,
} from '../../data/mockData'
import { Dropdown } from '../shared/Dropdown'
import { InfoDot } from '../shared/InfoDot'

interface Props {
  nav: Nav
  onOpenModal: (key: string) => void
}

const COL_MODAL: Record<string, string> = {
  'Session ID': 'col-session-id',
  'Timestamp': 'col-timestamp',
  'Session Duration': 'col-session-duration',
  'Session Outcome': 'col-session-outcome',
  'Initial User Messages': 'col-initial-messages',
  'Initial Agent Responses': 'col-initial-agent-responses',
  'Subagents': 'col-subagents',
  'Actions': 'col-actions',
  'Sources': 'col-sources',
  'Errors': 'col-errors',
}

const DRILL_ACTIONS: { label: string; modal: string }[] = [
  { label: 'Session Overview', modal: 'session-overview' },
  { label: 'Session Log', modal: 'session-log' },
  { label: 'Session Flow', modal: 'session-flow' },
  { label: 'Agent message / trace', modal: 'session-trace' },
  { label: 'Number of Interactions', modal: 'session-num-interactions' },
  { label: 'Average Interaction Duration', modal: 'session-avg-interaction-duration' },
  { label: 'Previous / Next Session', modal: 'session-prev-next' },
  { label: 'Evaluations / Submit Feedback', modal: 'session-submit-feedback' },
  { label: 'Agent Manager Feedback', modal: 'session-agent-manager-feedback' },
  { label: 'Processing banner', modal: 'session-drill-processing' },
  { label: 'Learn More', modal: 'session-drill-learn-more' },
]

export function SessionsPage({ nav, onOpenModal }: Props) {
  const { sessionTab, setSessionTab } = nav
  const rows = sessionTab === 'processed' ? processedSessions : unprocessedSessions
  const [selected, setSelected] = useState<SessionRow | null>(null)

  return (
    <div className="sessions-page">
      <div className="page-head">
        <div className="page-head-left">
          <div className="page-icon blue" aria-hidden>&#128462;</div>
          <h1 className="page-title">Sessions &amp; Intents</h1>
          <button className="info-dot" onClick={() => onOpenModal('sessions-page')} aria-label="About Sessions & Intents">&#9432;</button>
        </div>
        <div className="page-head-actions">
          <button className="help-btn" onClick={() => onOpenModal('sessions-saved-view')}>Default View</button>
          <button className="help-btn" onClick={() => onOpenModal('sessions-saved-view')}>Select saved view</button>
          <button className="help-btn" onClick={() => onOpenModal('sessions-saved-view')}>Pin this view as your default</button>
          <button className="help-btn" onClick={() => onOpenModal('sessions-saved-view')}>New Saved View</button>
          <button className="help-btn" onClick={() => onOpenModal('sessions-saved-view')}>More view actions</button>
          <button className="help-btn" onClick={() => onOpenModal('sessions-evaluations')}>Evaluations</button>
          <button className="help-btn" onClick={() => onOpenModal('insights-absent')}>Insights (EG note)</button>
          <button className="help-btn" onClick={() => onOpenModal('sessions-help')}>&#128218; Sessions &amp; Intents Help</button>
        </div>
      </div>

      <div className="filter-bar">
        <button type="button" className="filter-by linkish" onClick={() => onOpenModal('filter-by')}>Filter by:</button>
        <Field label="Agent" modal="filter-agent" value={nav.agent} options={AGENT_FILTER_OPTIONS} onChange={nav.setAgent} onOpenModal={onOpenModal} />
        <Field label="Timeframe" modal="filter-timeframe" value={nav.timeframe} options={TIMEFRAME_OPTIONS} onChange={nav.setTimeframe} onOpenModal={onOpenModal} />
        <Field label="Channel" modal="filter-channel" value={nav.channel} options={CHANNEL_OPTIONS} onChange={nav.setChannel} onOpenModal={onOpenModal} />
        <Field label="Modality" modal="filter-modality" value={nav.modality} options={MODALITY_OPTIONS} onChange={nav.setModality} onOpenModal={onOpenModal} />
      </div>

      <div className="panel">
        <div className="inner-tabs pad">
          <span className="tab-info-wrap">
            <button className={`inner-tab ${sessionTab === 'processed' ? 'active' : ''}`} onClick={() => setSessionTab('processed')}>Processed Sessions</button>
            <InfoDot modalKey="sessions-processed" onOpenModal={onOpenModal} label="Processed Sessions" />
          </span>
          <span className="tab-info-wrap">
            <button className={`inner-tab ${sessionTab === 'unprocessed' ? 'active' : ''}`} onClick={() => setSessionTab('unprocessed')}>Unprocessed Sessions</button>
            <InfoDot modalKey="sessions-unprocessed" onOpenModal={onOpenModal} label="Unprocessed Sessions" />
          </span>
        </div>

        {sessionTab === 'processed' && (
          <button type="button" className="sessions-banner" onClick={() => onOpenModal('sessions-processing-banner')}>
            Processing latest sessions. Insights aren&apos;t ready yet for your latest sessions. Raw data is available now in the Unprocessed Sessions tab.
          </button>
        )}

        <div className="table-toolbar">
          <button type="button" className="help-btn" onClick={() => onOpenModal('sessions-search')}>Search this table</button>
          <button type="button" className="help-btn" onClick={() => onOpenModal('sessions-refresh')}>Refresh</button>
          <button type="button" className="help-btn" onClick={() => onOpenModal('sessions-select-fields')}>Select Fields to Display</button>
          <button type="button" className="help-btn" onClick={() => onOpenModal('sessions-filter-btn')}>Filter</button>
          <button type="button" className="help-btn" onClick={() => onOpenModal('sessions-download-csv')}>Download CSV</button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th className="chk"><input type="checkbox" aria-label="Select all" /></th>
              {SESSION_COLUMNS.map(c => (
                <th key={c}><button className="col-btn" onClick={() => onOpenModal(COL_MODAL[c])}>{c}</button></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr
                key={r.id}
                className={selected?.id === r.id ? 'selected-row' : undefined}
                onClick={() => {
                  setSelected(r)
                  onOpenModal('session-overview')
                }}
              >
                <td className="chk"><input type="checkbox" aria-label={`Select ${r.id}`} onClick={e => e.stopPropagation()} /></td>
                <td className="mono">{r.id}</td>
                <td>{r.timestamp}</td>
                <td>{r.duration}</td>
                <td><span className={`outcome ${r.outcomeLevel}`}>{r.outcome}</span></td>
                <td className="truncate">{r.initialMessage}</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
              </tr>
            ))}
          </tbody>
        </table>

        {selected && (
          <div className="session-drill">
            <div className="session-drill-head">
              Session detail: <span className="mono">{selected.id}</span>
            </div>
            <div className="session-drill-actions">
              {DRILL_ACTIONS.map(a => (
                <button key={a.modal} type="button" className="help-btn" onClick={() => onOpenModal(a.modal)}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface FieldProps { label: string; modal: string; value: string; options: string[]; onChange: (v: string) => void; onOpenModal: (k: string) => void }
function Field({ label, modal, value, options, onChange, onOpenModal }: FieldProps) {
  return (
    <div className="filter-field">
      <button className="field-label" onClick={() => onOpenModal(modal)}>{label}</button>
      <Dropdown value={value} options={options} onChange={onChange} width={150} ariaLabel={label} />
    </div>
  )
}
