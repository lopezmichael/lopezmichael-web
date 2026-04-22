# lopezmichael.dev

Personal portfolio for Michael Lopez — data strategist at the intersection of civic tech and social impact.

## Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS v4 with `@theme` tokens
- **Font:** Inter (via `@fontsource/inter`)
- **3D:** Three.js terrain hero with GPU shaders, particles, and bloom post-processing
- **Hosting:** Vercel
- **Domain:** lopezmichael.dev

## Architecture

```
src/
├── components/       # Reusable UI components (Header, Footer, ThemeToggle, etc.)
├── layouts/          # BaseLayout.astro — HTML shell with meta/OG/JSON-LD
├── lib/terrain/      # Three.js terrain modules (shaders, particles, postprocessing)
├── page-views/       # Full page compositions (HomePage, AboutPage, ResumePage)
├── pages/            # Thin route shells that import page-views
├── data/             # Static content data (projects.ts, resume.ts)
└── styles/           # global.css with Tailwind @theme tokens
public/
├── images/           # Static images
└── files/            # Resume PDF, etc.
```

## Key Patterns

- **Thin page shells:** `src/pages/index.astro` just renders `<HomePage />`. All logic lives in `src/page-views/`.
- **Theme toggle:** `data-theme="dark"` attribute on `<html>`. Flash prevention via inline `<script is:inline>` in `<head>`.
- **Terrain isolation:** Three.js only loads on the home page via dynamic import in `TerrainHero.astro`.
- **Canyon palette:** Primary `#8B4D3B`, Secondary `#C4724D`, Accent `#E8C496`, Cool `#5A7D6B`, Neutral `#5C4D45`.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

## Dark Mode

CSS custom properties override in `@layer base` under `[data-theme="dark"]`. The `ThemeToggle` component dispatches a `themechange` CustomEvent that the terrain listens to for smooth color transitions.
