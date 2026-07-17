import type { Selection } from '../../data/mockData'
import { computeTableRows } from '../../data/mockData'

interface Props {
  sel: Selection
  onOpenModal: (key: string) => void
}

// Map table row keys to modal keys where one exists.
const MODAL_FOR: Record<string, string> = {
  deflection: 'deflection', escalation: 'escalation', engagement: 'engagement',
  success: 'success', abandon: 'abandon', 'unique-sessions': 'unique-sessions',
  'unique-interactions': 'unique-interactions', 'unique-users': 'unique-users',
  'avg-interactions': 'avg-interactions', 'avg-quality': 'avg-quality',
  'error-rate': 'error-rate', 'session-duration': 'session-duration',
  'agent-interaction-duration': 'agent-interaction-duration',
  'agent-response-rate': 'agent-response-rate', interruption: 'interruption',
}

export function TableView({ sel, onOpenModal }: Props) {
  const rows = computeTableRows(sel)
  return (
    <div className="table-view">
      <table className="metric-table">
        <thead>
          <tr>
            <th></th>
            <th className="tv-timeframe">Timeframe<div className="tv-date">2026-07-14</div></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.key} className="tv-row" onClick={() => MODAL_FOR[r.key] && onOpenModal(MODAL_FOR[r.key])}>
              <td className="tv-label">{r.label}</td>
              <td className="tv-value">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
