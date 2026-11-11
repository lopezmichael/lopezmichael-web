#!/usr/bin/env node
/**
 * Fails the build if a project has no link-preview image. Project pages point og:image at
 * /images/og/<slug>.png (projectSeo in src/data/projects.ts); a missing file would ship a broken
 * preview and only show up when someone shares the link. Fix: `npm run og`.
 * Reads slugs as text (no TypeScript import), so it runs on any Node the build uses.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const source = readFileSync(join(root, 'src/data/projects.ts'), 'utf8');
const slugs = [...source.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]);
if (slugs.length === 0) {
  console.error('✗ check:og found no project slugs in src/data/projects.ts (did the format change?)');
  process.exit(1);
}
const missing = ['images/og-image.png', ...slugs.map((s) => `images/og/${s}.png`)].filter((f) => !existsSync(join(root, 'public', f)));
if (missing.length) {
  console.error(`\n✗ check:og: missing link-preview image(s). Run \`npm run og\`.\n${missing.map((f) => '  public/' + f).join('\n')}\n`);
  process.exit(1);
}
console.log(`✓ check:og: preview images present for all ${slugs.length} projects`);
