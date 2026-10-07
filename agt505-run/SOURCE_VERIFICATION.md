# modalContent.ts documentation source verification

**Date:** 2026-10-07  
**File:** `/Users/tmarcelo/Projects/observability/src/data/modalContent.ts`  
**Method:** HTTP GET + title/body checks via WebFetch; Trailhead MCP `fetch_content` / `content_search`; developer.salesforce.com full-text fetch.  
**Unique HTTPS URLs in file:** 7 (all in the `S` canonical source object; no other `https://` URLs).

## Status legend

| STATUS | Meaning |
| --- | --- |
| CONTENT_OK | Page reaches the right article and body supports the claims modals cite that source for |
| TITLE_ONLY | Shell/SPA reachable; article body not verifiable from fetch tools |
| WRONG_TOPIC | Page exists but does not cover the cited claims |
| BROKEN | 404 or redirect to unrelated / empty |
| STALE_PATH | Content moved to a new official path |

## Summary table

| Source key | URL | STATUS | Evidence (short) | Recommended replacement |
| --- | --- | --- | --- | --- |
| `S.monitor` | https://trailhead.salesforce.com/content/learn/modules/agent-analytics-and-monitoring/get-started-with-agent-monitoring | **CONTENT_OK** | HTTP 200. Unit title: “Agent monitoring: measure, observe, and improve outcomes.” Body: case deflections, “escalations to humans,” “abandonment (users giving up on the agent),” categories Effectiveness/Usage/Quality/Health/Trust/Voice, “overall quality scores and success rates,” Session Tracing. Trailhead MCP module `agent-analytics-and-monitoring` resolves. | None (keep). Prefer pairing Effectiveness metric definitions with `monitor-agent-metrics-and-scores` when citing exact KPI wording. |
| `S.analytics` | https://trailhead.salesforce.com/content/learn/modules/agentforce-analytics-and-monitoring/check-on-your-agent-using-analytics | **BROKEN** | HTTP **404**. Trailhead MCP: `No content found for apiName="agentforce-analytics-and-monitoring"`. Catalog search only returns sibling module `agent-analytics-and-monitoring` (no `agentforce-analytics-and-monitoring`). Search engines still show cached snippets for the old slug; live URL does not. | **MUST:** https://trailhead.salesforce.com/content/learn/modules/agent-analytics-and-monitoring/monitor-agent-metrics-and-scores (label: “Trailhead: Monitor agent performance metrics and quality scores”). Optional secondary: same module’s get-started unit (already `S.monitor`). |
| `S.scorers` | https://developer.salesforce.com/docs/ai/agentforce/guide/testing-api-custom-scorers.html | **CONTENT_OK** | HTTP 200. Title: “Create Custom Scorers for Agent Testing.” Body: `AiAgentScorerDefinition`, `scorerVersion.label` / `versionNumber` / `description`, `agentAssociation.agentApiName` / `isActive`, PromptTemplate engine, up to 100 versions, cannot delete versions. Matches scorer-column and custom-scorer modal claims. | None for scorer-field citations. For **Analytics Quality Score (1–5)** definitions, prefer Trailhead `monitor-agent-metrics-and-scores` (Quality Scores table) rather than this Testing API page. |
| `S.testResults` | https://developer.salesforce.com/docs/ai/agentforce/guide/testing-api-use-results.html | **CONTENT_OK** | HTTP 200. Title: “Use Test Results to Improve Your Agent.” Body: coherence, completeness, conciseness, `output_latency_milliseconds`, `metricScore` PASS/FAILED, instruction adherence HIGH/LOW/UNCERTAIN. | None. |
| `S.testCustomize` | https://developer.salesforce.com/docs/ai/agentforce/guide/agent-dx-test-customize.html | **CONTENT_OK** | HTTP 200. Title: “Customize the Agent Test Spec.” Body covers OOTB metrics (Coherence, Completeness, Conciseness, Latency) and custom evaluations. Note: page labels itself **legacy** vs New Testing Center in Studio (Beta); still valid for cited test-spec/metric claims. | None required. Watch for a future “New Testing Center” doc when Salesforce publishes it. |
| `S.otel` | https://developer.salesforce.com/docs/ai/agentforce/guide/otel-api.html | **CONTENT_OK** | HTTP 200. Title: “Export Agentforce Session Tracing Data (Beta).” Body: OTel/OTLP export of turns, messages, LLM calls, actions, metric scores, feedback; Session Tracing Data Model; Setup path “Einstein Audit, Analytics, and Monitoring Setup”; additive to Studio analytics. | None for OTel/session-trace claims. For dashboard KPI definitions (Unique Sessions, Error Rate, Session Duration), prefer Trailhead `monitor-agent-metrics-and-scores`. |
| `S.news` | https://www.salesforce.com/news/stories/agentforce-studio-observability-tools-announcement/ | **CONTENT_OK** | HTTP 200 (GET). Title: “Salesforce Announces Observability Tools in Agentforce Studio” / “Deepens Observability in Agentforce 360…” (Nov 20, 2025). Body: Agent Analytics, Optimization, Health Monitoring; alerts on errors/latency/escalations; Session Tracing Data Model; Observe & Optimize framing. Supports announcement / alerts / health / Studio observability citations. | Not BROKEN. **Optional policy replace** (newsroom is outside help/trailhead/developer/architect allowlist used by the teaching app): use Trailhead `get-started-with-agent-monitoring` + `monitor-agent-metrics-and-scores` + `monitor-agent-health` for product claims. Keep news only if marketing/announcement citation is intentional. |

## Trailhead URL resolution (explicit check)

| URL | Live result |
| --- | --- |
| https://trailhead.salesforce.com/content/learn/modules/agent-analytics-and-monitoring/get-started-with-agent-monitoring | **Resolves (200).** Full unit body readable. |
| https://trailhead.salesforce.com/content/learn/modules/agentforce-analytics-and-monitoring/check-on-your-agent-using-analytics | **Does not resolve (404).** Module slug gone; no MCP apiName. |

## Claims coverage by source

### `S.monitor` — CONTENT_OK

| Modal claim themes | Supported in page body? |
| --- | --- |
| Deflection / case deflections | Yes — “maximize case deflections,” Effectiveness “rates (%) of case deflections” |
| Escalations to humans | Yes — “minimize escalations to humans” |
| Abandonment / users giving up | Yes — “minimize abandonment (users giving up on the agent…)” |
| Quality scores & success rates | Yes — Agent Analytics shows “overall quality scores and success rates” |
| Measurement categories (Effectiveness, Usage, Quality, Health, Trust, Voice) | Yes — listed under “Measurement Categories in the Monitor Phase” |
| Session tracing / Data 360 | Yes |

### `S.analytics` — BROKEN (replacement CONTENT_OK)

Broken URL cannot support any citation. **Replacement unit** `monitor-agent-metrics-and-scores` explicitly defines:

- Deflection, Escalation, Abandonment, Engagement, Success, Task Resolution rates  
- Unique Sessions / Interactions / Users, Average Interactions Per Session  
- Quality Score 1–5 (+ Faithfulness/Relevance)  
- Error Rate, Session Duration, Agent Interaction Duration  
- Trust + Voice (Interruption Rate)  
- Observe & Optimize → Analytics navigation, filters, Performance Insights  

**Citation nuance after swap:** Trailhead’s Engagement Rate (“reply tied to an agent-triggered action”) and Success Rate (“interactions that included action steps and completed without errors”) differ from some modal prose (e.g. engagement as “past the first message,” success as “user’s goal”). Fixing those modal definitions is separate from URL repair.

### `S.scorers` — CONTENT_OK (with scope note)

Supports: custom scorers, `AiAgentScorerDefinition`, version/label/description/agent/status fields, PromptTemplate engine, standard vs custom distinction when paired with test docs.  
Does **not** define production Agent Analytics Quality Score cards (those are on Trailhead metrics unit).

### `S.testResults` — CONTENT_OK

Supports: interpreting failed tests, coherence/completeness/conciseness, latency milliseconds, instruction adherence scores. Used appropriately for Testing Center / latency / trust-adjacent test metrics.

### `S.testCustomize` — CONTENT_OK

Supports: customizing agent test specs, OOTB quality metrics list, custom evaluations. Legacy disclaimer on page.

### `S.otel` — CONTENT_OK

Supports: OTel export, session ID traces, turns/messages/LLM/actions/scores, Session Tracing Data Model, Setup toggle page name. Weak sole source for Analytics **dashboard** KPI formulas (use Trailhead metrics unit).

### `S.news` — CONTENT_OK for announcement-level claims

Supports: observability in Agentforce Studio, Analytics / Optimization / Health, near-real-time health alerts (errors, latency, escalations), Session Tracing Data Model.  
Does **not** publish metric formulas (deflection %, engagement definition, etc.). Outside preferred doc allowlist for a teaching app.

## Tooling limitations

- `help.salesforce.com` article bodies often return SPA shells only (e.g. “Learn About Agentforce Observability” id=005226932 → TITLE_ONLY / unreadable body via WebFetch). Not used as sole proof.  
- `curl -I` HEAD on some developer.salesforce.com paths returned 404 while GET returned 200 with correct titles; verification used GET + body text.  
- Trailhead MCP cannot fetch the removed `agentforce-analytics-and-monitoring` module (404 confirms deletion, not a tooling miss).

## Priority corrections for modalContent.ts

### MUST apply

1. **Replace `S.analytics` URL and label**

```ts
// FROM (BROKEN)
analytics: {
  label: 'Trailhead: Check On Your Agent Using Analytics',
  url: 'https://trailhead.salesforce.com/content/learn/modules/agentforce-analytics-and-monitoring/check-on-your-agent-using-analytics',
}

// TO
analytics: {
  label: 'Trailhead: Monitor agent performance metrics and quality scores',
  url: 'https://trailhead.salesforce.com/content/learn/modules/agent-analytics-and-monitoring/monitor-agent-metrics-and-scores',
}
```

This single change repairs every modal that cites `S.analytics` (Effectiveness KPIs, Usage, Quality, Health, Voice, filters, Performance Insights, charts, etc.).

### SHOULD apply (content accuracy, not URL status)

After pointing `S.analytics` at the metrics unit, align modal definitions that disagree with Trailhead (especially **Engagement Rate** and **Success Rate** wording). Optional: for Quality Score scale 1–5, cite `S.analytics` (new URL) ahead of or instead of `S.scorers`.

### OPTIONAL (allowlist hygiene)

- Replace or demote `S.news` (`www.salesforce.com/news/...`) to Trailhead units under `agent-analytics-and-monitoring` (`get-started-with-agent-monitoring`, `monitor-agent-metrics-and-scores`, `monitor-agent-health`) for product teaching citations. Keep news only for “announced observability tools” narrative.

### No URL change required

- `S.monitor`, `S.scorers`, `S.testResults`, `S.testCustomize`, `S.otel` — CONTENT_OK on current paths.


## Applied fixes (2026-10-07 follow-up)

1. Replaced broken `S.analytics` URL with `monitor-agent-metrics-and-scores` (body-verified KPI definitions).
2. Added `S.healthAlerts` → `monitor-agent-health` (body-verified Alerts workflow).
3. Added `S.helpObservability` → Help id=005226932 (en_US). WebFetch returns SPA shell only (**TITLE_ONLY**); kept as secondary Help pointer, not sole proof for metric formulas.
4. Rewrote Effectiveness / Usage / Quality / Health / Voice / Trust modal definitions to match Trailhead wording where the unit states them.
5. Removed newsroom (`S.news`) from modal `sources` arrays for product teaching; constant retained in file for optional announcement citation. Prefer Trailhead + developer + Help allowlist.
6. Marked Agent Response Rate and Agent Talk Ratio with `NOT_OFFICIAL` notes where Trailhead body does not define them by name.

Content verification standard used: GET body text must discuss the cited claim (not HTTP 200 alone).
