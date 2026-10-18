import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseMetricsMarkdown } from '../src/lib/parse-docs';

const md = readFileSync(path.join(__dirname, 'fixtures/sample-metrics.md'), 'utf8');
const { metrics, warnings } = parseMetricsMarkdown(md, 'metrics-definitions');
const byName = Object.fromEntries(metrics.map((m) => [m.name, m]));

describe('parseMetricsMarkdown', () => {
  it('parses every ## entry and skips the page preamble', () => {
    expect(metrics.map((m) => m.name)).toEqual([
      'Abandonment rate',
      'After contact work time',
      'Agent Activity',
      'Adherence',
      'Service level X',
      'Agents count',
      'Evaluations performed',
    ]);
    expect(warnings).toEqual([]);
  });

  it('extracts anchor, docs url, summary and description', () => {
    const m = byName['Abandonment rate']!;
    expect(m.id).toBe('metrics-definitions#abandonment-rate');
    expect(m.docsUrl).toBe('https://docs.aws.amazon.com/connect/latest/adminguide/metrics-definitions.html#abandonment-rate');
    expect(m.summary).toMatch(/^This metric measures the percentage of abandoned contacts\./);
    expect(m.summary).not.toContain('helps you identify');
    expect(m.description).toContain('helps you identify');
  });

  it('extracts type with details, category, api and calculation logic', () => {
    const m = byName['Abandonment rate']!;
    expect(m.metricType).toBe('String');
    expect(m.metricTypeDetails).toEqual(['Min value: 0.00%', 'Max value: 100.00%']);
    expect(m.metricCategory).toBe('Contact record-driven metric');
    expect(m.api).toEqual([{ operation: 'GetMetricDataV2', identifier: 'ABANDONMENT_RATE' }]);
    expect(m.calculationLogic).toBe('+ (Contacts abandoned / Contacts queues ) \\* 100.0');
    expect(m.notes).toContain('Routing Profile');
  });

  it('handles italic type annotations and multiple api operations', () => {
    const m = byName['After contact work time']!;
    expect(m.metricType).toBe('String (hh:mm:ss)');
    expect(m.api.map((a) => a.identifier)).toEqual(['AFTER_CONTACT_WORK_TIME', 'SUM_AFTER_CONTACT_WORK_TIME']);
    expect(m.calculationLogic).toContain('final\\_result');
  });

  it('moves parenthetical qualifiers out of the label', () => {
    const m = byName['After contact work time']!;
    expect(m.uiLabels).toEqual([
      { surface: 'realtime', label: 'Duration', qualifier: 'when Agent Activity is in After Contact Work state' },
      { surface: 'historical', label: 'After contact work time' },
    ]);
  });

  it('does not treat a bold word at the start of prose as a section', () => {
    const m = byName['Agent Activity']!;
    expect(m.description).toContain("doesn't account for concurrency");
    expect(m.extraSections).toEqual({});
    expect(m.uiLabels).toEqual([]);
  });

  it('splits dashboard name from label and keeps unknown sections', () => {
    const m = byName['Adherence']!;
    expect(m.uiLabels).toEqual([
      { surface: 'historical', label: 'Adherence' },
      { surface: 'dashboard', label: 'Adherence', dashboardName: 'Queue and agent performance dashboard' },
    ]);
    expect(m.notes).toContain('re-calculated');
    expect(Object.keys(m.extraSections)).toEqual(['Related metrics']);
  });

  it('turns templated labels into patterns', () => {
    const m = byName['Service level X']!;
    expect(m.uiLabels).toEqual([
      { surface: 'realtime', label: 'SL X', pattern: '^sl \\d+(?: ?(?:s|secs?|seconds?))?$' },
      { surface: 'historical', label: 'Service level X', pattern: '^service level \\d+(?: ?(?:s|secs?|seconds?))?$' },
    ]);
  });

  it('keeps link text for anchored labels and records unavailable api access as a note', () => {
    const m = byName['Agents count']!;
    expect(m.uiLabels).toEqual([{ surface: 'dashboard', label: 'Agents count' }]);
    expect(m.api).toEqual([{ operation: '', note: 'Not available' }]);
  });

  it('skips bare dashboard page references', () => {
    expect(byName['Evaluations performed']!.uiLabels).toEqual([]);
  });
});
