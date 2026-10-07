# Recommended teaching-app updates (from Trailsignup org)

Proposals only. Main agent should apply selectively. Prefer org UI labels; keep click-to-learn modals; do not invent Salesforce formulas.

## High priority (label / structure match)

1. **Build nav: add Grids**  
   - Org shows `Grids` under Build with a `New` badge (between Tests and Prompt Templates).  
   - Update `Sidebar.tsx` `buildItems` + modal key (e.g. `build-grids`) explaining Grids is a Build surface, not Observe.

2. **Custom Scorers empty copy**  
   - Org: “Your custom scorers will appear here / Create and activate a scorer in Agentforce Studio to start tracking trends over time.”  
   - Align `OverviewTab` / Custom Scorers empty state + modal text.

3. **Trust metrics presentation**  
   - Org shows **Aggregated Trust Metrics** with cards: Instruction Adherence Rate (`-`), Toxicity Score (`-`).  
   - App currently uses Einstein Feedback disabled empty state only. Prefer dual path: dash cards when surface loads, plus enablement messaging if docs confirm.

4. **Voice: Agent Talk Ratio**  
   - Org Voice pills: Interruption Rate (0%), Agent Talk Ratio (`-`).  
   - Add metric def + modal stub; do not invent formulas.

5. **Health RAG gating**  
   - Org latency metrics show: “RAG metrics require RAG to be enabled. Enable it from Setup…”  
   - Mirror empty/disabled copy for latency percentiles (P50/P90/P95/P99).

## Medium priority (demo data richness)

6. **Optional Trailsignup seed preset in `mockData.ts`**  
   Representative Service Agent Last-30-Days shape from this org (for a denser teaching demo than empty trial):

   | Metric | Org value |
   |--------|-----------|
   | Deflection Rate | 0% |
   | Escalation Rate | 20.36% |
   | Abandon Rate | 0% |
   | Engagement Rate | 27.54% |
   | Success Rate | 8.74% |
   | Unique Sessions | 167 |
   | Unique Interactions | 904 |
   | Unique Users | 0 |
   | Session Duration (seconds) | 235.69 |
   | Error Rate | 0% |
   | Interruption Rate | 0% |

   Keep existing Pronto/AGT505 seeded agents for workshop narrative; offer preset toggle or alternate seed constants.

7. **Prior-period deltas**  
   - Org shows “+29.1% (favorable)” / “−14.1% (unfavorable)” vs prior 30 days with absolute change.  
   - If teaching app cards support deltas, match wording; do not invent thresholds.

8. **Sessions chrome**  
   - Default Agent filter label seen: **Service Employee Agent**.  
   - Controls: New Saved View, Evaluations dropdown, Select Fields to Display, CSV download.  
   - Empty: “No Data” / “0 processed sessions” / “0 unprocessed sessions”.  
   - Keep AGT505 processing banner as a teachable state (not present in Trailsignup at capture).

## Low priority / do not overfit

9. **Alerts** — Org Alerts pane was blank; do not invent alert list UI from Trailsignup. Keep existing teaching Alerts if already modal-wired; mark inventory as unconfirmed.

10. **Employee Agent** — Capture showed spinner-only; keep Employee tabs but note empty/loading as valid org state.

11. **Table View** — Control exists; content did not finish loading. Keep toggle; avoid fabricating table columns beyond what AGT505 already documented.

12. **Observe nav** — Confirmed Analytics / Sessions & Intents / Alerts only (Scorers out of Observe). No change needed if already synced from AGT505 Wave 3.

## Modal keys to add/adjust (suggested)

- `build-grids`
- `custom-scorers-empty` (org copy)
- `trust-instruction-adherence`, `trust-toxicity` (dash state)
- `voice-agent-talk-ratio`
- `health-rag-latency` (RAG enablement message)
- `sessions-evaluations`, `sessions-saved-view`

## Do not change

- Netlify production deploy (unless separately requested).
- Invented metric formulas or thresholds not in Salesforce docs.
- Credentials / `.auth-trailsignup` / `.sfauth.json` (gitignored only).
