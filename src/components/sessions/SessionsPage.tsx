import { useMemo, useState } from 'react'
import type { Nav } from '../../hooks/useNavigation'
import type { SessionRow } from '../../data/types'
import {
  AGENT_FILTER_OPTIONS, TIMEFRAME_OPTIONS, CHANNEL_OPTIONS, MODALITY_OPTIONS,
  SESSION_COLUMNS, SESSION_AVAILABLE_COLUMNS, processedSessions, unprocessedSessions,
} from '../../data/mockData'
import { Dropdown } from '../shared/Dropdown'
import { SelectFieldsModal } from './SelectFieldsModal'

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
  { label: 'Learn More', modal: 'session-drill-learn-more' },
]

function cellFor(row: SessionRow, col: string): string {
  switch (col) {
    case 'Session ID': return row.id
    case 'Timestamp': return row.timestamp
    case 'Session Duration': return row.duration
    case 'Session Outcome': return row.outcome
    case 'Initial User Messages': return row.initialMessage || ''
    case 'Initial Agent Responses': return row.initialAgentResponse || ''
    case 'Subagents': return row.subagents || ''
    case 'Actions': return row.actions || ''
    default: return ''
  }
}

export function SessionsPage({ nav, onOpenModal }: Props) {
  const { sessionTab, setSessionTab } = nav
  const rows = sessionTab === 'processed' ? processedSessions : unprocessedSessions
  const [selected, setSelected] = useState<SessionRow | null>(null)
  const [columns, setColumns] = useState<string[]>(SESSION_COLUMNS)
  const [fieldsOpen, setFieldsOpen] = useState(false)
  const [search, setSearch] = useState('')
  // Org Sessions defaults (independent of Analytics Last 30 Days / All).
  const [agent, setAgent] = useState('Service Employee Agent')
  const [timeframe, setTimeframe] = useState('Last 7 Days')
  const [channel, setChannel] = useState('All')
  const [modality, setModality] = useState('All')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r =>
      r.id.toLowerCase().includes(q)
      || r.initialMessage.toLowerCase().includes(q)
      || r.outcome.toLowerCase().includes(q),
    )
  }, [rows, search])

  const countLabel = sessionTab === 'processed'
    ? `${filtered.length} processed sessions`
    : `${filtered.length} unprocessed sessions`

  return (
    <div className="sessions-page">
      <div className="sf-list-head">
        <div className="sf-list-head-left">
          <button
            type="button"
            className="sf-list-title"
            aria-label="Select saved view"
            onClick={() => onOpenModal('sessions-saved-view')}
          >
            <span className="sf-list-title-icon" aria-hidden>&#128196;</span>
            <span>Sessions &amp; Intents</span>
            <span className="sf-list-caret" aria-hidden>&#9662;</span>
          </button>
          <button
            type="button"
            className="sf-icon-btn"
            title="Pin this view as your default"
            aria-label="Pin this view as your default"
            onClick={() => onOpenModal('sessions-saved-view')}
          >
            &#128204;
          </button>
          <button
            type="button"
            className="sf-view-pill"
            onClick={() => onOpenModal('sessions-saved-view')}
          >
            Default View
            <span className="sf-view-edit" aria-hidden>&#9998;</span>
          </button>
        </div>
        <div className="sf-list-head-right">
          <button type="button" className="sf-btn" onClick={() => onOpenModal('sessions-saved-view')}>
            New Saved View <span className="sf-list-caret">&#9662;</span>
          </button>
          <button
            type="button"
            className="sf-icon-btn"
            title="More view actions"
            aria-label="More view actions"
            onClick={() => onOpenModal('sessions-saved-view')}
          >
            &#8943;
          </button>
          <button type="button" className="sf-btn" onClick={() => onOpenModal('sessions-help')}>
            Sessions &amp; Intents Help
          </button>
        </div>
      </div>

      <div className="filter-bar sf-filter-bar">
        <span className="filter-by">Filter by:</span>
        <Field label="Agent" modal="filter-agent" value={agent} options={AGENT_FILTER_OPTIONS} onChange={setAgent} onOpenModal={onOpenModal} />
        <Field label="Timeframe" modal="filter-timeframe" value={timeframe} options={TIMEFRAME_OPTIONS} onChange={setTimeframe} onOpenModal={onOpenModal} />
        <Field label="Channel" modal="filter-channel" value={channel} options={CHANNEL_OPTIONS} onChange={setChannel} onOpenModal={onOpenModal} />
        <Field label="Modality" modal="filter-modality" value={modality} options={MODALITY_OPTIONS} onChange={setModality} onOpenModal={onOpenModal} />
      </div>

      <div className="panel sf-sessions-panel">
        <div className="inner-tabs pad">
          <button
            className={`inner-tab ${sessionTab === 'processed' ? 'active' : ''}`}
            onClick={() => { setSessionTab('processed'); setSelected(null) }}
          >
            Processed Sessions
          </button>
          <button
            className={`inner-tab ${sessionTab === 'unprocessed' ? 'active' : ''}`}
            onClick={() => { setSessionTab('unprocessed'); setSelected(null) }}
          >
            Unprocessed Sessions
          </button>
        </div>

        <div className="sf-table-meta">
          <button type="button" className="sf-count" onClick={() => onOpenModal(sessionTab === 'processed' ? 'sessions-processed' : 'sessions-unprocessed')}>
            {countLabel}
          </button>
          <div className="sf-table-tools">
            <label className="sf-search">
              <span className="sf-search-icon" aria-hidden>&#128269;</span>
              <input
                type="search"
                placeholder="Search this table"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={() => onOpenModal('sessions-search')}
                aria-label="Search this table"
              />
            </label>
            <button type="button" className="sf-icon-btn" title="Refresh" aria-label="Refresh" onClick={() => onOpenModal('sessions-refresh')}>&#8635;</button>
            <button type="button" className="sf-icon-btn" title="Select Fields to Display" aria-label="Select Fields to Display" onClick={() => setFieldsOpen(true)}>&#9881;</button>
            <button type="button" className="sf-icon-btn" title="Filter" aria-label="Filter" onClick={() => onOpenModal('sessions-filter-btn')}>&#9660;</button>
            <button
              type="button"
              className="sf-icon-btn"
              title="Download the visible columns and session transcripts as a CSV."
              aria-label="Download the visible columns and session transcripts as a CSV."
              onClick={() => onOpenModal('sessions-download-csv')}
            >
              &#11015;
            </button>
            {sessionTab === 'processed' && (
              <button type="button" className="sf-btn-primary" onClick={() => onOpenModal('sessions-evaluations')}>
                Evaluations
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <button type="button" className="sf-empty" onClick={() => onOpenModal('sessions-page')}>
            <EmptyCloud />
            <div className="sf-empty-title">No Data</div>
          </button>
        ) : (
          <div className="sf-table-wrap">
            <table className="data-table sf-data-table">
              <thead>
                <tr>
                  <th className="chk"><input type="checkbox" aria-label="Select all" /></th>
                  {columns.map(c => (
                    <th key={c}>
                      <button type="button" className="col-btn" onClick={() => onOpenModal(COL_MODAL[c] ?? 'sessions-select-fields')}>
                        {c}
                        <span className="th-caret" aria-hidden>&#9660;</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr
                    key={r.id}
                    className={selected?.id === r.id ? 'selected-row' : undefined}
                    onClick={() => {
                      setSelected(r)
                      onOpenModal('session-overview')
                    }}
                  >
                    <td className="chk" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" aria-label={`Select ${r.id}`} />
                    </td>
                    {columns.map(c => {
                      const v = cellFor(r, c)
                      if (c === 'Session Outcome') {
                        return (
                          <td key={c}>
                            {r.outcomeLevel === 'not_set' || r.outcomeLevel === 'processing'
                              ? <span className="outcome-plain">{r.outcome}</span>
                              : <span className={`outcome ${r.outcomeLevel}`}>{r.outcome}</span>}
                          </td>
                        )
                      }
                      if (c === 'Session ID') {
                        return <td key={c} className="mono linkish-cell">{v}</td>
                      }
                      if (c === 'Initial User Messages' || c === 'Initial Agent Responses') {
                        return <td key={c} className="truncate" title={v}>{v || ''}</td>
                      }
                      return <td key={c}>{v}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && filtered.length > 0 && (
          <div className="session-drill">
            <div className="session-drill-head">
              Session detail: <span className="mono">{selected.id}</span>
            </div>
            <div className="session-drill-actions">
              {DRILL_ACTIONS.map(a => (
                <button key={a.modal} type="button" className="sf-btn" onClick={() => onOpenModal(a.modal)}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {fieldsOpen && (
        <SelectFieldsModal
          displayed={columns}
          available={SESSION_AVAILABLE_COLUMNS}
          onClose={() => setFieldsOpen(false)}
          onSave={next => { setColumns(next); setFieldsOpen(false) }}
          onLearnMore={() => onOpenModal('sessions-select-fields')}
        />
      )}
    </div>
  )
}

function EmptyCloud() {
  return (
    <svg className="sf-empty-art" viewBox="0 0 160 110" aria-hidden>
      <defs>
        <linearGradient id="sfCloud" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7B8CFF" />
          <stop offset="55%" stopColor="#5B6FE8" />
          <stop offset="100%" stopColor="#3B49C9" />
        </linearGradient>
      </defs>
      <ellipse cx="78" cy="62" rx="54" ry="28" fill="url(#sfCloud)" opacity="0.95" />
      <ellipse cx="52" cy="54" rx="30" ry="22" fill="url(#sfCloud)" />
      <ellipse cx="102" cy="52" rx="34" ry="24" fill="url(#sfCloud)" />
      <rect x="68" y="38" width="5" height="22" rx="2" fill="#B8C4FF" />
      <rect x="78" y="32" width="5" height="30" rx="2" fill="#D0D8FF" />
      <rect x="88" y="40" width="5" height="18" rx="2" fill="#B8C4FF" />
      <circle cx="118" cy="28" r="3" fill="#A8B4FF" />
      <circle cx="40" cy="34" r="2.5" fill="#C5CEFF" />
      <path d="M48 78 l3 10 M60 80 l2 9 M90 79 l3 10 M104 78 l2 9" stroke="#8EA0FF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

interface FieldProps {
  label: string
  modal: string
  value: string
  options: string[]
  onChange: (v: string) => void
  onOpenModal: (k: string) => void
}
function Field({ label, modal, value, options, onChange, onOpenModal }: FieldProps) {
  return (
    <div className="filter-field">
      <button type="button" className="field-label" onClick={() => onOpenModal(modal)}>{label}</button>
      <Dropdown value={value} options={options} onChange={onChange} width={168} ariaLabel={label} />
    </div>
  )
}
