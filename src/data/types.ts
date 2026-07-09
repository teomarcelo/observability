export type AgentType = 'service' | 'employee';
export type Section = 'analytics' | 'insights' | 'sessions' | 'scorers' | 'alerts';
export type AnalyticsTab = 'overview' | 'performance-insights';
export type InnerTab = 'effectiveness' | 'usage' | 'user-satisfaction' | 'quality' | 'health' | 'trust' | 'voice';
export type PerfBreakdown = 'subagents' | 'intents' | 'actions';
export type SessionTab = 'processed' | 'unprocessed';

export interface Metric {
  label: string;
  value: string;
  delta: string;
  deltaType: 'good' | 'bad';
  modalKey: string;
}

export interface TimeSeriesPoint {
  day: string;
  value: number;
}

export interface SessionRow {
  id: string;
  agent: string;
  intent: string;
  outcome: string;
  outcomeColor: string;
  quality: string;
  qualityLevel: 'high' | 'medium' | 'low' | 'very-low';
  reasoning: string;
  timestamp: string;
  tags: string[];
}

export interface ScorerRow {
  name: string;
  version: string;
  description: string;
  agent: string;
  status: 'Active' | 'Inactive';
  sampledData: string;
  type: 'Standard' | 'Custom';
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'resolved' | 'monitoring';
  agent: string;
  metric: string;
  timestamp: string;
  threshold: string;
  currentValue: string;
}

export interface RankingItem {
  name: string;
  sessions: number;
  score: number;
  level: 'high' | 'medium' | 'low' | 'very-low';
}

export interface BreakdownRow {
  agentName: string;
  subagentLabel: string;
  sessions: number;
  avgScore: number;
  scoreLevel: 'high' | 'medium' | 'low' | 'very-low';
}

export interface ModalContent {
  tabLabel: string;
  title: string;
  rows: { label: string; value: string }[];
  useCase?: string;
  action?: string;
}
