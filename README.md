# lopezmichael.dev

Personal portfolio for [Michael Lopez](https://lopezmichael.dev) — data strategist working at the intersection of civic tech, housing policy, and social impact.

Built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and [Three.js](https://threejs.org).

## Features

- **Three.js terrain hero** — GPU-driven wireframe landscape with simplex noise shaders and bloom post-processing. Randomized on every page load with mouse-reactive camera.
- **Dark/light mode** — system preference detection, localStorage persistence, flash prevention. Terrain hero stays dark for visual impact; rest of site follows the toggle.
- **Auto-generated project screenshots** — Playwright captures live screenshots of each project URL for use in project cards.
- **Case study layout** — shared `CaseStudyLayout` with numbered Problem/Approach/Outcome/Reflection sections, lifted metrics, optional pullquote slot.
- **Scroll-reveal animations** — IntersectionObserver fade-in-up effects that respect `prefers-reduced-motion`.
- **Responsive** — mobile hamburger nav, adaptive layouts, touch-friendly.
- **Accessible** — skip-to-content link, ARIA attributes, semantic HTML, reduced-motion support.
- **SEO** — JSON-LD structured data, Open Graph/Twitter meta tags, canonical URLs, sitemap generation.
- **Security headers** — CSP, HSTS, X-Frame-Options, and more via Vercel config.
- **Privacy-friendly analytics** — Vercel Web Analytics, same-origin script, no cookies, no consent banner.

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
| Analytics | Vercel Web Analytics |
| Hosting | Vercel |

## Color Palette

Editorial canyon palette (F2):

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#2A2520` | Charcoal — body, headings, primary buttons |
| Secondary | `#D86B3A` | Warm orange — hover states, gradients |
| Accent | `#F2C685` | Sand — pill backgrounds, ring accents |
| Cool | `#8B2D3D` | Wine — links, nav active, inline emphasis (warm interactive accent despite the token name) |
| Canyon | `#A04428` | Decorative — section dividers, gradient fallbacks, terrain wireframe |
| Neutral | `#2A2520` | Token-compat alias for Primary |
| Light bg | `#FBF6EE` | Cream page background |
| Dark bg | `#1d1411` | Near-black page background |

Avoid teal: it collides with CPAL brand.

## License

This is a personal portfolio. Code is available for reference but not for redistribution.
