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

## Open decisions (for Michael)

1. **Consulting CTA.** Drop the "Building something for the people closest to the problem?"
   band from Home and About and let the footer's "Say hello" carry contact? *Recommended: yes.*
2. **Showing the visitor's city.** When location-aware terrain is on, should the label say
   "Generated for Chicago", or only use the location quietly as a seed? *Recommended: show the
   region, not the city ("Generated for the Midwest"), to avoid feeling watched.*
3. **Case-study charts.** Which dataset per case study, and who supplies the numbers. Candidates:
   eviction filings over time (Eviction), take-up by tract (Homestead), tournaments/players
   over time (DigiLab), team or platform milestones (CPAL Data Function).
4. **Work with me page.** Restyle it, or leave it hidden and unchanged? It's already off the nav
   and noindexed. *Recommended: restyle lightly so it matches if someone has the link.*
5. **Resume PDF.** Re-theme to Canyon Blush, or keep the current canyon PDF? *Recommended: re-theme
   later (it's printed/ATS-read, so it's lower priority).*

---

## Phases

Each phase is one PR off `main`, reviewed on a Vercel preview before merge. Sizes: S (≤ half a
day of agent work), M (≈ a day), L (multi-day).

### Phase 0: Foundations (M)

- [ ] Add `@fontsource/bricolage-grotesque`, `@fontsource/instrument-sans`,
      `@fontsource/instrument-serif`, `@fontsource/jetbrains-mono`; remove Inter weights no longer used.
- [ ] Rewrite the `@theme` block in `src/styles/global.css` to the new tokens (`bg`, `surface`,
      `ink`, `muted`, `line`, `wine`, `wine-deep`, `on-wine`, `band`) with dark values under
      `[data-theme="dark"]`. Map old names temporarily so pages don't break mid-migration, then remove
      them in Phase 5.
- [ ] Global base styles: `:focus-visible` outline, heading font roles, link style (wine,
      underline offset), selection color.
- [ ] `ThemeToggle.astro`: state-aware `aria-label` (fixes the static "Toggle dark mode").
- [ ] Guardrail: `scripts/check-design.mjs` (run in `npm run build` via a `prebuild` script) that
      fails on hex color literals in `src/**/*.astro` outside the allowed files (`global.css`,
      `src/lib/terrain/config.ts`). Modeled on DigiLab's `conventions.test.ts`.

### Phase 1: Site shell (S)

- [ ] `Header.astro`: name in display face, nav (Work · About · Resume), wine underline for the
      current page, live "Dallas · time CT" clock (client-side `Intl`, no network).
- [ ] `Footer.astro`: "Say *hello.*" + copy-email button with "Copied" state; remove the wavy
      divider and the "Built with Astro and Three.js" credit; keep GitHub/LinkedIn as text links.
- [ ] `BaseLayout.astro`: body ground and theme color meta updated to blush/oxblood.

### Phase 2: Home (M)

- [ ] Hero: `MICHAEL` / *Lopez* wordmark, tagline and supporting line beneath (fixes the
      unreadable white tagline over the terrain).
- [ ] Terrain becomes a band below the hero (~32vw tall), with the coordinates/seed label and the
      Regrow control. The full-viewport hero and the bouncing scroll arrow go.
- [ ] "Now" statement block in the label/content grid.
- [ ] New `ProjectIndex.astro` + `ProjectRow.astro` (title · hook · tags · arrow) with wine hover
      fill and the trailing, tilting screenshot (pointer only; hidden on touch). Needs a short `hook`
      field per project in `src/data/projects.ts`.
- [ ] Remove the consulting CTA band (pending open decision 1).

### Phase 3: Terrain v2 (L)

Extends `src/lib/terrain/` rather than replacing it. The Three.js pipeline, GPU simplex
shader, bloom, randomized parameters, dynamic import, and always-dark rendering all stay.

**3a. Modes as shader variants**
- [ ] Add a `uMode` uniform and per-mode height functions in `shaders.ts`:
  - **Canyon** (default; today's noise plus the mockup's improvements): mesa terraces
    (quantized height with smooth steps) and a meandering river channel carved through the field.
  - **City:** a street grid. Quantize the plane into blocks and lots; lot height comes from noise
    weighted by distance to a "downtown" center, so it rises into a skyline and falls off to
    neighborhoods; streets stay at ground level. In wireframe it reads as a city seen from above,
    and it ties to the civic/urban work.
  - **Prairie:** gentle rolling North Texas plains with one escarpment ridge (a nod to the
    Dallas escarpment) and a creek line.
- [ ] `config.ts`: per-mode parameter ranges in the style of `randomizeTerrainParams()`, so every mode
      stays generative.
- [ ] Smooth transition between modes (blend heights over ~800ms) rather than a hard cut.

**3b. Reactivity and controls**
- [ ] Pointer lift: raycast the pointer onto the terrain plane; pass `uPointer` and an eased
      `uPointerStrength` to the shader for a gaussian rise. Touch-drag works the same way.
- [ ] Controls on the band: mode switcher (Canyon · City · Prairie) and Regrow, as real buttons.
      The label shows place, mode, and seed in mono.
- [ ] Shareable terrain: `?terrain=city-4821` restores a mode and seed, so a visitor can send a view
      they like.
- [ ] Remember the visitor's last mode in `localStorage` (wrapped in try/catch; a convenience only).

**3c. Location-aware defaults (privacy-first, in layers)**
- [ ] **Layer 1, no network:** use the browser's time zone and local time.
      - Time zone picks a default mode and place label (e.g. `America/Chicago` → Prairie or Canyon,
        "North Texas"; large metro time zones → City).
      - Local time shifts the ramp slightly: dawn, day, dusk, and night tints within the same canyon
        palette.
- [ ] **Layer 2, optional:** Vercel's IP geolocation headers (`x-vercel-ip-city`,
      `x-vercel-ip-country-region`) read by a tiny Vercel Routing Middleware that sets a short-lived,
      coarse-region cookie. The terrain seeds from a hash of the region, so a visitor from the same
      place sees a consistent "their" terrain. Nothing is stored server-side, there are no third-party
      lookups, and there's no browser geolocation prompt (`Permissions-Policy` already blocks it).
      *Verify during build:* middleware support for a static Astro output on Vercel; fall back to a
      single `/api/where` edge function if needed.
- [ ] **Layer 3, later:** real elevation for the home place. Bake a small Dallas heightmap from public
      USGS 3DEP data into a PNG at build time and blend it into Canyon/Prairie. No runtime network.

**3d. Performance**
- [ ] Pause rendering when the band is off-screen (IntersectionObserver) or the tab is hidden.
- [ ] Fewer segments and no bloom on small screens or low-power devices.
- [ ] Reduced motion: a still frame, with pointer lift only.

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
      caption, theme tokens). Ship the first chart on one case study once real data is confirmed
      (open decision 3); the others follow as data arrives.

### Phase 5: Remaining pages (M)

- [ ] **About:** editorial grid, a single contact moment (remove the duplicate CTA), "What we've
      built" as a ruled list without the decorative numerals, skills as plain columns, media list
      kept. Keep the monogram until the real photo arrives, restyled in wine/blush.
- [ ] **Resume:** sidebar and timeline restyled to tokens and type.
- [ ] **Work with me:** light restyle (pending open decision 4).
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
