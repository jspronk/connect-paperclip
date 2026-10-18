/**
 * Downloads the AWS admin guide metric definition pages as markdown into data/raw/.
 * Writes data/raw/meta.json with URL, fetch time and SHA-256 per file so builds are reproducible.
 *
 * Usage: npm run docs:fetch            (main metrics-definitions page only)
 *        npm run docs:fetch -- --all   (also the feature-specific metric pages)
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://docs.aws.amazon.com/connect/latest/adminguide/';
const MAIN_PAGES = ['metrics-definitions'];
const FEATURE_PAGES = [
  'metric-primitive-definitions',
  'case-management-metrics',
  'bot-metrics',
  'contact-lens-metrics',
  'evaluation-metrics',
  'outbound-campaign-metrics',
  'scheduling-metrics',
];

export interface RawSourceMeta {
  slug: string;
  url: string;
  htmlUrl: string;
  fetchedAt: string;
  sha256: string;
  bytes: number;
}

async function main(): Promise<void> {
  const all = process.argv.includes('--all');
  const slugs = all ? [...MAIN_PAGES, ...FEATURE_PAGES] : MAIN_PAGES;
  const outDir = path.resolve('data/raw');
  await mkdir(outDir, { recursive: true });

  const metaPath = path.join(outDir, 'meta.json');
  let meta: Record<string, RawSourceMeta> = {};
  try {
    meta = JSON.parse(await readFile(metaPath, 'utf8')) as Record<string, RawSourceMeta>;
  } catch {
    // first run
  }

  for (const slug of slugs) {
    const url = `${BASE}${slug}.md`;
    process.stdout.write(`Fetching ${url} ... `);
    const res = await fetch(url, { headers: { 'user-agent': 'connect-metrics-helper docs fetcher' } });
    if (!res.ok) {
      console.log(`FAILED (${res.status})`);
      process.exitCode = 1;
      continue;
    }
    const text = await res.text();
    if (!/^#\s/m.test(text)) {
      console.log('FAILED (response does not look like markdown)');
      process.exitCode = 1;
      continue;
    }
    const sha256 = createHash('sha256').update(text).digest('hex');
    await writeFile(path.join(outDir, `${slug}.md`), text, 'utf8');
    meta[slug] = {
      slug,
      url,
      htmlUrl: `${BASE}${slug}.html`,
      fetchedAt: new Date().toISOString(),
      sha256,
      bytes: Buffer.byteLength(text),
    };
    console.log(`ok (${meta[slug].bytes} bytes)`);
  }

  await writeFile(metaPath, JSON.stringify(meta, null, 2) + '\n', 'utf8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
