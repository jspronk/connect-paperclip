import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json' with { type: 'json' };

/**
 * public/capture.js must run in the page's main world synchronously at document_start.
 * CRXJS wraps every manifest script in an async loader, so the entry is added to the built
 * manifest after CRXJS has written it. Vite copies public/capture.js to dist/capture.js as-is.
 */
function mainWorldCapture(): Plugin {
  return {
    name: 'cmh-main-world-capture',
    apply: 'build',
    closeBundle() {
      const file = path.resolve('dist/manifest.json');
      const built = JSON.parse(readFileSync(file, 'utf8')) as {
        content_scripts?: Array<Record<string, unknown>>;
      };
      built.content_scripts = (built.content_scripts ?? []).filter((cs) => cs.world !== 'MAIN');
      built.content_scripts.push({
        matches: manifest.content_scripts[0]!.matches,
        js: ['capture.js'],
        run_at: 'document_start',
        world: 'MAIN',
      });
      writeFileSync(file, JSON.stringify(built, null, 2) + '\n');
    },
  };
}

export default defineConfig({
  plugins: [crx({ manifest }), mainWorldCapture()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
