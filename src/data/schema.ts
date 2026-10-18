/** Types for the generated src/data/metrics.json. Produced by scripts/build-metrics.ts. */

export type Surface = 'realtime' | 'historical' | 'dashboard' | 'contactsearch' | 'routingprofile';

export interface UiLabel {
  surface: Surface;
  /** Exact label as it appears in the admin website, e.g. "ACW", "After contact work time". */
  label: string;
  /** Regex source (case-insensitive, anchored) when the label is templated, e.g. "SL X" -> "^sl \\d+$". */
  pattern?: string;
  /** Parenthetical qualifier from the docs, e.g. "when Agent Activity is in After Contact Work state". */
  qualifier?: string;
  /** Dashboard name when the docs give one, e.g. "Queue and agent performance dashboard". */
  dashboardName?: string;
  /** Preferred position among several metrics sharing this label (lower first). */
  order?: number;
  /** Only match on this label's own surface; generic words like "Status" must not leak to other pages. */
  surfaceOnly?: boolean;
}

export interface ApiAccess {
  /** API operation, e.g. "GetMetricDataV2". */
  operation: string;
  /** Metric identifier, e.g. "AVG_HANDLE_TIME". Absent when the docs give a note instead. */
  identifier?: string;
  /** Extra text such as MetricFilters guidance, as plain text. */
  note?: string;
}

export interface Metric {
  /** Stable id: "<sourceSlug>#<anchor>". */
  id: string;
  name: string;
  anchor: string;
  sourceSlug: string;
  docsUrl: string;
  /** First description paragraph, plain text. */
  summary: string;
  /** Full description before the first bold section, markdown. */
  description: string;
  metricType?: string;
  /** Extra bullets under Metric type, e.g. "Min value: 0". */
  metricTypeDetails?: string[];
  metricCategory?: string;
  api: ApiAccess[];
  uiLabels: UiLabel[];
  /** Markdown. */
  calculationLogic?: string;
  /** Markdown. Merges "Note" and "Notes". */
  notes?: string;
  /** Any other bold-labelled section, markdown, keyed by label. */
  extraSections: Record<string, string>;
}

export interface MetricsSource {
  slug: string;
  url: string;
  htmlUrl: string;
  fetchedAt: string;
  sha256: string;
  metricCount: number;
}

export interface MetricsData {
  generatedAt: string;
  sources: MetricsSource[];
  metrics: Metric[];
}
