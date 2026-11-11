#!/usr/bin/env node
/**
 * Fails the build if an image a page will request is missing. Nothing else catches these: the build
 * passes and the gap only shows when someone shares a link or opens the page.
 *   - link-preview cards: /images/og-image.png and /images/og/<slug>.png      fix: `npm run og`
 *   - WebP versions of each project screenshot under /images/projects/:
 *     thumbs/<name>.webp (row hover) and figures/<name>-800|1600.webp           fix: `npm run thumbs`
 * Reads src/data/projects.ts as text (no TypeScript import), so it runs on any Node the build uses.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const source = readFileSync(join(root, 'src/data/projects.ts'), 'utf8');
const slugs = [...source.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]);
// Same naming rule as projectImageName() in src/data/projects.ts.
const shots = [...source.matchAll(/^\s*(?:image|cardImage):\s*['"`]\/images\/projects\/([^/'"`]+)\.\w+['"`]/gm)].map((m) => m[1]);
const imageKeys = [...source.matchAll(/^\s*(?:image|cardImage):/gm)].length;
if (slugs.length === 0 || (imageKeys > 0 && shots.length === 0)) {
  console.error('✗ check:assets could not read project slugs or image paths from src/data/projects.ts (did the format change?)');
  process.exit(1);
}

const needed = [
  ['images/og-image.png', 'npm run og'],
  ...slugs.map((s) => [`images/og/${s}.png`, 'npm run og']),
  ...[...new Set(shots)].flatMap((n) => [
    [`images/projects/thumbs/${n}.webp`, 'npm run thumbs'],
    [`images/projects/figures/${n}-800.webp`, 'npm run thumbs'],
    [`images/projects/figures/${n}-1600.webp`, 'npm run thumbs'],
  ]),
];
const missing = needed.filter(([f]) => !existsSync(join(root, 'public', f)));
if (missing.length) {
  console.error(`\n✗ check:assets: missing image(s):\n${missing.map(([f, fix]) => `  public/${f}   (run \`${fix}\`)`).join('\n')}\n`);
  process.exit(1);
}
console.log(`✓ check:assets: preview cards for ${slugs.length} projects, WebP versions for ${new Set(shots).size} screenshots`);
