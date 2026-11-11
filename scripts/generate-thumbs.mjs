#!/usr/bin/env node
/**
 * Small WebP previews of the project screenshots for the trailing hover image on project rows
 * (src/components/ProjectRow.astro shows them at 260px wide, so 520px covers 2x screens).
 * Re-run after `npm run screenshots` or after adding an image to public/images/projects/.
 */
import { readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public', 'images', 'projects');
const out = join(dir, 'thumbs');
mkdirSync(out, { recursive: true });

const sources = readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
for (const file of sources) {
  const name = file.replace(/\.\w+$/, '.webp');
  const info = await sharp(join(dir, file)).resize({ width: 520 }).webp({ quality: 78 }).toFile(join(out, name));
  console.log(`thumbs/${name}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
