# Purelane Dawn theme

Shopify Online Store 2.0 theme (Dawn v15.5.0 base, `purelane-dawn`) rebuilt
from the `purelane-homepage.html` prototype. Five required sections plus
bonus sections, all stock-Dawn conformant, zero hardcoded product data.

## Install

1. Zip the theme root (the folder containing `layout/`, `sections/`, `templates/`, `assets/`…).
2. Shopify Admin > Online Store > Themes > **Add theme** → *Upload zip*.
3. Publish, then load the homepage. Add your products/images and populate
   the metaobjects using the seed kit list below (or your real catalog).

## Seed kit — `seed/`

Everything you need to demo on a fresh store, in order:

1. `seed/products.csv` — 10 products (₹200 / ₹299), incl. one **sold-out**, one **no-image**,
   and one **long-title** product to exercise the theme's fallbacks.
2. `seed/metaobjects/definitions.json` — **combo** and **review** definitions.
3. `seed/metaobjects/combo.instances.json` / `review.instances.json` — entry content.
4. `seed/README.md` — step-by-step import + the combo↔product mapping.

## Homepage (templates/index.json)

| Section | Prototype anchor | Data source |
| --- | --- | --- |
| purelane-hero | `#hero` 1/2/3-product stage | ctters: product pickers + badges |
| purelane-reviews | `#reviews` marquee | `review` metaobjects |
| purelane-combos | `#combos` rail | `combo` metaobject |
| purelane-bundles | `#bundles` tiers | section settings (prices, features) |
| purelane-shop | `#shop` product grid | a collection + `reviews.rating` |
| purelane-ingredients / pillars / proof | `#ingredients` / `#how` / `#proof` | blocks/settings |
| purelane-range / why-bundles / categories | `#range` / `#whybundles` / `#categories` | collection + blocks |
| purelane-trust-signup | trust bar + ₹100 signup | blocks + Shopify `customer` form |

## Repo layout

- `sections/purelane-*.liquid` — the 12 custom sections (index-only).
- `snippets/pl-icon.liquid` — shared inline SVG icon set.
- `snippets/pl-scene.liquid` — verbatim hero "scenes" backdrop.
- `assets/purelane.css` — single stylesheet (light palette, merged from prototype V1+V2).
- `assets/purelane.js` — reveal, scene crossfade, hero autoplay, product rotator, AJAX add-to-cart.
- `scripts/extract-css.mjs` / `extract-scene.mjs` — reproducible extraction pipelines (rerun to rebuild CSS).
- `seed/` — demo data kit.

## Caveats

- **No dev store here** — rendering was not verified against Shopify's runtime.
  Run `shopify theme check` and a visual diff in Preview before launch.
- Product art from the prototype (inline base64/SVG bottles) was intentionally
  dropped; upload real product photos — the theme renders whatever
  featured image each product has.
- Google Fonts (Outfit/Inter) are loaded via a non-blocking stylesheet; the
  Dawn font settings remain authoritative on other templates.