import type { MetricIndex, PageSurface } from '../lib/index';
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

/**
 * Cloudscape Select controls, as used by the dashboard widget editor's metric pickers: the chosen
 * value sits in a span inside the trigger button, and open-list options carry a label-content span.
 * Class hashes change per release, so only stable fragments are used.
 */
const PICKER_SELECTOR = 'button[class*="button-trigger"] span[class*="awsui_trigger"],[role="option"] span[class*="label-content"]';

/** Class or test-id fragments that usually mark a label or title element in Cloudscape-style UIs. */
const HEADER_HINT = /header|heading|title|label|metric|legend|caption/i;
const NON_HEADER_HINT = /cell|value|input|button|option|menu|breadcrumb|nav/i;

const SKIP_SELECTOR = ['input', 'textarea', 'select', 'option', 'script', 'style', 'svg', '[contenteditable]', `#${HOST_ID}`].join(',');

/**
 * Surfaces whose labels are plain text rather than table headers (e.g. permission names on the
 * security profile editor). There, any short leaf text that exactly equals one of the surface's own
 * labels is matched, excluding navigation, links, buttons and form controls.
 */
const LOOSE_SURFACES: ReadonlySet<PageSurface> = new Set<PageSurface>(['securityprofile']);
const LOOSE_SKIP = 'nav,[role="navigation"],aside,a,button,[role="tab"],[role="menuitem"],[role="option"],label,input,textarea,select';

export interface Match {
  element: Element;
  ids: string[];
}

export interface Scanner {
  /** Scan `root` and every open shadow root beneath it. */
  scan(root: ParentNode): Match[];
  /** Document plus every shadow root seen so far. */
  roots(): ParentNode[];
}

export interface ScannerOptions {
  /** Called once for each open shadow root discovered while scanning. */
  onShadowRoot?: (root: ShadowRoot) => void;
}

/** Collect open shadow roots under `root`, recursively (hosts inside shadow roots included). */
export function shadowRootsUnder(root: ParentNode, out: ShadowRoot[] = []): ShadowRoot[] {
  const visit = (node: ParentNode): void => {
    if (node instanceof Element && node.shadowRoot && node.id !== HOST_ID) {
      out.push(node.shadowRoot);
      visit(node.shadowRoot);
    }
    for (const el of node.querySelectorAll('*')) {
      if (el.shadowRoot && el.id !== HOST_ID) {
        out.push(el.shadowRoot);
        visit(el.shadowRoot);
      }
    }
  };
  visit(root);
  return out;
}

export function createScanner(index: MetricIndex, getSurface: () => PageSurface, options: ScannerOptions = {}): Scanner {
  const knownShadowRoots = new Set<ShadowRoot>();
  function candidates(root: ParentNode, loose: boolean): Element[] {
    // Only table headers, headings and header-like elements (by role, tag or class hint) are considered,
    // unless the surface is "loose", where every element is a candidate and the exact-label rule filters.
    const selector = loose ? '*' : `${HEADER_SELECTOR},[class],[data-testid]`;
    const list: Element[] = [];
    if (root instanceof Element && root.matches(selector)) list.push(root);
    list.push(...root.querySelectorAll(selector));
    return list;
  }

  function isHeaderLike(el: Element): boolean {
    if (el.matches(HEADER_SELECTOR) || el.matches(PICKER_SELECTOR)) return true;
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

  function scanOne(root: ParentNode, out: Match[]): void {
      const surface = getSurface();
      const loose = LOOSE_SURFACES.has(surface);
      for (const el of candidates(root, loose)) {
        if (el.closest(SKIP_SELECTOR)) continue;
        if (el.hasAttribute(ATTR) || el.closest(`[${ATTR}]`) || el.querySelector(`[${ATTR}]`)) continue;
        if (loose) {
          if (el.closest(LOOSE_SKIP)) continue;
        } else if (!isHeaderLike(el)) continue;
        const text = ownText(el);
        if (!text || text.length > MAX_LABEL_CHARS) continue;
        if (!index.mightMatch(text)) continue;
        const key = normalizeLabel(text);
        const found = index.lookup(key, surface);
        if (!found.length) continue;
        // In loose mode only the surface's own labels count; other surfaces' words must not tag body text.
        if (loose && !found.some((c) => c.rank === 0)) continue;
        const target = innermost(el, key);
        if (target.hasAttribute(ATTR)) continue;
        const ids = found.map((c) => c.metric.id);
        target.setAttribute(ATTR, ids.join('|'));
        target.setAttribute('tabindex', target.getAttribute('tabindex') ?? '0');
        const hint = findHint(target);
        if (hint) target.setAttribute(HINT_ATTR, hint);
        out.push({ element: target, ids });
      }
  }

  return {
    scan(root: ParentNode): Match[] {
      const out: Match[] = [];
      // A root that is itself inside a known shadow tree is scanned as-is; new shadow roots under
      // it are discovered, reported once, and scanned too.
      scanOne(root, out);
      for (const sr of shadowRootsUnder(root)) {
        if (!knownShadowRoots.has(sr)) {
          knownShadowRoots.add(sr);
          options.onShadowRoot?.(sr);
        }
        scanOne(sr, out);
      }
      return out;
    },
    roots(): ParentNode[] {
      return [document, ...knownShadowRoots].filter((r) => !(r instanceof ShadowRoot) || r.host.isConnected);
    },
  };
}

/**
 * The console's own hint for a header lives in a "title" attribute somewhere in the header cell:
 * on the cell, an ancestor, or a descendant of the cell. Look in all three places.
 */
export function findHint(target: Element): string | undefined {
  const cell = target.closest('th,[role="columnheader"],[role="rowheader"]') ?? target;
  const holder = cell.closest('[title]') ?? cell.querySelector('[title]');
  return holder?.getAttribute('title')?.trim() || undefined;
}

export function clearMatches(roots: ParentNode | ParentNode[] = document): void {
  for (const root of Array.isArray(roots) ? roots : [roots]) {
    for (const el of root.querySelectorAll(`[${ATTR}]`)) {
      el.removeAttribute(ATTR);
      el.removeAttribute(HINT_ATTR);
      if (el.getAttribute('tabindex') === '0') el.removeAttribute('tabindex');
    }
  }
}

/** The tagged element for a DOM event, looking through shadow boundaries via composedPath(). */
export function taggedFromEvent(e: Event): Element | null {
  for (const n of e.composedPath()) {
    if (!(n instanceof Element)) continue;
    if (n.id === HOST_ID) return null;
    if (n.hasAttribute(ATTR)) return n;
  }
  return null;
}
