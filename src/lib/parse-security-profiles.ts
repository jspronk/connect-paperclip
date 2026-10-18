/**
 * Parser for the "List of security profile permissions" admin guide page (security-profile-list.md).
 * Each "## Section" has a table: | UI name | API name | Use |. UI names are usually
 * "<Permission> - <Action>" (one row per action); some are a bare permission with several API names.
 * Rows are grouped by permission so one tooltip describes all of its actions.
 */
import type { Metric } from '../data/schema';
import { markdownToPlain } from './normalize';

const DOCS_BASE = 'https://docs.aws.amazon.com/connect/latest/adminguide/';
const ACTION = /^(.*?)\s*-\s*((?:Create|Edit|View|Delete|Remove|Enable|Disable|Access|Perform|Download|Share|Publish|Manage|Restrict|Export|Import|Assign|Add|Update|Run|Schedule|Pause|Resume|Approve|Reject|Admin|Monitor|Barge|Listen|Search|Set|Claim|Release)(?:\s*\/\s*\w+)?(?:\s*,\s*\w+(?:\s*\/\s*\w+)?)*(?:\s+\w+)*)$/i;

export interface SecurityParseResult {
  metrics: Metric[];
  warnings: Array<{ metric: string; message: string }>;
}

interface Group {
  section: string;
  anchor: string;
  name: string;
  rows: Array<{ action?: string; api: string[]; use: string }>;
}

export function parseSecurityProfilesMarkdown(markdown: string, sourceSlug: string): SecurityParseResult {
  const warnings: SecurityParseResult['warnings'] = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const groups = new Map<string, Group>();
  let section = '';
  let anchor = '';
  let inTable = false;
  let headerSeen = false;

  const groupKey = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

  for (const line of lines) {
    const h = /^## (.+?)\s*$/.exec(line);
    if (h) {
      section = markdownToPlain(h[1] ?? '');
      anchor = '';
      inTable = false;
      headerSeen = false;
      continue;
    }
    const a = /^<a name="([^"]+)"><\/a>\s*$/.exec(line);
    if (a) {
      if (!anchor) anchor = a[1] ?? '';
      continue;
    }
    if (!section) continue;
    if (!line.trim().startsWith('|')) {
      inTable = false;
      headerSeen = false;
      continue;
    }
    const cells = line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|\s*$/, '')
      .split('|')
      .map((c) => c.trim());
    if (!inTable) {
      // header row
      inTable = true;
      headerSeen = /ui name/i.test(cells[0] ?? '');
      continue;
    }
    if (/^-+$/.test((cells[0] ?? '').replace(/\s/g, '')) || !headerSeen) continue;
    const [uiName = '', apiRaw = '', use = ''] = cells;
    if (!uiName) continue;

    const m = ACTION.exec(uiName);
    const base = (m?.[1] ?? uiName).trim();
    const action = m ? (m[2] ?? '').trim() : undefined;
    const api = apiRaw
      .split(/<br\s*\/?>/i)
      .map((s) => markdownToPlain(s))
      .filter(Boolean);
    const key = `${groupKey(section)}|${groupKey(base)}`;
    const existing = groups.get(key);
    const g: Group = existing ?? { section, anchor, name: base, rows: [] };
    if (!existing) groups.set(key, g);
    else if (base.includes(' ') && !g.name.includes(' ')) g.name = base; // prefer "Hours of operation" over "HoursOfOperation"
    const row: Group['rows'][number] = { api, use };
    if (action) row.action = action;
    g.rows.push(row);
  }

  const metrics: Metric[] = [];
  for (const g of groups.values()) {
    const bullets = g.rows.map((r) => {
      const label = r.action ? `**${r.action}**: ` : '';
      const apis = r.api.length ? ` (${r.api.map((x) => `\`${x}\``).join(', ')})` : '';
      return `+ ${label}${r.use.trim()}${apis}`;
    });
    const summary = g.rows.length === 1 && !g.rows[0]!.action
      ? markdownToPlain(g.rows[0]!.use)
      : `${g.section} permission: ${g.rows.map((r) => r.action ?? 'all actions').join(', ')}.`;
    const metric: Metric = {
      id: `${sourceSlug}#${groupKey(g.section)}.${groupKey(g.name)}`,
      name: g.name,
      anchor: g.anchor,
      sourceSlug,
      docsUrl: `${DOCS_BASE}${sourceSlug}.html#${g.anchor}`,
      summary,
      description: bullets.join('\n'),
      metricCategory: `Security profile permission (${g.section})`,
      api: [],
      uiLabels: [{ surface: 'securityprofile', label: g.name, surfaceOnly: true }],
      extraSections: {},
    };
    if (!g.rows.some((r) => r.use.trim())) warnings.push({ metric: metric.id, message: 'no Use text' });
    metrics.push(metric);
  }
  return { metrics, warnings };
}
