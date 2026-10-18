import type { Settings } from '../../lib/settings';

/** What main.ts hands to each feature. */
export interface FeatureContext {
  /** Settings at start-up. Features keep their own copy and update it via onSettings. */
  settings: Settings;
  onSettings(cb: (next: Settings) => void): void;
}
