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

  const filtered = useMemo(() => {
    return listings.filter((l) =>
      activeCategory === "Alle" ? true : l.category === activeCategory
    );
  }, [activeCategory]);

  const rest = filtered.slice(1);

  return (
    <div className="relative px-5 pt-6 pb-32">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.36em] text-white/32">
            Reef Market
          </p>
          <h1 className="max-w-[220px] text-[34px] font-semibold leading-[0.93] tracking-[-0.055em] text-white/96">
            Dive into rarity
          </h1>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/16">
            <img
              src="https://i.pravatar.cc/150?img=47"
              alt="Profil"
              className="h-full w-full object-cover"
            />
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
              {active && (
                <span className="absolute inset-x-0 -bottom-[13px] h-px bg-white/80" />
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "Discover" && (
        <>
          {/* Hero listing */}
          <HeroCard listing={hero} />

          {/* Stats bar */}
          <div className="mb-7 grid grid-cols-3 divide-x divide-white/6 border border-white/6 py-4">
            <div className="px-4 text-center">
              <div className="text-[20px] font-semibold tracking-[-0.04em]">284</div>
              <div className="mt-0.5 text-[11px] text-white/36">Inserate</div>
            </div>
            <div className="px-4 text-center">
              <div className="text-[20px] font-semibold tracking-[-0.04em]">63</div>
              <div className="mt-0.5 text-[11px] text-white/36">Verkäufer</div>
            </div>
            <div className="px-4 text-center">
              <div className="text-[20px] font-semibold tracking-[-0.04em]">8</div>
              <div className="mt-0.5 text-[11px] text-white/36">Kantone</div>
            </div>
          </div>

          {/* Category filter */}
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

          {/* Featured listings */}
          <section>
            <div className="mb-4 flex items-end justify-between border-t border-white/6 pt-5">
              <h3 className="text-[20px] font-semibold tracking-[-0.04em] text-white/94">
                {activeCategory === "Alle" ? "Featured now" : activeCategory}
              </h3>
              <span className="text-[13px] text-white/36">{filtered.length} Inserate</span>
            </div>
            <div className="space-y-5 stagger">
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
            <br />
            Bald verfügbar.
          </p>
        </div>
      )}

      {activeTab === "Collectors" && (
        <div className="space-y-5 stagger">
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
