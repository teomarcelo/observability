// Types model the real Agentforce Studio > Observe & Optimize structure captured
// from the live org (agt59056985com). Sections are a flat list of 4.

export type AgentType = 'service' | 'employee';
export type Section = 'analytics' | 'sessions' | 'scorers' | 'alerts';
export type AnalyticsTab = 'overview' | 'performance-insights';

// Inner tabs differ by agent type in the real org:
//   Service:  Effectiveness | Usage | Quality | Health | Trust | Voice
//   Employee: Effectiveness | Usage | User Satisfaction | Quality | Health | Trust
export type InnerTab =
  | 'effectiveness'
  | 'usage'
  | 'user-satisfaction'
  | 'quality'
  | 'health'
  | 'trust'
  | 'voice'
  | 'custom-scorers';

export type PerfBreakdown = 'subagents' | 'intents' | 'actions';
export type ViewMode = 'cards' | 'table';
export type SessionTab = 'processed' | 'unprocessed';

export type MetricFormat = 'pct' | 'int' | 'score' | 'seconds' | 'ratio';

// A metric definition; concrete values are generated dynamically per selection.
export interface MetricDef {
  key: string;
  label: string;
  format: MetricFormat;
  base: number; // baseline used by the seeded generator
  variance: number;
  goodWhenUp: boolean;
  modalKey: string;
  /** When set, show this literal (e.g. "-") instead of a generated number — org insufficient-data / gated state. */
  fixedValue?: string;
}

// A tab's content: either a set of metrics, or a "not enabled" empty state.
export interface TabDef {
  id: InnerTab;
  label: string;
  heading: string; // e.g. "Aggregated Effectiveness Metrics"
  metrics?: MetricDef[];
  disabled?: {
    title: string;
    body: string;
    cta: string;
  };
}

export interface ComputedMetric {
  def: MetricDef;
  value: string;
  raw: number;
  delta: string;
  deltaType: 'good' | 'bad';
}

export interface SeriesPoint {
  day: string;
  [agent: string]: number | string;
}

export interface BreakdownRow {
  agentName: string;
  label: string; // subagent / intent / action label
  value: number; // value for the selected metric
}

export interface SessionRow {
  id: string;
  timestamp: string;
  duration: string;
  outcome: string;
  outcomeLevel: 'resolved' | 'escalated' | 'abandoned' | 'processing';
  initialMessage: string;
}

export interface ScorerRow {
  name: string;
  version: string;
  description: string;
  agent: string;
  status: 'Active' | 'Inactive';
  sampledData: string;
  type: 'Standard' | 'Custom';
  modalKey: string;
}

export interface ModalRow {
  label: string;
  value: string;
}

export interface DocSource {
  label: string;
  url: string;
}

export interface ModalContent {
  tabLabel: string;
  title: string;
  rows: ModalRow[];
  // Plain-language reading of the actual number/percentage.
  scale?: string;                 // what the value represents + a worked example
  higher?: string;                // what a higher value signals to a team
  lower?: string;                 // what a lower value signals to a team
  higherIs?: 'good' | 'bad' | 'depends'; // color/annotation for the "higher" direction
  purpose?: string;
  useCase?: string;
  practical?: string;
  sources?: DocSource[];
  note?: string;
}
