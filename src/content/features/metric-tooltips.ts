import type { MetricsData } from '../../data/schema';
import aliasesJson from '../../data/aliases.json';
import metricsJson from '../../data/metrics.json';
import { MetricIndex, type Overrides, type PageSurface } from '../../lib/index';
import type { Settings } from '../../lib/settings';
import { ATTR, HINT_ATTR, HOST_ID, clearMatches, createScanner, findHint } from '../matcher';
import { detectSurface } from '../surface';
import { Tooltip } from '../tooltip';
import type { FeatureContext } from './context';

const LOG = '[connect-metrics-helper]';

/** Hover definitions for metric labels on Real-time, Historical and dashboard pages. */
export function startMetricTooltips(ctx: FeatureContext): void {
  if (document.getElementById(HOST_ID)) return; // already injected

  const data = metricsJson as MetricsData;
  const index = new MetricIndex(data, aliasesJson as Overrides);
  let settings: Settings = ctx.settings;
  let surface: PageSurface = detectSurface();

  const scanner = createScanner(
    index,
    () => surface,
    () => settings.matchMode,
  );
  const tooltip = new Tooltip(settings, data.generatedAt);

  // Underline style for matched labels, in the page (not the shadow root).
  const style = document.createElement('style');
  style.id = `${HOST_ID}-style`;
  document.head.append(style);
  const applyUnderline = (): void => {
    style.textContent = settings.underline && settings.enabled
      ? `[${ATTR}]{text-decoration:underline dotted currentColor;text-decoration-thickness:1px;text-underline-offset:3px;cursor:help}`
      : '';
  };
  applyUnderline();

  // SPA route changes. Content scripts run in an isolated world, so patching history.pushState
  // would not see the page's router; instead re-check the URL whenever we scan, and on the
  // DOM events that do reach us.
  let lastHref = location.href;
  const refreshSurface = (): boolean => {
    if (location.href === lastHref) return false;
    lastHref = location.href;
    const next = detectSurface();
    if (next !== surface) {
      surface = next;
      console.debug(LOG, `surface -> ${surface}`);
    }
    return true;
  };

  // Scanning, debounced, limited to added subtrees.
  let pending = new Set<ParentNode>();
  let timer: number | undefined;
  const flush = (): void => {
    timer = undefined;
    if (!settings.enabled) {
      pending.clear();
      return;
    }
    if (refreshSurface()) {
      // Route changed under us: drop stale tags so they are re-ranked for the new surface.
      clearMatches();
      pending.add(document.body);
    }
    const roots = [...pending];
    pending = new Set();
    let count = 0;
    for (const root of roots) {
      if (root instanceof Node && !root.isConnected) continue;
      count += scanner.scan(root).length;
    }
    if (count) console.debug(LOG, `tagged ${count} label(s) on surface "${surface}"`);
  };
  const queue = (root: ParentNode): void => {
    pending.add(root);
    if (timer === undefined) timer = window.setTimeout(flush, 150);
  };
  const rescanAll = (): void => {
    clearMatches();
    pending.clear();
    queue(document.body);
  };

  const observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'attributes') {
        // The console sets header "title" hints after the cell is inserted; cache them when they appear.
        const el = r.target as Element;
        const title = el.getAttribute('title')?.trim();
        if (!title) continue;
        const cell = el.closest('th,[role="columnheader"],[role="rowheader"]') ?? el;
        const tagged = cell.closest(`[${ATTR}]`) ?? cell.querySelector(`[${ATTR}]`);
        tagged?.setAttribute(HINT_ATTR, title);
        continue;
      }
      if (r.type === 'characterData') {
        const parent = r.target.parentElement;
        if (parent && !parent.closest(`#${HOST_ID}`)) {
          parent.closest(`[${ATTR}]`)?.removeAttribute(ATTR);
          queue(parent);
        }
        continue;
      }
      for (const n of r.addedNodes) {
        if (n instanceof Element && !n.closest(`#${HOST_ID}`)) queue(n);
        else if (n.parentElement && !n.parentElement.closest(`#${HOST_ID}`)) queue(n.parentElement);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title'] });

  const onRoute = (): void => {
    if (!refreshSurface()) return;
    tooltip.hide();
    rescanAll();
  };
  window.addEventListener('popstate', onRoute);
  window.addEventListener('hashchange', onRoute);

  // Hover and focus handling via delegation.
  let hoverTimer: number | undefined;
  const open = (el: Element): void => {
    const ids = (el.getAttribute(ATTR) ?? '').split('|').filter(Boolean);
    const text = el.textContent ?? '';
    let candidates = index.lookup(text, surface);
    if (!candidates.length) candidates = index.lookup(text, 'unknown');
    if (!candidates.length) {
      const byId = new Map(data.metrics.map((m) => [m.id, m]));
      candidates = ids.flatMap((id) => (byId.get(id) ? [{ metric: byId.get(id)!, uiLabel: null, rank: 2 as const }] : []));
    }
    // The console removes the title attribute while its own tooltip is open, so prefer the copy cached at scan time.
    const nativeHint = el.getAttribute(HINT_ATTR) ?? findHint(el) ?? '';
    tooltip.show(el, candidates, nativeHint);
  };
  document.addEventListener('mouseover', (e) => {
    if (!settings.enabled) return;
    const el = (e.target as Element | null)?.closest?.(`[${ATTR}]`);
    if (!el) return;
    if (tooltip.currentAnchor === el) {
      tooltip.cancelHide();
      return;
    }
    window.clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => open(el), settings.hoverDelay);
  });
  document.addEventListener('mouseout', (e) => {
    const el = (e.target as Element | null)?.closest?.(`[${ATTR}]`);
    if (!el) return;
    const to = e.relatedTarget as Node | null;
    if (to && el.contains(to)) return;
    window.clearTimeout(hoverTimer);
    if (tooltip.currentAnchor === el) tooltip.scheduleHide();
  });
  document.addEventListener('focusin', (e) => {
    if (!settings.enabled) return;
    const el = (e.target as Element | null)?.closest?.(`[${ATTR}]`);
    if (el) open(el);
  });
  document.addEventListener('focusout', (e) => {
    const el = (e.target as Element | null)?.closest?.(`[${ATTR}]`);
    if (el && tooltip.currentAnchor === el) tooltip.scheduleHide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tooltip.isOpen) tooltip.hide();
  });
  window.addEventListener('scroll', () => tooltip.isOpen && tooltip.hide(), { passive: true, capture: true });

  ctx.onSettings((next) => {
    const modeChanged = next.matchMode !== settings.matchMode || next.enabled !== settings.enabled;
    settings = next;
    tooltip.updateSettings(next);
    applyUnderline();
    if (!next.enabled) {
      tooltip.hide();
      clearMatches();
    } else if (modeChanged) {
      rescanAll();
    }
  });

  queue(document.body);
  console.debug(LOG, `ready: ${index.size} metrics, surface "${surface}"`);
}
