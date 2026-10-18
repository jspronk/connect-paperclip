import metricsJson from '../data/metrics.json';
import type { MetricsData } from '../data/schema';
import { loadSettings, saveSettings } from '../lib/settings';

const data = metricsJson as MetricsData;
const $ = (id: string): HTMLElement => document.getElementById(id) as HTMLElement;

$('count').textContent = String(data.metrics.length);
$('labels').textContent = String(data.metrics.reduce((n, m) => n + m.uiLabels.length, 0));
$('synced').textContent = data.generatedAt.slice(0, 10);

const enabled = $('enabled') as HTMLInputElement;
loadSettings()
  .then((s) => (enabled.checked = s.enabled))
  .catch(console.error);
enabled.addEventListener('change', () => void saveSettings({ enabled: enabled.checked }));

$('options').addEventListener('click', () => void chrome.runtime.openOptionsPage());
