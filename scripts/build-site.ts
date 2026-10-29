/**
 * Builds site/cp.html, a single self-contained landing page for Connect Paperclip, from
 * site/cp.template.html. Placeholders:
 *   {{img:path}}       -> data: URI of an image file (jpg/png)
 *   {{svg:path}}       -> data: URI of an SVG file (for <link rel=icon>)
 *   {{svgInline:path}} -> the SVG markup itself, with the comment stripped
 * Paths are relative to the repo root. Usage: npm run site
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve();
const read = (p: string): Buffer => readFileSync(path.join(root, p));
const MIME: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

const html = readFileSync(path.join(root, 'site/cp.template.html'), 'utf8')
  .replace(/\{\{img:([^}]+)\}\}/g, (_, p: string) => {
    const mime = MIME[path.extname(p).toLowerCase()];
    if (!mime) throw new Error(`unsupported image type: ${p}`);
    return `data:${mime};base64,${read(p).toString('base64')}`;
  })
  .replace(/\{\{svg:([^}]+)\}\}/g, (_, p: string) => `data:image/svg+xml,${encodeURIComponent(read(p).toString('utf8').replace(/<!--[\s\S]*?-->/g, '').trim())}`)
  .replace(/\{\{svgInline:([^}]+)\}\}/g, (_, p: string) =>
    read(p).toString('utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/\s+width="\d+"\s+height="\d+"/, '').replace('<svg ', '<svg aria-hidden="true" ').trim(),
  );

if (/\{\{/.test(html)) throw new Error('unresolved placeholder in site/cp.template.html');
writeFileSync(path.join(root, 'site/cp.html'), html);
console.log(`wrote site/cp.html (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
