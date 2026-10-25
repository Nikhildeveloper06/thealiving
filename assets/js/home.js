/* =========================================================================
   THEA — homepage interactions
   hero carousel · marquee · size cards · fit calculator · shop the look
   bundle builder · fabric guide · stats · bestsellers · reviews · lookbook · FAQ
   ========================================================================= */
(() => {
  /* ================= HERO: try a print in the room ================= */
  const hero = $("#hero"), media = $("#heroMedia");
  const PRINTS = [
    { id: "sage-rosette", src: "assets/img/hero-1.jpg" },
    { id: "jade-blossom" }, { id: "lavender-charm" }, { id: "blue-empress" }, { id: "italian-moka" }, { id: "300tc-dusty-rose" }
  ].map(p => ({ ...p, pr: byId(p.id), src: p.src || img(byId(p.id).img, 1600) }));
  // build the room images (first one is already in the HTML for a fast first paint)
  PRINTS.slice(1).forEach(p => media.insertAdjacentHTML("beforeend", `<img class="hm" src="${p.src}" alt="" loading="lazy" decoding="async">`));
  const layers = $$(".hm", media);
  $("#dockTotal").textContent = String(PRINTS.length).padStart(2, "0");
  $("#heroSwatches").innerHTML = PRINTS.map((p, i) => `
    <button class="hsw" role="tab" aria-selected="${i === 0}" aria-label="Preview ${p.pr.name}" data-sw="${i}">
      <span class="face"><img src="${img(p.pr.img, 200)}" alt="" loading="lazy" decoding="async"></span>
      <svg viewBox="0 0 48 48" aria-hidden="true"><circle class="trk" cx="24" cy="24" r="22"/><circle class="bar" cx="24" cy="24" r="22"/></svg>
      <span class="tip">${p.pr.name}</span>
    </button>`).join("");
  const sws = $$(".hsw", hero);
  let cur = 0, timer;
  function setDock(i) {
    const p = PRINTS[i].pr, s = SIZES[p.size];
    $("#dockNow").href = `product.html?id=${p.id}`;
    $("#dockImg").src = img(p.img, 200);
    $("#dockName").textContent = p.name;
    $("#dockMeta").textContent = `${s.label} · ${s.dims} · ${inr(p.price)}`;
    $("#dockIdx").textContent = String(i + 1).padStart(2, "0");
    const t = $(".dock-txt"); t.classList.remove("swap-out"); void t.offsetWidth; t.classList.add("swap-out");
  }
  function show(i, user) {
    i = (i + PRINTS.length) % PRINTS.length;
    if (i !== cur) { layers[cur].classList.remove("on"); layers[i].classList.add("on"); }
    sws.forEach((b, j) => b.setAttribute("aria-selected", j === i));
    // restart the ring animation on the active swatch
    const bar = sws[i].querySelector(".bar"); bar.style.animation = "none"; void bar.getBoundingClientRect(); bar.style.animation = "";
    cur = i; setDock(i);
    if (user) play();
  }
  const play = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => show(cur + 1), 6500); };
  $("#heroSwatches").addEventListener("click", e => { const b = e.target.closest("[data-sw]"); if (b) show(+b.dataset.sw, true); });
  // hover preview on desktop
  let hoverT;
  $("#heroSwatches").addEventListener("pointerover", e => { const b = e.target.closest("[data-sw]"); if (!b || e.pointerType !== "mouse") return; clearTimeout(hoverT); hoverT = setTimeout(() => show(+b.dataset.sw, true), 140); });
  $$("[data-hero]").forEach(b => b.addEventListener("click", () => show(cur + +b.dataset.hero, true)));
  hero.addEventListener("keydown", e => { if (e.key === "ArrowRight") show(cur + 1, true); if (e.key === "ArrowLeft") show(cur - 1, true); });
  const dock = $(".hero-dock");
  dock.addEventListener("mouseenter", () => { clearInterval(timer); hero.classList.add("paused"); });
  dock.addEventListener("mouseleave", () => { hero.classList.remove("paused"); play(); });
  let sx = 0;
  hero.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  hero.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1), true); });
  // pointer parallax (desktop only, rAF-throttled, transform only)
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    let tx = 0, ty = 0, raf = 0;
    hero.addEventListener("pointermove", e => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * -18; ty = ((e.clientY - r.top) / r.height - .5) * -12;
      if (!raf) raf = requestAnimationFrame(() => { media.style.transform = `translate3d(${tx}px, ${ty}px, 0)`; raf = 0; });
    });
    hero.addEventListener("pointerleave", () => { media.style.transform = ""; });
  }
  // pause autoplay when hero is off screen
  new IntersectionObserver(([e]) => { if (e.isIntersecting) { if (!hero.classList.contains("paused")) play(); } else clearInterval(timer); }).observe(hero);
  setDock(0);
  const start = () => { hero.classList.add("ready"); play(); initReveal(); };
  if ($("#preloader.done")) start(); else document.addEventListener("thea:ready", start, { once: true });

  /* ================= MARQUEE ================= */
  const mqItems = [
    ["truck", "Free shipping across India"], ["gift", "Buy 2, get <em>50%</em> off"], ["leaf", "100% cotton prints"],
    ["arrows-counter-clockwise", "3-day easy exchange"], ["money", "Cash on delivery"], ["flag", "Made in India"],
    ["shield-check", "Fade & shrink resistant"], ["sparkle", "Buy 3, get <em>56%</em> off"]
  ].map(([i, t]) => `<span>${icon(i, "", "fill")} ${t}</span>`).join("");
  $("#mq").innerHTML = mqItems + mqItems;

  /* ================= SIZE CARDS ================= */
  const sizeCards = [
    { c: "king", t: "King", d: "100 × 108 in", f: "For 6 × 6.5 ft beds", img: "assets/img/cat-king.jpg", w: 100, h: 108 },
    { c: "double", t: "Double", d: "90 × 100 in", f: "For 5 × 6.25 ft beds", img: "assets/img/cat-double.jpg", w: 90, h: 100 },
    { c: "italian", t: "Super King", d: "108 × 108 in", f: "For deep mattresses", img: img(byId("italian-tortora").img, 500), w: 108, h: 108 },
    { c: "comforter", t: "Comforters", d: "Reversible 150 GSM", f: "Two looks in one", img: "assets/img/cat-comforter.jpg" },
    { c: "mat", t: "Floor mats", d: "Woven chenille", f: "Anti-slip backing", img: "assets/img/cat-mats.jpg" }
  ];
  $("#sizeCards").innerHTML = sizeCards.map((s, i) => {
    const n = PRODUCTS.filter(COLLECTIONS[s.c].filter).length;
    const diag = s.w ? `<span class="bed-diag" aria-hidden="true"><i style="width:${s.w * .34}px;height:${s.h * .34}px"></i></span>` : "";
    return `<a class="size-card rv rv-d${i % 4}" href="collection.html?c=${s.c}">
      <div class="media"><img src="${s.img}" alt="${s.t} ${s.c === "mat" || s.c === "comforter" ? "" : "bedsheets"}" loading="lazy"></div>${diag}
      <div class="txt"><b>${s.t} ${icon("arrow-right")}</b><span>${s.d} · ${s.f}</span><em>${n} designs</em></div></a>`;
  }).join("");

  /* ================= COTTON RAIL ================= */
  $("#cottonRail").innerHTML = PRODUCTS.filter(x => x.collections.includes("cotton")).map(x => card(x)).join("");
  initRail($("#cottonRail"));

  /* ================= FIT CALCULATOR ================= */
  const SHEETS = [
    { k: "double", label: "Double", w: 90, l: 100, url: "collection.html?c=double" },
    { k: "king", label: "King", w: 100, l: 108, url: "collection.html?c=king&size=King" },
    { k: "superking", label: "Super King", w: 108, l: 108, url: "collection.html?c=king&size=Super%20King" }
  ];
  const TUCK = 6; // inches of fabric to tuck under on each side
  let unit = "in";
  const fW = $("#fW"), fL = $("#fL"), fD = $("#fD");
  const fmt = v => unit === "in" ? `${v} in` : `${Math.round(v * 2.54)} cm`;
  function fit() {
    const W = +fW.value, L = +fL.value, D = +fD.value;
    [fW, fL, fD].forEach(r => r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min) * 100) + "%"));
    $("#oW").textContent = fmt(W); $("#oL").textContent = fmt(L); $("#oD").textContent = fmt(D);
    const need = { w: W + 2 * (D + TUCK), l: L + 2 * (D + TUCK) };
    const s = SHEETS.find(x => x.w >= need.w && x.l >= need.l);
    const show = s || SHEETS[2];
    // Draw: scale so the larger of sheet/mattress fits 270px
    const sc = 260 / Math.max(show.l, show.w, L, W), cx = 210, cy = 158;
    const sw = show.w * sc, sl = show.l * sc, mw = W * sc, ml = L * sc;
    const pw = Math.min(mw / 2 - 10, 26 * sc), ph = 12 * sc;
    $("#fitSvg").innerHTML = `
      <rect class="sheetR" x="${cx - sw / 2}" y="${cy - sl / 2}" width="${sw}" height="${sl}" rx="6"/>
      <rect class="matR" x="${cx - mw / 2}" y="${cy - ml / 2}" width="${mw}" height="${ml}" rx="8"/>
      <rect class="pil" x="${cx - mw / 2 + 8}" y="${cy - ml / 2 + 8}" width="${pw}" height="${ph}" rx="6"/>
      <rect class="pil" x="${cx + mw / 2 - 8 - pw}" y="${cy - ml / 2 + 8}" width="${pw}" height="${ph}" rx="6"/>
      <text class="lbl" x="${cx}" y="${cy + 4}" text-anchor="middle">Mattress ${fmt(W)} × ${fmt(L)}</text>
      <text x="${cx}" y="${cy - sl / 2 - 8}" text-anchor="middle">${show.label} sheet ${fmt(show.w)} × ${fmt(show.l)}</text>
      <text x="${cx + sw / 2 + 6}" y="${cy}" transform="rotate(90 ${cx + sw / 2 + 6} ${cy})" text-anchor="middle">${fmt(((show.w - W) / 2) | 0)} each side</text>`;
    const r = $("#fitResult");
    r.classList.toggle("warn", !s);
    r.innerHTML = s
      ? `<span class="bs">${icon("check", "", "bold")}</span><div><b>${s.label} bedsheet</b><span>${s.label === "Super King" ? "Extra drop for deep mattresses." : "A neat tuck on every side."} ${D <= 8 ? "Fitted elastic works too." : "Choose flat for deep mattresses."}</span></div><a class="btn btn-ink" href="${s.url}">Shop ${s.label} ${icon("arrow-right", "go")}</a>`
      : `<span class="bs" style="background:var(--haldi);color:var(--ink)">${icon("warning")}</span><div><b>Larger than our sheets</b><span>Super King will cover the top but won't tuck fully. Message us for help.</span></div><a class="btn btn-ink" href="https://api.whatsapp.com/send?phone=918796146616&text=Hi, I need help with bedsheet size">${icon("whatsapp-logo")} Ask us</a>`;
    const side = (show.w - W) / 2, foot = (show.l - L) / 2;
    $("#fitNotes").innerHTML = `
      <div><b>${fmt(Math.round(side))}</b>drop each side</div>
      <div><b>${fmt(Math.round(foot))}</b>drop at head & foot</div>
      <div><b>${fmt(Math.max(0, Math.round(side - D)))}</b>left to tuck under</div>`;
  }
  [fW, fL, fD].forEach(r => r.addEventListener("input", () => { $$("#fitPresets .chip").forEach(c => c.classList.remove("on")); fit(); }));
  $("#fitPresets").addEventListener("click", e => {
    const b = e.target.closest("[data-preset]"); if (!b) return;
    const [w, l, d] = b.dataset.preset.split(",");
    fW.value = w; fL.value = l; fD.value = d;
    $$("#fitPresets .chip").forEach(c => c.classList.toggle("on", c === b)); fit();
  });
  $$("[data-unit]").forEach(b => b.addEventListener("click", () => { unit = b.dataset.unit; $$("[data-unit]").forEach(x => x.setAttribute("aria-pressed", x === b)); fit(); }));
  fit();

  /* ================= SHOP THE LOOK ================= */
  const look = [
    { id: "sage-rosette", x: 52, y: 66, title: "Bedsheet", note: "100% cotton, King" },
    { id: "sage-rosette", x: 30, y: 30, title: "Pillow covers", note: "Included with the set", info: true },
    { id: "mat-ash-grey", x: 86, y: 90, title: "Floor mat", note: "Anti-slip chenille" }
  ];
  const lm = $("#lookMedia");
  lm.insertAdjacentHTML("beforeend", look.map((h, i) => `
    <button class="hotspot" style="left:${h.x}%;top:${h.y}%" data-hs="${i}" aria-expanded="false" aria-label="${h.title}">${icon("plus", "", "bold")}</button>`).join("") + `<div class="hs-pop" id="hsPop" role="dialog"></div>`);
  const pop = $("#hsPop");
  function openHS(i) {
    const h = look[i], pr = byId(h.id);
    $$(".hotspot", lm).forEach((b, j) => b.setAttribute("aria-expanded", i === j));
    $$(".look-item").forEach((b, j) => b.classList.toggle("on", i === j));
    pop.innerHTML = `<img src="${img(pr.img, 200)}" alt=""><div><small>${h.title}</small><b>${pr.name}</b><small>${h.info ? h.note : inr(pr.price)}</small></div>
      ${h.info ? `<a class="btn btn-line" href="product.html?id=${pr.id}">View set</a>` : `<button class="btn btn-ink" data-add="${pr.id}" data-variant="${pr.types[0]}">${icon("handbag")} Add · ${inr(pr.price)}</button>`}`;
    const left = h.x > 60 ? `calc(${h.x}% - 290px)` : `calc(${h.x}% + 26px)`;
    const top = h.y > 60 ? `calc(${h.y}% - 150px)` : `calc(${h.y}% - 20px)`;
    pop.style.left = innerWidth < 560 ? "12px" : left; pop.style.top = innerWidth < 560 ? "12px" : top;
    pop.classList.add("on");
  }
  lm.addEventListener("click", e => {
    const b = e.target.closest("[data-hs]");
    if (b) { b.getAttribute("aria-expanded") === "true" ? closeHS() : openHS(+b.dataset.hs); }
  });
  const closeHS = () => { pop.classList.remove("on"); $$(".hotspot", lm).forEach(b => b.setAttribute("aria-expanded", false)); $$(".look-item").forEach(b => b.classList.remove("on")); };
  document.addEventListener("click", e => { if (!e.target.closest("#lookMedia, .look-item")) closeHS(); });
  const lookBuy = [...new Set(look.filter(h => !h.info).map(h => h.id))].map(byId);
  $("#lookList").innerHTML = look.map((h, i) => { const pr = byId(h.id); return `
    <button class="look-item" data-li="${i}"><img src="${img(pr.img, 200)}" alt="" loading="lazy"><div><small>${h.title}</small><b>${pr.name}</b><small>${h.note}</small></div><b>${h.info ? icon("check-circle", "", "fill") : inr(pr.price)}</b></button>`; }).join("");
  $("#lookList").addEventListener("click", e => { const b = e.target.closest("[data-li]"); if (b) openHS(+b.dataset.li); });
  $("#lookTotal").textContent = inr(lookBuy.reduce((a, p) => a + p.price, 0));
  $("#lookAdd").addEventListener("click", () => { lookBuy.forEach(p => addToCart(p.id, p.types[0], 1, true)); openPanel("cart"); });

  /* ================= BUNDLE BUILDER ================= */
  const tray = []; let trayTab = "king";
  function renderTray() {
    const labels = ["Pick a print", "Add a 2nd for 50% off", "Add a 3rd for 56% off"];
    $("#traySlots").innerHTML = [0, 1, 2].map(i => {
      const pr = tray[i] && byId(tray[i]);
      return pr ? `<div class="slot filled"><img src="${img(pr.img, 300)}" alt="${pr.name}"><button data-untray="${i}" aria-label="Remove ${pr.name}">${icon("x", "", "bold")}</button></div>`
        : `<div class="slot">${icon(i ? "plus-circle" : "hand-pointing", "", "duo")}<span>${labels[i]}</span></div>`;
    }).join("");
    const pool = PRODUCTS.filter(x => x.size === trayTab && x.stock).slice(0, 12);
    $("#trayPicks").innerHTML = pool.map(x => `<button class="pick" data-pick="${x.id}" aria-pressed="${tray.includes(x.id)}" aria-label="${x.name}, ${inr(x.price)}" title="${x.name} · ${inr(x.price)}"><img src="${img(x.img, 200)}" alt="" loading="lazy"></button>`).join("");
    const t = priceCart(tray.map(id => ({ id, qty: 1 })));
    $("#trayCount").textContent = `(${tray.length} of 3)`;
    $("#trayWas").textContent = t.save ? inr(t.subtotal) : "";
    $("#trayNow").textContent = inr(t.total);
    const btn = $("#trayAdd");
    btn.disabled = tray.length < 2;
    btn.innerHTML = tray.length < 2 ? "Pick at least 2 to bundle" : `${icon("handbag")} Add bundle · save ${inr(t.save)}`;
    $$(".tier").forEach(el => el.classList.toggle("on", +el.dataset.tier === Math.max(1, tray.length)));
  }
  function fly(fromEl, toEl, src) {
    if (reduceMotion || !fromEl || !toEl) return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const f = document.createElement("img"); f.src = src; f.className = "fly";
    Object.assign(f.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
    document.body.appendChild(f);
    requestAnimationFrame(() => Object.assign(f.style, { left: b.left + "px", top: b.top + "px", width: b.width + "px", height: b.height + "px", opacity: .2 }));
    setTimeout(() => f.remove(), 650);
  }
  $(".bundle").addEventListener("click", e => {
    const p = e.target.closest("[data-pick]"), u = e.target.closest("[data-untray]"), tab = e.target.closest("[data-tt]");
    if (p) {
      const id = p.dataset.pick, at = tray.indexOf(id);
      if (at > -1) tray.splice(at, 1);
      else if (tray.length < 3) { fly(p, $$(".slot")[tray.length], img(byId(id).img, 300)); tray.push(id); }
      else toast(`${icon("info", "", "fill")} Your bundle is full. Remove one to swap prints.`);
      setTimeout(renderTray, at > -1 ? 0 : 280);
    }
    if (u) { tray.splice(+u.dataset.untray, 1); renderTray(); }
    if (tab) { trayTab = tab.dataset.tt; $$("#trayTabs button").forEach(b => b.setAttribute("aria-selected", b === tab)); renderTray(); }
  });
  $("#trayClear").addEventListener("click", () => { tray.length = 0; renderTray(); });
  $("#trayAdd").addEventListener("click", () => { tray.forEach(id => addToCart(id, byId(id).types[0], 1, true)); tray.length = 0; renderTray(); openPanel("cart"); });
  renderTray(); initSeg($("#trayTabs"));

  /* ================= FABRIC GUIDE ================= */
  const FABRICS = [
    { k: "cotton", name: "100% cotton", icon: "leaf", img: "jade-blossom", tag: ["Coolest for summer", "Breathes and absorbs sweat"],
      m: [["Breathability", 95, "wind"], ["Softness", 80, "feather"], ["Easy care", 62, "washing-machine"], ["Wrinkle resistance", 45, "t-shirt"]],
      best: [["sun", "Hot, humid nights"], ["hand-heart", "Sensitive skin"], ["plant", "Natural fibre"]], url: "collection.html?c=cotton" },
    { k: "micro", name: "Microfiber", icon: "feather", img: "blue-empress", tag: ["Softest & easiest", "Silky, quick-dry, no ironing"],
      m: [["Breathability", 66, "wind"], ["Softness", 95, "feather"], ["Easy care", 96, "washing-machine"], ["Wrinkle resistance", 92, "t-shirt"]],
      best: [["calendar-check", "Every season"], ["timer", "Low maintenance"], ["piggy-bank", "Best value"]], url: "collection.html?c=king&fabric=Microfiber" },
    { k: "300tc", name: "300TC solid", icon: "needle", img: "300tc-ivory", tag: ["Crisp hotel finish", "Tight weave, long life"],
      m: [["Breathability", 86, "wind"], ["Softness", 86, "feather"], ["Easy care", 70, "washing-machine"], ["Wrinkle resistance", 58, "t-shirt"]],
      best: [["buildings", "Hotel look"], ["hourglass", "Lasts for years"], ["square", "Minimal decor"]], url: "collection.html?c=300tc" },
    { k: "italian", name: "Italian", icon: "flower-lotus", img: "italian-rosa-cipria", tag: ["Statement bedroom", "Embroidered accent pillows"],
      m: [["Breathability", 70, "wind"], ["Softness", 88, "feather"], ["Easy care", 84, "washing-machine"], ["Wrinkle resistance", 85, "t-shirt"]],
      best: [["crown", "Master bedroom"], ["gift", "Gifting"], ["users-three", "Guest room"]], url: "collection.html?c=italian" }
  ];
  $("#fabTabs").innerHTML = FABRICS.map((f, i) => `<button role="tab" aria-selected="${!i}" data-fab="${i}">${icon(f.icon)} ${f.name}</button>`).join("");
  $("#fabMeters").innerHTML = FABRICS[0].m.map(([l, , ic]) => `<div class="mtr"><div><span>${icon(ic)} ${l}</span><b>0%</b></div><i><b></b></i></div>`).join("");
  function showFab(i) {
    const f = FABRICS[i], pi = $("#fabImg");
    pi.style.opacity = 0; setTimeout(() => { pi.src = img(byId(f.img).img, 900); pi.style.opacity = 1; }, 220);
    $("#fabTagB").textContent = f.tag[0]; $("#fabTagS").textContent = f.tag[1];
    $$("#fabMeters .mtr").forEach((el, j) => { el.querySelector("i b").style.width = f.m[j][1] + "%"; el.querySelector("div b").textContent = f.m[j][1] + "%"; });
    $("#fabBest").innerHTML = f.best.map(([ic, t]) => `<span>${icon(ic)} ${t}</span>`).join("");
    $("#fabCta").href = f.url; $("#fabCta").innerHTML = `Shop ${f.name} ${icon("arrow-right", "go")}`;
    $$("#fabTabs button").forEach((b, j) => b.setAttribute("aria-selected", i === j));
  }
  $("#fabTabs").addEventListener("click", e => { const b = e.target.closest("[data-fab]"); if (b) showFab(+b.dataset.fab); });
  initSeg($("#fabTabs"));
  // Animate meters when the section scrolls into view
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { showFab(0); o.disconnect(); } }, { threshold: .3 }).observe($("#fabric"));
  $("#fabImg").src = img(byId("jade-blossom").img, 900);

  const r = avgRating();
  $("#stats").innerHTML = `
    <div>${icon("swatches", "", "duo")}<b data-count="${PRODUCTS.length}" data-suffix="+">0</b><span>Exclusive designs</span></div>
    <div>${icon("bed", "", "duo")}<b data-count="3">0</b><span>Bed sizes, every print</span></div>
    <div>${icon("star", "", "duo")}<b data-count="${r.avg.toFixed(1)}" data-dec="1">0</b><span>Average rating</span></div>
    <div>${icon("timer", "", "duo")}<b data-count="48" data-suffix="h">0</b><span>Dispatch time</span></div>`;
  initCounters();

  /* ================= LUXURY EDIT ================= */
  const it = byId("italian-rosa-cipria"), tc = byId("300tc-ivory"), mat = byId("mat-mocha-taupe");
  $("#luxEdit").innerHTML = `
    <a class="edit-a rv" href="collection.html?c=italian">
      <img src="${img(it.img, 1200)}" alt="Italian embroidery bedsheet set in Rosa Cipria" loading="lazy">
      <div><small style="opacity:.8">${icon("star", "", "fill")} Rated 4.3 to 4.7</small><h3>Italian embroidery</h3><p>Super king solids with embroidered accent pillow covers. From ${inr(2499)}.</p><span class="more">${icon("arrow-up-right")} Shop the edit</span></div>
    </a>
    <div class="edit-b">
      <a class="rv rv-d1" href="collection.html?c=300tc">
        <img src="${img(tc.img, 900)}" alt="300TC solid cotton bedsheet in Ivory" loading="lazy">
        <div><h3>Solid cotton 300TC</h3><p>Pure cotton, crisp hand, quiet colours.</p><span class="more">${icon("arrow-up-right")} Shop 300TC</span></div>
      </a>
      <a class="rv rv-d2" href="collection.html?c=mat">
        <img src="${img(mat.img, 900)}" alt="Woven chenille floor mat in Mocha Taupe" loading="lazy">
        <div><h3>Hand woven mats</h3><p>Anti-slip chenille from ${inr(799)}.</p><span class="more">${icon("arrow-up-right")} Shop mats</span></div>
      </a>
    </div>`;

  /* ================= BESTSELLERS ================= */
  const bestMap = {
    double: { f: x => x.size === "double", label: "View all double bedsheets", c: "double" },
    king: { f: x => x.size === "king" && !x.collections.includes("cotton"), label: "View all king bedsheets", c: "king" },
    comforter: { f: x => x.size === "comforter", label: "View all comforters", c: "comforter" },
    mat: { f: x => x.size === "mat", label: "View all floor mats", c: "mat" }
  };
  function showBest(k) {
    const m = bestMap[k];
    $("#bestGrid").innerHTML = PRODUCTS.filter(m.f).slice(0, 4).map((x, i) => card(x, { cls: "in-grid", delay: i * 70 })).join("");
    $("#bestAll").innerHTML = `${m.label} ${icon("arrow-right", "go")}`; $("#bestAll").href = `collection.html?c=${m.c}`;
    $$("#bestTabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.bt === k));
  }
  $("#bestTabs").addEventListener("click", e => { const b = e.target.closest("[data-bt]"); if (b) showBest(b.dataset.bt); });
  showBest("double"); initSeg($("#bestTabs"));

  /* ================= REVIEWS ================= */
  $("#score").innerHTML = `<b>${r.avg.toFixed(1)}</b><div><span class="stars">${starRow(r.avg)}</span><small>From verified THEA orders</small></div>`;
  const rc = rv => `
    <figure class="r-card">
      <div class="top"><span class="st" aria-label="${rv.stars} out of 5">${starRow(rv.stars)}</span>${icon("quotes", "", "fill")}</div>
      <h3>${rv.title}</h3>
      <blockquote style="margin:0"><p>${rv.text}</p></blockquote>
      <figcaption class="r-who"><span class="av">${rv.name[0]}</span><div><b>${rv.name}</b><span>${rv.city}</span></div><span class="verified">${icon("seal-check", "", "fill")} Verified</span></figcaption>
    </figure>`;
  const a = REVIEWS.slice(0, 3).map(rc).join(""), b = REVIEWS.slice(2).map(rc).join("");
  $("#rvA").innerHTML = a + a + a; $("#rvB").innerHTML = b + b + b;

  /* ================= LOOKBOOK ================= */
  const lb = ["lavender-charm", "italian-moka", "maharani-green", "300tc-dusty-rose", "blue-empress", "jade-blossom", "regal-grace", "amour", "persian-grace", "porcelain-bloom"];
  $("#ugc").innerHTML = lb.map((id, i) => { const p = byId(id); return `<a href="product.html?id=${id}" class="${i % 3 === 2 ? "zoom" : ""}"><img src="${img(p.img, i === 0 || i === 5 ? 900 : 500)}" alt="${p.name} styled in a bedroom" loading="lazy"><span>${icon("handbag")} ${p.name}</span></a>`; }).join("");

  /* ================= FAQ ================= */
  $("#faqList").innerHTML = FAQS.map(([q, ans], i) => `<details ${i === 0 ? "open" : ""}><summary>${q} ${icon("plus")}</summary><div class="ans"><p>${ans}</p></div></details>`).join("");
  // one open at a time
  $("#faqList").addEventListener("toggle", e => { if (e.target.open) $$("#faqList details").forEach(d => d !== e.target && (d.open = false)); }, true);

  /* ================= JOURNAL ================= */
  $("#blogGrid").innerHTML = BLOGS.map((bl, i) => `
    <a class="blog-card rv rv-d${i}" href="${bl.url}">
      <div class="media"><img src="${bl.img}" alt="" loading="lazy"></div>
      <small>${icon("clock")} ${bl.read}</small>
      <h3>${bl.title}</h3>
      <p>${bl.text}</p>
    </a>`).join("");
})();
