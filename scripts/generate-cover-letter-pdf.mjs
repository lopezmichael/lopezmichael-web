// Generates a designed cover-letter PDF that matches the resume letterhead
// (same contour header, name, tagline, and contact block as generate-resume-pdf.mjs).
// Real selectable text, embedded Inter. Needs: `npx playwright install chromium`.
//
// Usage:
//   node scripts/generate-cover-letter-pdf.mjs <input.md|txt> [output.pdf] [--date "Month D, YYYY"]
//
//   - If <input> is a markdown file containing a "## Cover letter" section, only
//     that section is used (everything up to the next "## " heading). This lets you
//     point it straight at a vault application note. Otherwise the whole file is the body.
//   - Paragraphs are separated by blank lines; single newlines inside a block become <br>
//     (so a "Thanks,\nMichael Lopez" sign-off stays on two lines).
//   - Date defaults to today; override with --date.
//   - If output.pdf is omitted, writes "<input basename> — Cover Letter.pdf" next to the input.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = '/Users/michaellopez/repos/lopezmichael-web';
const fdir = path.join(root, 'node_modules/@fontsource/inter/files');
const b64 = (f) => fs.readFileSync(path.join(fdir, f)).toString('base64');
const f400 = b64('inter-latin-400-normal.woff2');
const f500 = b64('inter-latin-500-normal.woff2');
const f600 = b64('inter-latin-600-normal.woff2');
const f700 = b64('inter-latin-700-normal.woff2');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- args ---
const argv = process.argv.slice(2);
const positional = [];
let dateOverride = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--date') dateOverride = argv[++i];
  else positional.push(argv[i]);
}
const inPath = positional[0];
if (!inPath) {
  console.error('Usage: node scripts/generate-cover-letter-pdf.mjs <input.md|txt> [output.pdf] [--date "Month D, YYYY"]');
  process.exit(1);
}
let outPath = positional[1];

// --- extract letter body ---
// If a "## Cover letter" section exists, take everything from it up to the next
// "## " heading (or end of file). Avoid the multiline flag here: with /m the `$`
// would match the end of the first line and truncate the letter to its greeting.
const raw = fs.readFileSync(inPath, 'utf8');
const section =
  raw.match(/##\s+Cover letter\s*\r?\n([\s\S]*?)\r?\n##\s/i) ||
  raw.match(/##\s+Cover letter\s*\r?\n([\s\S]*)$/i);
const bodyText = (section ? section[1] : raw).trim();
if (!bodyText) { console.error('No letter body found in', inPath); process.exit(1); }

if (!outPath) {
  const base = path.basename(inPath).replace(/\.[^.]+$/, '');
  outPath = path.join(path.dirname(inPath), `${base} — Cover Letter.pdf`);
}

// --- date ---
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const d = new Date();
const dateStr = dateOverride || `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

// --- paragraphs (blank-line separated; single newline -> <br>) ---
const paras = bodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const bodyHtml = paras.map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');

// contour paths — identical motif to the resume header
const contour = `
  <path d="M0 34 Q120 22 240 30 T480 26 T720 34 T960 28 T1000 32" />
  <path d="M0 58 Q140 46 280 54 T560 50 T840 58 T1000 54" />
  <path d="M0 82 Q100 72 220 78 T460 74 T700 82 T940 76 T1000 80" />`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Inter';font-weight:400;src:url(data:font/woff2;base64,${f400}) format('woff2');}
@font-face{font-family:'Inter';font-weight:500;src:url(data:font/woff2;base64,${f500}) format('woff2');}
@font-face{font-family:'Inter';font-weight:600;src:url(data:font/woff2;base64,${f600}) format('woff2');}
@font-face{font-family:'Inter';font-weight:700;src:url(data:font/woff2;base64,${f700}) format('woff2');}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Inter',system-ui,sans-serif;color:#2A2520;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
a{color:#8B2D3D;text-decoration:none;}

/* Header — matches generate-resume-pdf.mjs exactly */
.header{position:relative;overflow:hidden;padding:2px 0 12px;margin-bottom:4px;border-bottom:2px solid #A04428;}
.header .contour{position:absolute;top:-6px;right:-10px;width:1000px;height:110px;opacity:.16;pointer-events:none;}
.header .contour path{fill:none;stroke:#A04428;stroke-width:1.4;stroke-linecap:round;}
.head-row{position:relative;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;}
.name{font-size:25pt;font-weight:700;letter-spacing:-.6px;line-height:1;color:#2A2520;}
.tagline{font-size:10.5pt;font-weight:600;color:#8B2D3D;margin-top:4px;}
.contact{text-align:right;font-size:8.6pt;color:#5a4f45;line-height:1.5;}
.contact a{color:#5a4f45;}
.contact .c-loc{font-weight:600;color:#2A2520;}

/* Letter body */
.date{font-size:9.6pt;color:#8a7d70;margin:22px 0 16px;}
.letter p{font-size:10.6pt;line-height:1.5;color:#332e28;margin-bottom:11px;}
.letter p:last-child{margin-bottom:0;}
</style></head><body>

  <div class="header">
    <svg class="contour" viewBox="0 0 1000 110" preserveAspectRatio="none">${contour}</svg>
    <div class="head-row">
      <div>
        <div class="name">Michael Lopez</div>
        <div class="tagline">Data Strategist · Civic Tech &amp; Social Impact</div>
      </div>
      <div class="contact">
        <div><span class="c-loc">Dallas, TX</span> · (305) 546-8721</div>
        <div><a href="mailto:michael@lopezstudio.dev">michael@lopezstudio.dev</a> · <a href="https://lopezmichael.dev">lopezmichael.dev</a></div>
        <div><a href="https://linkedin.com/in/michael-d-lopez">linkedin.com/in/michael-d-lopez</a> · <a href="https://github.com/lopezmichael">github.com/lopezmichael</a></div>
      </div>
    </div>
  </div>

  <div class="date">${esc(dateStr)}</div>
  <div class="letter">${bodyHtml}</div>
</body></html>`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(async () => { await document.fonts.ready; });
await page.pdf({ path: outPath, format: 'Letter', printBackground: true, margin: { top: '0.5in', bottom: '0.5in', left: '0.7in', right: '0.7in' } });
await browser.close();
console.log('wrote', outPath);
