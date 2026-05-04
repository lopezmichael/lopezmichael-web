# Roadmap

## Where we are (as of 2026-05-03)

The site is **shipped to production**. `develop` and `main` are in sync at `48d0a94`,
deployed via Vercel. Phases A, B, and 5 are all in. What's left is loose ends (real
headshot, resume PDF, DNS) and the optional Phase C / Phase D content surfaces.

This roadmap is the entry point for the next work session.

## Recommended order of operations

1. **Loose ends** — DNS for `lopezmichael.dev`, real headshot, resume PDF.
2. **Phase C** — new content surfaces (CPAL Platform Migration case study, AI-enabled Data Ops case study, architecture diagrams).
3. **Phase D** — opportunistic polish (DigiLab → Block Walking on home featured row, "Now" page, talks/advisory surface).

Phase C is the biggest remaining lift. Phase D is genuinely defer-or-skip.

---

## Phase C — New content surfaces

### Press / Lab Report (DONE — see "Done" below for what landed)

The `selectedMedia` array in `src/data/resume.ts` is now populated with the two Lab
Report data viz credits (Homeless Enforcement, Patrol Staffing) and the D Magazine + KERA
press features. Add more entries here as new mentions land.

### New leadership case study: CPAL Data Platform Migration

- Add a new project entry to `src/data/projects.ts` (consider `category: 'platform'` or `'leadership'`).
- Full case study at `src/page-views/projects/CPALPlatformCaseStudy.astro`.
- Wire into the `CaseStudyComponent` map in `src/pages/projects/[slug].astro`.
- Topics: Databricks rollout (Lakehouse + Unity Catalog on AWS, Git-tracked orchestration), 35-40 pipeline systematization, vendor team scale (1 in-house → 6 external + 1 in-house), why Databricks over Snowflake/dbt-Cloud after capacity assessment.

### New leadership case study: AI-enabled data ops at a 25-person nonprofit

- Workflows: pipeline scaffolding, stakeholder memo drafting, code review, doc generation.
- Custom Claude Code skills/agents and MCP servers built for the team.
- Evals approach (or honest "still being developed" framing).
- PII / eviction-data handling when feeding sensitive data to LLMs (dovetails with the Eviction Pipeline ethics paragraph).
- What worked, what didn't, what the team is still figuring out.

### Architecture diagrams

- Eviction Pipeline 4-stage flow (ingest → clean → enrich → publish). SVG or build-time Mermaid.
- DigiLab system architecture (Vercel edge → Astro SSR → Neon → admin subdomain → Discord webhooks).
- Each diagram lives inline in its case study file.

### `/work-with-me/` "Selected past engagements"

- Surface Rodriguez Wellbeing as past pro-bono client work (legitimately is engagement evidence).
- Add "what success looks like" examples per engagement type (e.g., "Six months in, you have a hired analyst, a documented tooling stack, and a Q1 roadmap").
- Optional: a categorized example list ("Three small Dallas nonprofits with their first analyst hire," etc.) without naming clients.

---

## Phase D — Polish (defer or do opportunistically)

- Swap DigiLab off the home featured row (per nonprofit reviewer's note: it's the strongest technical signal but tournament cards aren't mission-aligned for the foundation audience). Replace with Block Walking Tool or NTE; link DigiLab from a "Technical depth" section.
- Expand DigiLab case study with explicit trade-offs (Astro vs. Next, Preact vs. React, Neon vs. RDS, better-auth vs. alternatives) and ops metrics (p95 latency, hosting cost, uptime).
- Talks / advisory / writing surface (if any to add).
- "Now" page (what I'm working on this month) for trust signal.
- Audit Astro 6 upgrade quarterly (`@tailwindcss/vite` Rolldown compatibility).
- Iterate the favicon past the ML monogram placeholder if/when a stronger direction emerges.

---

## Loose ends

- Real photo of Michael to replace the ML monogram placeholder in `src/page-views/AboutPage.astro`.
- Resume PDF: drop into `public/files/Michael_Lopez_Resume.pdf` and flip `hasResumePdf` to `true` in `src/page-views/ResumePage.astro` to surface the download button.
- Configure DNS so `lopezmichael.dev` points at the Vercel deployment.
- Enable Web Analytics in the Vercel project dashboard (the `<Analytics />` component is wired but inert until that switch is flipped).
- (Also tracked in `CLAUDE.md`.)

---

## Open questions for next session

- Phase C order: CPAL Platform Migration first or AI-enabled Data Ops first? (Platform migration is the more universally legible artifact; AI ops is the more differentiated story.)
- New `category` value for leadership case studies: `'platform'`, `'leadership'`, or fold into `'civic'`?
- Architecture diagrams: hand-rolled SVG or build-time Mermaid? Mermaid is faster to author but less canyon-themable.

---

## Done

### Phase A — voice and positioning
- Mission-first home intro: "Data should reach the people closest to the problem."
- About bio rewrite: opens in the present, then circles back to origin story (UT Dallas lab, sitting with parents), through-line (psych → policy → MPP → CPAL), two convictions in bold.
- "What we've built at CPAL" with the actual 2026 stack.
- Skills modernized in `resume.ts`.
- Pre-CPAL roles got narrative summaries (Children at Risk, UT Dallas Lab).
- Director role split: Director, Data Operations (Jan 2026 - Present) + Director, Data (May 2023 - Dec 2025).
- Eviction Pipeline factual update: R → Databricks Python notebooks; SFTP from county; Reflection #4 reframed as "Architecture is the durable thing, not the stack".
- Eviction Pipeline data-ethics paragraph (tract-level public, record-level under DUA, no defendant names, vetted partners, Eviction Lab framework reference).
- Eviction Pipeline Outcome leads with partner action.
- Em-dash sweep across all content (~50 instances).
- AI-flavored phrasing softened.
- "engineers" → "data engineers" sweep.
- JSON-LD `knowsAbout` modernized.

### Phase B — visual elevation
- **Resume:** sticky 2-column layout at `lg+`, sidebar with skills/contact/status pulse, CPAL spine timeline, dropped `<hr>` dividers, ResumeEntry hierarchy reworked (uppercase tracked dates, canyon dot company line).
- **Case study:** numbered `01 Problem` / `02 Approach` / `03 Outcome` / `04 Reflection` headers with large light ghost numbers; metrics row lifted above screenshot with `text-4xl/5xl` values and canyon top accents per cell; optional `<slot name="pullquote">` between Approach and Outcome with breakout styling; canyon contour SVG behind the H1.
- **Projects:** container bumped to `max-w-6xl`; uniform wide card across all categories (case-study card variant deleted).
- **About:** 2-col editorial hero (bio left, headshot+role+status right); pullquote with editorial styling; tinted "What we've built" card with numbered list 01–06; clean Skills grid; Selected Media as inline list with hairline dividers.
- **Work with me:** numbered engagement cards with canyon-tinted icons; "How I work" cards visually heavier; status pulse pill.
- **Header & Footer:** social icons hidden until `lg+`; voicier footer CTA banner; canyon-line silhouette SVG above the footer columns; asymmetric column layout.
- **Cross-cutting:** SkillsGrid bullet → canyon square; ScrollReveal consolidated to one wrap per section; cascade delays for stacked content; tag/tech-stack/skill chip primitives differentiated.

### Phase 5 — OG image + favicon
- OG image at `public/images/og-image.png` (1200×630, OG-A direction: editorial top-left text + bottom canyon-ridge wireframe).
- Favicon: SVG primary (`public/favicon.svg`, ML monogram on canyon-orange), PNG fallbacks at 16/32, apple-touch-icon at 180×180. No `.ico` — modern browsers don't need it.
- Wired through `BaseLayout.astro` link tags.
- Internal `/preview/branding/` page kept for future iteration.
- ML monogram is a placeholder — call it out as such; iterate later if a stronger direction emerges.

### Tone polish + production deploy
- Home intro reframed as platform-up-to-tools without enumerating projects.
- Footer CTA broadened: "consulting and project engagements by request."
- About hero opens in the present; "Hi, I'm Michael" duplicate removed from the paragraph.
- Headshot placeholder: gradient circle → ML monogram (canyon-orange, cream "ML").
- Resume role rename: "Manager, Data Analytics" → "Manager, Data"; "Associate, Analytics" → "Associate, Data".
- Skills tightened (Databricks parenthetical trimmed, Anthropic API standalone, Observability merged into Orchestration & Infra, "Claude Enterprise rollout" dropped).
- "Child Poverty Action Lab" prefixed with "the" in narrative prose.
- Eviction Pipeline `cardImage`: editorial canyon-terrain illustration in cards, no screenshot on the case study detail page.
- Project screenshots refreshed; capture script hardened (`waitUntil: 'load'`, NTE modal auto-dismiss).
- Vercel Analytics wired (`@vercel/analytics/astro`), same-origin in production.
- Merged `develop` → `main`, pushed.

### Code / bug / security review fixes
- Case study dynamic component PascalCase fix.
- Resume PDF download hidden until file lands.
- gradientMap completion.
- Image dimensions added (CLS fix).
- CSP hardened (`base-uri 'none'`, `form-action 'none'`, `object-src 'none'`, `upgrade-insecure-requests`).
- `framework: "astro"` removed from `vercel.json`.
- Cache-Control headers added.
- `@astrojs/check` + `typescript` installed; passing.
- ThemeToggle TS errors fixed.
- Mobile menu refactored to `aria-expanded` as state of truth.

### Migration & content (initial)
- Quarto → Astro 5 + Tailwind v4 migration; cleaned all Quarto-era files (`*.qmd`, `_quarto.yml`, `styles.scss`, `js/`, `docs/`).
- Email migrated to `michael@lopezstudio.dev`.
- DigiLab project rewritten with full stack and scale (3,000+ tournaments, 350+ Discord, public API, admin subdomain).
- DigiLab Shiny marked as archived.
- "30+ R Shiny Dashboards" project entry removed (it was a count, not a project).
- F2 palette established: charcoal primary, wine `cool` interactive accent, canyon decorative, warm orange `secondary`, sand `accent`, cream bg. Avoid teal (CPAL brand collision). Avoid em-dashes (AI tell).
- Dark mode visibility issues swept across all components.
- SkillsGrid consolidated to read from `resume.ts`.
- Per-project pages + case studies: dynamic route `/projects/[slug]/` for all 8 projects, three full case studies (Eviction Pipeline / Homestead Map / DigiLab), generic `ProjectDetail` for the rest, slug-based `featuredProjects`.
- `/work-with-me/` page: hero, three engagement-type cards, four "How I work" cards, contact CTA. Navbar pill (`md+`) and mobile drawer button.
