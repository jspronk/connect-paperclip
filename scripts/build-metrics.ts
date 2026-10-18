/**
 * Parses data/raw/*.md into src/data/metrics.json.
 * Refuses to write if the metric count drops more than 20% versus the committed file.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseCtrMarkdown } from '../src/lib/parse-ctr';
import { parseMetricsMarkdown } from '../src/lib/parse-docs';
import type { Metric, MetricsData, MetricsSource, Surface } from '../src/data/schema';
import type { RawSourceMeta } from './fetch-docs';

async function main(): Promise<void> {
  const rawDir = path.resolve('data/raw');
  const outPath = path.resolve('src/data/metrics.json');
  const meta = JSON.parse(await readFile(path.join(rawDir, 'meta.json'), 'utf8')) as Record<string, RawSourceMeta>;
  const files = (await readdir(rawDir)).filter((f) => f.endsWith('.md')).sort();

  const data: MetricsData = { generatedAt: new Date().toISOString(), sources: [], metrics: [] };
  const seenIds = new Set<string>();

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const md = await readFile(path.join(rawDir, file), 'utf8');
    const { metrics, warnings } = slug === 'ctr-data-model' ? parseCtrMarkdown(md, slug) : parseMetricsMarkdown(md, slug);
    for (const w of warnings) console.warn(`warn [${slug}] ${w.metric}: ${w.message}`);
    for (const m of metrics) {
      if (seenIds.has(m.id)) {
        console.warn(`warn [${slug}] duplicate id ${m.id}, keeping first`);
        continue;
      }
      seenIds.add(m.id);
      data.metrics.push(m);
    }
    const src = meta[slug];
    const source: MetricsSource = {
      slug,
      url: src?.url ?? '',
      htmlUrl: src?.htmlUrl ?? '',
      fetchedAt: src?.fetchedAt ?? '',
      sha256: src?.sha256 ?? '',
      metricCount: metrics.length,
    };
    data.sources.push(source);
  }

  applyColumnMap(data, seenIds, await readFile(path.resolve('src/data/contact-search-columns.json'), 'utf8'));

  let previousCount = 0;
  try {
    previousCount = (JSON.parse(await readFile(outPath, 'utf8')) as MetricsData).metrics.length;
  } catch {
    // no committed file yet
  }
  if (previousCount && data.metrics.length < previousCount * 0.8) {
    console.error(`Refusing to write: parsed ${data.metrics.length} metrics, previously ${previousCount}.`);
    process.exit(1);
  }

  await writeFile(outPath, JSON.stringify(data, null, 2) + '\n', 'utf8');

  const bySurface: Record<Surface, number> = { realtime: 0, historical: 0, dashboard: 0, contactsearch: 0 };
  let noLabel = 0;
  let noType = 0;
  for (const m of data.metrics) {
    if (!m.uiLabels.length) noLabel++;
    if (!m.metricType) noType++;
    for (const l of m.uiLabels) bySurface[l.surface]++;
  }
  console.log(`Wrote ${outPath}`);
  console.log(`  metrics: ${data.metrics.length} (${noLabel} without a UI label, ${noType} without a type)`);
  console.log(`  labels:  realtime ${bySurface.realtime}, historical ${bySurface.historical}, dashboard ${bySurface.dashboard}, contact search ${bySurface.contactsearch}`);
}

interface ColumnMap {
  surface: Surface;
  columns: Array<{ label: string; fields: string[]; qualifier?: string }>;
  custom: Array<{ id: string; name: string; docsUrl: string; summary: string; description: string }>;
}

/**
 * Attach console column labels (e.g. the Contact search page) to parsed contact record fields,
 * and add hand-written entries for console-only columns.
 */
function applyColumnMap(data: MetricsData, seenIds: Set<string>, json: string): void {
  const map = JSON.parse(json) as ColumnMap;
  for (const c of map.custom) {
    if (seenIds.has(c.id)) continue;
    const metric: Metric = {
      id: c.id,
      name: c.name,
      anchor: '',
      sourceSlug: 'custom',
      docsUrl: c.docsUrl,
      summary: c.summary,
      description: c.description,
      metricCategory: 'Contact search column',
      api: [],
      uiLabels: [],
      extraSections: {},
    };
    data.metrics.push(metric);
    seenIds.add(c.id);
  }
  const byId = new Map(data.metrics.map((m) => [m.id, m]));
  let attached = 0;
  for (const col of map.columns) {
    col.fields.forEach((id, order) => {
      const m = byId.get(id);
      if (!m) {
        console.warn(`warn [column-map] "${col.label}" refers to unknown id ${id}`);
        return;
      }
      const label = {
        surface: map.surface,
        label: col.label,
        ...(col.qualifier ? { qualifier: col.qualifier } : {}),
        ...(order ? { order } : {}),
      };
      m.uiLabels.push(label);
      attached++;
    });
  }
  console.log(`  column map: ${map.columns.length} ${map.surface} columns -> ${attached} field labels, ${map.custom.length} custom entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
