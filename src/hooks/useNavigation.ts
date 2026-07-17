import { useState, useCallback, useMemo } from 'react';
import type {
  Section, AgentType, AnalyticsTab, InnerTab, PerfBreakdown, ViewMode, SessionTab,
} from '../data/types';
import { tabsFor, breakdownItems, PERF_METRIC_OPTIONS } from '../data/mockData';

export function useNavigation() {
  const [section, setSection] = useState<Section>('analytics');
  const [agentType, setAgentTypeState] = useState<AgentType>('service');
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsTab>('overview');
  const [innerTab, setInnerTabState] = useState<InnerTab>('effectiveness');
  const [subMetric, setSubMetric] = useState<string>('deflection');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [granularity, setGranularity] = useState('Day');

  // filters
  const [agent, setAgent] = useState('All');
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [channel, setChannel] = useState('All');
  const [modality, setModality] = useState('All');

  // performance insights
  const [perfBreakdown, setPerfBreakdownState] = useState<PerfBreakdown>('subagents');
  const [perfSelectItem, setPerfSelectItem] = useState('All');
  const [perfMetric, setPerfMetric] = useState(PERF_METRIC_OPTIONS[0]);

  // sessions
  const [sessionTab, setSessionTab] = useState<SessionTab>('processed');

  const firstMetricOf = useCallback((at: AgentType, tab: InnerTab): string => {
    const def = tabsFor(at).find(t => t.id === tab);
    return def?.metrics?.[0]?.key ?? '';
  }, []);

  const setAgentType = useCallback((at: AgentType) => {
    setAgentTypeState(at);
    // Reset to a tab that exists for this agent type
    setInnerTabState('effectiveness');
    setSubMetric(firstMetricOf(at, 'effectiveness'));
    if (at === 'employee' && modality !== 'All') setModality('All');
  }, [firstMetricOf, modality]);

  const setInnerTab = useCallback((tab: InnerTab) => {
    setInnerTabState(tab);
    const first = firstMetricOf(agentType, tab);
    if (first) setSubMetric(first);
  }, [agentType, firstMetricOf]);

  const setPerfBreakdown = useCallback((bd: PerfBreakdown) => {
    setPerfBreakdownState(bd);
    setPerfSelectItem('All');
  }, []);

  const navigate = useCallback((s: Section) => {
    setSection(s);
    if (s === 'analytics') { setAnalyticsTab('overview'); }
    if (s === 'sessions') { setSessionTab('processed'); }
  }, []);

  const perfItems = useMemo(() => breakdownItems(perfBreakdown), [perfBreakdown]);

  return {
    section, navigate,
    agentType, setAgentType,
    analyticsTab, setAnalyticsTab,
    innerTab, setInnerTab,
    subMetric, setSubMetric,
    viewMode, setViewMode,
    granularity, setGranularity,
    agent, setAgent,
    timeframe, setTimeframe,
    channel, setChannel,
    modality, setModality,
    perfBreakdown, setPerfBreakdown,
    perfSelectItem, setPerfSelectItem,
    perfMetric, setPerfMetric,
    perfItems,
    sessionTab, setSessionTab,
  };
}

export type Nav = ReturnType<typeof useNavigation>;
