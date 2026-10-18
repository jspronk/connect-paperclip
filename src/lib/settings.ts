/** User settings stored in chrome.storage.sync, shared by content script, options and popup. */

export type MatchMode = 'headers' | 'any';

export interface Settings {
  enabled: boolean;
  /** Milliseconds before the tooltip opens on hover. */
  hoverDelay: number;
  /** Dotted underline on matched labels. */
  underline: boolean;
  /** Show calculation logic expanded by default. */
  expandCalc: boolean;
  /**
   * "headers": only table headers, headings and header-like elements are matched (default).
   * "any": any short text element is matched. Broader, more false positives.
   */
  matchMode: MatchMode;
  /** Link flow names on the Phone numbers page to the flow editor. */
  flowLinks: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  hoverDelay: 350,
  underline: true,
  expandCalc: false,
  matchMode: 'headers',
  flowLinks: true,
};

const KEY = 'settings';

function storage(): typeof chrome.storage | undefined {
  try {
    return typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : undefined;
  } catch {
    return undefined;
  }
}

export async function loadSettings(): Promise<Settings> {
  const st = storage();
  if (!st) return { ...DEFAULT_SETTINGS };
  try {
    const stored = await st.sync.get(KEY);
    return { ...DEFAULT_SETTINGS, ...((stored[KEY] as Partial<Settings> | undefined) ?? {}) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await loadSettings();
  const next = { ...current, ...patch };
  await storage()?.sync.set({ [KEY]: next });
  return next;
}

export function onSettingsChanged(cb: (settings: Settings) => void): void {
  const st = storage();
  if (!st) return;
  st.onChanged.addListener((changes, area) => {
    if (area !== 'sync' || !changes[KEY]) return;
    cb({ ...DEFAULT_SETTINGS, ...((changes[KEY].newValue as Partial<Settings> | undefined) ?? {}) });
  });
}
