/** Small DOM helpers shared by content-script features. */

export interface Disposable {
  dispose(): void;
}

/** Debounce calls into one invocation per `ms` window, coalescing arguments into a Set. */
export function createQueue<T>(ms: number, flush: (items: T[]) => void): { add(item: T): void; clear(): void } {
  let pending = new Set<T>();
  let timer: number | undefined;
  return {
    add(item: T): void {
      pending.add(item);
      if (timer === undefined) {
        timer = window.setTimeout(() => {
          timer = undefined;
          const items = [...pending];
          pending = new Set();
          flush(items);
        }, ms);
      }
    },
    clear(): void {
      pending.clear();
    },
  };
}

/**
 * Call `cb` for every element matching `selector` that exists now or is added later under `root`.
 * Each element is reported once.
 */
export function onElement(selector: string, cb: (el: Element) => void, root: ParentNode = document): Disposable {
  const seen = new WeakSet<Element>();
  const report = (el: Element): void => {
    if (seen.has(el)) return;
    seen.add(el);
    cb(el);
  };
  const scan = (node: ParentNode): void => {
    if (node instanceof Element && node.matches(selector)) report(node);
    for (const el of node.querySelectorAll(selector)) report(el);
  };
  scan(root);
  const observer = new MutationObserver((records) => {
    for (const r of records) {
      for (const n of r.addedNodes) if (n instanceof Element) scan(n);
    }
  });
  observer.observe(root, { childList: true, subtree: true });
  return { dispose: () => observer.disconnect() };
}
