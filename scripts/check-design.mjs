#!/usr/bin/env node
/**
 * Design guardrail (docs/design-principles.md, principle 10: "Built to last").
 *
 * Fails when a color literal (hex, rgb()/hsl()/oklch()/..., or a Tailwind built-in palette class such
 * as text-white or bg-red-500) appears in src/ outside the files that
 * are allowed to define colors. Components should use the theme tokens (text-ink, bg-page,
 * var(--wine), ...) so the palette stays in one place and both themes stay correct.
 *
 * Runs automatically before `npm run build` (prebuild) and on its own via `npm run check:design`.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const srcDir = join(root, 'src');

// Files and folders allowed to contain color literals.
const ALLOW = [
  'src/styles/global.css',      // the token definitions themselves
  'src/lib/terrain/config.ts',  // the terrain's shader palette (WebGL needs raw values)
  'src/pages/preview/',         // internal, noindexed branding swatch page
];

const EXTENSIONS = ['.astro', '.ts', '.tsx', '.js', '.mjs', '.css'];

// Places where "#" starts a fragment or id, not a color (href="#fade", url(#grad), id="#abc").
// They are blanked out before matching, so one hex rule needs no context look-behind.
const FRAGMENT = /\b(?:href|xlink:href|id|for|aria-[a-z]+|data-[\w-]+)\s*=\s*["']?#[\w-]*|url\(\s*["']?#[\w-]+/g;
// A hex color: 3, 4, 6 or 8 hex digits after "#" (not an HTML entity such as &#039;).
const HEX = /(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const FUNC = /\b(?:rgba?|hsla?|oklch|oklab|lch|lab|hwb|color)\(\s*[\d.]/g;
// Named colors in CSS declarations (stylesheets and <style> blocks only).
const CSS_KEYWORD = /\b(?:color|background(?:-color)?|fill|stroke|(?:border|outline)(?:-[a-z]+)?-color)\s*:\s*(?:white|black)\b/g;
// Tailwind's built-in palette (text-white, bg-black/50, border-red-500, ...): these ignore the theme,
// so white text on a wine fill turns unreadable in dark mode. Use ink / page / on-wine instead.
const TW_PALETTE = new RegExp(
  '(?<![\\w-])(?:[a-z-]+:)*(?:text|bg|border(?:-[trblxy])?|fill|stroke|from|via|to|ring|outline|decoration|divide|placeholder|caret|accent|shadow)-' +
    '(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3})' +
    '(?:/\\d{1,3})?(?![\\w-])',
  'g',
);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXTENSIONS.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}

const allowed = (rel) => ALLOW.some((a) => (a.endsWith('/') ? rel.startsWith(a) : rel === a));

const problems = [];
for (const file of walk(srcDir)) {
  const rel = relative(root, file).split(sep).join('/');
  if (allowed(rel)) continue;
  let inStyle = rel.endsWith('.css');
  readFileSync(file, 'utf8').split('\n').forEach((raw, i) => {
    if (/<style[\s>]/.test(raw)) inStyle = true;
    const line = raw.replace(FRAGMENT, '');
    const hits = [
      ...line.matchAll(HEX),
      ...line.matchAll(FUNC),
      ...line.matchAll(TW_PALETTE),
      ...(inStyle ? line.matchAll(CSS_KEYWORD) : []),
    ];
    for (const m of hits) problems.push(`${rel}:${i + 1}  ${m[0]}  →  ${raw.trim().slice(0, 100)}`);
    if (/<\/style>/.test(raw)) inStyle = false;
  });
}

if (problems.length) {
  console.error(`\n✗ check:design found ${problems.length} hard-coded color(s). Use a theme token instead`);
  console.error('  (see docs/design-principles.md → Tokens), or add the file to ALLOW in scripts/check-design.mjs');
  console.error('  if it truly must hold raw color values.\n');
  for (const p of problems) console.error('  ' + p);
  console.error('');
  process.exit(1);
}
console.log('✓ check:design: no hard-coded colors outside the token files');
