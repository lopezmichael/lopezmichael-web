#!/usr/bin/env node
/**
 * Design guardrail (docs/design-principles.md, principle 10: "Built to last").
 *
 * Fails when a color literal (hex, rgb[a](), hsl[a]()) appears in src/ outside the files that
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

// A hex color: 3, 4, 6 or 8 hex digits after "#", not part of a longer word.
// The look-behind skips URL fragments and ids such as href="#main-content" or "#a".
const HEX = /(?<![\w&/="'-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
// Also catch hex inside Tailwind arbitrary values and quoted strings, e.g. bg-[#fff] or '#fff'.
const HEX_IN_VALUE = /(?:\[|["'])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const FUNC = /\b(?:rgba?|hsla?)\(\s*\d/g;

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
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    const hits = [...line.matchAll(HEX), ...line.matchAll(HEX_IN_VALUE), ...line.matchAll(FUNC)];
    for (const m of hits) problems.push(`${rel}:${i + 1}  ${m[0].replace(/^[\["']/, '')}  →  ${line.trim().slice(0, 100)}`);
  });
}

const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`\n✗ check:design found ${unique.length} hard-coded color(s). Use a theme token instead`);
  console.error('  (see docs/design-principles.md → Tokens), or add the file to ALLOW in scripts/check-design.mjs');
  console.error('  if it truly must hold raw color values.\n');
  for (const p of unique) console.error('  ' + p);
  console.error('');
  process.exit(1);
}
console.log('✓ check:design: no hard-coded colors outside the token files');
