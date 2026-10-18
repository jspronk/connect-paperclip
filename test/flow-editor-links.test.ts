// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { EDITOR_LINK_ATTR, decorateEditor, editorUrlForArn, isFlowEditorPage, undecorateEditor } from '../src/content/features/flow-editor-links';

const ORIGIN = 'https://alias.my.connect.aws';
const FLOW = 'arn:aws:connect:us-west-2:111122223333:instance/00000000-0000-0000-0000-000000000001/contact-flow/1e47c663-7f87-42a8-8958-f2c205cc6f2a';
const MODULE = 'arn:aws:connect:us-west-2:111122223333:instance/00000000-0000-0000-0000-000000000001/flow-module/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

/** Mimic the editor: block-form > (shadow) fe-section > (shadow) attribute-wrapper > (shadow) fe-aggregate > fe-select > picasa-select. */
function mount(): { wrapperRoot: ShadowRoot; select: HTMLElement & { value: string }; dyn: HTMLInputElement } {
  document.body.innerHTML = '';
  const form = document.createElement('block-form');
  document.body.append(form);
  const formRoot = form.attachShadow({ mode: 'open' });
  const section = document.createElement('fe-section');
  formRoot.append(section);
  const sectionRoot = section.attachShadow({ mode: 'open' });
  const wrapper = document.createElement('attribute-wrapper');
  sectionRoot.append(wrapper);
  const wrapperRoot = wrapper.attachShadow({ mode: 'open' });
  wrapperRoot.innerHTML = `
    <div class="radio-group-wrapper">
      <label><input type="radio" value="static" checked /> Set manually</label>
      <fe-aggregate><fe-select><picasa-select label="Select a flow"></picasa-select></fe-select></fe-aggregate>
      <label><input type="radio" value="dynamic" /> Set dynamically</label>
      <fe-aggregate class="dyn"><fe-input><picasa-input></picasa-input></fe-input></fe-aggregate>
    </div>`;
  const el = wrapperRoot.querySelector('picasa-select') as HTMLElement;
  // The real picasa-select reflects its value as a DOM attribute (its JS property is invisible to a
  // content script) and may mirror it into an <input> inside a nested shadow root.
  const selShadow = el.attachShadow({ mode: 'open' });
  selShadow.innerHTML = '<div class="mdc"><input type="text" /></div>';
  const mirror = selShadow.querySelector('input')!;
  const select = el as HTMLElement & { value: string };
  Object.defineProperty(select, 'value', {
    get: () => el.getAttribute('value') ?? '',
    set: (v: string) => {
      el.setAttribute('value', v);
      mirror.value = v;
    },
    configurable: true,
  });
  select.value = '';
  const pi = wrapperRoot.querySelector('picasa-input')!;
  const piShadow = pi.attachShadow({ mode: 'open' });
  piShadow.innerHTML = '<div class="mdc"><input type="text" placeholder="Attribute key" /></div>';
  const dyn = piShadow.querySelector('input')!;
  return { wrapperRoot, select, dyn };
}

describe('flow editor links', () => {
  it('recognises the editor routes and builds editor urls for flows and modules', () => {
    expect(isFlowEditorPage({ pathname: '/contact-flows/edit' })).toBe(true);
    expect(isFlowEditorPage({ pathname: '/flow-modules/edit' })).toBe(true);
    expect(isFlowEditorPage({ pathname: '/contact-flows' })).toBe(false);
    expect(editorUrlForArn(FLOW, ORIGIN)).toBe(`${ORIGIN}/contact-flows/edit?id=${encodeURIComponent(FLOW)}&tab=designer`);
    expect(editorUrlForArn(MODULE, ORIGIN)).toBe(`${ORIGIN}/flow-modules/edit?id=${encodeURIComponent(MODULE)}&tab=designer`);
    expect(editorUrlForArn('$.Attributes.NextFlow', ORIGIN)).toBeUndefined();
  });

  let m: ReturnType<typeof mount>;
  beforeEach(() => {
    m = mount();
  });

  it('adds nothing while no flow is selected, then links the selected flow after its field wrapper', () => {
    expect(decorateEditor(document, ORIGIN)).toBe(0);
    m.select.value = FLOW;
    expect(decorateEditor(document, ORIGIN)).toBe(1);
    const a = m.wrapperRoot.querySelector<HTMLAnchorElement>(`a[${EDITOR_LINK_ATTR}]`)!;
    expect(a.getAttribute('href')).toBe(editorUrlForArn(FLOW, ORIGIN));
    expect(a.target).toBe('_blank');
    expect(a.textContent).toBe('Open flow ↗');
    // Placed right after the select's fe-select wrapper (inside its fe-aggregate group), in the same shadow root.
    expect(a.previousElementSibling?.tagName.toLowerCase()).toBe('fe-select');
    expect(a.parentElement?.tagName.toLowerCase()).toBe('fe-aggregate');
    expect(m.wrapperRoot.getElementById('cmh-editor-link-style')).not.toBeNull();
    expect(decorateEditor(document, ORIGIN)).toBe(0);
  });

  it('follows value changes and removes the link when the value is no longer a flow', () => {
    m.select.value = FLOW;
    decorateEditor(document, ORIGIN);
    m.select.value = MODULE;
    decorateEditor(document, ORIGIN);
    const a = m.wrapperRoot.querySelector<HTMLAnchorElement>(`a[${EDITOR_LINK_ATTR}]`)!;
    expect(a.getAttribute('href')).toContain('/flow-modules/edit');
    m.select.value = '';
    decorateEditor(document, ORIGIN);
    expect(m.wrapperRoot.querySelector(`a[${EDITOR_LINK_ATTR}]`)).toBeNull();
  });

  it('links a dynamic text field only when it literally holds a flow ARN', () => {
    m.dyn.value = '$.Attributes.NextFlow';
    expect(decorateEditor(document, ORIGIN)).toBe(0);
    m.dyn.value = FLOW;
    expect(decorateEditor(document, ORIGIN)).toBe(1);
    const a = m.wrapperRoot.querySelector<HTMLAnchorElement>(`a[${EDITOR_LINK_ATTR}]`)!;
    expect(a.previousElementSibling?.tagName.toLowerCase()).toBe('fe-input');
    expect(a.parentElement?.className).toBe('dyn');
    undecorateEditor(document);
    expect(m.wrapperRoot.querySelector(`a[${EDITOR_LINK_ATTR}]`)).toBeNull();
  });
});
