# Privacy Policy for Connect Paperclip

_Last updated: 18 October 2026_

Connect Paperclip is a Chrome extension that adds hover definitions and convenience links to the
Amazon Connect admin website. It is built to work entirely inside your browser.

## Summary

- The extension **does not collect, transmit, sell or share any data**. It makes no network
  requests of its own. Nothing you see or do in Amazon Connect ever leaves your browser because of
  this extension.
- All metric, column and permission definitions are **bundled with the extension**, copied from the
  public AWS documentation at build time. No documentation is fetched at run time.
- The only thing the extension stores is **its own settings**, described below.

## Where the extension runs

The extension runs only on Amazon Connect admin website pages, that is, pages whose hostname ends
in `.my.connect.aws`, or `.awsapps.com` pages under the `/connect/` path. It does nothing on any
other site.

## What the extension reads

To do its job the extension reads, in memory and only while a page is open:

- **Page content** on Amazon Connect admin pages: table headers, headings and picker labels, so it
  can show a definition when you hover one; and the flow selected in a flow editor block's
  settings panel, so it can add a link that opens that flow.

The extension reads only what is displayed on the page. It does not observe or intercept the
website's network traffic and never calls any Amazon Connect or AWS API.

This data is used only to render tooltips and links on the page you are viewing. It is not written
to disk, not stored in extension storage, and not sent anywhere.

## What the extension stores

The extension stores its user preferences using Chrome's extension storage (`chrome.storage.sync`):
whether it is enabled, the hover delay, whether matched labels are underlined, and whether flow
links are shown. If you are signed in to Chrome with sync enabled, Chrome may sync these preferences
across your devices under Google's own privacy policy. No other data is stored.

You can clear these preferences at any time by removing the extension.

## Permissions

| Permission | Why it is needed |
| --- | --- |
| `storage` | Save the preferences above. |
| Host access to `https://*.my.connect.aws/*` and `https://*.awsapps.com/*` | Run the content script on Amazon Connect admin pages. The extension has no access to any other website. |

## Third parties

The extension uses no analytics, no advertising, no crash reporting and no third-party services.
It includes no remote code.

## Chrome Web Store disclosures

Connect Paperclip's use of information read from the pages it runs on adheres to the
[Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq),
including the Limited Use requirements. The extension does not collect user data, so there is no
user data to transfer, sell or use for purposes unrelated to its single purpose.

## Changes

If this policy changes, the updated version will be published at this location in the project
repository and the date above will be revised.

## Contact

Questions about this policy can be raised by opening an issue at
<https://github.com/jspronk/connect-paperclip/issues>.

Connect Paperclip is an independent project and is not affiliated with, endorsed by or sponsored by
Amazon Web Services. Amazon Connect is a trademark of Amazon.com, Inc. or its affiliates.
