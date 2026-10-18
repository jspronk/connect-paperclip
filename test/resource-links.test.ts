// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  FLOW_ATTR,
  createMaps,
  decorate,
  digitsOf,
  editorUrl,
  handleMessage,
  isPhoneNumbersPage,
  pageConfig,
  resourceKey,
  undecorate,
  type FlowMaps,
  routingProfileUrl,
} from '../src/content/features/resource-links';

const html = readFileSync(path.join(__dirname, 'fixtures/phone-numbers-table.html'), 'utf8');
const emailHtml = readFileSync(path.join(__dirname, 'fixtures/email-addresses-table.html'), 'utf8');
const usersHtml = readFileSync(path.join(__dirname, 'fixtures/users-table.html'), 'utf8');
const EMAIL_1 = 'arn:aws:connect:us-west-2:111122223333:instance/00000000-0000-0000-0000-000000000001/email-address/e1';
const ORIGIN = 'https://alias.my.connect.aws';
const INSTANCE = 'arn:aws:connect:us-west-2:111122223333:instance/00000000-0000-0000-0000-000000000001';
const FLOW_A = `${INSTANCE}/contact-flow/6ab6d57c-25dc-4b53-9d0c-733350bbdc05`;
const FLOW_B = `${INSTANCE}/contact-flow/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`;
const PHONE_1 = 'arn:aws:connect:us-west-2:111122223333:phone-number/p1';
const PHONE_3 = 'arn:aws:connect:us-west-2:111122223333:phone-number/p3';

function mount(): ShadowRoot {
  document.body.innerHTML = '';
  const host = document.createElement('lily-number-website-ui');
  document.body.append(host);
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = html;
  return root;
}

function feed(maps: FlowMaps): void {
  handleMessage(maps, {
    source: 'connect-metrics-helper',
    type: 'phone-numbers',
    items: [
      { number: '+15550100001', arn: PHONE_1 },
      { number: '+15550100002', arn: 'arn:aws:connect:us-west-2:111122223333:phone-number/p2' },
      { number: '+15550100003', arn: PHONE_3 },
    ],
  });
  handleMessage(maps, {
    source: 'connect-metrics-helper',
    type: 'flow-associations',
    items: [
      { resourceArn: PHONE_1, flowArn: FLOW_A, resourceType: 'VOICE_PHONE_NUMBER' },
      { resourceArn: PHONE_3, flowArn: FLOW_B, resourceType: 'SMS_PHONE_NUMBER' },
    ],
  });
}

describe('flow-links helpers', () => {
  it('builds the editor URL the console uses', () => {
    expect(editorUrl(FLOW_A, ORIGIN)).toBe(
      `${ORIGIN}/contact-flows/edit?id=${encodeURIComponent(FLOW_A)}&tab=designer`,
    );
  });

  it('normalises phone numbers to digits', () => {
    expect(digitsOf('+1 555-010-0001')).toBe('15550100001');
  });

  it('only runs on the Phone numbers and Email addresses routes', () => {
    expect(isPhoneNumbersPage({ pathname: '/numbers' })).toBe(true);
    expect(isPhoneNumbersPage({ pathname: '/connect/numbers' })).toBe(true);
    expect(pageConfig({ pathname: '/email-addresses' })?.shadowHost).toBeUndefined();
    expect(pageConfig({ pathname: '/connect/email-addresses' })).toBeDefined();
    expect(pageConfig({ pathname: '/real-time-metrics' })).toBeUndefined();
    expect(isPhoneNumbersPage({ pathname: '/real-time-metrics' })).toBe(false);
  });

  it('normalises resource keys for phones and emails', () => {
    expect(resourceKey('+1 555-010-0001')).toBe('15550100001');
    expect(resourceKey(' DMV@Example.test ')).toBe('dmv@example.test');
  });

  it('ignores messages from other sources and reports changes', () => {
    const maps = createMaps();
    expect(handleMessage(maps, { source: 'someone-else', type: 'phone-numbers', items: [] })).toBe(false);
    expect(handleMessage(maps, 'nope')).toBe(false);
    expect(handleMessage(maps, { source: 'connect-metrics-helper', type: 'phone-numbers', items: [{ number: '+1 5', arn: 'x' }] })).toBe(true);
    expect(handleMessage(maps, { source: 'connect-metrics-helper', type: 'phone-numbers', items: [{ number: '+1 5', arn: 'x' }] })).toBe(false);
  });
});

describe('decorate on a shadow-rooted picasa table', () => {
  let root: ShadowRoot;
  beforeEach(() => {
    root = mount();
  });

  it('links flow names for rows whose number resolves to a flow, leaves others alone', () => {
    const maps = createMaps();
    feed(maps);
    expect(decorate(root, maps, ORIGIN)).toBe(2);
    const anchors = [...root.querySelectorAll<HTMLAnchorElement>(`a[${FLOW_ATTR}]`)];
    expect(anchors.map((a) => a.textContent)).toEqual(['DEMO-Bootstrap', 'QIC_ServiceDesk_Demo']);
    expect(anchors[0]!.getAttribute('href')).toBe(editorUrl(FLOW_A, ORIGIN));
    expect(anchors[1]!.getAttribute('href')).toBe(editorUrl(FLOW_B, ORIGIN));
    // Row 2 has no flow and stays plain.
    const rows = root.querySelectorAll('picasa-table-body picasa-table-row');
    expect(rows[1]!.querySelector('a')).toBeNull();
    // Header row untouched.
    expect(root.querySelector('picasa-table-head a')).toBeNull();
  });

  it('does nothing until both datasets have arrived, then links on the second pass', () => {
    const maps = createMaps();
    handleMessage(maps, {
      source: 'connect-metrics-helper',
      type: 'flow-associations',
      items: [{ resourceArn: PHONE_1, flowArn: FLOW_A, resourceType: 'VOICE_PHONE_NUMBER' }],
    });
    expect(decorate(root, maps, ORIGIN)).toBe(0);
    handleMessage(maps, { source: 'connect-metrics-helper', type: 'phone-numbers', items: [{ number: '+15550100001', arn: PHONE_1 }] });
    expect(decorate(root, maps, ORIGIN)).toBe(1);
  });

  it('is idempotent and re-links a cell the framework re-rendered', () => {
    const maps = createMaps();
    feed(maps);
    decorate(root, maps, ORIGIN);
    expect(decorate(root, maps, ORIGIN)).toBe(0);
    const cell = root.querySelectorAll('picasa-table-body picasa-table-row')[0]!.children[5]!;
    cell.textContent = 'DEMO-Bootstrap'; // framework replaced our anchor with text
    expect(decorate(root, maps, ORIGIN)).toBe(1);
    expect(cell.querySelector('a')?.textContent).toBe('DEMO-Bootstrap');
  });

  it('updates the href when the association changes', () => {
    const maps = createMaps();
    feed(maps);
    decorate(root, maps, ORIGIN);
    handleMessage(maps, {
      source: 'connect-metrics-helper',
      type: 'flow-associations',
      items: [{ resourceArn: PHONE_1, flowArn: FLOW_B, resourceType: 'VOICE_PHONE_NUMBER' }],
    });
    decorate(root, maps, ORIGIN);
    const a = root.querySelector<HTMLAnchorElement>(`a[${FLOW_ATTR}]`)!;
    expect(a.getAttribute('href')).toBe(editorUrl(FLOW_B, ORIGIN));
  });

  it('undecorate restores plain text', () => {
    const maps = createMaps();
    feed(maps);
    decorate(root, maps, ORIGIN);
    undecorate(root);
    expect(root.querySelector(`a[${FLOW_ATTR}]`)).toBeNull();
    expect(root.querySelectorAll('picasa-table-body picasa-table-row')[0]!.children[5]!.textContent).toBe('DEMO-Bootstrap');
  });
});

describe('decorate on a light-DOM Cloudscape Email addresses table', () => {
  beforeEach(() => {
    document.body.innerHTML = emailHtml;
  });

  it('links the Flow column by email address and leaves "-" cells alone', () => {
    const maps = createMaps();
    handleMessage(maps, {
      source: 'connect-metrics-helper',
      type: 'email-addresses',
      items: [{ address: 'DMV@example.test', arn: EMAIL_1 }],
    });
    handleMessage(maps, {
      source: 'connect-metrics-helper',
      type: 'flow-associations',
      items: [{ resourceArn: EMAIL_1, flowArn: FLOW_B, resourceType: 'INBOUND_EMAIL' }],
    });
    expect(decorate(document, maps, ORIGIN)).toBe(1);
    const a = document.querySelector<HTMLAnchorElement>(`a[${FLOW_ATTR}]`)!;
    expect(a.textContent).toBe('DEMO-DMV-Email_Inbound');
    expect(a.getAttribute('href')).toBe(editorUrl(FLOW_B, ORIGIN));
    // The anchor replaces the innermost wrapper's text, keeping the Cloudscape cell wrappers.
    expect(a.parentElement?.className).toBe('vaF4jlpXh265BjTcdd5QIw==');
    // Second row has no flow.
    expect(document.querySelectorAll('tbody tr')[1]!.querySelector(`a[${FLOW_ATTR}]`)).toBeNull();
    // The email address link in column 2 is not touched.
    expect(document.querySelectorAll('tbody tr')[0]!.querySelectorAll('a')).toHaveLength(2);
    expect(decorate(document, maps, ORIGIN)).toBe(0);
  });
});

describe('decorate on the User management table', () => {
  beforeEach(() => {
    document.body.innerHTML = usersHtml;
  });

  it('links Routing profile cells by username, falling back to the profile name', () => {
    const maps = createMaps();
    handleMessage(maps, {
      source: 'connect-metrics-helper',
      type: 'users',
      items: [
        { username: 'Agent.One@example.test', routingProfileId: '8d6ab8f5-690d-4853-962c-b0bbc363ae4d', routingProfileName: 'FUNC' },
        { username: 'agent.two@example.test', routingProfileId: '11111111-2222-3333-4444-555555555555', routingProfileName: 'Basic Routing Profile' },
      ],
    });
    expect(decorate(document, maps, ORIGIN)).toBe(3);
    const anchors = [...document.querySelectorAll<HTMLAnchorElement>(`a[${FLOW_ATTR}]`)];
    expect(anchors.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['FUNC', routingProfileUrl('8d6ab8f5-690d-4853-962c-b0bbc363ae4d', ORIGIN)],
      ['Basic Routing Profile', routingProfileUrl('11111111-2222-3333-4444-555555555555', ORIGIN)],
      // Third row's username is unknown; resolved through the profile name instead.
      ['FUNC', routingProfileUrl('8d6ab8f5-690d-4853-962c-b0bbc363ae4d', ORIGIN)],
    ]);
    expect(anchors[0]!.title).toBe('Open this routing profile');
    // Username links and other cells are untouched.
    expect(document.querySelectorAll('tbody tr')[0]!.querySelectorAll('a')).toHaveLength(2);
    expect(decorate(document, maps, ORIGIN)).toBe(0);
  });

  it('only activates on the users route among the new pages', () => {
    expect(pageConfig({ pathname: '/users' })).toBeDefined();
    expect(pageConfig({ pathname: '/users/4aefa550' })).toBeDefined();
    expect(pageConfig({ pathname: '/user-management' })).toBeUndefined();
  });
});
