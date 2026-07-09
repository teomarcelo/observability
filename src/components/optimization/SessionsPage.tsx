import { useState } from 'react'
import type { SessionTab } from '../../data/types'
import { processedSessions, unprocessedSessions } from '../../data/mockData'

interface Props {
  sessionTab: SessionTab
  onSessionTabChange: (t: SessionTab) => void
}

export function SessionsPage({ sessionTab, onSessionTabChange }: Props) {
  const [search, setSearch] = useState('')
  const sessions = sessionTab === 'processed' ? processedSessions : unprocessedSessions
  const filtered = sessions.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.agent.toLowerCase().includes(search.toLowerCase()) ||
    s.intent.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="si-page">
      {/* Top bar */}
      <div className="si-topbar">
        <div className="si-title">
          Sessions &amp; Intents
          <span className="si-badge">1</span>
        </div>
        <button className="help-btn" style={{ marginLeft: 'auto' }}>&#x1F4CA; Sessions &amp; Intents Help</button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <span style={{ fontWeight: 600, fontSize: 13, color: '#555' }}>Filter by:</span>
        <span>
          <label>Agent:</label>
          <select>
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
            <option>Last 7 Days</option>
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
        <span>
          <label>Modality:</label>
          <select>
            <option>All</option>
            <option>Chat</option>
            <option>Voice</option>
          </select>
        </span>
      </div>

      {/* Tab Nav */}
      <div className="si-tab-nav">
        <button
          className={sessionTab === 'processed' ? 'active' : ''}
          onClick={() => onSessionTabChange('processed')}
        >
          Processed Sessions
        </button>
        <button
          className={sessionTab === 'unprocessed' ? 'active' : ''}
          onClick={() => onSessionTabChange('unprocessed')}
        >
          Unprocessed Sessions
        </button>
      </div>

      {/* Table */}
      <div className="si-table-wrap">
        <div className="si-table-info">
          <span>{filtered.length} {sessionTab} sessions</span>
          <input
            className="si-search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <table className="si-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Agent</th>
              <th>Intent</th>
              <th>Outcome</th>
              <th>Quality</th>
              <th>Reasoning</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(session => (
              <tr key={session.id}>
                <td><span className="si-session-id">{session.id}</span></td>
                <td>{session.agent}</td>
                <td>
                  {session.tags.map(tag => (
                    <span key={tag} className={`si-tag ${tag === 'escalation' ? 'escalation' : ''}`}>{tag}</span>
                  ))}
                  <div style={{ marginTop: 4, fontSize: 12 }}>{session.intent}</div>
                </td>
                <td>
                  <span className="si-outcome">
                    <span className="dot" style={{ background: session.outcomeColor }} />
                    {session.outcome}
                  </span>
                </td>
                <td>
                  <span className={`si-quality ${session.qualityLevel}`}>{session.quality}</span>
                </td>
                <td style={{ maxWidth: 200, fontSize: 11.5, color: '#444' }}>{session.reasoning}</td>
                <td style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>{session.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
