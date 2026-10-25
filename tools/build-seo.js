/* =========================================================================
   THEA — static SEO build
   Run:  node tools/build-seo.js
   - Injects server-rendered JSON-LD into index/collection/product <head>
     (crawlers see it without running JS; pages still update it per URL)
   - Regenerates sitemap.xml from the catalogue in assets/js/data.js
   ========================================================================= */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const SITE = "https://thealiving.in";

// Load catalogue + SEO copy into a sandbox
const ctx = { inr: n => "₹" + Math.round(n).toLocaleString("en-IN") };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/seo.js"), "utf8") + "\n;globalThis.__x={PRODUCTS,SIZES,COLLECTIONS,FAQS,REVIEWS,KEYWORDS};", ctx);
const { PRODUCTS, SIZES, COLLECTIONS, FAQS } = ctx.__x;
const strip = s => s.replace(/<[^>]+>/g, "");
const byId = id => PRODUCTS.find(p => p.id === id);

const ORG = {
  "@type": ["Organization", "OnlineStore"], "@id": SITE + "/#org",
  name: "THEA - The House of Comfort Living", alternateName: ["THEA", "Thea Living", "thealiving"],
  legalName: "Theatic Brands Private Limited", url: SITE + "/",
  logo: SITE + "/cdn/shop/files/android-chrome-192x192_100x.png?v=1768657777",
  description: "Indian home-furnishing brand selling king size, double and super king bedsheet sets, reversible comforters and floor mats online with free shipping across India.",
  email: "care@thealiving.in", telephone: "+91-8796146616",
  address: { "@type": "PostalAddress", streetAddress: "H. No 4165, First Floor, Aradhya Homes, Ansal Versalia, Sector 67 & 67A", addressLocality: "Faridabad", addressRegion: "Haryana", postalCode: "122101", addressCountry: "IN" },
  geo: { "@type": "GeoCoordinates", latitude: 28.367, longitude: 77.3446 },
  areaServed: { "@type": "Country", name: "India" },
  contactPoint: [{ "@type": "ContactPoint", contactType: "customer service", telephone: "+91-8796146616", email: "care@thealiving.in", areaServed: "IN", availableLanguage: ["English", "Hindi"], hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "17:00" } }],
  sameAs: ["https://www.instagram.com/thealiving.in/", "https://in.pinterest.com/TheaLiving/"],
  hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy", applicableCountry: "IN", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: 3 }
};
const WEBSITE = { "@type": "WebSite", "@id": SITE + "/#website", url: SITE + "/", name: "THEA", publisher: { "@id": SITE + "/#org" }, inLanguage: "en-IN",
  potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: SITE + "/search?q={search_term_string}" }, "query-input": "required name=search_term_string" } };
const faqLD = list => ({ "@type": "FAQPage", mainEntity: list.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: strip(a) } })) });
const crumbLD = items => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })) });
function productLD(pr) {
  const s = SIZES[pr.size];
  const ld = { "@type": "Product", "@id": `${SITE}/products/${pr.id}#product`, name: pr.title, image: [pr.img], sku: `THEA-${pr.id.toUpperCase()}`, brand: { "@type": "Brand", name: "THEA" },
    description: `${pr.name} ${s.label} ${pr.isBedsheet ? `bedsheet set (${s.dims}) with ${s.pillow}` : s.dims}. ${pr.material}. Made in India.`, material: pr.material, color: pr.color.name,
    offers: { "@type": "Offer", url: `${SITE}/products/${pr.id}`, priceCurrency: "INR", price: pr.price, availability: pr.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition",
      shippingDetails: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" }, shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" } },
      hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy", applicableCountry: "IN", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: 3 } } };
  if (pr.rating && pr.reviews) ld.aggregateRating = { "@type": "AggregateRating", ratingValue: pr.rating, reviewCount: pr.reviews, bestRating: 5 };
  return ld;
}
const tag = (obj, id) => `<script type="application/ld+json" id="${id}">${JSON.stringify({ "@context": "https://schema.org", "@graph": obj })}</script>`;

const king = PRODUCTS.filter(COLLECTIONS.king.filter);
const blocks = {
  HOME: ["index.html", tag([ORG, WEBSITE,
    { "@type": "WebPage", "@id": SITE + "/#home", url: SITE + "/", name: "King Size & Double Bedsheets Online India | THEA", isPartOf: { "@id": SITE + "/#website" }, about: { "@id": SITE + "/#org" }, inLanguage: "en-IN",
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["#faq .ans", "#fitH"] } },
    { "@type": "ItemList", name: "Bestselling bedsheets", itemListElement: PRODUCTS.filter(p => p.collections.includes("bestseller")).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/products/${p.id}`, name: p.title })) },
    faqLD(FAQS)], "ld-home")],
  COLLECTION: ["collection.html", tag([
    { "@type": "CollectionPage", "@id": SITE + "/collections/king-bedsheets#page", url: SITE + "/collections/king-bedsheets", name: COLLECTIONS.king.title, description: COLLECTIONS.king.intro, isPartOf: { "@id": SITE + "/#website" },
      mainEntity: { "@type": "ItemList", numberOfItems: king.length, itemListElement: king.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/products/${p.id}`, name: p.title })) } },
    crumbLD([["Home", SITE + "/"], ["King size bedsheets", SITE + "/collections/king-bedsheets"]]),
    faqLD([FAQS[0], FAQS[2], FAQS[3], FAQS[4], FAQS[5]])], "ld-collection")],
  PRODUCT: ["product.html", tag([productLD(byId("blue-empress")),
    crumbLD([["Home", SITE + "/"], ["King size bedsheets", SITE + "/collections/king-bedsheets"], ["Blue Empress", SITE + "/products/blue-empress"]])], "ld-product")]
};
for (const [k, [file, html]] of Object.entries(blocks)) {
  const p = path.join(ROOT, file); let src = fs.readFileSync(p, "utf8");
  const re = new RegExp(`<!--LD:${k}-->[\\s\\S]*?<!--/LD:${k}-->|<!--LD:${k}-->`);
  src = src.replace(re, `<!--LD:${k}-->\n  ${html}\n  <!--/LD:${k}-->`);
  fs.writeFileSync(p, src); console.log("JSON-LD →", file);
}

// Sitemap
const today = new Date().toISOString().slice(0, 10);
const SLUG = { king: "king-bedsheets", double: "queen-bedsheets", cotton: "100-cotton-bedsheets", italian: "italian-embroidery-king-size-bedsheets", "300tc": "premium-cotton-300tc-bedsheets", comforter: "ac-comforters", mat: "floor-mats", all: "all-products" };
const urls = [[SITE + "/", "1.0", "daily"], ...Object.values(SLUG).map(s => [`${SITE}/collections/${s}`, "0.9", "daily"]),
  ...PRODUCTS.map(p => [`${SITE}/products/${p.id}`, "0.8", "weekly", p.img, p.title])];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(([u, pr, cf, im, t]) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority>${im ? `<image:image><image:loc>${im.replace(/&/g, "&amp;")}</image:loc><image:title>${t.replace(/&/g, "&amp;")}</image:title></image:image>` : ""}</url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml); console.log("sitemap.xml →", urls.length, "urls");
