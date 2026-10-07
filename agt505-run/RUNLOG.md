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

## Wave 2 (partial → sufficient for sync)
- Analytics body inventory + Sessions Unprocessed (1 session after Ex2)
- Org Observe nav: Analytics, Sessions & Intents, Alerts (no Scorers; no separate Insights)

## Wave 3 code sync
- Sidebar Observe nav matched to org (removed Scorers)
- Added Custom Scorers category + Task Resolution empty state
- Sessions columns + processing banner + modal keys

## GitHub
- https://github.com/teomarcelo/observability (origin); tmarcelojr kept as remote
