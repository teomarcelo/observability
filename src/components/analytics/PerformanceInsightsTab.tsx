import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { PerfBreakdown } from '../../data/types'

interface Props {
  breakdown: PerfBreakdown
  onBreakdownChange: (b: PerfBreakdown) => void
}

const subagentData = [
  { name: 'Order Lookup', sessions: 1240, score: 4.5 },
  { name: 'FAQ Handler', sessions: 980, score: 4.2 },
  { name: 'Billing Support', sessions: 720, score: 3.9 },
  { name: 'General Chat', sessions: 560, score: 3.4 },
  { name: 'Knowledge Base', sessions: 430, score: 2.8 },
  { name: 'Store Finder', sessions: 340, score: 2.1 },
]

const intentData = [
  { name: 'Check Order Status', sessions: 890, score: 4.6 },
  { name: 'Reset Password', sessions: 640, score: 4.3 },
  { name: 'Update Address', sessions: 520, score: 3.8 },
  { name: 'Billing Inquiry', sessions: 480, score: 3.5 },
  { name: 'Return Request', sessions: 350, score: 2.7 },
  { name: 'Cancel Subscription', sessions: 210, score: 2.0 },
  { name: 'Dispute Charge', sessions: 180, score: 2.3 },
  { name: 'File Complaint', sessions: 150, score: 1.9 },
]

const actionData = [
  { name: 'Knowledge Search', sessions: 2100, score: 4.1 },
  { name: 'API Call: Orders', sessions: 1450, score: 4.4 },
  { name: 'API Call: Accounts', sessions: 980, score: 3.8 },
  { name: 'Escalate to Agent', sessions: 620, score: 2.9 },
  { name: 'Send Email', sessions: 410, score: 3.6 },
  { name: 'Create Case', sessions: 380, score: 3.2 },
  { name: 'Update Record', sessions: 290, score: 3.0 },
]

function getDataForBreakdown(breakdown: PerfBreakdown) {
  switch (breakdown) {
    case 'subagents': return subagentData
    case 'intents': return intentData
    case 'actions': return actionData
  }
}

function getFilterLabel(breakdown: PerfBreakdown) {
  switch (breakdown) {
    case 'subagents': return 'Select Subagent'
    case 'intents': return 'Select Intent'
    case 'actions': return 'Select Action'
  }
}

function getFilterOptions(breakdown: PerfBreakdown) {
  return getDataForBreakdown(breakdown).map(d => d.name)
}

export function PerformanceInsightsTab({ breakdown, onBreakdownChange }: Props) {
  const breakdownTypes: { key: PerfBreakdown; label: string }[] = [
    { key: 'subagents', label: 'Subagents' },
    { key: 'intents', label: 'Intents' },
    { key: 'actions', label: 'Actions' },
  ]

  const chartData = getDataForBreakdown(breakdown)

  return (
    <div className="perf-page">
      <div className="perf-breakdown-header">
        <h2>Breakdowns</h2>
        <div className="perf-view-btns">
          {breakdownTypes.map(b => (
            <button
              key={b.key}
              className={breakdown === b.key ? 'active' : ''}
              onClick={() => onBreakdownChange(b.key)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12.5 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 0.5, textTransform: 'uppercase' as const, marginBottom: 4 }}>{getFilterLabel(breakdown)}</label>
          <select style={{ border: '1px solid #ccc', borderRadius: 4, padding: '5px 12px', fontSize: 12.5, width: 240 }}>
            <option>All</option>
            {getFilterOptions(breakdown).map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 0.5, textTransform: 'uppercase' as const, marginBottom: 4 }}>Select Metric</label>
          <select style={{ border: '1px solid #ccc', borderRadius: 4, padding: '5px 12px', fontSize: 12.5, width: 240 }}>
            <option>Average Quality Score</option>
            <option>Unique Sessions</option>
            <option>Deflection Rate</option>
          </select>
        </div>
      </div>

      <div className="perf-explore-box">
        <div style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
          Explore {breakdown === 'subagents' ? 'Subagents' : breakdown === 'intents' ? 'Intents' : 'Actions'} by Metric
        </div>
        <div className="perf-dual-chart-wrap">
          <div className="perf-chart-col">
            <div className="col-title">Unique Sessions</div>
            <div style={{ height: Math.max(280, chartData.length * 48) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#0070D2" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="perf-chart-col">
            <div className="col-title">Average Quality Score</div>
            <div style={{ height: Math.max(280, chartData.length * 48) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#c0392b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
