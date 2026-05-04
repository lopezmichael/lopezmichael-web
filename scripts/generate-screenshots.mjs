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
  { slug: 'digilab-shiny', url: 'https://github.com/lopezmichael/digilab-app' },
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
    // Shiny apps keep WebSockets open and never reach networkidle, so we wait on `load`
    // and let JS-rendered content settle with a fixed delay.
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(3500);

    // NTE shows a welcome modal on first load; dismiss it before capturing.
    if (slug === 'north-texas-evictions') {
      try {
        await page.getByRole('button', { name: /dismiss/i }).click({ timeout: 4000 });
        await page.waitForTimeout(1500);
      } catch {
        // modal may not appear on every load — proceed regardless
      }
    }

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
