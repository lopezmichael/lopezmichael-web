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
- [x] **City look:** literal blocks (zoning, avenues, freeway loop) and a soft density map both read as
      busy or flat next to the canyon. Michael chose **skyline on the horizon**: Dallas seen across the
      Trinity, with a smooth floodplain foreground (river + a levee on each bank), a lower camera, and a
      seeded cluster of soft, tapered towers along the horizon. Label: "Trinity River, Dallas".
      Needs a look on a real GPU in the preview; the sandbox renders it in software.
- [ ] Layer 2 (Vercel IP-region seed via middleware) and Layer 3 (real Dallas elevation) not started;
      both optional. Layer 2 needs a security review when built.

### Phase 4: Projects and case studies (L)

- [ ] `ProjectsPage.astro`: category groups as index rows (same components as Home), not cards.
- [ ] `CaseStudyLayout.astro` rework:
  - Editorial grid: label column ("Problem", "Approach", "Outcome", "Reflection") and content
    column. Drop the faded numerals: these are sections, not a sequence.
  - Fix the paragraph-spacing bug (case-study paragraphs currently run together).
  - Metrics: hairline-ruled row with tabular numbers in the display face.
  - Pull quote: large serif, no colored left bar.
  - Hero image replaced by a slot for the case study's interactive chart (static screenshot as
    the fallback).
- [ ] `ProjectDetail.astro` (generic projects): same grid and type, lighter.
- [ ] Charts: build one shared `<ScrubChart>` component (SVG, range-input scrubber, `aria-live`
      caption, theme tokens). Ship the first chart on one case study once real data is confirmed;
      the others follow as data arrives.

**Case-study charts (proposed, one each)**

| Case study | Chart | Data needed | Priority |
|---|---|---|---|
| Dallas County Eviction Data | Monthly Dallas County filings, 2020 to today, scrubbable, with a few annotations (e.g. the end of the moratorium). A second view shows the year as a funnel: filings → outreach → legal representation | Monthly filing counts (public; same source as North Texas Evictions); funnel counts for one year | **First** |
| Dallas Homestead Map | Every Dallas tract as a dot along a take-up-rate axis; a slider filters by income so the disparity becomes visible | Tract take-up rate + median income (already in the app's data: DCAD + ACS) | Second |
| DigiLab | Tournaments logged per week since launch, scrubbable, with a running count of cities and players | Weekly counts from DigiLab's own database/API | Third |
| Building CPAL's Data Function | Three lanes on one timeline (people, platform, products): team size, the stack moving from scripts to Databricks, decision tools going from 0 to 30+ | Michael's dates for each milestone; app count by year if known | Fourth (needs the most input) |

### Phase 5: Remaining pages (M)

- [ ] **About:** editorial grid, a single contact moment (remove the duplicate CTA), "What we've
      built" as a ruled list without the decorative numerals, skills as plain columns, media list
      kept. Keep the monogram until the real photo arrives, restyled in wine/blush.
- [ ] **Resume:** sidebar and timeline restyled to tokens and type.
- [ ] **Work with me:** restyle to match (stays hidden and noindexed).
- [ ] **404:** a small terrain moment ("This ground hasn't been mapped yet") plus links home.
- [ ] Remove the temporary old-token aliases from Phase 0, and delete unused components
      (`ProjectCard.astro`, card variants, wave divider).

### Phase 6: SEO and sharing (S)

- [ ] Regenerate `/images/og-image.png` and the favicon set in the new palette and type.
- [ ] Per-case-study OG images: extend `scripts/` with a Playwright generator (title + terrain strip
      per project), and pass `image` through `CaseStudyLayout` → `BaseLayout`.
- [ ] JSON-LD: refresh `knowsAbout` to lead with leadership, domain, and analysis (it currently
      leads with infrastructure terms); add `CreativeWork` markup on case studies.
- [ ] Off-site setup (Michael): verify the domain in Google Search Console and submit the sitemap;
      enable Web Analytics in the Vercel dashboard.

### Phase 7: Copy pass and QA (M)

- [ ] Run all changed prose through the `voice-professional` agent (new hooks, labels, terrain copy,
      404, footer).
- [ ] Accessibility audit against the principles' baseline (keyboard pass, screen reader spot
      check, contrast in both themes, reduced motion).
- [ ] Lighthouse on Home and one case study (performance budget: terrain must not push LCP past
      2.5s on mobile).
- [ ] Update `CLAUDE.md` (palette, fonts, components, terrain modes) and `ROADMAP.md`.

---

## Suggested order

`0 → 1 → 2` first (the visible redesign lands quickly). `3` can start in parallel after `0`, since
the terrain is self-contained. Then `4 → 5 → 6 → 7`. Phase 3c layers 2 and 3 are optional and can
ship after everything else.

## Inputs needed from Michael

- Answers to the open decisions above
- Real data for the first case-study chart
- Short hooks per project (drafts exist in the mockup; they'll go through the copy pass)
- Real headshot (still pending from the old roadmap)
