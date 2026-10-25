/* =========================================================================
   THEA — shared app shell
   Icons · header · mega menu · cart · wishlist · search · preloader
   scroll effects · rails · tabs · SEO helpers (meta + JSON-LD)
   ========================================================================= */

/* ---------- Icons: Phosphor (self-hosted in assets/vendor/phosphor) ---------- */
const ICON_ALIAS = {
  search: "magnifying-glass", bag: "handbag", menu: "list", close: "x", down: "caret-down",
  left: "arrow-left", right: "arrow-right", swap: "arrows-left-right", shield: "shield-check",
  zoom: "magnifying-glass-plus", pin: "map-pin", mail: "envelope-simple", layers: "stack",
  grid2: "squares-four", grid3: "grid-nine", filter: "funnel-simple", insta: "instagram-logo",
  pinterest: "pinterest-logo", whatsapp: "whatsapp-logo", ruler: "ruler", arrow: "arrow-up-right"
};
const icon = (n, cls = "", w = "") => {
  const name = ICON_ALIAS[n] || n;
  const weight = w === "fill" ? "ph-fill" : w === "duo" ? "ph-duotone" : "ph";
  return `<i class="${weight} ph-${name} icon ${cls}" aria-hidden="true"></i>`;
};
const starRow = (n = 5) => Array.from({ length: 5 }, (_, i) => icon("star", "", i < Math.round(n) ? "fill" : "")).join("");

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const img = (url, w = 700) => url.replace("_1200x1200", `_${w}x${w}`);
const byId = id => PRODUCTS.find(x => x.id === id);
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const qs = k => new URLSearchParams(location.search).get(k);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SITE = "https://thealiving.in";

/* ---------- Bundle pricing (Buy 2 → 50%, Buy 3+ → 56% on bedsheets) ---------- */
function bundleFor(n) { return n >= 3 ? OFFERS.bundle[1] : n === 2 ? OFFERS.bundle[0] : null; }
function priceCart(lines) {
  let subtotal = 0, sheetSub = 0, sheets = 0;
  lines.forEach(l => {
    const pr = byId(l.id); if (!pr) return;
    subtotal += pr.price * l.qty;
    if (pr.isBedsheet) { sheetSub += pr.price * l.qty; sheets += l.qty; }
  });
  const b = bundleFor(sheets);
  const save = b ? sheetSub * b.pct / 100 : 0;
  return { subtotal, save, total: subtotal - save, sheets, bundle: b };
}
const avgRating = () => {
  const r = PRODUCTS.filter(p => p.rating && p.rating >= 3);
  const n = r.reduce((a, p) => a + p.reviews, 0);
  return { avg: r.reduce((a, p) => a + p.rating * p.reviews, 0) / n, n };
};

/* ---------- Stores ---------- */
const Cart = {
  lines: store.get("thea_cart", []),
  save() { store.set("thea_cart", this.lines); renderCart(); updateCounts(true); },
  add(id, variant = "Flat", qty = 1) {
    const ex = this.lines.find(l => l.id === id && l.variant === variant);
    ex ? ex.qty += qty : this.lines.push({ id, variant, qty });
    this.save();
  },
  setQty(i, q) { if (q <= 0) this.lines.splice(i, 1); else this.lines[i].qty = q; this.save(); },
  count() { return this.lines.reduce((a, l) => a + l.qty, 0); }
};
const Wish = {
  ids: store.get("thea_wish", []),
  has(id) { return this.ids.includes(id); },
  toggle(id) {
    this.has(id) ? this.ids = this.ids.filter(x => x !== id) : this.ids.push(id);
    store.set("thea_wish", this.ids); updateCounts();
    $$(`.wish[data-id="${id}"]`).forEach(b => {
      b.setAttribute("aria-pressed", this.has(id));
      b.innerHTML = icon("heart", "", this.has(id) ? "fill" : "");
      b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    });
    renderWish();
    return this.has(id);
  }
};

/* ---------- Product card ---------- */
function stars(r, n) { return r ? `<span class="stars">${icon("star", "", "fill")} ${r.toFixed(1)} <span>(${n})</span></span>` : ""; }
function card(pr, opts = {}) {
  const s = SIZES[pr.size];
  const badge = !pr.stock ? `<span class="badge oos">${icon("clock")} Back soon</span>`
    : pr.badge === "Bestseller" ? `<span class="badge dark">${icon("crown", "", "fill")} Bestseller</span>`
    : pr.badge ? `<span class="badge">${icon("sparkle", "", "fill")} ${pr.badge}</span>` : "";
  const per2 = pr.isBedsheet ? `<small>${inr(pr.price / 2)} each in any 2</small>` : "";
  const quick = pr.stock ? pr.types.map(t => `<button data-add="${pr.id}" data-variant="${t}">${icon("plus")} ${t === "Fitted/Elastic" ? "Fitted" : t}</button>`).join("") : "";
  return `
  <article class="card ${opts.cls || ""}" style="${opts.delay ? `animation-delay:${opts.delay}ms` : ""}">
    <div class="card-media">
      ${badge}
      ${opts.noPeek ? "" : `<span class="peek-label">${icon("magnifying-glass-plus")} Fabric close-up</span>`}
      <button class="wish" data-id="${pr.id}" aria-pressed="${Wish.has(pr.id)}" aria-label="Save ${pr.name} to wishlist">${icon("heart", "", Wish.has(pr.id) ? "fill" : "")}</button>
      <img class="main" src="${img(pr.img, 600)}" alt="${pr.name} ${s.label} ${pr.isBedsheet ? "bedsheet set with pillow covers" : ""}" loading="lazy" decoding="async" width="600" height="750">
      ${opts.noPeek ? "" : `<img class="peek" src="${img(pr.img, 900)}" alt="" loading="lazy" decoding="async" aria-hidden="true">`}
      <div class="quick">${quick}</div>
    </div>
    <div class="card-body">
      <div class="card-meta"><span class="size-tag">${icon(pr.size === "mat" ? "square" : pr.size === "comforter" ? "cloud" : "bed")} ${s.label} · ${s.dims}</span>${stars(pr.rating, pr.reviews)}</div>
      <h3 class="card-title"><a href="product.html?id=${pr.id}">${pr.name}</a></h3>
      <div class="card-price"><b>${inr(pr.price)}</b>${per2}</div>
      ${pr.stock ? `<button class="btn btn-line add-m" data-add="${pr.id}" data-variant="${pr.types[0]}">${icon("handbag")} Add to cart</button>` : ""}
    </div>
  </article>`;
}

/* ---------- Header ---------- */
function headerHTML() {
  const count = c => PRODUCTS.filter(COLLECTIONS[c].filter).length;
  return `
  <a href="#main" class="skip">Skip to content</a>
  <div class="announce" role="region" aria-label="Offers">
    <div class="wrap">
      <div class="announce-side"><a href="tel:+918796146616">${icon("phone")} +91 87961 46616</a><a href="mailto:care@thealiving.in">${icon("mail")} care@thealiving.in</a></div>
      <button class="announce-nav" data-ann="-1" aria-label="Previous offer">${icon("caret-left")}</button>
      <div class="announce-track">
        <a href="collection.html?c=all" class="on">${icon("tag", "", "fill")} Buy any 2 bedsheets, <b>flat 50% off</b></a>
        <a href="collection.html?c=all">${icon("gift", "", "fill")} Buy any 3 bedsheets, <b>56% off</b></a>
        <a href="collection.html?c=all">${icon("seal-percent", "", "fill")} Flat 40% off sitewide with <b>FESTIVE40</b></a>
        <a href="collection.html?c=all">${icon("truck", "", "fill")} Free shipping on every order across India</a>
      </div>
      <button class="announce-nav" data-ann="1" aria-label="Next offer">${icon("caret-right")}</button>
      <div class="announce-side"><a href="https://thealiving.in/pages/shipping-policy">${icon("package")} Track order</a><a href="https://thealiving.in/pages/contact">${icon("question")} Help</a></div>
    </div>
  </div>
  <header class="header top" id="header">
    <div class="wrap">
      <div style="display:flex;align-items:center;gap:4px">
        <button class="h-btn menu-btn" data-open="menu" aria-label="Open menu">${icon("list")}</button>
        <a href="index.html" class="logo" aria-label="THEA, The House of Comfort Living, home"><b>THEA</b><small>The House of Comfort Living</small></a>
      </div>
      <nav aria-label="Main">
        <ul class="nav">
          <li>
            <a class="nav-link" href="collection.html?c=all" aria-haspopup="true">Bedsheets ${icon("caret-down")}</a>
            <div class="mega">
              <div class="mega-in">
                <div>
                  <h4>Shop by size</h4>
                  <ul>
                    <li><a href="collection.html?c=king">${icon("bed", "", "duo")} King <span>100×108 in</span></a></li>
                    <li><a href="collection.html?c=double">${icon("bed", "", "duo")} Double <span>90×100 in</span></a></li>
                    <li><a href="collection.html?c=italian">${icon("bed", "", "duo")} Super King <span>108×108 in</span></a></li>
                    <li><a href="collection.html?c=all">${icon("squares-four", "", "duo")} All bedding <span>${count("all")}</span></a></li>
                  </ul>
                </div>
                <div>
                  <h4>Shop by fabric</h4>
                  <ul>
                    <li><a href="collection.html?c=cotton">${icon("leaf", "", "duo")} 100% cotton prints</a></li>
                    <li><a href="collection.html?c=300tc">${icon("needle", "", "duo")} Solid cotton 300TC</a></li>
                    <li><a href="collection.html?c=italian">${icon("flower-lotus", "", "duo")} Italian embroidery</a></li>
                    <li><a href="collection.html?c=king">${icon("feather", "", "duo")} Microfiber prints</a></li>
                  </ul>
                </div>
                <div>
                  <h4>Help me choose</h4>
                  <ul>
                    <li><a href="index.html#fit">${icon("ruler", "", "duo")} Bed size calculator</a></li>
                    <li><a href="index.html#fabric">${icon("thermometer", "", "duo")} Fabric guide</a></li>
                    <li><a href="index.html#bundle">${icon("gift", "", "duo")} Build a bundle</a></li>
                    <li><a href="index.html#faq">${icon("question", "", "duo")} FAQs</a></li>
                  </ul>
                </div>
                <a class="mega-promo" href="collection.html?c=cotton">
                  <img src="${img(byId("jade-blossom").img, 600)}" alt="" loading="lazy">
                  <div><small>Just landed</small><b>100% cotton prints</b><span class="link-u">Shop the drop ${icon("arrow-right")}</span></div>
                </a>
              </div>
            </div>
          </li>
          <li><a class="nav-link" href="collection.html?c=cotton">Cotton <span class="hot">New</span></a></li>
          <li><a class="nav-link" href="collection.html?c=italian">Luxury</a></li>
          <li><a class="nav-link" href="collection.html?c=comforter">Comforters</a></li>
          <li><a class="nav-link" href="collection.html?c=mat">Floor mats</a></li>
          <li><a class="nav-link" href="index.html#journal">Journal</a></li>
        </ul>
      </nav>
      <div class="h-actions">
        <button class="h-search" data-open="search" aria-label="Search">${icon("magnifying-glass")}<span>Search prints, sizes…</span></button>
        <a class="h-btn hide-m" href="https://thealiving.in/account" aria-label="Account">${icon("user")}</a>
        <button class="h-btn hide-m" data-open="wish" aria-label="Wishlist">${icon("heart")}<span class="h-count" id="wishCount"></span></button>
        <button class="h-btn" data-open="cart" aria-label="Cart">${icon("handbag")}<span class="h-count" id="cartCount"></span></button>
      </div>
    </div>
  </header>`;
}

/* ---------- Overlays ---------- */
function overlaysHTML() {
  return `
  <div class="scrim" id="scrim"></div>

  <aside class="drawer left" id="menu" aria-label="Menu" aria-hidden="true">
    <div class="drawer-head"><a href="index.html" class="logo"><b>THEA</b><small>The House of Comfort Living</small></a><button class="x-btn" data-close aria-label="Close menu">${icon("x")}</button></div>
    <div class="drawer-body">
      <div class="m-tiles">
        <a href="collection.html?c=king"><img src="assets/img/cat-king.jpg" alt="" loading="lazy"><span>King</span></a>
        <a href="collection.html?c=double"><img src="assets/img/cat-double.jpg" alt="" loading="lazy"><span>Double</span></a>
      </div>
      <ul class="m-nav">
        <li><details><summary>${icon("bed", "", "duo")} Bedsheets ${icon("caret-down", "chev")}</summary>
          <a href="collection.html?c=all">All bedding</a>
          <a href="collection.html?c=king">King · 100×108 in</a>
          <a href="collection.html?c=double">Double · 90×100 in</a>
          <a href="collection.html?c=italian">Super King · 108×108 in</a>
          <a href="collection.html?c=300tc">Solid cotton 300TC</a>
        </details></li>
        <li><a href="collection.html?c=cotton">${icon("leaf", "", "duo")} 100% cotton <span class="badge" style="position:static;background:var(--haldi)">New</span></a></li>
        <li><a href="collection.html?c=comforter">${icon("cloud", "", "duo")} Comforters</a></li>
        <li><a href="collection.html?c=mat">${icon("square", "", "duo")} Floor mats</a></li>
        <li><a href="index.html#fit">${icon("ruler", "", "duo")} Size calculator</a></li>
        <li><a href="#" data-open="wish">${icon("heart", "", "duo")} Wishlist</a></li>
      </ul>
      <div class="m-contact">
        <a href="https://api.whatsapp.com/send?phone=918796146616&text=Hi">${icon("whatsapp-logo")} Chat on WhatsApp</a>
        <a href="tel:+918796146616">${icon("phone")} +91 87961 46616</a>
        <a href="https://thealiving.in/account">${icon("user")} My account</a>
      </div>
    </div>
  </aside>

  <aside class="drawer" id="cart" aria-label="Cart" aria-hidden="true">
    <div class="drawer-head"><h3>${icon("handbag")} Your cart</h3><button class="x-btn" data-close aria-label="Close cart">${icon("x")}</button></div>
    <div class="drawer-body" id="cartBody"></div>
    <div class="drawer-foot" id="cartFoot"></div>
  </aside>

  <aside class="drawer" id="wish" aria-label="Wishlist" aria-hidden="true">
    <div class="drawer-head"><h3>${icon("heart")} Saved for later</h3><button class="x-btn" data-close aria-label="Close wishlist">${icon("x")}</button></div>
    <div class="drawer-body" id="wishBody"></div>
  </aside>

  <div class="search-panel" id="search" role="dialog" aria-label="Search" aria-hidden="true">
    <div class="wrap">
      <div class="search-bar">
        ${icon("magnifying-glass")}
        <input type="search" id="searchInput" placeholder="Search prints, colours, sizes" autocomplete="off" aria-label="Search products">
        <button class="x-btn" data-close aria-label="Close search">${icon("x")}</button>
      </div>
      <div class="search-sugg">
        <h5>Popular searches</h5>
        <div class="chips" id="searchChips">
          ${[["King size", "bed"], ["Double", "bed"], ["Cotton", "leaf"], ["Blue", "drop"], ["Floral", "flower-lotus"], ["Italian", "crown"], ["Fitted", "arrows-in"], ["Comforter", "cloud"]].map(([t, i]) => `<button class="chip" data-sq="${t}">${icon(i)} ${t}</button>`).join("")}
        </div>
        <h5 id="sHead">Trending now</h5>
        <div class="s-results" id="searchResults"></div>
      </div>
    </div>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <div class="fab">
    <button class="to-top" id="toTop" aria-label="Back to top"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/></svg>${icon("arrow-up")}</button>
    <a class="wa" href="https://api.whatsapp.com/send?phone=918796146616&text=Hi" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon("whatsapp-logo", "", "fill")}</a>
  </div>`;
}

/* ---------- Footer + SEO block ---------- */
function footerHTML() {
  return `
  <footer class="footer" role="contentinfo">
    <div class="wrap">
      <div class="f-badges">
        <div>${icon("truck", "", "duo")}<div><b>Free shipping</b><span>On every order, pan India</span></div></div>
        <div>${icon("arrows-counter-clockwise", "", "duo")}<div><b>3-day exchange</b><span>Wrong size? We'll swap it</span></div></div>
        <div>${icon("hand-coins", "", "duo")}<div><b>Cash on delivery</b><span>Plus UPI, cards & wallets</span></div></div>
        <div>${icon("shield-check", "", "duo")}<div><b>Secure checkout</b><span>256-bit encrypted payments</span></div></div>
      </div>
      <div class="f-top">
        <div>
          <a href="index.html" class="logo" style="color:#fff"><b>THEA</b><small style="color:rgba(255,255,255,.6)">The House of Comfort Living</small></a>
          <p style="margin-top:20px;max-width:40ch">Bedsheets, comforters and floor mats designed in-house and made in India. Soft prints, honest prices, and bundles that make every room easy to refresh.</p>
          <div class="socials" style="margin-top:20px">
            <a href="https://www.instagram.com/thealiving.in/" target="_blank" rel="noopener" aria-label="THEA on Instagram">${icon("instagram-logo")}</a>
            <a href="https://in.pinterest.com/TheaLiving/" target="_blank" rel="noopener" aria-label="THEA on Pinterest">${icon("pinterest-logo")}</a>
            <a href="https://api.whatsapp.com/send?phone=918796146616&text=Hi" target="_blank" rel="noopener" aria-label="THEA on WhatsApp">${icon("whatsapp-logo")}</a>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="collection.html?c=all">All bedding</a></li>
            <li><a href="collection.html?c=king">King size bedsheets</a></li>
            <li><a href="collection.html?c=double">Double bedsheets</a></li>
            <li><a href="collection.html?c=cotton">100% cotton bedsheets</a></li>
            <li><a href="collection.html?c=italian">Italian embroidery</a></li>
            <li><a href="collection.html?c=comforter">AC comforters</a></li>
            <li><a href="collection.html?c=mat">Floor & bath mats</a></li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><a href="https://thealiving.in/pages/shipping-policy">Shipping & delivery</a></li>
            <li><a href="https://thealiving.in/pages/return-and-exchange-policy">Returns & exchange</a></li>
            <li><a href="https://thealiving.in/pages/refund-policy">Refund policy</a></li>
            <li><a href="index.html#fit">Size guide</a></li>
            <li><a href="index.html#faq">FAQs</a></li>
            <li><a href="https://thealiving.in/pages/contact">Contact us</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="https://thealiving.in/pages/about-us">Our story</a></li>
            <li><a href="https://thealiving.in/blogs/blog-posts">Journal</a></li>
            <li><a href="https://thealiving.in/pages/terms-and-conditions">Terms & conditions</a></li>
            <li><a href="https://thealiving.in/pages/privacy-policy">Privacy policy</a></li>
            <li><a href="https://thealiving.in/pages/disclaimer">Disclaimer</a></li>
          </ul>
        </div>
        <div>
          <h4>Talk to us</h4>
          <ul class="f-contact" itemscope itemtype="https://schema.org/Organization">
            <meta itemprop="name" content="Theatic Brands Private Limited">
            <li>${icon("envelope-simple")}<a href="mailto:care@thealiving.in" itemprop="email">care@thealiving.in</a></li>
            <li>${icon("phone")}<span><a href="tel:+918796146616" itemprop="telephone">+91 87961 46616</a><br><small>Mon–Fri, 10 am – 5 pm IST</small></span></li>
            <li>${icon("map-pin")}<span itemprop="address">H. No 4165, First Floor, Aradhya Homes, Ansal Versalia, Sector 67 & 67A, Faridabad, Haryana 122101, India</span></li>
          </ul>
        </div>
      </div>
      <div class="f-bottom">
        <span>© 2026 Theatic Brands Private Limited. All rights reserved.</span>
        <div class="pay" aria-label="Payment methods">
          <span>${icon("qr-code")} UPI</span><span>${icon("credit-card")} Visa</span><span>${icon("credit-card")} Mastercard</span><span>${icon("credit-card")} RuPay</span><span>${icon("money")} COD</span>
        </div>
      </div>
    </div>
  </footer>
  ${seoHTML()}`;
}

function seoHTML() {
  const s = (window.PAGE_SEO && window.PAGE_SEO()) || SEO_CONTENT.home;
  return `
  <section class="seo" aria-labelledby="seoH">
    <div class="wrap">
      <h2 id="seoH">${s.title}</h2>
      <div class="seo-body" id="seoBody">${s.html}</div>
      <button class="seo-toggle" id="seoToggle" aria-expanded="false" aria-controls="seoBody">Read more ${icon("caret-down")}</button>
      <div class="seo-tags"><b>Popular searches</b>${SEO_CONTENT.tags.map(([t, u]) => `<a href="${u}">${t}</a>`).join("")}</div>
      <div class="copy"><span>THEA is a brand of Theatic Brands Private Limited, Faridabad, Haryana, India.</span><span>Prices in INR, inclusive of GST.</span></div>
    </div>
  </section>`;
}

/* ---------- Cart ---------- */
function renderCart() {
  const body = $("#cartBody"), foot = $("#cartFoot");
  if (!body) return;
  const lines = Cart.lines;
  if (!lines.length) {
    body.innerHTML = `<div class="empty">${icon("handbag", "", "duo")}<h4>Your cart is empty</h4><p>Pick any 2 bedsheets and the 50% bundle price applies on its own.</p><a class="btn btn-ink" href="collection.html?c=all">Shop bedsheets ${icon("arrow-right", "go")}</a></div>`;
    foot.innerHTML = ""; foot.style.display = "none"; return;
  }
  foot.style.display = "";
  const t = priceCart(lines);
  const next = t.sheets < 2 ? `${icon("gift", "", "fill")} Add <b>&nbsp;${2 - t.sheets} more bedsheet&nbsp;</b> for flat 50% off`
    : t.sheets < 3 ? `${icon("gift", "", "fill")} Add <b>&nbsp;1 more bedsheet&nbsp;</b> to unlock 56% off`
    : `${icon("confetti", "", "fill")} You've unlocked the <b>&nbsp;best price: 56% off</b>`;
  const inCart = new Set(lines.map(l => l.id));
  const ups = t.sheets < 3 ? PRODUCTS.filter(p => p.isBedsheet && p.stock && !inCart.has(p.id)).slice(0, 6) : [];
  body.innerHTML = `
    <div class="ship-note">${icon("truck", "", "fill")} Free shipping unlocked</div>
    <div class="bundle-meter">
      <p>${next}</p>
      <div class="meter">${[1, 2, 3].map(i => `<i class="${t.sheets >= i ? "on" : ""}"></i>`).join("")}</div>
      <div class="meter-labels"><span>1 sheet</span><span>2 · 50% off</span><span>3 · 56% off</span></div>
    </div>
    ${lines.map((l, i) => { const pr = byId(l.id); if (!pr) return ""; return `
      <div class="c-line">
        <a href="product.html?id=${pr.id}"><img src="${img(pr.img, 200)}" alt="${pr.name}"></a>
        <div>
          <h4>${pr.name}</h4>
          <small>${SIZES[pr.size].label} · ${l.variant}</small>
          <div class="qty" role="group" aria-label="Quantity for ${pr.name}">
            <button data-cq="${i}" data-d="-1" aria-label="Decrease">${icon("minus")}</button><span>${l.qty}</span><button data-cq="${i}" data-d="1" aria-label="Increase">${icon("plus")}</button>
          </div>
          <div><button class="rm" data-rm="${i}">${icon("trash")} Remove</button></div>
        </div>
        <b>${inr(pr.price * l.qty)}</b>
      </div>`; }).join("")}
    ${ups.length ? `<div class="c-up"><h5>Add one more to save</h5><div class="c-up-row">${ups.map(p => `<div><a href="product.html?id=${p.id}"><img src="${img(p.img, 300)}" alt="${p.name}" loading="lazy"></a><span>${p.name}</span><button data-add="${p.id}" data-variant="${p.types[0]}">${icon("plus-circle")} Add · ${inr(p.price)}</button></div>`).join("")}</div></div>` : ""}`;
  foot.innerHTML = `
    <div class="c-sum"><span>Subtotal</span><span>${inr(t.subtotal)}</span></div>
    ${t.bundle ? `<div class="c-sum save"><span>Bundle ${t.bundle.code} (${t.bundle.pct}% off sheets)</span><span>−${inr(t.save)}</span></div>` : ""}
    <div class="c-sum"><span>Shipping</span><span>Free</span></div>
    <div class="c-sum total"><span>Total</span><span>${inr(t.total)}</span></div>
    <a class="btn btn-ink btn-block" href="https://thealiving.in/cart">${icon("lock-simple")} Check out · ${inr(t.total)}</a>
    <div class="c-trust"><span>${icon("shield-check")} Secure</span><span>${icon("qr-code")} UPI</span><span>${icon("money")} COD</span><span>${icon("arrows-counter-clockwise")} Easy exchange</span></div>`;
}

function renderWish() {
  const body = $("#wishBody"); if (!body) return;
  const items = Wish.ids.map(byId).filter(Boolean);
  body.innerHTML = items.length
    ? `<div class="grid cols-2">${items.map(x => card(x, { noPeek: true })).join("")}</div>`
    : `<div class="empty">${icon("heart", "", "duo")}<h4>Nothing saved yet</h4><p>Tap the heart on any print to keep it here while you decide.</p><a class="btn btn-ink" href="collection.html?c=all">Browse prints ${icon("arrow-right", "go")}</a></div>`;
}

function updateCounts(bump) {
  const c = $("#cartCount"), w = $("#wishCount");
  if (c) { c.textContent = Cart.count(); c.dataset.n = Cart.count(); if (bump) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); } }
  if (w) { w.textContent = Wish.ids.length; w.dataset.n = Wish.ids.length; }
}

/* ---------- Panels ---------- */
let lastFocus = null;
function openPanel(id) {
  closePanels(true);
  const el = document.getElementById(id); if (!el) return;
  lastFocus = document.activeElement;
  el.classList.add("on"); el.setAttribute("aria-hidden", "false");
  $("#scrim").classList.add("on");
  document.body.style.overflow = "hidden"; window.lenis?.stop();
  if (id === "search") { runSearch($("#searchInput").value); setTimeout(() => $("#searchInput").focus(), 250); }
  else setTimeout(() => (el.querySelector("[data-close]") || el).focus?.(), 60);
}
function closePanels(silent) {
  $$(".drawer.on, .search-panel.on, .filters.on, .size-modal.on").forEach(el => { el.classList.remove("on"); if (!el.classList.contains("filters")) el.setAttribute("aria-hidden", "true"); });
  $("#scrim")?.classList.remove("on");
  document.body.style.overflow = ""; window.lenis?.start();
  if (!silent) lastFocus?.focus?.();
}

let toastT;
function toast(html) {
  const t = $("#toast"); t.innerHTML = html; t.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 3400);
}

function addToCart(id, variant, qty = 1, silent = false) {
  const pr = byId(id); if (!pr || !pr.stock) return;
  Cart.add(id, variant || pr.types[0], qty);
  if (silent) return;
  const t = priceCart(Cart.lines);
  const msg = t.sheets === 1 && pr.isBedsheet ? "Added. Add 1 more bedsheet for 50% off" : t.bundle ? `Added. ${t.bundle.pct}% bundle price applied` : "Added to cart";
  toast(`${icon("check-circle", "", "fill")} ${msg} <a href="#" data-open="cart">View cart</a>`);
}

/* ---------- Search ---------- */
function runSearch(q) {
  const out = $("#searchResults"), head = $("#sHead"); q = (q || "").trim().toLowerCase();
  let hits;
  if (!q) { head.textContent = "Trending now"; hits = PRODUCTS.filter(p => p.badge || p.rating).slice(0, 6); }
  else {
    const words = q.replace("size", "").split(/\s+/).filter(Boolean);
    hits = PRODUCTS.filter(pr => {
      const hay = [pr.title, pr.color.name, pr.style, SIZES[pr.size].label, pr.material, pr.types.join(" "), pr.collections.join(" ")].join(" ").toLowerCase();
      return words.every(w => hay.includes(w));
    }).slice(0, 12);
    head.textContent = hits.length ? `${hits.length} result${hits.length > 1 ? "s" : ""}` : "No results";
  }
  out.innerHTML = hits.length
    ? hits.map(pr => `<a class="s-item" href="product.html?id=${pr.id}"><img src="${img(pr.img, 200)}" alt=""><div><b>${pr.name}</b><span>${SIZES[pr.size].label} · ${inr(pr.price)}</span></div></a>`).join("")
    : `<p style="color:var(--muted)">No prints match “${q}”. Try a colour like blue or a size like king.</p>`;
}

/* ---------- UI enhancers (used by pages) ---------- */
function initSeg(seg) {
  if (!seg) return;
  let ind = seg.querySelector(".seg-ind");
  if (!ind) { ind = document.createElement("span"); ind.className = "seg-ind"; seg.prepend(ind); }
  const move = () => {
    const b = seg.querySelector('[aria-selected="true"]'); if (!b) return;
    ind.style.width = b.offsetWidth + "px";
    ind.style.transform = `translateX(${b.offsetLeft}px)`;
  };
  move(); new ResizeObserver(move).observe(seg);
  seg.addEventListener("click", e => { if (e.target.closest("button")) requestAnimationFrame(move); });
  seg._move = move;
}
function initRail(rail) {
  if (!rail || rail._init) return; rail._init = true;
  const bar = rail.parentElement.querySelector(".rail-bar i");
  const upd = () => {
    if (!bar) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const vis = rail.clientWidth / rail.scrollWidth;
    bar.style.width = Math.max(10, vis * 100) + "%";
    bar.style.transform = `translateX(${max > 0 ? rail.scrollLeft / max * (1 / vis - 1) * 100 : 0}%)`;
  };
  rail.addEventListener("scroll", upd, { passive: true }); upd(); new ResizeObserver(upd).observe(rail);
  // Mouse drag to scroll (desktop)
  let down = false, sx = 0, sl = 0, moved = false;
  rail.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
  window.addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; rail.classList.add("dragging"); } rail.scrollLeft = sl - dx; });
  window.addEventListener("pointerup", () => { if (!down) return; down = false; setTimeout(() => rail.classList.remove("dragging"), 0); });
  rail.addEventListener("click", e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
}
let revealIO;
function initReveal(root = document) {
  if (reduceMotion || !("IntersectionObserver" in window)) { $$(".rv", root).forEach(el => el.classList.add("in")); return; }
  revealIO = revealIO || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: .08 });
  $$(".rv:not(.in)", root).forEach(el => revealIO.observe(el));
}
function countUp(el) {
  const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = end.toFixed(dec) + suf; return; }
  const t0 = performance.now(), dur = 1600;
  const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = (end * e).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function initCounters() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); } }), { threshold: .5 });
  $$("[data-count]").forEach(el => io.observe(el));
}

/* ---------- SEO helpers (meta + JSON-LD) for JS-rendered pages ---------- */
function setMeta({ title, description, canonical, image, keywords, type }) {
  if (title) { document.title = title; setTag("property", "og:title", title); setTag("name", "twitter:title", title); }
  if (description) { setTag("name", "description", description); setTag("property", "og:description", description); setTag("name", "twitter:description", description); }
  if (keywords) setTag("name", "keywords", keywords);
  if (image) { setTag("property", "og:image", image); setTag("name", "twitter:image", image); }
  if (type) setTag("property", "og:type", type);
  if (canonical) {
    setTag("property", "og:url", canonical);
    let l = document.querySelector('link[rel="canonical"]'); if (!l) { l = document.createElement("link"); l.rel = "canonical"; document.head.appendChild(l); }
    l.href = canonical;
  }
}
function setTag(attr, key, val) {
  let m = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!m) { m = document.createElement("meta"); m.setAttribute(attr, key); document.head.appendChild(m); }
  m.setAttribute("content", val);
}
function addJSONLD(obj, id) {
  let s = id && document.getElementById(id);
  if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; if (id) s.id = id; document.head.appendChild(s); }
  s.textContent = JSON.stringify(obj);
}
function productLD(pr) {
  const s = SIZES[pr.size];
  const ld = {
    "@type": "Product", "@id": `${SITE}/products/${pr.id}#product`,
    name: pr.title, image: [pr.img], sku: `THEA-${pr.id.toUpperCase()}`, brand: { "@type": "Brand", name: "THEA" },
    description: `${pr.name} ${s.label} ${pr.isBedsheet ? `bedsheet set (${s.dims}) with ${s.pillow}` : s.dims}. ${pr.material}. Made in India.`,
    material: pr.material, color: pr.color.name, size: s.dims, category: pr.isBedsheet ? "Home & Garden > Linens & Bedding > Bedding > Bed Sheets" : "Home & Garden > Linens & Bedding",
    offers: {
      "@type": "Offer", url: `${SITE}/products/${pr.id}`, priceCurrency: "INR", price: pr.price,
      availability: pr.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "THEA" },
      shippingDetails: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" }, shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" }, deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" }, transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 6, unitCode: "DAY" } } },
      hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy", applicableCountry: "IN", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: 3, returnMethod: "https://schema.org/ReturnByMail", returnFees: "https://schema.org/FreeReturn" }
    }
  };
  if (pr.rating && pr.reviews) ld.aggregateRating = { "@type": "AggregateRating", ratingValue: pr.rating, reviewCount: pr.reviews, bestRating: 5 };
  return ld;
}
const crumbLD = items => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: url })) });
const faqLD = list => ({ "@type": "FAQPage", mainEntity: list.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) });

/* ---------- Smooth scroll (Lenis) + scroll helpers ---------- */
function smoothTo(target, offset = 0) {
  if (window.lenis) window.lenis.scrollTo(target, { offset, duration: 1.1 });
  else { const y = typeof target === "number" ? target : target.getBoundingClientRect().top + scrollY + offset; scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" }); }
}
function initSmoothScroll() {
  // Lenis gives inertial, frame-synced wheel scrolling on desktop; touch devices keep native scrolling.
  if (reduceMotion || typeof Lenis === "undefined" || !matchMedia("(pointer: fine)").matches) return;
  window.lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true, anchors: { offset: -96 } });
}
// Pause decorative loops (marquees, spinning text) while they are off screen
function pauseOffscreen() {
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("offscreen", !e.isIntersecting)), { rootMargin: "100px" });
  $$(".marquee, .rv-row, .fab-visual, .look-media").forEach(el => io.observe(el));
}

/* ---------- Preloader ---------- */
function finishPreloader() {
  const pl = $("#preloader"); if (!pl) return;
  const quick = pl.classList.contains("quick");
  const minT = quick ? 350 : 1900;
  const go = () => {
    const wait = Math.max(0, minT - (performance.now() - (window.__t0 || 0)));
    setTimeout(() => { pl.classList.add("done"); document.body.classList.remove("loading"); document.dispatchEvent(new Event("thea:ready")); try { sessionStorage.setItem("thea_seen", "1"); } catch {} }, wait);
  };
  document.readyState === "complete" ? go() : window.addEventListener("load", go, { once: true });
  setTimeout(go, 4000); // never block longer than 4s on slow networks
}

/* ---------- Boot ---------- */
function boot() {
  document.body.insertAdjacentHTML("afterbegin", headerHTML());
  document.body.insertAdjacentHTML("beforeend", footerHTML() + overlaysHTML());
  renderCart(); renderWish(); updateCounts();
  // scrollable overlays keep their own native scrolling under Lenis
  $$(".drawer-body, .search-panel, .f-scroll, .size-modal .box, .thumbs, .c-up-row").forEach(el => el.setAttribute("data-lenis-prevent", ""));
  initSmoothScroll(); pauseOffscreen();
  finishPreloader();

  // Announcement rotator
  const ann = $$(".announce-track a"); let ai = 0;
  const showAnn = d => { ann[ai].classList.remove("on"); ai = (ai + d + ann.length) % ann.length; ann[ai].classList.add("on"); };
  let annT = setInterval(() => showAnn(1), 4500);
  $$("[data-ann]").forEach(b => b.addEventListener("click", () => { clearInterval(annT); showAnn(+b.dataset.ann); }));

  // Header: transparent at top of full-bleed heroes, hides on scroll down, returns on scroll up
  const hd = $("#header"); let lastY = scrollY;
  const toTop = $("#toTop"), ring = toTop.querySelector("circle");
  let maxScroll = document.documentElement.scrollHeight - innerHeight, ticking = false;
  new ResizeObserver(() => { maxScroll = document.documentElement.scrollHeight - innerHeight; }).observe(document.body);
  const onScroll = () => {
    ticking = false;
    const y = scrollY, hasHero = document.body.classList.contains("has-hero");
    hd.classList.toggle("top", hasHero && y < 40);
    document.body.classList.toggle("at-top", y < innerHeight * .6);
    hd.classList.toggle("scrolled", y > 38);
    hd.classList.toggle("hide", y > 500 && y > lastY + 4 && !document.body.style.overflow);
    if (y < lastY - 4 || y < 500) hd.classList.remove("hide");
    lastY = y;
    toTop.classList.toggle("on", y > 800);
    ring.style.strokeDashoffset = 151 - 151 * Math.min(1, y / maxScroll);
  };
  if (!document.body.classList.contains("has-hero")) hd.classList.remove("top");
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
  toTop.addEventListener("click", () => smoothTo(0));

  // Delegated clicks
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-open],[data-close],[data-add],.wish,[data-sq],[data-cq],[data-rm],#scrim,[data-size-chart],[data-rail]");
    if (!t) { if (e.target.classList?.contains("size-modal")) closePanels(); return; }
    if (t.id === "scrim" || t.hasAttribute("data-close")) { closePanels(); return; }
    if (t.dataset.open) { e.preventDefault(); openPanel(t.dataset.open); return; }
    if (t.hasAttribute("data-size-chart")) { e.preventDefault(); openPanel("sizeModal"); return; }
    if (t.dataset.add) { e.preventDefault(); addToCart(t.dataset.add, t.dataset.variant); return; }
    if (t.classList.contains("wish")) {
      e.preventDefault();
      const on = Wish.toggle(t.dataset.id);
      toast(on ? `${icon("heart", "", "fill")} Saved to wishlist <a href="#" data-open="wish">View</a>` : "Removed from wishlist");
      return;
    }
    if (t.dataset.sq) { $("#searchInput").value = t.dataset.sq; runSearch(t.dataset.sq); return; }
    if (t.dataset.cq !== undefined) { const i = +t.dataset.cq; Cart.setQty(i, Cart.lines[i].qty + +t.dataset.d); return; }
    if (t.dataset.rm !== undefined) { Cart.setQty(+t.dataset.rm, 0); return; }
    if (t.dataset.rail) { const r = document.getElementById(t.dataset.rail); r.scrollBy({ left: +t.dataset.dir * r.clientWidth * .85, behavior: "smooth" }); }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePanels(); if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openPanel("search"); } });
  $("#searchInput").addEventListener("input", e => runSearch(e.target.value));

  // Newsletter (any page)
  document.addEventListener("submit", e => {
    if (!e.target.matches(".news")) return;
    e.preventDefault(); e.target.reset();
    toast(`${icon("envelope-simple-open", "", "fill")} Subscribed. Watch your inbox for the next drop.`);
  });

  // SEO block toggle
  $("#seoToggle").addEventListener("click", e => {
    const s = e.currentTarget.closest(".seo"); const open = s.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
    e.currentTarget.innerHTML = `${open ? "Show less" : "Read more"} ${icon("caret-down")}`;
  });

  $$("[data-dir='-1']").forEach(b => { if (!b.innerHTML.trim()) b.innerHTML = icon("arrow-left"); });
  $$("[data-dir='1']").forEach(b => { if (!b.innerHTML.trim()) b.innerHTML = icon("arrow-right"); });
  $$(".x-btn").forEach(b => { if (!b.innerHTML.trim()) b.innerHTML = icon("x"); });
}
boot();
