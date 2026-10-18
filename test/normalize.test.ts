import { describe, expect, it } from 'vitest';
import { labelToPattern, markdownToPlain, normalizeLabel } from '../src/lib/normalize';

describe('normalizeLabel', () => {
  it('lowercases, trims and collapses whitespace', () => {
    expect(normalizeLabel('  After   contact work time ')).toBe('after contact work time');
  });
  it('strips sort glyphs and trailing punctuation that table headers add', () => {
    expect(normalizeLabel('ACW ▲')).toBe('acw');
    expect(normalizeLabel('Handled ↓')).toBe('handled');
    expect(normalizeLabel('Online:')).toBe('online');
    expect(normalizeLabel('Service level 60 *')).toBe('service level 60');
  });
  it('unifies dashes and quotes', () => {
    expect(normalizeLabel('Avg. agent connecting time – agent first callback')).toBe(
      'avg. agent connecting time - agent first callback',
    );
  });
});

describe('markdownToPlain', () => {
  it('strips links, code, emphasis and escapes', () => {
    expect(markdownToPlain('[GetMetricDataV2](https://x) API: `AVG_HANDLE\\_TIME` is *italic* and **bold**')).toBe(
      'GetMetricDataV2 API: AVG_HANDLE_TIME is italic and bold',
    );
  });
});

describe('labelToPattern', () => {
  it('returns undefined for plain labels', () => {
    expect(labelToPattern('Handled')).toBeUndefined();
    expect(labelToPattern('Max Queued')).toBeUndefined();
  });
  it('builds anchored case-insensitive patterns for X placeholders', () => {
    const p = labelToPattern('SL *X*')!;
    expect(p).toBe('^sl \\d+$');
    expect(new RegExp(p, 'i').test(normalizeLabel('SL 60'))).toBe(true);
    expect(new RegExp(p, 'i').test(normalizeLabel('SL'))).toBe(false);
    expect(labelToPattern('Contacts answered in X seconds')).toBe('^contacts answered in \\d+ seconds$');
  });
});
