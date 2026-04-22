# lopezmichael.dev

Personal portfolio for [Michael Lopez](https://lopezmichael.dev) — data strategist working at the intersection of civic tech, housing policy, and social impact.

Built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and [Three.js](https://threejs.org).

## Features

- **Three.js terrain hero** — GPU-driven wireframe landscape with simplex noise shaders and bloom post-processing. Randomized on every page load with mouse-reactive camera.
- **Dark/light mode** — system preference detection, localStorage persistence, flash prevention. Terrain hero stays dark for visual impact; rest of site follows the toggle.
- **Auto-generated project screenshots** — Playwright captures live screenshots of each project URL for use in project cards.
- **Scroll-reveal animations** — IntersectionObserver fade-in-up effects that respect `prefers-reduced-motion`.
- **Responsive** — mobile hamburger nav, adaptive layouts, touch-friendly.
- **Accessible** — skip-to-content link, ARIA attributes, semantic HTML, reduced-motion support.
- **SEO** — JSON-LD structured data, Open Graph/Twitter meta tags, canonical URLs, sitemap generation.
- **Security headers** — CSP, HSTS, X-Frame-Options, and more via Vercel config.

## Getting Started

```bash
npm install
npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run screenshots` | Regenerate project screenshots (requires Chromium — see below) |

### Regenerating Screenshots

```bash
npx playwright install chromium
npm run screenshots
```

This captures 1280x720 @2x screenshots of each project URL and saves them to `public/images/projects/`.

## Project Structure

```
src/
├── components/       # Header, Footer, ThemeToggle, ProjectCard, ScrollReveal, etc.
├── layouts/          # BaseLayout.astro — HTML shell with meta/OG/JSON-LD
├── lib/terrain/      # Three.js modules: shaders, config, postprocessing, theme
├── page-views/       # Full page compositions (HomePage, AboutPage, ProjectsPage, ResumePage)
├── pages/            # Thin route shells (index.astro → HomePage, etc.)
├── data/             # projects.ts, resume.ts — static content
└── styles/           # global.css — Tailwind v4 @theme tokens and dark mode
public/
├── images/projects/  # Auto-generated project screenshots
└── files/            # Resume PDF
scripts/
└── generate-screenshots.mjs
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5 (static output) |
| Styling | Tailwind CSS v4 |
| Typography | Inter via @fontsource |
| 3D | Three.js with custom GLSL shaders |
| Post-processing | UnrealBloomPass (EffectComposer) |
| Screenshots | Playwright + Chromium |
| Hosting | Vercel |

## Color Palette

The site uses a canyon-inspired earthy palette:

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#8B4D3B` | Brown — headings, links, accents |
| Secondary | `#C4724D` | Orange-brown — hover states, highlights |
| Accent | `#E8C496` | Tan — borders, tags, subtle backgrounds |
| Cool | `#5A7D6B` | Sage green — contrast accent |
| Neutral | `#5C4D45` | Dark brown — body text |

## License

This is a personal portfolio. Code is available for reference but not for redistribution.
