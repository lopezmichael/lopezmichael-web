#!/usr/bin/env node
/**
 * Link-preview (Open Graph) images and favicon PNGs, in the Canyon Blush style
 * (docs/design-principles.md). One script so every image comes from the same template.
 *
 *   public/images/og-image.png          site default (home and pages without their own)
 *   public/images/og/<slug>.png         one per project, used by its detail page
 *   public/favicon.svg, favicon-16.png, favicon-32.png, apple-touch-icon.png
 *
 * Nothing here is a copy to keep in sync: colors come from the tokens in src/styles/global.css and
 * the terrain ramp in src/lib/terrain/config.ts, fonts are embedded from @fontsource, and project
 * titles and hooks are read from src/data/projects.ts. Importing .ts needs Node 22.6+ (the npm script
 * passes --experimental-strip-types) and only erasable TypeScript in those files (no enums).
 * Re-run after changing a token, a project's title or hook, or adding a project: `npm run og`.
 * The build fails (check:og) if a project has no image.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { projects } from '../src/data/projects.ts';
import { TERRAIN_RAMP } from '../src/lib/terrain/config.ts';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const font = (pkg, file) => readFileSync(join(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64');

// Light-theme tokens from the :root block of global.css (the block before the dark override).
const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
const rootStart = css.indexOf(':root {');
const rootBlock = css.slice(rootStart, css.indexOf('}', rootStart));
const token = (name) => {
  const m = rootBlock.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m) throw new Error(`token --${name} not found in global.css`);
  return m[1];
};
const C = { page: token('page'), ink: token('ink'), muted: token('muted'), wine: token('wine'), wineDeep: token('wine-deep'), band: token('band'), onBand: token('on-band') };
const RAMP = TERRAIN_RAMP.map(([r, g, b]) => `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`);

// Stable per-slug seed, so adding or reordering projects never changes another project's artwork.
const seedOf = (text) => [...text].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7);

const fontFaces = `
@font-face { font-family: 'Bricolage Grotesque'; font-weight: 800; src: url(data:font/woff2;base64,${font('bricolage-grotesque', 'bricolage-grotesque-latin-800-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'Instrument Serif'; font-style: normal; src: url(data:font/woff2;base64,${font('instrument-serif', 'instrument-serif-latin-400-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'Instrument Serif'; font-style: italic; src: url(data:font/woff2;base64,${font('instrument-serif', 'instrument-serif-latin-400-italic.woff2')}) format('woff2'); }
@font-face { font-family: 'JetBrains Mono'; font-weight: 400; src: url(data:font/woff2;base64,${font('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff2')}) format('woff2'); }`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Terrain ridgelines along the bottom, seeded per image so each project gets its own ground.
const ridgeScript = (seed) => `
const cv = document.getElementById('ridge'), ctx = cv.getContext('2d');
const W = cv.width, H = cv.height, ramp = ${JSON.stringify(RAMP)};
let s = ${seed} >>> 0; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
const ph = Array.from({ length: 4 }, () => rnd() * 6.283);
const h = (x, z) => Math.sin(x * 1.7 + ph[0]) * .5 + Math.sin(x * 3.9 + z * 1.3 + ph[1]) * .28 + Math.sin(x * 7.3 - z * 2.1 + ph[2]) * .14 + Math.sin(x * 13.1 + z * 3.7 + ph[3]) * .06;
ctx.fillStyle = '${C.band}'; ctx.fillRect(0, 0, W, H);
for (let i = 0; i < 26; i++) {
  const z = i / 25, base = H * (.15 + z * .95), amp = H * (.35 + .3 * Math.sin(z * 3.1));
  const pts = [];
  for (let x = 0; x <= W; x += 6) { const u = x / W; pts.push([x, base - Math.max(0, h(u * 2.4, z * 3) + .5) * amp * Math.pow(Math.sin(Math.PI * u), .8)]); }
  ctx.beginPath(); ctx.moveTo(0, H); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(W, H); ctx.closePath();
  ctx.fillStyle = '${C.band}'; ctx.fill();
  ctx.beginPath(); pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.strokeStyle = ramp[Math.min(4, Math.floor(z * 4.99))]; ctx.globalAlpha = .35 + z * .65; ctx.lineWidth = 1 + z * 1.2; ctx.stroke(); ctx.globalAlpha = 1;
}`;

const page = (content, seed) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces}
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; background: ${C.page}; color: ${C.ink}; position: relative; overflow: hidden; }
.top { position: absolute; inset: 0 0 190px 0; padding: 54px 64px; display: flex; flex-direction: column; }
.eyebrow { font: 400 18px 'JetBrains Mono', monospace; letter-spacing: .04em; color: ${C.muted}; }
.band { position: absolute; left: 0; right: 0; bottom: 0; height: 190px; }
.band canvas { display: block; width: 1200px; height: 190px; }
.sig { position: absolute; left: 64px; bottom: 22px; font: 400 18px 'JetBrains Mono', monospace; letter-spacing: .04em; color: ${C.onBand}; text-shadow: 0 0 6px ${C.band}, 0 0 12px ${C.band}, 0 0 18px ${C.band}; }
</style></head><body>
<div class="top">${content}</div>
<div class="band"><canvas id="ridge" width="2400" height="380"></canvas><p class="sig">Michael Lopez · lopezmichael.dev</p></div>
<script>${ridgeScript(seed)}</script>
</body></html>`;

const siteCard = page(`
  <p class="eyebrow">lopezmichael.dev</p>
  <div style="margin-top: auto;">
    <p style="font: 800 128px/0.9 'Bricolage Grotesque'; letter-spacing: -.035em; text-transform: uppercase;">Michael</p>
    <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-top: -10px;">
      <p style="font: 400 30px/1.2 'Instrument Serif'; padding-bottom: 14px;">Data Leader · Civic Tech &amp; Social Impact</p>
      <p style="font: italic 400 140px/0.9 'Instrument Serif'; color: ${C.wine}; letter-spacing: -.02em;">Lopez</p>
    </div>
  </div>`, 421);

const projectCard = (p) => page(`
  <p class="eyebrow">Selected work</p>
  <div style="margin-top: auto;">
    <p style="font: 800 ${p.title.length > 26 ? 72 : 84}px/0.98 'Bricolage Grotesque'; letter-spacing: -.03em; max-width: 1000px;">${esc(p.title)}</p>
    <p style="font: italic 400 36px/1.2 'Instrument Serif'; color: ${C.wine}; margin-top: 18px; max-width: 980px;">${esc(p.hook ?? p.description)}</p>
  </div>`, seedOf(p.slug));

// PW_CHROMIUM_PATH lets a machine with a different preinstalled Chromium run this without `npx playwright install`.
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const shot = async (html, out) => {
  const tab = await ctx.newPage();
  await tab.setContent(html, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: out, type: 'png' });
  await tab.close();
  console.log('wrote', out.replace(root + '/', ''));
};

mkdirSync(join(root, 'public/images/og'), { recursive: true });
await shot(siteCard, join(root, 'public/images/og-image.png'));
for (const p of projects) await shot(projectCard(p), join(root, 'public/images/og', `${p.slug}.png`));

// Favicon: a terrain ridge with one contour line, on wine. No text, so no font needed. The ridge
// stops above the bottom edge so the tile keeps its outline on light browser tabs.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs><clipPath id="tile"><rect width="32" height="32" rx="7"/></clipPath></defs>
  <g clip-path="url(#tile)">
    <rect width="32" height="32" fill="${C.wineDeep}"/>
    <path d="M0 25V19.5c3.5-3 6.5-1 9.5-4.5 2.3-2.6 4.2-4.8 6.8-4.8 2.8 0 4.4 2.6 6.9 2.6 2.7 0 4.5-2.2 8.8-3.6V25z" fill="${C.page}"/>
    <path d="M3 11.5c3-2 5-1 7.5-3.6 2-2.1 3.6-3.9 6-3.9 2.6 0 4 2 6.3 2 2.1 0 3.7-1.4 6.2-2.4" fill="none" stroke="${C.page}" stroke-width="1.8" stroke-linecap="round" opacity=".75"/>
  </g>
</svg>
`;
writeFileSync(join(root, 'public/favicon.svg'), svg);
console.log('wrote public/favicon.svg');

// Favicon PNGs from that SVG (apple-touch-icon is full-bleed: iOS applies its own rounding).
for (const [size, out, bleed] of [[16, 'favicon-16.png'], [32, 'favicon-32.png'], [180, 'apple-touch-icon.png', true]]) {
  const icon = await browser.newPage({ viewport: { width: size, height: size } });
  const src = bleed ? svg.replace(/ rx="[\d.]+"/g, '') : svg;
  await icon.setContent(`<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${src}`);
  await icon.screenshot({ path: join(root, 'public', out), omitBackground: true });
  await icon.close();
  console.log('wrote', `public/${out}`);
}

await browser.close();
