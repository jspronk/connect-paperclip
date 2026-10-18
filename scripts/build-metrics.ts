/**
 * Parses data/raw/*.md into src/data/metrics.json.
 * Refuses to write if the metric count drops more than 20% versus the committed file.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseCtrMarkdown } from '../src/lib/parse-ctr';
import { parseMetricsMarkdown } from '../src/lib/parse-docs';
import { parseSecurityProfilesMarkdown } from '../src/lib/parse-security-profiles';
import type { Metric, MetricsData, MetricsSource, Surface } from '../src/data/schema';
import { normalizeLabel } from '../src/lib/normalize';
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
    const { metrics, warnings } =
      slug === 'ctr-data-model'
        ? parseCtrMarkdown(md, slug)
        : slug === 'security-profile-list'
          ? parseSecurityProfilesMarkdown(md, slug)
          : parseMetricsMarkdown(md, slug);
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

  // Feature-specific pages (bot, Cases, campaigns, metric primitives, ...) repeat metrics that the
  // main definitions page already covers. Keep the main-page entry so a label shows one tab, not two.
  const mainByName = new Map(data.metrics.filter((m) => m.sourceSlug === 'metrics-definitions').map((m) => [normalizeLabel(m.name), m]));
  const before = data.metrics.length;
  data.metrics = data.metrics.filter((m) => {
    if (m.sourceSlug === 'metrics-definitions' || !isMetricPage(m.sourceSlug)) return true;
    const main = mainByName.get(normalizeLabel(m.name));
    if (!main) return true;
    // Keep any label the feature page adds that the main entry lacks.
    for (const l of m.uiLabels) {
      if (!main.uiLabels.some((x) => x.surface === l.surface && normalizeLabel(x.label) === normalizeLabel(l.label))) main.uiLabels.push(l);
    }
    return false;
  });
  seenIds.clear();
  for (const m of data.metrics) seenIds.add(m.id);
  if (before !== data.metrics.length) console.log(`  dropped ${before - data.metrics.length} feature-page duplicates of main-page metrics (labels merged)`);

  for (const file of (await readdir(path.resolve('src/data'))).filter((f) => f.endsWith('-columns.json')).sort()) {
    applyColumnMap(data, seenIds, await readFile(path.resolve('src/data', file), 'utf8'), file);
  }

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

  const bySurface: Record<Surface, number> = { realtime: 0, historical: 0, dashboard: 0, contactsearch: 0, routingprofile: 0, quickconnect: 0, securityprofile: 0 };
  let noLabel = 0;
  let noType = 0;
  for (const m of data.metrics) {
    if (!m.uiLabels.length) noLabel++;
    if (!m.metricType) noType++;
    for (const l of m.uiLabels) bySurface[l.surface]++;
  }
  console.log(`Wrote ${outPath}`);
  console.log(`  metrics: ${data.metrics.length} (${noLabel} without a UI label, ${noType} without a type)`);
  console.log(`  labels:  realtime ${bySurface.realtime}, historical ${bySurface.historical}, dashboard ${bySurface.dashboard}, contact search ${bySurface.contactsearch}, routing profile ${bySurface.routingprofile}, quick connect ${bySurface.quickconnect}, security profile ${bySurface.securityprofile}`);
}

/** Pages parsed with the metric-definitions layout (as opposed to the data model or permissions pages). */
function isMetricPage(slug: string): boolean {
  return slug !== 'ctr-data-model' && slug !== 'security-profile-list' && slug !== 'custom';
}

const SURFACE_TITLE: Partial<Record<Surface, string>> = {
  contactsearch: 'Contact search',
  routingprofile: 'Routing profile editor',
  quickconnect: 'Quick connects',
  securityprofile: 'Security profile editor',
};

interface ColumnMap {
  surface: Surface;
  /** Default for every column: only match on this surface. */
  surfaceOnly?: boolean;
  columns: Array<{ label: string; fields: string[]; qualifier?: string; surfaceOnly?: boolean }>;
  custom: Array<{ id: string; name: string; docsUrl: string; summary: string; description: string }>;
}

/**
 * Attach console column labels (e.g. the Contact search page) to parsed contact record fields,
 * and add hand-written entries for console-only columns.
 */
function applyColumnMap(data: MetricsData, seenIds: Set<string>, json: string, file = 'column map'): void {
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
      metricCategory: `${SURFACE_TITLE[map.surface] ?? map.surface} column`,
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
        console.warn(`warn [${file}] "${col.label}" refers to unknown id ${id}`);
        return;
      }
      const surfaceOnly = col.surfaceOnly ?? map.surfaceOnly ?? false;
      const label = {
        surface: map.surface,
        label: col.label,
        ...(col.qualifier ? { qualifier: col.qualifier } : {}),
        ...(order ? { order } : {}),
        ...(surfaceOnly ? { surfaceOnly: true } : {}),
      };
      m.uiLabels.push(label);
      attached++;
    });
  }
  console.log(`  ${file}: ${map.columns.length} ${map.surface} columns -> ${attached} labels, ${map.custom.length} custom entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
