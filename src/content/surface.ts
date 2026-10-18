import type { PageSurface } from '../lib/index';

/**
 * Guess which reporting surface the current admin-website route is.
 * Path fragments are deliberately loose; they get tightened once verified against a live instance.
 */
const RULES: Array<{ test: RegExp; surface: PageSurface }> = [
  { test: /contact-?search/i, surface: 'contactsearch' },
  { test: /routing-?profiles/i, surface: 'routingprofile' },
  { test: /transfer-dests|quick-?connects/i, surface: 'quickconnect' },
  { test: /security-?profiles/i, surface: 'securityprofile' },
  { test: /real-?time/i, surface: 'realtime' },
  { test: /historical/i, surface: 'historical' },
  { test: /dashboard|analytics/i, surface: 'dashboard' },
];

export function detectSurface(loc: Pick<Location, 'pathname' | 'hash' | 'search'> = location, doc: Document = document): PageSurface {
  const haystacks = [loc.pathname, loc.hash, loc.search, doc.title, headingText(doc)];
  for (const h of haystacks) {
    for (const r of RULES) if (r.test.test(h)) return r.surface;
  }
  return 'unknown';
}

function headingText(doc: Document): string {
  const h = doc.querySelector('h1, [role="heading"][aria-level="1"]');
  return h?.textContent?.trim() ?? '';
}

/** True when this page belongs to the Connect admin website and the script should run. */
export function isConnectAdminPage(loc: Pick<Location, 'hostname' | 'pathname'> = location): boolean {
  if (/\.my\.connect\.aws$/i.test(loc.hostname)) return true;
  if (/\.awsapps\.com$/i.test(loc.hostname)) return /^\/connect(\/|$)/.test(loc.pathname);
  return false;
}
