# 0→Hero

A personal learning workbench with two tracks:

- **AI Engineering**: from your first API call to an evaluated, client-ready agent product.
- **Product Management**: from PM-curious to interview-ready, with AI product craft built in.

Each track has a paced plan, a short curated library, labs with a clear finish line, cheat sheets, and a path to paid work or a role. Content was last reviewed on **16 Nov 2026**.

The site is an atelier. Every page opens on an original landscape painted in your browser from a fixed seed: mountains for AI, coast for PM. The light follows your clock through dawn, day, dusk and night, and you can pin it to day or night. A road crosses the Journey painting with one waypoint per phase, and it is painted gold as you progress. In the Studio each lab is a framed canvas that starts as a pencil sketch and fills with colour as you complete its steps.

| | AI | PM |
| --- | --- | --- |
| Sources | 67 (19 core) | 41 (12 core) |
| Labs | 8 | 8 |
| Phases | 6 | 6 |

## Sections

- **Journey**: choose a goal and weekly hours; the phases ("chapters") resize to fit. Shows what to read and build today, plus dispatches on what changed in 2026.
- **Library**: a catalogue by chapter, with search and filters (core, unread, saved).
- **Studio**: the labs as a gallery of canvases; each has steps with code, a margin note and readings.
- **Field guide**: agent patterns, RAG failure modes, the eval playbook (or the PM equivalents).
- **Offers / Career**: four stages, plus niches with pain, offer, pricing or compensation, and the labs that prove it.

Progress is stored in the browser (`localStorage`, key `ai0.v4.<path>`). Earlier v3 progress is migrated automatically. You can export to JSON or Markdown and import it back from the Journey page or the command palette (⌘K / Ctrl K).

Each painting layer is rendered once to an image, so the drifting clouds and other motion stay smooth. Motion is turned off for anyone who prefers reduced motion.

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
src/art/                the painter: seeded scenes, time-of-day palettes, SVG layers
src/lib/                progress model, plan math, hash router, storage
src/pages/              Journey, Library, Studio, FieldGuide, Market
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
