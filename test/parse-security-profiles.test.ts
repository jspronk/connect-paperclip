import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseSecurityProfilesMarkdown } from '../src/lib/parse-security-profiles';

const md = readFileSync(path.join(__dirname, 'fixtures/sample-security-profiles.md'), 'utf8');
const { metrics, warnings } = parseSecurityProfilesMarkdown(md, 'security-profile-list');
const byName = Object.fromEntries(metrics.map((m) => [m.name, m]));

describe('parseSecurityProfilesMarkdown', () => {
  it('groups "<permission> - <action>" rows into one entry per permission', () => {
    expect(metrics.map((m) => m.name).sort()).toEqual(['AI agents', 'AnalyticsConnectors', 'Hours of operation', 'Queues', 'Routing profiles']);
    expect(warnings).toEqual([]);
    const rp = byName['Routing profiles']!;
    expect(rp.id).toBe('security-profile-list#routing.routingprofiles');
    expect(rp.docsUrl).toBe('https://docs.aws.amazon.com/connect/latest/adminguide/security-profile-list.html#routing-permissions-list');
    expect(rp.summary).toBe('Routing permission: Create, Edit, View.');
    expect(rp.description.split('\n')).toEqual([
      '+ **Create**: [Create routing profiles](routing-profiles.md). (`RoutingPolicies.Create`)',
      '+ **Edit**: Edit routing profiles. (`RoutingPolicies.Edit`)',
      '+ **View**: View routing profiles. (`RoutingPolicies.View`)',
    ]);
    expect(rp.uiLabels).toEqual([{ surface: 'securityprofile', label: 'Routing profiles', surfaceOnly: true }]);
    expect(rp.metricCategory).toBe('Security profile permission (Routing)');
  });

  it('merges spelling variants and tolerates missing spaces around the dash', () => {
    const ho = byName['Hours of operation']!;
    expect(ho.description.split('\n')).toHaveLength(2);
    expect(byName['Queues']!.description).toContain('**Enable / Disable**');
    expect(byName['AnalyticsConnectors']!.description).toContain('**Edit**');
  });

  it('keeps bare permissions with several API names as a single bullet', () => {
    const ai = byName['AI agents']!;
    expect(ai.summary).toBe('Create and manage AI agents.');
    expect(ai.description).toBe('+ Create and manage AI agents. (`QConnectAIAgents.View`, `QConnectAIAgents.Edit`)');
  });
});
