import type {
  AgentType, InnerTab, TabDef, MetricDef, ComputedMetric, SeriesPoint,
  BreakdownRow, SessionRow, ScorerRow, PerfBreakdown, MetricFormat,
} from './types';

// ────────────────────────────────────────────────────────────────────────
// Verbatim labels captured from the live org (agt59056985com).
// NOTE: "ADL Servie Agent" is spelled exactly as it appears in the real org.
// ────────────────────────────────────────────────────────────────────────
export const AGENTS = [
  'Service Employee Agent',
  'HelloWorld Agent',
  'ADL Servie Agent',
  'Pronto Service Agent',
  'Hello Earth',
  'Merchant Support Agent',
];

export const AGENT_FILTER_OPTIONS = ['All', ...AGENTS];
export const TIMEFRAME_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'];
export const CHANNEL_OPTIONS = ['All', 'Chat', 'Voice']; // verbatim
export const MODALITY_OPTIONS = ['All', 'Text', 'Voice'];
export const GRANULARITY_OPTIONS = ['Day', 'Week', 'Month'];

export const TIMEFRAME_DAYS: Record<string, number> = {
  'Last 7 Days': 7,
  'Last 30 Days': 30,
  'Last 90 Days': 90,
};

// ── Seeded deterministic generator (mulberry32 over a string hash) ─────────
function seeded(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const t = (h ^= h >>> 16) >>> 0;
    return t / 4294967296;
  };
}

function fmt(value: number, format: MetricFormat): string {
  switch (format) {
    case 'pct': return `${value.toFixed(0)}%`;
    case 'int': return Math.round(value).toLocaleString();
    case 'score': return value.toFixed(1);
    case 'seconds': return `${value.toFixed(2)}`;
    case 'ratio': return value.toFixed(1);
  }
}

// ── Metric catalogs (per tab) ──────────────────────────────────────────────
// Teaching mock shaped like a mid-maturity service org: useful volume, mixed
// wins/losses (deflection middling, abandon/escalation elevated, success lagging).
// Not a copy of any one trial org snapshot (those can show 0% for thin data).
const effectiveness: MetricDef[] = [
  { key: 'deflection', label: 'Deflection Rate', format: 'pct', base: 41, variance: 7, goodWhenUp: true, modalKey: 'deflection' },
  { key: 'escalation', label: 'Escalation Rate', format: 'pct', base: 14, variance: 5, goodWhenUp: false, modalKey: 'escalation' },
  { key: 'abandon', label: 'Abandon Rate', format: 'pct', base: 24, variance: 6, goodWhenUp: false, modalKey: 'abandon' },
  { key: 'engagement', label: 'Engagement Rate', format: 'pct', base: 71, variance: 8, goodWhenUp: true, modalKey: 'engagement' },
  { key: 'success', label: 'Success Rate', format: 'pct', base: 34, variance: 8, goodWhenUp: true, modalKey: 'success' },
];

const usage: MetricDef[] = [
  { key: 'unique-sessions', label: 'Unique Sessions', format: 'int', base: 148, variance: 28, goodWhenUp: true, modalKey: 'unique-sessions' },
  { key: 'unique-interactions', label: 'Unique Interactions', format: 'int', base: 612, variance: 90, goodWhenUp: true, modalKey: 'unique-interactions' },
  { key: 'unique-users', label: 'Unique Users', format: 'int', base: 97, variance: 18, goodWhenUp: true, modalKey: 'unique-users' },
  { key: 'avg-interactions', label: 'Average Interactions Per Session', format: 'ratio', base: 4.1, variance: 0.9, goodWhenUp: true, modalKey: 'avg-interactions' },
];

const quality: MetricDef[] = [
  { key: 'avg-quality', label: 'Average Quality Score', format: 'score', base: 3.4, variance: 0.6, goodWhenUp: true, modalKey: 'avg-quality' },
];

const health: MetricDef[] = [
  { key: 'error-rate', label: 'Error Rate', format: 'pct', base: 3.2, variance: 1.8, goodWhenUp: false, modalKey: 'error-rate' },
  { key: 'session-duration', label: 'Session Duration (seconds)', format: 'seconds', base: 186, variance: 45, goodWhenUp: false, modalKey: 'session-duration' },
  { key: 'agent-interaction-duration', label: 'Agent Interaction Duration (seconds)', format: 'seconds', base: 2.4, variance: 0.8, goodWhenUp: false, modalKey: 'agent-interaction-duration' },
  { key: 'agent-response-rate', label: 'Agent Response Rate', format: 'pct', base: 94, variance: 4, goodWhenUp: true, modalKey: 'agent-response-rate' },
  { key: 'p50-response-latency', label: 'P50 - Agent Response Latency', format: 'seconds', base: 1.8, variance: 0.5, goodWhenUp: false, modalKey: 'health-rag-latency' },
  { key: 'p90-response-latency', label: 'P90 - Agent Response Latency', format: 'seconds', base: 4.6, variance: 1.2, goodWhenUp: false, modalKey: 'health-rag-latency' },
  { key: 'p95-response-latency', label: 'P95 - Agent Response Latency', format: 'seconds', base: 6.9, variance: 1.6, goodWhenUp: false, modalKey: 'health-rag-latency' },
  { key: 'p99-response-latency', label: 'P99 - Agent Response Latency', format: 'seconds', base: 11.4, variance: 2.4, goodWhenUp: false, modalKey: 'health-rag-latency' },
];

const trust: MetricDef[] = [
  { key: 'instruction-adherence', label: 'Instruction Adherence Rate', format: 'pct', base: 81, variance: 7, goodWhenUp: true, modalKey: 'trust-instruction-adherence' },
  { key: 'toxicity', label: 'Toxicity Score', format: 'pct', base: 2.4, variance: 1.4, goodWhenUp: false, modalKey: 'trust-toxicity' },
];

const voice: MetricDef[] = [
  { key: 'interruption', label: 'Interruption Rate', format: 'pct', base: 11, variance: 4, goodWhenUp: false, modalKey: 'interruption' },
  { key: 'agent-talk-ratio', label: 'Agent Talk Ratio', format: 'pct', base: 48, variance: 9, goodWhenUp: true, modalKey: 'voice-agent-talk-ratio' },
];

/** Per-agent bias vs the metric base: some agents outperform, some drag averages down. */
const AGENT_BIAS: Record<string, number> = {
  'Pronto Service Agent': 0.12,
  'Merchant Support Agent': 0.06,
  'ADL Servie Agent': -0.02,
  'HelloWorld Agent': -0.08,
  'Hello Earth': -0.18,
  'Service Employee Agent': 0.04,
  'NOT_SET': -0.1,
};

// ── Tab definitions per agent type ─────────────────────────────────────────
export const SERVICE_TABS: TabDef[] = [
  { id: 'effectiveness', label: 'Effectiveness', heading: 'Aggregated Effectiveness Metrics', metrics: effectiveness },
  { id: 'usage', label: 'Usage', heading: 'Aggregated Usage Metrics', metrics: usage },
  { id: 'quality', label: 'Quality', heading: 'Aggregated Quality Metrics', metrics: quality },
  { id: 'health', label: 'Health', heading: 'Aggregated Health Metrics', metrics: health },
  { id: 'trust', label: 'Trust', heading: 'Aggregated Trust Metrics', metrics: trust },
  { id: 'voice', label: 'Voice', heading: 'Aggregated Voice Metrics', metrics: voice },
  {
    id: 'custom-scorers', label: 'Custom Scorers', heading: 'Custom Scorers',
    disabled: {
      title: 'Your custom scorers will appear here',
      body: 'Create and activate a scorer in Agentforce Studio to start tracking trends over time.',
      cta: 'Learn about custom scorers',
    },
  },
];

export const EMPLOYEE_TABS: TabDef[] = [
  { id: 'effectiveness', label: 'Effectiveness', heading: 'Aggregated Effectiveness Metrics', metrics: effectiveness },
  { id: 'usage', label: 'Usage', heading: 'Aggregated Usage Metrics', metrics: usage },
  {
    id: 'user-satisfaction', label: 'User Satisfaction', heading: 'User Satisfaction Metrics',
    disabled: {
      title: 'Audit & Feedback metrics are not enabled',
      body: 'User Satisfaction metrics require Einstein Feedback to be enabled. Enable it from Setup, wait for provisioning to complete and for the related DMOs to be available in the Analytics Foundations SDM, then reconfigure the app.',
      cta: 'Enable Einstein Feedback',
    },
  },
  { id: 'quality', label: 'Quality', heading: 'Aggregated Quality Metrics', metrics: quality },
  { id: 'health', label: 'Health', heading: 'Aggregated Health Metrics', metrics: health },
  { id: 'trust', label: 'Trust', heading: 'Aggregated Trust Metrics', metrics: trust },
];

export function tabsFor(agentType: AgentType): TabDef[] {
  return agentType === 'service' ? SERVICE_TABS : EMPLOYEE_TABS;
}

export function tabDef(agentType: AgentType, id: InnerTab): TabDef | undefined {
  return tabsFor(agentType).find(t => t.id === id);
}

// The colored dot series shows one series per agent (as in the real chart).
export const AGENT_COLORS: Record<string, string> = {
  'Service Employee Agent': '#0b5cab',
  'ADL Servie Agent': '#5867e8',
  'Hello Earth': '#b34fd1',
  'HelloWorld Agent': '#159c7a',
  'NOT_SET': '#7d55c7',
  'Pronto Service Agent': '#e5567a',
  'Merchant Support Agent': '#e07b39',
};

// ── Dynamic computation ─────────────────────────────────────────────────────
export interface Selection {
  agentType: AgentType;
  agent: string;
  timeframe: string;
  channel: string;
  modality: string;
}

function seedOf(sel: Selection, extra: string): string {
  return `${sel.agentType}|${sel.agent}|${sel.timeframe}|${sel.channel}|${sel.modality}|${extra}`;
}

function clampMetric(raw: number, format: MetricFormat): number {
  if (format === 'pct') return Math.max(0, Math.min(100, raw));
  if (format === 'score') return Math.max(1, Math.min(5, raw));
  return Math.max(0, raw);
}

export function computeMetric(sel: Selection, def: MetricDef): ComputedMetric {
  if (def.fixedValue !== undefined) {
    return {
      def,
      value: def.fixedValue,
      raw: 0,
      delta: 'Insufficient data',
      deltaType: 'bad',
    };
  }
  const rnd = seeded(seedOf(sel, def.key));
  const agentBias = sel.agent === 'All' ? 0 : (AGENT_BIAS[sel.agent] ?? 0);
  let raw = def.base * (1 + agentBias) + (rnd() - 0.5) * def.variance * 2;
  raw = clampMetric(raw, def.format);
  // Bias deltas slightly toward mixed/unfavorable so Overview rarely looks "all green".
  const deltaMag = (rnd() - 0.55) * def.variance * 1.15;
  const up = deltaMag >= 0;
  const good = def.goodWhenUp ? up : !up;
  const unit = def.format === 'pct' ? '%' : def.format === 'score' ? '' : def.format === 'int' ? '' : '';
  const tf = sel.timeframe.replace('Last ', 'prior ');
  const favor = good ? 'favorable' : 'unfavorable';
  const shown = Math.abs(deltaMag);
  const sign = up ? '+' : '-';
  const delta = def.format === 'int'
    ? `${sign}${Math.round(shown)} (${favor}) vs. ${tf}`
    : `${sign}${shown.toFixed(1)}${unit} (${favor}) vs. ${tf}`;
  return { def, value: fmt(raw, def.format), raw, delta, deltaType: good ? 'good' : 'bad' };
}

export function computeMetrics(sel: Selection, defs: MetricDef[]): ComputedMetric[] {
  return defs.map(d => computeMetric(sel, d));
}

// Line series: one series per agent. Bias + gentle drift + day noise (org-like crossing lines).
export function computeSeries(sel: Selection, def: MetricDef, granularity: string): SeriesPoint[] {
  const days = TIMEFRAME_DAYS[sel.timeframe] ?? 30;
  const step = granularity === 'Month' ? 30 : granularity === 'Week' ? 7 : 1;
  const buckets = Math.max(3, Math.round(days / step));
  const agents = sel.agent === 'All' ? AGENTS : [sel.agent];
  const points: SeriesPoint[] = [];
  const base = new Date(2026, 6, 14);
  // Usage charts in the org sit on a lower daily scale than the aggregated card totals.
  const seriesScale = def.format === 'int' ? 0.12 : 1;
  for (let i = 0; i < buckets; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() - (buckets - 1 - i) * step);
    const p: SeriesPoint = { day: `${d.getMonth() + 1}/${d.getDate()}` };
    const t = buckets <= 1 ? 0 : i / (buckets - 1);
    for (const a of agents) {
      const rnd = seeded(seedOf(sel, `${def.key}|${a}|${i}`));
      const bias = AGENT_BIAS[a] ?? 0;
      // Invert bias for "lower is better" metrics so weak agents look worse on chart.
      const signedBias = def.goodWhenUp ? bias : -bias;
      const drift = (t - 0.5) * def.variance * (0.35 + rnd() * 0.4) * (signedBias >= 0 ? 0.6 : 1.1);
      const noise = (rnd() - 0.5) * def.variance * 1.6;
      let v = (def.base * (1 + signedBias) + drift + noise) * seriesScale;
      v = clampMetric(v, def.format);
      p[a] = def.format === 'int' ? Math.round(v) : Math.round(v * 100) / 100;
    }
    points.push(p);
  }
  return points;
}

// ── Performance Insights: breakdown structure (subagents verbatim from org) ──
const SUBAGENTS_BY_AGENT: Record<string, string[]> = {
  'Pronto Service Agent': ['NOT_SET', 'Storefront_Search', 'Support_Policies_and_Terms'],
  'NOT_SET': ['NOT_SET', 'Storefront_Search', 'greeting', 'Support_Policies_and_Terms', 'GeneralFAQ'],
  'HelloWorld Agent': ['NOT_SET', 'greeting'],
  'Hello Earth': ['NOT_SET'],
  'ADL Servie Agent': ['NOT_SET', 'GeneralFAQ'],
};

const INTENTS_BY_AGENT: Record<string, string[]> = {
  'Pronto Service Agent': ['Check Order Status', 'Return Request', 'Billing Inquiry'],
  'NOT_SET': ['Check Order Status', 'General FAQ', 'Store Hours', 'Cancel Order'],
  'HelloWorld Agent': ['Reset Password', 'General FAQ'],
  'Hello Earth': ['General FAQ'],
  'ADL Servie Agent': ['General FAQ', 'Update Address'],
};

const ACTIONS_BY_AGENT: Record<string, string[]> = {
  'Pronto Service Agent': ['Get_Order_Details', 'Search_Knowledge', 'Create_Case'],
  'NOT_SET': ['Search_Knowledge', 'Get_Order_Details', 'Escalate_To_Agent'],
  'HelloWorld Agent': ['Search_Knowledge', 'Reset_Password'],
  'Hello Earth': ['Search_Knowledge'],
  'ADL Servie Agent': ['Search_Knowledge', 'Update_Contact'],
};

export const PERF_METRIC_OPTIONS = [
  'Average Quality Score',
  'Unique Sessions',
  'Unique Interactions',
  'Escalation Rate',
  'Deflection Rate',
];

export const PERF_BREAKDOWN_LABELS: Record<PerfBreakdown, { toggle: string; explore: string; col: string; select: string }> = {
  subagents: { toggle: 'Subagents', explore: 'Explore Subagents by Metric', col: 'Subagent', select: 'Select Subagent' },
  intents: { toggle: 'Intents', explore: 'Explore Intents by Metric', col: 'Intent', select: 'Select Intent' },
  actions: { toggle: 'Actions', explore: 'Explore Actions by Metric', col: 'Action', select: 'Select Action' },
};

function mapFor(bd: PerfBreakdown): Record<string, string[]> {
  return bd === 'subagents' ? SUBAGENTS_BY_AGENT : bd === 'intents' ? INTENTS_BY_AGENT : ACTIONS_BY_AGENT;
}

export function breakdownItems(bd: PerfBreakdown): string[] {
  const set = new Set<string>();
  Object.values(mapFor(bd)).forEach(arr => arr.forEach(x => set.add(x)));
  return ['All', ...Array.from(set)];
}

export function computeBreakdown(bd: PerfBreakdown, selectItem: string, metric: string): BreakdownRow[] {
  const map = mapFor(bd);
  const rows: BreakdownRow[] = [];
  const scoreMode = metric === 'Average Quality Score';
  const rateBase = metric.includes('Escalation') ? 18 : metric.includes('Deflection') ? 38 : 45;
  for (const agentName of Object.keys(map)) {
    for (const label of map[agentName]) {
      if (selectItem !== 'All' && label !== selectItem) continue;
      const rnd = seeded(`${bd}|${agentName}|${label}|${metric}`);
      const bias = AGENT_BIAS[agentName] ?? 0;
      const value = scoreMode
        ? Math.round(clampMetric(3.2 * (1 + bias) + (rnd() - 0.5) * 1.4, 'score') * 10) / 10
        : metric.includes('Rate')
          ? Math.round(clampMetric(rateBase * (1 + (metric.includes('Escalation') ? -bias : bias)) + (rnd() - 0.5) * 16, 'pct'))
          : Math.round(Math.max(1, (6 + rnd() * 14) * (1 + bias * 0.5)));
      rows.push({ agentName, label, value });
    }
  }
  return rows;
}

// ── Sessions & Intents ──────────────────────────────────────────────────────
export const SESSION_COLUMNS = [
  'Session ID',
  'Timestamp',
  'Session Duration',
  'Session Outcome',
  'Initial User Messages',
  'Initial Agent Responses',
  'Subagents',
  'Actions',
  'Sources',
  'Errors',
];

export const unprocessedSessions: SessionRow[] = [
  { id: '01a1179e-5ca1-79d2-9613-d3ceebd7ed7b', timestamp: '10/07/2026, 11:26:59 AM', duration: '--', outcome: 'NOT_SET', outcomeLevel: 'processing', initialMessage: '--' },
  { id: '0Ub5f00000ABc12', timestamp: '2026-07-14 15:41', duration: '00:01:52', outcome: 'Unprocessed', outcomeLevel: 'processing', initialMessage: 'Provide me information about the fusion bites restaurant' },
  { id: '0Ub5f00000ABc34', timestamp: '2026-07-14 15:38', duration: '00:00:47', outcome: 'Unprocessed', outcomeLevel: 'processing', initialMessage: 'I need to speak to an agent' },
  { id: '0Ub5f00000ABc56', timestamp: '2026-07-14 15:33', duration: '00:03:12', outcome: 'Unprocessed', outcomeLevel: 'processing', initialMessage: 'I need some help with info about a store' },
];

// Mock "processed" rows to demonstrate the populated table (org currently shows
// the "Processing latest sessions" state). Data is mock; structure is verbatim.
export const processedSessions: SessionRow[] = [
  { id: '0Ub5f00000AAa01', timestamp: '2026-07-13 11:02', duration: '00:02:14', outcome: 'Resolved', outcomeLevel: 'resolved', initialMessage: 'Where is my order #10482?' },
  { id: '0Ub5f00000AAa02', timestamp: '2026-07-13 10:51', duration: '00:04:39', outcome: 'Escalated', outcomeLevel: 'escalated', initialMessage: 'I want to dispute a charge' },
  { id: '0Ub5f00000AAa03', timestamp: '2026-07-13 10:44', duration: '00:00:39', outcome: 'Resolved', outcomeLevel: 'resolved', initialMessage: 'Reset my password please' },
  { id: '0Ub5f00000AAa04', timestamp: '2026-07-13 10:31', duration: '00:05:20', outcome: 'Abandoned', outcomeLevel: 'abandoned', initialMessage: 'Update my store hours' },
  { id: '0Ub5f00000AAa05', timestamp: '2026-07-13 10:22', duration: '00:01:47', outcome: 'Resolved', outcomeLevel: 'resolved', initialMessage: 'What is your return policy?' },
  { id: '0Ub5f00000AAa06', timestamp: '2026-07-13 10:08', duration: '00:03:02', outcome: 'Escalated', outcomeLevel: 'escalated', initialMessage: 'Cancel my order that already shipped' },
];

// ── Scorers (10 rows, verbatim structure captured from org) ──────────────────
const SCORER_DESCRIPTIONS: Record<string, string> = {
  'Abandonment Score': 'Indicates whether the customer abandoned the session before it was resolved.',
  'Deflection Score': 'Indicates the degree to which the agent deflected the issue without escalating to a human.',
};

function scorer(name: string, agent: string): ScorerRow {
  return {
    name, version: '1.0', description: SCORER_DESCRIPTIONS[name], agent,
    status: 'Active', sampledData: '100%', type: 'Standard',
    modalKey: name === 'Abandonment Score' ? 'scorer-abandonment' : 'scorer-deflection',
  };
}

export const scorersData: ScorerRow[] = [
  scorer('Abandonment Score', 'Hello Earth'),
  scorer('Abandonment Score', 'Pronto Service Agent'),
  scorer('Abandonment Score', 'HelloWorld Agent'),
  scorer('Abandonment Score', 'ADL Servie Agent'),
  scorer('Abandonment Score', 'Merchant Support Agent'),
  scorer('Deflection Score', 'HelloWorld Agent'),
  scorer('Deflection Score', 'Merchant Support Agent'),
  scorer('Deflection Score', 'Hello Earth'),
  scorer('Deflection Score', 'Pronto Service Agent'),
  scorer('Deflection Score', 'ADL Servie Agent'),
];

export const SCORER_COLUMNS = ['Name', 'Version', 'Description', 'Agent', 'Status', 'Sampled Data', 'Type'];

// ── Table View: full ordered metric list (verbatim from org Table View) ──────
export const TABLE_VIEW_METRICS: { label: string; key: string; format: MetricFormat; base: number; variance: number }[] = [
  { label: 'Deflection Rate', key: 'deflection', format: 'pct', base: 41, variance: 7 },
  { label: 'Escalation Rate', key: 'escalation', format: 'pct', base: 14, variance: 5 },
  { label: 'Engagement Rate', key: 'engagement', format: 'pct', base: 71, variance: 8 },
  { label: 'Success Rate', key: 'success', format: 'pct', base: 34, variance: 8 },
  { label: 'Abandon Rate', key: 'abandon', format: 'pct', base: 24, variance: 6 },
  { label: 'Unique Sessions', key: 'unique-sessions', format: 'int', base: 148, variance: 28 },
  { label: 'Unique Interactions', key: 'unique-interactions', format: 'int', base: 612, variance: 90 },
  { label: 'Unique Users', key: 'unique-users', format: 'int', base: 97, variance: 18 },
  { label: 'Average Interactions Per Session', key: 'avg-interactions', format: 'ratio', base: 4.1, variance: 0.9 },
  { label: 'Average Quality Score', key: 'avg-quality', format: 'score', base: 3.4, variance: 0.6 },
  { label: 'Interaction Error Rate', key: 'error-rate', format: 'pct', base: 3.2, variance: 1.8 },
  { label: 'Average Session Duration', key: 'session-duration', format: 'seconds', base: 186, variance: 45 },
  { label: 'Average Agent Interaction Duration', key: 'agent-interaction-duration', format: 'seconds', base: 2.4, variance: 0.8 },
  { label: 'Agent Response Rate', key: 'agent-response-rate', format: 'pct', base: 94, variance: 4 },
  { label: 'Interruption Rate', key: 'interruption', format: 'pct', base: 11, variance: 4 },
];

export function computeTableRows(sel: Selection): { label: string; value: string; key: string }[] {
  return TABLE_VIEW_METRICS.map(m => {
    const rnd = seeded(seedOf(sel, m.key));
    let raw = m.base + (rnd() - 0.5) * m.variance * 2;
    raw = m.format === 'pct' ? Math.max(0, Math.min(100, raw)) : Math.max(0, raw);
    return { label: m.label, value: fmt(raw, m.format), key: m.key };
  });
}
