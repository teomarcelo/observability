import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { insightsKpis, qualityBySubagent, topSubagents, bottomSubagents, topIntents, bottomIntents } from '../../data/mockData'
import type { RankingItem } from '../../data/types'

interface Props {
  onOpenModal: (key: string) => void
}

function RankingTable({ items, title, onOpenModal, modalKey }: { items: RankingItem[]; title: string; onOpenModal: (key: string) => void; modalKey: string }) {
  return (
    <div className="insights-card">
      <div className="card-title">
        {title} <span className="info-icon" onClick={() => onOpenModal(modalKey)}>i</span>
      </div>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sessions</th>
            <th>Avg Score</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td><span className="topic-name">{item.name}</span></td>
              <td>{item.sessions}</td>
              <td><span className={`r-badge ${item.level}`}>{item.score.toFixed(1)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function InsightsPage({ onOpenModal }: Props) {
  return (
    <div className="insights-page">
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

      {/* KPI Row */}
      <div className="insights-kpi-row">
        {insightsKpis.map(kpi => (
          <div key={kpi.label} className="insights-kpi" onClick={() => onOpenModal(kpi.modalKey)}>
            <div className="kpi-label">
              {kpi.label} <span className="info-icon">i</span>
            </div>
            <div className="kpi-value">
              {kpi.value}
              {kpi.badge && (
                <span className={`kpi-badge ${kpi.badge.level}`}>{kpi.badge.text}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quality by Subagent + Rankings */}
      <div className="insights-row">
        <div className="insights-card">
          <div className="card-title">
            Quality by Subagent <span className="info-icon" onClick={() => onOpenModal('quality-by-subagent')}>i</span>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityBySubagent}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                >
                  {qualityBySubagent.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
            {qualityBySubagent.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <RankingTable items={topSubagents} title="Top Ranking Subagents" onOpenModal={onOpenModal} modalKey="top-subagents" />
        <RankingTable items={bottomSubagents} title="Bottom Ranking Subagents" onOpenModal={onOpenModal} modalKey="bottom-subagents" />
      </div>

      {/* Quality by Intent + Rankings */}
      <div className="insights-row">
        <div className="insights-card">
          <div className="card-title">
            Quality by Intent <span className="info-icon" onClick={() => onOpenModal('quality-by-intent')}>i</span>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityBySubagent}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                >
                  {qualityBySubagent.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
            {qualityBySubagent.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <RankingTable items={topIntents} title="Top Ranking Intents" onOpenModal={onOpenModal} modalKey="top-intents" />
        <RankingTable items={bottomIntents} title="Bottom Ranking Intents" onOpenModal={onOpenModal} modalKey="bottom-intents" />
      </div>
    </div>
  )
}
