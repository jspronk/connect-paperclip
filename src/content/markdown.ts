/**
 * Minimal, allow-listed markdown renderer for docs snippets: paragraphs, nested "+"/"-"/"*" bullets,
 * bold, italic, inline code, links and backslash escapes. Everything else is rendered as text.
 */
const DOCS_BASE = 'https://docs.aws.amazon.com/connect/latest/adminguide/';

export function renderMarkdown(md: string, currentPage = 'metrics-definitions'): DocumentFragment {
  const frag = document.createDocumentFragment();
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let para: string[] = [];
  let listStack: { ul: HTMLUListElement; indent: number }[] = [];

  const flushPara = (): void => {
    if (!para.length) return;
    const p = document.createElement('p');
    p.append(renderInline(para.join(' '), currentPage));
    frag.append(p);
    para = [];
  };
  const closeLists = (): void => {
    listStack = [];
  };

  for (const raw of lines) {
    const bullet = /^(\s*)[+*-]\s+(.*)$/.exec(raw);
    if (bullet) {
      flushPara();
      const indent = (bullet[1] ?? '').length;
      while (listStack.length && listStack[listStack.length - 1]!.indent > indent) listStack.pop();
      let top = listStack[listStack.length - 1];
      if (!top || top.indent < indent) {
        const ul = document.createElement('ul');
        if (top) {
          const lastLi = top.ul.lastElementChild ?? top.ul.appendChild(document.createElement('li'));
          lastLi.append(ul);
        } else {
          frag.append(ul);
        }
        top = { ul, indent };
        listStack.push(top);
      }
      const li = document.createElement('li');
      li.append(renderInline(bullet[2] ?? '', currentPage));
      top.ul.append(li);
      continue;
    }
    if (!raw.trim()) {
      flushPara();
      closeLists();
      continue;
    }
    if (listStack.length && /^\s{2,}/.test(raw)) {
      // continuation of the previous bullet
      const top = listStack[listStack.length - 1]!;
      const li = top.ul.lastElementChild;
      if (li) {
        li.append(' ', renderInline(raw.trim(), currentPage));
        continue;
      }
    }
    closeLists();
    para.push(raw.trim());
  }
  flushPara();
  return frag;
}

const INLINE = /(\[([^\]]+)\]\(([^)\s]+)\))|(`([^`]+)`)|(\*\*([^*]+)\*\*)|((?:^|(?<=\s|\())\*([^*\s][^*]*?)\*(?=[\s).,;:]|$))/g;

export function renderInline(text: string, currentPage: string): DocumentFragment {
  const frag = document.createDocumentFragment();
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) frag.append(unescape(text.slice(last, start)));
    if (m[1]) {
      const a = document.createElement('a');
      a.textContent = unescape(m[2] ?? '');
      a.href = resolveDocsLink(m[3] ?? '', currentPage);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      frag.append(a);
    } else if (m[4]) {
      const code = document.createElement('code');
      code.textContent = unescape(m[5] ?? '');
      frag.append(code);
    } else if (m[6]) {
      const b = document.createElement('strong');
      b.textContent = unescape(m[7] ?? '');
      frag.append(b);
    } else if (m[8]) {
      const i = document.createElement('em');
      i.textContent = unescape(m[9] ?? '');
      frag.append(i);
    }
    last = start + m[0].length;
  }
  if (last < text.length) frag.append(unescape(text.slice(last)));
  return frag;
}

export function resolveDocsLink(href: string, currentPage: string): string {
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('#')) return `${DOCS_BASE}${currentPage}.html${href}`;
  const m = /^([a-z0-9-]+)\.md(#.*)?$/i.exec(href);
  if (m) return `${DOCS_BASE}${m[1]}.html${m[2] ?? ''}`;
  return `${DOCS_BASE}${href}`;
}

function unescape(s: string): string {
  return s.replace(/\\([\\`*_{}[\]()#+\-.!>])/g, '$1');
}
