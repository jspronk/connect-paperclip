import type { Settings } from '../../lib/settings';
import { createQueue, observeShadow, onElement, type Disposable } from '../dom';
import type { FeatureContext } from './context';

const LOG = '[connect-metrics-helper]';
export const MESSAGE_SOURCE = 'connect-metrics-helper';
export const FLOW_ATTR = 'data-cmh-flow';
const STYLE_ID = 'cmh-flow-links-style';
const HOST_SELECTOR = 'lily-number-website-ui';
const FLOW_HEADER = /^contact flow\s*\/\s*ivr$/i;

export interface FlowMaps {
  /** digits-only phone number -> phone number ARN */
  phoneArnByNumber: Map<string, string>;
  /** phone number ARN -> flow ARN */
  flowArnByPhoneArn: Map<string, string>;
}

export function createMaps(): FlowMaps {
  return { phoneArnByNumber: new Map(), flowArnByPhoneArn: new Map() };
}

export function digitsOf(text: string): string {
  return text.replace(/\D/g, '');
}

/** Absorb a message posted by src/page/capture.ts. Returns true if the maps changed. */
export function handleMessage(maps: FlowMaps, data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as { source?: string; type?: string; items?: unknown };
  if (d.source !== MESSAGE_SOURCE || !Array.isArray(d.items)) return false;
  let changed = false;
  if (d.type === 'phone-numbers') {
    for (const it of d.items as Array<{ number?: string; arn?: string }>) {
      if (typeof it.number !== 'string' || typeof it.arn !== 'string') continue;
      const key = digitsOf(it.number);
      if (key && maps.phoneArnByNumber.get(key) !== it.arn) {
        maps.phoneArnByNumber.set(key, it.arn);
        changed = true;
      }
    }
  } else if (d.type === 'flow-associations') {
    for (const it of d.items as Array<{ resourceArn?: string; flowArn?: string }>) {
      if (typeof it.resourceArn !== 'string' || typeof it.flowArn !== 'string') continue;
      if (maps.flowArnByPhoneArn.get(it.resourceArn) !== it.flowArn) {
        maps.flowArnByPhoneArn.set(it.resourceArn, it.flowArn);
        changed = true;
      }
    }
  }
  return changed;
}

export function editorUrl(flowArn: string, origin = location.origin): string {
  return `${origin}/contact-flows/edit?id=${encodeURIComponent(flowArn)}&tab=designer`;
}

/** Index of the "Contact flow/IVR" column in a picasa table, or -1. */
function flowColumnIndex(table: Element): number {
  const headerRows = table.querySelectorAll('[role="rowgroup"]:not(.picasa-table__body) [role="row"], thead tr');
  for (const row of headerRows) {
    const cells = [...row.children];
    const i = cells.findIndex((c) => FLOW_HEADER.test((c.textContent ?? '').trim()));
    if (i >= 0) return i;
  }
  return -1;
}

/**
 * Turn flow names into links for every row whose phone number resolves to a flow ARN.
 * Idempotent. Returns the number of anchors created.
 */
export function decorate(root: ParentNode, maps: FlowMaps, origin = location.origin): number {
  let created = 0;
  for (const table of root.querySelectorAll('[role="table"], table')) {
    const col = flowColumnIndex(table);
    if (col < 0) continue;
    const body = table.querySelector('[role="rowgroup"].picasa-table__body, tbody') ?? table;
    for (const row of body.querySelectorAll('[role="row"], tr')) {
      const cells = [...row.children];
      const flowCell = cells[col];
      if (!flowCell) continue;
      const name = (flowCell.textContent ?? '').trim();
      if (!name) continue;

      const phoneCell = cells.find((c, i) => i !== col && /\d{3}/.test(c.textContent ?? ''));
      const digits = digitsOf(phoneCell?.textContent ?? '');
      const phoneArn = maps.phoneArnByNumber.get(digits);
      const flowArn = phoneArn ? maps.flowArnByPhoneArn.get(phoneArn) : undefined;
      if (!flowArn) continue;

      const href = editorUrl(flowArn, origin);
      const existing = flowCell.querySelector<HTMLAnchorElement>(`a[${FLOW_ATTR}]`);
      if (existing) {
        if (existing.href !== href) existing.href = href;
        continue;
      }
      const a = document.createElement('a');
      a.setAttribute(FLOW_ATTR, '');
      a.href = href;
      a.title = 'Open this flow in the flow editor';
      a.textContent = name;
      a.addEventListener('click', (e) => e.stopPropagation());
      flowCell.replaceChildren(a);
      created++;
    }
  }
  return created;
}

/** Remove our anchors, restoring plain text. */
export function undecorate(root: ParentNode): void {
  for (const a of root.querySelectorAll(`a[${FLOW_ATTR}]`)) {
    a.replaceWith(document.createTextNode(a.textContent ?? ''));
  }
}

function ensureStyle(root: ShadowRoot): void {
  if (root.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `a[${FLOW_ATTR}]{color:inherit;text-decoration:underline dotted;text-underline-offset:3px;cursor:pointer}
a[${FLOW_ATTR}]:hover{color:#0972d3;text-decoration-style:solid}`;
  root.append(style);
}

export function isPhoneNumbersPage(loc: Pick<Location, 'pathname'> = location): boolean {
  return /^(\/connect)?\/numbers(\/|$)/.test(loc.pathname);
}

/** Links the "Contact flow/IVR" column on the Phone numbers page to the flow editor. */
export function startFlowLinks(ctx: FeatureContext): void {
  const maps = createMaps();
  let settings: Settings = ctx.settings;
  const roots = new Set<ShadowRoot>();
  let hostWatcher: Disposable | undefined;
  const shadowWatchers: Disposable[] = [];

  const run = createQueue<ShadowRoot>(50, (items) => {
    if (!settings.enabled || !settings.flowLinks) return;
    for (const root of items) {
      ensureStyle(root);
      const n = decorate(root, maps);
      if (n) console.debug(LOG, `linked ${n} flow name(s) on the Phone numbers page`);
    }
  });

  // Messages from the page-world capture script. Listen on every page: the data may arrive
  // before the route becomes /numbers in a single-page navigation.
  window.addEventListener('message', (e: MessageEvent) => {
    if (e.source !== window || e.origin !== location.origin) return;
    if (handleMessage(maps, e.data)) roots.forEach((r) => run.add(r));
  });

  const start = (): void => {
    if (hostWatcher) return;
    hostWatcher = onElement(HOST_SELECTOR, (host) => {
      shadowWatchers.push(
        observeShadow(host, (root) => {
          roots.add(root);
          run.add(root);
        }),
      );
    });
  };
  const stop = (): void => {
    hostWatcher?.dispose();
    hostWatcher = undefined;
    shadowWatchers.splice(0).forEach((w) => w.dispose());
    roots.forEach((r) => undecorate(r));
    roots.clear();
  };

  const sync = (): void => {
    if (settings.enabled && settings.flowLinks && isPhoneNumbersPage()) start();
    else stop();
  };
  sync();
  window.addEventListener('popstate', sync);
  window.addEventListener('hashchange', sync);
  // Route changes via pushState are invisible here; a cheap periodic check covers them.
  window.setInterval(sync, 2000);

  ctx.onSettings((next) => {
    settings = next;
    sync();
    roots.forEach((r) => run.add(r));
  });
}
