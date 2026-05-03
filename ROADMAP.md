# Roadmap

## Where we are (as of 2026-05-03)

The site has shipped through **Phase A** — mission-first content and positioning rewrite. The
voice and information architecture are now stable. What's left is visual elevation, new content
surfaces, and a few loose ends. See **Done** at the bottom for the cumulative ship list.

This roadmap is intended as the entry point for the next work session.

## Recommended order of operations

1. **Phase B** — visual elevation (biggest design pivot; highest perceived-polish lift).
2. **Phase 5** — OG image + favicon generation. Can run in parallel with Phase B if desired.
3. **Phase C** — new content surfaces (press, leadership case studies, architecture diagrams).
4. **Phase D** — polish and opportunistic improvements.
5. **Loose ends** — real headshot, resume PDF, Vercel deploy + DNS.

Pick whatever order makes sense; recommendation above prioritizes "biggest visible jump" first.

---

## Phase B — Visual elevation

The card components and page layouts are functionally correct but visually homogeneous. Phase B
elevates perceived polish without rewriting the site. Source: cross-cutting findings from the
UX, data, and nonprofit review agents.

### Resume page (highest leverage)

- Pivot to a sticky 2-column layout at `lg+` (~260px sidebar + main column).
- **Sidebar** holds: Skills as chip clusters by category, Contact links, "Currently in Dallas"
  status line, PDF download once it lands.
- **Main column** becomes a typographic timeline experience with a vertical canyon line and dot
  markers at each role.
- All four CPAL roles (Associate → Manager → Director, Data → Director, Data Operations) render
  under a single connected "spine" treatment so the progression reads as growth, not separate jobs.
- Drop the row of `<hr>` dividers (the sidebar layout separates sections without them).
- `ResumeEntry` visual hierarchy: small uppercase tracked dates eyebrow above title; title at
  `text-lg` / 600; company on its own line with a small canyon dot.

### Case study layout

- Numbered section headers: `01 Problem`, `02 Approach`, `03 Outcome`, `04 Reflection`. Number
  rendered large and light to the left of each `<h2>` at `md+`.
- Lift the metrics row above the screenshot. Treat as primary hero element with `text-4xl/5xl`
  values. Bordered cells with thin canyon top accent per cell.
- Add `<slot name="pullquote">` between Approach and Outcome with editorial styling: left canyon
  bar, italic, `font-light`, breaks out of prose width. Each case study uses one selectively.
- Add a wireframe canyon contour SVG fixed behind the case study `<h1>` at low opacity (echoes the
  terrain hero).
- Reflection slot is already conditional (Phase 4 polish).

### Projects page

- Bump container from `max-w-4xl` to `max-w-6xl`.
- Two card variants:
  - Case-study (eviction-pipeline, homestead-map, digilab): full-bleed top screenshot at
    `aspect-video` plus a "Case study" ribbon.
  - One-pager (NTE, Block Walking, Rodriguez, atomtemplates, DigiLab Shiny): keep the wide layout
    but increase the screenshot column from `md:w-72` to `md:w-96`.
- Differentiate visual treatment between the two variants beyond the bottom label.

### About page

- 2-col editorial hero at `md+`: bio left, headshot + role chip + "Currently in Dallas" right.
- Extract a pull-quote from the bio (e.g., the "intersection of technical and programmatic" line)
  with editorial styling matching the case-study pull-quote treatment.
- Differentiate the three blocks (What we've built / Selected Media / Skills) — currently they all
  read as similar cards. Suggested: tinted "What we've built" card with numbered list 01–06; clean
  Skills grid; Selected Media as inline list with hairline dividers (not another card).
- Replace the gradient placeholder headshot once a real photo is available (loose end).

### Engagement cards (`/work-with-me/`)

- Numbered (01 / 02 / 03) larger tinted icons inside a canyon-tinted square.
- Tighten the "What this looks like" lists to three items max above the fold.
- Flip the visual weight so the "How I work" cards (Scope / Schedule / Style / Rates) are at
  least as prominent as the engagement-type cards. The "How I work" content is the differentiator;
  it shouldn't visually recede.

### Header & Footer

- Header right-side density: hide the `hidden sm:flex` social icons at `md+` (or only show at
  `lg+`); they're already in the footer.
- Footer voicier CTA banner: bigger heading, real button, less anonymous.
- Footer canyon-line silhouette SVG running edge-to-edge above the columns (small brand echo,
  cheap to add).
- Replace footer Pages/Connect uppercase tracked headings with an asymmetric layout; consider
  doubling the brand block width and dropping one column.

### Cross-cutting

- Add a `text-4xl/5xl` heading moment outside the terrain hero (case study `<h1>` is the obvious
  candidate).
- Pick two visual idioms: keep `>` for tech-stack and project highlights; replace the SkillsGrid
  bullet with a small canyon square (`w-1.5 h-1.5 bg-canyon`) so the page texturally varies.
- Vary the section heading dash treatment (`<span class="w-8 h-0.5 bg-canyon">`) — currently
  identical across pages. Variants per page (thicker on case study, numbered prefix on
  Work-with-me, etc.).
- Wrap each section once at the section level for `<ScrollReveal>` (currently double-nested
  around heading + body, causing tic).
- Stagger animations by content (3 cards at 0/100/200ms is fine; 8 resume entries should cascade
  by ~60ms, not all at 0ms).
- Distinguish tag vs. tech-stack vs. skill chip primitives: filled chip = tag, outlined chip =
  tech stack, square bullet = skill list.
- Dark mode: faint canyon-line background pattern at very low opacity; chips use `ring-1
  ring-canyon/30` instead of muddy `bg-accent/15`.
- Hover state on home featured project cards: tag chip flip-in or arrow fade-in (current
  `hover:-translate-y-2` is fine but the cards could invite click harder).

---

## Phase 5 — OG image + favicon

Picked OG-1 (dark canyon + wireframe terrain) and FAV-5 (geometric data-node) from the earlier
branding-preview review.

- Generate `public/images/og-image.png` (1200×630). Recommend: scripted via Playwright like
  `scripts/generate-screenshots.mjs`.
- Generate `public/favicon.ico` (16/32) and `public/apple-touch-icon.png` (180×180).
- Once shipped, social shares (LinkedIn, iMessage, X) will stop showing the broken-image
  placeholder.

---

## Phase C — New content surfaces

### Press / Lab Report (highest leverage for nonprofit credibility)

The `selectedMedia` array in `src/data/resume.ts` is empty; the About page's Selected Media
section auto-renders when populated.

- Find news article URLs referencing eviction work (Dallas Morning News, KERA, D Magazine,
  Texas Tribune, etc.).
- Find Lab Report data-viz contributions Michael has made.
- Populate `selectedMedia` with structured entries (`outlet`, `title`, `date`, `href`, `type`).

### New leadership case study: CPAL Data Platform Migration

- Add a new project entry to `src/data/projects.ts` (consider `category: 'platform'` or
  `'leadership'`).
- Full case study at `src/page-views/projects/CPALPlatformCaseStudy.astro`.
- Wire into `src/pages/projects/[slug].astro` routing.
- Topics: Databricks rollout (Unity Catalog, Workflows, Lakebase + Lakehouse on AWS, Git-tracked
  orchestration), 35-40 pipeline systematization, vendor team scale (1 in-house → 6 external + 1
  in-house), why Databricks over Snowflake/dbt-Cloud after capacity assessment.

### New leadership case study: AI-enabled data ops at a 25-person nonprofit

- Workflows: pipeline scaffolding, stakeholder memo drafting, code review, doc generation.
- Custom Claude Code skills/agents and MCP servers built for the team.
- Evals approach (or honest "still being developed" framing).
- PII / eviction-data handling when feeding sensitive data to LLMs (dovetails with Eviction
  Pipeline ethics paragraph).
- What worked, what didn't, what the team is still figuring out.

### Architecture diagrams

- Eviction Pipeline 4-stage flow (ingest → clean → enrich → publish). SVG or build-time Mermaid.
- DigiLab system architecture (Vercel edge → Astro SSR → Neon → admin subdomain → Discord
  webhooks).
- Each diagram lives inline in its case study file.

### `/work-with-me/` "Selected past engagements"

- Surface Rodriguez Wellbeing as past pro-bono client work (legitimately is engagement evidence).
- Add "what success looks like" examples per engagement type (e.g., "Six months in, you have a
  hired analyst, a documented tooling stack, and a Q1 roadmap").
- Optional: a categorized example list ("Three small Dallas nonprofits with their first analyst
  hire," etc.) without naming clients.

---

## Phase D — Polish (defer or do opportunistically)

- Swap DigiLab off the home featured row (per nonprofit reviewer's note: it's the strongest
  technical signal but tournament cards aren't mission-aligned for the foundation audience).
  Replace with Block Walking Tool or NTE; link DigiLab from a "Technical depth" section.
- Expand DigiLab case study with explicit trade-offs (Astro vs. Next, Preact vs. React, Neon vs.
  RDS, better-auth vs. alternatives) and ops metrics (p95 latency, hosting cost, uptime).
- Talks / advisory / writing surface (if any to add).
- "Now" page (what I'm working on this month) for trust signal.
- Audit Astro 6 upgrade quarterly (`@tailwindcss/vite` Rolldown compatibility).

---

## Loose ends

- Real headshot replacing About page gradient placeholder.
- Resume PDF: drop into `public/files/Michael_Lopez_Resume.pdf` and flip `hasResumePdf` to `true`
  in `src/page-views/ResumePage.astro`.
- Vercel deploy + DNS for `lopezmichael.dev`.
- (Also tracked in `CLAUDE.md`.)

---

## Open questions for next session

- Phase B order: resume sidebar pivot first (highest leverage) or case-study layout first
  (most-visible improvement)?
- Press / Lab Report — gather URLs ahead of Phase C, or work them up as part of the phase?
- Phase 5 (OG + favicon) — small enough to ship in parallel with Phase B as a warm-up, or wait?

---

## Done

### Migration & content
- Quarto → Astro 5 + Tailwind v4 migration; cleaned all Quarto-era files (`*.qmd`,
  `_quarto.yml`, `styles.scss`, `js/`, `docs/`).
- Email migrated to `michael@lopezstudio.dev`.
- DigiLab project rewritten with full stack and scale (3,000+ tournaments, 350+ Discord, public
  API, admin subdomain).
- DigiLab Shiny marked as archived.
- "30+ R Shiny Dashboards" project entry removed (it was a count, not a project).

### F2 palette
- Charcoal primary, wine `cool` interactive accent, canyon decorative, warm orange `secondary`,
  sand `accent`, cream bg.
- Avoid teal (collides with CPAL brand).
- Avoid em-dashes (AI tell).
- Dark mode visibility issues swept across all components.
- SkillsGrid consolidated to read from `resume.ts`.

### `/work-with-me/`
- New page: hero, three engagement-type cards, four "How I work" cards, contact CTA.
- Navbar pill (md+) and mobile drawer button.

### Per-project pages + case studies
- Dynamic route `/projects/[slug]/` for all 8 projects.
- Three full case studies (Eviction Pipeline / Homestead Map / DigiLab) using shared
  `CaseStudyLayout`.
- Generic `ProjectDetail` for the rest.
- Slug-based `featuredProjects` (no more index fragility).

### Code / bug / security review fixes
- Case study dynamic component PascalCase fix.
- Resume PDF download hidden until file lands.
- gradientMap completion.
- Image dimensions added (CLS fix).
- CSP hardened (`base-uri 'none'`, `form-action 'none'`, `object-src 'none'`,
  `upgrade-insecure-requests`).
- `framework: "astro"` removed from `vercel.json`.
- Cache-Control headers added.
- `@astrojs/check` + `typescript` installed; passing.
- ThemeToggle TS errors fixed.
- Mobile menu refactored to `aria-expanded` as state of truth.

### Phase A — voice and positioning
- Mission-first home intro: "Data should reach the people closest to the problem".
- About bio rewrite: origin story (UT Dallas lab, sitting with parents), through-line (psych →
  policy → MPP → CPAL), two convictions in bold.
- "What we've built at CPAL" with the actual 2026 stack (Lakebase, MCP servers, custom agents,
  Anthropic API).
- Skills modernized in `resume.ts`.
- Pre-CPAL roles got narrative summaries (Children at Risk, UT Dallas Lab).
- Director role split: Director, Data Operations (Jan 2026 - Present) + Director, Data (May 2023
  - Dec 2025).
- Eviction Pipeline factual update: R → Databricks Python notebooks; SFTP from county;
  Reflection #4 reframed as "Architecture is the durable thing, not the stack".
- Eviction Pipeline data-ethics paragraph (tract-level public, record-level under DUA, no
  defendant names, vetted partners, Eviction Lab framework reference).
- Eviction Pipeline Outcome leads with partner action (legal aid contacting tenants,
  hundreds-thousands of cases per year).
- Em-dash sweep across all content (~50 instances).
- AI-flavored phrasing softened.
- "engineers" → "data engineers" sweep.
- JSON-LD `knowsAbout` modernized.
