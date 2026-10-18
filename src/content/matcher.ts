import type { MetricIndex, PageSurface } from '../lib/index';
import type { MatchMode } from '../lib/settings';
import { normalizeLabel } from '../lib/normalize';

export const ATTR = 'data-cmh-metric';
/** The console's own hint text (title attribute), cached when tagging because it disappears on hover. */
export const HINT_ATTR = 'data-cmh-hint';
export const HOST_ID = 'cmh-tooltip-host';

const MAX_LABEL_CHARS = 72;

/** Elements that are headers or header-like by role or tag. */
const HEADER_SELECTOR = [
  'th',
  '[role="columnheader"]',
  '[role="rowheader"]',
  'thead *',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  '[role="heading"]',
  'legend',
  'summary',
  'dt',
].join(',');

/** Class or test-id fragments that usually mark a label or title element in Cloudscape-style UIs. */
const HEADER_HINT = /header|heading|title|label|metric|legend|caption/i;
const NON_HEADER_HINT = /cell|value|input|button|option|menu|breadcrumb|nav/i;

const SKIP_SELECTOR = ['input', 'textarea', 'select', 'option', 'script', 'style', 'svg', '[contenteditable]', `#${HOST_ID}`].join(',');

export interface Match {
  element: Element;
  ids: string[];
}

export interface Scanner {
  scan(root: ParentNode): Match[];
}

export function createScanner(index: MetricIndex, getSurface: () => PageSurface, getMode: () => MatchMode): Scanner {
  function candidates(root: ParentNode): Element[] {
    const mode = getMode();
    const selector = mode === 'any' ? '*' : `${HEADER_SELECTOR},[class],[data-testid]`;
    const list: Element[] = [];
    if (root instanceof Element && root.matches(selector)) list.push(root);
    list.push(...root.querySelectorAll(selector));
    return list;
  }

  function isHeaderLike(el: Element): boolean {
    if (el.matches(HEADER_SELECTOR)) return true;
    const hint = `${el.className ?? ''} ${el.getAttribute('data-testid') ?? ''}`;
    return HEADER_HINT.test(hint) && !NON_HEADER_HINT.test(hint);
  }

  function ownText(el: Element): string {
    // Only consider elements whose visible text is short and not spread over block children.
    const text = el.textContent ?? '';
    if (text.length > MAX_LABEL_CHARS * 2) return '';
    return text.replace(/\s+/g, ' ').trim();
  }

  /** Walk down through single-child wrappers so the tag lands on the innermost element with the same text. */
  function innermost(el: Element, key: string): Element {
    let cur = el;
    for (let depth = 0; depth < 6; depth++) {
      const kids = [...cur.children].filter((c) => !c.matches('svg,button,[aria-hidden="true"]'));
      const sameText = kids.filter((c) => normalizeLabel(c.textContent ?? '') === key);
      if (sameText.length !== 1) break;
      cur = sameText[0]!;
    }
    return cur;
  }

  return {
    scan(root: ParentNode): Match[] {
      const mode = getMode();
      const surface = getSurface();
      const out: Match[] = [];
      for (const el of candidates(root)) {
        if (el.closest(SKIP_SELECTOR)) continue;
        if (el.hasAttribute(ATTR) || el.closest(`[${ATTR}]`) || el.querySelector(`[${ATTR}]`)) continue;
        if (mode === 'headers' && !isHeaderLike(el)) continue;
        const text = ownText(el);
        if (!text || text.length > MAX_LABEL_CHARS) continue;
        if (!index.mightMatch(text)) continue;
        const key = normalizeLabel(text);
        const found = index.lookup(key, surface);
        if (!found.length) continue;
        const target = innermost(el, key);
        if (target.hasAttribute(ATTR)) continue;
        const ids = found.map((c) => c.metric.id);
        target.setAttribute(ATTR, ids.join('|'));
        target.setAttribute('tabindex', target.getAttribute('tabindex') ?? '0');
        const hint = el.closest('[title]')?.getAttribute('title')?.trim();
        if (hint) target.setAttribute(HINT_ATTR, hint);
        out.push({ element: target, ids });
      }
      return out;
    },
  };
}

export function clearMatches(root: ParentNode = document): void {
  for (const el of root.querySelectorAll(`[${ATTR}]`)) {
    el.removeAttribute(ATTR);
    el.removeAttribute(HINT_ATTR);
    if (el.getAttribute('tabindex') === '0') el.removeAttribute('tabindex');
  }
}
