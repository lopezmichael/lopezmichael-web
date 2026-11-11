#!/usr/bin/env node
/**
 * WebP versions of the project screenshots (the 2560px PNGs are far larger than any slot):
 *   thumbs/<name>.webp          520px, the trailing hover image on project rows (shown at 260px)
 *   figures/<name>-800.webp     800px  } the screenshot on project pages (ProjectFigure, srcset);
 *   figures/<name>-1600.webp    1600px }   the PNG stays as the source and fallback
 * Re-run after `npm run screenshots` or after adding an image to public/images/projects/.
 * The build fails (check:assets) if a project's WebP versions are missing.
 */
import { readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public', 'images', 'projects');
const out = join(dir, 'thumbs');
const figures = join(dir, 'figures');
mkdirSync(out, { recursive: true });
mkdirSync(figures, { recursive: true });

const sources = readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
for (const file of sources) {
  const name = file.replace(/\.\w+$/, '.webp');
  const info = await sharp(join(dir, file)).resize({ width: 520 }).webp({ quality: 78 }).toFile(join(out, name));
  console.log(`thumbs/${name}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  for (const width of [800, 1600]) {
    const fig = file.replace(/\.\w+$/, `-${width}.webp`);
    const f = await sharp(join(dir, file)).resize({ width }).webp({ quality: 80 }).toFile(join(figures, fig));
    console.log(`figures/${fig}  ${f.width}x${f.height}  ${(f.size / 1024).toFixed(0)} KB`);
  }
}
