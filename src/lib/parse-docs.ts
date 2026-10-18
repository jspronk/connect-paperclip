/**
 * Pure parser for the AWS admin guide metric definition markdown pages.
 * No I/O. Input: markdown text + source slug. Output: Metric[].
 */
import type { ApiAccess, Metric, Surface, UiLabel } from '../data/schema';
import { labelToPattern, markdownToPlain } from './normalize';

const DOCS_BASE = 'https://docs.aws.amazon.com/connect/latest/adminguide/';

const SECTION_API = 'how to access using the connect customer api';
const SECTION_ADMIN = 'how to access using the connect customer admin website';
const SECTION_TYPE = 'metric type';
const SECTION_CATEGORY = 'metric category';
const SECTION_CALC = 'calculation logic';
const SECTION_NOTE = new Set(['note', 'notes']);

interface Section {
  label: string;
  /** Text on the same line after the label, if any. */
  inline: string;
  /** Following lines until the next section. */
  lines: string[];
}

export interface ParseWarning {
  metric: string;
  message: string;
}

export interface ParseResult {
  metrics: Metric[];
  warnings: ParseWarning[];
}

export function parseMetricsMarkdown(markdown: string, sourceSlug: string): ParseResult {
  const metrics: Metric[] = [];
  const warnings: ParseWarning[] = [];
  const chunks = markdown.split(/^## /m).slice(1);

  for (const chunk of chunks) {
    const lines = chunk.replace(/\r\n/g, '\n').split('\n');
    const name = markdownToPlain(lines[0] ?? '').trim();
    if (!name) continue;
    let i = 1;
    let anchor = '';
    const anchorMatch = /^<a name="([^"]+)"><\/a>\s*$/.exec(lines[i] ?? '');
    if (anchorMatch) {
      anchor = anchorMatch[1] ?? '';
      i++;
    } else {
      anchor = slugify(name);
      warnings.push({ metric: name, message: 'missing anchor, derived from name' });
    }

    const descriptionLines: string[] = [];
    const sections: Section[] = [];
    let current: Section | undefined;

    for (; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const sec = /^\*\*([^*]+?)\*\*(\s*:\s*|\s*)(.*)$/.exec(line);
      // A bold run starts a section only if it is followed by a colon or nothing else on the line.
      if (sec && (sec[2]?.includes(':') || sec[3]?.trim() === '')) {
        current = { label: (sec[1] ?? '').trim().replace(/:$/, ''), inline: (sec[3] ?? '').trim(), lines: [] };
        sections.push(current);
        continue;
      }
      if (current) current.lines.push(line);
      else descriptionLines.push(line);
    }

    const description = trimBlank(descriptionLines).join('\n');
    const summary = markdownToPlain(firstParagraph(descriptionLines));

    const metric: Metric = {
      id: `${sourceSlug}#${anchor}`,
      name,
      anchor,
      sourceSlug,
      docsUrl: `${DOCS_BASE}${sourceSlug}.html#${anchor}`,
      summary,
      description,
      api: [],
      uiLabels: [],
      extraSections: {},
    };

    for (const s of sections) {
      const key = s.label.toLowerCase();
      const body = trimBlank(s.lines);
      if (key === SECTION_TYPE) {
        metric.metricType = markdownToPlain(s.inline) || undefined;
        const details = bullets(body).map(markdownToPlain).filter(Boolean);
        if (details.length) metric.metricTypeDetails = details;
      } else if (key === SECTION_CATEGORY) {
        metric.metricCategory = markdownToPlain([s.inline, ...body].join(' ')) || undefined;
      } else if (key === SECTION_API) {
        metric.api = parseApi(body, s.inline);
      } else if (key === SECTION_ADMIN) {
        metric.uiLabels = parseUiLabels(body, s.inline, name, warnings);
      } else if (key === SECTION_CALC) {
        metric.calculationLogic = joinInline(s.inline, body) || undefined;
      } else if (SECTION_NOTE.has(key)) {
        const text = joinInline(s.inline, body);
        metric.notes = metric.notes ? `${metric.notes}\n\n${text}` : text || undefined;
      } else {
        metric.extraSections[s.label] = joinInline(s.inline, body);
      }
    }

    metrics.push(metric);
  }

  return { metrics, warnings };
}

function parseApi(body: string[], inline: string): ApiAccess[] {
  const out: ApiAccess[] = [];
  const items = topLevelBullets([inline, ...body].filter(Boolean));
  for (const item of items) {
    const head = item.head;
    const opMatch = /\[\s*([A-Za-z0-9]+)\s*\]\([^)]*\)/.exec(head) ?? /^\s*([A-Z][A-Za-z0-9]+)\s+API/.exec(head);
    const idMatch = /`([A-Z0-9_\\]+)`/.exec(head);
    const identifier = idMatch?.[1]?.replace(/\\_/g, '_');
    if (opMatch) {
      const entry: ApiAccess = { operation: opMatch[1] ?? '' };
      if (identifier) entry.identifier = identifier;
      const rest = item.children.map(markdownToPlain).filter(Boolean).join(' ');
      if (rest) entry.note = rest;
      out.push(entry);
    } else {
      const note = markdownToPlain([head, ...item.children].join(' '));
      if (!note) continue;
      const last = out[out.length - 1];
      if (last) last.note = last.note ? `${last.note} ${note}` : note;
      else out.push({ operation: '', note });
    }
  }
  return out.filter((a) => a.operation || a.note);
}

function parseUiLabels(body: string[], inline: string, metricName: string, warnings: ParseWarning[]): UiLabel[] {
  const out: UiLabel[] = [];
  const items = topLevelBullets([inline, ...body].filter(Boolean));
  for (const item of items) {
    const m = /^(Real-time metrics reports|Historical metrics reports|Dashboard)\s*:\s*(.*)$/i.exec(item.head.trim());
    if (!m) {
      // Free-text notes in this section (e.g. availability caveats) are not labels.
      continue;
    }
    const surface = surfaceFor(m[1] ?? '');
    const raw = (m[2] ?? '').trim();
    if (!raw || /^not available/i.test(raw)) continue;

    // A label that is nothing but a link to a docs page (no fragment) is a page reference, not a label,
    // e.g. "Dashboard: [Outbound campaigns performance dashboard](outbound-campaigns-performance-dashboard.md)".
    const soleLink = /^\[[^\]]*\]\(([^)]*)\)\s*\.?$/.exec(raw);
    if (soleLink && !(soleLink[1] ?? '').includes('#')) continue;

    // Links to anchors keep their text as the label.
    let text = raw.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    let qualifier: string | undefined;
    const q = /^(.*?)\s*\(([^()]*)\)\s*$/.exec(text);
    if (q && !/timestamp/i.test(q[2] ?? '')) {
      // Keep "(connected to agent timestamp)" style disambiguators as part of the label;
      // move behavioural qualifiers such as "(when Agent Activity ...)" aside.
      text = (q[1] ?? '').trim();
      qualifier = markdownToPlain(q[2] ?? '');
    }

    let dashboardName: string | undefined;
    if (surface === 'dashboard') {
      const plain = markdownToPlain(text);
      const dm = /^(.*?dashboard)\s*,\s*(?:the\s+)?(.+)$/i.exec(plain);
      if (dm) {
        dashboardName = dm[1]?.trim();
        text = (dm[2] ?? '').trim();
      } else if (/dashboard\s*$/i.test(plain)) {
        // A bare dashboard reference with no metric label; nothing to match on.
        continue;
      } else {
        text = plain;
      }
    }

    const label = markdownToPlain(text).replace(/\.$/, '').trim();
    if (!label) {
      warnings.push({ metric: metricName, message: `empty UI label from "${raw}"` });
      continue;
    }
    const entry: UiLabel = { surface, label };
    const pattern = labelToPattern(text);
    if (pattern) entry.pattern = pattern;
    if (qualifier) entry.qualifier = qualifier;
    if (dashboardName) entry.dashboardName = dashboardName;
    out.push(entry);
  }
  return out;
}

function surfaceFor(prefix: string): Surface {
  const p = prefix.toLowerCase();
  if (p.startsWith('real-time')) return 'realtime';
  if (p.startsWith('historical')) return 'historical';
  return 'dashboard';
}

interface BulletItem {
  head: string;
  children: string[];
}

/** Group "+ " bullets with their indented continuation/children lines. */
function topLevelBullets(lines: string[]): BulletItem[] {
  const items: BulletItem[] = [];
  let cur: BulletItem | undefined;
  for (const line of lines) {
    const top = /^\+\s+(.*)$/.exec(line);
    if (top) {
      cur = { head: top[1] ?? '', children: [] };
      items.push(cur);
    } else if (cur && line.trim()) {
      cur.children.push(line.replace(/^\s+\+\s+/, '').trim());
    } else if (!cur && line.trim()) {
      cur = { head: line.trim(), children: [] };
      items.push(cur);
    }
  }
  return items;
}

function bullets(lines: string[]): string[] {
  return lines.filter((l) => /^\s*\+\s+/.test(l)).map((l) => l.replace(/^\s*\+\s+/, ''));
}

function joinInline(inline: string, body: string[]): string {
  return trimBlank([inline, ...body]).join('\n').trim();
}

function trimBlank(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && !(lines[start] ?? '').trim()) start++;
  while (end > start && !(lines[end - 1] ?? '').trim()) end--;
  return lines.slice(start, end);
}

function firstParagraph(lines: string[]): string {
  const trimmed = trimBlank(lines);
  const para: string[] = [];
  for (const l of trimmed) {
    if (!l.trim()) break;
    para.push(l);
  }
  return para.join(' ');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
