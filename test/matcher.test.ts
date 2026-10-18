// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import aliases from '../src/data/aliases.json';
import metricsJson from '../src/data/metrics.json';
import type { MetricsData } from '../src/data/schema';
import { ATTR, clearMatches, createScanner, taggedFromEvent } from '../src/content/matcher';
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
    const scanner = createScanner(index, () => 'realtime');
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
    createScanner(index, () => 'realtime').scan(document.body);
    const acw = document.querySelector(`[${ATTR}*="agent-after-contact-work"]`)!;
    expect(acw.getAttribute('data-cmh-hint')).toBe('Count of agents in after contact work');
  });

  it('suppresses the docs typo that maps the Active column to AI Handoffs', () => {
    expect(index.lookup('Active', 'realtime').map((c) => c.metric.name)).toEqual(['Active slots']);
  });

  it('resolves SL 60 secs to Service level and Duration to both ACW time and the Duration column', () => {
    createScanner(index, () => 'realtime').scan(document.body);
    const map = Object.fromEntries(tagged());
    expect(map['SL 60 secs']).toBe('metrics-definitions#service-level');
    expect(map['Duration']!.split('|').sort()).toEqual([
      'metrics-definitions#after-contact-work-time',
      'metrics-definitions#duration-real-time',
    ]);
  });

  it('does not double-tag on a second scan and can be cleared', () => {
    const scanner = createScanner(index, () => 'realtime');
    scanner.scan(document.body);
    expect(scanner.scan(document.body)).toHaveLength(0);
    expect(tagged()).toHaveLength(5);
    clearMatches();
    expect(tagged()).toHaveLength(0);
  });

});

describe('scanner inside open shadow roots', () => {
  it('tags headers rendered in nested shadow roots and reports each root once', () => {
    document.body.innerHTML = '';
    const outer = document.createElement('contact-search-page');
    document.body.append(outer);
    const outerRoot = outer.attachShadow({ mode: 'open' });
    const inner = document.createElement('contact-search-table-widget');
    outerRoot.append(inner);
    const innerRoot = inner.attachShadow({ mode: 'open' });
    innerRoot.innerHTML = html;

    const seen: ShadowRoot[] = [];
    const scanner = createScanner(index, () => 'realtime', { onShadowRoot: (r) => seen.push(r) });
    const matches = scanner.scan(document.body);
    expect(matches.map((m) => (m.element.textContent ?? '').trim()).sort()).toEqual(['ACW', 'Available', 'Duration', 'Online', 'SL 60 secs']);
    expect(seen).toEqual([outerRoot, innerRoot]);
    expect(scanner.scan(document.body)).toHaveLength(0);
    expect(seen).toHaveLength(2);
    expect(scanner.roots()).toEqual([document, outerRoot, innerRoot]);

    // Events from inside the shadow tree resolve to the tagged element through composedPath().
    const acw = innerRoot.querySelector(`[${ATTR}*="agent-after-contact-work"]`)!;
    let resolved: Element | null = null;
    document.addEventListener('mouseover', (e) => (resolved = taggedFromEvent(e)), { once: true });
    acw.firstChild!.parentElement!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, composed: true }));
    expect(resolved).toBe(acw);

    clearMatches(scanner.roots());
    expect(innerRoot.querySelectorAll(`[${ATTR}]`)).toHaveLength(0);
  });
});

describe('loose matching on the security profile editor', () => {
  it('tags plain-text permission names but not navigation links, buttons or action labels', () => {
    document.body.innerHTML = `
      <nav><ul><li><a href="/queues">Queues</a></li><li><a href="/routing-profiles">Routing profiles</a></li></ul></nav>
      <main>
        <h2>Routing (25/31)</h2>
        <div role="group">
          <div class="awsui_root"><span>Routing profiles</span></div>
          <label><input type="checkbox" /><span>View</span></label>
          <label><input type="checkbox" /><span>Edit</span></label>
        </div>
        <div role="group">
          <div class="awsui_root"><span>Queues</span></div>
          <button>Queues</button>
        </div>
        <p><span>Online</span></p>
      </main>`;
    const scanner = createScanner(index, () => 'securityprofile');
    const matches = scanner.scan(document.body);
    const tagged = [...document.querySelectorAll(`[${ATTR}]`)];
    expect(tagged.map((e) => e.textContent)).toEqual(['Routing profiles', 'Queues']);
    expect(tagged.every((e) => e.closest('main') && !e.closest('nav,button,label'))).toBe(true);
    expect(matches).toHaveLength(2);
    // "Online" is a real-time label; on this surface plain text must not match other surfaces' words.
    expect(document.querySelector('p [' + ATTR + ']')).toBeNull();
  });

  it('does not tag the same words on a header-only surface', () => {
    document.body.innerHTML = `<main><div role="group"><div class="awsui_root"><span>Routing profiles</span></div></div></main>`;
    createScanner(index, () => 'realtime').scan(document.body);
    expect(document.querySelectorAll(`[${ATTR}]`)).toHaveLength(0);
  });
});

describe('dashboard widget editor metric pickers', () => {
  it('tags Cloudscape select values and option labels that are known metrics, and nothing else', () => {
    document.body.innerHTML = `
      <div class="awsui_form-field"><label>Metric 1</label>
        <button class="awsui_button-trigger_18eso_x"><span class="awsui_trigger_dwuol_x">Contacts handled</span><span class="awsui_arrow_x"><svg></svg></span></button>
      </div>
      <div class="awsui_form-field"><label>Time range</label>
        <button class="awsui_button-trigger_18eso_x"><span class="awsui_trigger_dwuol_x">Trailing</span></button>
      </div>
      <div role="dialog" class="awsui_dropdown_x"><ul role="listbox" class="awsui_options-list_x">
        <li role="option"><div class="awsui_option-content_x"><span class="awsui_label-content_1p2cx_x">Contacts abandoned</span></div></li>
        <li role="option"><div class="awsui_option-content_x"><span class="awsui_label-content_1p2cx_x">Oldest</span><span class="awsui_description_x">The metric selection cannot be changed.</span></div></li>
        <li role="option"><div class="awsui_option-content_x"><span class="awsui_label-content_1p2cx_x">Current contact (5)</span></div></li>
      </ul></div>`;
    createScanner(index, () => 'dashboard').scan(document.body);
    const tagged = [...document.querySelectorAll(`[${ATTR}]`)].map((e) => e.textContent);
    expect(tagged).toEqual(['Contacts handled', 'Contacts abandoned', 'Oldest']);

    // Cloudscape disables pointer events on option text, so the hover event targets the <li>;
    // the tagged label inside it must still be found.
    const li = document.querySelector('li[role="option"]')!;
    const seen: Array<Element | null> = [];
    document.addEventListener('mouseover', (e) => seen.push(taggedFromEvent(e)), { once: true });
    li.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(seen[0]?.textContent).toBe('Contacts abandoned');
    // The same for the select trigger button.
    const btn = document.querySelector('button')!;
    document.addEventListener('mouseover', (e) => seen.push(taggedFromEvent(e)), { once: true });
    btn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(seen[1]?.textContent).toBe('Contacts handled');
  });
});
