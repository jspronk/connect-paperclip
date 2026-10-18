import type { Settings } from '../../lib/settings';
import { createQueue, observeShadow, onElement, type Disposable } from '../dom';
import type { FeatureContext } from './context';

const LOG = '[connect-metrics-helper]';
export const MESSAGE_SOURCE = 'connect-metrics-helper';
/** Attribute on anchors this feature creates. (Name kept from the first, flow-only version.) */
export const FLOW_ATTR = 'data-cmh-flow';
const STYLE_ID = 'cmh-flow-links-style';
const CSS = `a[${FLOW_ATTR}]{color:inherit;text-decoration:underline dotted;text-underline-offset:3px;cursor:pointer}
a[${FLOW_ATTR}]:hover{color:#0972d3;text-decoration-style:solid}`;

/** Everything learned from the page's own API responses, forwarded by public/capture.js. */
export interface LinkMaps {
  /** normalized resource key (digits of a phone number, or lower-cased email address) -> resource ARN */
  resourceArnByKey: Map<string, string>;
  /** resource ARN (phone number or email address) -> flow ARN */
  flowArnByResourceArn: Map<string, string>;
  /** lower-cased username -> routing profile id */
  routingProfileIdByUser: Map<string, string>;
  /** lower-cased routing profile name -> routing profile id */
  routingProfileIdByName: Map<string, string>;
}
/** @deprecated name kept for older imports */
export type FlowMaps = LinkMaps;

export function createMaps(): LinkMaps {
  return {
    resourceArnByKey: new Map(),
    flowArnByResourceArn: new Map(),
    routingProfileIdByUser: new Map(),
    routingProfileIdByName: new Map(),
  };
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
export function handleMessage(maps: LinkMaps, data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as { source?: string; type?: string; items?: unknown };
  if (d.source !== MESSAGE_SOURCE || !Array.isArray(d.items)) return false;
  let changed = false;
  const set = (map: Map<string, string>, key: string, value: string): void => {
    if (key && value && map.get(key) !== value) {
      map.set(key, value);
      changed = true;
    }
  };
  if (d.type === 'phone-numbers') {
    for (const it of d.items as Array<{ number?: string; arn?: string }>) {
      if (typeof it.number === 'string' && typeof it.arn === 'string') set(maps.resourceArnByKey, digitsOf(it.number), it.arn);
    }
  } else if (d.type === 'email-addresses') {
    for (const it of d.items as Array<{ address?: string; arn?: string }>) {
      if (typeof it.address === 'string' && typeof it.arn === 'string') set(maps.resourceArnByKey, it.address.trim().toLowerCase(), it.arn);
    }
  } else if (d.type === 'flow-associations') {
    for (const it of d.items as Array<{ resourceArn?: string; flowArn?: string }>) {
      if (typeof it.resourceArn === 'string' && typeof it.flowArn === 'string') set(maps.flowArnByResourceArn, it.resourceArn, it.flowArn);
    }
  } else if (d.type === 'users') {
    for (const it of d.items as Array<{ username?: string; routingProfileId?: string; routingProfileName?: string }>) {
      if (typeof it.routingProfileId !== 'string') continue;
      if (typeof it.username === 'string') set(maps.routingProfileIdByUser, it.username.trim().toLowerCase(), it.routingProfileId);
      if (typeof it.routingProfileName === 'string') set(maps.routingProfileIdByName, it.routingProfileName.trim().toLowerCase(), it.routingProfileId);
    }
  }
  return changed;
}

export function editorUrl(flowArn: string, origin = location.origin): string {
  return `${origin}/contact-flows/edit?id=${encodeURIComponent(flowArn)}&tab=designer`;
}

export function routingProfileUrl(id: string, origin = location.origin): string {
  return `${origin}/routing-profiles/edit?id=${encodeURIComponent(id)}`;
}

/** What a row tells us about itself, from its other cells. */
interface RowKeys {
  /** lower-cased email address found in the row, if any */
  email?: string;
  /** digits of a phone number found in the row, if any */
  phone?: string;
  /** text of the first cell that holds a link (the row's primary identifier, e.g. a username) */
  link?: string;
}

function rowKeys(cells: Element[], skipCol: number): RowKeys {
  const keys: RowKeys = {};
  cells.forEach((c, i) => {
    if (i === skipCol) return;
    const text = (c.textContent ?? '').trim();
    if (!text) return;
    if (!keys.email && /^[^\s@]+@[^\s@]+$/.test(text)) keys.email = text.toLowerCase();
    if (!keys.phone && /^\+?[\d\s().-]{7,}$/.test(text)) keys.phone = digitsOf(text);
    if (!keys.link && c.querySelector('a')) keys.link = text.toLowerCase();
  });
  return keys;
}

/** A linkable column: which header it is under and how to build the href for a row. */
interface LinkColumn {
  header: RegExp;
  title: string;
  href(row: RowKeys, cellText: string, maps: LinkMaps, origin: string): string | undefined;
}

const COLUMNS: LinkColumn[] = [
  {
    header: /^(contact flow\s*\/\s*ivr|flow)$/i,
    title: 'Open this flow in the flow editor',
    href(row, _cell, maps, origin) {
      const key = row.email ?? row.phone;
      const resourceArn = key ? maps.resourceArnByKey.get(key) : undefined;
      const flowArn = resourceArn ? maps.flowArnByResourceArn.get(resourceArn) : undefined;
      return flowArn ? editorUrl(flowArn, origin) : undefined;
    },
  },
  {
    header: /^routing profile$/i,
    title: 'Open this routing profile',
    href(row, cell, maps, origin) {
      const id =
        (row.link ? maps.routingProfileIdByUser.get(row.link) : undefined) ??
        (row.email ? maps.routingProfileIdByUser.get(row.email) : undefined) ??
        maps.routingProfileIdByName.get(cell.toLowerCase());
      return id ? routingProfileUrl(id, origin) : undefined;
    },
  },
];

/** Indexes of linkable columns in a table (picasa or Cloudscape): column index -> config. */
function linkColumns(table: Element): Map<number, LinkColumn> {
  const found = new Map<number, LinkColumn>();
  const headerRows = table.querySelectorAll('thead tr, [role="rowgroup"]:not(.picasa-table__body) [role="row"]');
  for (const row of headerRows) {
    [...row.children].forEach((c, i) => {
      const text = (c.textContent ?? '').trim();
      const col = COLUMNS.find((lc) => lc.header.test(text));
      if (col && !found.has(i)) found.set(i, col);
    });
    if (found.size) break;
  }
  return found;
}

/**
 * Turn cell text into links wherever the row resolves to a known resource.
 * Idempotent. Returns the number of anchors created.
 */
export function decorate(root: ParentNode, maps: LinkMaps, origin = location.origin): number {
  let created = 0;
  for (const table of root.querySelectorAll('[role="table"], [role="grid"], table')) {
    const cols = linkColumns(table);
    if (!cols.size) continue;
    const body = table.querySelector('tbody, [role="rowgroup"].picasa-table__body') ?? table;
    for (const row of body.querySelectorAll('tr, [role="row"]')) {
      const cells = [...row.children];
      for (const [colIndex, col] of cols) {
        const cell = cells[colIndex];
        if (!cell) continue;
        const name = (cell.textContent ?? '').trim();
        if (!name || name === '-') continue;
        const href = col.href(rowKeys(cells, colIndex), name, maps, origin);
        if (!href) continue;

        const existing = cell.querySelector<HTMLAnchorElement>(`a[${FLOW_ATTR}]`);
        if (existing) {
          if (existing.getAttribute('href') !== href) existing.setAttribute('href', href);
          continue;
        }
        // Wrap the innermost element that holds exactly the text, so framework wrappers stay intact.
        let holder: Element = cell;
        for (let depth = 0; depth < 5; depth++) {
          const kids = [...holder.children].filter((k) => (k.textContent ?? '').trim() === name);
          if (kids.length !== 1) break;
          holder = kids[0]!;
        }
        const a = document.createElement('a');
        a.setAttribute(FLOW_ATTR, '');
        a.setAttribute('href', href);
        a.title = col.title;
        a.textContent = name;
        a.addEventListener('click', (e) => e.stopPropagation());
        holder.replaceChildren(a);
        created++;
      }
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
  if (root.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  (root instanceof Document ? root.head : root).append(style);
}

/** Pages whose tables get resource links, with where their table renders. */
interface PageConfig {
  path: RegExp;
  /** Custom element hosting an open shadow root that contains the table; omitted = light DOM. */
  shadowHost?: string;
}
const PAGES: PageConfig[] = [
  { path: /^(\/connect)?\/numbers(\/|$)/, shadowHost: 'lily-number-website-ui' },
  { path: /^(\/connect)?\/email-addresses(\/|$)/ },
  { path: /^(\/connect)?\/users(\/|$)/ },
];

export function pageConfig(loc: Pick<Location, 'pathname'> = location): PageConfig | undefined {
  return PAGES.find((p) => p.path.test(loc.pathname));
}

export function isPhoneNumbersPage(loc: Pick<Location, 'pathname'> = location): boolean {
  return pageConfig(loc)?.shadowHost === 'lily-number-website-ui';
}

/** Links flow names and routing profile names in console list pages to their edit pages. */
export function startResourceLinks(ctx: FeatureContext): void {
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
      if (n) console.debug(LOG, `linked ${n} cell(s) on ${location.pathname}`);
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

/** @deprecated use startResourceLinks */
export const startFlowLinks = startResourceLinks;
