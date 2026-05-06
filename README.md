# AI 0-to-Hero

A personal AI learning workbench for moving from foundations to evaluated, production-ready, sellable AI systems. The app is intentionally data-driven: roadmap phases, resources, labs, concepts, and revenue niches live in `src/data`.

## What It Includes

- 149 curated resources across foundations, LLM API craft, transformers, RAG, agents, MCP, orchestration, evals, safety, automation, production, and revenue.
- A 16-week roadmap that adapts to weekly hours and goal.
- Lab guides with prerequisites, starter commands, walkthroughs, gotchas, verification checks, and linked readings.
- Starter templates for prompt evals, RAG eval planning, and AI-BOM handoff docs in `templates/`.
- Progress persistence, import/export, markdown progress reports, command palette, theme toggle, and resource filtering.
- Data validation, link checking, linting, tests, and CI.

## Setup

```bash
npm ci
npm run dev
```

Local app: `http://127.0.0.1:5173/`

## Scripts

```bash
npm run dev          # start Vite locally
npm run build        # production build
npm run preview      # preview built app
npm run lint         # ESLint
npm run test         # Vitest
npm run check:data   # validate data graph and catalogue schema
npm run check:links  # validate external resource links
npm run check        # lint, test, data validation, build
npm run verify       # full check plus external link audit
```

`check:links` treats `401`, `403`, and `429` as blocked-but-present because some documentation and publishing sites reject automated requests.

## Data Update Workflow

1. Add or update resources in `src/data/resources.js`.
2. Prefer official docs, living specs, maintained repos, and benchmark leaderboards for fast-moving AI topics.
3. Run `npm run check:data`.
4. Run `npm run check:links`.
5. Update lab guide links if a new resource should become required background reading.
6. Update `resourceCatalogMeta` in `src/data/resources.js`.
7. Run `npm run check`.

## Progress Safety

Browser progress and imported JSON are sanitized before use. Unknown resource IDs, invalid lab task indexes, unsafe weekly-hour values, invalid sections, unknown goals, unknown niches, and bad theme values are dropped or clamped.

## Deployment

The app is static and deploys cleanly to Vercel or any static host.

```bash
npm run build
```

Commit source files, `package-lock.json`, README/docs, tests, scripts, and workflow files. Do not commit `.vercel`, `node_modules`, `dist`, or local Claude settings.
