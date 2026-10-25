/* =========================================================================
   THEA — SEO / AEO / GEO content
   - Long-form copy rendered in the SEO block below the footer
   - FAQ answers written answer-first (AEO) and reused in FAQPage JSON-LD
   - Plain, factual brand statements that AI answer engines can quote (GEO)
   ========================================================================= */

const KEYWORDS = {
  home: "bedsheets online India, king size bedsheet, double bedsheet, cotton bedsheets, 100% cotton king size bedsheet, fitted bedsheet with elastic, super king size bedsheet, bedsheet set with pillow covers, printed bedsheets, floral bedsheets, Italian embroidery bedsheet, 300 thread count bedsheet, reversible comforter, AC comforter, bath mat, anti slip floor mat, buy 2 bedsheets offer, THEA bedsheets, thealiving",
  king: "king size bedsheet, king size bedsheet with 2 pillow covers, 100x108 bedsheet, king size cotton bedsheet, king size fitted bedsheet, king bed sheet online India",
  double: "double bedsheet, double bed sheet with 2 pillow covers, 90x100 bedsheet, queen size bedsheet, double bedsheet cotton, double bedsheet online",
  cotton: "100% cotton bedsheet, pure cotton bedsheet king size, breathable bedsheet for summer, cotton bedsheet online India, floral cotton bedsheet",
  italian: "Italian embroidery bedsheet, super king bedsheet, 108x108 bedsheet, luxury bedsheet set, embroidered pillow covers",
  "300tc": "300 thread count bedsheet, 300TC cotton bedsheet, solid colour bedsheet, plain cotton bedsheet king size, premium cotton bedsheet",
  comforter: "reversible comforter, AC comforter double bed, 150 GSM comforter, lightweight comforter India, double bed comforter",
  mat: "bath mat, anti slip floor mat, chenille mat, absorbent door mat, bedroom floor mat",
  all: "bedsheets online, bedding India, buy bedsheets online, bedsheet sale, bedsheet combo offer"
};

const FAQS = [
  ["What size bedsheet do I need for a king size bed in India?",
   "For a standard Indian king bed (72 × 78 in, or 6 × 6.5 ft) choose a <b>King bedsheet of 100 × 108 in</b>. It leaves about 14 in on each side to tuck under a mattress up to 8 in deep. For mattresses deeper than 8 in, pick a <b>Super King (108 × 108 in)</b> sheet."],
  ["What size is a double bedsheet?",
   "THEA double bedsheets measure <b>90 × 100 in</b> and fit a double or queen mattress of 60 × 75 in (5 × 6.25 ft). Every set includes two pillow covers of 18 × 28 in."],
  ["Should I buy a flat or a fitted bedsheet?",
   "A <b>flat sheet</b> drapes and tucks under the mattress and gives a classic layered look. A <b>fitted (elastic) sheet</b> has elastic corners that grip the mattress, so it stays wrinkle-free and does not slip, which is ideal for kids' rooms and daily use. Most THEA prints come in both."],
  ["Which bedsheet fabric is best for Indian summers?",
   "<b>100% cotton</b> is the most breathable and absorbs sweat, so it stays coolest in hot, humid weather. Premium microfiber is softer, lighter and dries fast, and resists wrinkles and fading. For AC rooms, pair either with a 150 GSM reversible comforter."],
  ["How does the Buy 2 / Buy 3 bedsheet offer work?",
   "Add any 2 bedsheets to your cart and you get <b>flat 50% off</b> (code BUY2). Add 3 or more and the discount rises to <b>56% off</b> (code BUY3). You can mix sizes and designs, and the discount applies automatically at checkout."],
  ["Do THEA bedsheets shrink or fade after washing?",
   "No. THEA bedsheets are pre-treated to be <b>shrink-free and colour-fade resistant</b>. Wash in cold water on a gentle cycle, dry in shade and avoid bleach to keep the print bright for longer."],
  ["How long does delivery take and is shipping free?",
   "Shipping is <b>free on every order across India</b>. Orders are dispatched within 24–48 hours and usually arrive in 2–4 days in metro cities and 4–7 days elsewhere. Cash on delivery and UPI are available."],
  ["What is THEA's return and exchange policy?",
   "If the size or fit is not right, you can request a return or exchange within <b>3 days of delivery</b>. The product should be unused and in its original packaging. Colour differences caused by screen settings are not covered."]
];

const SEO_CONTENT = {
  tags: [
    ["King size bedsheets", "collection.html?c=king"], ["Double bedsheets", "collection.html?c=double"],
    ["100% cotton bedsheets", "collection.html?c=cotton"], ["Fitted bedsheets", "collection.html?c=all&type=Fitted%2FElastic"],
    ["Super king bedsheets", "collection.html?c=italian"], ["300 thread count bedsheets", "collection.html?c=300tc"],
    ["Floral bedsheets", "collection.html?c=all&style=Floral"], ["Blue bedsheets", "collection.html?c=all&color=Blue"],
    ["Bedsheets under ₹2,000", "collection.html?c=all&sort=price-asc"], ["Reversible comforters", "collection.html?c=comforter"],
    ["Bath mats", "collection.html?c=mat"], ["Bedsheet combo offers", "index.html#bundle"]
  ],
  home: {
    title: "Buy bedsheets online in India at THEA",
    html: `
      <p><b>THEA, The House of Comfort Living</b>, is an Indian home-furnishing brand by Theatic Brands Private Limited, based in Faridabad, Haryana. We design and sell <a href="collection.html?c=king">king size bedsheets</a>, <a href="collection.html?c=double">double bedsheets</a>, <a href="collection.html?c=cotton">100% cotton bedsheets</a>, reversible comforters and anti-slip floor mats online, with free shipping across India.</p>
      <h3>King size and double bedsheets with pillow covers</h3>
      <p>Every THEA bedsheet set includes one bedsheet and two matching pillow covers. Our <b>king size bedsheet (100 × 108 in)</b> fits a 6 × 6.5 ft bed, our <b>double bedsheet (90 × 100 in)</b> fits a 5 × 6.25 ft bed, and our <b>super king bedsheet (108 × 108 in)</b> is cut for deeper mattresses. Most designs are available as a <b>flat bedsheet</b> or a <b>fitted bedsheet with elastic</b> corners.</p>
      <h3>Cotton, microfiber, 300TC and Italian embroidery</h3>
      <p>Choose breathable <b>pure cotton bedsheets</b> for hot Indian summers, buttery-soft premium microfiber prints for easy care, <b>300 thread count solid cotton</b> for a crisp hotel-style finish, or our <b>Italian embroidery</b> super king sets for a luxury bedroom. Designs range from floral and Jaipuri-inspired motifs to damask, geometric and solid colours.</p>
      <h3>Bedsheet offers: buy 2, get 50% off</h3>
      <p>Mix any two bedsheets and get flat 50% off, or three for 56% off. The bundle discount applies automatically at checkout, and you can also use FESTIVE40 for 40% off sitewide during festive sales.</p>
      <h3>Comforters and floor mats</h3>
      <p>Complete the room with a <a href="collection.html?c=comforter">150 GSM reversible AC comforter</a> and a <a href="collection.html?c=mat">woven chenille anti-slip mat</a> that is soft, absorbent and quick drying.</p>
      <h3>Delivery across India</h3>
      <p>We ship free to every pincode in India, including Delhi NCR, Gurugram, Noida, Faridabad, Mumbai, Pune, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, Lucknow and Chandigarh. Pay by UPI, card or cash on delivery, and exchange within 3 days if the size isn't right.</p>`
  },
  collection(key, col, n) {
    const base = {
      king: `<p>Shop <b>king size bedsheets online</b> at THEA. Our king bedsheets measure <b>100 × 108 inches</b> and come with two 20 × 30 in pillow covers, sized for Indian king beds of 72 × 78 in (6 × 6.5 ft). Pick a flat sheet for a classic tuck or a <b>fitted king bedsheet with elastic</b> that stays put all night.</p><h3>Fabrics for every season</h3><p>Choose from 100% cotton floral prints that breathe in summer, premium microfiber designs that resist wrinkles and fading, and 300TC solid cotton for a crisp finish. Need more depth? Our <a href="collection.html?c=italian">super king 108 × 108 in</a> sets fit mattresses up to 10 in deep.</p>`,
      double: `<p>Buy <b>double bedsheets online</b> with two pillow covers. THEA double bedsheets measure <b>90 × 100 inches</b> and fit double and queen beds of 60 × 75 in (5 × 6.25 ft). Choose from Jaipuri, floral, damask and botanical prints, available as flat or fitted elastic sheets.</p><h3>Why our double bedsheets fit better</h3><p>Generous cutting leaves enough fabric to tuck in neatly on every side, and colour-fast, shrink-free fabric keeps the fit and print true wash after wash.</p>`,
      cotton: `<p>Our <b>100% cotton bedsheets</b> are made for warm Indian nights: breathable, sweat-absorbent and softer with every wash. Each king size cotton bedsheet set includes a 100 × 108 in sheet and two pillow covers, in flat or fitted styles.</p><h3>How to care for cotton bedsheets</h3><p>Wash before first use, machine wash cold on gentle, dry in shade and iron on medium heat for a crisp look.</p>`,
      italian: `<p>THEA <b>Italian embroidery bedsheets</b> are super king size (<b>108 × 108 in</b>) sets in calm solid tones, paired with embroidered accent pillow covers. Rated 4.3–4.7 by customers, they bring a hotel-style look to everyday bedrooms.</p>`,
      "300tc": `<p>Shop <b>300 thread count pure cotton bedsheets</b> in solid colours: ivory, mocha, dusty rose, steel blue and more. A tighter weave gives a smooth, crisp hand feel and long life, ideal for a minimal, hotel-inspired bedroom.</p>`,
      comforter: `<p>THEA <b>reversible double bed comforters</b> are 150 GSM, lightweight and made for AC rooms and mild winters. Two colours in one let you change the look of your bed in seconds.</p>`,
      mat: `<p>Our <b>woven chenille anti-slip floor mats</b> are soft underfoot, super absorbent and quick drying, ideal as bath mats, bedroom rugs and entryway mats.</p>`,
      all: `<p>Explore every THEA design in one place: king, double and super king bedsheets, cotton and microfiber prints, Italian embroidery sets, comforters and mats. Filter by size, fabric, style, colour and price to find your fit fast.</p>`
    };
    return { title: `${col.title}: buy online at THEA`, html: (base[key] || base.all) + `<h3>Offers on ${col.title.toLowerCase()}</h3><p>${n} designs available. Buy any 2 bedsheets and get flat 50% off, or any 3 for 56% off. Free shipping across India, cash on delivery and 3-day easy exchange.</p>` };
  },
  product(pr) {
    const s = SIZES[pr.size];
    const cotton = pr.material.toLowerCase().includes("cotton");
    return {
      title: `${pr.name} ${s.label} ${pr.isBedsheet ? "bedsheet set" : ""}: details & buying guide`,
      html: `
        <p>The <b>${pr.title}</b> from THEA is ${pr.isBedsheet ? `a ${s.label.toLowerCase()} size bedsheet set measuring <b>${s.dims}</b>, with ${s.pillow}` : `a ${s.label.toLowerCase()} (${s.dims})`}. It is made from <b>${pr.material.toLowerCase()}</b> in a ${pr.color.name.toLowerCase()} ${pr.style.toLowerCase()} design, and is priced at <b>${inr(pr.price)}</b> with free shipping across India.</p>
        ${pr.isBedsheet ? `<h3>Will it fit my bed?</h3><p>${s.fits}. It is available as ${pr.types.map(t => t.toLowerCase()).join(" or ")}. If your mattress is deeper than 8 in, consider a super king or fitted option.</p>` : ""}
        <h3>Fabric and feel</h3><p>${cotton ? "Pure cotton is breathable and absorbs moisture, which keeps you cool through Indian summers, and it gets softer with each wash." : "Premium microfiber is lightweight and silky, resists wrinkles, fading and shrinking, and dries quickly, so it is easy to care for every day."}</p>
        <h3>Care instructions</h3><p>Machine wash cold on a gentle cycle, do not bleach, dry in shade and iron on low heat if needed.</p>
        ${pr.isBedsheet ? `<h3>Bundle and save</h3><p>Add any other bedsheet and pay ${inr(pr.price / 2)} each with the BUY2 offer, or pick three and save 56%.</p>` : ""}`
    };
  }
};
