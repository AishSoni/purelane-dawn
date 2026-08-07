# Email to Troopod — draft

Subject: Purelane Shopify theme — ready for review

Body:

Hi Troopod,

We've rebuilt the Purelane homepage prototype as a production Shopify
Online Store 2.0 theme, built on stock Dawn v15.5.0.

What's included
- Five required sections: hero (1/2/3-product stage with live prices),
  reviews marquee, best-selling combos, bundle tiers, and the product
  grid — plus bonus sections (ingredients, pillars, proof rotator,
  full range, why-bundles, categories, trust bar, newsletter signup).
- Zero hardcoded data: every price, product and review comes from the
  store's products, collections and metaobjects (a seed kit with 10
  products and both metaobject definitions is included).
- Single-page parity with the prototype's light palette, fonts and
  interactions (scene crossfade, hero autoplay, marquee, reveals),
  with the prototype's naming collisions and edge cases fixed
  (sold-out, missing images, long titles, ₹0 "Save" bug, marquee seam).

Status
- 45+ atomic git commits; theme passes our Liquid and CSS-parity QA.
- One caveat: we had no dev store in this environment, so the theme has
  not been rendered against Shopify's runtime yet. We suggest running
  `shopify theme check` and a quick visual diff in a preview before go-live.

The theme is ready to upload (Admin > Online Store > Themes > Add theme).

Best,
[Your name]
