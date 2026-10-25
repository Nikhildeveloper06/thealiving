/* =========================================================================
   THEA — product page
   ========================================================================= */
(() => {
  const pr = byId(qs("id")) || byId("blue-empress");
  const S = SIZES[pr.size];
  let variant = pr.types[0], qty = 1;
  const url = `${SITE}/products/${pr.id}`;
  const colKey = pr.size === "double" ? "double" : pr.size === "comforter" ? "comforter" : pr.size === "mat" ? "mat" : pr.collections.includes("italian") ? "italian" : pr.collections.includes("300tc") ? "300tc" : pr.collections.includes("cotton") ? "cotton" : "king";

  /* ---- SEO: meta + JSON-LD ---- */
  const pFaq = [
    [`What size is the ${pr.name} ${pr.isBedsheet ? "bedsheet" : ""}?`, pr.isBedsheet ? `The bedsheet measures ${S.dims} and comes with ${S.pillow}. ${S.fits}.` : `${S.label}: ${S.dims}. ${S.fits}.`],
    [`What fabric is the ${pr.name} made of?`, `${pr.material}. ${pr.material.toLowerCase().includes("cotton") ? "It is breathable and soft, ideal for warm weather." : "It is soft, lightweight, fade resistant and shrink free."}`],
    ...(pr.isBedsheet ? [[`Is ${pr.name} available as a fitted sheet?`, pr.types.includes("Fitted/Elastic") ? "Yes. Choose Fitted/Elastic for elastic corners that grip mattresses up to 8 in deep, or Flat for a classic tuck." : "This design is available as a flat sheet only. It tucks under the mattress on all sides."]] : []),
    FAQS[4], FAQS[6], FAQS[7]
  ];
  setMeta({
    title: `${pr.name} ${pr.isBedsheet ? `${S.label} Size Bedsheet Set with 2 Pillow Covers` : S.label} | ${inr(pr.price)} | THEA`,
    description: `${pr.name} ${S.label.toLowerCase()} ${pr.isBedsheet ? `bedsheet set (${S.dims}) with ${S.pillow}` : `(${S.dims})`}. ${pr.material}, ${pr.color.name.toLowerCase()} ${pr.style.toLowerCase()} design. ${inr(pr.price)}${pr.isBedsheet ? ", buy 2 get 50% off" : ""}. Free shipping in India.`,
    keywords: `${pr.name} bedsheet, ${S.label.toLowerCase()} size bedsheet, ${pr.color.name.toLowerCase()} ${pr.style.toLowerCase()} bedsheet, ${pr.material.toLowerCase()} bedsheet, ${KEYWORDS[colKey] || ""}`,
    canonical: url, image: pr.img, type: "product"
  });
  setTag("property", "product:price:amount", String(pr.price));
  setTag("property", "product:availability", pr.stock ? "in stock" : "out of stock");
  addJSONLD({ "@context": "https://schema.org", "@graph": [productLD(pr), crumbLD([["Home", SITE + "/"], [COLLECTIONS[colKey].title, `${SITE}/collections/${colKey}`], [pr.name, url]]), faqLD(pFaq)] }, "ld-product");

  /* ---- Breadcrumb ---- */
  $("#crumbs").innerHTML = `<a href="index.html">Home</a>${icon("caret-right")}<a href="collection.html?c=${colKey}">${COLLECTIONS[colKey].title}</a>${icon("caret-right")}<span aria-current="page">${pr.name}</span>`;

  /* ---- Gallery ---- */
  const gallery = [
    { src: img(pr.img, 1200), alt: `${pr.name} ${S.label} bedsheet set on a made bed`, pos: "50% 50%", scale: 1 },
    { src: img(pr.img, 1200), alt: `Close-up of the ${pr.name} print`, pos: "50% 72%", scale: 2.4 },
    { src: img(pr.img, 1200), alt: `${pr.name} pillow covers`, pos: "50% 32%", scale: 1.9 },
    { src: img(pr.img, 1200), alt: `${pr.name} corner drape`, pos: "15% 85%", scale: 2 }
  ];
  if (pr.size === "king") gallery.push({ src: CDN + "King_Bed_Size_Guide_Infographic.png?v=1791872792", alt: "King bed size guide infographic", pos: "50% 50%", scale: 1 });
  if (pr.isBedsheet && pr.types.includes("Flat")) gallery.push({ src: CDN + "Flat_king_Bedsheet_2000_x_2000_px.png?v=1788261283", alt: "How a flat bedsheet fits the mattress", pos: "50% 50%", scale: 1 });

  let gi = 0;
  const mainPic = $("#mainPic"), mainBox = $("#mainImg");
  function showImg(i, instant) {
    gi = (i + gallery.length) % gallery.length;
    const g = gallery[gi];
    const apply = () => {
      mainPic.src = g.src; mainPic.alt = g.alt;
      mainPic.style.transformOrigin = g.pos;
      mainPic.style.transform = g.scale > 1 ? `scale(${g.scale})` : "";
      mainPic.classList.remove("swap");
    };
    if (instant) apply(); else { mainPic.classList.add("swap"); setTimeout(apply, 180); }
    $$("#thumbs button").forEach((b, j) => b.setAttribute("aria-current", j === gi));
    $("#gCount").textContent = `${gi + 1} / ${gallery.length}`;
  }
  $("#thumbs").innerHTML = gallery.map((g, i) => `<button role="listitem" aria-label="Image ${i + 1}: ${g.alt}" data-gi="${i}"><img src="${g.src.replace("_1200x1200", "_200x200")}" alt="" loading="lazy" style="transform-origin:${g.pos};${g.scale > 1 ? `transform:scale(${g.scale})` : ""}"></button>`).join("");
  $("#thumbs").addEventListener("click", e => { const b = e.target.closest("[data-gi]"); if (b) showImg(+b.dataset.gi); });
  $(".g-nav.prev").addEventListener("click", e => { e.stopPropagation(); showImg(gi - 1); });
  $(".g-nav.next").addEventListener("click", e => { e.stopPropagation(); showImg(gi + 1); });
  mainBox.addEventListener("mousemove", e => {
    if (e.target.closest("button") || matchMedia("(hover: none)").matches) return;
    const r = mainBox.getBoundingClientRect();
    mainPic.style.transform = `scale(${Math.max(2.2, gallery[gi].scale + .6)})`;
    mainPic.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`;
  });
  mainBox.addEventListener("mouseleave", () => showImg(gi, true));
  let sx = 0;
  mainBox.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  mainBox.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) showImg(gi + (dx < 0 ? 1 : -1)); });
  document.addEventListener("keydown", e => { if (/input|textarea/i.test(document.activeElement.tagName)) return; if (e.key === "ArrowRight") showImg(gi + 1); if (e.key === "ArrowLeft") showImg(gi - 1); });
  showImg(0, true);

  const wishBtn = $("#pdpWish");
  wishBtn.dataset.id = pr.id; wishBtn.innerHTML = icon("heart", "", Wish.has(pr.id) ? "fill" : ""); wishBtn.setAttribute("aria-pressed", Wish.has(pr.id));
  $("#shareBtn").addEventListener("click", async () => {
    const data = { title: pr.name + " · THEA", text: `${pr.name}, ${inr(pr.price)}`, url: location.href };
    try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(location.href); toast(`${icon("link", "", "fill")} Link copied`); } } catch {}
  });

  /* ---- Title & price ---- */
  $("#pTitle").textContent = pr.name;
  $("#pSub").textContent = pr.size === "comforter" || pr.size === "mat" ? pr.title : `${S.label} bedsheet set · 1 bedsheet + ${S.pillow}`;
  $("#pPrice").textContent = inr(pr.price);
  $("#mPrice").setAttribute("content", pr.price);
  $("#pPer2").textContent = pr.isBedsheet ? `${inr(pr.price / 2)} each in any 2` : "";
  if (!pr.isBedsheet) $("#pPer2").hidden = true;
  const viewers = 8 + (pr.id.length * 7) % 17; // stable per product, demo social proof
  $("#ratingLine").innerHTML =
    (pr.badge === "Bestseller" ? `<span class="badge dark">${icon("crown", "", "fill")} Bestseller</span>` : pr.badge ? `<span class="badge" style="background:var(--haldi)">${icon("sparkle", "", "fill")} ${pr.badge}</span>` : "") +
    (pr.rating ? `<a href="#reviews" class="stars">${starRow(pr.rating)} ${pr.rating.toFixed(1)} <span>· ${pr.reviews} review${pr.reviews > 1 ? "s" : ""}</span></a>` : `<a href="#reviews" class="stars"><span>Be the first to review</span></a>`) +
    (pr.stock ? `<span class="viewers"><i class="dot"></i>${viewers} people viewing now</span>` : `<span class="badge oos">${icon("clock")} Back soon</span>`);
  $("#specRow").innerHTML = `
    <div><small>${icon("ruler")} Size</small><b>${S.dims}</b></div>
    <div><small>${icon("needle")} Fabric</small><b>${(m => m[0].toUpperCase() + m.slice(1))(pr.material.replace("Premium ", "").split(",")[0])}</b></div>
    <div><small>${icon("palette")} Colour</small><b>${pr.color.name}</b></div>`;

  /* ---- Type pills ---- */
  const typeInfo = { "Flat": ["Tucks under the mattress", "rectangle"], "Fitted/Elastic": ["Elastic corners, up to 8 in deep", "arrows-in"], "Double": ["For double & queen beds", "bed"], "Standard": ["Bath & bedroom size", "square"] };
  function renderTypes() {
    $("#typeName").textContent = variant;
    $("#typePills").innerHTML = pr.types.map(t => `<button class="pill" role="radio" aria-checked="${t === variant}" data-type="${t}">${icon((typeInfo[t] || [])[1] || "check", "", "duo")}${t}<small>${(typeInfo[t] || [""])[0]}</small></button>`).join("");
  }
  $("#typePills").addEventListener("click", e => { const b = e.target.closest("[data-type]"); if (b) { variant = b.dataset.type; renderTypes(); } });
  renderTypes();

  /* ---- Siblings ---- */
  const family = pr.collections.includes("italian") ? "italian" : pr.collections.includes("300tc") ? "300tc" : pr.size === "comforter" ? "comforter" : pr.size === "mat" ? "mat" : pr.collections.includes("cotton") ? "cotton" : null;
  const sibs = family ? PRODUCTS.filter(x => COLLECTIONS[family].filter(x)) : PRODUCTS.filter(x => x.size === pr.size && !x.collections.includes("cotton")).slice(0, 8);
  $("#sibLabel").innerHTML = family && family !== "cotton" ? `Colour: <span>${pr.color.name}</span>` : "More prints in this size";
  $("#sibs").innerHTML = sibs.map(x => `<a href="product.html?id=${x.id}" aria-current="${x.id === pr.id}" title="${x.name}" aria-label="${x.name}"><img src="${img(x.img, 200)}" alt="" loading="lazy"></a>`).join("");
  if (sibs.length < 2) $("#sibBlock").hidden = true;

  /* ---- Deal picker ---- */
  if (!pr.isBedsheet) $("#bundleBlock").hidden = true;
  else {
    $("#qtyBox").hidden = true; $("#buyRow").style.gridTemplateColumns = "1fr";
    $("#bundlePick").innerHTML = [1, 2, 3].map(n => {
      const b = bundleFor(n), full = pr.price * n, now = b ? full * (1 - b.pct / 100) : full;
      return `<label class="b-opt">
        ${n === 2 ? `<span class="tag">Most picked</span>` : n === 3 ? `<span class="tag">Best value</span>` : ""}
        <input type="radio" name="deal" value="${n}" ${n === 1 ? "checked" : ""}>
        <div><b>${n} ${n > 1 ? "sets" : "set"}</b><span>${b ? `${b.pct}% off · ${inr(now / n)} per set` : "Regular price"}</span></div>
        <div class="b-price"><b>${inr(now)}</b>${b ? `<br><s>${inr(full)}</s>` : ""}</div>
      </label>`;
    }).join("");
    $("#bundlePick").addEventListener("change", e => { qty = +e.target.value; updateBuy(); });
  }
  function updateBuy() {
    const b = pr.isBedsheet ? bundleFor(qty) : null;
    const total = pr.price * qty * (b ? 1 - b.pct / 100 : 1);
    $("#qVal").textContent = qty;
    $("#addBtn").innerHTML = !pr.stock ? `${icon("bell")} Notify me when back` : `${icon("handbag")} Add ${qty > 1 ? qty + " sets " : ""}to cart · ${inr(total)}`;
    $("#sbAdd").innerHTML = pr.stock ? `${icon("handbag")} Add` : "Notify me";
    $("#sbPrice").textContent = `${inr(total)}${b ? ` · ${b.pct}% off` : ""}`;
  }
  $("#qMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); updateBuy(); });
  $("#qPlus").addEventListener("click", () => { qty = Math.min(10, qty + 1); updateBuy(); });
  const doAdd = () => pr.stock ? addToCart(pr.id, variant, qty) : toast(`${icon("bell", "", "fill")} We'll let you know when ${pr.name} is back.`);
  $("#addBtn").addEventListener("click", doAdd); $("#sbAdd").addEventListener("click", doAdd);
  $("#buyNow").addEventListener("click", () => addToCart(pr.id, variant, qty, true));
  if (!pr.stock) $("#buyNow").hidden = true;
  updateBuy();

  /* ---- Offer codes ---- */
  $("#codes").innerHTML = [
    ...(pr.isBedsheet ? OFFERS.bundle.map(o => [o.text + ". Applied automatically", o.code]) : []),
    [OFFERS.codes[0].text, OFFERS.codes[0].code],
    ...(pr.collections.includes("300tc") ? [[OFFERS.codes[1].text, OFFERS.codes[1].code]] : []),
    [OFFERS.shipping + ", COD available", null]
  ].map(([t, c]) => `<div class="code">${icon(c ? "seal-percent" : "truck", "", "fill")}<span>${t}</span>${c ? `<button data-copy="${c}" aria-label="Copy code ${c}">${icon("copy")} ${c}</button>` : ""}</div>`).join("");
  $("#codes").addEventListener("click", e => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    navigator.clipboard?.writeText(b.dataset.copy).catch(() => {});
    b.classList.add("copied"); b.innerHTML = `${icon("check")} Copied`;
    setTimeout(() => { b.classList.remove("copied"); b.innerHTML = `${icon("copy")} ${b.dataset.copy}`; }, 1600);
  });

  /* ---- Pincode (demo — connect to Shiprocket/Delhivery serviceability API) ---- */
  $("#pinForm").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#pinIn").value.trim(), out = $("#pinOut");
    if (!/^[1-9]\d{5}$/.test(v)) { out.className = "pin-out err"; out.innerHTML = `${icon("warning-circle", "", "fill")} Enter a valid 6-digit pincode, for example 201310.`; return; }
    const metro = /^(11|12|20|40|56|60|70|50)/.test(v);
    const d = new Date(); d.setDate(d.getDate() + (metro ? 3 : 6));
    out.className = "pin-out ok";
    out.innerHTML = `${icon("truck", "", "fill")} Delivers by <b>&nbsp;${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</b>&nbsp;· Free · COD available`;
    store.set("thea_pin", v);
  });
  const savedPin = store.get("thea_pin", ""); if (savedPin) { $("#pinIn").value = savedPin; $("#pinForm").requestSubmit?.(); }

  /* ---- Features ---- */
  const cotton = pr.material.toLowerCase().includes("cotton");
  const feats = pr.size === "mat" ? [["drop", "Super absorbent"], ["shield-check", "Anti-slip backing"], ["stack", "Soft chenille pile"], ["sun", "Quick dry"]]
    : pr.size === "comforter" ? [["arrows-left-right", "Reversible, two colours"], ["stack", "150 GSM fill"], ["snowflake", "Made for AC rooms"], ["washing-machine", "Machine washable"]]
    : [[cotton ? "leaf" : "feather", cotton ? "Breathable 100% cotton" : "Buttery soft microfiber"], ["thermometer", "All-weather comfort"], ["drop-half", "Colour-fade resistant"], ["arrows-in-simple", "Shrink free"]];
  $("#feat").innerHTML = feats.map(([i, t]) => `<div>${icon(i, "", "duo")}${t}</div>`).join("");

  /* ---- Accordions ---- */
  const acc = [
    ["Description", "article", `<p>${pr.name} brings ${pr.style === "Solid" ? "a calm, solid tone" : `a ${pr.style.toLowerCase()} print`} to your bedroom${pr.isBedsheet ? `, cut generously at ${S.dims} so it drapes neatly on every side` : ""}. ${cotton ? "Soft, breathable cotton keeps you cool through warm Indian nights and gets softer with every wash." : "Lightweight, easy-care fabric that resists wrinkles, fading and shrinking, so it looks fresh wash after wash."}</p>`],
    ["What's in the box", "package", pr.isBedsheet
      ? `<table><tr><td>Bedsheet</td><td>1 × ${S.dims} (${variant})</td></tr><tr><td>Pillow covers</td><td>${S.pillow}</td></tr><tr><td>Fits</td><td>${S.fits}</td></tr></table>`
      : `<table><tr><td>Contents</td><td>1 × ${S.label}</td></tr><tr><td>Details</td><td>${S.dims}</td></tr></table>`],
    ["Material & care", "washing-machine", `<table><tr><td>Fabric</td><td>${pr.material}</td></tr></table>
      <div class="care"><div>${icon("drop")}Cold wash</div><div>${icon("hand-waving")}Gentle cycle</div><div>${icon("prohibit")}No bleach</div><div>${icon("sun-dim")}Shade dry</div><div>${icon("thermometer-simple")}Low iron</div></div>
      <p>Wash once before first use for the softest feel.</p>`],
    ["Shipping & returns", "truck", `<p>Free shipping on all orders across India. Dispatched within 24–48 hours. Cash on delivery and UPI available.</p><p>Easy 3-day return and exchange if the size isn't right. <a class="link-u" href="https://thealiving.in/pages/return-and-exchange-policy">Read the policy</a></p>`],
    ["Additional details", "info", `<table><tr><td>Brand</td><td>THEA, The House of Comfort Living</td></tr><tr><td>SKU</td><td>THEA-${pr.id.toUpperCase()}</td></tr><tr><td>Country of origin</td><td>India</td></tr><tr><td>Marketed by</td><td>Theatic Brands Private Limited, Faridabad, Haryana 122101</td></tr></table>`],
    ["Disclaimer", "warning-circle", `<p>Please check your mattress size against the size chart before ordering. Colours may look slightly different depending on your screen and lighting; this is not a manufacturing defect.</p>`]
  ];
  $("#acc").innerHTML = acc.map(([h, ic, b], i) => `<details ${i === 0 ? "open" : ""}><summary><span>${icon(ic, "", "duo")} ${h}</span> ${icon("plus")}</summary><div class="acc-body">${b}</div></details>`).join("");

  /* ---- Assurance ---- */
  $("#assure").innerHTML = [["truck", "Fast, free delivery", "Dispatched in 24–48 hrs"], ["paint-brush", "Rare & limited designs", "Drawn in-house"], ["arrows-counter-clockwise", "3-day exchange", "Easy size swaps"], ["flag", "100% made in India", "Quality checked"]]
    .map(([i, b, s]) => `<div class="rv">${icon(i, "", "duo")}<div><b>${b}</b><span>${s}</span></div></div>`).join("");
  $("#storyImg").src = img(pr.img, 1200);

  /* ---- Related ---- */
  const related = PRODUCTS.filter(x => x.id !== pr.id && x.stock && (x.size === pr.size || (pr.isBedsheet && x.isBedsheet)))
    .sort((a, b) => (b.size === pr.size) - (a.size === pr.size)).slice(0, 10);
  $("#relRail").innerHTML = related.map(x => card(x)).join("");
  initRail($("#relRail"));

  /* ---- Reviews ---- */
  const revs = pr.reviews ? REVIEWS.slice(0, pr.reviews) : [];
  const avg = pr.rating || 0;
  $("#revWrap").innerHTML = `
    <div>
      <span class="kicker">${icon("star")} Reviews</span>
      <h2 id="revH">Customer reviews</h2>
      ${revs.length ? `<p style="margin-top:16px;display:flex;align-items:center;gap:14px"><span style="font-family:var(--f-num);font-weight:300;letter-spacing:-.05em;font-size:3.4rem;line-height:1">${avg.toFixed(1)}</span><span><span class="stars">${starRow(avg)}</span><br><small style="color:var(--muted)">Based on ${pr.reviews} review${pr.reviews > 1 ? "s" : ""}</small></span></p>
      <div class="bars">${[5, 4, 3, 2, 1].map(s => { const c = Math.round(avg) === s ? revs.length : 0; return `<div><span>${s} ★</span><i><b style="width:${c / revs.length * 100}%"></b></i><span>${c}</span></div>`; }).join("")}</div>` : `<p class="lead" style="margin:12px 0 20px">No reviews yet. Your words help other shoppers choose.</p>`}
      <a class="btn btn-ink" href="mailto:care@thealiving.in?subject=Review: ${encodeURIComponent(pr.name)}">${icon("pencil-simple")} Write a review</a>
    </div>
    <div class="rev-list">
      ${revs.length ? revs.map(r => `<div class="rev"><div class="st">${starRow(avg)}</div><b>${r.title}</b><p>${r.text}</p><small>${r.name}, ${r.city} <span class="verified">${icon("seal-check", "", "fill")} Verified buyer</span></small></div>`).join("")
        : `<div class="empty" style="background:#fff;border-radius:var(--r-lg)">${icon("chat-circle-text", "", "duo")}<h4>Be the first to review</h4><p>Bought ${pr.name}? Tell other shoppers how it feels and fits.</p></div>`}
    </div>`;

  /* ---- Product FAQ ---- */
  $("#pFaq").innerHTML = pFaq.map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary>${q} ${icon("plus")}</summary><div class="ans"><p>${a}</p></div></details>`).join("");

  /* ---- Recently viewed ---- */
  const seen = store.get("thea_seen", []).filter(id => id !== pr.id && byId(id));
  if (seen.length) { $("#recentSec").hidden = false; $("#recentRail").innerHTML = seen.slice(0, 8).map(id => card(byId(id))).join(""); initRail($("#recentRail")); }
  store.set("thea_seen", [pr.id, ...seen].slice(0, 12));

  /* ---- Sticky buy bar (mobile/tablet) ---- */
  $("#sbImg").src = img(pr.img, 200); $("#sbName").textContent = pr.name;
  const sb = $("#stickyBuy");
  new IntersectionObserver(([e]) => { const on = !e.isIntersecting && e.boundingClientRect.top < 0; sb.classList.toggle("on", on); sb.setAttribute("aria-hidden", !on); }).observe($("#addBtn"));

  $$("#sizeTable tr[data-s]").forEach(r => r.classList.toggle("hl", r.dataset.s === pr.size));
  document.addEventListener("thea:ready", () => initReveal(), { once: true });
})();
