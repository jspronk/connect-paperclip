# Connect Paperclip

**Every Amazon Connect metric, explained the moment you need it.**

Amazon Connect reports on hundreds of metrics, and the column headers rarely explain themselves.
What exactly counts toward **ACW**? Is **AHT** measured from answer or from queue? Does
**Contacts abandoned** include callbacks? Today the answer means either remembering it, or stopping
what you are doing, opening the AWS documentation, and searching a page with hundreds of entries.

Connect Paperclip removes that step. Hover any metric, column header or permission in the Amazon
Connect admin website and the official AWS definition appears right where you are looking: what it
measures, how it is calculated, its type and category, its API name, and a link to the exact spot in
the AWS docs if you want to go deeper. No memorizing, no searching, no extra tabs.

### Why teams use it

- **Answers at your fingertips.** Over 600 definitions ship inside the extension: 260+ metrics, 200+
  contact record fields and 120+ security profile permissions, all taken directly from the AWS
  Administrator Guide.
- **Read reports with confidence.** Supervisors, analysts and new admins can interpret Real-time,
  Historical and Dashboard numbers correctly the first time, without guessing or asking someone.
- **Faster onboarding.** New team members learn the meaning of every column in context, while they
  work, instead of studying documentation up front.
- **Nothing to set up.** Install it and hover. There are no accounts, no API keys and no AWS
  permissions to grant.
- **Private by design.** Everything runs in your browser. The extension makes no network calls and
  collects no data. See [PRIVACY.md](PRIVACY.md).

### Where it works

| Area | What gets a definition on hover |
| --- | --- |
| Real-time metrics | Every metric column header |
| Historical metrics | Every metric column header |
| Dashboards | Widget column headers and the metric pickers in the widget editor |
| Contact search | Default and optional columns, from the contact record data model |
| Forecasting, Capacity planning, Scheduling | Column headers |
| Routing profiles | Channel settings, Queues and Manual assignment headers |
| Quick connects | List, detail and edit view headers and field labels |
| Security profiles | Every permission name, with all of its actions and API names |

### Bonus: jump between flows in one click

In the flow editor, blocks that point to another flow or module (Transfer to flow, Set customer
queue flow, Set hold flow, Set whisper flow, Invoke module and more) get an **Open flow ↗** link
that opens the referenced flow in a new tab, so you can follow a call path without hunting for it in
the flow list.

---

_Connect Paperclip is an independent project and is not affiliated with or endorsed by Amazon Web
Services. Definitions are bundled from the public AWS documentation and refreshed with each release;
the snapshot date is shown in the popup and in every tooltip._

## How it works

- `scripts/fetch-docs.ts` downloads the docs page in markdown form into `data/raw/`.
- `src/lib/parse-docs.ts` parses every `## Metric` entry into `src/data/metrics.json`, including the
  exact labels the docs say each metric uses on Real-time reports, Historical reports and Dashboards.
- `src/data/aliases.json` adds the few console labels the docs do not list verbatim (e.g. the
  Agents table column **Activity**). `src/data/dashboard-picker-aliases.json` maps the names used by
  the dashboard widget editor's metric pickers (**Actions → Edit → Metric N**), which spell metrics
  differently from both the docs and the dashboard columns ("Avg. handle time" for "AHT",
  "Agents in ACW" for "ACW contacts"). The matcher treats the picker's selected value and its
  dropdown options as candidates, and the tooltip sits beside an option in an open list.
  `scripts/propose-aliases.ts` takes a JSON list of console labels and proposes metrics for the
  ones that do not resolve, by spelling normalisation, for hand review.
- `src/lib/parse-security-profiles.ts` parses the
  [security profile permissions](https://docs.aws.amazon.com/connect/latest/adminguide/security-profile-list.html)
  tables into one entry per permission ("Routing profiles" lists its Create, Edit and View rows with
  their API names). The console's current spellings that differ from the docs (for example
  "Contact Lens data" for "Conversational analytics data") are mapped in `src/data/aliases.json`.
  Permission names are plain text rather than table headers, so that page uses a "loose" matching
  mode: any short text equal to one of the page's own labels, excluding navigation, links, buttons
  and form controls.
- `src/lib/parse-ctr.ts` parses the [contact record data model](https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html)
  page into one entry per field (`ContactTraceRecord.InitiationMethod`, `Agent.NumberOfHolds`, ...).
  `src/data/contact-search-columns.json` maps every Contact search column label to the field(s) that
  back it, with hand-written entries for the few console-only columns (Contact status, Contact
  duration, First contact flow, Is transferred out, Task template name) whose text comes from the
  Contact search docs page. `src/data/routing-profile-columns.json`, `src/data/quick-connect-columns.json`,
  `src/data/forecasting-columns.json`, `src/data/capacity-planning-columns.json` and
  `src/data/scheduling-columns.json` do the same for the routing profile editor, the Quick connects
  pages and the three Analytics and optimization pages; its labels are marked surface-only so
  generic words such as **Status** or **Channels** never match on other pages. The build picks up
  every `src/data/*-columns.json`.
- The content script (`src/content/`) watches the page with a `MutationObserver`, matches
  header-like elements (`th`, `[role=columnheader]`, headings) whose text equals a known label,
  tags them, and shows a shadow-DOM tooltip on hover or keyboard focus. It looks inside open shadow
  roots too, which the Contact search micro-frontend and the flow editor use.
- Only table headers, headings and header-like elements are ever matched, and calculation logic
  starts collapsed in the tooltip. Options let you change the hover delay, hide the dotted
  underline, or turn the flow editor links off.

### Open flow links in the flow editor

In the flow editor (`/contact-flows/edit`, `/flow-modules/edit`), a block's properties panel is a
tree of web components (`block-form` → `fe-section` → `attribute-wrapper` → `fe-select` →
`picasa-select`), each with its own shadow root. When a block setting holds a flow (Transfer to
flow's **Set manually**, Set customer queue flow, Set hold flow, and so on) the `picasa-select`
element's value is the flow ARN, so `src/content/features/flow-editor-links.ts` adds an
**Open flow ↗** link directly under that select, opening the flow in a new tab so the current draft
is untouched. The **Invoke module** block's "Module name" picker stores only the module id; the
extension builds the module ARN from the instance prefix of the flow being edited (the page's `id`
parameter) and links to `/flow-modules/edit?id=<module ARN>&tab=designer` as **Open flow module ↗**.
Note that a content script cannot read JavaScript properties set by the page's component classes,
so values are read from the reflected `value` attribute. A **Set dynamically** field holds an attribute reference, which cannot be resolved to
a flow; a link appears there only when the field literally contains a flow or flow-module ARN.
Values change without DOM mutations when a flow is picked, so the panel is also re-checked on a
short timer while the editor is open.

Supported hosts: `https://*.my.connect.aws/*` and `https://*.awsapps.com/connect/*`.

## Development

```bash
npm install
npm test            # parser, normalization, index and DOM matcher tests
npm run build       # type-check and build to dist/
```

The icons are rendered from `public/icons/icon.svg` with `npm run icons` (uses @resvg/resvg-js); the
PNGs are committed.

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
reproducible. `npm run docs:fetch -- --all` also pulls the feature-specific metric pages (metric
primitives, Cases, bots, Contact Lens, evaluations, outbound campaigns, schedule adherence); they
are committed too. Metrics those pages repeat from the main page are dropped at build time, with
any extra labels merged into the main entry, so a label shows one tooltip.

## Project layout

```
manifest.json            MV3 manifest (CRXJS resolves the TS/HTML entries)
scripts/                 docs fetch + build scripts
data/raw/                committed docs markdown snapshots + meta.json
src/data/                metrics.json (generated), aliases.json (hand-written), schema.ts
src/lib/                 parser, normalization, lookup index, settings
src/content/             content script entry, matcher, tooltip, markdown renderer, dom helpers
src/content/features/    metric-tooltips and flow-editor-links feature modules
src/options/, src/popup/ options page and toolbar popup
docs/                    store listing copy and 1280x800 listing screenshots
test/                    vitest suites and sanitized HTML fixtures from a live instance
```

## Privacy

The extension runs only on Amazon Connect admin pages, keeps everything in the browser and makes no
network requests of its own. See [PRIVACY.md](PRIVACY.md) for the full policy.

## Known limitations

- Definitions reflect the docs snapshot date shown in the popup and tooltip footer. Updating
  requires rerunning `npm run docs:update` and rebuilding.
- Custom metrics defined in your instance are not in the AWS docs and get no tooltip.
- On Contact search, the four video/screen-share duration columns have no documented contact record
  field yet and get no tooltip.
- In the dashboard widget editor, 165 of the 265 picker names seen on a live instance resolve.
  The rest have no entry on any fetched docs page: flow performance metrics (Avg. flow duration,
  Dropped, Transferred to queue, Flows started variants), campaign channel deliveries (Email, SMS,
  WhatsApp, Web notification, Voicemail), forecast and daily projection metrics, the "Evaluated …"
  outcome rates, "Percent online time" splits, and a few others.
- On the security profile editor, permissions that the docs page does not list yet (for example
  Conversational AI, Agentic CX designer, Test Cases, Staff calendar, Connect assistant, File
  attachments) get no tooltip.
- The console shows its own short native hint on some Real-time headers. The extension shows that
  hint at the top of its tooltip and adds the full definition below it.
- Dashboard widgets only render their tables when they have data, so labels in empty widgets
  cannot be matched until data appears.
