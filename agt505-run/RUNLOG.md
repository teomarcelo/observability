# AGT505 run log

## GitHub
- Created https://github.com/teomarcelo/observability
- origin -> teomarcelo; tmarcelojr kept as backup remote
- main pushed

## Wave 0
- Date: 2026-10-07
- Org login: skipped (Wave 0 prep only; no Salesforce org credentials used)
- Pronto agent script: fetched https://sforce.co/ProntoAgent → herokuapp snippet API; saved full script body to `pronto-agent-script.txt` (8812 chars, 161 lines; starts with `system:`)
- EG checklist: parsed `/tmp/agt505_eg.txt` (from AGT505_FULL_SP26v1-English-EG); wrote `eg-checklist.json` with Ex2 (18 steps) and Ex3 (17 steps) + expected UI labels
- Modal audit: scanned `src/` click targets vs `src/data/modalContent.ts` (`export const modals`); wrote `modal-audit.json` — existingKeys=85, wiredKeys=84, missingKeys=0, unwiredHandlers=0
- Phase tests: Pronto fetch PASS; EG checklist PASS; modal audit PASS (no missingKeys)


## Wave 1 PASS
- Logged in admin@agt505.2224.com (no MFA)
- Pronto Service Agent created from script, user assigned, Live Test 3 utterances, Commit + Activate

## Wave 2 inventory (live org Observe & Optimize)
- Date: 2026-10-07
- Org: agt5052224com.lightning.force.com (already logged in; Pronto Service Agent activated from Wave 1)
- Method: Playwright against live Lightning UI (not Netlify)
- Artifacts:
  - `inventory/analytics.json` (57 items) — Service Agent Analytics filters/tabs/metrics/perf insights
  - `inventory/insights.json` (4 items) — EG Insights nav **absent**; probes + proxies documented
  - `inventory/sessions.json` (44 items) — Processed/Unprocessed, columns, drill-in
  - `inventory/nav.json` (19 items) — Build + Observe & Optimize siblings
  - `inventory/master-checklist.json` — 124 rows; modalExists=86, modalAdd=38
  - Screenshots under `agt505-run/screenshots/`
- Observe nav (org): Analytics | Sessions & Intents | Alerts. No Scorers sibling. No Optimization → Insights.
- Analytics (Service): filters Agent / Timeframe / Channel / Modality; Overview + Performance Insights; Metric Card | Table View; Day granularity; inner tabs Effectiveness, Usage, Quality, Health, Trust, Voice, Custom Scorers
- Effectiveness pills: Deflection Rate, Escalation Rate, Abandon Rate, Engagement Rate, Success Rate (plus Session Outcome / Task Resolution disabled)
- Performance Insights Breakdowns: Subagents | Intents | Actions; Select Subagent/Intent/Metric (default Average Quality Score)
- Sessions: Processed empty (“Processing latest sessions”); Unprocessed had 1 session; columns Session ID, Timestamp, Session Duration, Session Outcome, Initial User Messages, Initial Agent Responses, Subagents, Actions; drill-in Session Log + Session Overview
- Alerts: empty (“Alerts haven't been set up.”) + Einstein Feedback setup link
- EG vs org label diffs: see master-checklist.json `egVsOrgLabelDiffs` (12 entries). Highlights: Optimization/Insights missing; Agent Effectiveness→Effectiveness; Abandonment→Abandon Rate; Quality Overview/Data Explorer→Aggregated Quality Metrics; session-count EG cards vs rate-based org Effectiveness
- No credentials written to RUNLOG or inventory files

## Wave 3 code sync
- Sidebar Observe nav matched to org (removed Scorers)
- Added Custom Scorers category + Task Resolution empty state
- Sessions columns + processing banner + modal keys

## GitHub
- https://github.com/teomarcelo/observability (origin); tmarcelojr kept as remote

## Trailsignup org guideline
- Date: 2026-10-07
- Org: trailsignup (username trailsignup.468870dbe54366@salesforce.com; credentials only in gitignored `.sfauth.json`)
- Auth isolation: Playwright persistent context at `agt505-run/org-trailsignup/.auth-trailsignup/` (does not touch AGT505 `.auth`)
- MFA: none (username-first login.salesforce.com flow; password step after username submit)
- Surfaces visited: Agentforce Studio landing; Analytics (Service + Employee type); Sessions & Intents (Processed + Unprocessed); Alerts; no separate Insights/Scorers Observe nav
- Demo data: **partial** — Analytics populated for Service Agent (e.g. Escalation 20.36%, Engagement 27.54%, Success 8.74%, Unique Sessions 167, Unique Interactions 904, Session Duration 235.69s). Sessions 0/0 No Data. Alerts blank pane. Employee Agent Analytics spinner-only in capture window. Custom Scorers / Trust dashes / Quality not enabled / RAG latency gated.
- Build nav note: Grids present with New badge (teaching app Sidebar currently omits Grids)
- Artifacts:
  - Screenshots: `agt505-run/org-trailsignup/screenshots/` (35 PNGs)
  - Inventory: `agt505-run/org-trailsignup/inventory/{nav,analytics,sessions,alerts,insights,demo-data,diff-vs-agt505}.json`
  - Recommendations: `agt505-run/org-trailsignup/recommended-app-updates.md`
  - Explorer script: `agt505-run/org-trailsignup/explore-trailsignup.cjs`
- Top gaps vs Netlify / AGT505: mock metric bases diverge from org shape; missing Grids; Trust/Voice/Custom Scorers empty copy; Health RAG message; Sessions Evaluations/saved-view chrome; prior-period favorable/unfavorable deltas; Alerts content unconfirmed

## Trailsignup follow-up applied
- Applied high-priority recommendations from org-trailsignup/recommended-app-updates.md
- Grids in Build nav; Trust dash cards; Voice Agent Talk Ratio; Health RAG latency dashes; Custom Scorers empty copy; Trailsignup-shaped mock bases; Sessions chrome (saved views / Evaluations)
- Redeployed af-observability

## Wave 2 inventory follow-up
- Wired remaining master-checklist modal gaps (settings, session drill, sessions toolbar, insights EG note)
- Redeployed af-observability
