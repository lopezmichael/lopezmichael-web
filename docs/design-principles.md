# Design Principles: Canyon Blush

**Status:** Adopted 2026-11-11 · **Reference mockup:** [`docs/mockups/canyon-blush.html`](mockups/canyon-blush.html) (open in a browser; also published as a private artifact)
**Plan that implements this:** [`docs/plans/2026-11-11-canyon-blush-redesign.md`](plans/2026-11-11-canyon-blush-redesign.md)

This document is the source of truth for how lopezmichael.dev looks and behaves. When a
choice isn't covered here, pick the option that best serves the reader below, then add
the decision to this file.

---

## Who the site is for

**Primary reader:** a hiring manager or recruiter evaluating Michael for a data leadership
role (Director / Head of Data) in civic tech or social impact. They arrive from LinkedIn,
a referral, or a search for Michael's name, and skim for two minutes.

**What they should leave with:** this person leads data functions, knows the domain, and
thinks clearly. The site itself should feel made by a person with taste, not assembled
from a template.

**Constraint:** the job search stays discreet (see `CLAUDE.md`). Nothing on the site
signals that Michael is looking.

---

## The ten principles

### 1. Type carries the personality
One big type moment per page does the work that decoration used to do. The display pairing
is a heavy grotesk (uppercase, tight tracking) set against an italic serif in wine:
`MICHAEL` / *Lopez*. Headings below that are calm. Never stack two loud type moments
on one screen.

### 2. Lists and hairlines over cards
Content sits on the page, separated by 1px rules and small uppercase labels. A border, fill,
radius, or shadow marks an element as an object, so use them only where something
really is a separate object (a screenshot, a button, the terrain band). No rows of identical
rounded cards. No pill tags on everything.

### 3. Warm, not loud
Blush and oxblood with wine as the **only** highlight color. The canyon warmth lives in the
blush ground and the terrain lines. No orange fills, no scrolling tickers or marquee banners,
no badges or pulsing dots competing for attention. If something feels like an ad, it goes.

### 4. One hand-made thing per view
The terrain is the signature: generative, specific to a place, reactive to the visitor. Each
screen gets at most one crafted moment like it. Everything around it stays quiet.

### 5. Show the data, don't describe it
Case studies earn their place with one small interactive view of real data (a scrubbable
timeline, a slider) rather than a stock screenshot. Real figures only. Anything not yet
confirmed is visibly labeled as a draft and never ships to production.

### 6. Interaction rewards attention, never gates content
Hover, cursor, and drag effects are extras. Every piece of content is visible in the first
still frame, reachable by keyboard, and readable on touch. `prefers-reduced-motion` turns
off all autonomous motion. Nothing waits at `opacity: 0` for a scroll observer.

### 7. Structure is information
Numbers, eyebrows, and dividers must say something true. Use "01 / 02 / 03" only for a
real sequence. Labels name what the reader recognizes ("Selected work", "Now"), never
section-type filler ("Our approach").

### 8. Left-aligned editorial grid
A narrow label column on the left, content on the right (roughly 1 : 3), aligned to a shared
gutter. Avoid centering everything; center only a single short element when it really is
the focus.

### 9. Specific, discreet copy
Plain sentences, real numbers, named places and organizations. All prose goes through the
`voice-professional` agent. Avoid: "move the needle", "actionable", "deliver real impact",
overusing "at the intersection of", and em dashes in body copy.

### 10. Built to last
Tokens over literals, components over copy-paste, and a check that fails the build when
someone hard-codes a color (borrowed from DigiLab's conventions tests). The site should be
easy for a future session to extend without drifting from this document.

---

## What we removed, and why (the "AI-built" tells)

| Pattern | Why it goes |
|---|---|
| Cream `#FBF6EE` + terracotta + charcoal palette | The single most common look for AI-generated sites right now |
| Three equal rounded cards with shadow and pill tags | Template default; flattens hierarchy |
| Big faded `01 / 02 / 03` numerals on non-sequential sections | Decoration posing as structure |
| Italic pull quote with a colored left bar | Template default |
| Short orange rule before every section heading | Decoration repeated until it means nothing |
| Wavy SVG divider above the footer | Template default |
| Two stacked contact CTAs on one page | Redundant; reads as pushy |
| "Built with Astro and Three.js" footer credit | Developer-portfolio filler |
| Everything centered | Reads as generated; hurts scanning |
| Scrolling ticker band, orange highlight fills | Tested in the mockup and rejected: they feel like ads |

---

## Tokens

### Color

Defined once in `src/styles/global.css`. Each token is a CSS variable that flips with the theme, exposed to Tailwind as a color (`bg-page`, `text-ink`, `text-muted`, `border-line`, `text-wine`, `bg-wine-deep`, `text-on-wine`, `bg-band`), so components never need a `dark:` twin. Fonts are `font-display`, `font-serif`, `font-sans`, `font-mono`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `page` | `#F2D8C9` blush | `#1E1211` | Page ground |
| `raised` | `#F8E8DE` | `#2A1917` | Alternate section ground (e.g. the chart section) |
| `ink` | `#34191A` oxblood | `#F2D8C9` | Body text, headings |
| `muted` | `#7B5148` | `#C9A193` | Labels, captions, metadata |
| `line` | `ink` @ 22% | `ink` @ 18% | Hairline rules |
| `wine` | `#8B2D3D` | `#F0A3A8` | Italics, links, nav underline, focus |
| `wine-deep` | `#7E2836` | `#6E2430` | Row hover fill, chart bars, primary button fill |
| `on-wine` | `#F8E8DE` | `#F8E1D6` | Text on `wine-deep` |
| `band` | `#1F100E` | `#130A09` | Terrain band ground (always dark) |
| Terrain ramp | `#4A2420` → `#A04428` → `#C4724D` → `#D4956E` → `#F2C685` | same | Terrain lines, low to high |

Lineage: `ink` deepens the old charcoal `#2A2520`; `wine` is kept from the old `cool` token;
the terrain ramp reuses the old canyon, secondary, and sand colors. The old orange
`#D86B3A` survives only inside the terrain ramp.

**Contrast (WCAG 2.1, all AA or better):** ink/bg 11.9:1 · muted/bg 5.0:1 · wine/bg 6.1:1 ·
on-wine/wine-deep 7.8:1 · dark ink 13.4:1 · dark muted 7.8:1 · dark wine 9.1:1 ·
dark on-wine 8.6:1. Recheck if any value changes.

**Rules:** wine is the only highlight. Semantic colors (success/error) are separate and rare.
Never put `muted` text on `wine-deep`.

### Type

| Role | Face | Use |
|---|---|---|
| Display | **Bricolage Grotesque** 700 / 800 | Wordmark, project titles, big numbers |
| Serif | **Instrument Serif** regular + italic | Statements, hooks, captions, the italic half of the wordmark |
| Body | **Instrument Sans** 400 / 500 / 600 | Running text, UI |
| Data | **JetBrains Mono** 400 / 500 | Coordinates, seeds, chart axes, clock |

All fonts are **self-hosted** via `@fontsource` packages. The CSP sets `font-src 'self'`, so
Google Fonts links will silently fail in production.

Scale (fluid, clamp-based): wordmark ~15vw (max 12.5rem) · statement serif 2–3.8rem ·
project title 1.25–1.9rem · body 1.05rem / 1.6 · labels 12px uppercase, 0.12em tracking.
Running text stays under ~65 characters per line.

### Shape, space, motion

- **Radius:** 6px for interactive rows and screenshots; 999px only for small buttons; 0 for
  sections. No `rounded-lg` by default.
- **Shadow:** only on floating objects (the trailing screenshot). Nothing else.
- **Spacing:** sections breathe (`clamp(40px, 6vw, 80px)` vertical); groups use `gap`, not
  margins.
- **Motion:** 150–350ms, ease-out; one spring (the "hello!" pop). Terrain drift is slow
  enough to notice only after a few seconds.

---

## Terrain principles

1. **Generative.** Built from layered simplex noise with randomized parameters, so every visit
   is different. Keep the existing Three.js pipeline (`src/lib/terrain/`) as the base and extend it;
   don't replace it.
2. **Feels like a place.** Terrain modes are modeled on real landforms and places (canyon
   terraces and river channels, a city street grid, North Texas prairie). The label names the place
   and the seed, in mono.
3. **Reacts to the visitor.** The ground rises gently toward the cursor or finger and settles
   when they leave. A small control lets the visitor regrow or switch modes.
4. **Respects the visitor.** Location input is coarse and never stored (see the plan). No
   browser geolocation prompt. Reduced motion means a still frame plus pointer response
   only.
5. **Always dark, always a band.** The terrain sits in a dark band between blush sections. It is
   no longer a full-viewport hero with text on top.
6. **Cheap.** Pauses when off-screen or when the tab is hidden; fewer segments on small screens.

---

## Interaction catalogue

**Approved**
- Terrain cursor lift, regrow, and mode switch
- Project rows: wine fill on hover/focus; screenshot trails the cursor and tilts with velocity
- One interactive chart per case study (scrub or slider; keyboard-operable range input)
- Copy-to-clipboard email with a "Copied" state and the "hello!" pop
- Live local clock in the header ("Dallas · 10:47 AM CT")

**Rejected** (don't add without revisiting this list)
- 3D tilt on cards, custom cursors and cursor followers, magnetic buttons
- Scroll-jacking, heavy parallax, count-up numbers on scroll
- Marquee/ticker bands, auto-advancing carousels, toast spam

---

## Accessibility baseline (non-negotiable)

- Visible `:focus-visible` on every interactive element (wine outline, 2px, 3px offset)
- Theme toggle announces state ("Switch to dark mode" / "Switch to light mode")
- One `h1` per page; headings never skip levels
- Every hover effect has a focus equivalent; nothing is hover-only
- Charts have a text alternative (caption + `aria-live` on the scrubbed value)
- All motion respects `prefers-reduced-motion`
- Contrast stays at AA or better in both themes (table above)
