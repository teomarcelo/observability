import type { Nav } from '../../hooks/useNavigation'
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
}

export function SessionsPage({ nav, onOpenModal }: Props) {
  const { sessionTab, setSessionTab } = nav
  const rows = sessionTab === 'processed' ? processedSessions : unprocessedSessions

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
          <button className="help-btn" onClick={() => onOpenModal('sessions-saved-view')}>New Saved View</button>
          <button className="help-btn" onClick={() => onOpenModal('sessions-evaluations')}>Evaluations</button>
          <button className="help-btn" onClick={() => onOpenModal('sessions-help')}>&#128218; Sessions &amp; Intents Help</button>
        </div>
      </div>

      <div className="filter-bar">
        <span className="filter-by">Filter by:</span>
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
              <tr key={r.id} onClick={() => onOpenModal(sessionTab === 'processed' ? 'sessions-processed' : 'sessions-unprocessed')}>
                <td className="chk"><input type="checkbox" aria-label={`Select ${r.id}`} onClick={e => e.stopPropagation()} /></td>
                <td className="mono">{r.id}</td>
                <td>{r.timestamp}</td>
                <td>{r.duration}</td>
                <td><span className={`outcome ${r.outcomeLevel}`}>{r.outcome}</span></td>
                <td className="truncate">{r.initialMessage}</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
              </tr>
            ))}
          </tbody>
        </table>
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
