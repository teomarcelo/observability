import { useState } from 'react'
import { alertsData } from '../../data/mockData'

interface Props {
  onOpenModal: (key: string) => void
}

export function AlertsPage({ onOpenModal: _onOpenModal }: Props) {
  const [filter, setFilter] = useState<'all' | 'active' | 'monitoring' | 'resolved'>('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')

  const filtered = alertsData.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false
    return true
  })

  const activeCount = alertsData.filter(a => a.status === 'active').length
  const monitoringCount = alertsData.filter(a => a.status === 'monitoring').length

  return (
    <div className="alerts-page">
      <div className="alerts-header">
        <span style={{ fontSize: 20 }}>&#x1F514;</span>
        <h2>Alerts</h2>
        <span className="si-badge" style={{ marginLeft: 4 }}>{activeCount}</span>
      </div>
      <div className="alerts-meta">
        {activeCount} active &bull; {monitoringCount} monitoring &bull; Last checked a few seconds ago
      </div>

      <div className="alerts-filters">
        <label style={{ fontSize: 12.5, fontWeight: 600, color: '#555' }}>Status:</label>
        <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="monitoring">Monitoring</option>
          <option value="resolved">Resolved</option>
        </select>
        <label style={{ fontSize: 12.5, fontWeight: 600, color: '#555', marginLeft: 12 }}>Severity:</label>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value as typeof severityFilter)}>
          <option value="all">All</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>

      {filtered.map(alert => (
        <div key={alert.id} className="alert-card">
          <div className={`alert-severity ${alert.severity}`} />
          <div className="alert-content">
            <div className="alert-title">{alert.title}</div>
            <div className="alert-desc">{alert.description}</div>
            <div className="alert-meta">
              {alert.agent} &bull; {alert.metric} &bull; Threshold: {alert.threshold} &bull; Current: {alert.currentValue} &bull; {alert.timestamp}
            </div>
          </div>
          <span className={`alert-status ${alert.status}`}>{alert.status}</span>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="empty-state">
          <h3>No alerts match your filters</h3>
          <p>Try adjusting the status or severity filters to see more alerts.</p>
        </div>
      )}
    </div>
  )
}
