# Connect Metrics Helper

A Chrome extension (Manifest V3) that adds hover definitions to metric labels on the
**Amazon Connect Customer** admin website (the product formerly called Amazon Connect).
Hover a column header such as **ACW**, **NPT**, **SL 60 secs** or **After contact work time**
and get the official AWS definition, metric type and category, calculation logic, API identifier,
and a link to the exact anchor in the AWS docs. On the **Contact search** page the column headers
(default and optional) are explained from the contact record data model, and on the **routing
profile editor** the Channel settings, Queues and Manual assignment headers are explained from the
"Create a routing profile" guide.

All definitions are generated from the AWS Administrator Guide page
[Metric definitions](https://docs.aws.amazon.com/connect/latest/adminguide/metrics-definitions.html)
and bundled with the extension. The extension makes **no network calls of its own** at runtime and
collects nothing.

It also turns the **Contact flow/IVR** column on the **Phone numbers** page and the **Flow** column
on the **Email addresses** page into links that open each flow in the flow editor
(`/contact-flows/edit?id=<flow ARN>&tab=designer`), and the **Routing profile** column on the
**User management** page into links to the routing profile editor
(`/routing-profiles/edit?id=<routing profile id>`).

## How it works

- `scripts/fetch-docs.ts` downloads the docs page in markdown form into `data/raw/`.
- `src/lib/parse-docs.ts` parses every `## Metric` entry into `src/data/metrics.json`, including the
  exact labels the docs say each metric uses on Real-time reports, Historical reports and Dashboards.
- `src/data/aliases.json` adds the few console labels the docs do not list verbatim (e.g. the
  Agents table column **Activity**).
- `src/lib/parse-ctr.ts` parses the [contact record data model](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html)
  page into one entry per field (`ContactTraceRecord.InitiationMethod`, `Agent.NumberOfHolds`, ...).
  `src/data/contact-search-columns.json` maps every Contact search column label to the field(s) that
  back it, with hand-written entries for the few console-only columns (Contact status, Contact
  duration, First contact flow, Is transferred out, Task template name) whose text comes from the
  Contact search docs page. `src/data/routing-profile-columns.json` does the same for the routing
  profile editor with text from the routing profile guide; its labels are marked surface-only so
  generic words such as **Status** or **Channels** never match on other pages. The build picks up
  every `src/data/*-columns.json`.
- The content script (`src/content/`) watches the page with a `MutationObserver`, matches
  header-like elements (`th`, `[role=columnheader]`, headings) whose text equals a known label,
  tags them, and shows a shadow-DOM tooltip on hover or keyboard focus. It looks inside open shadow
  roots too, which the Contact search and Phone numbers micro-frontends use.
- Options let you switch to a broader "any short text" match mode, change the hover delay,
  hide the dotted underline, expand calculation logic by default, or turn the flow links off.

### Resource links on list pages (flows, routing profiles)

The list tables show names, not IDs or ARNs, and the console's internal endpoints reject requests
that do not come from the page itself. So `public/capture.js` runs in the page's own JavaScript
world (manifest `world: "MAIN"`, `document_start`), wraps `window.fetch` and `XMLHttpRequest`, and
when the page receives its phone-number list, email-address search, user search or
flow-association responses it forwards only the pairs needed for linking (resource/ARN,
resource-ARN/flow-ARN, username/routing-profile-id) to the content script via `window.postMessage`.
Responses are never altered and nothing leaves the page.
`src/content/features/resource-links.ts` listens for those messages, works out each row's identity
from its other cells (phone digits, email address, or the row's primary link such as a username),
and wraps the cell text with a real anchor, so normal clicks, ctrl-clicks and middle-clicks all
behave like any other console link. The Phone numbers table lives in an open shadow root
(`<lily-number-website-ui>`), which `src/content/dom.ts` handles; Email addresses and User
management are light-DOM Cloudscape tables. Adding another page is an entry in `PAGES`, another
column is an entry in `COLUMNS` with its header pattern and href resolver, plus, if needed, a new
endpoint in `capture.js`.

`capture.js` is deliberately a plain static file: the bundler's content-script loader is
asynchronous and would race the page's first requests. A small plugin in `vite.config.ts` appends
its manifest entry after the build.

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
src/content/             content script entry, matcher, tooltip, markdown renderer, dom helpers
src/content/features/    metric-tooltips and resource-links feature modules
public/capture.js        page-world fetch/XHR capture for the link pages (static, unbundled)
src/options/, src/popup/ options page and toolbar popup
test/                    vitest suites and sanitized HTML fixtures from a live instance
```

## Known limitations

- Definitions reflect the docs snapshot date shown in the popup and tooltip footer. Updating
  requires rerunning `npm run docs:update` and rebuilding.
- Custom metrics defined in your instance are not in the AWS docs and get no tooltip.
- On Contact search, the four video/screen-share duration columns have no documented contact record
  field yet and get no tooltip.
- The console shows its own short native hint on some Real-time headers. The extension shows that
  hint at the top of its tooltip and adds the full definition below it.
- Dashboard widgets only render their tables when they have data, so labels in empty widgets
  cannot be matched until data appears.
