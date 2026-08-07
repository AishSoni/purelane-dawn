# Purelane seed kit

Everything needed to demo the theme on a fresh store, in this order:

## 1. Products — `products.csv`

Admin > Products > Import, upload `products.csv`.

10 products, matching the prototype's ₹200 / ₹299 pricing. Three of them are
edge cases on purpose so the theme's fallbacks get exercised:

| Product | Why it's there |
| --- | --- |
| `purelane-foaming-kitchen-cleaner` | Regular bestseller |
| `purelane-organic-dishwash-liquid-gel` | Regular bestseller |
| `purelane-natural-herbal-floor-cleaner` | Regular |
| `purelane-non-toxic-laundry-detergent` | Regular bestseller |
| `purelane-gentle-hydrating-liquid-handwash` | Regular |
| `purelane-non-toxic-toilet-cleaner` | **Sold out** (0 inventory) — tests the disabled Add to cart |
| `purelane-tap-cleaner-limescale-remover` | **No product photo** — tests the leaf placeholder |
| `purelane-washing-machine-cleaner-descaler` | **Long title** — tests the 2-line clamp on cards |
| `purelane-copper-bronze-brass-cleaner` | Regular |
| `purelane-magic-cleaning-eraser` | Simple no-size product |

No images are bundled (the prototype's product art was inline placeholder
art). Upload your product photos afterwards; the theme renders whatever
featured image the product has.

## 2. Metaobject definitions — `metaobjects/definitions.json`

Admin > Settings > Custom data > Definitions > Import, upload
`metaobjects/definitions.json`.

Creates two definitions:

- **combo** — powers the Best-selling combos rail. Fields: `name`,
  `tagline`, `inc`, `banner`, `featured`, `price`, `link`, `products`.
- **review** — powers the reviews marquee. Fields: `author`, `rating`,
  `title`, `body`, `context`, `verified`.

If the names `combo` / `review` are taken, rename the definition's `type`
and `name` before importing, then adjust the section references:
`shop.metaobjects.combo` → `shop.metaobjects.<yourname>` in
`sections/purelane-combos.liquid`, `sections/purelane-reviews.liquid`.

## 3. Entries — `metaobjects/*.instances.json`

Admin > Settings > Custom data, open the **combo** definition > Entries >
Add entry (or bulk editor), and create the five combos from
`combo.instances.json`. Same for **review** and `review.instances.json`.

Entry JSON is a source of truth for the *content* (names, copy, prices,
flags). The `products` array lists handles — in the bulk editor use the
**Products** column picker to select the imported products. Mapping:

| Combo | Products |
| --- | --- |
| Kitchen essentials (₹349, featured) | kitchen-cleaner, dishwash-gel |
| Laundry care bundle (₹499) | laundry-detergent, wm-cleaner, magic-eraser |
| Complete home bundle (₹799, "Best value") | kitchen, dishwash, floor, laundry, handwash |
| Bathroom deep clean (₹499) | toilet-cleaner, tap-cleaner, handwash |
| Hard water solution kit (₹349) | tap-cleaner, wm-cleaner |

If a combo's `price` field is left blank, the theme sums the included
products' prices automatically and derives "You save ₹x".

## 4. Homepage

The homepage template (`templates/index.json`) already references all five
sections with empty settings, so defaults kick in. In the theme editor,
pick the collection in **Purelane product grid** (defaults to "all").

## 5. Ratings

The product grid reads the native `reviews.rating` / `reviews.rating_count`
metafields — populated by your reviews app. Cards without a rating skip the
star row entirely.
