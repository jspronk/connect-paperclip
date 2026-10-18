import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseCtrMarkdown } from '../src/lib/parse-ctr';

const md = readFileSync(path.join(__dirname, 'fixtures/sample-ctr.md'), 'utf8');
const { metrics, warnings } = parseCtrMarkdown(md, 'ctr-data-model');
const byId = Object.fromEntries(metrics.map((m) => [m.id, m]));

describe('parseCtrMarkdown', () => {
  it('extracts fields per section, skipping callouts and non-model sections', () => {
    expect(Object.keys(byId).sort()).toEqual([
      'ctr-data-model#Agent.AgentInteractionDuration',
      'ctr-data-model#Agent.ConnectedToAgentTimestamp',
      'ctr-data-model#ContactTraceRecord.Channel',
      'ctr-data-model#ContactTraceRecord.InitiationMethod',
      'ctr-data-model#ContactTraceRecord.Queue',
    ]);
    expect(warnings).toEqual([]);
  });

  it('uses inline field anchors when present and the section anchor otherwise', () => {
    const aid = byId['ctr-data-model#Agent.AgentInteractionDuration']!;
    expect(aid.name).toBe('Agent.AgentInteractionDuration');
    expect(aid.anchor).toBe('AgentInteractionDuration-CTR');
    expect(aid.docsUrl).toBe('https://docs.aws.amazon.com/connect/latest/adminguide/ctr-data-model.html#AgentInteractionDuration-CTR');
    expect(aid.summary).toBe('The time, in whole seconds, that an agent interacted with a customer.');
    expect(aid.description).toContain('agent pause duration');
    expect(aid.metricType).toBe('Integer');
    expect(aid.extraSections).toEqual({ 'Min value': '0' });
    expect(byId['ctr-data-model#Agent.ConnectedToAgentTimestamp']!.anchor).toBe('ctr-Agent');
  });

  it('keeps inline valid values and bullet-list valid values', () => {
    expect(byId['ctr-data-model#ContactTraceRecord.Channel']!.extraSections['Valid values']).toBe('`VOICE`, `CHAT`, `TASK`, `EMAIL`');
    const im = byId['ctr-data-model#ContactTraceRecord.InitiationMethod']!;
    expect(im.extraSections['Valid values']).toContain('`INBOUND`');
    expect(im.extraSections['Valid values']).toContain('`OUTBOUND`');
    expect(im.summary).toMatch(/^Indicates how the contact was initiated\./);
    expect(im.metricCategory).toBe('Contact record field (ContactTraceRecord)');
  });

  it('plain-texts markdown links in types', () => {
    expect(byId['ctr-data-model#ContactTraceRecord.Queue']!.metricType).toBe('QueueInfo');
  });
});
