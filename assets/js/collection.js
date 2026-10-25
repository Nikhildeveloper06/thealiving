/* =========================================================================
   THEA — collection page: hero, filters, sort, URL state, load more, SEO
   ========================================================================= */
(() => {
  const key = COLLECTIONS[qs("c")] ? qs("c") : "all";
  const col = COLLECTIONS[key];
  const base = PRODUCTS.filter(col.filter);
  const PAGE = 12;
  let shown = PAGE;
  const SLUG = { all: "all-products", king: "king-bedsheets", double: "queen-bedsheets", cotton: "100-cotton-bedsheets", italian: "italian-embroidery-king-size-bedsheets", "300tc": "premium-cotton-300tc-bedsheets", comforter: "ac-comforters", mat: "floor-mats" };
  const canonical = `${SITE}/collections/${SLUG[key]}`;

  /* ---- Full-bleed hero ---- */
  $("#cTitle").textContent = col.title;
  $("#crumbTitle").textContent = col.title;
  $("#cIntro").textContent = col.intro;
  const heroImg = col.banner || (base[0] && img(base[0].img, 1600));
  if (heroImg) { $("#cBanner").src = heroImg; $("#cBanner").alt = `${col.title} by THEA`; }
  const minP = Math.min(...base.map(x => x.price));
  const rated = base.filter(x => x.rating && x.rating >= 3);
  $("#cStats").innerHTML = `
    <span>${icon("swatches", "", "fill")} ${base.length} designs</span>
    <span>${icon("tag", "", "fill")} From ${inr(minP)}</span>
    ${rated.length ? `<span>${icon("star", "", "fill")} Rated up to ${Math.max(...rated.map(x => x.rating)).toFixed(1)}</span>` : ""}
    <span>${icon("truck", "", "fill")} Free shipping</span>
    ${base.some(x => x.isBedsheet) ? `<span>${icon("gift", "", "fill")} Buy 2, 50% off</span>` : ""}`;
  const subs = ["all", "king", "double", "cotton", "italian", "300tc", "comforter", "mat"];
  $("#cSub").innerHTML = subs.map(k => `<a class="chip ${k === key ? "on" : ""}" href="collection.html?c=${k}" ${k === key ? 'aria-current="page"' : ""}>${COLLECTIONS[k].title}</a>`).join("");

  /* ---- SEO: meta + JSON-LD ---- */
  setMeta({
    title: `${col.title} Online in India | Buy 2 Get 50% Off | THEA`,
    description: `${col.intro} ${base.length} designs from ${inr(minP)}. Free shipping across India, COD, 3-day exchange.`,
    keywords: KEYWORDS[key] || KEYWORDS.all,
    canonical, image: base[0] ? base[0].img : undefined
  });
  const faqSet = key === "double" ? [FAQS[1], FAQS[2], FAQS[4], FAQS[6]] : key === "comforter" || key === "mat" ? [FAQS[3], FAQS[6], FAQS[7]] : [FAQS[0], FAQS[2], FAQS[3], FAQS[4], FAQS[5]];
  addJSONLD({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": canonical + "#page", url: canonical, name: col.title, description: col.intro, isPartOf: { "@id": SITE + "/#website" }, inLanguage: "en-IN",
        mainEntity: { "@type": "ItemList", numberOfItems: base.length, itemListElement: base.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/products/${p.id}`, name: p.title })) } },
      crumbLD([["Home", SITE + "/"], ["Bedding", SITE + "/collections/all-products"], [col.title, canonical]]),
      faqLD(faqSet)
    ]
  }, "ld-collection");
  $("#cFaq").innerHTML = faqSet.map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary>${q} ${icon("plus")}</summary><div class="ans"><p>${a}</p></div></details>`).join("");

  /* ---- Filters ---- */
  const fabricOf = x => x.material.includes("300") ? "Cotton 300TC" : x.material.includes("cotton") ? "100% cotton" : x.material.includes("Chenille") ? "Chenille" : "Microfiber";
  const groups = [
    { k: "size", label: "Size", ic: "bed", get: x => [SIZES[x.size].label] },
    { k: "type", label: "Bedsheet type", ic: "arrows-in", get: x => x.types, help: "Fitted sheets have elastic corners that grip the mattress" },
    { k: "fabric", label: "Fabric", ic: "needle", get: x => [fabricOf(x)] },
    { k: "style", label: "Style", ic: "flower-lotus", get: x => [x.style] }
  ];
  const KEYS = ["size", "type", "fabric", "style", "color"];
  const PRICE_CAP = Math.max(...base.map(x => x.price), 0);
  const state = { size: new Set(), type: new Set(), fabric: new Set(), style: new Set(), color: new Set(), max: PRICE_CAP, stock: false, sort: qs("sort") || "featured" };
  KEYS.forEach(k => (qs(k) || "").split(",").filter(Boolean).forEach(v => state[k].add(v)));

  function buildFilters() {
    const html = groups.map(g => {
      const counts = {};
      base.forEach(x => g.get(x).forEach(v => counts[v] = (counts[v] || 0) + 1));
      const vals = Object.keys(counts);
      if (vals.length < 2 && !state[g.k].size) return "";
      return `<details class="f-group" open>
        <summary><span>${icon(g.ic, "", "duo")} ${g.label}</span> ${icon("caret-down")}</summary>
        <div class="f-opts">${g.help ? `<small style="color:var(--muted);margin-bottom:4px">${g.help}</small>` : ""}
          ${vals.map(v => `<label class="check"><input type="checkbox" data-f="${g.k}" value="${v}" ${state[g.k].has(v) ? "checked" : ""}>${v}<em>${counts[v]}</em></label>`).join("")}
        </div></details>`;
    }).join("");
    const colors = {};
    base.forEach(x => colors[x.color.name] = colors[x.color.name] || x.color.hex);
    const colorHTML = Object.keys(colors).length > 1 ? `<details class="f-group" open><summary><span>${icon("palette", "", "duo")} Colour</span> ${icon("caret-down")}</summary>
      <div class="swatches">${Object.entries(colors).map(([n, h]) => `<button class="sw" data-color="${n}" aria-pressed="${state.color.has(n)}"><i style="background:${h}"></i>${n}</button>`).join("")}</div></details>` : "";
    const priceHTML = PRICE_CAP > 500 ? `<details class="f-group" open><summary><span>${icon("currency-inr", "", "duo")} Price</span> ${icon("caret-down")}</summary>
      <div class="price-range"><label class="sr-only" for="pmax">Maximum price</label>
      <input type="range" id="pmax" min="500" max="${PRICE_CAP}" step="100" value="${state.max}" style="--p:${(state.max - 500) / (PRICE_CAP - 500) * 100}%">
      <div><span>₹500</span><span id="pmaxOut">Up to ${inr(state.max)}</span></div></div></details>` : "";
    const stockHTML = `<details class="f-group" open><summary><span>${icon("package", "", "duo")} Availability</span> ${icon("caret-down")}</summary>
      <div class="f-opts"><label class="check"><input type="checkbox" id="fStock" ${state.stock ? "checked" : ""}>In stock only<em>${base.filter(x => x.stock).length}</em></label></div></details>`;
    $("#fScroll").innerHTML = html + colorHTML + priceHTML + stockHTML;
  }

  function filtered() {
    let list = base.filter(x =>
      groups.every(g => !state[g.k].size || g.get(x).some(v => state[g.k].has(v))) &&
      (!state.color.size || state.color.has(x.color.name)) && x.price <= state.max && (!state.stock || x.stock));
    const s = state.sort;
    if (s === "price-asc") list.sort((a, b) => a.price - b.price);
    if (s === "price-desc") list.sort((a, b) => b.price - a.price);
    if (s === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (s === "new") list.sort((a, b) => (b.badge === "New") - (a.badge === "New"));
    if (s === "featured") list.sort((a, b) => b.stock - a.stock);
    return list;
  }

  function syncURL() {
    const u = new URLSearchParams({ c: key });
    KEYS.forEach(k => state[k].size && u.set(k, [...state[k]].join(",")));
    if (state.sort !== "featured") u.set("sort", state.sort);
    history.replaceState(null, "", "?" + u.toString());
  }

  function render(animate = true) {
    const list = filtered(), n = list.length;
    $("#count").innerHTML = `<b>${n}</b> ${n === 1 ? "design" : "designs"}`;
    const active = KEYS.flatMap(k => [...state[k]].map(v => ({ k, v })));
    if (state.max < PRICE_CAP) active.push({ k: "max", v: `Under ${inr(state.max)}` });
    if (state.stock) active.push({ k: "stock", v: "In stock" });
    $("#activeF").innerHTML = active.length
      ? active.map(a => `<button class="chip" data-unf="${a.k}" data-v="${a.v}">${a.v} ${icon("x")}</button>`).join("") + `<button class="link-u" data-unf="all" style="font-size:.875rem">Clear all</button>`
      : "";
    $("#filterBtn").innerHTML = `${icon("sliders-horizontal")} Filter${active.length ? ` (${active.length})` : ""}`;

    if (!n) {
      $("#results").innerHTML = `<div class="no-res" style="grid-column:1/-1">${icon("magnifying-glass", "", "duo")}<h3>No designs match these filters</h3><p>Remove a filter or two to see more prints.</p><button class="btn btn-ink" data-unf="all">Clear all filters</button></div>`;
      $("#loadMore").innerHTML = ""; return;
    }
    const cards = list.slice(0, shown).map((x, i) => card(x, animate ? { cls: "in-grid", delay: (i % PAGE) * 45 } : {}));
    if (cards.length > 5 && list.some(x => x.isBedsheet)) {
      cards.splice(5, 0, `<aside class="promo-tile">
        <div><span class="big">50%</span><h3>off when you pick any two bedsheets</h3></div>
        <p>Mix sizes and prints. Pick three and it goes to 56% off. Applied in your cart, no code needed.</p>
        <a class="btn btn-haldi" href="index.html#bundle" style="align-self:flex-start">${icon("gift")} Build a bundle</a>
      </aside>`);
    }
    $("#results").innerHTML = cards.join("");
    const pct = Math.min(shown, n) / n * 100;
    $("#loadMore").innerHTML = `<small>Showing ${Math.min(shown, n)} of ${n}</small><div class="progress"><i style="width:${pct}%"></i></div>` +
      (shown < n ? `<button class="btn btn-line" id="moreBtn">${icon("arrow-down")} Show ${Math.min(PAGE, n - shown)} more</button>` : "");
    syncURL();
  }

  /* ---- Events ---- */
  const fs = $("#filters");
  const scrollToGrid = () => { const t = $(".toolbar").getBoundingClientRect().top + scrollY - 80; if (scrollY > t) smoothTo(t); };
  fs.addEventListener("change", e => {
    const t = e.target;
    if (t.dataset.f) t.checked ? state[t.dataset.f].add(t.value) : state[t.dataset.f].delete(t.value);
    if (t.id === "fStock") state.stock = t.checked;
    shown = PAGE; render(); scrollToGrid();
  });
  fs.addEventListener("input", e => {
    if (e.target.id !== "pmax") return;
    state.max = +e.target.value;
    e.target.style.setProperty("--p", (state.max - 500) / (PRICE_CAP - 500) * 100 + "%");
    $("#pmaxOut").textContent = `Up to ${inr(state.max)}`; shown = PAGE; render(false);
  });
  fs.addEventListener("click", e => {
    const sw = e.target.closest("[data-color]"); if (!sw) return;
    const c = sw.dataset.color;
    state.color.has(c) ? state.color.delete(c) : state.color.add(c);
    sw.setAttribute("aria-pressed", state.color.has(c)); shown = PAGE; render();
  });
  const clearAll = () => { KEYS.forEach(k => state[k].clear()); state.max = PRICE_CAP; state.stock = false; };
  document.addEventListener("click", e => {
    const u = e.target.closest("[data-unf]");
    if (u) {
      const k = u.dataset.unf;
      if (k === "all") clearAll(); else if (k === "max") state.max = PRICE_CAP; else if (k === "stock") state.stock = false; else state[k].delete(u.dataset.v);
      shown = PAGE; buildFilters(); render();
    }
    if (e.target.closest("#moreBtn")) {
      const before = shown; shown += PAGE; render(false);
      $$("#results .card").slice(before).forEach((c, i) => { c.classList.add("in-grid"); c.style.animationDelay = i * 45 + "ms"; });
    }
  });
  $("#fClear").addEventListener("click", () => { clearAll(); buildFilters(); render(); });
  $("#filterBtn").addEventListener("click", () => { fs.classList.add("on"); $("#scrim").classList.add("on"); document.body.style.overflow = "hidden"; });
  const sortEl = $("#sort"); sortEl.value = state.sort;
  sortEl.addEventListener("change", () => { state.sort = sortEl.value; render(); });

  const setCols = c => {
    $("#results").classList.toggle("cols-3", c === "3");
    $$("[data-cols]").forEach(b => b.setAttribute("aria-pressed", b.dataset.cols === c));
    store.set("thea_cols", c);
  };
  $$("[data-cols]").forEach(b => { b.innerHTML = icon(b.dataset.cols === "3" ? "squares-four" : "grid-nine"); b.addEventListener("click", () => setCols(b.dataset.cols)); });
  setCols(store.get("thea_cols", "4"));

  buildFilters(); render(false);
  document.addEventListener("thea:ready", () => initReveal(), { once: true });
})();
