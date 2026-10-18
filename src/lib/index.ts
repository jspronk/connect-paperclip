/**
 * Builds lookup maps from the generated metrics data so the content script can resolve a
 * normalized on-page label to one or more metrics in O(1) (plus a short list of regex labels).
 */
import type { Metric, MetricsData, Surface, UiLabel } from '../data/schema';
import { normalizeLabel } from './normalize';

export type PageSurface = Surface | 'unknown';

/** A console label not listed in the docs, mapped to a metric by hand (src/data/aliases.json). */
export interface Alias {
  metricId: string;
  surface: Surface;
  label: string;
}

/** Hand-written corrections applied on top of the generated data. */
export interface Overrides {
  aliases?: Alias[];
  /** Docs labels to ignore, e.g. copy/paste errors on the AWS page. */
  suppress?: Alias[];
}

export interface Candidate {
  metric: Metric;
  uiLabel: UiLabel | null;
  /** Lower is better: 0 = label on the current surface, 1 = label on another surface, 2 = metric name. */
  rank: 0 | 1 | 2;
  /** For name matches of surface-only entries: the surfaces the name may match on. */
  onlyOn?: Set<Surface>;
}

interface PatternEntry {
  regex: RegExp;
  metric: Metric;
  uiLabel: UiLabel;
}

export class MetricIndex {
  private readonly bySurface: Record<Surface, Map<string, Candidate[]>> = {
    realtime: new Map(),
    historical: new Map(),
    dashboard: new Map(),
    contactsearch: new Map(),
    routingprofile: new Map(),
    quickconnect: new Map(),
  };
  private readonly byName = new Map<string, Candidate[]>();
  private readonly patterns: PatternEntry[] = [];
  /** Every normalized exact label, for a cheap "could this text be a label at all" check. */
  private readonly allKeys = new Set<string>();

  constructor(
    public readonly data: MetricsData,
    overrides: Overrides = {},
  ) {
    const extra = new Map<string, UiLabel[]>();
    for (const a of overrides.aliases ?? []) push(extra, a.metricId, { surface: a.surface, label: a.label });
    const suppressed = new Set((overrides.suppress ?? []).map((a) => `${a.metricId}|${a.surface}|${normalizeLabel(a.label)}`));
    for (const metric of data.metrics) {
      for (const uiLabel of [...metric.uiLabels, ...(extra.get(metric.id) ?? [])]) {
        if (suppressed.has(`${metric.id}|${uiLabel.surface}|${normalizeLabel(uiLabel.label)}`)) continue;
        if (uiLabel.pattern) {
          this.patterns.push({ regex: new RegExp(uiLabel.pattern, 'i'), metric, uiLabel });
          continue;
        }
        const key = normalizeLabel(uiLabel.label);
        if (!key) continue;
        push(this.bySurface[uiLabel.surface], key, { metric, uiLabel, rank: 0 });
        this.allKeys.add(key);
      }
      const nameKey = normalizeLabel(metric.name);
      if (nameKey) {
        // An entry whose labels are all surface-only is itself surface-only: its name must not
        // match generic headers ("Channels", "Priority") on other pages.
        const restricted = metric.uiLabels.length > 0 && metric.uiLabels.every((l) => l.surfaceOnly);
        const cand: Candidate = { metric, uiLabel: null, rank: 2 };
        if (restricted) cand.onlyOn = new Set(metric.uiLabels.map((l) => l.surface));
        push(this.byName, nameKey, cand);
        this.allKeys.add(nameKey);
      }
    }
  }

  get size(): number {
    return this.data.metrics.length;
  }

  /** Cheap pre-check used while scanning the DOM; true if the text might resolve to a metric. */
  mightMatch(text: string): boolean {
    const key = normalizeLabel(text);
    if (!key) return false;
    if (this.allKeys.has(key)) return true;
    return this.patterns.some((p) => p.regex.test(key));
  }

  /**
   * Resolve a label. Candidates for the given surface come first, then labels from other surfaces,
   * then metric-name matches. Duplicate metrics are collapsed, keeping the best rank.
   */
  lookup(text: string, surface: PageSurface = 'unknown'): Candidate[] {
    const key = normalizeLabel(text);
    if (!key) return [];
    const found: Candidate[] = [];

    const all: Surface[] = ['realtime', 'historical', 'dashboard', 'contactsearch', 'routingprofile', 'quickconnect'];
    const order: Surface[] = surface === 'unknown' ? all : [surface, ...all.filter((s) => s !== surface)];

    order.forEach((s, i) => {
      const own = i === 0 && surface !== 'unknown';
      for (const c of this.bySurface[s].get(key) ?? []) {
        if (!own && c.uiLabel?.surfaceOnly) continue;
        found.push({ ...c, rank: own ? 0 : 1 });
      }
    });

    for (const p of this.patterns) {
      if (p.regex.test(key)) {
        const own = surface !== 'unknown' && p.uiLabel.surface === surface;
        found.push({ metric: p.metric, uiLabel: p.uiLabel, rank: own ? 0 : 1 });
      }
    }

    for (const c of this.byName.get(key) ?? []) {
      if (c.onlyOn && (surface === 'unknown' || !c.onlyOn.has(surface))) continue;
      found.push(c);
    }

    const best = new Map<string, Candidate>();
    for (const c of found) {
      const prev = best.get(c.metric.id);
      if (!prev || c.rank < prev.rank) best.set(c.metric.id, c);
    }
    return [...best.values()].sort(
      (a, b) =>
        a.rank - b.rank ||
        (a.uiLabel?.order ?? 0) - (b.uiLabel?.order ?? 0) ||
        a.metric.name.localeCompare(b.metric.name),
    );
  }
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const arr = map.get(key);
  if (arr) arr.push(value);
  else map.set(key, [value]);
}
