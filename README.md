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

## Run locally

Because the project uses native ES modules, run a local web server rather than opening the file with `file://`:

```bash
python -m http.server 8000
# Open http://localhost:8000
```

## Run tests

Requires Node.js 18 or newer:

```bash
node --test story.test.mjs
node --check app.mjs
```

## Deploy

Host the static files on GitHub Pages, Netlify, Vercel, or any static host. No environment variables are required.

## Project structure

- `story.mjs` — original story graph, validation, path sanitization
- `app.mjs` — navigation, state persistence, rendering, interactive SVG graph
- `styles.css` — visual design and responsive styles
- `index.html` — accessible application shell
- `story.test.mjs` — dependency-free Node.js tests

## License

MIT © 2026 Ghassen258.
