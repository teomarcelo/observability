import { useState, useCallback } from 'react';
import type { Section, AgentType, AnalyticsTab, InnerTab, PerfBreakdown, SessionTab } from '../data/types';

export function useNavigation() {
  const [section, setSection] = useState<Section>('analytics');
  const [agentType, setAgentType] = useState<AgentType>('service');
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsTab>('overview');
  const [innerTab, setInnerTab] = useState<InnerTab>('effectiveness');
  const [perfBreakdown, setPerfBreakdown] = useState<PerfBreakdown>('subagents');
  const [sessionTab, setSessionTab] = useState<SessionTab>('processed');
  const [optExpanded, setOptExpanded] = useState(true);

  const navigate = useCallback((s: Section) => {
    setSection(s);
    if (s === 'analytics') {
      setAnalyticsTab('overview');
      setInnerTab('effectiveness');
    }
    if (s === 'sessions') {
      setSessionTab('processed');
    }
  }, []);

  const toggleOpt = useCallback(() => setOptExpanded(v => !v), []);

  return {
    section, navigate,
    agentType, setAgentType,
    analyticsTab, setAnalyticsTab,
    innerTab, setInnerTab,
    perfBreakdown, setPerfBreakdown,
    sessionTab, setSessionTab,
    optExpanded, toggleOpt,
  };
}
