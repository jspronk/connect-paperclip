import metricsJson from '../data/metrics.json';
import type { MetricsData } from '../data/schema';
import { loadSettings, saveSettings, type Settings } from '../lib/settings';

const form = document.getElementById('form') as HTMLFormElement;
const status = document.getElementById('status') as HTMLParagraphElement;
const dataEl = document.getElementById('data') as HTMLParagraphElement;

function fill(settings: Settings): void {
  (form.elements.namedItem('enabled') as HTMLInputElement).checked = settings.enabled;
  (form.elements.namedItem('underline') as HTMLInputElement).checked = settings.underline;
  (form.elements.namedItem('flowLinks') as HTMLInputElement).checked = settings.flowLinks;
  (form.elements.namedItem('hoverDelay') as HTMLInputElement).value = String(settings.hoverDelay);
}

function read(): Partial<Settings> {
  const fd = new FormData(form);
  const delay = Number(fd.get('hoverDelay'));
  return {
    enabled: fd.get('enabled') === 'on',
    underline: fd.get('underline') === 'on',
    flowLinks: fd.get('flowLinks') === 'on',
    hoverDelay: Number.isFinite(delay) ? Math.min(3000, Math.max(0, delay)) : 350,
  };
}

let saveTimer: number | undefined;
form.addEventListener('change', () => {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(async () => {
    await saveSettings(read());
    status.textContent = 'Saved.';
    window.setTimeout(() => (status.textContent = ''), 1500);
  }, 150);
});

const data = metricsJson as MetricsData;
const labels = data.metrics.reduce((n, m) => n + m.uiLabels.length, 0);
dataEl.textContent = `${data.metrics.length} metrics and ${labels} on-page labels, synced from the AWS docs on ${data.generatedAt.slice(0, 10)}.`;

loadSettings().then(fill).catch(console.error);
