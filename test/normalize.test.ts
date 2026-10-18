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
    expect(p).toBe('^sl \\d+(?: ?(?:s|secs?|seconds?))?$');
    const re = new RegExp(p, 'i');
    expect(re.test(normalizeLabel('SL 60'))).toBe(true);
    expect(re.test(normalizeLabel('SL 60 secs'))).toBe(true);
    expect(re.test(normalizeLabel('SL'))).toBe(false);
    expect(re.test(normalizeLabel('SL 60 secs extra'))).toBe(false);
    const answered = new RegExp(labelToPattern('Contacts answered in X seconds')!, 'i');
    expect(answered.test('contacts answered in 30 seconds')).toBe(true);
    expect(answered.test('contacts answered in 30 secs')).toBe(true);
    expect(answered.test('contacts answered in 30')).toBe(true);
    expect(answered.test('contacts answered in')).toBe(false);
  });
});
