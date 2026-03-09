"use client";
import { useMemo, useState } from "react";
import HeroCard from "@/components/HeroCard";
import ListingCard from "@/components/ListingCard";
import CategoryFilter from "@/components/CategoryFilter";
import { listings, type Category } from "@/lib/data";

const tabs = ["Discover", "Drops", "Collectors"] as const;
type Tab = (typeof tabs)[number];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Discover");
  const [activeCategory, setActiveCategory] = useState<Category | "Alle">("Alle");

  const hero = useMemo(() => listings[0], []);

  const filtered = useMemo(() =>
    listings.filter((l) => activeCategory === "Alle" || l.category === activeCategory),
    [activeCategory]
  );

  const rest = filtered.slice(1);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-32 md:pb-10">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between">
        <div>
          {/* Hide "Reef Market" label on md+ since sidebar has branding */}
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.36em] text-white/32 md:hidden">
            Reef Market
          </p>
          <h1 className="text-[30px] sm:text-[36px] font-semibold leading-[0.93] tracking-[-0.055em] text-white/96">
            Dive into rarity
          </h1>
          <p className="mt-2 text-[14px] text-white/42 hidden md:block">
            Meerwasser-Marktplatz Schweiz · B2C &amp; C2C
          </p>
        </div>
        <div className="flex items-center gap-3 pt-1">
          {/* Profile avatar – mobile only (sidebar has it on desktop) */}
          <div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/16 md:hidden">
            <img src="https://i.pravatar.cc/150?img=47" alt="Profil" className="h-full w-full object-cover" />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-7 flex gap-5 overflow-x-auto border-b border-white/8 pb-3 no-scrollbar">
        {tabs.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "relative shrink-0 pb-1 text-[15px] font-medium tracking-[-0.02em] transition-all duration-200",
                active ? "text-white" : "text-white/34 hover:text-white/72",
              ].join(" ")}
            >
              {tab}
              {active && <span className="absolute inset-x-0 -bottom-[13px] h-px bg-white/80" />}
            </button>
          );
        })}
      </div>

      {activeTab === "Discover" && (
        <>
          {/* Hero + Stats – side by side on lg */}
          <div className="mb-8 lg:grid lg:grid-cols-[1fr_280px] lg:gap-6 xl:grid-cols-[1fr_320px]">
            <HeroCard listing={hero} />

            {/* Stats & quick info – shown beside hero on lg */}
            <div className="mt-6 lg:mt-0 space-y-4">
              <div className="grid grid-cols-3 lg:grid-cols-1 divide-x lg:divide-x-0 lg:divide-y divide-white/6 border border-white/6">
                <div className="px-4 py-4 text-center lg:text-left">
                  <div className="text-[24px] font-semibold tracking-[-0.04em]">284</div>
                  <div className="mt-0.5 text-[12px] text-white/36">Aktive Inserate</div>
                </div>
                <div className="px-4 py-4 text-center lg:text-left">
                  <div className="text-[24px] font-semibold tracking-[-0.04em]">63</div>
                  <div className="mt-0.5 text-[12px] text-white/36">Verkäufer</div>
                </div>
                <div className="px-4 py-4 text-center lg:text-left">
                  <div className="text-[24px] font-semibold tracking-[-0.04em]">8</div>
                  <div className="mt-0.5 text-[12px] text-white/36">Kantone</div>
                </div>
              </div>

              {/* Trending tags */}
              <div className="hidden lg:block border border-white/6 p-5">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
                  Trending Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {["LPS", "SPS", "WYSIWYG", "Nachzucht", "Euphyllia", "Zoanthus", "Clownfisch"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-[12px] text-white/50 hover:border-white/24 hover:text-white/72 cursor-pointer transition"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA – desktop */}
              <div className="hidden lg:block border border-white/6 p-5">
                <p className="mb-1 text-[15px] font-semibold tracking-[-0.03em]">Inserat erstellen</p>
                <p className="mb-4 text-[13px] text-white/44">Verkaufe Korallen, Fische oder Equipment.</p>
                <a
                  href="/sell"
                  className="block bg-white py-3 text-center text-[13px] font-semibold text-black transition hover:bg-white/90"
                >
                  Jetzt inserieren
                </a>
              </div>
            </div>
          </div>

          {/* Category filter */}
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

          {/* Listings section */}
          <section>
            <div className="mb-5 flex items-end justify-between border-t border-white/6 pt-5">
              <h3 className="text-[20px] font-semibold tracking-[-0.04em] text-white/94">
                {activeCategory === "Alle" ? "Featured now" : activeCategory}
              </h3>
              <span className="text-[13px] text-white/36">{filtered.length} Inserate</span>
            </div>

            {/* Grid: 1 col mobile / 2 col md / 3 col xl */}
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-x-8 xl:grid-cols-3 stagger">
              {rest.map((item, i) => (
                <ListingCard key={item.id} listing={item} index={i + 2} />
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "Drops" && (
        <div className="py-16 text-center">
          <div className="mb-4 text-5xl">🪸</div>
          <h2 className="mb-2 text-[22px] font-semibold tracking-[-0.04em]">Upcoming Drops</h2>
          <p className="text-[14px] text-white/44">
            Exklusive Editionen direkt von Premium-Züchtern.
            <br />Bald verfügbar.
          </p>
        </div>
      )}

      {activeTab === "Collectors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-x-8 stagger">
          {listings
            .filter((l) => l.price > 150)
            .map((item, i) => (
              <ListingCard key={item.id} listing={item} index={i + 1} />
            ))}
        </div>
      )}
    </div>
  );
}
