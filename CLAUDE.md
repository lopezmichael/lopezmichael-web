# lopezmichael.dev

Personal portfolio for Michael Lopez — data strategist at the intersection of civic tech and social impact.

## Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS v4 with `@theme` tokens
- **Font:** Inter (via `@fontsource/inter`)
- **3D:** Three.js terrain hero with GPU shaders and bloom post-processing
- **Screenshots:** Playwright (dev dependency) for auto-generating project preview images
- **Hosting:** Vercel
- **Domain:** lopezmichael.dev

## Architecture

```
src/
├── components/       # Reusable UI components (Header, Footer, ThemeToggle, etc.)
├── layouts/          # BaseLayout.astro — HTML shell with meta/OG/JSON-LD
├── lib/terrain/      # Three.js terrain modules (shaders, postprocessing, theme)
├── page-views/       # Full page compositions (HomePage, AboutPage, ProjectsPage, ResumePage)
├── pages/            # Thin route shells that import page-views
├── data/             # Static content data (projects.ts, resume.ts)
└── styles/           # global.css with Tailwind @theme tokens
public/
├── images/projects/  # Auto-generated project screenshots
├── images/           # OG image, headshot, etc.
└── files/            # Resume PDF
scripts/
└── generate-screenshots.mjs  # Playwright screenshot generator
```

## Key Patterns

- **Thin page shells:** `src/pages/index.astro` just renders `<HomePage />`. All logic lives in `src/page-views/`.
- **Theme toggle:** `data-theme="dark"` attribute on `<html>`. Flash prevention via inline `<script is:inline>` in `<head>`. Validated localStorage read (allowlist for 'dark'/'light').
- **Terrain always dark:** Three.js hero renders in dark mode regardless of site theme. Canyon wireframe on near-black background for maximum visual impact. No theme transition code — simple and clean.
- **Terrain isolation:** Three.js only loads on the home page via dynamic import in `TerrainHero.astro`.
- **Canyon palette:** Primary `#8B4D3B`, Secondary `#C4724D`, Accent `#E8C496`, Cool `#5A7D6B`, Neutral `#5C4D45`.
- **Project screenshots:** `npm run screenshots` uses Playwright to capture 1280x720 @2x screenshots. Cards show screenshot when available, gradient fallback otherwise.
- **ScrollReveal:** IntersectionObserver-based fade-in-up animations, respects `prefers-reduced-motion`.

## Pages

- **Home** — Terrain hero, intro paragraph, 3 featured project cards
- **About** — Bio, "What I've Built" card, skills grid, contact CTA
- **Projects** — All projects grouped by category (civic, personal, open-source) with wide screenshot cards
- **Resume** — Experience (primary + collapsible earlier roles), education, skills, selected projects, PDF download

## Commands

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run preview       # Preview production build
npm run screenshots   # Regenerate project screenshots (requires: npx playwright install chromium)
```

## Dark Mode

Custom variant `@custom-variant dark` in global.css targets `[data-theme="dark"]`. All components use `dark:` Tailwind utilities. The `ThemeToggle` component dispatches a `themechange` CustomEvent (currently unused by terrain since it's always dark).

## Security Headers (vercel.json)

CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection.

## Remaining TODOs

- [ ] Add `public/favicon.ico`
- [ ] Add `public/images/og-image.png` (social sharing preview)
- [ ] Add `public/files/Michael_Lopez_Resume.pdf`
- [ ] Replace About page headshot gradient placeholder with real photo
- [ ] Deploy to Vercel and configure DNS
