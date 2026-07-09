import { useState } from 'react'
import { scorersData } from '../../data/mockData'

export function ScorersPage() {
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState<'name' | 'agent'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = scorersData.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.agent.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortCol]
    const bv = b[sortCol]
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  function handleSort(col: 'name' | 'agent') {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  return (
    <div className="scorers-wrap">
      <div className="scorers-header">
        <span style={{ fontSize: 20 }}>&#x1F4CB;</span>
        <h2>Scorers</h2>
      </div>
      <div className="scorers-meta">
        Showing {sorted.length} items &bull; Sorted by {sortCol === 'name' ? 'Name' : 'Agent'} &bull; Updated a few seconds ago
      </div>
      <div className="scorers-search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <table className="scorers-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name {sortCol === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Version</th>
            <th>Description</th>
            <th onClick={() => handleSort('agent')}>
              Agent {sortCol === 'agent' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Status</th>
            <th>Sampled Data</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((scorer, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{scorer.name}</td>
              <td>{scorer.version}</td>
              <td style={{ color: '#666', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {scorer.description}
              </td>
              <td>{scorer.agent}</td>
              <td>
                <span className="scorers-status">
                  <span className="dot" />
                  {scorer.status}
                </span>
              </td>
              <td>{scorer.sampledData}</td>
              <td><span className="scorers-type-badge">{scorer.type}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
