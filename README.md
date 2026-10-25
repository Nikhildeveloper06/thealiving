# THEA — UI/UX revamp v3 (homepage, collection, product)

A responsive, interactive redesign of thealiving.in in plain HTML, CSS and JavaScript. No framework, no build step needed to view it. Open `index.html` in a browser.

## Run it

- Double-click `index.html`, or serve the folder: `npx serve .` or `python3 -m http.server`, then open http://localhost:8000
- Product photos load from the store's Shopify CDN, so an internet connection is needed for those. Fonts and icons are self-hosted in `assets/vendor/` and work offline.

## Pages

| File | Highlights |
|---|---|
| `index.html` | Bedsheet-unfolding preloader, a hero that fills exactly the first screen with the brand line centred and a **print switcher dock**: hover or tap a fabric swatch and the bedroom changes to that print (auto-cycles with a progress ring, swipe on phones, subtle pointer parallax), offer marquee, size cards, **bed size calculator** with live top-view drawing, **shop-the-look hotspots**, **bundle builder** with fly-to-slot animation, **fabric guide** with animated meters, count-up stats, luxury edit, tabbed bestsellers, two-row auto-scrolling reviews, lookbook grid, FAQ, journal, newsletter |
| `collection.html?c=king` | Full-bleed collection hero with stats and collection chips, sticky filters (size, type, fabric, style, colour, price, stock), sticky toolbar, sort, 3/4 grid toggle, active-filter chips, staggered card animation, load more, URL-synced filters, collection FAQ |
| `product.html?id=italian-moka` | Full-width product band, gallery with close-up crops and cursor zoom, share, live viewers, type cards, colour siblings, 1/2/3-set deal picker, copyable offer codes, pincode delivery date, care icons, "sketch to bed" story, pair-it-with rail, reviews, product FAQ, recently viewed, sticky mobile buy bar |

Collection keys: `all, king, double, cotton, italian, 300tc, comforter, mat`. Product ids are in `assets/js/data.js`.

## Every page

Preloader (full animation on first visit, short on later pages), rotating offer bar, transparent-to-solid header that hides on scroll down, mega menu, mobile drawer menu, cart drawer with bundle meter and upsells, wishlist, instant search (press `/`), size chart modal, toasts, WhatsApp button, back-to-top with scroll progress ring, footer, and an SEO content block below the footer.

## SEO, AEO and GEO

| Area | What's included |
|---|---|
| Meta | Unique title, description, keywords, robots, canonical, hreflang en-IN, Open Graph, Twitter cards, product price/availability tags. Collection and product pages rewrite these per URL. |
| Structured data (JSON-LD) | Organization + OnlineStore, WebSite with SearchAction, WebPage with Speakable, ItemList, FAQPage, CollectionPage, BreadcrumbList, Product with Offer, shipping details, return policy and AggregateRating where reviews exist. Static copies are in each page head so crawlers see them without JavaScript. |
| AEO (answer engines) | Answer-first FAQs on the homepage, collection and product pages, mirrored in FAQPage schema. Factual size and fabric copy that voice assistants and featured snippets can quote. |
| GEO (location) | geo.region IN-HR, geo.placename Faridabad, geo.position/ICBM, PostalAddress and GeoCoordinates in schema, India-wide areaServed, city names in the SEO copy. |
| GEO (generative engines) | `llms.txt` with brand facts, sizes, prices and links; `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot and Google-Extended. |
| Files | `robots.txt`, `sitemap.xml` (44 URLs with image entries), `site.webmanifest`, SVG favicon. |
| SEO copy | Keyword-rich, readable long-form text below the footer (collapsible), different for home, each collection and each product, plus "popular searches" internal links. |
| Performance | Self-hosted woff2 fonts with preload and font-display swap, lazy images with sizes, preloaded hero image, no JS frameworks, reduced-motion support. |

Rebuild the static JSON-LD and sitemap after editing products: `node tools/build-seo.js`

## Responsive

Tested at 390 (mobile), 768 (tablet), 1024 (small laptop), 1440 (laptop) and 1920 (desktop). Containers widen at 1600 and 1920 px; layouts collapse at 1024, 768, 640 and 480 px.

## Design system

| Token | Value | Use |
|---|---|---|
| Ink | `#1d2940` | Brand, text, primary buttons (indigo block-print dye) |
| Linen | `#eef0ea` | Section grounds |
| Sage | `#5f7d68` | Savings, success, icons |
| Haldi | `#d9a23a` | Offers only, so deals always stand out |

Type: **Cormorant Garamond** (headings, forced lining figures) and **Inter** (all body text, UI and every number: prices, stats, counters, codes, search). Prices and counters use tabular lining figures so digits line up. The ₹ sign renders in Inter via its latin-ext subset. Icons: Phosphor (regular, fill, duotone).

## Smooth scrolling and performance

- Lenis smooth scrolling on mouse/trackpad (self-hosted in `assets/vendor/lenis`); phones keep native scrolling. Turned off for reduced-motion users.
- Scroll handlers are throttled with requestAnimationFrame and avoid layout reads.
- Marquees, review rows and spinning text pause while off screen; the hero autoplay pauses when scrolled away.
- No backdrop blur on the sticky header or toolbar (a common source of scroll jank); animations use only transform and opacity.

## Moving to Shopify

- `assets/js/data.js` mirrors the catalogue; replace with Liquid (`collection.products`) or the Storefront API.
- Header/footer templates in `app.js` map to `sections/header.liquid` and `sections/footer.liquid`.
- Cart drawer → AJAX Cart API (`/cart/add.js`, `/cart.js`); bundle pricing → automatic discounts BUY2 / BUY3.
- Pincode check and "people viewing" are demo logic; wire to Shiprocket/Delhivery and real analytics, or remove.
- JSON-LD can move into `snippets/` using Liquid variables; keep `llms.txt` and `robots.txt` at the domain root.

## Folder

```
thea-revamp/
├── index.html · collection.html · product.html
├── robots.txt · sitemap.xml · llms.txt · site.webmanifest
├── tools/build-seo.js            regenerates JSON-LD + sitemap
└── assets/
    ├── css/style.css
    ├── js/data.js                catalogue, offers, reviews, blogs
    ├── js/seo.js                 SEO copy, keywords, FAQs
    ├── js/app.js                 shell, cart, search, preloader, helpers
    ├── js/home.js · collection.js · product.js
    ├── img/                      hero, tiles, banner, journal, favicon
    └── vendor/                   fonts (woff2) + Phosphor icons
```
