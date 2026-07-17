import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Selection, } from '../../data/mockData'
import { computeSeries, AGENTS, AGENT_COLORS } from '../../data/mockData'
import type { MetricDef } from '../../data/types'
import { InfoDot } from '../shared/InfoDot'

interface Props {
  sel: Selection
  metric: MetricDef
  granularity: string
  onOpenModal: (key: string) => void
}

// One line per agent, over the timeframe. Re-renders whenever the selection,
// metric, or granularity changes (keyed by all of them).
export function MetricChart({ sel, metric, granularity, onOpenModal }: Props) {
  const data = computeSeries(sel, metric, granularity)
  const agents = sel.agent === 'All' ? AGENTS : [sel.agent]

  return (
    <div className="metric-chart">
      <button className="chart-title heading-btn" onClick={() => onOpenModal('metric-chart')}>
        {metric.label} over time
        <InfoDot modalKey="metric-chart" onOpenModal={onOpenModal} label="chart" />
      </button>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5c6b7a' }} />
          <YAxis tick={{ fontSize: 11, fill: '#5c6b7a' }} width={40} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e9f0' }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {agents.map(a => (
            <Line
              key={a}
              type="monotone"
              dataKey={a}
              name={a}
              stroke={AGENT_COLORS[a] ?? '#0176d3'}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
