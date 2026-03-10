// ─── Types ────────────────────────────────────────────────────────────────────
export type Category = "Korallen" | "Fische" | "Wirbellose" | "Anemonen" | "Equipment" | "Frags";
export type Subcategory =
  // Korallen
  | "LPS" | "SPS" | "Weichkorallen" | "Zoanthus/Palythoa"
  // Fische
  | "Anemonenfische" | "Doktorfische" | "Lippfische" | "Grundeln" | "Zwergbarsche" | "Kaiserfische" | "Sonstige Fische"
  // Wirbellose
  | "Garnelen" | "Muscheln" | "Krabben" | "Schnecken" | "Seesterne" | "Seeigel" | "Sonstige Wirbellose"
  // Anemonen
  | "Blasenanemonen" | "Teppichanemonen" | "Scheibenanemonen" | "Röhrenanemonen"
  // Equipment
  | "Beleuchtung" | "Strömung" | "Abschäumer" | "Filter" | "Heizung" | "Osmose" | "Dosierung" | "Mess/Steuerung" | "Aquarium" | "Sonstiges Equipment"
  // Frags
  | "LPS Frags" | "SPS Frags" | "Weichkorallen Frags" | "Zoanthus Frags" | "Mischpakete";
export type Condition = "Nachzucht" | "Wildfang" | "Gebraucht" | "Neu";
export type ListingType = "B2C" | "C2C";
export type OfferType = "sell" | "trade" | "gift";

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  sell: "Verkaufen",
  trade: "Tauschen",
  gift: "Verschenken",
};

// ─── Category → Subcategory map ───────────────────────────────────────────────
export const SUBCATEGORIES: Record<Category, { value: Subcategory; label: string; info?: string }[]> = {
  Korallen: [
    { value: "LPS", label: "LPS (Large Polyp Stony)", info: "Euphyllia, Trachyphyllia, Blastomussa, Caulastrea, Goniopora, Duncanopsammia…" },
    { value: "SPS", label: "SPS (Small Polyp Stony)", info: "Acropora, Montipora, Stylophora, Pocillopora, Seriatopora…" },
    { value: "Weichkorallen", label: "Weichkorallen", info: "Sinularia, Sarcophyton, Xenia, Clavularia, Nepthea…" },
    { value: "Zoanthus/Palythoa", label: "Zoanthus / Palythoa", info: "Zoanthus-Morphen, Palythoa grandis etc. – Vorsicht: Palytoxin!" },
  ],
  Fische: [
    { value: "Anemonenfische", label: "Anemonenfische", info: "Amphiprion ocellaris, A. percula, A. clarkii etc." },
    { value: "Doktorfische", label: "Doktorfische / Surgeons", info: "Paracanthurus, Zebrasoma, Acanthurus etc." },
    { value: "Lippfische", label: "Lippfische / Wrasses", info: "Pseudocheilinus, Halichoeres, Cirrhilabrus etc." },
    { value: "Grundeln", label: "Grundeln / Gobies", info: "Elacatinus, Nemateleotris, Valenciennea etc." },
    { value: "Zwergbarsche", label: "Zwergbarsche / Dottybacks" },
    { value: "Kaiserfische", label: "Kaiserfische / Angelfishes" },
    { value: "Sonstige Fische", label: "Sonstige" },
  ],
  Wirbellose: [
    { value: "Garnelen", label: "Garnelen", info: "Lysmata, Stenopus, Thor etc." },
    { value: "Muscheln", label: "Muscheln / Clams", info: "Tridacna maxima, T. squamosa, T. crocea etc." },
    { value: "Krabben", label: "Krabben" },
    { value: "Schnecken", label: "Schnecken" },
    { value: "Seesterne", label: "Seesterne", info: "Fromia, Linckia etc." },
    { value: "Seeigel", label: "Seeigel" },
    { value: "Sonstige Wirbellose", label: "Sonstige" },
  ],
  Anemonen: [
    { value: "Blasenanemonen", label: "Blasenanemonen (BTA/RBTA)", info: "Entacmaea quadricolor – häufigster Clownfisch-Wirt" },
    { value: "Teppichanemonen", label: "Teppichanemonen", info: "Stichodactyla, Heteractis – grosse Arten, nur für erfahrene Keeper" },
    { value: "Scheibenanemonen", label: "Scheibenanemonen (Discosoma/Rhodactis)", info: "Discosoma, Rhodactis, Ricordea – pflegeleicht" },
    { value: "Röhrenanemonen", label: "Röhrenanemonen (Cerianthus)" },
  ],
  Equipment: [
    { value: "Beleuchtung", label: "Beleuchtung / LED" },
    { value: "Strömung", label: "Strömungspumpen" },
    { value: "Abschäumer", label: "Abschäumer / Skimmer" },
    { value: "Filter", label: "Filter / Filtermedien" },
    { value: "Heizung", label: "Heizung / Kühlung" },
    { value: "Osmose", label: "Osmoseanlage" },
    { value: "Dosierung", label: "Dosierpumpen / Balling" },
    { value: "Mess/Steuerung", label: "Messtechnik / Controller" },
    { value: "Aquarium", label: "Aquarium / Technikbecken" },
    { value: "Sonstiges Equipment", label: "Sonstiges" },
  ],
  Frags: [
    { value: "LPS Frags", label: "LPS Frags" },
    { value: "SPS Frags", label: "SPS Frags" },
    { value: "Weichkorallen Frags", label: "Weichkorallen Frags" },
    { value: "Zoanthus Frags", label: "Zoanthus / Palythoa Frags" },
    { value: "Mischpakete", label: "Mischpakete / Starter-Sets" },
  ],
};

// ─── CITES Information ────────────────────────────────────────────────────────
export const CITES_INFO = {
  appendices: [
    { value: "I", label: "CITES Anhang I", desc: "Höchster Schutz – Handel nur mit Ausnahmegenehmigung" },
    { value: "II", label: "CITES Anhang II", desc: "Kontrollierter Handel – Ausfuhrgenehmigung erforderlich" },
    { value: "III", label: "CITES Anhang III", desc: "Nationaler Schutz – Ursprungsnachweis erforderlich" },
  ],
  sources: [
    { value: "W", label: "W – Wildfang", desc: "Wildentnahme" },
    { value: "C", label: "C – Captive bred", desc: "In Gefangenschaft gezüchtet (F2+)" },
    { value: "F", label: "F – F1 Nachzucht", desc: "Erste Nachzuchtgeneration aus Wildfangeltern" },
    { value: "D", label: "D – Anhang I Zucht", desc: "Anhang I Arten aus registrierten Zuchtbetrieben" },
  ],
  requiredCategories: ["Korallen", "Frags"] as Category[],
  requiredConditions: ["Wildfang"] as Condition[],
  info: "Alle Steinkorallen (Scleractinia), Feuerkorallen (Millepora), Riesenmuscheln (Tridacna) und bestimmte Anemonen fallen unter CITES Anhang II. Beim Handel mit Wildfang ist eine gültige CITES-Genehmigung (EU-EG Bescheinigung) erforderlich. Nachzuchten (F2+) benötigen einen Herkunftsnachweis. In der Schweiz ist das BLV (Bundesamt für Lebensmittelsicherheit und Veterinärwesen) zuständig.",
};

// ─── Equipment filter options ─────────────────────────────────────────────────
export const EQUIPMENT_BRANDS = [
  "AI (Aqua Illumination)", "Ecotech Marine", "Kessil", "Radion", "Orphek",
  "Tunze", "Maxspect", "Nyos", "Royal Exclusiv", "Bubble Magus",
  "Red Sea", "Aqua Medic", "Fauna Marin", "Tropic Marin", "GHL",
  "Apex / Neptune Systems", "Reef Factory", "Deltec", "ATI", "Elos",
  "AquaForest", "Vertex", "Hydor", "Jebao/Jecod", "Hanna Instruments",
  "D-D (DD)", "TMC", "Eheim", "Andere",
];

export const EQUIPMENT_TYPES = [
  { value: "Beleuchtung", label: "Beleuchtung / LED", icon: "💡" },
  { value: "Strömung", label: "Strömungspumpen", icon: "🌊" },
  { value: "Abschäumer", label: "Abschäumer / Skimmer", icon: "🫧" },
  { value: "Filter", label: "Filter / Filtermedien", icon: "🧹" },
  { value: "Heizung", label: "Heizung / Kühlung", icon: "🌡️" },
  { value: "Osmose", label: "Osmoseanlage", icon: "💧" },
  { value: "Dosierung", label: "Dosierpumpen / Balling", icon: "🧪" },
  { value: "Mess/Steuerung", label: "Messtechnik / Controller", icon: "📊" },
  { value: "Aquarium", label: "Aquarium / Technikbecken", icon: "🐟" },
  { value: "Sonstiges Equipment", label: "Sonstiges", icon: "🔧" },
];

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  type: "Händler" | "Privat";
  location: string;
  memberSince: string;
  salesCount: number;
  bio?: string;
}

export interface Listing {
  id: string;
  title: string;
  latin: string;
  price: number;
  currency: "CHF" | "EUR";
  subtitle: string;
  description: string;
  location: string;
  image: string;
  images: string[];
  category: Category;
  subcategory?: Subcategory;
  condition: Condition;
  listingType: ListingType;
  offerType: OfferType;
  seller: Seller;
  tags: string[];
  postedAt: string;
  views: number;
  saved: boolean;
  badge?: string;
  shipping: boolean;
  shippingCost?: number;
  pickup: boolean;
  citesRequired?: boolean;
  citesNumber?: string;
  citesAppendix?: string;
  citesSource?: string;
  equipmentType?: string;
  brand?: string;
  wattage?: number;
  tankSizeMin?: number;
  tankSizeMax?: number;
}

// ─── Image URLs (Unsplash – free, reliable) ───────────────────────────────────
const IMG = {
  // Corals
  torchCoral:     "https://images.unsplash.com/photo-1559908002-4ee5de8cbac6?w=800&q=80",
  torchCoral2:    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  hammerCoral:    "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80",
  brainCoral:     "https://images.unsplash.com/photo-1546500840-ae38253aba9b?w=800&q=80",
  bubbleCoral:    "https://images.unsplash.com/photo-1582967788606-a171c7ce6528?w=800&q=80",
  duncanCoral:    "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=800&q=80",
  goniopora:      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80",
  acropora:       "https://images.unsplash.com/photo-1534575180952-41e7dd6dbc68?w=800&q=80",
  acropora2:      "https://images.unsplash.com/photo-1559908002-4ee5de8cbac6?w=800&q=80",
  softCoral:      "https://images.unsplash.com/photo-1582967788606-a171c7ce6528?w=800&q=80",
  xenia:          "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=800&q=80",
  zoanthus:       "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  zoanthus2:      "https://images.unsplash.com/photo-1546500840-ae38253aba9b?w=800&q=80",
  // Fish
  clownfish:      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&q=80",
  clownfish2:     "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&q=80",
  blueTang:       "https://images.unsplash.com/photo-1596400908418-c4ad1dc7bafa?w=800&q=80",
  mandarinFish:   "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&q=80",
  wrasse:         "https://images.unsplash.com/photo-1520301255226-bf5f144451c1?w=800&q=80",
  firefish:       "https://images.unsplash.com/photo-1596400908418-c4ad1dc7bafa?w=800&q=80",
  // Invertebrates
  giantClam:      "https://images.unsplash.com/photo-1582967788606-a171c7ce6528?w=800&q=80",
  fireShrimp:     "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  cleanerShrimp:  "https://images.unsplash.com/photo-1559908002-4ee5de8cbac6?w=800&q=80",
  // Anemones
  bta:            "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80",
  rbta:           "https://images.unsplash.com/photo-1534575180952-41e7dd6dbc68?w=800&q=80",
  discosoma:      "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=800&q=80",
  // Equipment / General
  ledLight:       "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  aquarium:       "https://images.unsplash.com/photo-1520301255226-bf5f144451c1?w=800&q=80",
  skimmer:        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  fragPack:       "https://images.unsplash.com/photo-1546500840-ae38253aba9b?w=800&q=80",
  fragsRack:      "https://images.unsplash.com/photo-1582967788606-a171c7ce6528?w=800&q=80",
  reefMix:        "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80",
};

export const sellers: Seller[] = [
  {
    id: "s1", name: "CoralHaus Luzern", avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4.9, reviewCount: 214, verified: true, type: "Händler", location: "Luzern",
    memberSince: "2019", salesCount: 1240,
    bio: "Professioneller Meerwasser-Händler mit Fokus auf LPS-Korallen, Anemonen und seltene Fische. CITES-konformer Handel.",
  },
  {
    id: "s2", name: "Marc S.", avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4.7, reviewCount: 38, verified: false, type: "Privat", location: "Zug",
    memberSince: "2022", salesCount: 47,
    bio: "Reef-Enthusiast seit 6 Jahren. Verkaufe Ableger aus meinem 800L Mixed-Reef.",
  },
  {
    id: "s3", name: "ReefLab Zürich", avatar: "https://i.pravatar.cc/150?img=7",
    rating: 5.0, reviewCount: 89, verified: true, type: "Händler", location: "Stans",
    memberSince: "2020", salesCount: 532,
    bio: "Spezialisiert auf SPS und Züchtung seltener Korallen. Wissenschaftlich fundierte Aquaristik.",
  },
  {
    id: "s4", name: "Nina B.", avatar: "https://i.pravatar.cc/150?img=25",
    rating: 4.8, reviewCount: 22, verified: false, type: "Privat", location: "Bern",
    memberSince: "2023", salesCount: 31,
    bio: "SPS-Liebhaberin, verkaufe Überschuss aus meinem Frag-System.",
  },
  {
    id: "s5", name: "OceanBreeder GmbH", avatar: "https://i.pravatar.cc/150?img=15",
    rating: 4.6, reviewCount: 177, verified: true, type: "Händler", location: "Basel",
    memberSince: "2018", salesCount: 2100,
    bio: "Schweizer Meerwasser-Züchter mit über 20 aktiven Nachzuchtsystemen.",
  },
  {
    id: "s6", name: "ReefAlliance Shop", avatar: "https://i.pravatar.cc/150?img=33",
    rating: 4.9, reviewCount: 312, verified: true, type: "Händler", location: "Zürich",
    memberSince: "2017", salesCount: 3200,
    bio: "Nachzuchten, Wildfang und Equipment höchster Qualität. CITES-konform, mit Gesundheitsgarantie.",
  },
  {
    id: "s7", name: "AquaCorals Winterthur", avatar: "https://i.pravatar.cc/150?img=52",
    rating: 4.8, reviewCount: 178, verified: true, type: "Händler", location: "Winterthur",
    memberSince: "2021", salesCount: 870,
    bio: "Spezialisierter Meerwasser-Fachhandel mit eigenen Nachzuchtsystemen. CITES-konform.",
  },
];

export const listings: Listing[] = [
  // ─── LPS Korallen ──────────────────────────────────────────────────────────
  {
    id: "l1", title: "Dragon Soul Torch", latin: "Euphyllia glabrescens",
    price: 180, currency: "CHF",
    subtitle: "Hand selected frag – premium Orange/Gold coloration",
    description: "Absoluter Hingucker – diese Dragon Soul Torch zeigt ein sattes Orange-Gold mit leuchtenden Tips. Aus einem 3-jährig etablierten System. 3 Köpfe, 5+ cm Polypengrösse. Vollständig akklimatisiert auf NSW-Parameter.",
    location: "Luzern", image: IMG.torchCoral, images: [IMG.torchCoral, IMG.torchCoral2, IMG.duncanCoral],
    category: "Korallen", subcategory: "LPS", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[0], tags: ["LPS", "Euphyllia", "Premium", "WYSIWYG"],
    postedAt: "2h", views: 342, saved: false, badge: "Curated Drop",
    shipping: true, shippingCost: 28, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },
  {
    id: "ra2", title: "Hammer Coral – Gold/Green", latin: "Euphyllia ancora",
    price: 75, currency: "CHF",
    subtitle: "Frag 3 Köpfe – Gold-grüne Spitzen",
    description: "Euphyllia ancora mit goldgrünen Hammerspitzen. 3 Köpfe auf Keramikhalter, ca. 8 cm. Nachzucht, seit 2 Jahren etabliert.",
    location: "Zürich", image: IMG.hammerCoral, images: [IMG.hammerCoral, IMG.duncanCoral],
    category: "Korallen", subcategory: "LPS", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[5], tags: ["LPS", "Euphyllia", "Hammer", "Nachzucht"],
    postedAt: "3h", views: 198, saved: false,
    shipping: true, shippingCost: 28, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },
  {
    id: "l8", title: "Blasenpilz Grün/Pink", latin: "Plerogyra sinuosa",
    price: 65, currency: "CHF",
    subtitle: "Pflegeleicht – grüne Blasen, pink Gewebe",
    description: "Plerogyra sinuosa, grüne Blasen mit pink-violettem Gewebe. Sehr pflegeleichte LPS-Koralle für Einsteiger. Frag ca. 6 cm mit 2 Köpfen.",
    location: "Stans", image: IMG.bubbleCoral, images: [IMG.bubbleCoral, IMG.softCoral],
    category: "Korallen", subcategory: "LPS", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[2], tags: ["LPS", "Blasenpilz", "Einsteiger"],
    postedAt: "6d", views: 156, saved: false,
    shipping: true, shippingCost: 22, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },
  {
    id: "cw3", title: "Rainbow Brain Coral", latin: "Trachyphyllia geoffroyi",
    price: 115, currency: "CHF",
    subtitle: "Einzelpolype – Rot/Grün/Blau, WYSIWYG Wildfang",
    description: "Spektakuläre Trachyphyllia geoffroyi mit dreifarbigem Muster. Durchmesser ca. 7 cm. Frisst Frozen Mysis. WYSIWYG.",
    location: "Winterthur", image: IMG.brainCoral, images: [IMG.brainCoral, IMG.reefMix],
    category: "Korallen", subcategory: "LPS", condition: "Wildfang", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["LPS", "Trachyphyllia", "Brain", "WYSIWYG", "Wildfang"],
    postedAt: "6h", views: 189, saved: false, badge: "WYSIWYG",
    shipping: false, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "W", citesNumber: "CH-2026-MW-00431",
  },
  {
    id: "ra5", title: "Duncan Coral Kolonie", latin: "Duncanopsammia axifuga",
    price: 120, currency: "CHF",
    subtitle: "8 Köpfe – bewegliche Tentakel, einfach zu halten",
    description: "Duncanopsammia axifuga mit 8 Köpfen. Grüne Tentakel mit leuchtenden Spitzen. Pflegeleichteste LPS-Koralle – ideal für Einsteiger.",
    location: "Zürich", image: IMG.duncanCoral, images: [IMG.duncanCoral, IMG.reefMix],
    category: "Korallen", subcategory: "LPS", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[5], tags: ["LPS", "Duncan", "Einsteiger", "Kolonie"],
    postedAt: "1d", views: 221, saved: false, badge: "Bestseller",
    shipping: true, shippingCost: 28, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },
  {
    id: "ra6", title: "Goniopora – Blumenpilz Pink", latin: "Goniopora sp.",
    price: 89, currency: "CHF",
    subtitle: "Frag 2 Köpfe – seltene pinke Variante",
    description: "Goniopora sp. in seltener pinker Färbung. Lange, sich wiegende Tentakel. Frag auf Keramikhalter, 2 Köpfe.",
    location: "Zürich", image: IMG.goniopora, images: [IMG.goniopora],
    category: "Korallen", subcategory: "LPS", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[5], tags: ["LPS", "Goniopora", "Pink", "Blumenpilz"],
    postedAt: "2d", views: 178, saved: false,
    shipping: true, shippingCost: 28, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },

  // ─── SPS Korallen ──────────────────────────────────────────────────────────
  {
    id: "l4", title: "Acropora Tricolor", latin: "Acropora millepora",
    price: 145, currency: "CHF",
    subtitle: "Tri-color SPS – Grün/Blau/Pink Tips",
    description: "Acropora millepora Tricolor – drei Farbtöne je nach Beleuchtung. Frag ca. 5 cm auf Keramikhalter. Benötigt >250 PAR.",
    location: "Bern", image: IMG.acropora, images: [IMG.acropora, IMG.acropora2],
    category: "Korallen", subcategory: "SPS", condition: "Nachzucht", listingType: "C2C", offerType: "sell",
    seller: sellers[3], tags: ["SPS", "Acropora", "Tricolor", "Frag"],
    postedAt: "2d", views: 278, saved: false,
    shipping: true, shippingCost: 28, pickup: false,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },
  {
    id: "cw6", title: "Montipora capricornis – Orange Plate", latin: "Montipora capricornis",
    price: 58, currency: "CHF",
    subtitle: "Plattenfrag 8 cm – leuchtendes Orange, SPS-Einsteiger",
    description: "Montipora capricornis in strahlendem Orange. Weniger anspruchsvoll als Acropora, schnellwachsend. Frag ca. 8 cm.",
    location: "Winterthur", image: IMG.acropora2, images: [IMG.acropora2],
    category: "Korallen", subcategory: "SPS", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["SPS", "Montipora", "Orange", "Einsteiger"],
    postedAt: "2d", views: 127, saved: false,
    shipping: true, shippingCost: 22, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },

  // ─── Zoanthus / Palythoa ───────────────────────────────────────────────────
  {
    id: "l3", title: "Ultra Zoanthus Garden", latin: "Zoanthus sp.",
    price: 95, currency: "CHF",
    subtitle: "150+ Polypen, WYSIWYG – Rot/Gelb/Pink-Rim",
    description: "Dichtes Zoanthus-Riff mit mind. 150+ Polypen auf 12×8 cm Stein. Farben: Rottöne, Gelb, Pink-Rim. Gesund, geschlossen getestet.",
    location: "Stans", image: IMG.zoanthus, images: [IMG.zoanthus, IMG.reefMix],
    category: "Korallen", subcategory: "Zoanthus/Palythoa", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[2], tags: ["Zoanthus", "Ultra", "WYSIWYG", "Kolonie"],
    postedAt: "1d", views: 512, saved: false, badge: "Hot Deal",
    shipping: true, shippingCost: 22, pickup: true, citesRequired: false,
  },

  // ─── Fische ────────────────────────────────────────────────────────────────
  {
    id: "l2", title: "Oman Clown Pair", latin: "Amphiprion omanensis",
    price: 220, currency: "CHF",
    subtitle: "Seltenes Paar – fressen Pellets & Frozen",
    description: "Extrem seltenes Paar Oman-Clownfische. Weibchen deutlich grösser. Beide fressen Pellets und Frozen. Nachzucht aus CH-Bestand, CITES-konform.",
    location: "Zug", image: IMG.clownfish, images: [IMG.clownfish, IMG.clownfish2],
    category: "Fische", subcategory: "Anemonenfische", condition: "Nachzucht", listingType: "C2C", offerType: "sell",
    seller: sellers[1], tags: ["Clownfisch", "Paar", "Selten", "Nachzucht CH"],
    postedAt: "5h", views: 189, saved: true, shipping: false, pickup: true,
  },
  {
    id: "ra1", title: "Royal Blue Tang", latin: "Paracanthurus hepatus",
    price: 155, currency: "CHF",
    subtitle: "Akklimatisiert, frisst Pellets – 7 cm",
    description: "Paracanthurus hepatus, ca. 7 cm. Akklimatisiert, frisst Pellets + Frozen. 21 Tage quarantänisiert. Mind. 300L.",
    location: "Zürich", image: IMG.blueTang, images: [IMG.blueTang],
    category: "Fische", subcategory: "Doktorfische", condition: "Wildfang", listingType: "B2C", offerType: "sell",
    seller: sellers[5], tags: ["Doktorfisch", "Blue Tang", "Frisst Pellets", "Quarantänisiert"],
    postedAt: "1h", views: 284, saved: false, badge: "Top Qualität",
    shipping: true, shippingCost: 35, pickup: true,
  },
  {
    id: "l5", title: "Mandarin Dragonet Paar", latin: "Synchiropus splendidus",
    price: 130, currency: "CHF",
    subtitle: "Frisst Frozen – extrem selten trainiert",
    description: "Mandarinfisch-Paar (m+w), fressen Frozen Copepods und Artemia. Extrem selten für diese Art. Aus 1500L System.",
    location: "Basel", image: IMG.mandarinFish, images: [IMG.mandarinFish],
    category: "Fische", subcategory: "Sonstige Fische", condition: "Wildfang", listingType: "B2C", offerType: "sell",
    seller: sellers[4], tags: ["Mandarinfisch", "Paar", "Frisst Frozen"],
    postedAt: "3d", views: 421, saved: true, badge: "Selten",
    shipping: false, pickup: true,
  },
  {
    id: "ra3", title: "Sixline Wrasse", latin: "Pseudocheilinus hexataenia",
    price: 78, currency: "CHF",
    subtitle: "Farbenfroh – natürliche Schädlingsbekämpfung",
    description: "Pseudocheilinus hexataenia – frisst Milben und Parasiten. Akklimatisiert, frisst Frozen.",
    location: "Zürich", image: IMG.wrasse, images: [IMG.wrasse],
    category: "Fische", subcategory: "Lippfische", condition: "Wildfang", listingType: "B2C", offerType: "sell",
    seller: sellers[5], tags: ["Lippfisch", "Wrasse", "Schädlingsbekämpfung", "Riff-sicher"],
    postedAt: "5h", views: 134, saved: false,
    shipping: true, shippingCost: 35, pickup: true,
  },
  {
    id: "cw12", title: "Clownfisch-Paar Nachzucht", latin: "Amphiprion ocellaris",
    price: 78, currency: "CHF",
    subtitle: "Weibchen + Männchen – frisst Pellets & Frozen",
    description: "Klassisches Clownfisch-Paar aus Schweizer Nachzucht. Weibchen ca. 5 cm, Männchen ca. 3.5 cm. Ideal ab 100L.",
    location: "Winterthur", image: IMG.clownfish2, images: [IMG.clownfish2, IMG.clownfish],
    category: "Fische", subcategory: "Anemonenfische", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["Clownfisch", "Paar", "Nachzucht CH", "Frisst Pellets"],
    postedAt: "4h", views: 389, saved: false, badge: "Nachzucht CH",
    shipping: true, shippingCost: 35, pickup: true,
  },
  {
    id: "cw15", title: "Feuerpfeil-Grundel", latin: "Nemateleotris magnifica",
    price: 62, currency: "CHF",
    subtitle: "Leuchtend Rot/Weiss – atemberaubend",
    description: "Nemateleotris magnifica – leuchtend weisser Körper mit sattem Rot/Orange. Sehr friedlich, ideal für Riffbecken.",
    location: "Winterthur", image: IMG.firefish, images: [IMG.firefish],
    category: "Fische", subcategory: "Grundeln", condition: "Wildfang", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["Grundel", "Feuerpfeil", "Friedlich", "Riff-sicher"],
    postedAt: "3d", views: 176, saved: false,
    shipping: true, shippingCost: 35, pickup: true,
  },

  // ─── Wirbellose ────────────────────────────────────────────────────────────
  {
    id: "l6", title: "Maxima Clam Electric Blue", latin: "Tridacna maxima",
    price: 290, currency: "CHF",
    subtitle: "10 cm Schalenbreite – leuchtend blauer Mantel",
    description: "Electric Blue Maxima-Muschel. Schalenbreite 10 cm. Benötigt 400+ PAR und SPS-Bedingungen.",
    location: "Luzern", image: IMG.giantClam, images: [IMG.giantClam],
    category: "Wirbellose", subcategory: "Muscheln", condition: "Wildfang", listingType: "B2C", offerType: "sell",
    seller: sellers[0], tags: ["Muschel", "Tridacna", "Electric Blue", "Showpiece"],
    postedAt: "4d", views: 198, saved: false,
    shipping: false, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "W", citesNumber: "CH-2026-MW-00328",
  },
  {
    id: "ra4", title: "Pacific Cleaner Shrimp Duo", latin: "Lysmata amboinensis",
    price: 52, currency: "CHF",
    subtitle: "2er-Set – Putzerstation für dein Becken",
    description: "Zwei Lysmata amboinensis – natürliche Putzstation. Fressen Parasiten von Fischen. Inkl. Lebendtransport-Garantie.",
    location: "Zürich", image: IMG.cleanerShrimp, images: [IMG.cleanerShrimp],
    category: "Wirbellose", subcategory: "Garnelen", condition: "Wildfang", listingType: "B2C", offerType: "sell",
    seller: sellers[5], tags: ["Garnele", "Cleaner", "Putzstation", "Riff-sicher"],
    postedAt: "1d", views: 165, saved: false,
    shipping: true, shippingCost: 28, pickup: true,
  },
  {
    id: "cw17", title: "Fire Shrimp – Blutrote Putzergarnele", latin: "Lysmata debelius",
    price: 58, currency: "CHF",
    subtitle: "Sattrot mit weissen Antennen",
    description: "Lysmata debelius in sattem Blutrot. Frisst Parasiten von Fischen. Für Becken ab 80L.",
    location: "Winterthur", image: IMG.fireShrimp, images: [IMG.fireShrimp],
    category: "Wirbellose", subcategory: "Garnelen", condition: "Wildfang", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["Garnele", "Fire Shrimp", "Putzstation", "Riff-sicher"],
    postedAt: "1d", views: 142, saved: false,
    shipping: true, shippingCost: 28, pickup: true,
  },
  {
    id: "cw16", title: "Tridacna squamosa – Multicolor", latin: "Tridacna squamosa",
    price: 185, currency: "CHF",
    subtitle: "Schalenbreite 8 cm – Braun/Gold/Grün, WYSIWYG",
    description: "Tridacna squamosa mit Mantel in Braun-, Gold- und Grüntönen. 8 cm. Benötigt 200+ PAR. WYSIWYG.",
    location: "Winterthur", image: IMG.giantClam, images: [IMG.giantClam],
    category: "Wirbellose", subcategory: "Muscheln", condition: "Wildfang", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["Muschel", "Tridacna", "WYSIWYG", "Filterfeeder"],
    postedAt: "2h", views: 223, saved: false, badge: "WYSIWYG",
    shipping: false, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "W", citesNumber: "CH-2026-MW-00445",
  },

  // ─── Anemonen (eigene Kategorie!) ──────────────────────────────────────────
  {
    id: "ra9", title: "Rose Bubble Tip Anemone", latin: "Entacmaea quadricolor",
    price: 68, currency: "CHF",
    subtitle: "Roséfarben – idealer Clownfisch-Host",
    description: "Entacmaea quadricolor in rosé/lachs Färbung mit aufgeblasenen Blasentips. Perfekter Clownfisch-Wirt. Ca. 10 cm geöffnet.",
    location: "Zürich", image: IMG.bta, images: [IMG.bta, IMG.rbta],
    category: "Anemonen", subcategory: "Blasenanemonen", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[5], tags: ["Anemone", "BTA", "RBTA", "Clownfisch-Wirt", "Nachzucht"],
    postedAt: "4d", views: 256, saved: false, badge: "Beliebt",
    shipping: false, pickup: true, citesRequired: false,
  },
  {
    id: "an1", title: "Grüne Bubble Tip Anemone", latin: "Entacmaea quadricolor",
    price: 55, currency: "CHF",
    subtitle: "Leuchtend grün unter Blaulicht – Nachzucht",
    description: "E. quadricolor 'Green' – leuchtet unter Blaulicht intensiv. Ideal für Amphiprion ocellaris. Ca. 8 cm.",
    location: "Basel", image: IMG.rbta, images: [IMG.rbta, IMG.bta],
    category: "Anemonen", subcategory: "Blasenanemonen", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[4], tags: ["Anemone", "BTA", "Grün", "Nachzucht", "Clownfisch-Wirt"],
    postedAt: "2d", views: 187, saved: false,
    shipping: false, pickup: true, citesRequired: false,
  },
  {
    id: "an2", title: "Scheibenanemone Mix-Stein", latin: "Discosoma sp.",
    price: 45, currency: "CHF",
    subtitle: "8+ Scheiben – Rot/Blau/Grün auf Stein",
    description: "Discosoma sp., mind. 8 Scheibenanemonen in verschiedenen Farben. Extrem pflegeleicht, wächst auch unter wenig Licht.",
    location: "Bern", image: IMG.discosoma, images: [IMG.discosoma],
    category: "Anemonen", subcategory: "Scheibenanemonen", condition: "Nachzucht", listingType: "C2C", offerType: "sell",
    seller: sellers[3], tags: ["Scheibenanemone", "Discosoma", "Einsteiger", "Pflegeleicht"],
    postedAt: "3d", views: 98, saved: false,
    shipping: true, shippingCost: 22, pickup: true, citesRequired: false,
  },

  // ─── Equipment ─────────────────────────────────────────────────────────────
  {
    id: "l7", title: "AI Hydra 64 HD LED", latin: "",
    price: 480, currency: "CHF",
    subtitle: "18 Monate alt – alle Kanäle perfekt",
    description: "AI Hydra 64 HD LED inkl. Flexarm. 18 Monate alt, nur SPS-Tank. Alle Kanäle funktionieren.",
    location: "Zug", image: IMG.ledLight, images: [IMG.ledLight],
    category: "Equipment", subcategory: "Beleuchtung", condition: "Gebraucht", listingType: "C2C", offerType: "sell",
    seller: sellers[1], tags: ["LED", "AI Hydra", "Beleuchtung", "SPS"],
    postedAt: "5d", views: 89, saved: false,
    shipping: false, pickup: true,
    equipmentType: "Beleuchtung", brand: "AI (Aqua Illumination)", wattage: 135, tankSizeMin: 100, tankSizeMax: 400,
  },
  {
    id: "cw19", title: "Nyos Quantum 120 Abschäumer", latin: "",
    price: 295, currency: "CHF",
    subtitle: "Für Becken bis 300L – top Zustand",
    description: "Nyos Quantum 120 Proteinabschäumer, 14 Monate benutzt, regelmässig gewartet. Inkl. Originalkarton.",
    location: "Winterthur", image: IMG.skimmer, images: [IMG.skimmer],
    category: "Equipment", subcategory: "Abschäumer", condition: "Gebraucht", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["Abschäumer", "Nyos", "Quantum", "Sump"],
    postedAt: "4d", views: 112, saved: false,
    shipping: true, shippingCost: 18, pickup: true,
    equipmentType: "Abschäumer", brand: "Nyos", tankSizeMax: 300,
  },
  {
    id: "cw20", title: "Ecotech VorTech MP10 QD", latin: "",
    price: 168, currency: "CHF",
    subtitle: "Quiet Drive – kabelloser Antrieb, neuwertig",
    description: "Ecotech Marine VorTech MP10 Quiet Drive. Stufenlos regelbar, ReefLink-kompatibel. 6 Monate alt.",
    location: "Winterthur", image: IMG.aquarium, images: [IMG.aquarium],
    category: "Equipment", subcategory: "Strömung", condition: "Gebraucht", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["Strömungspumpe", "Ecotech", "VorTech", "MP10"],
    postedAt: "5d", views: 143, saved: false,
    shipping: true, shippingCost: 12, pickup: true,
    equipmentType: "Strömung", brand: "Ecotech Marine", wattage: 18, tankSizeMin: 75, tankSizeMax: 280,
  },

  // ─── Frags & Starter-Sets ──────────────────────────────────────────────────
  {
    id: "ra7", title: "Riff-Starter Frags Set", latin: "Mix Euphyllia / Zoanthus / SPS",
    price: 145, currency: "CHF",
    subtitle: "6 Frags – kuratiertes Einsteiger-Paket",
    description: "6 Frags: 2x Zoanthus, 2x LPS, 1x SPS, 1x Softkoral. Alle auf Keramikhaltern mit Pflegeinfos. Versand in Thermobox.",
    location: "Zürich", image: IMG.fragPack, images: [IMG.fragPack, IMG.fragsRack, IMG.reefMix],
    category: "Frags", subcategory: "Mischpakete", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[5], tags: ["Starter", "Set", "Mix", "Frags", "Einsteiger"],
    postedAt: "2d", views: 389, saved: false, badge: "Neu",
    shipping: true, shippingCost: 35, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },
  {
    id: "ra10", title: "Acropora Frag – Neon Green", latin: "Acropora tenuis",
    price: 95, currency: "CHF",
    subtitle: "Neon-grüne SPS – schnelles Wachstum",
    description: "Acropora tenuis neongrün, ca. 5–6 cm auf Keramikhalter. PAR 200–400, Alk 8–9 dKH.",
    location: "Zürich", image: IMG.acropora, images: [IMG.acropora, IMG.acropora2],
    category: "Frags", subcategory: "SPS Frags", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[5], tags: ["SPS", "Acropora", "Neon Green", "Frag"],
    postedAt: "5d", views: 193, saved: false,
    shipping: true, shippingCost: 28, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },
  {
    id: "cw8", title: "Zoanthus \"Dragon Eye\"", latin: "Zoanthus sp.",
    price: 38, currency: "CHF",
    subtitle: "5 Polypen – Goldgelb mit grünem Zentrum",
    description: "Zoanthus 'Dragon Eye' – goldoranger Rand, knallgrünes Zentrum. 5 Polypen auf Fragstein. Schweizer Nachzucht.",
    location: "Winterthur", image: IMG.zoanthus2, images: [IMG.zoanthus2, IMG.fragsRack],
    category: "Frags", subcategory: "Zoanthus Frags", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["Zoanthus", "Dragon Eye", "Frag", "Einsteiger"],
    postedAt: "5h", views: 321, saved: false,
    shipping: true, shippingCost: 22, pickup: true, citesRequired: false,
  },
  {
    id: "cw11", title: "Frag-Starter-Set 8× WYSIWYG", latin: "Mix SPS / LPS / Zoanthus",
    price: 158, currency: "CHF",
    subtitle: "8 handverlesene Frags – Neueinsteiger",
    description: "8 Frags: 3× Zoanthus, 2× LPS, 2× Soft Coral, 1× SPS. Alle etikettiert. Versand in Styroporbox.",
    location: "Winterthur", image: IMG.fragsRack, images: [IMG.fragsRack, IMG.fragPack, IMG.reefMix],
    category: "Frags", subcategory: "Mischpakete", condition: "Nachzucht", listingType: "B2C", offerType: "sell",
    seller: sellers[6], tags: ["Starter", "Set", "Mix", "WYSIWYG", "Einsteiger"],
    postedAt: "2d", views: 412, saved: false, badge: "Bestseller",
    shipping: true, shippingCost: 35, pickup: true,
    citesRequired: true, citesAppendix: "II", citesSource: "C",
  },

  // ─── Tauschen / Verschenken ────────────────────────────────────────────────
  {
    id: "tr1", title: "Xenia Ableger – gratis abzugeben", latin: "Xenia sp.",
    price: 0, currency: "CHF",
    subtitle: "Pumpende Xenia – vermehrt sich schnell",
    description: "Zu viele Xenia-Ableger. Gebe 5–8 Ableger auf Steinchen gratis ab. Nur Abholung in Bern. Eigenen Transportbehälter mitbringen.",
    location: "Bern", image: IMG.softCoral, images: [IMG.softCoral],
    category: "Korallen", subcategory: "Weichkorallen", condition: "Nachzucht", listingType: "C2C", offerType: "gift",
    seller: sellers[3], tags: ["Xenia", "Weichkoralle", "Gratis", "Ableger", "Einsteiger"],
    postedAt: "1d", views: 234, saved: false, badge: "Gratis",
    shipping: false, pickup: true, citesRequired: false,
  },
  {
    id: "tr2", title: "Zoanthus Frag – Tausche gegen Euphyllia", latin: "Zoanthus sp.",
    price: 0, currency: "CHF",
    subtitle: "10+ Polypen – suche Euphyllia im Tausch",
    description: "Zoanthus-Frag (10+ Polypen, orange/grün) – suche im Tausch Euphyllia-Ableger (Torch/Hammer/Frogspawn). Wert ca. CHF 40–60. Raum Zentralschweiz.",
    location: "Luzern", image: IMG.zoanthus, images: [IMG.zoanthus],
    category: "Frags", subcategory: "Zoanthus Frags", condition: "Nachzucht", listingType: "C2C", offerType: "trade",
    seller: sellers[1], tags: ["Zoanthus", "Tausch", "Euphyllia", "Frag"],
    postedAt: "8h", views: 156, saved: false, badge: "Tausch",
    shipping: false, pickup: true, citesRequired: false,
  },
  {
    id: "tr3", title: "Sinularia Ableger verschenken", latin: "Sinularia sp.",
    price: 0, currency: "CHF",
    subtitle: "Weichkoralle – wächst schnell, brauche Platz",
    description: "Verschenke mehrere Sinularia-Ableger (grün). Wächst extrem schnell. Perfekt für Anfänger. Nur Abholung in Zürich.",
    location: "Zürich", image: IMG.xenia, images: [IMG.xenia],
    category: "Korallen", subcategory: "Weichkorallen", condition: "Nachzucht", listingType: "C2C", offerType: "gift",
    seller: sellers[5], tags: ["Sinularia", "Weichkoralle", "Gratis", "Ableger"],
    postedAt: "12h", views: 189, saved: false, badge: "Gratis",
    shipping: false, pickup: true, citesRequired: false,
  },
  {
    id: "tr4", title: "Eheim Jäger 150W – tausche gegen Tunze", latin: "",
    price: 0, currency: "CHF",
    subtitle: "Heizstab – suche Tunze Strömungspumpe",
    description: "Tausche Eheim Jäger Heizstab (150W, 2 Jahre alt, funktioniert) gegen Tunze Turbelle nanostream 6020 oder ähnlich. Raum Zug.",
    location: "Zug", image: IMG.aquarium, images: [IMG.aquarium],
    category: "Equipment", subcategory: "Heizung", condition: "Gebraucht", listingType: "C2C", offerType: "trade",
    seller: sellers[1], tags: ["Heizstab", "Eheim", "Tausch", "Strömungspumpe"],
    postedAt: "2d", views: 67, saved: false, badge: "Tausch",
    shipping: false, pickup: true,
    equipmentType: "Heizung", brand: "Eheim", wattage: 150,
  },
];

export const categories: { label: Category | "Alle"; icon: string; count: number }[] = [
  { label: "Alle",       icon: "◈", count: listings.length },
  { label: "Korallen",   icon: "🪸", count: listings.filter((l) => l.category === "Korallen").length },
  { label: "Fische",     icon: "🐠", count: listings.filter((l) => l.category === "Fische").length },
  { label: "Wirbellose", icon: "🦞", count: listings.filter((l) => l.category === "Wirbellose").length },
  { label: "Anemonen",   icon: "🌺", count: listings.filter((l) => l.category === "Anemonen").length },
  { label: "Equipment",  icon: "💡", count: listings.filter((l) => l.category === "Equipment").length },
  { label: "Frags",      icon: "🪨", count: listings.filter((l) => l.category === "Frags").length },
];
