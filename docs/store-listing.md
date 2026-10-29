# Chrome Web Store listing copy

Paste-ready text for the Chrome Web Store developer dashboard. The store renders the detailed
description as plain text, so it uses simple line breaks and bullets only.

## Name

```
Connect Paperclip
```

## Summary (manifest description, 132 characters max)

```
Stop memorizing or looking up Amazon Connect metrics. Hover any metric, column or permission to see its official AWS definition.
```

## Category

Workflow & Planning (alternative: Developer Tools)

## Detailed description

```
Every Amazon Connect metric, explained the moment you need it.

Amazon Connect reports on hundreds of metrics, and the column headers rarely explain themselves. What exactly counts toward ACW? How is Service level calculated? What is the difference between Contacts handled and Contacts handled incoming?

Until now, getting the answer meant one of two things: remembering hundreds of definitions, or stopping what you are doing, opening the AWS documentation in another tab, and searching a very long page.

Connect Paperclip removes that step entirely. Hover any metric, column header or permission in the Amazon Connect admin website and the official AWS definition appears right where you are looking. No memorizing. No searching. No extra tabs.

WHAT YOU SEE ON HOVER
• A plain-language definition of the metric, column or permission
• How it is calculated, ready to expand when you need the detail
• Metric type, category and API identifier
• A direct link to the exact entry in the AWS Administrator Guide

OVER 600 DEFINITIONS, BUILT IN
• 260+ real-time, historical and dashboard metrics
• 200+ contact record fields for Contact search
• 120+ security profile permissions, with every action and API name
• Column definitions for Forecasting, Capacity planning, Scheduling, Routing profiles and Quick connects
All content comes directly from the official AWS documentation and ships inside the extension.

WHERE IT WORKS
• Real-time metrics reports
• Historical metrics reports
• Dashboards, including the metric pickers in the widget editor
• Contact search
• Forecasting, Capacity planning and Scheduling
• Routing profile editor
• Quick connects
• Security profile editor

BONUS: FOLLOW YOUR FLOWS IN ONE CLICK
In the flow editor, blocks that reference another flow or module (Transfer to flow, Set customer queue flow, Set hold flow, Set whisper flow, Set disconnect flow, Set event flow and Invoke module) get an "Open flow" link that opens the referenced flow in a new tab.

WHO IT IS FOR
• Supervisors who need to read real-time and historical numbers correctly, right now
• Analysts building dashboards and reports who want every metric choice to be the right one
• Administrators configuring routing profiles, quick connects and security permissions
• New team members learning Amazon Connect on the job, in context

PRIVATE BY DESIGN
Connect Paperclip runs entirely in your browser. It makes no network requests, calls no AWS APIs, needs no AWS credentials or permissions, and collects no data. It only runs on Amazon Connect admin pages.

SIMPLE TO USE
Install it, open your Amazon Connect admin website, and hover. Options let you adjust the hover delay, hide the dotted underline on matched labels, or turn the flow links off.

Connect Paperclip is an independent project and is not affiliated with, endorsed by or sponsored by Amazon Web Services. Amazon Connect is a trademark of Amazon.com, Inc. or its affiliates.
```

## Single purpose

```
Shows the official AWS documentation definition when the user hovers a metric, column or permission name on the Amazon Connect admin website, and adds links that open referenced flows in the flow editor.
```

## Screenshots

1280×800 images in [docs/screenshots](screenshots/). Suggested captions, in upload order:

| File | Caption |
| --- | --- |
| `realtime-metrics.jpg` | Hover any Real-time metric for its official definition |
| `scheduling.jpg` | Scheduling, Forecasting and Capacity planning columns explained |
| `sec-permissions.jpg` | Every security profile permission, with its actions and API names |

## Links

- Privacy policy: https://github.com/jspronk/connect-paperclip/blob/main/PRIVACY.md
- Homepage and support: https://github.com/jspronk/connect-paperclip
