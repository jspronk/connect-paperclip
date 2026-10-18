// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import aliases from '../src/data/aliases.json';
import metricsJson from '../src/data/metrics.json';
import type { MetricsData } from '../src/data/schema';
import { ATTR, clearMatches, createScanner } from '../src/content/matcher';
import { MetricIndex, type Overrides } from '../src/lib/index';

const html = readFileSync(path.join(__dirname, 'fixtures/realtime-queues-table.html'), 'utf8');
const index = new MetricIndex(metricsJson as MetricsData, aliases as Overrides);

function tagged(): Array<[string, string]> {
  return [...document.querySelectorAll(`[${ATTR}]`)].map((el) => [
    (el.textContent ?? '').trim(),
    el.getAttribute(ATTR) ?? '',
  ]);
}

describe('scanner on a live-shaped Real-time Queues table', () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it('tags metric headers only, on the innermost wrapper, and ignores body cells', () => {
    const scanner = createScanner(index, () => 'realtime', () => 'headers');
    const matches = scanner.scan(document.body);
    const labels = tagged().map(([t]) => t).sort();
    expect(labels).toEqual(['ACW', 'Available', 'Duration', 'Online', 'SL 60 secs']);
    expect(matches).toHaveLength(5);
    // "Name", group headers "Agents"/"Performance" and the card title are not metrics.
    expect(labels).not.toContain('Name');
    expect(labels).not.toContain('Agents');
    // The body cell "Available" must not be tagged in headers mode.
    const cellSpan = document.querySelector('tbody span')!.nextElementSibling;
    expect(document.querySelectorAll(`tbody [${ATTR}]`)).toHaveLength(0);
    void cellSpan;
    // Tag lands on the div[role=button] wrapper, not the th, and is focusable.
    const acw = document.querySelector(`[${ATTR}*="agent-after-contact-work"]`)!;
    expect(acw.tagName).toBe('DIV');
    expect(acw.getAttribute('role')).toBe('button');
    expect(acw.closest('th')).not.toBeNull();
  });

  it('caches the console hint text on the tagged element', () => {
    createScanner(index, () => 'realtime', () => 'headers').scan(document.body);
    const acw = document.querySelector(`[${ATTR}*="agent-after-contact-work"]`)!;
    expect(acw.getAttribute('data-cmh-hint')).toBe('Count of agents in after contact work');
  });

  it('suppresses the docs typo that maps the Active column to AI Handoffs', () => {
    expect(index.lookup('Active', 'realtime').map((c) => c.metric.name)).toEqual(['Active slots']);
  });

  it('resolves SL 60 secs to Service level and Duration to both ACW time and the Duration column', () => {
    createScanner(index, () => 'realtime', () => 'headers').scan(document.body);
    const map = Object.fromEntries(tagged());
    expect(map['SL 60 secs']).toBe('metrics-definitions#service-level');
    expect(map['Duration']!.split('|').sort()).toEqual([
      'metrics-definitions#after-contact-work-time',
      'metrics-definitions#duration-real-time',
    ]);
  });

  it('does not double-tag on a second scan and can be cleared', () => {
    const scanner = createScanner(index, () => 'realtime', () => 'headers');
    scanner.scan(document.body);
    expect(scanner.scan(document.body)).toHaveLength(0);
    expect(tagged()).toHaveLength(5);
    clearMatches();
    expect(tagged()).toHaveLength(0);
  });

  it('in "any" mode also tags body cells whose text equals a label, but never form controls', () => {
    createScanner(index, () => 'realtime', () => 'any').scan(document.body);
    const labels = tagged().map(([t]) => t);
    expect(labels.filter((l) => l === 'Available')).toHaveLength(2);
    expect(document.querySelectorAll(`input[${ATTR}], option[${ATTR}]`)).toHaveLength(0);
  });
});
