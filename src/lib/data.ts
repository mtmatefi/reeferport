export type Category = "Korallen" | "Fische" | "Wirbellose" | "Equipment" | "Frags";
export type Condition = "Nachzucht" | "Wildfang" | "Gebraucht" | "Neu";
export type ListingType = "B2C" | "C2C";

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
  condition: Condition;
  listingType: ListingType;
  seller: Seller;
  tags: string[];
  postedAt: string;
  views: number;
  saved: boolean;
  badge?: string;
  shipping: boolean;
  shippingCost?: number;
  pickup: boolean;
}

export const sellers: Seller[] = [
  {
    id: "s1",
    name: "CoralHaus Luzern",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4.9,
    reviewCount: 214,
    verified: true,
    type: "Händler",
    location: "Luzern",
    memberSince: "2019",
    salesCount: 1240,
  },
  {
    id: "s2",
    name: "Marc S.",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4.7,
    reviewCount: 38,
    verified: false,
    type: "Privat",
    location: "Zug",
    memberSince: "2022",
    salesCount: 47,
  },
  {
    id: "s3",
    name: "ReefLab Zürich",
    avatar: "https://i.pravatar.cc/150?img=7",
    rating: 5.0,
    reviewCount: 89,
    verified: true,
    type: "Händler",
    location: "Stans",
    memberSince: "2020",
    salesCount: 532,
  },
  {
    id: "s4",
    name: "Nina B.",
    avatar: "https://i.pravatar.cc/150?img=25",
    rating: 4.8,
    reviewCount: 22,
    verified: false,
    type: "Privat",
    location: "Bern",
    memberSince: "2023",
    salesCount: 31,
  },
  {
    id: "s5",
    name: "OceanBreeder GmbH",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 4.6,
    reviewCount: 177,
    verified: true,
    type: "Händler",
    location: "Basel",
    memberSince: "2018",
    salesCount: 2100,
  },
];

export const listings: Listing[] = [
  {
    id: "l1",
    title: "Dragon Soul Torch",
    latin: "Euphyllia glabrescens",
    price: 180,
    currency: "CHF",
    subtitle: "Hand selected frag, premium coloration",
    description:
      "Absoluter Hingucker – diese Dragon Soul Torch zeigt ein sattes Orange-Grün mit goldenen Tips. Aus einem 3-jährig etablierten System. Ideal für SPS/LPS Mischriff. Polypengrösse 5+ cm, 3 Köpfe. Vollständig akklimatisiert auf NSW-ähnliche Parameter.",
    location: "Luzern",
    image:
      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1513339771850-00014b4ca8f3?auto=format&fit=crop&w=1600&q=80",
    ],
    category: "Korallen",
    condition: "Nachzucht",
    listingType: "B2C",
    seller: sellers[0],
    tags: ["LPS", "Euphyllia", "Premium", "WYSIWYG"],
    postedAt: "2h",
    views: 342,
    saved: false,
    badge: "Curated Drop",
    shipping: true,
    shippingCost: 28,
    pickup: true,
  },
  {
    id: "l2",
    title: "Oman Clown Pair",
    latin: "Amphiprion omanensis",
    price: 220,
    currency: "CHF",
    subtitle: "Rare pair, stable and feeding well",
    description:
      "Extrem seltenes Paar Oman-Clownfische (Amphiprion omanensis). Das Weibchen ist bereits deutlich grösser. Beide fressen Pellets und gefrorenes Futter. Nachzucht aus CH-Bestand, CITES-konform. Nur Selbstabholung, kein Versand.",
    location: "Zug",
    image:
      "https://images.unsplash.com/photo-1520302518579-1c0f2f16c1c8?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1520302518579-1c0f2f16c1c8?auto=format&fit=crop&w=1600&q=80",
    ],
    category: "Fische",
    condition: "Nachzucht",
    listingType: "C2C",
    seller: sellers[1],
    tags: ["Clownfisch", "Paar", "Selten", "Nachzucht CH"],
    postedAt: "5h",
    views: 189,
    saved: true,
    shipping: false,
    pickup: true,
  },
  {
    id: "l3",
    title: "Ultra Zoanthus Garden",
    latin: "Zoanthus sp.",
    price: 95,
    currency: "CHF",
    subtitle: "Dense colony, WYSIWYG listing",
    description:
      "Dichtes Zoanthus-Riff mit mind. 150+ Polypen auf 12x8cm Stein. Farben: Rottöne, Gelb, Pink-Rim. Gesund, geschlossen getestet. Bereit für den sofortigen Umzug. Sehr pflegeleicht, ideal für Einsteiger und Fortgeschrittene.",
    location: "Stans",
    image:
      "https://images.unsplash.com/photo-1513339771850-00014b4ca8f3?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1513339771850-00014b4ca8f3?auto=format&fit=crop&w=1600&q=80",
    ],
    category: "Korallen",
    condition: "Nachzucht",
    listingType: "B2C",
    seller: sellers[2],
    tags: ["Zoanthus", "Ultra", "WYSIWYG", "Kolonie"],
    postedAt: "1d",
    views: 512,
    saved: false,
    badge: "Hot Deal",
    shipping: true,
    shippingCost: 22,
    pickup: true,
  },
  {
    id: "l4",
    title: "Acropora Tricolor",
    latin: "Acropora millepora",
    price: 145,
    currency: "CHF",
    subtitle: "Stunning tri-color SPS, fast grower",
    description:
      "Spektakuläre Tricolor Acropora millepora – Koralle zeigt drei Farbtöne (Grün, Blau, Pink) je nach Beleuchtung. Frag ist ca. 5cm, angebohrt auf Keramikhalter. Benötigt starke Strömung und Beleuchtung (>250 PAR).",
    location: "Bern",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=80",
    ],
    category: "Korallen",
    condition: "Nachzucht",
    listingType: "C2C",
    seller: sellers[3],
    tags: ["SPS", "Acropora", "Tricolor", "Frag"],
    postedAt: "2d",
    views: 278,
    saved: false,
    shipping: true,
    shippingCost: 28,
    pickup: false,
  },
  {
    id: "l5",
    title: "Mandarin Dragonet Paar",
    latin: "Synchiropus splendidus",
    price: 130,
    currency: "CHF",
    subtitle: "Frisst gefrorenes, ideal etabliert",
    description:
      "Mandarinfisch-Paar (m+w), fressen Frozen Copepods und Artemia. Dies ist extrem selten für diese Art. Aus 1500L System mit riesigem Copepodenpopulation gerettet. Aufzucht auf Tiefkühlware dauerte 4 Monate.",
    location: "Basel",
    image:
      "https://images.unsplash.com/photo-1597149160700-5f6a03e4e7e1?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1597149160700-5f6a03e4e7e1?auto=format&fit=crop&w=1600&q=80",
    ],
    category: "Fische",
    condition: "Wildfang",
    listingType: "B2C",
    seller: sellers[4],
    tags: ["Mandarinfisch", "Paar", "Frisst Frozen"],
    postedAt: "3d",
    views: 421,
    saved: true,
    badge: "Selten",
    shipping: false,
    pickup: true,
  },
  {
    id: "l6",
    title: "Maxima Clam Electric Blue",
    latin: "Tridacna maxima",
    price: 290,
    currency: "CHF",
    subtitle: "10cm specimen, vivid blue mantle",
    description:
      "Traumhafte Electric Blue Maxima-Muschel. Schalenbreite 10cm, Mantel leuchtend blau mit dezenten Mustern. Aus 4-jährigem System. SPS-Bedingungen, Ca/Alk/Mg gepflegt. Benötigt starkes Licht (400+ PAR).",
    location: "Luzern",
    image:
      "https://images.unsplash.com/photo-1467579424161-6bdd8b62d21d?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1467579424161-6bdd8b62d21d?auto=format&fit=crop&w=1600&q=80",
    ],
    category: "Wirbellose",
    condition: "Wildfang",
    listingType: "B2C",
    seller: sellers[0],
    tags: ["Muschel", "Tridacna", "Electric Blue", "Showpiece"],
    postedAt: "4d",
    views: 198,
    saved: false,
    shipping: false,
    pickup: true,
  },
  {
    id: "l7",
    title: "AI Hydra 64 HD LED",
    latin: "",
    price: 480,
    currency: "CHF",
    subtitle: "Gebraucht, top Zustand, inkl. Arm",
    description:
      "AI Hydra 64 HD LED-Leuchte inkl. originalem Flexarm. Ca. 18 Monate alt, nur auf SPS-Tank betrieben. Alle Kanäle funktionieren, sehr gute Lichtleistung. Kein Versand, Abholung in Zug oder Raum Zentralschweiz.",
    location: "Zug",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    ],
    category: "Equipment",
    condition: "Gebraucht",
    listingType: "C2C",
    seller: sellers[1],
    tags: ["LED", "AI Hydra", "Beleuchtung", "SPS"],
    postedAt: "5d",
    views: 89,
    saved: false,
    shipping: false,
    pickup: true,
  },
  {
    id: "l8",
    title: "Blasenpilz Grün/Pink",
    latin: "Plerogyra sinuosa",
    price: 65,
    currency: "CHF",
    subtitle: "Pflegeleicht, schöner Hingucker",
    description:
      "Plerogyra sinuosa, grüne Blasen mit pink-violettem Gewebe. Sehr pflegeleichte LPS-Koralle. Frag ca. 6cm mit 2 Köpfen. Ideal für niedrige bis mittlere Licht- und Strömungszonen.",
    location: "Stans",
    image:
      "https://images.unsplash.com/photo-1621419203310-d7a72f7dfa48?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1621419203310-d7a72f7dfa48?auto=format&fit=crop&w=1600&q=80",
    ],
    category: "Korallen",
    condition: "Nachzucht",
    listingType: "B2C",
    seller: sellers[2],
    tags: ["LPS", "Blasenpilz", "Einsteiger"],
    postedAt: "6d",
    views: 156,
    saved: false,
    shipping: true,
    shippingCost: 22,
    pickup: true,
  },
];

export const categories: { label: Category | "Alle"; icon: string; count: number }[] = [
  { label: "Alle", icon: "◈", count: listings.length },
  { label: "Korallen", icon: "🪸", count: listings.filter((l) => l.category === "Korallen").length },
  { label: "Fische", icon: "🐠", count: listings.filter((l) => l.category === "Fische").length },
  { label: "Wirbellose", icon: "🦞", count: listings.filter((l) => l.category === "Wirbellose").length },
  { label: "Equipment", icon: "💡", count: listings.filter((l) => l.category === "Equipment").length },
  { label: "Frags", icon: "🪨", count: 0 },
];
