import type { MetricsData } from '../data/schema';
import metricsJson from '../data/metrics.json';
import { MetricIndex, type PageSurface } from '../lib/index';
import { loadSettings, onSettingsChanged, type Settings } from '../lib/settings';
import { ATTR, HOST_ID, clearMatches, createScanner } from './matcher';
import { detectSurface, isConnectAdminPage } from './surface';
import { Tooltip } from './tooltip';

const LOG = '[connect-metrics-helper]';

async function main(): Promise<void> {
  if (!isConnectAdminPage()) return;
  if (document.getElementById(HOST_ID)) return; // already injected

  const data = metricsJson as MetricsData;
  const index = new MetricIndex(data);
  let settings: Settings = await loadSettings();
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
      ? `[${ATTR}]{text-decoration:underline dotted;text-decoration-color:rgba(9,114,211,.8);text-underline-offset:3px;cursor:help}`
      : '';
  };
  applyUnderline();

  // Scanning, debounced, limited to added subtrees.
  let pending = new Set<ParentNode>();
  let timer: number | undefined;
  const flush = (): void => {
    timer = undefined;
    if (!settings.enabled) {
      pending.clear();
      return;
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
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // SPA route changes.
  const onRoute = (): void => {
    const next = detectSurface();
    if (next !== surface) {
      surface = next;
      console.debug(LOG, `surface -> ${surface}`);
    }
    tooltip.hide();
    rescanAll();
  };
  for (const method of ['pushState', 'replaceState'] as const) {
    const original = history[method];
    history[method] = function patched(this: History, ...args: Parameters<History['pushState']>) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event('cmh:route'));
      return result;
    } as History['pushState'];
  }
  window.addEventListener('popstate', onRoute);
  window.addEventListener('hashchange', onRoute);
  window.addEventListener('cmh:route', onRoute);

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
    tooltip.show(el, candidates);
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

  onSettingsChanged((next) => {
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

main().catch((err) => console.error(LOG, err));
