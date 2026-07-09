import type { Metric, TimeSeriesPoint, SessionRow, ScorerRow, AlertItem, RankingItem, BreakdownRow } from './types';

// ── Time series data generator ──
function generateTimeSeries(baseValue: number, variance: number, days = 30): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(2025, 4, i + 1);
    const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const value = Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance * 2));
    points.push({ day: dayStr, value: Math.round(value * 10) / 10 });
  }
  return points;
}

// ── Service Agent Metrics ──
export const saEffectivenessMetrics: Metric[] = [
  { label: 'Deflection Rate', value: '38%', delta: '+2.1% vs. prior 30 days', deltaType: 'good', modalKey: 'deflection' },
  { label: 'Escalation Rate', value: '14%', delta: '-1.2% vs. prior 30 days', deltaType: 'good', modalKey: 'escalation' },
  { label: 'Abandonment Rate', value: '42%', delta: '+4.6% vs. prior 30 days', deltaType: 'bad', modalKey: 'abandonment' },
  { label: 'Engagement Rate', value: '71%', delta: '+3.2% vs. prior 30 days', deltaType: 'good', modalKey: 'engagement' },
  { label: 'Success Rate', value: '22%', delta: '-5.1% vs. prior 30 days', deltaType: 'bad', modalKey: 'success' },
];

export const saUsageMetrics: Metric[] = [
  { label: 'Total Sessions', value: '4,218', delta: '+12.3% vs. prior 30 days', deltaType: 'good', modalKey: 'total-sessions' },
  { label: 'Unique Users', value: '1,847', delta: '+8.1% vs. prior 30 days', deltaType: 'good', modalKey: 'unique-users' },
  { label: 'Avg Session Duration', value: '3m 42s', delta: '-0.5% vs. prior 30 days', deltaType: 'good', modalKey: 'avg-duration' },
  { label: 'Peak Hour Sessions', value: '312', delta: '+15.4% vs. prior 30 days', deltaType: 'good', modalKey: 'peak-sessions' },
  { label: 'Returning Users', value: '62%', delta: '+4.2% vs. prior 30 days', deltaType: 'good', modalKey: 'returning-users' },
];

export const saQualityMetrics: Metric[] = [
  { label: 'Avg Quality Score', value: '3.6', delta: '+0.2 vs. prior 30 days', deltaType: 'good', modalKey: 'avg-quality' },
  { label: 'High Quality %', value: '45%', delta: '+3.8% vs. prior 30 days', deltaType: 'good', modalKey: 'high-quality' },
  { label: 'Low Quality %', value: '18%', delta: '-2.1% vs. prior 30 days', deltaType: 'good', modalKey: 'low-quality' },
  { label: 'Quality Trend', value: 'Improving', delta: 'Stable over 7 days', deltaType: 'good', modalKey: 'quality-trend' },
];

export const saHealthMetrics: Metric[] = [
  { label: 'Avg Latency', value: '1.8s', delta: '-0.3s vs. prior 30 days', deltaType: 'good', modalKey: 'avg-latency' },
  { label: 'Error Rate', value: '2.1%', delta: '+0.4% vs. prior 30 days', deltaType: 'bad', modalKey: 'error-rate' },
  { label: 'Uptime', value: '99.7%', delta: '+0.1% vs. prior 30 days', deltaType: 'good', modalKey: 'uptime' },
  { label: 'Timeout Rate', value: '0.8%', delta: '-0.2% vs. prior 30 days', deltaType: 'good', modalKey: 'timeout-rate' },
];

export const saTrustMetrics: Metric[] = [
  { label: 'Guardrail Triggers', value: '47', delta: '-12 vs. prior 30 days', deltaType: 'good', modalKey: 'guardrail-triggers' },
  { label: 'Hallucination Rate', value: '3.2%', delta: '-0.8% vs. prior 30 days', deltaType: 'good', modalKey: 'hallucination-rate' },
  { label: 'PII Detections', value: '8', delta: '-3 vs. prior 30 days', deltaType: 'good', modalKey: 'pii-detections' },
  { label: 'Policy Violations', value: '2', delta: '-1 vs. prior 30 days', deltaType: 'good', modalKey: 'policy-violations' },
];

export const saVoiceMetrics: Metric[] = [
  { label: 'Voice Sessions', value: '892', delta: '+18.2% vs. prior 30 days', deltaType: 'good', modalKey: 'voice-sessions' },
  { label: 'Avg Call Duration', value: '4m 15s', delta: '-12s vs. prior 30 days', deltaType: 'good', modalKey: 'call-duration' },
  { label: 'Voice Deflection', value: '28%', delta: '+3.4% vs. prior 30 days', deltaType: 'good', modalKey: 'voice-deflection' },
  { label: 'Transfer Rate', value: '22%', delta: '-2.1% vs. prior 30 days', deltaType: 'good', modalKey: 'transfer-rate' },
];

// ── Employee Agent Metrics ──
export const eaEffectivenessMetrics: Metric[] = [
  { label: 'Deflection Rate', value: '52%', delta: '+4.3% vs. prior 30 days', deltaType: 'good', modalKey: 'deflection' },
  { label: 'Escalation Rate', value: '8%', delta: '-2.1% vs. prior 30 days', deltaType: 'good', modalKey: 'escalation' },
  { label: 'Abandonment Rate', value: '28%', delta: '-1.5% vs. prior 30 days', deltaType: 'good', modalKey: 'abandonment' },
  { label: 'Engagement Rate', value: '84%', delta: '+5.7% vs. prior 30 days', deltaType: 'good', modalKey: 'engagement' },
  { label: 'Success Rate', value: '46%', delta: '+3.2% vs. prior 30 days', deltaType: 'good', modalKey: 'success' },
];

export const eaUsageMetrics: Metric[] = [
  { label: 'Total Sessions', value: '2,847', delta: '+9.1% vs. prior 30 days', deltaType: 'good', modalKey: 'total-sessions' },
  { label: 'Unique Employees', value: '623', delta: '+14.2% vs. prior 30 days', deltaType: 'good', modalKey: 'unique-users' },
  { label: 'Avg Session Duration', value: '2m 18s', delta: '-8s vs. prior 30 days', deltaType: 'good', modalKey: 'avg-duration' },
  { label: 'Internal Queries', value: '1,920', delta: '+11.3% vs. prior 30 days', deltaType: 'good', modalKey: 'peak-sessions' },
  { label: 'Repeat Usage', value: '78%', delta: '+6.1% vs. prior 30 days', deltaType: 'good', modalKey: 'returning-users' },
];

export const eaSatisfactionMetrics: Metric[] = [
  { label: 'CSAT Score', value: '4.2', delta: '+0.3 vs. prior 30 days', deltaType: 'good', modalKey: 'csat-score' },
  { label: 'Thumbs Up %', value: '76%', delta: '+4.8% vs. prior 30 days', deltaType: 'good', modalKey: 'thumbs-up' },
  { label: 'Thumbs Down %', value: '12%', delta: '-2.3% vs. prior 30 days', deltaType: 'good', modalKey: 'thumbs-down' },
  { label: 'No Feedback', value: '12%', delta: '-2.5% vs. prior 30 days', deltaType: 'good', modalKey: 'no-feedback' },
];

// ── Chart Data ──
export const deflectionChartData = generateTimeSeries(38, 8);
export const escalationChartData = generateTimeSeries(14, 4);
export const abandonmentChartData = generateTimeSeries(42, 10);
export const engagementChartData = generateTimeSeries(71, 8);
export const successChartData = generateTimeSeries(22, 6);
export const usageChartData = generateTimeSeries(140, 30);
export const qualityChartData = generateTimeSeries(3.6, 0.8);
export const latencyChartData = generateTimeSeries(1.8, 0.5);

export const chartDataMap: Record<string, TimeSeriesPoint[]> = {
  'Deflection Rate': deflectionChartData,
  'Escalation Rate': escalationChartData,
  'Abandonment Rate': abandonmentChartData,
  'Engagement Rate': engagementChartData,
  'Success Rate': successChartData,
};

// ── Session Outcome Data ──
export const sessionOutcomeData = [
  { day: '5/1', resolved: 45, escalated: 12, abandoned: 28, pending: 15 },
  { day: '5/2', resolved: 52, escalated: 10, abandoned: 25, pending: 13 },
  { day: '5/3', resolved: 48, escalated: 14, abandoned: 30, pending: 8 },
  { day: '5/4', resolved: 55, escalated: 8, abandoned: 22, pending: 15 },
  { day: '5/5', resolved: 42, escalated: 16, abandoned: 32, pending: 10 },
  { day: '5/6', resolved: 60, escalated: 9, abandoned: 20, pending: 11 },
  { day: '5/7', resolved: 58, escalated: 11, abandoned: 24, pending: 7 },
  { day: '5/8', resolved: 50, escalated: 13, abandoned: 27, pending: 10 },
  { day: '5/9', resolved: 47, escalated: 15, abandoned: 29, pending: 9 },
  { day: '5/10', resolved: 63, escalated: 7, abandoned: 18, pending: 12 },
];

// ── Insights KPIs ──
export const insightsKpis = [
  { label: 'Total Sessions', value: '4,218', badge: null, modalKey: 'total-sessions-insight' },
  { label: 'Average Agent Latency', value: '1.8s', badge: { text: 'Medium', level: 'medium' as const }, modalKey: 'avg-latency-insight' },
  { label: 'Average Quality Score', value: '3.6', badge: { text: 'High', level: 'high' as const }, modalKey: 'avg-quality-insight' },
];

// ── Rankings ──
export const topSubagents: RankingItem[] = [
  { name: 'Order Lookup', sessions: 1240, score: 4.5, level: 'high' },
  { name: 'FAQ Handler', sessions: 980, score: 4.2, level: 'high' },
  { name: 'Billing Support', sessions: 720, score: 3.9, level: 'medium' },
];

export const bottomSubagents: RankingItem[] = [
  { name: 'Returns Processing', sessions: 340, score: 2.1, level: 'low' },
  { name: 'Account Recovery', sessions: 180, score: 1.8, level: 'very-low' },
  { name: 'Complaint Handler', sessions: 290, score: 2.4, level: 'low' },
];

export const topIntents: RankingItem[] = [
  { name: 'Check Order Status', sessions: 890, score: 4.6, level: 'high' },
  { name: 'Reset Password', sessions: 640, score: 4.3, level: 'high' },
  { name: 'Update Address', sessions: 520, score: 3.8, level: 'medium' },
];

export const bottomIntents: RankingItem[] = [
  { name: 'Cancel Subscription', sessions: 210, score: 2.0, level: 'very-low' },
  { name: 'Dispute Charge', sessions: 180, score: 2.3, level: 'low' },
  { name: 'File Complaint', sessions: 150, score: 1.9, level: 'very-low' },
];

// ── Quality by Subagent (donut) ──
export const qualityBySubagent = [
  { name: 'High (4-5)', value: 45, color: '#1a7a40' },
  { name: 'Medium (3-4)', value: 30, color: '#e67e22' },
  { name: 'Low (2-3)', value: 18, color: '#d35400' },
  { name: 'Very Low (1-2)', value: 7, color: '#c0392b' },
];

// ── Performance Insights Breakdown ──
export const breakdownData: BreakdownRow[] = [
  { agentName: 'Pronto Service Agent', subagentLabel: 'Order Lookup', sessions: 1240, avgScore: 4.5, scoreLevel: 'high' },
  { agentName: 'Pronto Service Agent', subagentLabel: 'FAQ Handler', sessions: 980, avgScore: 4.2, scoreLevel: 'high' },
  { agentName: 'Pronto Service Agent', subagentLabel: 'Billing Support', sessions: 720, avgScore: 3.9, scoreLevel: 'medium' },
  { agentName: 'HelloWorld Agent', subagentLabel: 'General Chat', sessions: 560, avgScore: 3.4, scoreLevel: 'medium' },
  { agentName: 'HelloWorld Agent', subagentLabel: 'Knowledge Base', sessions: 430, avgScore: 2.8, scoreLevel: 'low' },
  { agentName: 'Merchant Support Agent', subagentLabel: 'Store Finder', sessions: 340, avgScore: 2.1, scoreLevel: 'low' },
];

// ── Sessions Data ──
export const processedSessions: SessionRow[] = [
  { id: 'SES-001-A7F2', agent: 'Pronto Service Agent', intent: 'Check Order Status', outcome: 'Resolved', outcomeColor: '#1a7a40', quality: '4.5 (High)', qualityLevel: 'high', reasoning: 'Successfully resolved without escalation. User confirmed satisfaction.', timestamp: '2025-05-10 14:23', tags: ['order-status', 'self-service'] },
  { id: 'SES-002-B3K8', agent: 'Pronto Service Agent', intent: 'Return Request', outcome: 'Escalated', outcomeColor: '#e67e22', quality: '2.8 (Low)', qualityLevel: 'low', reasoning: 'Unable to process return due to policy exception. Transferred to human agent.', timestamp: '2025-05-10 14:18', tags: ['returns', 'escalation'] },
  { id: 'SES-003-C9D1', agent: 'HelloWorld Agent', intent: 'Reset Password', outcome: 'Resolved', outcomeColor: '#1a7a40', quality: '4.8 (High)', qualityLevel: 'high', reasoning: 'Password reset completed in single turn. Verification successful.', timestamp: '2025-05-10 14:12', tags: ['auth', 'self-service'] },
  { id: 'SES-004-D2E5', agent: 'Merchant Support Agent', intent: 'Update Store Hours', outcome: 'Abandoned', outcomeColor: '#c0392b', quality: '1.5 (Very Low)', qualityLevel: 'very-low', reasoning: 'User left after 3 failed attempts. Agent could not locate store record.', timestamp: '2025-05-10 14:05', tags: ['merchant', 'data-issue'] },
  { id: 'SES-005-E8F3', agent: 'Pronto Service Agent', intent: 'Billing Inquiry', outcome: 'Resolved', outcomeColor: '#1a7a40', quality: '3.9 (Medium)', qualityLevel: 'medium', reasoning: 'Resolved with accurate billing breakdown. Minor delay in retrieval.', timestamp: '2025-05-10 13:58', tags: ['billing', 'self-service'] },
  { id: 'SES-006-F4G7', agent: 'HelloWorld Agent', intent: 'General FAQ', outcome: 'Resolved', outcomeColor: '#1a7a40', quality: '4.2 (High)', qualityLevel: 'high', reasoning: 'Answered common question from knowledge base. Fast response time.', timestamp: '2025-05-10 13:52', tags: ['faq', 'knowledge-base'] },
  { id: 'SES-007-G1H9', agent: 'Pronto Service Agent', intent: 'Cancel Order', outcome: 'Escalated', outcomeColor: '#e67e22', quality: '3.1 (Medium)', qualityLevel: 'medium', reasoning: 'Order in shipping state, requires manual intervention for cancellation.', timestamp: '2025-05-10 13:45', tags: ['orders', 'escalation'] },
  { id: 'SES-008-H5J2', agent: 'Merchant Support Agent', intent: 'Dispute Charge', outcome: 'Abandoned', outcomeColor: '#c0392b', quality: '2.0 (Low)', qualityLevel: 'low', reasoning: 'Complex dispute requiring documentation. User did not complete upload.', timestamp: '2025-05-10 13:38', tags: ['disputes', 'incomplete'] },
];

export const unprocessedSessions: SessionRow[] = [
  { id: 'SES-101-X2Y4', agent: 'Pronto Service Agent', intent: 'Pending Classification', outcome: 'Processing', outcomeColor: '#666', quality: '--', qualityLevel: 'medium', reasoning: 'Awaiting scorer evaluation', timestamp: '2025-05-10 15:01', tags: ['pending'] },
  { id: 'SES-102-Z7W1', agent: 'HelloWorld Agent', intent: 'Pending Classification', outcome: 'Processing', outcomeColor: '#666', quality: '--', qualityLevel: 'medium', reasoning: 'In queue for quality scoring', timestamp: '2025-05-10 15:00', tags: ['pending'] },
  { id: 'SES-103-A9B3', agent: 'Merchant Support Agent', intent: 'Pending Classification', outcome: 'Processing', outcomeColor: '#666', quality: '--', qualityLevel: 'medium', reasoning: 'Awaiting intent classification', timestamp: '2025-05-10 14:59', tags: ['pending'] },
];

// ── Scorers Data ──
export const scorersData: ScorerRow[] = [
  { name: 'Abandonment Score', version: '1.0', description: 'Indicates whether the customer abandoned the session', agent: 'RAG Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
  { name: 'Abandonment Score', version: '1.0', description: 'Indicates whether the customer abandoned the session', agent: 'Pronto Service Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
  { name: 'Abandonment Score', version: '1.0', description: 'Indicates whether the customer abandoned the session', agent: 'HelloWorld Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
  { name: 'Abandonment Score', version: '1.0', description: 'Indicates whether the customer abandoned the session', agent: 'Merchant Support Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
  { name: 'Abandonment Score', version: '1.0', description: 'Indicates whether the customer abandoned the session', agent: 'Old Agentforce Service Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
  { name: 'Deflection Score', version: '1.0', description: 'Indicates the degree to which the agent deflected the issue', agent: 'RAG Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
  { name: 'Deflection Score', version: '1.0', description: 'Indicates the degree to which the agent deflected the issue', agent: 'HelloWorld Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
  { name: 'Deflection Score', version: '1.0', description: 'Indicates the degree to which the agent deflected the issue', agent: 'Merchant Support Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
  { name: 'Deflection Score', version: '1.0', description: 'Indicates the degree to which the agent deflected the issue', agent: 'Pronto Service Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
  { name: 'Deflection Score', version: '1.0', description: 'Indicates the degree to which the agent deflected the issue', agent: 'Old Agentforce Service Agent', status: 'Active', sampledData: '100%', type: 'Standard' },
];

// ── Alerts Data ──
export const alertsData: AlertItem[] = [
  { id: 'ALT-001', title: 'Escalation Rate Spike — Service Agent', description: 'Escalation rate exceeded 25% threshold for Pronto Service Agent over the past 2 hours. Current rate: 31%.', severity: 'critical', status: 'active', agent: 'Pronto Service Agent', metric: 'Escalation Rate', timestamp: '2025-05-10 14:30', threshold: '25%', currentValue: '31%' },
  { id: 'ALT-002', title: 'Quality Score Drop — Merchant Support', description: 'Average quality score dropped below 2.5 for Merchant Support Agent. Trending down for 3 consecutive days.', severity: 'warning', status: 'active', agent: 'Merchant Support Agent', metric: 'Avg Quality Score', timestamp: '2025-05-10 12:15', threshold: '2.5', currentValue: '2.1' },
  { id: 'ALT-003', title: 'High Abandonment — Returns Flow', description: 'Returns Processing subagent showing 58% abandonment rate, significantly above the 40% threshold.', severity: 'critical', status: 'monitoring', agent: 'Pronto Service Agent', metric: 'Abandonment Rate', timestamp: '2025-05-10 10:45', threshold: '40%', currentValue: '58%' },
  { id: 'ALT-004', title: 'Latency Warning — HelloWorld Agent', description: 'Response latency increased to 3.2s average. Users may experience degraded performance.', severity: 'warning', status: 'monitoring', agent: 'HelloWorld Agent', metric: 'Avg Latency', timestamp: '2025-05-10 09:20', threshold: '2.5s', currentValue: '3.2s' },
  { id: 'ALT-005', title: 'Trust Guardrail Triggered', description: 'Multiple PII detection events in the past hour. 5 sessions flagged for potential data exposure.', severity: 'critical', status: 'active', agent: 'Pronto Service Agent', metric: 'PII Detections', timestamp: '2025-05-10 14:10', threshold: '3/hour', currentValue: '5/hour' },
  { id: 'ALT-006', title: 'Session Volume Anomaly', description: 'Session volume dropped 40% below expected baseline for this time of day. Possible integration issue.', severity: 'info', status: 'monitoring', agent: 'All Agents', metric: 'Total Sessions', timestamp: '2025-05-10 08:00', threshold: '100/hr', currentValue: '60/hr' },
  { id: 'ALT-007', title: 'Deflection Rate Recovery', description: 'Deflection rate has returned to normal levels after FAQ knowledge base update deployed yesterday.', severity: 'info', status: 'resolved', agent: 'HelloWorld Agent', metric: 'Deflection Rate', timestamp: '2025-05-09 16:00', threshold: '30%', currentValue: '42%' },
  { id: 'ALT-008', title: 'Error Rate Normalized', description: 'Error rate spike from earlier today has been resolved. Root cause: temporary API timeout from payment provider.', severity: 'warning', status: 'resolved', agent: 'Pronto Service Agent', metric: 'Error Rate', timestamp: '2025-05-09 11:30', threshold: '5%', currentValue: '1.8%' },
];
