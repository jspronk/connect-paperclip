# Connect Metrics Helper

A Chrome extension (Manifest V3) that adds hover definitions to metric labels on the
**Amazon Connect Customer** admin website (the product formerly called Amazon Connect).
Hover a column header such as **ACW**, **NPT**, **SL 60 secs** or **After contact work time**
and get the official AWS definition, metric type and category, calculation logic, API identifier,
and a link to the exact anchor in the AWS docs.

All definitions are generated from the AWS Administrator Guide page
[Metric definitions](https://docs.aws.amazon.com/connect/latest/adminguide/metrics-definitions.html)
and bundled with the extension. The extension makes **no network calls** at runtime and collects nothing.

## How it works

- `scripts/fetch-docs.ts` downloads the docs page in markdown form into `data/raw/`.
- `src/lib/parse-docs.ts` parses every `## Metric` entry into `src/data/metrics.json`, including the
  exact labels the docs say each metric uses on Real-time reports, Historical reports and Dashboards.
- `src/data/aliases.json` adds the few console labels the docs do not list verbatim (e.g. the
  Agents table column **Activity**).
- The content script (`src/content/`) watches the page with a `MutationObserver`, matches
  header-like elements (`th`, `[role=columnheader]`, headings) whose text equals a known label,
  tags them, and shows a shadow-DOM tooltip on hover or keyboard focus.
- Options let you switch to a broader "any short text" match mode, change the hover delay,
  hide the dotted underline, or expand calculation logic by default.

Supported hosts: `https://*.my.connect.aws/*` and `https://*.awsapps.com/connect/*`.

## Development

```bash
npm install
npm test            # parser, normalization, index and DOM matcher tests
npm run build       # type-check and build to dist/
```

Load it in Chrome: open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**,
and select the `dist/` folder. Rebuild and click the extension's reload button after changes
(`npm run dev` gives live reload while developing).

### Updating the metric definitions

```bash
npm run docs:update
```

This refetches the docs markdown and regenerates `src/data/metrics.json`. The build refuses to
write if the parsed metric count drops by more than 20 percent, which guards against a layout
change on the docs page. Commit both `data/raw/` and `src/data/metrics.json` so builds stay
reproducible. Pass `-- --all` to `npm run docs:fetch` to also pull the feature-specific metric pages
(Cases, bots, Contact Lens, evaluations, outbound campaigns, schedule adherence).

## Project layout

```
manifest.json            MV3 manifest (CRXJS resolves the TS/HTML entries)
scripts/                 docs fetch + build scripts
data/raw/                committed docs markdown snapshots + meta.json
src/data/                metrics.json (generated), aliases.json (hand-written), schema.ts
src/lib/                 parser, normalization, lookup index, settings
src/content/             content script: matcher, tooltip, markdown renderer, surface detection
src/options/, src/popup/ options page and toolbar popup
test/                    vitest suites and sanitized HTML fixtures from a live instance
```

## Known limitations

- Definitions reflect the docs snapshot date shown in the popup and tooltip footer. Updating
  requires rerunning `npm run docs:update` and rebuilding.
- Custom metrics defined in your instance are not in the AWS docs and get no tooltip.
- The console shows its own short native hint on some Real-time headers. The extension shows that
  hint at the top of its tooltip and adds the full definition below it.
- Dashboard widgets only render their tables when they have data, so labels in empty widgets
  cannot be matched until data appears.
