/**
 * extract-scene.mjs
 * Extracts the fixed "scenes" background (water layers, bubbles,
 * vignette) from the prototype verbatim into snippets/pl-scene.liquid.
 *
 * The turbulence-filtered SVG strands are hand-crafted and lengthy;
 * retyping them would risk introducing visual drift. Mechanical
 * extraction keeps the render pixel-faithful.
 *
 * Also extracts the announcement ticker markup into the purelane-header
 * section source for later reuse (not written here).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, '..', 'purelane-homepage.html'), 'utf8');

// Capture the <div class="scenes" ...> ... </div> block that closes
// before the TICKER comment.
const scenesOpen = html.indexOf('<div class="scenes" id="scenes"');
const scenesClose = html.indexOf('<!-- ================= TICKER');
if (scenesOpen === -1 || scenesClose === -1) {
  throw new Error('Could not locate the scenes block.');
}
const scenes = html.slice(scenesOpen, scenesClose).trimEnd();

const snippet = `${scenes}\n`;
writeFileSync(join(root, 'snippets', 'pl-scene.liquid'), snippet, 'utf8');
console.log(`OK pl-scene.liquid (${snippet.length} bytes)`);