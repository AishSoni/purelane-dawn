# Purelane seed kit

Everything needed to demo the theme on a fresh store, in this order:

> **Brand note:** There is no real "Purelane" store. The seed data is
> aligned 1:1 to **PureCult** (purecult.in), a Bengaluru plant-based
> homecare brand whose 500-ml range matches the theme's prototype.
> Handles, titles, prices (incl. MRP where listed), SKUs, barcodes and
> image URLs below are real public catalogue data from PureCult.

## 1. Products — `products.csv`

Admin > Products > Import, upload `products.csv`.

10 products, priced from the real catalogue. Three edge cases are
deliberate so the theme's fallbacks get exercised:

| Product | Price (MRP) | Why it's there |
| --- | --- | --- |
| `kitchen-degreaser-ultra-500ml` | ₹399 | Regular bestseller |
| `dishwashing-liquid-with-sweet-orange-lemon-essential-oil-500-ml` | ₹349 | Regular bestseller |
| `floor-cleaner-500-ml` | ₹349 | Regular |
| `eco-friendly-laundry-detergent-skin-friendly-geranium-and-lavender-500ml` | ₹499 | Regular bestseller |
| `eco-friendly-liquid-handwash-sweet-dew-skin-friendly-biodegradable-250ml` | ₹299.25 (₹399) | 250-ml size |
| `bathroom-cleaner-with-sweet-orange-lemon-essential-oil-500-ml` | ₹399 | **Sold out** (0 inventory) — tests the disabled Add to cart |
| `tap-and-shower-cleaner` | ₹299 | **No product photo** — tests the leaf placeholder |
| `all-surface-cleaner-with-sweet-orange-500-ml` | ₹399 | Regular |
| `eco-friendly-liquid-fabric-conditioner-skin-friendly-biodegradable-geranium-lavender-essential-oil-500ml` | ₹399 | **Long title** — tests the 2-line clamp on cards |
| `floor-cleaner-5000-ml` | ₹1,950 (₹2,999) | 5-litre refill can |

Images are hotlinked to the live PureCult CDN (`purecult.in/cdn/shop` and
`cdn.shopify.com/s/files/1/0265/3087/3422/...`). If a URL 404s later,
re-upload the product art and update the row.

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
Add entry (or bulk editor), and create the combos from
`combo.instances.json`. Same for **review** and `review.instances.json`.

Entry JSON is the source of truth for the *content* (names, copy, prices,
flags). The `products` arrays list handles — in the bulk editor use the
**Products** column picker to select the imported products. Mapping:

| Combo | Products | Price (= sum) |
| --- | --- | --- |
| Kitchen essentials (featured) | degreaser-ultra, dishwashing-liquid | ₹748 |
| Everyday edit | floor-500, dishwashing-liquid | ₹698 |
| Home basics edit ("Best value") | floor-500, dishwashing-liquid, laundry-detergent | ₹1,197 |
| Home essentials trio | all-surface, bathroom-cleaner, tap-and-shower | ₹1,097 |
| Laundry care bundle | laundry-detergent, fabric-conditioner | ₹898 |
| Tap & shower duo | tap-and-shower, degreaser-ultra | ₹698 |

Every combo `price` equals the exact sum of its products. If a combo's
`price` field is left blank, the theme sums the included products' prices
automatically and derives "You save ₹x".

## 4. Homepage

The homepage template (`templates/index.json`) already references all five
sections with empty settings, so defaults kick in. **Purelane bundles**
ships with three merchant presets — Starter ₹698, Most popular ₹1,197,
Whole home ₹1,795 — matching the real catalogue sums; adjust in the theme
editor once the actual product lists are added.

## 5. Ratings

The product grid reads the native `reviews.rating` / `reviews.rating_count`
metafields — populated by your reviews app. Cards without a rating skip the
star row entirely.