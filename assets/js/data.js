/* =========================================================================
   THEA — The House of Comfort Living
   Catalogue data (sourced from thealiving.in, Oct 2026)
   In production this file is replaced by Shopify Liquid / Storefront API.
   ========================================================================= */

const CDN = "https://thealiving.in/cdn/shop/files/";

const SIZES = {
  king:      { label: "King", dims: "100 × 108 in", fits: "Fits 72 × 78 in mattress (6×6.5 ft)", pillow: "2 pillow covers, 20 × 30 in" },
  double:    { label: "Double", dims: "90 × 100 in", fits: "Fits 60 × 75 in mattress (5×6.25 ft)", pillow: "2 pillow covers, 18 × 28 in" },
  superking: { label: "Super King", dims: "108 × 108 in", fits: "Fits 72 × 78 in mattress up to 10 in deep", pillow: "2 pillow covers, 20 × 30 in" },
  comforter: { label: "Double comforter", dims: "Reversible, 150 GSM", fits: "For double & queen beds", pillow: "" },
  mat:       { label: "Floor mat", dims: "Anti-slip chenille", fits: "Bath, bedroom & entryway", pillow: "" }
};

const OFFERS = {
  bundle: [
    { qty: 2, pct: 50, code: "BUY2", text: "Buy any 2 bedsheets, get flat 50% off" },
    { qty: 3, pct: 56, code: "BUY3", text: "Buy any 3 bedsheets, get 56% off" }
  ],
  codes: [
    { code: "FESTIVE40", pct: 40, text: "Flat 40% off sitewide" },
    { code: "CTNBOGO", pct: 0, text: "Buy one get one free on 300TC solid cotton" }
  ],
  shipping: "Free shipping on all orders"
};

/* p(): compact product factory */
function p(id, title, name, size, price, img, opts = {}) {
  return Object.assign({
    id, title, name, size, price,
    img: CDN + img,
    collections: [],
    types: ["Flat", "Fitted/Elastic"],
    style: "Floral",
    color: { name: "Multi", hex: "#ccc" },
    material: "Premium microfiber",
    rating: null, reviews: 0,
    stock: true,
    isBedsheet: size === "king" || size === "double" || size === "superking"
  }, opts);
}

const PRODUCTS = [
  /* ---- 100% cotton king prints ---- */
  p("lavender-charm", "Lavender Charm 100% Cotton King Size Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Lavender Charm", "king", 2599,
    "3_a74d16a7-14ff-4c5f-b9a3-533b91bfb161_1200x1200.png?v=1792245555",
    { collections: ["cotton", "king", "new"], color: { name: "Lavender", hex: "#cdb8c9" }, material: "100% cotton", badge: "New" }),
  p("mauve-garden", "Mauve Garden 100% Cotton King Size Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Mauve Garden", "king", 2599,
    "3_8e2fd89a-a604-42f3-84b9-16f9fb2006b9_1200x1200.png?v=1792245311",
    { collections: ["cotton", "king", "new"], color: { name: "Grey", hex: "#b9bcc0" }, material: "100% cotton", badge: "New" }),
  p("jade-blossom", "Jade Blossom 100% Cotton King Size Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Jade Blossom", "king", 2599,
    "3_e8295d2a-49e1-48ce-acec-6ddcc63b16e7_1200x1200.png?v=1792240398",
    { collections: ["cotton", "king"], color: { name: "Green", hex: "#b7c38a" }, material: "100% cotton" }),
  p("sage-rosette", "Sage Rosette 100% Cotton King Size Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Sage Rosette", "king", 2599,
    "3_838cf78e-3bec-4c85-9fbb-474650aeb5a7_1200x1200.png?v=1792238320",
    { collections: ["cotton", "king"], color: { name: "Sage", hex: "#c2c69b" }, material: "100% cotton" }),
  p("blue-petal-muse", "Blue Petal Muse 100% Cotton King Size Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Blue Petal Muse", "king", 2599,
    "3_73a3c666-6b2d-4d74-b348-51ae6198fbce_1200x1200.png?v=1792240299",
    { collections: ["cotton", "king"], color: { name: "White", hex: "#eef0f2" }, material: "100% cotton" }),
  p("poppy-bloom", "Poppy Bloom 100% Cotton King Size Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Poppy Bloom", "king", 2599,
    "3_30d3662a-4a6d-427c-a360-60383c8f5dc0_1200x1200.png?v=1792238176",
    { collections: ["cotton", "king"], color: { name: "White", hex: "#f3ece6" }, material: "100% cotton" }),
  p("porcelain-bloom", "Porcelain Bloom 100% Cotton King Size Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Porcelain Bloom", "king", 2599,
    "3_11a71f73-8540-40f7-885e-5ced717e81e9_1200x1200.png?v=1792237883",
    { collections: ["cotton", "king"], color: { name: "Blue", hex: "#6f86b4" }, material: "100% cotton" }),

  /* ---- Microfiber king prints ---- */
  p("blue-empress", "Blue Empress King Size Bedsheet Set (1 Bedsheet, 2 Pillow Covers)", "Blue Empress", "king", 1799,
    "3_40c2d036-c874-468f-a2ed-688ca95666da_1200x1200.png?v=1792227312",
    { collections: ["king", "bestseller"], color: { name: "Blue", hex: "#8fa6c6" }, badge: "Bestseller" }),
  p("persian-grace", "Persian Grace King Size Bedsheet Set (1 Bedsheet, 2 Pillow Covers)", "Persian Grace", "king", 1799,
    "3_20fad809-d488-481d-800e-739ab8d8e58d_1200x1200.png?v=1789393466",
    { collections: ["king"], color: { name: "Grey", hex: "#8f8d8c" }, style: "Emboss" }),
  p("pearl-heritage", "Pearl Heritage King Size Bedsheet Set (1 Bedsheet, 2 Pillow Covers)", "Pearl Heritage", "king", 1799,
    "3_793ff401-25d2-425f-9477-e007c2c9bf04_1200x1200.png?v=1788367823",
    { collections: ["king", "bestseller"], color: { name: "White", hex: "#e9e6e1" }, rating: 5.0, reviews: 1, style: "Emboss" }),
  p("regal-grace", "Regal Grace King Size Bedsheet Set (1 Bedsheet, 2 Pillow Covers)", "Regal Grace", "king", 1799,
    "3_90659fe3-c597-44d5-8e65-39e51f5a3ccf_1200x1200.png?v=1788438877",
    { collections: ["king", "bestseller"], color: { name: "Blue", hex: "#566d98" }, rating: 5.0, reviews: 1, types: ["Flat"], style: "Emboss" }),
  p("meher", "Meher King Size Bedsheet Set (1 Bedsheet, 2 Pillow Covers)", "Meher", "king", 1799,
    "3_27049843-a7ca-47c3-a07a-61c02d4eb2cb_1200x1200.png?v=1789390817",
    { collections: ["king"], color: { name: "Brown", hex: "#9b8b7a" } }),
  p("gulnaar", "Gulnaar King Size Bedsheet Set (1 Bedsheet, 2 Pillow Covers)", "Gulnaar", "king", 1799,
    "3_05271108-dcf4-4fec-8dbd-20683243f5fe_1200x1200.png?v=1789390229",
    { collections: ["king"], color: { name: "Beige", hex: "#c9b8a2" } }),
  p("indigo-grid", "Indigo Grid King Size Bedsheet Set (1 Bedsheet, 2 Pillow Covers)", "Indigo Grid", "king", 1799,
    "rn-image_picker_lib_temp_c4dd3339-6553-48ee-b4eb-4a0748ba9014_1200x1200.png?v=1788375983",
    { collections: ["king"], color: { name: "White", hex: "#e4e7ee" }, style: "Solid" }),
  p("ash-blossom", "Ash Blossom King Size Bedsheet Set (1 Bedsheet, 2 Pillow Covers)", "Ash Blossom", "king", 1799,
    "3_2_1200x1200.png?v=1788260912",
    { collections: ["king"], color: { name: "Grey", hex: "#9fa3a7" }, rating: 5.0, reviews: 1 }),

  /* ---- 300TC solid cotton (super king) ---- */
  p("300tc-ivory", "300TC Solid 100% Pure Cotton King Bedsheet Set (1 Bedsheet, 2 Pillow Covers), Ivory", "300TC Solid · Ivory", "superking", 3999,
    "3_2b4b8be5-1785-4884-9ae8-758865ddaed3_1200x1200.png?v=1786797302",
    { collections: ["300tc", "king", "luxury"], color: { name: "Ivory", hex: "#efe6d3" }, types: ["Flat"], style: "Solid", material: "100% pure cotton, 300 thread count" }),
  p("300tc-mocha", "300TC Solid 100% Pure Cotton King Bedsheet Set (1 Bedsheet, 2 Pillow Covers), Mocha", "300TC Solid · Mocha", "superking", 3999,
    "3_e44ae755-b156-413d-af5e-69ecf6628928_1200x1200.png?v=1786797087",
    { collections: ["300tc", "king", "luxury"], color: { name: "Brown", hex: "#8a6f5b" }, types: ["Flat"], style: "Solid", material: "100% pure cotton, 300 thread count" }),
  p("300tc-dusty-rose", "300TC Solid 100% Pure Cotton King Bedsheet Set (1 Bedsheet, 2 Pillow Covers), Dusty Rose", "300TC Solid · Dusty Rose", "superking", 3999,
    "3_16dc27b8-8e65-4e4e-a3d3-854193e693cd_1200x1200.png?v=1786796973",
    { collections: ["300tc", "king", "luxury"], color: { name: "Pink", hex: "#d98b7c" }, types: ["Flat"], style: "Solid", material: "100% pure cotton, 300 thread count" }),
  p("300tc-steel-blue", "300TC Solid 100% Pure Cotton King Bedsheet Set (1 Bedsheet, 2 Pillow Covers), Steel Blue", "300TC Solid · Steel Blue", "superking", 3999,
    "3_a15fa2b4-d9ad-4a2e-b75f-b63417fbcf0e_1200x1200.png?v=1786796795",
    { collections: ["300tc", "king", "luxury"], color: { name: "Blue", hex: "#6f8aa6" }, types: ["Flat"], style: "Solid", material: "100% pure cotton, 300 thread count" }),

  /* ---- Italian embroidery (super king) ---- */
  p("italian-tortora", "Italian Embroidery 3Pcs King Bedsheet Set (1 Bedsheet, 2 Pillow Covers), Tortora", "Italian Embroidery · Tortora", "superking", 2499,
    "3_0bc75c8c-dea0-4142-a767-bb05edc5d88a_1200x1200.png?v=1783857725",
    { collections: ["italian", "king", "luxury"], color: { name: "Beige", hex: "#a39484" }, types: ["Flat"], style: "Solid", rating: 4.3, reviews: 3 }),
  p("italian-rosa-cipria", "Italian Embroidery 3Pcs King Bedsheet Set (1 Bedsheet, 2 Pillow Covers), Rosa Cipria", "Italian Embroidery · Rosa Cipria", "superking", 2499,
    "Untitleddesign_97_1200x1200.png?v=1783869962",
    { collections: ["italian", "king", "luxury"], color: { name: "Pink", hex: "#d97f8d" }, types: ["Flat"], style: "Solid", rating: 4.7, reviews: 3 }),
  p("italian-moka", "Italian Embroidery 3Pcs King Bedsheet Set (1 Bedsheet, 2 Pillow Covers), Moka", "Italian Embroidery · Moka", "superking", 2499,
    "3_85c4db5e-f131-40ab-93bc-2a963cafed7a_1200x1200.png?v=1783857927",
    { collections: ["italian", "king", "luxury"], color: { name: "Brown", hex: "#6b5446" }, types: ["Flat"], style: "Solid", rating: 4.7, reviews: 3 }),
  p("italian-grigio", "Italian Embroidery 3Pcs King Bedsheet Set (1 Bedsheet, 2 Pillow Covers), Grigio", "Italian Embroidery · Grigio", "superking", 2499,
    "AZM_19_1200x1200.png?v=1787233043",
    { collections: ["italian", "king", "luxury"], color: { name: "Blue", hex: "#6c7a93" }, types: ["Flat"], style: "Solid" }),

  /* ---- Double bedsheets ---- */
  p("maharani-green", "Maharani Green 3Pcs Double Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Maharani Green", "double", 1599,
    "rn-image_picker_lib_temp_ec55b29c-c564-4f6f-afb3-57c968a78b50_1200x1200.png?v=1792080307",
    { collections: ["double", "bestseller"], color: { name: "Green", hex: "#5d6c62" }, badge: "Bestseller" }),
  p("amour", "Amour 3Pcs Double Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Amour", "double", 1599,
    "3_d95aca54-84d6-4c71-9d5c-b1413ae1ebae_1200x1200.png?v=1792052148",
    { collections: ["double", "bestseller"], color: { name: "Pink", hex: "#d8b3b6" } }),
  p("pearl-damask", "Pearl Damask 3Pcs Double Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Pearl Damask", "double", 1599,
    "3_9edd6b3f-0f9e-4e29-b5b4-34602bc039ef_1200x1200.png?v=1792052089",
    { collections: ["double", "bestseller"], color: { name: "Beige", hex: "#e2d4cc" } }),
  p("verdant-gold", "Verdant Gold 3Pcs Double Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Verdant Gold", "double", 1599,
    "3_a343af4e-0836-4431-b843-9de8bdc04f60_1200x1200.png?v=1792052027",
    { collections: ["double", "bestseller"], color: { name: "White", hex: "#f1ece0" } }),
  p("jaipuri-bloom", "Jaipuri Bloom 3Pcs Double Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Jaipuri Bloom", "double", 1599,
    "3_7ceb5d9a-667c-415e-8891-06e6931bb0b9_1200x1200.png?v=1792059876",
    { collections: ["double"], color: { name: "Multi", hex: "#c9a26b" }, types: ["Flat"] }),
  p("sapphire-fleur", "Sapphire Fleur 3Pcs Double Bedsheet Set (1 Bedsheet & 2 Pillow Covers)", "Sapphire Fleur", "double", 1599,
    "3_401cea7e-882f-4222-bed5-f0c1b3a4a3e1_1200x1200.png?v=1792052206",
    { collections: ["double"], color: { name: "Blue", hex: "#4e6a9a" } }),

  /* ---- Comforters ---- */
  p("comforter-glacier-blue", "Reversible Double Bed Comforter | 150 GSM, Glacier Blue", "Reversible Comforter · Glacier Blue", "comforter", 2499,
    "3_dada5333-9a01-4e0f-8249-bcc1bfb6448f_1200x1200.png?v=1784106430",
    { collections: ["comforter"], color: { name: "Blue", hex: "#a9bfd6" }, types: ["Double"], style: "Solid", stock: false }),
  p("comforter-twilight-iris", "Reversible Double Bed Comforter | 150 GSM, Twilight Iris", "Reversible Comforter · Twilight Iris", "comforter", 2499,
    "3_c268ca9c-61c6-4ab9-b0a5-58d310c918a1_1200x1200.png?v=1784106305",
    { collections: ["comforter"], color: { name: "Purple", hex: "#7c7bb3" }, types: ["Double"], style: "Solid", stock: false }),
  p("comforter-peach-blush", "Reversible Double Bed Comforter | 150 GSM, Peach Blush", "Reversible Comforter · Peach Blush", "comforter", 2499,
    "3_0814c6a8-0561-4613-a706-6eb2e2812662_1200x1200.png?v=1784106522",
    { collections: ["comforter"], color: { name: "Pink", hex: "#e9b7a6" }, types: ["Double"], style: "Solid", stock: false }),
  p("comforter-charcoal-mist", "Reversible Double Bed Comforter | 150 GSM, Charcoal Mist", "Reversible Comforter · Charcoal Mist", "comforter", 2499,
    "3_b2c90cba-91d6-45f6-9b38-0303022814c2_1200x1200.png?v=1783947152",
    { collections: ["comforter"], color: { name: "Grey", hex: "#5e6266" }, types: ["Double"], style: "Solid", stock: false }),

  /* ---- Floor mats ---- */
  p("mat-mocha-taupe", "Woven Chenille Anti-Slip Floor Mat | Soft & Super Absorbent Bath Mat, Mocha Taupe", "Woven Chenille Mat · Mocha Taupe", "mat", 799,
    "3_80e7d8d7-b0ef-4176-8ccf-af74bdf96184_1200x1200.png?v=1784109851",
    { collections: ["mat", "luxury"], color: { name: "Brown", hex: "#8c7a68" }, types: ["Standard"], style: "Solid", material: "Chenille with anti-slip backing" }),
  p("mat-ash-grey", "Woven Chenille Anti-Slip Floor Mat | Soft & Super Absorbent Bath Mat, Ash Grey", "Woven Chenille Mat · Ash Grey", "mat", 799,
    "3_53aa2619-5ba7-4864-9404-fd332d6244fc_1200x1200.png?v=1784109353",
    { collections: ["mat", "luxury"], color: { name: "Grey", hex: "#8f9296" }, types: ["Standard"], style: "Solid", material: "Chenille with anti-slip backing" })
];

const COLLECTIONS = {
  all:      { title: "All bedding", intro: "Every print, every size. Mix any 2 or 3 bedsheets and the bundle discount applies on its own.", filter: () => true },
  king:     { title: "King size bedsheets", intro: "100 × 108 in sheets for 6 × 6.5 ft beds, plus 108 × 108 in Super King for deeper mattresses.", filter: x => x.collections.includes("king"), banner: "assets/img/banner-king.jpg" },
  double:   { title: "Double bedsheets", intro: "90 × 100 in sheets for 5 × 6.25 ft beds, with two pillow covers in every set.", filter: x => x.size === "double" },
  cotton:   { title: "100% cotton bedsheets", intro: "Breathable printed cotton for Indian summers. Soft from the first wash.", filter: x => x.collections.includes("cotton") },
  italian:  { title: "Italian embroidery", intro: "Solid-tone super king sets with embroidered accent pillow covers.", filter: x => x.collections.includes("italian") },
  "300tc":  { title: "Solid cotton 300TC", intro: "Pure cotton, 300 thread count, in seven quiet colours.", filter: x => x.collections.includes("300tc") },
  comforter:{ title: "Reversible comforters", intro: "150 GSM, two colours in one, made for AC rooms.", filter: x => x.size === "comforter" },
  mat:      { title: "Hand woven mats", intro: "Chenille mats with anti-slip backing that dry fast.", filter: x => x.size === "mat" }
};

const REVIEWS = [
  { title: "Already ordered more", text: "Loved the first bedsheet so much that I went back and ordered two more designs. There are so many beautiful prints to choose from!", name: "Rishabh", city: "New Delhi", stars: 5 },
  { title: "Beautiful print & quality", text: "At first, I was unsure but I gave it a shot. And when my package arrived, I just loved the prints, they suited my bedroom style and design.", name: "Aliya", city: "Navi Mumbai", stars: 5 },
  { title: "Absolutely loved it", text: "The design is so beautiful, and the colours look amazing in my bedroom. The fabric feels really comfortable too. Very happy with my purchase!", name: "Laxmi", city: "Uttar Pradesh", stars: 5 },
  { title: "Worth every penny", text: "Such a beautiful bedsheet at this price! The quality feels good, the design is elegant, and it has completely changed the look of my room.", name: "Sahil", city: "Jaipur", stars: 5 },
  { title: "Perfect fit for my bed", text: "Finally found a bedsheet that fits my mattress properly! No loose corners or extra fabric hanging around. It looks neat and stays in place.", name: "Vidya", city: "Bangalore", stars: 5 }
];

const BLOGS = [
  { title: "Top bedding brands in India (2026): best bedsheets & comfort brands", text: "How the Indian bedding market has changed, and what to look for beyond price.", img: "assets/img/blog-1.jpg", url: "https://thealiving.in/blogs/blog-posts/top-bedding-brands-india", read: "6 min read" },
  { title: "Best bedsheets for Indian summers: what fabric works best?", text: "Cotton, microfiber and blends compared for hot, humid nights.", img: "assets/img/blog-2.jpg", url: "https://thealiving.in/blogs/blog-posts/best-bedsheets-for-indian-summers-what-fabric-works-best", read: "5 min read" },
  { title: "King vs Super King bedsheets: what's the difference?", text: "Exact Indian bed dimensions and how to pick the right fit for your mattress.", img: "assets/img/blog-3.jpg", url: "https://thealiving.in/blogs/blog-posts/king-vs-super-king-bedsheets-what-s-the-difference-indian-bedding-size-guide-2026", read: "4 min read" }
];
