# Build notes (brief)

- **Base**: stock Dawn v15.5.0 (`git clone https://github.com/Shopify/dawn.git`),
  committed as a single pristine import so the custom work is diffable.
- **Pipeline**: prototype's two style blocks are merged deterministically by
  `scripts/extract-css.mjs` (V2 palette wins; `.card`→`.pl-card`, `.price`→`.pl-price`,
  `.badge`→`.pl-badge` renamed; base64 product art dropped; integration layer added).
  `scripts/extract-scene.mjs` pulls the hero backdrop into `snippets/pl-scene.liquid`.
  Rerun `node scripts/extract-css.mjs` after changing the script.
- **Zero hardcoded data**: every price flows from live variants/`money`; every card
  from collections or metaobjects; every headline from schema settings/presets.
- **Prototype gotchas fixed**
  1. Shop rail cards renamed to `.pl-card` (Dawn collision on `.card`).
  2. `.price` → `.pl-price`; `.badge(s)` → `.pl-badge(s)` (same collision class).
  3. `paid` stars / review counts come from native `reviews.rating` metafields,
     cards without ratings skip the row.
  4. Hero "Save ₹x" pill computed money-first (a naive filter chain rendered ₹0),
     and a blank slide can no longer divide-by-zero.
  5. Product rows: sold-out buttons disable; missing images fall back to a leaf
     placeholder; long titles clamp to two lines.
  6. `where: 'featured_image'` (truthy), `.value` on metafields, `badgestrip` prefix,
     and `.revdup` flex rule for the marquee seam (all flagged by QA agents and fixed).
- **a11y / CWV**: `prefers-reduced-motion` kills animation & reveals; `noscript`
  fallback keeps content visible; Google Fonts load non-blocking; hero first image
  `eager` + `fetchpriority=high`; images carry width/height; scene fixed backdrop only
  on the index page.

## Git

Local-only repo (`E:\assignment\purelane-dawn`). To share: `git remote add origin <url>`
then `git push -u origin main`, or zip the folder excluding `.git`.