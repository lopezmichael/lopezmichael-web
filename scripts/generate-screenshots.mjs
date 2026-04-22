/**
 * Generate screenshots for portfolio projects.
 * Usage: node scripts/generate-screenshots.mjs
 *
 * Requires: npx playwright install chromium
 * Saves 1280x720 screenshots to public/images/projects/
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public/images/projects');

// Projects with external URLs to screenshot
const targets = [
  { slug: 'north-texas-evictions', url: 'https://northtexasevictions.org' },
  { slug: 'dallas-homesteads', url: 'https://dallashomesteads.tools.cpal.org' },
  { slug: 'blockwalking', url: 'https://blockwalking.tools.cpal.org' },
  { slug: 'rodriguez-wellbeing', url: 'https://www.rodriguezwellbeing.com' },
  { slug: 'digilab', url: 'https://digilab.cards' },
  { slug: 'digilab-shiny', url: 'https://github.com/lopezmichael/digimon-tcg-standings' },
  { slug: 'atomtemplates', url: 'https://github.com/lopezmichael/atomtemplates' },
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2,
});

for (const { slug, url } of targets) {
  const page = await context.newPage();
  const outPath = resolve(outDir, `${slug}.png`);

  try {
    console.log(`Capturing ${slug} — ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // Extra wait for JS-rendered content (Shiny apps, SPAs)
    await page.waitForTimeout(2000);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`  -> saved ${outPath}`);
  } catch (err) {
    console.error(`  !! Failed ${slug}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log('\nDone.');
