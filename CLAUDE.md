# lopezmichael.dev

Personal portfolio for Michael Lopez — a data leader in civic tech and social impact.

**Scope of ownership:** Michael leads CPAL's **data operations** (data engineering, platform, internal tools, access). The **strategic analytics** team (consultant-style data scientists doing quick-turnaround prototypes for stakeholders) is not his; once an idea proves its value, it moves to his team and the tech infrastructure team to make it sustainable and access-controlled. Never claim he built or leads CPAL's whole "data function".

**Positioning:** A job-search-ready portfolio, but the job-search intent is kept **discreet**: no public "I'm looking to leave / operate at greater scale" language, because Michael's current employer could find the page. It reads as a strong portfolio under a **"Data Leader · Civic Tech & Social Impact"** identity tagline (switched from "Data Strategist" on 2026-11-03 to match the leadership-only search), leads with **data knowledge** (decisions, domain expertise, analytical rigor, communication) over infrastructure, and keeps consulting ("Work with me") secondary, low-key, and subordinated in nav (no explicit recruiter/full-time callouts). Availability is signaled privately (LinkedIn/recruiters), not on the site. All site prose should go through the `voice-professional` agent; avoid "move the needle," "actionable," "deliver real impact," overusing "at the intersection of," and em dashes in body copy.

## Redesign in progress (Canyon Blush, 2026-11)

A full visual redesign is planned. **Read `docs/design-principles.md` before any UI work**; it supersedes the palette, type, and layout notes below once each phase lands. The phased plan is `docs/plans/2026-11-11-canyon-blush-redesign.md` and the reference mockup is `docs/mockups/canyon-blush.html`.

## Redesign status

Phases 0–6 and the Phase 7 QA checks MERGED to `main` and deployed 2026-11-11 (PR #1). **Remaining work, in order, is in the "Handoff" section at the end of `docs/plans/2026-11-11-canyon-blush-redesign.md`** (terrain look iteration done 2026-11-11; next: copy pass, case-study charts, then the real-device and screen-reader checks, which were skipped before the merge). Every page is on the new components; the legacy color aliases and `ScrollReveal` are gone. Header = name + Work/About/Resume + Dallas clock; footer = "Say hello" + copy-email (no consulting CTA anywhere). Buttons use the `btn-primary` / `btn-outline` utilities (padding at the call site); contact details live in `contact` in `src/data/resume.ts`; card/row images go through `cardShot()` in `src/data/projects.ts`.

## Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS v4 with `@theme` tokens
- **Fonts:** Bricolage Grotesque (display), Instrument Serif, Instrument Sans (body), JetBrains Mono, all self-hosted via `@fontsource`. Inter is kept only for the internal branding preview and the resume/cover-letter PDF scripts.
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
- **Terrain isolation:** Three.js only loads on the home page via `TerrainBand.astro` (a dark band below the hero). `createTerrain(container, state)` in `src/lib/terrain/index.ts` returns a handle (`set`, `dispose`) or null without WebGL. Pure state (modes, labels, seeded params, random draw, time-of-day tint, `?terrain=mode-seed`) lives in `src/lib/terrain/state.ts`. Modes: Canyon, City (a skyline across a river), Prairie, loosely Texas-inspired but tuned for looks. Each load draws a random mode + seed; the only control is Regrow. The ground is a wide strip (`GRID_WIDTH` × `GRID_DEPTH` in `config.ts`) so it spans the band.
- **Palette (Canyon Blush):** tokens in `src/styles/global.css`, documented in `docs/design-principles.md` → Tokens: blush `page`, oxblood `ink`, `muted`, `line`, `wine` (the only highlight: italics, links, focus), `wine-deep` (fills, primary buttons) with `on-wine` text, and the always-dark terrain `band`. Each flips with the theme, so no `dark:` twins. The old names (`primary`, `secondary`, `accent`, `cool`, `canyon`, `light`, `dark-*`, `surface`) no longer exist: Tailwind emits nothing for them, so they fail silently. Use the tokens. The terrain has its own canyon-to-sand ramp (`src/lib/terrain/config.ts`). Avoid teal — collides with CPAL brand.
- **Skills source of truth:** `src/data/resume.ts` — `<SkillsGrid />` (About page) and the Resume page both render from this single export.
- **Project screenshots:** `npm run screenshots` uses Playwright to capture 1280x720 @2x screenshots. Script uses `waitUntil: 'load'` (not `networkidle`) because Shiny apps keep WebSockets open. NTE auto-dismisses its welcome modal before capture. Index rows show a small WebP of the screenshot as a hover preview (`npm run thumbs`).
- **`cardImage` vs `image`:** `Project.image` renders as the hover preview on index rows AND on the detail page (`ProjectFigure`). `Project.cardImage` (optional) is row-only: `cardShot()` prefers it, detail pages ignore it. (Currently no project uses `cardImage`.)
- **Data-infra case-study images:** two case studies have no product UI to screenshot. The eviction workstream shows the **North Texas Evictions** dashboard (`north-texas-evictions.png`) and links to northtexasevictions.org — the standalone `north-texas-evictions` project was removed and folded into this workstream (the eviction card/case study now carries the visit link + screenshot). **Building CPAL's Data Operations** (formerly "Data Function"; `/projects/building-cpal-data-function/` 301s to `/projects/building-cpal-data-operations/` via `vercel.json`) uses an editorial **canyon-terrain illustration** (`cpal-data-function.png`, 1280×720, generated via Playwright from an inline SVG topo field — matches the site's terrain/OG aesthetic).
- **`restricted` flag:** `Project.restricted` suppresses the "Visit live" button, which lives only in `ProjectHeader` (shared by case studies and generic project pages) and gates on `href.startsWith('http') && !project.restricted`. Index rows link to the detail page only. Used for the access-gated Block Walking tool; projects with no public URL (eviction workstream, Building CPAL's Data Operations) use `href: ''`, which fails the `http` check and suppresses the button too.
- **SEO:** `BaseLayout` emits a JSON-LD `@graph` with the Person (role, links and `knowsAbout` derived from `resume.ts`) plus an optional page node. Project pages spread `projectSeo(project, Astro.site, description)` into `BaseLayout`: their own OG image and a `CreativeWork` authored by the Person `@id`.
- **`noindex` prop:** `BaseLayout` accepts `noindex?: boolean` → renders `<meta name="robots" content="noindex, nofollow">`. Used by the internal `/preview/branding/` page, which is ALSO excluded from the sitemap via the `filter` in `astro.config.mjs`.
- **Shared layout pieces:** `LabeledSection` (label column + content; omit `label` for an aligned pull quote; `labelAs="p"` when the content has its own heading), `ProjectIndex` / `ProjectRow`, `ProjectHeader`, `ProjectFigure`, `NextProject`, `ResumeEntry`, `SkillsGrid`. No scroll-triggered reveals: content is visible in the first frame.
- **Analytics:** Vercel Analytics via `@vercel/analytics/astro` `<Analytics />` in BaseLayout. Loads same-origin (`/_vercel/insights/script.js`) in production, so no CSP changes needed. Inert until enabled in the Vercel project dashboard.

## Pages

- **Home** — `MICHAEL` / *Lopez* wordmark hero, terrain band, "Now" statement, 3 featured projects as index rows (`ProjectIndex` / `ProjectRow`, using `Project.hook`)
- **About** — "Hi, I'm *Michael*" header; bio beside an aside (monogram placeholder in wine, role, Dallas, LinkedIn/GitHub); pull quote; "What we've built at CPAL" as a ruled list; Selected media (renders only if `selectedMedia` in `resume.ts` is populated); skills grid. Contact is the footer's "Say hello" (no separate CTA box).
- **Projects** — All projects grouped by category as index rows (`ProjectIndex` / `ProjectRow`: title · hook · first two tags). Each row links to `/projects/[slug]/`.
- **Project detail (`/projects/[slug]/`)** — Dynamic route. `pages/projects/[slug].astro` resolves the slug to either a custom case-study component (Building CPAL's Data Operations / Dallas County Eviction Data / Homestead Map / DigiLab) or the generic `ProjectDetail` view. Case studies use `CaseStudyLayout`: `ProjectHeader`, a metrics row, a `figure` slot (for the case study's interactive chart; falls back to `ProjectFigure`), labeled Problem/Approach/Outcome/Reflection sections via `LabeledSection` (no numerals), an optional pull quote placed before Outcome, "Built with", and a `NextProject` row. Generic projects (`ProjectDetail`) share the header, figure, sections and next row.
- **Resume** — 2-col at `lg+`: left column with contact, PDF download and skills (plain text per category, not sticky); main column with the CPAL timeline (`ResumeEntry`, wine dots), an "Earlier experience" disclosure, education and selected projects.
- **Work with me** (hidden: off nav, noindexed, out of the sitemap) — header, three engagement types as ruled entries (two lists each), "How I work" as a ruled grid, and its own contact block (inquiries are the page's purpose).
- **Branding preview** (`/preview/branding/`) — Internal-only swatch page used while iterating on the OG image and favicon. Kept around for future iteration; `noindex` + excluded from the sitemap so recruiters/crawlers don't surface it.

## Commands

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run preview       # Preview production build
npm run check:design  # Fail on hard-coded colors outside the token files (also runs before every build)
npm run screenshots   # Regenerate project screenshots (requires: npx playwright install chromium)
npm run thumbs        # WebP versions of those screenshots: 520px row-hover previews + 800/1600px figures for project pages (re-run after screenshots)
npm run og            # Link-preview images (site + one per project) and favicons, from the tokens and projects.ts
npm run check:assets  # Fail if a preview card or a screenshot's WebP versions are missing (also runs before every build)
```

## Dark Mode

Tokens flip under `[data-theme="dark"]` in `global.css`, so components use one class per color (`text-ink`, `bg-page`) and need no `dark:` twins. The `dark` custom variant still exists for the rare one-off. The `ThemeToggle` component dispatches a `themechange` CustomEvent (currently unused by terrain since it's always dark).

## Security Headers (vercel.json)

CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection.

## Remaining TODOs

- [x] ~~Fill the 5 case-study `[TODO]` placeholders~~ DONE (real numbers supplied 2026-07-02: eviction ~48K Dallas filings / ~800 tenants to legal rep / 4 counties; Trust Her ~15K women to contraceptive access over 3 yrs; 9 internal teams; DigiLab ~5K tournaments/6mo, 280 cities, ~9K players, 450+ Discord, ~1K DAU). Budget clause was dropped rather than published.
- [ ] Confirm or cut skills NOT evidenced in local repos (may be real at CPAL in repos not audited): `CKAN`, `Prefect` (possibly legacy vs Databricks Workflows), `Anthropic API`, `PostGIS` (vs GeoPandas/sf). Added as evidenced: `Terraform`, `DuckDB`, `Polars`, `Google Cloud Vision (OCR)`. Cut per Michael: `MCP servers` (consumed, not built), `Sentry` (DigiLab only, early on).
- [x] ~~Regenerate `/images/og-image.png`~~ DONE (Canyon Blush, 2026-11-11) — `npm run og` (`scripts/generate-og.mjs`) renders `/images/og-image.png`, one `/images/og/<slug>.png` per project, `favicon.svg` and the favicon PNGs, from the tokens in `global.css`, the terrain ramp and `projects.ts`. The old OG-A recipe on `/preview/branding/` is retired; that page is now just a historical swatch sheet. In a sandbox without Playwright's own browser, set `PW_CHROMIUM_PATH`.
- [ ] Replace ML monogram placeholder on About page with a real photo of Michael
- [x] ~~Add resume PDF + flip `hasResumePdf`~~ DONE — `public/files/Michael_Lopez_Resume.pdf`, a designed 2-page ATS resume (single-column reading order; canyon contour header, timeline spine on CPAL roles, skill chips) rendered via `npm run resume:pdf` (`scripts/generate-resume-pdf.mjs`, Playwright + embedded Inter). `hasResumePdf = true`. The script imports `resume.ts` directly (single source of truth), so re-run it after any `resume.ts` change. Set `PW_CHROMIUM_PATH` where Playwright's own browser isn't installed.
- [x] ~~Configure DNS~~ DONE — `lopezmichael.dev` resolves to Vercel (216.150.1.1) and serves HTTP 200 with the current (merged) content.
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
- **Data-leadership repositioning + revision (2026-07, MERGED to `main` and deployed):** discreet job-search positioning under the "Data Strategist" tagline; data-knowledge-forward hero; new "Building CPAL's Data Function" case study; eviction reframed as a data *workstream* ("Dallas County Eviction Data", four counties); DigiLab reframed toward community + insights (corrected to ~6 months live), re-featured on home; archived DigiLab Shiny removed; About "What we've built" + skills grid reordered to lead with analysis/domain/decisions; Selected Media surfaced above skills; "Work with me" subordinated + rebalanced; block-walking beefed up with screenshot; `restricted` flag + `noindex` prop; skills reconciled against real repos; regenerated OG image; designed 2-page resume PDF (`npm run resume:pdf`); full voice + consistency sweeps. Only the real headshot remains (monogram placeholder for now).
