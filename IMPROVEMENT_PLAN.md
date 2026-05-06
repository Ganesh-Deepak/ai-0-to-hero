# AI 0-to-Hero Improvement Plan

Updated: 2026-04-25

## Current State

- Stack: Vite 8, React 19, exact dependency versions, Node `^20.19.0 || >=22.12.0`.
- Catalogue: 149 curated resources, 12 topics, 6 phases, 9 labs, 9 lab guides, 6 revenue niches.
- Quality gate: lint, tests, data validation, production build, and external link audit.
- Progress safety: localStorage and imported progress JSON are sanitized before use.
- CI: GitHub Actions runs quality checks on pushes/PRs and scheduled/manual link checks.

## Implemented

- Fixed dashboard priority KPI so it counts every unread priority source.
- Repaired broken resource URLs and canonicalized duplicate resource URLs.
- Added current SOTA references for OpenAI Responses, agent evals, trace grading, eval best practices, and agent safety.
- Added catalogue review/link-check metadata to the Library UI.
- Added starter templates for prompt evals, RAG eval planning, and AI-BOM handoff docs.
- Pinned package versions and moved Vite tooling to `devDependencies`.
- Added `npm run lint`, `npm run test`, `npm run check:data`, `npm run check:links`, `npm run check`, and `npm run verify`.
- Added reusable data and external-link validators in `scripts/`.
- Added progress sanitation helpers and regression tests.
- Added README setup, script, deployment, and data-update workflow.
- Added CI workflow at `.github/workflows/quality.yml`.
- Expanded `.gitignore` for generated/local files.

## Next Product Upgrades

1. Resource freshness UI
   - Add per-resource `reviewedAt`, `status`, and `replacedBy` fields for fast-moving docs.
   - Show stale resources as an explicit maintenance queue.

2. Evidence-based labs
   - Add completion evidence fields: repo URL, demo URL, metric, trace link, screenshot, and short note.
   - Add lab proof scoring for tests, evals, traces, citations, safety, and deployment.
   - Add MCP server and trace-grading templates alongside the prompt/RAG/AI-BOM starters.

3. More precise learning paths
   - Convert phases into weekly assignments for each goal.
   - Add "minimum viable path" and "deep path" variants.
   - Add prerequisites and unlock checks between labs.

4. Commercial execution
   - Turn each revenue niche into a delivery pack: demo data, fixed scope, risk checklist, metric calculator, proposal outline, and outreach copy.
   - Add before/after ROI calculators tied to each niche.

5. UI/UX verification
   - Add Playwright smoke tests for all sections, command palette, import/export, theme toggle, and mobile layout.
   - Add accessibility checks for keyboard navigation and dialog focus management.

## Maintenance Cadence

- Weekly: scheduled link check.
- Monthly: docs drift pass for model/provider docs, MCP, evals, safety, and deployment resources.
- Quarterly: SOTA review against official platform docs, OWASP, LMArena, MTEB, SWE-bench, and production agent infrastructure references.
