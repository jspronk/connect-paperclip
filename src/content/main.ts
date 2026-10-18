import { loadSettings, onSettingsChanged, type Settings } from '../lib/settings';
import type { FeatureContext } from './features/context';
import { startFlowLinks } from './features/flow-links';
import { startMetricTooltips } from './features/metric-tooltips';
import { isConnectAdminPage } from './surface';

const LOG = '[connect-metrics-helper]';

async function main(): Promise<void> {
  if (!isConnectAdminPage()) return;

  const settings = await loadSettings();
  const listeners: Array<(s: Settings) => void> = [];
  onSettingsChanged((next) => listeners.forEach((cb) => cb(next)));
  const ctx: FeatureContext = {
    settings,
    onSettings: (cb) => listeners.push(cb),
  };

  startMetricTooltips(ctx);
  startFlowLinks(ctx);
}

main().catch((err) => console.error(LOG, err));
