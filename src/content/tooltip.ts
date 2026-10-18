import type { Candidate } from '../lib/index';
import type { Metric } from '../data/schema';
import type { Settings } from '../lib/settings';
import { renderMarkdown } from './markdown';
import { HOST_ID } from './matcher';
import css from './tooltip.css?inline';

const SURFACE_LABEL: Record<string, string> = {
  realtime: 'Real-time',
  historical: 'Historical',
  dashboard: 'Dashboard',
  contactsearch: 'Contact search',
  routingprofile: 'Routing profile',
  quickconnect: 'Quick connect',
  securityprofile: 'Security profile',
  name: 'Metric name',
};

export class Tooltip {
  private readonly host: HTMLDivElement;
  private readonly root: ShadowRoot;
  private readonly tip: HTMLDivElement;
  private anchor: Element | null = null;
  private candidates: Candidate[] = [];
  private nativeHint = '';
  private selected = 0;
  private hideTimer: number | undefined;

  constructor(
    private settings: Settings,
    private readonly generatedAt: string,
  ) {
    this.host = document.createElement('div');
    this.host.id = HOST_ID;
    this.root = this.host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = css;
    this.tip = document.createElement('div');
    this.tip.className = 'tip';
    this.tip.setAttribute('role', 'tooltip');
    this.tip.hidden = true;
    this.root.append(style, this.tip);
    document.documentElement.append(this.host);

    this.tip.addEventListener('mouseenter', () => this.cancelHide());
    this.tip.addEventListener('mouseleave', () => this.scheduleHide());
  }

  updateSettings(settings: Settings): void {
    this.settings = settings;
  }

  get isOpen(): boolean {
    return !this.tip.hidden;
  }

  get currentAnchor(): Element | null {
    return this.anchor;
  }

  show(anchor: Element, candidates: Candidate[], nativeHint = ''): void {
    if (!candidates.length) return;
    this.cancelHide();
    this.anchor = anchor;
    this.candidates = candidates;
    this.nativeHint = nativeHint;
    this.selected = 0;
    this.render();
    this.tip.hidden = false;
    this.position();
    requestAnimationFrame(() => this.tip.setAttribute('data-open', 'true'));
  }

  scheduleHide(delay = 180): void {
    this.cancelHide();
    this.hideTimer = window.setTimeout(() => this.hide(), delay);
  }

  cancelHide(): void {
    if (this.hideTimer) window.clearTimeout(this.hideTimer);
    this.hideTimer = undefined;
  }

  hide(): void {
    this.cancelHide();
    this.tip.removeAttribute('data-open');
    this.tip.hidden = true;
    this.anchor = null;
    this.candidates = [];
  }

  private render(): void {
    this.tip.replaceChildren();
    const c = this.candidates[this.selected];
    if (!c) return;
    const { metric, uiLabel } = c;

    if (this.candidates.length > 1) {
      const tabs = document.createElement('div');
      tabs.className = 'tabs';
      tabs.setAttribute('role', 'tablist');
      this.candidates.forEach((cand, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', String(i === this.selected));
        b.textContent = cand.metric.name;
        b.addEventListener('click', () => {
          this.selected = i;
          this.render();
          this.position();
        });
        tabs.append(b);
      });
      this.tip.append(tabs);
    }

    const head = document.createElement('div');
    head.className = 'head';
    const name = document.createElement('h2');
    name.className = 'name';
    name.textContent = metric.name;
    const badge = document.createElement('span');
    badge.className = 'badge';
    const surfaceKey = uiLabel?.surface ?? 'name';
    badge.dataset.surface = surfaceKey;
    badge.textContent = uiLabel?.dashboardName ?? SURFACE_LABEL[surfaceKey] ?? surfaceKey;
    head.append(name, badge);
    this.tip.append(head);

    if (uiLabel?.qualifier) {
      const q = document.createElement('p');
      q.className = 'qualifier';
      q.textContent = `Shown as “${uiLabel.label}” ${uiLabel.qualifier}`;
      this.tip.append(q);
    }

    if (this.nativeHint) {
      const hint = document.createElement('p');
      hint.className = 'hint';
      hint.textContent = this.nativeHint;
      this.tip.append(hint);
    }

    const body = document.createElement('div');
    body.className = 'body';
    body.append(renderMarkdown(metric.description || metric.summary, metric.sourceSlug));
    this.tip.append(body);

    this.tip.append(this.renderMeta(metric));

    if (metric.calculationLogic) {
      this.tip.append(this.renderDetails('Calculation logic', metric.calculationLogic, metric, false));
    }
    if (metric.notes) {
      this.tip.append(this.renderDetails('Notes', metric.notes, metric, false));
    }
    for (const [label, text] of Object.entries(metric.extraSections)) {
      this.tip.append(this.renderDetails(label, text, metric, false));
    }

    const foot = document.createElement('div');
    foot.className = 'foot';
    const link = document.createElement('a');
    link.href = metric.docsUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Open in AWS docs ↗';
    const synced = document.createElement('span');
    synced.textContent = `Docs synced ${new Date(this.generatedAt).toLocaleDateString()}`;
    foot.append(link, synced);
    this.tip.append(foot);
  }

  private renderMeta(metric: Metric): HTMLElement {
    const dl = document.createElement('dl');
    dl.className = 'meta';
    const add = (k: string, v: Node | string): void => {
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.append(v);
      dl.append(dt, dd);
    };
    if (metric.metricType) {
      const details = metric.metricTypeDetails?.length ? ` (${metric.metricTypeDetails.join(', ')})` : '';
      add('Type', `${metric.metricType}${details}`);
    }
    if (metric.metricCategory) add('Category', metric.metricCategory);
    const apis = metric.api.filter((a) => a.operation && a.identifier);
    if (apis.length) {
      const frag = document.createDocumentFragment();
      apis.forEach((a, i) => {
        if (i) frag.append(document.createElement('br'));
        const code = document.createElement('code');
        code.textContent = a.identifier ?? '';
        frag.append(`${a.operation}: `, code);
      });
      add('API', frag);
    }
    return dl;
  }

  private renderDetails(label: string, md: string, metric: Metric, open: boolean): HTMLElement {
    const details = document.createElement('details');
    details.open = open;
    const summary = document.createElement('summary');
    summary.textContent = label;
    const body = document.createElement('div');
    body.className = 'body';
    body.append(renderMarkdown(md, metric.sourceSlug));
    details.append(summary, body);
    details.addEventListener('toggle', () => this.position());
    return details;
  }

  private position(): void {
    if (!this.anchor) return;
    const margin = 8;
    const a = this.anchor.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    this.tip.style.maxHeight = `${Math.min(560, Math.max(160, vh - 2 * margin))}px`;
    const t = this.tip.getBoundingClientRect();

    let top = a.bottom + margin;
    let left = a.left;
    // Inside an open dropdown list, sit beside the option so the other options stay readable.
    const inList = !!this.anchor.closest('[role="listbox"]');
    if (inList && a.right + margin + t.width <= vw - margin) {
      left = a.right + margin;
      top = Math.min(Math.max(margin, a.top), Math.max(margin, vh - margin - t.height));
    } else if (inList && a.left - margin - t.width >= margin) {
      left = a.left - margin - t.width;
      top = Math.min(Math.max(margin, a.top), Math.max(margin, vh - margin - t.height));
    } else {
      if (top + t.height > vh - margin) {
        const above = a.top - margin - t.height;
        top = above >= margin ? above : Math.max(margin, vh - margin - t.height);
      }
      if (left + t.width > vw - margin) left = Math.max(margin, vw - margin - t.width);
    }
    this.tip.style.top = `${Math.round(top)}px`;
    this.tip.style.left = `${Math.round(left)}px`;
  }
}
