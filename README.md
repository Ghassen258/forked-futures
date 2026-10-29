# ✦ Forked Futures

**One choice. Infinite almosts.**

An atmospheric interactive microfiction about a message from tomorrow, the consequences of small decisions, and universes just out of reach.

## Features

- **Seven original endings** in a branching, 14-chapter sci-fi story.
- Interactive SVG timeline: follow paths and click visited nodes to rewind.
- Auto-save to browser local storage. No backend, tracking, or API key.
- Keyboard shortcuts: **1** / **2** to choose; **Backspace** to rewind.
- Responsive nebula-inspired interface, reduced-motion support.
- No runtime dependencies, frameworks, or build step.

## Compare alternate timelines

Click **↗↘ Compare timelines** under the Reality Map. Choose a previously visited decision to rewrite and watch the two branching paths unfold side by side, with their different (or sometimes identical) endings. Before making any choice, the button lets you preview the two starting futures.

This deterministic projection preserves subsequent first/second-choice positions where possible, and defaults unplayed choices to the first option. **It does not change saved progress.** The comparison engine and tests are in `compare.mjs` and `compare.test.mjs`.

## Run locally

Because the project uses native ES modules, run a local web server rather than opening the file with `file://`:

```bash
python -m http.server 8000
# Open http://localhost:8000
```

## Run tests

Requires Node.js 18 or newer:

```bash
node --test story.test.mjs compare.test.mjs
node --check app.mjs
node --check compare.mjs
```

## Project structure

- `story.mjs` — original story graph, validation, path sanitization
- `app.mjs` — navigation, state persistence, rendering, interactive SVG graph
- `styles.css` — visual design and responsive styles
- `index.html` — accessible application shell
- `compare.mjs` — branch projection and timeline comparison
- `story.test.mjs`, `compare.test.mjs` — dependency-free Node.js tests

## License

MIT © 2026 Ghassen258.
