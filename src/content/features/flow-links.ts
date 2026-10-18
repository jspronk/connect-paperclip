import type { Settings } from '../../lib/settings';
import { createQueue, observeShadow, onElement, type Disposable } from '../dom';
import type { FeatureContext } from './context';

const LOG = '[connect-metrics-helper]';
export const MESSAGE_SOURCE = 'connect-metrics-helper';
export const FLOW_ATTR = 'data-cmh-flow';
const STYLE_ID = 'cmh-flow-links-style';
const FLOW_HEADER = /^(contact flow\s*\/\s*ivr|flow)$/i;
const CSS = `a[${FLOW_ATTR}]{color:inherit;text-decoration:underline dotted;text-underline-offset:3px;cursor:pointer}
a[${FLOW_ATTR}]:hover{color:#0972d3;text-decoration-style:solid}`;

export interface FlowMaps {
  /** normalized resource key (digits of a phone number, or lower-cased email address) -> resource ARN */
  resourceArnByKey: Map<string, string>;
  /** resource ARN (phone number or email address) -> flow ARN */
  flowArnByResourceArn: Map<string, string>;
}

export function createMaps(): FlowMaps {
  return { resourceArnByKey: new Map(), flowArnByResourceArn: new Map() };
}

export function digitsOf(text: string): string {
  return text.replace(/\D/g, '');
}

/** Normalize the identifying text of a table row: a phone number becomes digits, an email is lower-cased. */
export function resourceKey(text: string): string {
  const t = text.trim();
  if (t.includes('@')) return t.toLowerCase();
  return digitsOf(t);
}

/** Absorb a message posted by public/capture.js. Returns true if the maps changed. */
export function handleMessage(maps: FlowMaps, data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as { source?: string; type?: string; items?: unknown };
  if (d.source !== MESSAGE_SOURCE || !Array.isArray(d.items)) return false;
  let changed = false;
  const setKey = (key: string, arn: string): void => {
    if (key && maps.resourceArnByKey.get(key) !== arn) {
      maps.resourceArnByKey.set(key, arn);
      changed = true;
    }
  };
  if (d.type === 'phone-numbers') {
    for (const it of d.items as Array<{ number?: string; arn?: string }>) {
      if (typeof it.number === 'string' && typeof it.arn === 'string') setKey(digitsOf(it.number), it.arn);
    }
  } else if (d.type === 'email-addresses') {
    for (const it of d.items as Array<{ address?: string; arn?: string }>) {
      if (typeof it.address === 'string' && typeof it.arn === 'string') setKey(it.address.trim().toLowerCase(), it.arn);
    }
  } else if (d.type === 'flow-associations') {
    for (const it of d.items as Array<{ resourceArn?: string; flowArn?: string }>) {
      if (typeof it.resourceArn !== 'string' || typeof it.flowArn !== 'string') continue;
      if (maps.flowArnByResourceArn.get(it.resourceArn) !== it.flowArn) {
        maps.flowArnByResourceArn.set(it.resourceArn, it.flowArn);
        changed = true;
      }
    }
  }
  return changed;
}

export function editorUrl(flowArn: string, origin = location.origin): string {
  return `${origin}/contact-flows/edit?id=${encodeURIComponent(flowArn)}&tab=designer`;
}

/** Index of the flow column in a table (picasa or Cloudscape), or -1. */
function flowColumnIndex(table: Element): number {
  const headerRows = table.querySelectorAll('thead tr, [role="rowgroup"]:not(.picasa-table__body) [role="row"]');
  for (const row of headerRows) {
    const cells = [...row.children];
    const i = cells.findIndex((c) => FLOW_HEADER.test((c.textContent ?? '').trim()));
    if (i >= 0) return i;
  }
  return -1;
}

/** The cell that identifies the row's resource: an email address or a phone number. */
function resourceCellKey(cells: Element[], flowCol: number): string {
  const texts = cells.map((c, i) => (i === flowCol ? '' : (c.textContent ?? '').trim()));
  const email = texts.find((t) => /^[^\s@]+@[^\s@]+$/.test(t));
  if (email) return email.toLowerCase();
  const phone = texts.find((t) => /^\+?[\d\s().-]{7,}$/.test(t));
  return phone ? digitsOf(phone) : '';
}

/**
 * Turn flow names into links for every row whose phone number or email address resolves to a flow ARN.
 * Idempotent. Returns the number of anchors created.
 */
export function decorate(root: ParentNode, maps: FlowMaps, origin = location.origin): number {
  let created = 0;
  for (const table of root.querySelectorAll('[role="table"], [role="grid"], table')) {
    const col = flowColumnIndex(table);
    if (col < 0) continue;
    const body = table.querySelector('tbody, [role="rowgroup"].picasa-table__body') ?? table;
    for (const row of body.querySelectorAll('tr, [role="row"]')) {
      const cells = [...row.children];
      const flowCell = cells[col];
      if (!flowCell) continue;
      const name = (flowCell.textContent ?? '').trim();
      if (!name || name === '-') continue;

      const key = resourceCellKey(cells, col);
      const resourceArn = key ? maps.resourceArnByKey.get(key) : undefined;
      const flowArn = resourceArn ? maps.flowArnByResourceArn.get(resourceArn) : undefined;
      if (!flowArn) continue;

      const href = editorUrl(flowArn, origin);
      const existing = flowCell.querySelector<HTMLAnchorElement>(`a[${FLOW_ATTR}]`);
      if (existing) {
        if (existing.getAttribute('href') !== href) existing.setAttribute('href', href);
        continue;
      }
      // Wrap the innermost element that holds exactly the name, so framework wrappers stay intact.
      let holder: Element = flowCell;
      for (let depth = 0; depth < 5; depth++) {
        const kids = [...holder.children].filter((k) => (k.textContent ?? '').trim() === name);
        if (kids.length !== 1) break;
        holder = kids[0]!;
      }
      const a = document.createElement('a');
      a.setAttribute(FLOW_ATTR, '');
      a.setAttribute('href', href);
      a.title = 'Open this flow in the flow editor';
      a.textContent = name;
      a.addEventListener('click', (e) => e.stopPropagation());
      holder.replaceChildren(a);
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

function ensureStyle(root: ShadowRoot | Document): void {
  const existing = root instanceof Document ? root.getElementById(STYLE_ID) : root.getElementById(STYLE_ID);
  if (existing) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  (root instanceof Document ? root.head : root).append(style);
}

/** Pages whose tables get flow links, with where their table renders. */
interface PageConfig {
  path: RegExp;
  /** Custom element hosting an open shadow root that contains the table; omitted = light DOM. */
  shadowHost?: string;
}
const PAGES: PageConfig[] = [
  { path: /^(\/connect)?\/numbers(\/|$)/, shadowHost: 'lily-number-website-ui' },
  { path: /^(\/connect)?\/email-addresses(\/|$)/ },
];

export function pageConfig(loc: Pick<Location, 'pathname'> = location): PageConfig | undefined {
  return PAGES.find((p) => p.path.test(loc.pathname));
}

export function isPhoneNumbersPage(loc: Pick<Location, 'pathname'> = location): boolean {
  return pageConfig(loc)?.shadowHost === 'lily-number-website-ui';
}

/** Links flow names on the Phone numbers and Email addresses pages to the flow editor. */
export function startFlowLinks(ctx: FeatureContext): void {
  const maps = createMaps();
  let settings: Settings = ctx.settings;
  const roots = new Set<ShadowRoot | Document>();
  let active: PageConfig | undefined;
  const watchers: Disposable[] = [];

  const run = createQueue<ShadowRoot | Document>(50, (items) => {
    if (!settings.enabled || !settings.flowLinks) return;
    for (const root of items) {
      ensureStyle(root);
      const n = decorate(root, maps);
      if (n) console.debug(LOG, `linked ${n} flow name(s) on ${location.pathname}`);
    }
  });

  // Messages from the page-world capture script. Listen on every page: the data may arrive
  // before the route becomes a linked page in a single-page navigation.
  window.addEventListener('message', (e: MessageEvent) => {
    if (e.source !== window || e.origin !== location.origin) return;
    if (handleMessage(maps, e.data)) roots.forEach((r) => run.add(r));
  });

  const start = (cfg: PageConfig): void => {
    active = cfg;
    if (cfg.shadowHost) {
      watchers.push(
        onElement(cfg.shadowHost, (host) => {
          watchers.push(
            observeShadow(host, (root) => {
              roots.add(root);
              run.add(root);
            }),
          );
        }),
      );
    } else {
      roots.add(document);
      run.add(document);
      const observer = new MutationObserver(() => run.add(document));
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      watchers.push({ dispose: () => observer.disconnect() });
    }
  };
  const stop = (): void => {
    active = undefined;
    watchers.splice(0).forEach((w) => w.dispose());
    roots.forEach((r) => undecorate(r));
    roots.clear();
  };

  const sync = (): void => {
    const cfg = settings.enabled && settings.flowLinks ? pageConfig() : undefined;
    if (cfg === active) return;
    stop();
    if (cfg) start(cfg);
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
