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
- **Palette (editorial canyon):** Primary `#2A2520` (charcoal — body, headings, primary buttons), Secondary `#D86B3A` (warm orange — hover states, gradients), Accent `#F2C685` (sand — pill backgrounds), Cool `#8B2D3D` (wine — links, nav active, inline emphasis; despite the "cool" token name it's a warm interactive accent), Canyon `#A04428` (decorative — section dividers, gradient fallbacks, terrain), Neutral `#2A2520` (same as primary). Light bg `#FBF6EE`, dark bg `#1d1411`. Headings stay `text-primary` (charcoal weight does the work); inline emphasis like company/school/tagline uses `text-cool` for visual distinction since primary == neutral. Terrain hero keeps its own canyon-warm palette (see `src/lib/terrain/config.ts`). Avoid teal — collides with CPAL brand.
- **Skills source of truth:** `src/data/resume.ts` — `<SkillsGrid />` (About page) and the Resume page both render from this single export.
- **Project screenshots:** `npm run screenshots` uses Playwright to capture 1280x720 @2x screenshots. Cards show screenshot when available, gradient fallback otherwise.
- **ScrollReveal:** IntersectionObserver-based fade-in-up animations, respects `prefers-reduced-motion`.

## Pages

- **Home** — Terrain hero, intro paragraph, 3 featured project cards
- **About** — Bio, "What I've Built" card, skills grid, optional Selected Media section (renders only if `selectedMedia` in `resume.ts` is populated), contact CTA
- **Projects** — All projects grouped by category with wide screenshot cards. Each card title links to `/projects/[slug]/`; "Visit" external link is separate.
- **Project detail (`/projects/[slug]/`)** — Dynamic route. `pages/projects/[slug].astro` resolves the slug to either a custom case-study component (Eviction Pipeline / Homestead Map / DigiLab) or the generic `ProjectDetail` view. Case studies use the shared `CaseStudyLayout` component which provides hero + screenshot + metrics + Problem/Approach/Outcome/Reflection slot sections + tech stack.
- **Resume** — Experience (primary + collapsible earlier roles), education, skills, selected projects, PDF download
- **Work with me** — Hero, three engagement-type cards, How I work, contact CTA

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
- [ ] Add `public/files/Michael_Lopez_Resume.pdf` and flip `hasResumePdf` to `true` in `ResumePage.astro` to surface the download button
- [ ] Replace About page headshot gradient placeholder with real photo
- [ ] Populate `selectedMedia` in `src/data/resume.ts` to surface the "Selected Media & Visualizations" section on About
- [ ] Deploy to Vercel and configure DNS
- [ ] Astro 6 upgrade deferred — `@tailwindcss/vite` (4.2.4) is incompatible with Astro 6's Rolldown-based Vite (`Missing field 'tsconfigPaths' on BindingViteResolvePluginConfig.resolveOptions`). The blocked advisory (GHSA-j687-52p2-xcff) is `define:vars` XSS which this codebase does not use, so practical exposure is zero. Retry the upgrade when `@tailwindcss/vite` ships an Astro-6-compatible release.
