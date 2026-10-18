import type { Settings } from '../../lib/settings';
import { createQueue, onElement, type Disposable } from '../dom';
import { shadowRootsUnder } from '../matcher';
import type { FeatureContext } from './context';

const LOG = '[connect-paperclip]';
export const EDITOR_LINK_ATTR = 'data-cmh-editor-link';
const STYLE_ID = 'cmh-editor-link-style';
const CSS = `a[${EDITOR_LINK_ATTR}]{display:inline-block;margin:4px 0 0;font-size:12px;color:var(--workspace-palette-primary-default,#077398);text-decoration:underline dotted;text-underline-offset:3px}
a[${EDITOR_LINK_ATTR}]:hover{text-decoration-style:solid}`;

/** A flow or flow-module ARN as stored by the flow editor's "Select a flow" controls. */
const FLOW_ARN = /^arn:aws:connect:[a-z0-9-]+:\d{12}:instance\/[0-9a-f-]+\/(contact-flow|flow-module)\/[0-9a-f-]+$/i;

export function isFlowEditorPage(loc: Pick<Location, 'pathname'> = location): boolean {
  return /^(\/connect)?\/(contact-flows|flow-modules)\/edit(\/|$)/.test(loc.pathname);
}

/** Editor URL for a flow or flow module ARN; undefined if the text is not such an ARN. */
export function editorUrlForArn(value: string, origin = location.origin): string | undefined {
  const m = FLOW_ARN.exec(value.trim());
  if (!m) return undefined;
  const route = m[1]!.toLowerCase() === 'flow-module' ? 'flow-modules' : 'contact-flows';
  return `${origin}/${route}/edit?id=${encodeURIComponent(value.trim())}&tab=designer`;
}

/**
 * The element a link is placed after: the field's outermost wrapper. Fields are nested web
 * components (fe-aggregate > fe-select > picasa-select > shadow picasa-input > shadow input), so the
 * climb crosses shadow boundaries through their hosts and stops at the first ancestor that is not a
 * field component.
 */
function anchorPoint(field: Element): Element {
  // fe-aggregate groups a field with its companions (e.g. the flow select plus Alias/Version), so the
  // climb stops below it: the link then sits directly under the select, not under the whole group.
  const isField = (el: Element): boolean => /^(fe-|picasa-)/.test(el.tagName.toLowerCase()) && el.tagName.toLowerCase() !== 'fe-aggregate';
  let el: Element = field;
  for (let i = 0; i < 16; i++) {
    const root = el.getRootNode();
    const insideFieldShadow = root instanceof ShadowRoot && isField(root.host);
    const parent = el.parentElement;
    if (parent) {
      if (isField(parent) || insideFieldShadow) {
        el = parent;
        continue;
      }
      break;
    }
    if (insideFieldShadow) {
      el = (root as ShadowRoot).host;
      continue;
    }
    break;
  }
  return el;
}

/**
 * Current value of a flow-select or text field, if it is a flow ARN.
 * The editor's web components reflect their value as a DOM attribute, which is what a content
 * script can see: JavaScript properties defined by the page's component classes are invisible in
 * the isolated world. Native inputs expose their value as a property.
 */
function fieldArn(field: Element): string | undefined {
  const attr = field.getAttribute('value');
  const v = attr ?? (field as HTMLInputElement).value;
  return typeof v === 'string' && FLOW_ARN.test(v.trim()) ? v.trim() : undefined;
}

/**
 * Add, update or remove "Open flow" links next to every field in `root` (and nested shadow roots)
 * whose value is a flow ARN. Idempotent. Returns the number of links created.
 */
export function decorateEditor(root: ParentNode, origin = location.origin): number {
  let created = 0;
  const roots: ParentNode[] = [root, ...shadowRootsUnder(root)];
  const handled = new Set<Element>();
  for (const r of roots) {
    for (const field of r.querySelectorAll('picasa-select, input[type="text"], input:not([type])')) {
      const arn = fieldArn(field);
      const at = anchorPoint(field);
      // A select and the input mirrored inside it share one anchor point; handle it once per pass.
      if (handled.has(at)) continue;
      if (arn) handled.add(at);
      const existing = at.nextElementSibling?.matches(`a[${EDITOR_LINK_ATTR}]`) ? (at.nextElementSibling as HTMLAnchorElement) : null;
      if (!arn) {
        existing?.remove();
        continue;
      }
      const href = editorUrlForArn(arn, origin)!;
      if (existing) {
        if (existing.getAttribute('href') !== href) existing.setAttribute('href', href);
        continue;
      }
      const a = document.createElement('a');
      a.setAttribute(EDITOR_LINK_ATTR, '');
      a.setAttribute('href', href);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.title = `Open ${arn.split('/').pop()} in the flow editor (new tab)`;
      a.textContent = /flow-module\//i.test(arn) ? 'Open flow module ↗' : 'Open flow ↗';
      a.addEventListener('click', (e) => e.stopPropagation());
      at.after(a);
      ensureStyle(at.getRootNode());
      created++;
    }
  }
  return created;
}

export function undecorateEditor(root: ParentNode): void {
  for (const r of [root, ...shadowRootsUnder(root)]) {
    for (const a of r.querySelectorAll(`a[${EDITOR_LINK_ATTR}]`)) a.remove();
  }
}

function ensureStyle(node: Node): void {
  const root = node instanceof ShadowRoot ? node : document;
  if (root.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  (root instanceof Document ? root.head : root).append(style);
}

/**
 * In the flow editor, adds an "Open flow" link under any block setting that holds a flow
 * (Transfer to flow, Set customer queue flow, Set hold flow, ...), including a dynamic value
 * that literally contains a flow ARN. Opens in a new tab so the current draft is not disturbed.
 */
export function startFlowEditorLinks(ctx: FeatureContext): void {
  let settings: Settings = ctx.settings;
  let active = false;
  const watchers: Disposable[] = [];
  const observed = new WeakSet<Node>();
  let observer: MutationObserver | undefined;

  const run = createQueue<ParentNode>(120, (items) => {
    if (!settings.enabled || !settings.flowLinks) return;
    let n = 0;
    for (const root of items) {
      if (root instanceof Node && !root.isConnected && !(root instanceof ShadowRoot)) continue;
      n += decorateEditor(root);
      // Shadow roots nested under this root must be observed themselves: mutations do not cross boundaries.
      for (const sr of shadowRootsUnder(root)) observeRoot(sr);
    }
    if (n) console.debug(LOG, `added ${n} flow editor link(s)`);
  });

  const observeRoot = (root: Node): void => {
    if (observed.has(root) || !observer) return;
    observed.add(root);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['value'] });
  };

  const start = (): void => {
    active = true;
    observer = new MutationObserver((records) => {
      for (const r of records) {
        const t = r.target;
        const root = t instanceof Element ? t : t.parentElement;
        if (root) run.add(root);
      }
    });
    // The block properties panel is a <block-form> custom element; watch for it and everything beneath.
    watchers.push(
      onElement('block-form', (host) => {
        observeRoot(host);
        run.add(host);
        // Its shadow root is attached shortly after insertion; poll briefly.
        let tries = 0;
        const poll = window.setInterval(() => {
          if (host.shadowRoot) {
            window.clearInterval(poll);
            observeRoot(host.shadowRoot);
            run.add(host.shadowRoot);
          } else if (++tries > 50 || !host.isConnected) window.clearInterval(poll);
        }, 100);
      }),
    );
    // Values change without DOM mutations when the user picks a flow; a light periodic pass catches that.
    const tick = window.setInterval(() => {
      for (const host of document.querySelectorAll('block-form')) run.add(host.shadowRoot ?? host);
    }, 1500);
    watchers.push({ dispose: () => window.clearInterval(tick) });
  };
  const stop = (): void => {
    active = false;
    watchers.splice(0).forEach((w) => w.dispose());
    observer?.disconnect();
    observer = undefined;
    undecorateEditor(document);
  };

  const sync = (): void => {
    const want = settings.enabled && settings.flowLinks && isFlowEditorPage();
    if (want === active) return;
    if (want) start();
    else stop();
  };
  sync();
  window.addEventListener('popstate', sync);
  window.setInterval(sync, 2000);
  ctx.onSettings((next) => {
    settings = next;
    sync();
  });
}
