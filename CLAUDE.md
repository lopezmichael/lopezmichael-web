# lopezmichael.dev

Personal portfolio for Michael Lopez — a data leader in civic tech and social impact.

**Positioning:** A job-search-ready portfolio, but the job-search intent is kept **discreet**: no public "I'm looking to leave / operate at greater scale" language, because Michael's current employer could find the page. It reads as a strong portfolio under a **"Data Strategist · Civic Tech & Social Impact"** identity tagline (he prefers this over "data leader"), leads with **data knowledge** (decisions, domain expertise, analytical rigor, communication) over infrastructure, and keeps consulting ("Work with me") secondary, low-key, and subordinated in nav (no explicit recruiter/full-time callouts). Availability is signaled privately (LinkedIn/recruiters), not on the site. All site prose should go through the `voice-professional` agent; avoid "move the needle," "actionable," "deliver real impact," overusing "at the intersection of," and em dashes in body copy.

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
- **Project screenshots:** `npm run screenshots` uses Playwright to capture 1280x720 @2x screenshots. Script uses `waitUntil: 'load'` (not `networkidle`) because Shiny apps keep WebSockets open. NTE auto-dismisses its welcome modal before capture. Cards show screenshot when available, gradient fallback otherwise.
- **`cardImage` vs `image`:** `Project.image` renders in cards AND on the case study detail page. `Project.cardImage` (optional) is card-only — cards prefer it over `image`, detail pages ignore it. Used for the eviction-workstream canyon-terrain placeholder so the card shows imagery while the case study page renders no screenshot.
- **`restricted` flag:** `Project.restricted` suppresses the "Visit"/"Visit live" button — ProjectCardWide, ProjectDetail, and CaseStudyLayout all gate on `href.startsWith('http') && !project.restricted`. Used for the access-gated Block Walking tool; projects with no public URL (eviction workstream, Building CPAL's Data Function) use `href: ''`, which fails the `http` check and suppresses the button too.
- **`noindex` prop:** `BaseLayout` accepts `noindex?: boolean` → renders `<meta name="robots" content="noindex, nofollow">`. Used by the internal `/preview/branding/` page, which is ALSO excluded from the sitemap via the `filter` in `astro.config.mjs`.
- **ScrollReveal:** IntersectionObserver-based fade-in-up animations, respects `prefers-reduced-motion`.
- **Analytics:** Vercel Analytics via `@vercel/analytics/astro` `<Analytics />` in BaseLayout. Loads same-origin (`/_vercel/insights/script.js`) in production, so no CSP changes needed. Inert until enabled in the Vercel project dashboard.

## Pages

- **Home** — Terrain hero, intro paragraph, 3 featured project cards
- **About** — Bio (opens in present, then origin story), pullquote, "What we've built at CPAL" numbered list, skills grid, Selected Media section (renders only if `selectedMedia` in `resume.ts` is populated), contact CTA. Headshot is currently an ML monogram placeholder on canyon-orange.
- **Projects** — All projects grouped by category. Uniform `ProjectCardWide` (image column + content side); no separate case-study card variant. Each card title links to `/projects/[slug]/`; "Visit" external link is separate.
- **Project detail (`/projects/[slug]/`)** — Dynamic route. `pages/projects/[slug].astro` resolves the slug to either a custom case-study component (Building CPAL's Data Function / Dallas County Eviction Data / Homestead Map / DigiLab) or the generic `ProjectDetail` view. Case studies use the shared `CaseStudyLayout` component which provides hero + numbered Problem/Approach/Outcome/Reflection slots + lifted metrics + optional pullquote slot + tech stack.
- **Resume** — Sticky 2-col at `lg+`: sidebar with skills/contact/status, main column with CPAL spine timeline + earlier roles disclosure.
- **Work with me** — Hero with status pulse, three numbered engagement-type cards, four "How I work" cards, contact CTA.
- **Branding preview** (`/preview/branding/`) — Internal-only swatch page used while iterating on the OG image and favicon. Kept around for future iteration; `noindex` + excluded from the sitemap so recruiters/crawlers don't surface it.

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

- [x] ~~Fill the 5 case-study `[TODO]` placeholders~~ DONE (real numbers supplied 2026-07-02: eviction ~48K Dallas filings / ~800 tenants to legal rep / 4 counties; Trust Her ~15K women to contraceptive access over 3 yrs; 9 internal teams; DigiLab ~5K tournaments/6mo, 280 cities, ~9K players, 450+ Discord, ~1K DAU). Budget clause was dropped rather than published.
- [ ] Confirm or cut skills NOT evidenced in local repos (may be real at CPAL in repos not audited): `CKAN`, `Sentry`, `Prefect` (possibly legacy vs Databricks Workflows), `MCP servers`, `Anthropic API`, `PostGIS` (vs GeoPandas/sf). Added as evidenced: `Terraform`, `DuckDB`, `Polars`, `Google Cloud Vision (OCR)`.
- [ ] Regenerate `/images/og-image.png` if it still shows the retired "Data Strategist" tagline — it's the OG/Twitter image on every route, so a stale title shows in every social share. Source mock: `/preview/branding/`.
- [ ] Replace ML monogram placeholder on About page with a real photo of Michael
- [ ] Add `public/files/Michael_Lopez_Resume.pdf` and flip `hasResumePdf` to `true` in `ResumePage.astro` to surface the download button
- [ ] Configure DNS so `lopezmichael.dev` points at the Vercel deployment
- [ ] Enable Web Analytics in the Vercel project dashboard (the `<Analytics />` component is wired but inert until then)
- [ ] Astro 6 upgrade deferred — `@tailwindcss/vite` (4.2.4) is incompatible with Astro 6's Rolldown-based Vite (`Missing field 'tsconfigPaths' on BindingViteResolvePluginConfig.resolveOptions`). The blocked advisory (GHSA-j687-52p2-xcff) is `define:vars` XSS which this codebase does not use, so practical exposure is zero. Retry the upgrade when `@tailwindcss/vite` ships an Astro-6-compatible release.

## Done since the previous CLAUDE.md snapshot

- F2 palette + mission-first content rewrite shipped.
- `/work-with-me/` page added.
- Three full case studies (Eviction Pipeline / Homestead Map / DigiLab) wired through `CaseStudyLayout`.
- Phase B visual elevation: resume sidebar pivot, case-study numbered sections + pullquote, About editorial hero, uniform projects cards, Header/Footer polish.
- Phase 5: OG image (`/images/og-image.png`), favicon SVG + PNG fallbacks + apple-touch-icon (no `.ico` — modern browsers don't need it).
- `selectedMedia` populated (two Lab Report data-viz credits, KERA News, D Magazine).
- Vercel Analytics wired in BaseLayout.
- Editorial canyon-terrain illustration for the eviction-workstream card (uses `cardImage`).
- Merged to `main` and deployed.
- **Data-leadership repositioning (2026-07, on `develop`, NOT yet merged to `main` — blocked on the 5 case-study `[TODO]`s above):** data-knowledge-forward hero taglines + "What I'm looking for" statements; new "Building CPAL's Data Function" case study; eviction reframed as a data *workstream* and retitled "Dallas County Eviction Data"; DigiLab reframed toward community + insights and re-featured on home; About "What we've built" + skills grid reordered to lead with analysis/domain/decisions; Selected Media surfaced above skills; "Work with me" subordinated in nav; `restricted` flag + `noindex` prop added; full voice + consistency sweep.
