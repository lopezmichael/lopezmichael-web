# Canyon Blush Redesign: Plan

**Status:** Draft for review · **Created:** 2026-11-11
**Principles:** [`docs/design-principles.md`](../design-principles.md) · **Mockup:** [`docs/mockups/canyon-blush.html`](../mockups/canyon-blush.html)

## Goal

Re-skin and restructure lopezmichael.dev around the Canyon Blush principles: lose the
"AI-built" tells, make the site feel hand-made and a little playful, and keep it pointed at
data leadership roles. Copy edits continue in parallel and don't block this work.

## Decisions already made

- **Palette:** Canyon Blush (blush ground, oxblood ink, wine as the only highlight). No orange
  fills, no ticker.
- **Project list:** index rows, full wine fill on hover, screenshot trails the cursor.
- **Type:** Bricolage Grotesque + Instrument Serif + Instrument Sans + JetBrains Mono, self-hosted.
- **Interactions:** terrain cursor lift, trailing screenshots, one chart per case study, copy email,
  live clock. Rejected list lives in the principles doc.
- **Terrain:** keep and extend the existing Three.js work; add modes (including a city),
  generation options, and location-aware defaults.
- **Charts:** the team chart in the mockup is a placeholder idea. Each case study's chart is
  decided case by case with real data.

## Decisions from review (2026-11-11)

1. **Consulting CTA:** dropped from Home and About. The footer's "Say hello" carries contact.
2. **Visitor location on screen:** never shown. Location (time zone, optional coarse region) only
   seeds and tints the terrain quietly; the label names the terrain's own place and seed, not the visitor's.
3. **Case-study charts:** see "Case-study charts" under Phase 4. Eviction first.
4. **Work with me:** restyle to match; it stays hidden from nav and noindexed.
5. **Resume PDF:** keep the current design. Revisit only if the mismatch with the new site bothers us
   (at most a swap of its accent color to wine and its font to Instrument Sans).

---

## Phases

Each phase is one PR off `main`, reviewed on a Vercel preview before merge. Sizes: S (≤ half a
day of agent work), M (≈ a day), L (multi-day).

### Phase 0: Foundations (M) · DONE 2026-11-11

Shipped with no visible change: the four affected pages were pixel-identical to the previous build.

- [x] Added `@fontsource/bricolage-grotesque`, `@fontsource/instrument-sans`,
      `@fontsource/instrument-serif`, `@fontsource/jetbrains-mono` (imported in `global.css`; browsers
      download a face only once something uses it). Inter stays until Phase 1 switches the body font;
      the resume and cover-letter scripts keep using `@fontsource/inter` either way.
- [x] New token layer in `src/styles/global.css`: CSS variables that flip under `[data-theme="dark"]`,
      exposed through `@theme inline` as `page`, `raised`, `ink`, `muted`, `line`, `wine`, `wine-deep`,
      `on-wine`, `band`, plus `font-display/serif/sans/mono`. The legacy palette stays in its own
      `@theme` block, marked for deletion in Phase 5.
- [x] Global `:focus-visible` outline (2px wine, 3px offset) on every interactive element.
- [x] `ThemeToggle.astro`: `aria-label` now names the action ("Switch to dark mode" / "Switch to
      light mode") and updates on toggle.
- [x] Guardrail: `scripts/check-design.mjs` (`npm run check:design`, and as `prebuild`, so Vercel builds
      run it too) fails on hex/rgb/hsl color literals in `src/` outside `global.css`,
      `src/lib/terrain/config.ts`, and `src/pages/preview/`.

### Phase 1: Site shell (S) · DONE 2026-11-11

- [x] `Header.astro`: name in the display face (links home), nav **Work · About · Resume** (Work =
      `/projects/`, stays lit on case studies), wine underline + `aria-current` on the current page,
      live "Dallas · time CT" clock (client-side `Intl`; server-renders "Dallas, Texas" so no-JS never
      shows a stale time). The mobile drawer is gone: three short links wrap onto a second row.
      GitHub/LinkedIn icons moved to the footer as text links.
- [x] `Footer.astro`: "Say *hello.*" + copy-email button ("Copied" state announced via `aria-live`,
      the word pops to "hello!", falls back to selecting the address). The consulting CTA band, the
      wavy divider and the "Built with" credit are gone sitewide.
- [x] Body ground, text, links (wine, underline on hover) and selection color now come from the new
      tokens. The skip link uses wine-deep.
- [x] **In-between state:** the legacy color names (`primary`, `secondary`, `accent`, `cool`,
      `canyon`, `light`, `dark-*`, `surface`) are aliased onto the new theme-aware tokens, so pages not
      yet rebuilt render in Canyon Blush in both themes. Solid and outline buttons on those pages were
      switched to `bg-wine-deep text-on-wine` / `hover:bg-ink hover:text-page`.

### Phase 2: Home (M) · DONE 2026-11-11

- [x] Hero: `MICHAEL` / *Lopez* wordmark with the tagline and supporting line beneath.
- [x] `TerrainBand.astro` replaces `TerrainHero.astro`: same Three.js engine in a ~32vw dark band,
      with the coordinates + seed label and a Regrow button. `initTerrain()` now takes `{ seed }`.
      The full-viewport hero, the text-over-terrain and the bouncing arrow are gone.
- [x] "Now" statement in the label/content grid (existing intro copy).
- [x] `ProjectIndex.astro` + `ProjectRow.astro`: index rows with wine fill on hover/focus and the
      trailing, tilting screenshot (fine pointers only; no tilt with reduced motion). New optional
      `hook` field on `Project` (filled for CPAL, Eviction, Homestead, DigiLab; others fall back to
      `description`). Home still shows the three featured projects, plus an "All 7 projects" link.
- [x] Consulting CTA band removed (it lived in the footer, so it's gone everywhere).

### Phase 3: Terrain v2 (L) · DONE 2026-11-11

Extends `src/lib/terrain/` rather than replacing it: Three.js pipeline, GPU simplex shader, bloom,
generative parameters and always-dark rendering all kept.

- [x] `state.ts` (no Three.js): modes, the real Texas place each evokes (Palo Duro Canyon, Downtown
      Dallas, Blackland Prairie), `paramsFor(mode, seed)` from a seeded PRNG so a mode + seed always
      rebuilds the same terrain (noise, camera, tilt), time-of-day tint and default, `?terrain=` parsing.
- [x] Shader modes with a blended A/B morph (~800ms; the outgoing terrain is only evaluated while a
      morph runs): **Canyon** (original noise + mesa terraces + a meandering river), **Prairie**
      (rolling plains, one escarpment ridge, a creek), **City** (Dallas skyline across the Trinity; see below).
- [x] Height ramp switched to deep canyon → sand (`config.ts` `TERRAIN_RAMP`); the old top stop was
      a teal-green that collides with the CPAL brand.
- [x] Pointer/touch lift: raycast onto each mode's ground level after the camera moves; gentle
      camera drift while the pointer is over the band.
- [x] Controls on the band: Canyon · City · Prairie (`aria-pressed`) and Regrow. Label shows the
      terrain's place + seed (never the visitor's location). Choices update `?terrain=mode-seed` for
      sharing; the last chosen mode is remembered in `localStorage`.
- [x] One renderer for the page's life: Regrow / mode switches change uniforms only; a click mid-morph
      is queued. Wave and roll phases accumulate, so new speeds never jump.
- [x] Performance: renders only while the band is on screen and the tab is visible; reduced motion =
      still frame, rendering only while something changes; small screens use a lighter mesh and no
      bloom (re-checked on resize). The shader encodes its own output color space, so the plain render
      and the bloom composer match.
- [x] **Decision (changed from the plan):** defaults come from the visitor's *local time*, not time
      zone: night → City, dawn → Prairie, day/dusk → Canyon, plus a matching tint. Same privacy (device
      clock, nothing leaves the browser), richer signal.
- [ ] **Revisit the terrain look** (Michael, 2026-11-11: "not super happy with it, iterate later").
      Review on a real GPU via the preview and tune Canyon / City / Prairie together.
- [x] **City look:** literal blocks (zoning, avenues, freeway loop) and a soft density map both read as
      busy or flat next to the canyon. Michael chose **skyline on the horizon**: Dallas seen across the
      Trinity, with a smooth floodplain foreground (river + a levee on each bank), a lower camera, and a
      seeded cluster of soft, tapered towers along the horizon. Label: "Trinity River, Dallas".
      Needs a look on a real GPU in the preview; the sandbox renders it in software.
- [ ] Layer 2 (Vercel IP-region seed via middleware) and Layer 3 (real Dallas elevation) not started;
      both optional. Layer 2 needs a security review when built.

### Phase 4: Projects and case studies (L) · DONE 2026-11-11 (charts pending data)

- [x] `ProjectsPage.astro`: category groups as index rows (same `ProjectIndex` / `ProjectRow` as Home).
      Hooks added for every project. `ProjectCardWide` and the `gradient` field are gone.
- [x] Shared pieces: `ProjectHeader` (back link, eyebrow, display title, serif lede, tags, Visit live),
      `LabeledSection` (the label/content grid, also used by Home's "Now" and the Projects header),
      `ProjectFigure` (screenshot), `NextProject` (a "Next" row at the end of every project page).
- [x] `CaseStudyLayout.astro` rework: labeled sections without numerals (rendered from one slot list),
      the paragraph-spacing bug fixed (`prose-flow` utility owns block spacing), metrics as a ruled
      `dl`, pull quote in large serif before Outcome with no colored bar, "Built with" as a plain ruled
      list, and a `figure` slot for the interactive chart (screenshot fallback).
- [x] `ProjectDetail.astro` (generic projects): same header, figure, sections and next row.
- [x] Scroll-reveal fades removed from these pages (content is visible in the first frame).
- [ ] **Charts:** the shared scrub-chart component is held until real data arrives (no placeholder
      numbers ship). First: eviction (monthly Dallas County filings since 2020 + one year's
      filings → outreach → representation funnel).

**Case-study charts (proposed, one each)**

| Case study | Chart | Data needed | Priority |
|---|---|---|---|
| Dallas County Eviction Data | Monthly Dallas County filings, 2020 to today, scrubbable, with a few annotations (e.g. the end of the moratorium). A second view shows the year as a funnel: filings → outreach → legal representation | Monthly filing counts (public; same source as North Texas Evictions); funnel counts for one year | **First** |
| Dallas Homestead Map | Every Dallas tract as a dot along a take-up-rate axis; a slider filters by income so the disparity becomes visible | Tract take-up rate + median income (already in the app's data: DCAD + ACS) | Second |
| DigiLab | Tournaments logged per week since launch, scrubbable, with a running count of cities and players | Weekly counts from DigiLab's own database/API | Third |
| Building CPAL's Data Function | Three lanes on one timeline (people, platform, products): team size, the stack moving from scripts to Databricks, decision tools going from 0 to 30+ | Michael's dates for each milestone; app count by year if known | Fourth (needs the most input) |

### Phase 5: Remaining pages (M) · DONE 2026-11-11

- [x] **About:** editorial header, bio beside an aside (wine monogram placeholder, role, Dallas,
      LinkedIn/GitHub), pull quote, "What we've built" as a ruled list without numerals (structured
      items, no HTML in data strings), media and skills as labeled sections. The "Let's connect" box is
      gone; the footer's "Say hello" is the one contact moment. Copy unchanged.
- [x] **Resume:** left column (contact, PDF, skills as plain text; not sticky, since it can outgrow the
      screen), CPAL timeline on `ResumeEntry` (shared with earlier roles), "Earlier experience" with its
      own heading, education and projects as ruled lists. Fixed a nested `<main>`.
- [x] **Work with me:** restyled (still hidden). Engagements as ruled entries, "How I work" as a ruled
      grid, own contact block. Icons, numerals, cards and the pulsing status dot removed.
- [x] **404:** large display "404", "This ground hasn't been *mapped* yet.", contour lines, links home
      and to the work.
- [x] Legacy color aliases deleted from `global.css`; the branding preview migrated to tokens. The built
      HTML was scanned to confirm no legacy class remains (Tailwind would silently emit nothing for one).
- [x] `ScrollReveal`, `ProjectCard`, `ProjectCardWide` and the wave divider are gone. `LabeledSection`
      takes an optional label so pull quotes align without copying the grid.

### Phase 6: SEO and sharing (S) · DONE 2026-11-11 (off-site steps are Michael's)

- [x] `npm run og` (`scripts/generate-og.mjs`): site card (`MICHAEL` / *Lopez* + tagline) and one card per
      project (title + hook), each over a strip of terrain ridgelines seeded by slug, 1200×630, fonts
      embedded. Colors read from the `global.css` tokens and `TERRAIN_RAMP`; titles from `projects.ts`.
- [x] New favicon (written by the same script): a terrain ridge + contour line on wine, no text, with a
      wine strip at the bottom so the tile keeps its outline on light tabs. 16/32 PNG + apple-touch-icon.
- [x] Project pages use their own OG image and emit a `CreativeWork` (author → the Person `@id`) via
      `projectSeo()`; the description matches the page meta.
- [x] Person JSON-LD derived from `resume.ts` (current role, `contact`, skills); `knowsAbout` leads with
      leadership, domains and methods.
- [x] `check:og` in `prebuild`: the build fails if any project lacks its preview image.
- [ ] **Michael:** verify the domain in Google Search Console and submit `sitemap-index.xml`; enable Web
      Analytics in the Vercel dashboard. (Settle the unconfirmed skills in `resume.ts`, e.g. CKAN and
      PostGIS: `knowsAbout` mirrors that list.)

### Phase 7: Copy pass and QA (M) · QA DONE 2026-11-11, copy pending

- [ ] Copy pass with Michael, then run all changed prose through the `voice-professional` agent
      (hooks, labels, terrain copy, 404, footer). Open items: "monitoring" in the prototype-to-
      production paragraph; general edits.
- [x] **Accessibility:** axe (WCAG 2.1 A/AA + best practice) on all 9 pages × light, dark, phone:
      0 violations after underlining in-text links (wine on ink is under 3:1, so color alone failed
      1.4.1; links opt out only via `no-underline` or a button utility). Keyboard pass on Home, a
      case study and Resume: logical order, visible focus on every stop, no hidden stops, skip link
      works. Reduced motion: terrain draws once then idles at 0 frames; no running CSS animations.
      Not done: a manual screen-reader session (VoiceOver/NVDA).
- [x] **Lighthouse (mobile):** case study 100 performance / 100 a11y / 100 SEO; LCP 0.8s, CLS 0.
      Home: LCP 0.8s, CLS 0, a11y/SEO 100; performance scores ~70 only because the sandbox renders
      WebGL in software (with the terrain script blocked, Home scores 100, TBT 0). Changes made:
      terrain starts after load + idle, 30 fps and 1.5× pixel ratio on small screens, all hero
      fonts preloaded (removed a font-swap layout shift), project screenshots served as 800/1600px
      WebP via srcset (saved ~875 KB per case study; `check:assets` guards them).
- [ ] **Real-device check (Michael):** terrain on a real GPU (laptop + phone) as part of the terrain
      look iteration; Lighthouse on the production URL after merge.
- [x] `CLAUDE.md` kept current through each phase.

---

## Handoff: remaining work (as of 2026-11-11)

Phases 0–6 and the Phase 7 QA checks are done on `claude/quirky-shannon-hpcwls` (not yet merged to
`main`). Work continues locally. Everything still open is listed here, in a sensible order.

### 1. Terrain look iteration: DONE 2026-11-11 (only optional items remain)
Needs a real GPU: the cloud sandbox renders WebGL in software, so judge only on a laptop/phone.
- **Files:** `src/lib/terrain/shaders.ts` (per-mode height functions: `canyonHeight`, `cityHeight`,
  `prairieHeight`, plus color ramp/tint in the fragment shader), `src/lib/terrain/state.ts` (per-mode
  parameter ranges and camera `shots` in `RANGES`, `MODE_LABEL`, random draw, time-of-day
  tint), `src/lib/terrain/config.ts` (`TERRAIN_RAMP`, grid density), `src/lib/terrain/index.ts`
  (renderer, morph, pointer lift, frame loop), `src/components/TerrainBand.astro` (band size, label,
  controls, start timing).
- **Fast loop:** `npm run dev`, open `/?terrain=canyon-0421` (or `city-0042`, `prairie-0007`) to pin a
  mode + seed. Regrow doesn't write the URL (reloads draw fresh); read the mode + seed off the label to pin a view.
- **State after the 2026-11-11 real-GPU session (all committed):**
  - Ground is a 280×100 strip (`GRID_WIDTH`/`GRID_DEPTH` in `config.ts`) so it spans the band.
  - First screen fits name + tagline + band: band fills what the hero leaves (240px to 62svh),
    wordmark capped by `svh`.
  - No mode buttons: each load draws a random mode + seed, Regrow rerolls both, label is
    "Canyon · seed 0421". No per-time default mode (tint still follows the local clock).
  - Per-mode color range (`modeRange` in the shader) so City and Prairie use the whole ramp.
  - **Canyon:** seeded terrace step (2.4-4.4) and edge softness; river in the middle (1/2 of
    seeds), off to one side (1/4) or absent (1/4).
  - **City:** seeded ingredients: built form (tall downtown with an optional second cluster, or a
    mid-rise band along the horizon), river (1/2, a flat water strip), highways (1/2, two straight
    flat-bottomed cuts). Flat per-mode tilt (`tiltDivisor`) keeps towers upright. A low dense grid
    form was tried and dropped (too busy).
  - **Prairie:** rebuilt as domain-warped swells, a rise toward the horizon, a shallow creek and a
    travelling wind ripple masked into gusts (rides `uTime`, so reduced motion is one still frame).
  - **Camera:** three hand-picked shots per mode (`shots` in `RANGES`), one per seed plus jitter.
    Canyon's rim shot looks almost straight down; kept.
- **Still open (optional):** pointer-lift strength (`uLift * 7.0`, sigma 8); `uTime` advances per
  frame, so motion runs at half speed on 30 fps small screens (switch to elapsed time if it matters);
  real-phone check of the 2.8x vertex count (drop `GRID_SEGMENTS_SMALL` if it struggles).
- **Guardrails:** keep the canyon-to-sand ramp (no teal: CPAL brand); keep it generative and seeded
  (`paramsFor` must stay deterministic); keep the cheap-rendering behavior (off-screen pause, idle
  start, 30 fps + 1.5x pixel ratio on small screens, reduced motion = one frame).
- **Optional later:** Layer 2 (coarse Vercel IP-region seed via middleware; needs a security review)
  and Layer 3 (real Dallas elevation baked into a heightmap) from Phase 3c.

### 2. Copy pass (with Michael), then `voice-professional`
- All page prose and project hooks (drafts: `hook` fields in `src/data/projects.ts`; the three newest
  are Block Walking, Rodriguez, atomtemplates).
- Open item: "monitoring" in the "From prototype to production" paragraph of
  `src/page-views/projects/BuildingCPALDataOperations.astro`; keep it only if accurate.
- Scope rule (see `CLAUDE.md`): Michael leads **data operations**; never claim the whole data function.
- After any `resume.ts` change: `npm run resume:pdf` (PDF must stay 2 pages). After any title/hook
  change: `npm run og`.

### 3. Case-study charts (Phase 4, waiting on data)
The `figure` slot in `CaseStudyLayout` is ready; build one shared scrub-chart component when the first
dataset arrives (no placeholder numbers ship). First: eviction (monthly Dallas County filings since
2020 + one year's filings → outreach → representation). Full table under Phase 4.

### 4. Before merge
- Real-device pass (laptop + phone, light/dark): terrain, project-row hover previews, Resume.
- Manual screen-reader spot check (VoiceOver or NVDA) on Home, a case study, Resume.
- Run `/code-review` on the final diff; merge via PR to `main`.

### 5. After it's live (Michael)
- Lighthouse on the production URL (sandbox numbers for Home were limited by software WebGL).
- Enable Vercel Web Analytics in the dashboard (no cookies, no banner; decided over Google Analytics).
- Google Search Console: verify `lopezmichael.dev`, submit `sitemap-index.xml`.

### 6. Content still owed
- Confirm or cut unverified skills in `src/data/resume.ts` (CKAN, PostGIS, Sentry, Prefect,
  Anthropic API); they also feed the JSON-LD `knowsAbout`.
- Real headshot to replace the About monogram.

### Working locally
- Node 22.6+ (the `og` and `resume:pdf` scripts import TypeScript directly).
- Playwright scripts (`screenshots`, `og`, `resume:pdf`) need `npx playwright install chromium` once;
  `PW_CHROMIUM_PATH` is only for sandboxes with a different preinstalled Chromium.
- `npm run build` runs `check:design` (no hard-coded colors) and `check:assets` (preview cards and
  screenshot WebPs exist) first.
