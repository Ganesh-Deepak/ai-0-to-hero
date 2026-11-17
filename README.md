# 0→Hero

A personal learning workbench with two tracks:

- **AI Engineering**: from your first API call to an evaluated, client-ready agent product.
- **Product Management**: from PM-curious to interview-ready, with AI product craft built in.

Each track has a paced plan, a short curated library, labs with a clear finish line, cheat sheets, and a path to paid work or a role. Content was last reviewed on **16 Nov 2026**.

| | AI | PM |
| --- | --- | --- |
| Sources | 67 (19 core) | 41 (12 core) |
| Labs | 8 | 8 |
| Phases | 6 | 6 |

## Sections

- **Plan**: choose a goal and weekly hours; the phases resize to fit. Shows what to read and build next, plus what changed in 2026.
- **Library**: search and filter by topic or status (core, unread, saved).
- **Labs**: step checklists with code, pitfalls, required reading and a "shipped" state.
- **Reference**: agent patterns, RAG failure modes, the eval playbook (or the PM equivalents).
- **Offers / Career**: niches with pain, offer, pricing or compensation, and the labs that prove it.

Progress is stored in the browser (`localStorage`, key `ai0.v4.<path>`). Earlier v3 progress is migrated automatically. You can export to JSON or Markdown and import it back from the Plan page or the command palette (⌘K / Ctrl K).

## Develop

```bash
npm ci
npm run dev
```

```bash
npm run check        # lint, tests, data validation, build
npm run check:links  # external link audit (needs open network)
```

Requires Node `^20.19.0 || >=22.12.0`.

## Project layout

```
src/data/ai.js, pm.js   all content for a track (meta, topics, phases, resources, labs, reference, offers)
src/data/paths.js       registry and lookup indexes
src/lib/                progress model, plan math, hash router, storage
src/pages/              Plan, Library, Labs, Reference, Offers
src/components/         header, command palette, shared UI
templates/              prompt-eval, rag-eval and AI-BOM starters
scripts/                data validator and link checker
```

## Updating content

1. Edit `src/data/ai.js` or `src/data/pm.js`. Every resource needs a `why` (why it earns its slot) and a `todo` (what to do with it).
2. Prefer official docs, specs and maintained repos for fast-moving topics. Keep the catalogue small; remove something for each addition.
3. If you rename an id, add the old id to `ALIASES` in `src/lib/progress.js` so saved progress survives.
4. Bump `reviewed` in the track's `meta`, then run `npm run check` and `npm run check:links`.

## Deploy

The site is static: hash routing, no server, no environment variables. Vercel detects Vite automatically (`npm run build` → `dist/`).
