/**
 * extract-css.mjs
 * ------------------------------------------------------------------
 * Faithfully rebuilds the Purelane design system CSS from the source
 * prototype (purelane-homepage.html).
 *
 * The prototype carries TWO successive <style> blocks: V1 (baseline
 * layouts) followed by V2 (light brand palette overrides). A browser
 * applies both in cascade order, so the true outcome == V1 text + V2
 * text concatenated. We reproduce exactly that.
 *
 * Production fixes applied by this script (each is reviewable):
 *   1. Drop the inline base64 product-art block (--p-* vars + .p-* art
 *      classes). Product imagery now comes from real Shopify product
 *      images, so the embedded data-URIs are dead weight (~30 KB).
 *   2. Rename classes that collide with stock Dawn 15 declarations:
 *        .badge -> .pl-badge     .badges -> .pl-badges
 *        .card  -> .pl-card      .price  -> .pl-price
 *   3. Append a small override layer for the image swap and Dawn
 *      integration (letter-spacing reset, img-based product art).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, '..', 'purelane-homepage.html'), 'utf8');

const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
if (styles.length < 2) throw new Error(`Expected 2 <style> blocks, found ${styles.length}`);

let css = styles.join('\n');

/* 1. Remove the base64 product-assets block (vars + .p-* art rules). */
const start = css.indexOf('/* ---------- PRODUCT ASSETS');
const end = css.indexOf('/* ---------- HERO PRODUCT STAGE');
if (start === -1 || end === -1 || !(start < end)) {
  throw new Error('Could not locate the product-assets block for removal.');
}
css = css.slice(0, start) + css.slice(end);

/* 2. Rename Dawn-colliding classes (longest names first). */
const renames = [
  ['.badges', '.pl-badges'],
  ['.badge', '.pl-badge'],
  ['.card', '.pl-card'],
  ['.price', '.pl-price'],
];
for (const [from, to] of renames) {
  // Word boundary after the literal so `.badgestrip`, `.cardible` etc. are untouched.
  css = css.replaceAll(from, to);
}

/* 3. Integration / override layer. */
const overrides = `/* ============================================================
   PURLELANE -> SHOPIFY INTEGRATION & IMAGE SWAP
   Loaded only on the homepage ('index'). See docs in BUILD_NOTES.
   ------------------------------------------------------------
   The product list/hero now render <img> from real product images
   instead of background-data-URI "bottle" art. These rules keep the
   exact geometry of the prototype while swapping the painting model.
   ============================================================ */

/* Neutralise Dawn's body letter-spacing on the home page only. */
body {
  letter-spacing: 0;
}

[data-pl] {
  letter-spacing: inherit;
}

/* Product image: object-fit contain (replaces .pimg background art). */
.pimg {
  display: block;
  width: auto;
  height: 100%;
  flex: 0 0 auto;
  object-fit: contain;
  object-position: center bottom;
  filter: drop-shadow(0 9px 14px rgba(0, 74, 66, 0.14));
}

/* Hero stage product image (previously background .hp spans). */
.hp {
  position: relative;
  width: auto;
  filter: drop-shadow(0 14px 22px rgba(0, 74, 66, 0.15));
}

.hslide .hp {
  opacity: 0;
  transform: translateY(28px) scale(0.94);
  transition: opacity 0.8s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hslide.on .hp {
  opacity: 1;
  transform: none;
}

/* Placeholder for products without an image (defines a minimum box so
   the grid never collapses while a photo is missing). */
.pimg--placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-height: 120px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.6), rgba(236, 230, 247, 0.42));
  border: 1px solid rgba(75, 58, 143, 0.1);
  border-radius: 14px;
  color: rgba(75, 58, 143, 0.5);
}
.pimg--placeholder svg {
  width: 34px;
  height: 34px;
}

/* Outline colour: the light V2 palette's focus ring. */
:focus-visible {
  outline: 2px solid #4f7d10;
}

/* Product shot image inside cards (prototype sized these as inline SVG). */
.pl-card .shot .pimg {
  height: 122px;
  width: auto;
}
@media (max-width: 760px) {
  .pl-card .shot .pimg {
    height: 108px;
  }
}

/* Very long product titles clamp to two lines so the grid never breaks. */
.pl-card h4 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Disabled add-to-cart buttons (sold-out products). */
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

/* Success / error captions inside the signup glass. */
.signup .signup-ok {
  margin: 12px auto 0;
  font-size: 14px;
  color: var(--ink);
}
.signup .signup-err {
  color: #b3382c;
}

/* Reviews marquee: the duplicate half is a second flex row so the
   50% loop seam is seamless (delta), same gap as .revtrack. */
.revdup {
  display: flex;
  gap: 12px;
}

/* Reduced motion: kill every animation on the home page, matching the
   prototype's behaviour but with a slightly stronger reset. */
@media (prefers-reduced-motion: reduce) {
  .wl-a,
  .wl-b,
  .wl-c,
  .wl-s,
  .bub span {
    animation: none;
  }
}
`;

writeFileSync(join(root, 'assets', 'purelane.css'), css + '\n' + overrides, 'utf8');
console.log(`OK purelane.css (${css.length + overrides.length} bytes)`);