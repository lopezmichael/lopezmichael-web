# Changelog

## 1.1.0 — 2026-05-03

F2 palette, full content rewrite, three case studies, visual elevation
pass, OG image + favicon, Selected Media, Vercel Analytics. Deployed
to production.

### Added

- F2 canyon palette (charcoal primary, wine cool, canyon decorative, warm orange secondary, sand accent, cream / near-black backgrounds)
- `/work-with-me/` page with engagement types, "How I work" cards, status pulse
- Per-project pages at `/projects/[slug]/` for all projects
- Three full case studies (Dallas County Eviction Pipeline, Dallas Homestead Exemption Map, DigiLab) on shared `CaseStudyLayout`
- Numbered case-study sections (01 Problem / 02 Approach / 03 Outcome / 04 Reflection) with optional pullquote slot and lifted metrics
- Resume sidebar pivot: sticky 2-column at `lg+`, CPAL spine timeline, status pulse
- About editorial hero with bio + ML monogram placeholder, "What we've built at CPAL" numbered list, Selected Media section
- OG image (1200×630, OG-A direction), favicon SVG + 16/32 PNG fallbacks + apple-touch-icon (180px)
- `selectedMedia` populated with two Lab Report data-viz credits and KERA News + D Magazine press features
- Vercel Web Analytics via `@vercel/analytics/astro` (no cookies, same-origin script)
- Editorial canyon-terrain illustration for the Dallas County Eviction Pipeline card (`Project.cardImage`)
- Internal `/preview/branding/` page for OG/favicon iteration
- Mission-first home intro, About bio rewrite, Footer canyon-line silhouette + voicier CTA

### Changed

- Projects page: uniform wide card variant (no separate case-study card)
- Skills tightened (Databricks parenthetical trimmed, Observability merged into Orchestration & Infra, Claude Enterprise rollout dropped)
- Resume role rename: `Manager, Data Analytics` → `Manager, Data`; `Associate, Analytics` → `Associate, Data`
- Director role split into "Director, Data Operations" (Jan 2026 - Present) + "Director, Data" (May 2023 - Dec 2025)
- "Child Poverty Action Lab" prefixed with "the" in narrative prose
- Em-dashes swept across all content (~50 instances)
- Screenshot script hardened: `waitUntil: 'load'` instead of `'networkidle'`, NTE modal auto-dismiss

### Removed

- `ProjectCardCaseStudy.astro` (uniform card design)
- `caseStudySlugs` export (dead code post-uniform-card)
- "30+ R Shiny Dashboards" project entry (it was a count, not a project)

## 1.0.0 — 2026-04-22

Initial rewrite from Quarto to Astro 5 + Tailwind CSS v4.

### Added

- Astro 5 static site with Tailwind CSS v4 theming
- Three.js terrain hero with GPU shaders, particle flow, and UnrealBloom post-processing
- Dark/light mode with smooth terrain color transitions
- Home page with terrain hero, intro section, and project cards
- About page with bio, skills grid, and contact links
- Resume page with full experience, education, and skills
- Responsive design with mobile navigation
- SEO: sitemap, canonical URLs, Open Graph meta, JSON-LD structured data
- Vercel deployment configuration
