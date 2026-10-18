import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { MetricsData } from '../src/data/schema';
import { MetricIndex } from '../src/lib/index';
import { parseMetricsMarkdown } from '../src/lib/parse-docs';

const md = readFileSync(path.join(__dirname, 'fixtures/sample-metrics.md'), 'utf8');
const data: MetricsData = {
  generatedAt: '2026-10-17T00:00:00.000Z',
  sources: [],
  metrics: parseMetricsMarkdown(md, 'metrics-definitions').metrics,
};
const index = new MetricIndex(data);

describe('MetricIndex', () => {
  it('resolves an exact label regardless of case and glyphs', () => {
    const c = index.lookup('ABANDONMENT RATE ▲', 'realtime');
    expect(c.map((x) => x.metric.name)).toEqual(['Abandonment rate']);
    expect(c[0]!.rank).toBe(0);
    expect(c[0]!.uiLabel?.surface).toBe('realtime');
  });

  it('prefers the current surface but still finds other surfaces', () => {
    const hist = index.lookup('Duration', 'historical');
    expect(hist).toHaveLength(1);
    expect(hist[0]!.rank).toBe(1);
    const rt = index.lookup('Duration', 'realtime');
    expect(rt[0]!.rank).toBe(0);
    expect(rt[0]!.uiLabel?.qualifier).toMatch(/After Contact Work/);
  });

  it('matches metric names when no UI label matches', () => {
    const c = index.lookup('Agent Activity');
    expect(c).toHaveLength(1);
    expect(c[0]!.rank).toBe(2);
    expect(c[0]!.uiLabel).toBeNull();
  });

  it('matches templated labels such as SL 60 and Service level 120', () => {
    expect(index.lookup('SL 60', 'realtime')[0]!.metric.name).toBe('Service level X');
    expect(index.lookup('Service level 120', 'historical')[0]!.metric.name).toBe('Service level X');
    expect(index.lookup('Service level', 'historical')).toEqual([]);
  });

  it('returns nothing for unrelated text and reports mightMatch consistently', () => {
    expect(index.lookup('Basic Queue')).toEqual([]);
    expect(index.mightMatch('Basic Queue')).toBe(false);
    expect(index.mightMatch('sl 30')).toBe(true);
    expect(index.mightMatch('adherence')).toBe(true);
  });

  it('collapses duplicate metrics to their best rank', () => {
    // "Adherence" is both a historical label and the metric name.
    const c = index.lookup('Adherence', 'historical');
    expect(c).toHaveLength(1);
    expect(c[0]!.rank).toBe(0);
  });
});
