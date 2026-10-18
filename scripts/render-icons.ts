/**
 * Renders public/icons/icon.svg to the PNG sizes the manifest uses.
 * Usage: npm run icons
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const svg = readFileSync(path.resolve('public/icons/icon.svg'), 'utf8');
for (const size of [16, 32, 48, 128]) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  const out = path.resolve(`public/icons/icon${size}.png`);
  writeFileSync(out, png);
  console.log(`wrote ${out} (${png.length} bytes)`);
}
