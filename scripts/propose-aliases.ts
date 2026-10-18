/**
 * Dev helper: given a JSON array of console labels (e.g. dashboard metric-picker names), print which
 * already resolve on a surface and propose a metric for the rest by normalising common spelling
 * differences. Output is for hand review; nothing is written.
 *
 * Usage: npx tsx scripts/propose-aliases.ts <names.json> [surface]
 */
import { readFileSync } from 'node:fs';
import aliases from '../src/data/aliases.json' with { type: 'json' };
import pickerAliases from '../src/data/dashboard-picker-aliases.json' with { type: 'json' };
import data from '../src/data/metrics.json' with { type: 'json' };
import type { MetricsData, Surface } from '../src/data/schema';
import { MetricIndex, type Overrides } from '../src/lib/index';
import { normalizeLabel } from '../src/lib/normalize';

const [file, surfaceArg = 'dashboard'] = process.argv.slice(2);
if (!file) {
  console.error('usage: propose-aliases <names.json> [surface]');
  process.exit(1);
}
const surface = surfaceArg as Surface;
const names = JSON.parse(readFileSync(file, 'utf8')) as string[];
const base = aliases as Overrides;
const index = new MetricIndex(data as MetricsData, { ...base, aliases: [...(base.aliases ?? []), ...(pickerAliases as Overrides).aliases!] });

/** Spelling variants the console uses that the docs write differently. */
function variants(label: string): string[] {
  const out = new Set<string>();
  const base = label.trim();
  const subs: Array<[RegExp, string]> = [
    [/\bAvg\.?\s/gi, 'Average '],
    [/\bMax\.?\s/gi, 'Maximum '],
    [/\bMin\.?\s/gi, 'Minimum '],
    [/\bpercent\b/gi, '%'],
    [/\s%$/g, ' percent'],
    [/\bAgents in ACW\b/gi, 'Agent After contact work'],
    [/\bAgents in NPT\b/gi, 'Agent non-productive'],
    [/\bAgents in error\b/gi, 'Agent error'],
    [/\bAgents online\b/gi, 'Online agents'],
    [/\bAgents staffed\b/gi, 'Staffed agents'],
    [/\bAgents available\b/gi, 'Available'],
    [/\bContacts active\b/gi, 'Active slots'],
    [/\bContact availability\b/gi, 'Availability'],
    [/\bOldest contact( age)?\b/gi, 'Oldest'],
    [/\bContacts scheduled\b/gi, 'Scheduled'],
    [/\s*\(enqueue timestamp\)/gi, ' (enqueue timestamp)'],
    [/\bAverage queue answer time \(enqueue timestamp\)/gi, 'Average queue answer time (enqueue timestamp)'],
  ];
  const queue: string[] = [base];
  while (queue.length) {
    const cur = queue.pop()!;
    if (out.has(cur)) continue;
    out.add(cur);
    for (const [re, rep] of subs) {
      const next = cur.replace(re, rep);
      if (next !== cur && !out.has(next)) queue.push(next);
    }
  }
  return [...out];
}

const resolved: string[] = [];
const proposed: Array<{ label: string; via: string; metricId: string; metricName: string }> = [];
const unresolved: string[] = [];
for (const name of names) {
  if (index.lookup(name, surface).length) {
    resolved.push(name);
    continue;
  }
  let hit: { via: string; metricId: string; metricName: string } | undefined;
  for (const v of variants(name)) {
    const c = index.lookup(v, surface)[0] ?? index.lookup(v, 'unknown')[0];
    if (c) {
      hit = { via: v, metricId: c.metric.id, metricName: c.metric.name };
      break;
    }
  }
  if (hit) proposed.push({ label: name, ...hit });
  else unresolved.push(name);
}
console.log(`resolved already: ${resolved.length}`);
console.log(`\nPROPOSED (${proposed.length}):`);
for (const p of proposed) console.log(`  ${p.label}  ->  ${p.metricName}   [${p.metricId}]  (via "${p.via}")`);
console.log(`\nUNRESOLVED (${unresolved.length}):`);
console.log('  ' + unresolved.join('\n  '));
void normalizeLabel;
