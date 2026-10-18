/**
 * Parser for the "Data model for contact records" admin guide page (ctr-data-model.md).
 * Each "## Section" lists fields as a bold name line followed by description lines and
 * "Type:", "Valid values:", "Min value:", "Length:" style lines, separated by blank lines.
 * Produces Metric entries so the Contact search page can reuse the tooltip pipeline.
 */
import type { Metric } from '../data/schema';
import { markdownToPlain } from './normalize';

const DOCS_BASE = 'https://docs.aws.amazon.com/connect/latest/adminguide/';
const PROPERTY_LINE = /^(Type|Valid values?|Min value|Max value|Length|Members|Default|Example|Format|Units?|Possible values)\s*:\s*(.*)$/i;
/** Sections that are not data-model types. */
const SKIP_SECTIONS = new Set(['important things to know', 'how to identify abandoned contacts']);

export interface CtrParseResult {
  metrics: Metric[];
  warnings: Array<{ metric: string; message: string }>;
}

export function parseCtrMarkdown(markdown: string, sourceSlug: string): CtrParseResult {
  const metrics: Metric[] = [];
  const warnings: CtrParseResult['warnings'] = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  let section = '';
  let sectionAnchor = '';
  let sectionIntro: string[] = [];
  let field: { name: string; anchor?: string; lines: string[] } | undefined;
  let pendingAnchor: string | undefined;

  const flushField = (): void => {
    if (!field || !section) {
      field = undefined;
      return;
    }
    const { name, lines: body } = field;
    const anchor = field.anchor ?? sectionAnchor;
    const description: string[] = [];
    const props: Array<[string, string]> = [];
    let openProp: [string, string] | undefined; // a "Valid values:" line whose values follow as bullets
    for (const raw of body) {
      const line = raw.replace(/\s+$/, '');
      if (!line.trim()) continue;
      const m = PROPERTY_LINE.exec(line.trim());
      if (m) {
        const prop: [string, string] = [capitalize(m[1] ?? ''), (m[2] ?? '').trim()];
        props.push(prop);
        openProp = prop[1] ? undefined : prop;
        continue;
      }
      if (openProp && /^\s*[+*-]\s+|^\s{2,}\S/.test(raw)) {
        openProp[1] = openProp[1] ? `${openProp[1]}\n${line}` : line;
        continue;
      }
      openProp = undefined;
      description.push(line.trim());
    }
    const type = props.find(([k]) => k === 'Type')?.[1];
    const extraSections: Record<string, string> = {};
    for (const [k, v] of props) {
      if (k === 'Type') continue;
      extraSections[k] = extraSections[k] ? `${extraSections[k]}\n${v}` : v;
    }
    const metric: Metric = {
      id: `${sourceSlug}#${section}.${name}`,
      name: `${section}.${name}`,
      anchor,
      sourceSlug,
      docsUrl: `${DOCS_BASE}${sourceSlug}.html#${anchor}`,
      summary: markdownToPlain(description[0] ?? ''),
      description: description.join('\n\n'),
      metricCategory: `Contact record field (${section})`,
      api: [],
      uiLabels: [],
      extraSections,
    };
    if (type) metric.metricType = markdownToPlain(type);
    if (!metric.summary) warnings.push({ metric: metric.id, message: 'field without a description' });
    metrics.push(metric);
    field = undefined;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const heading = /^## (.+?)\s*$/.exec(line);
    if (heading) {
      flushField();
      const title = markdownToPlain(heading[1] ?? '');
      section = SKIP_SECTIONS.has(title.toLowerCase()) ? '' : title;
      sectionAnchor = '';
      sectionIntro = [];
      pendingAnchor = undefined;
      continue;
    }
    if (/^# /.test(line)) {
      flushField();
      section = '';
      continue;
    }
    const anchorLine = /^<a name="([^"]+)"><\/a>\s*$/.exec(line);
    if (anchorLine) {
      if (!sectionAnchor) sectionAnchor = anchorLine[1] ?? '';
      else pendingAnchor = anchorLine[1];
      continue;
    }
    if (!section) continue;

    // A field starts with a line that is only a bold run, optionally followed by an inline anchor:
    //   **AgentInteractionDuration**  <a name="AgentInteractionDuration-CTR"></a>
    const bold = /^\*\*([^*]+)\*\*\s*(?:<a name="([^"]+)"><\/a>)?\s*$/.exec(line);
    if (bold) {
      flushField();
      const name = markdownToPlain(bold[1] ?? '').trim();
      if (/^(note|notes|tip|important|warning)$/i.test(name)) continue; // callouts, not fields
      field = { name, lines: [] };
      const inlineAnchor = bold[2];
      if (inlineAnchor) field.anchor = inlineAnchor;
      else if (pendingAnchor) field.anchor = pendingAnchor;
      pendingAnchor = undefined;
      continue;
    }
    if (field) {
      // An anchor placed right after the bold line belongs to this field.
      field.lines.push(line);
    } else {
      sectionIntro.push(line);
    }
  }
  flushField();
  void sectionIntro;
  return { metrics, warnings };
}

function capitalize(s: string): string {
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase().replace(/^valid value$/, 'valid values');
}
