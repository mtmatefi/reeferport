// Run: npx tsx src/lib/db/seed.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, listings, reviews } from "./schema";
import { hash } from "bcryptjs";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Images (Pexels)
const IMG = {
  torchCoral:    "https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg?auto=compress&cs=tinysrgb&w=1200",
  torchCoral2:   "https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg?auto=compress&cs=tinysrgb&w=1200",
  zoanthus:      "https://images.pexels.com/photos/3854816/pexels-photo-3854816.jpeg?auto=compress&cs=tinysrgb&w=1200",
  acropora:      "https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=1200",
  acropora2:     "https://images.pexels.com/photos/3873954/pexels-photo-3873954.jpeg?auto=compress&cs=tinysrgb&w=1200",
  hammerCoral:   "https://images.pexels.com/photos/1583882/pexels-photo-1583882.jpeg?auto=compress&cs=tinysrgb&w=1200",
  bubbleCoral:   "https://images.pexels.com/photos/3682293/pexels-photo-3682293.jpeg?auto=compress&cs=tinysrgb&w=1200",
  goniopora:     "https://images.pexels.com/photos/3854815/pexels-photo-3854815.jpeg?auto=compress&cs=tinysrgb&w=1200",
  lpsColony:     "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=1200",
  clownfish:     "https://images.pexels.com/photos/2168831/pexels-photo-2168831.jpeg?auto=compress&cs=tinysrgb&w=1200",
  mandarinFish:  "https://images.pexels.com/photos/3119720/pexels-photo-3119720.jpeg?auto=compress&cs=tinysrgb&w=1200",
  blueTang:      "https://images.pexels.com/photos/3119695/pexels-photo-3119695.jpeg?auto=compress&cs=tinysrgb&w=1200",
  wrasse:        "https://images.pexels.com/photos/3119704/pexels-photo-3119704.jpeg?auto=compress&cs=tinysrgb&w=1200",
  giantClam:     "https://images.pexels.com/photos/3854820/pexels-photo-3854820.jpeg?auto=compress&cs=tinysrgb&w=1200",
  cleanerShrimp: "https://images.pexels.com/photos/1591458/pexels-photo-1591458.jpeg?auto=compress&cs=tinysrgb&w=1200",
  bta:           "https://images.pexels.com/photos/2765871/pexels-photo-2765871.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ledLight:      "https://images.pexels.com/photos/4389982/pexels-photo-4389982.jpeg?auto=compress&cs=tinysrgb&w=1200",
  fragPack:      "https://images.pexels.com/photos/3873907/pexels-photo-3873907.jpeg?auto=compress&cs=tinysrgb&w=1200",
  candyCane:     "https://images.pexels.com/photos/3873955/pexels-photo-3873955.jpeg?auto=compress&cs=tinysrgb&w=1200",
  softCoral:     "https://images.pexels.com/photos/3119711/pexels-photo-3119711.jpeg?auto=compress&cs=tinysrgb&w=1200",
  reefMix:       "https://images.pexels.com/photos/3873909/pexels-photo-3873909.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

async function main() {
  console.log("🌊 Seeding Gesellschaftsbecken database...\n");

  // ─── Users ────────────────────────────────────────────────────────────────
  console.log("👤 Creating users...");
  const pw = await hash("demo123", 10);

  const [coralhaus, marc, reeflab, nina, oceanbreeder, reefalliance, demoUser] = await db
    .insert(users)
    .values([
      { id: "s1", email: "coralhaus@gesellschaftsbecken.ch", passwordHash: pw, name: "CoralHaus Luzern", avatar: "https://i.pravatar.cc/150?img=3", type: "Händler", location: "Luzern", bio: "Professioneller Meerwasser-Händler mit Fokus auf LPS-Korallen, Anemonen und seltene Fische. CITES-konformer Handel.", verified: true, memberSince: "2019", salesCount: 1240, rating: "4.9", reviewCount: 214 },
      { id: "s2", email: "marc@gesellschaftsbecken.ch", passwordHash: pw, name: "Marc S.", avatar: "https://i.pravatar.cc/150?img=12", type: "Privat", location: "Zug", bio: "Reef-Enthusiast seit 6 Jahren. Verkaufe Ableger aus meinem 800L Mixed-Reef.", verified: false, memberSince: "2022", salesCount: 47, rating: "4.7", reviewCount: 38 },
      { id: "s3", email: "reeflab@gesellschaftsbecken.ch", passwordHash: pw, name: "ReefLab Zürich", avatar: "https://i.pravatar.cc/150?img=7", type: "Händler", location: "Stans", bio: "Spezialisiert auf SPS und Züchtung seltener Korallen.", verified: true, memberSince: "2020", salesCount: 532, rating: "5.0", reviewCount: 89 },
      { id: "s4", email: "nina@gesellschaftsbecken.ch", passwordHash: pw, name: "Nina B.", avatar: "https://i.pravatar.cc/150?img=25", type: "Privat", location: "Bern", bio: "SPS-Liebhaberin, verkaufe Überschuss aus meinem Frag-System.", verified: false, memberSince: "2023", salesCount: 31, rating: "4.8", reviewCount: 22 },
      { id: "s5", email: "ocean@gesellschaftsbecken.ch", passwordHash: pw, name: "OceanBreeder GmbH", avatar: "https://i.pravatar.cc/150?img=15", type: "Händler", location: "Basel", bio: "Schweizer Meerwasser-Züchter mit über 20 aktiven Nachzuchtsystemen.", verified: true, memberSince: "2018", salesCount: 2100, rating: "4.6", reviewCount: 177 },
      { id: "s6", email: "shop@reefalliance.ch", passwordHash: pw, name: "ReefAlliance Shop", avatar: "https://i.pravatar.cc/150?img=33", type: "Händler", location: "Zürich", bio: "ReefAlliance ist die führende Schweizer Plattform für Meerwasseraquaristik. CITES-konform, mit Gesundheitsgarantie.", verified: true, memberSince: "2017", salesCount: 3200, rating: "4.9", reviewCount: 312 },
      { id: "demo", email: "demo@gesellschaftsbecken.ch", passwordHash: pw, name: "Demo User", avatar: "https://i.pravatar.cc/150?img=47", type: "Privat", location: "Zürich", verified: false, memberSince: "2025", salesCount: 0, rating: "5.0", reviewCount: 0 },
    ])
    .returning();

  console.log("  ✓ 7 users created\n");

  // ─── Listings ─────────────────────────────────────────────────────────────
  console.log("🪸 Creating listings...");
  await db.insert(listings).values([
    // CoralHaus listings
    { id: "l1", title: "Dragon Soul Torch", latin: "Euphyllia glabrescens", price: 180, currency: "CHF", subtitle: "Hand selected frag – premium Orange/Gold coloration", description: "Absoluter Hingucker – diese Dragon Soul Torch zeigt ein sattes Orange-Gold mit leuchtenden Tips. Aus einem 3-jährig etablierten System. Polypengrösse 5+ cm, 3 Köpfe. Vollständig akklimatisiert.", location: "Luzern", image: IMG.torchCoral, images: [IMG.torchCoral, IMG.torchCoral2, IMG.lpsColony], category: "Korallen", condition: "Nachzucht", listingType: "B2C", sellerId: "s1", tags: ["LPS","Euphyllia","Premium","WYSIWYG"], badge: "Curated Drop", shipping: true, shippingCost: 28, pickup: true, views: 342 },
    { id: "l6", title: "Maxima Clam Electric Blue", latin: "Tridacna maxima", price: 290, currency: "CHF", subtitle: "10 cm Schalenbreite – leuchtend blauer Mantel", description: "Traumhafte Electric Blue Maxima-Muschel. Schalenbreite 10 cm, Mantel leuchtend blau. Aus 4-jährigem System. Benötigt starkes Licht (400+ PAR).", location: "Luzern", image: IMG.giantClam, images: [IMG.giantClam], category: "Wirbellose", condition: "Wildfang", listingType: "B2C", sellerId: "s1", tags: ["Muschel","Tridacna","Electric Blue","Showpiece"], shipping: false, pickup: true, views: 198 },
    // Marc listings
    { id: "l2", title: "Oman Clown Pair", latin: "Amphiprion omanensis", price: 220, currency: "CHF", subtitle: "Seltenes Paar – fressen Pellets & Frozen", description: "Extrem seltenes Paar Oman-Clownfische. Nachzucht aus CH-Bestand, CITES-konform. Nur Selbstabholung.", location: "Zug", image: IMG.clownfish, images: [IMG.clownfish], category: "Fische", condition: "Nachzucht", listingType: "C2C", sellerId: "s2", tags: ["Clownfisch","Paar","Selten","Nachzucht CH"], shipping: false, pickup: true, views: 189 },
    { id: "l7", title: "AI Hydra 64 HD LED", latin: "", price: 480, currency: "CHF", subtitle: "18 Monate alt – alle Kanäle perfekt", description: "AI Hydra 64 HD LED-Leuchte inkl. originalem Flexarm. Ca. 18 Monate alt, nur auf SPS-Tank betrieben. Alle Kanäle funktionieren.", location: "Zug", image: IMG.ledLight, images: [IMG.ledLight], category: "Equipment", condition: "Gebraucht", listingType: "C2C", sellerId: "s2", tags: ["LED","AI Hydra","Beleuchtung","SPS"], shipping: false, pickup: true, views: 89 },
    // ReefLab listings
    { id: "l3", title: "Ultra Zoanthus Garden", latin: "Zoanthus sp.", price: 95, currency: "CHF", subtitle: "150+ Polypen, WYSIWYG – Rot/Gelb/Pink-Rim", description: "Dichtes Zoanthus-Riff mit mind. 150+ Polypen auf 12×8 cm Stein. Sehr pflegeleicht, ideal für Einsteiger.", location: "Stans", image: IMG.zoanthus, images: [IMG.zoanthus, IMG.reefMix], category: "Korallen", condition: "Nachzucht", listingType: "B2C", sellerId: "s3", tags: ["Zoanthus","Ultra","WYSIWYG","Kolonie"], badge: "Hot Deal", shipping: true, shippingCost: 22, pickup: true, views: 512 },
    { id: "l8", title: "Blasenpilz Grün/Pink", latin: "Plerogyra sinuosa", price: 65, currency: "CHF", subtitle: "Pflegeleicht – grüne Blasen, pink Gewebe", description: "Plerogyra sinuosa, grüne Blasen mit pink-violettem Gewebe. Frag ca. 6 cm mit 2 Köpfen.", location: "Stans", image: IMG.bubbleCoral, images: [IMG.bubbleCoral, IMG.softCoral], category: "Korallen", condition: "Nachzucht", listingType: "B2C", sellerId: "s3", tags: ["LPS","Blasenpilz","Einsteiger"], shipping: true, shippingCost: 22, pickup: true, views: 156 },
    // Nina listings
    { id: "l4", title: "Acropora Tricolor", latin: "Acropora millepora", price: 145, currency: "CHF", subtitle: "Tri-color SPS – Grün/Blau/Pink Tips", description: "Spektakuläre Tricolor Acropora millepora. Frag ca. 5 cm, angebohrt auf Keramikhalter. Benötigt starke Strömung (>250 PAR).", location: "Bern", image: IMG.acropora, images: [IMG.acropora, IMG.acropora2], category: "Korallen", condition: "Nachzucht", listingType: "C2C", sellerId: "s4", tags: ["SPS","Acropora","Tricolor","Frag"], shipping: true, shippingCost: 28, pickup: false, views: 278 },
    // OceanBreeder listings
    { id: "l5", title: "Mandarin Dragonet Paar", latin: "Synchiropus splendidus", price: 130, currency: "CHF", subtitle: "Frisst Frozen – extrem selten trainiert", description: "Mandarinfisch-Paar (m+w), fressen Frozen Copepods und Artemia. Aus 1500L System.", location: "Basel", image: IMG.mandarinFish, images: [IMG.mandarinFish], category: "Fische", condition: "Wildfang", listingType: "B2C", sellerId: "s5", tags: ["Mandarinfisch","Paar","Frisst Frozen"], badge: "Selten", shipping: false, pickup: true, views: 421 },
    // ReefAlliance listings
    { id: "ra1", title: "Royal Blue Tang", latin: "Paracanthurus hepatus", price: 155, currency: "CHF", subtitle: "Akklimatisiert, frisst Pellets – 7 cm", description: "Gesunder Royal Blue Tang, ca. 7 cm. Vollständig akklimatisiert, frisst trockenes und gefrorenes Futter. Quarantänisiert für 21 Tage.", location: "Zürich", image: IMG.blueTang, images: [IMG.blueTang], category: "Fische", condition: "Wildfang", listingType: "B2C", sellerId: "s6", tags: ["Doktorfisch","Blue Tang","Frisst Pellets","Quarantänisiert"], badge: "Top Qualität", shipping: true, shippingCost: 35, pickup: true, views: 284 },
    { id: "ra2", title: "Hammer Coral – Gold/Green", latin: "Euphyllia ancora", price: 75, currency: "CHF", subtitle: "Frag 3 Köpfe – Gold-grüne Spitzen", description: "Wunderschöne Euphyllia ancora mit goldgrünen Hammerspitzen. 3 Köpfe auf Keramikhalter, ca. 8 cm. Sehr robust, für Einsteiger geeignet.", location: "Zürich", image: IMG.hammerCoral, images: [IMG.hammerCoral, IMG.lpsColony], category: "Korallen", condition: "Nachzucht", listingType: "B2C", sellerId: "s6", tags: ["LPS","Euphyllia","Hammer","Nachzucht"], shipping: true, shippingCost: 28, pickup: true, views: 198 },
    { id: "ra3", title: "Sixline Wrasse", latin: "Pseudocheilinus hexataenia", price: 78, currency: "CHF", subtitle: "Natürliche Schädlingsbekämpfung", description: "Pseudocheilinus hexataenia – einer der schönsten Lippfische. Frisst Milben und Parasiten. Akklimatisiert.", location: "Zürich", image: IMG.wrasse, images: [IMG.wrasse], category: "Fische", condition: "Wildfang", listingType: "B2C", sellerId: "s6", tags: ["Lippfisch","Wrasse","Schädlingsbekämpfung"], shipping: true, shippingCost: 35, pickup: true, views: 134 },
    { id: "ra4", title: "Pacific Cleaner Shrimp Duo", latin: "Lysmata amboinensis", price: 52, currency: "CHF", subtitle: "2er-Set – Putzerstation für dein Becken", description: "Zwei Lysmata amboinensis – bilden eine natürliche Putzstation. Sehr robust, für alle Riff-Beckengrössen.", location: "Zürich", image: IMG.cleanerShrimp, images: [IMG.cleanerShrimp], category: "Wirbellose", condition: "Wildfang", listingType: "B2C", sellerId: "s6", tags: ["Garnele","Cleaner","Putzstation"], shipping: true, shippingCost: 28, pickup: true, views: 165 },
    { id: "ra5", title: "Duncan Coral Kolonie", latin: "Duncanopsammia axifuga", price: 120, currency: "CHF", subtitle: "8 Köpfe – einfach zu halten", description: "Duncanopsammia axifuga mit 8 ausgewachsenen Köpfen. Grüne Tentakel, pflegeleicht.", location: "Zürich", image: IMG.lpsColony, images: [IMG.lpsColony, IMG.reefMix], category: "Korallen", condition: "Nachzucht", listingType: "B2C", sellerId: "s6", tags: ["LPS","Duncan","Einsteiger","Kolonie"], badge: "Bestseller", shipping: true, shippingCost: 28, pickup: true, views: 221 },
    { id: "ra6", title: "Goniopora – Blumenpilz Pink", latin: "Goniopora sp.", price: 89, currency: "CHF", subtitle: "Frag 2 Köpfe – seltene pinke Variante", description: "Goniopora sp. in seltener pinker Färbung. Lange, wiegende Tentakel. Moderate Beleuchtung.", location: "Zürich", image: IMG.goniopora, images: [IMG.goniopora], category: "Korallen", condition: "Nachzucht", listingType: "B2C", sellerId: "s6", tags: ["LPS","Goniopora","Pink"], shipping: true, shippingCost: 28, pickup: true, views: 178 },
    { id: "ra7", title: "Riff-Starter Frags Set", latin: "Mix Euphyllia / Zoanthus / SPS", price: 145, currency: "CHF", subtitle: "6 Frags – kuratiertes Einsteiger-Paket", description: "Das perfekte Starter-Paket: 2x Zoanthus, 2x LPS, 1x SPS, 1x Softkoral. Alle auf Keramikhaltern, mit Pflegeinfos.", location: "Zürich", image: IMG.fragPack, images: [IMG.fragPack, IMG.reefMix], category: "Frags", condition: "Nachzucht", listingType: "B2C", sellerId: "s6", tags: ["Starter","Set","Mix","Frags"], badge: "Neu", shipping: true, shippingCost: 35, pickup: true, views: 389 },
    { id: "ra8", title: "Candy Cane Coral", latin: "Caulastrea furcata", price: 58, currency: "CHF", subtitle: "Frag 4 Köpfe – grün/weiss, sehr robust", description: "Caulastrea furcata in grün-weiss. 4 Köpfe auf Keramikhalter. Extrem robust und pflegeleicht.", location: "Zürich", image: IMG.candyCane, images: [IMG.candyCane], category: "Korallen", condition: "Nachzucht", listingType: "B2C", sellerId: "s6", tags: ["LPS","Caulastrea","Einsteiger"], shipping: true, shippingCost: 22, pickup: true, views: 142 },
    { id: "ra9", title: "Rose Bubble Tip Anemone", latin: "Entacmaea quadricolor", price: 68, currency: "CHF", subtitle: "Roséfarben – idealer Clownfisch-Host", description: "Entacmaea quadricolor in rosé. Perfekter Wirt für Clownfische. Ca. 10 cm geöffnet.", location: "Zürich", image: IMG.bta, images: [IMG.bta], category: "Wirbellose", condition: "Nachzucht", listingType: "B2C", sellerId: "s6", tags: ["Anemone","BTA","Clownfisch"], badge: "Beliebt", shipping: false, pickup: true, views: 256 },
    { id: "ra10", title: "Acropora Frag – Neon Green", latin: "Acropora tenuis", price: 95, currency: "CHF", subtitle: "Neon-grüne SPS – schnelles Wachstum", description: "Acropora tenuis in neongrüner Färbung. Schnellwachsend, 5–6 cm. Für erfahrene SPS-Keeper.", location: "Zürich", image: IMG.acropora2, images: [IMG.acropora2, IMG.acropora], category: "Frags", condition: "Nachzucht", listingType: "B2C", sellerId: "s6", tags: ["SPS","Acropora","Neon Green"], shipping: true, shippingCost: 28, pickup: true, views: 193 },
  ]);
  console.log("  ✓ 18 listings created\n");

  // ─── Reviews ──────────────────────────────────────────────────────────────
  console.log("⭐ Creating reviews...");
  await db.insert(reviews).values([
    { sellerId: "s1", reviewerId: "s2", rating: 5, text: "Super Transaktion! Koralle war genau wie beschrieben. Sehr professionell.", listingId: "l1" },
    { sellerId: "s1", reviewerId: "s4", rating: 5, text: "Professionelle Verpackung, schnelle Antwort. Top Händler!", listingId: "l1" },
    { sellerId: "s6", reviewerId: "s2", rating: 5, text: "Absolut top! Fisch kam gesund an, Kommunikation einwandfrei.", listingId: "ra1" },
    { sellerId: "s6", reviewerId: "s4", rating: 4, text: "Sehr gute Qualität, kleine Verzögerung bei der Antwort.", listingId: "ra5" },
  ]);
  console.log("  ✓ Reviews created\n");

  console.log("✅ Seed complete!\n");
  console.log("Demo accounts (all use password: demo123):");
  console.log("  shop@reefalliance.ch  → ReefAlliance Shop");
  console.log("  coralhaus@gesellschaftsbecken.ch → CoralHaus Luzern");
  console.log("  marc@gesellschaftsbecken.ch      → Marc S.");
  console.log("  demo@gesellschaftsbecken.ch      → Demo User (start fresh)");
}

main().catch(console.error);
