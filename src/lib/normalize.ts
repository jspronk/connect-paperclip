/**
 * Label normalization shared by the docs parser (build time) and the content script (runtime).
 * Both sides must agree exactly, so keep this module dependency-free.
 */

/** Characters Chrome/Connect may append to a header label: sort arrows, asterisks, info glyphs. */
const TRAILING_GLYPHS = /[\s*▲▼↑↓⇅⬆⬇ⓘ•·:]+$/u;
const LEADING_GLYPHS = /^[\s*•·]+/u;

export function normalizeLabel(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/[‐-―−]/g, '-') // dashes
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/ /g, ' ')
    .replace(LEADING_GLYPHS, '')
    .replace(TRAILING_GLYPHS, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Strip markdown emphasis, inline code, links and escapes, leaving plain text. */
export function markdownToPlain(md: string): string {
  return md
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/<a\s+name="[^"]*"><\/a>/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:]|$)/g, '$1$2') // *italic*
    .replace(/\\([\\`*_{}[\]()#+\-.!>])/g, '$1') // markdown escapes
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convert a templated docs label such as "SL *X*" or "Contacts answered in X seconds" into a
 * normalized anchored regex source. Returns undefined when the label has no template token.
 */
export function labelToPattern(label: string): string | undefined {
  const plain = markdownToPlain(label);
  if (!/(^|\s)X(\s|$)/.test(plain)) return undefined;
  // "X" stands for a number; the console may append a unit ("SL 60 secs"), and when the docs label
  // itself ends in "seconds" the console may omit or abbreviate it.
  const src = normalizeLabel(plain)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/(^|\s)x(?=\s|$)/g, '$1<<X>>')
    .replace(/<<X>> (?:secs?|seconds?)(?=\s|$)/g, '<<X>>')
    .replace(/<<X>>/g, '\\d+(?: ?(?:s|secs?|seconds?))?');
  return `^${src}$`;
}
