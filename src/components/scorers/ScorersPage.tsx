import { useState } from 'react'
import { scorersData, SCORER_COLUMNS } from '../../data/mockData'
import { InfoDot } from '../shared/InfoDot'

interface Props {
  onOpenModal: (key: string) => void
}

const COL_MODAL: Record<string, string> = {
  'Name': 'scorer-name', 'Version': 'scorer-version', 'Description': 'scorer-description',
  'Agent': 'scorer-agent', 'Status': 'scorer-status', 'Sampled Data': 'scorer-sampled', 'Type': 'scorer-type',
}

export function ScorersPage({ onOpenModal }: Props) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const rows = q
    ? scorersData.filter(s => `${s.name} ${s.agent} ${s.description}`.toLowerCase().includes(q))
    : scorersData

  return (
    <div className="scorers-page">
      <div className="panel scorers-panel">
        <div className="scorers-head">
          <div className="scorers-title">
            <button className="scorers-icon" aria-label="About Scorers" onClick={() => onOpenModal('scorers-page')}>&#128203;</button>
            <div>
              <button className="heading-btn page-title" onClick={() => onOpenModal('scorers-page')}>
                Scorers
                <InfoDot modalKey="scorers-page" onOpenModal={onOpenModal} label="Scorers" />
              </button>
              <div className="scorers-sub">Showing {rows.length} items &middot; Sorted by Name &middot; Updated a few seconds ago</div>
            </div>
          </div>
          <div className="scorers-search">
            <span className="search-icon">&#x1F50D;</span>
            <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
            <InfoDot modalKey="scorers-search" onOpenModal={onOpenModal} label="Search Scorers" className="search-info" />
          </div>
        </div>

        <table className="data-table scorers-table">
          <thead>
            <tr>
              {SCORER_COLUMNS.map(c => (
                <th key={c}><button className="col-btn" onClick={() => onOpenModal(COL_MODAL[c])}>{c} <span className="th-caret">&#9662;</span></button></th>
              ))}
              <th className="row-action-col"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <tr key={i}>
                <td><button className="cell-link" onClick={() => onOpenModal(s.modalKey)}>{s.name}</button></td>
                <td>{s.version}</td>
                <td className="truncate">{s.description}</td>
                <td>{s.agent}</td>
                <td><span className="status-dot" />{s.status}</td>
                <td>{s.sampledData}</td>
                <td>{s.type}</td>
                <td className="row-action-col">
                  <button className="row-action" onClick={() => onOpenModal(s.modalKey)} aria-label="Row actions">&#9662;</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="bt-empty">No scorers match "{query}"</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
