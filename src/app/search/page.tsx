"use client";
import { useState, useMemo } from "react";
import { listings, type Category } from "@/lib/data";
import ListingCard from "@/components/ListingCard";

const sortOptions = ["Neueste", "Preis ↑", "Preis ↓", "Beliebteste"] as const;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Neueste");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCats, setSelectedCats] = useState<Set<Category>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const categories: Category[] = ["Korallen", "Fische", "Wirbellose", "Equipment", "Frags"];

  const toggleCat = (cat: Category) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const results = useMemo(() => {
    let res = listings.filter((l) => {
      const q = query.toLowerCase();
      const matchQuery = !q || l.title.toLowerCase().includes(q) || l.latin.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = selectedCats.size === 0 || selectedCats.has(l.category);
      const matchMin = !minPrice || l.price >= Number(minPrice);
      const matchMax = !maxPrice || l.price <= Number(maxPrice);
      return matchQuery && matchCat && matchMin && matchMax;
    });
    if (sort === "Preis ↑") res = [...res].sort((a, b) => a.price - b.price);
    if (sort === "Preis ↓") res = [...res].sort((a, b) => b.price - a.price);
    if (sort === "Beliebteste") res = [...res].sort((a, b) => b.views - a.views);
    return res;
  }, [query, sort, minPrice, maxPrice, selectedCats]);

  return (
    <div className="pb-28 md:pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/8 bg-[rgba(3,7,10,0.94)] px-4 sm:px-6 lg:px-8 pb-4 pt-6 backdrop-blur-xl">
        <h1 className="mb-4 text-[22px] font-semibold tracking-[-0.04em]">Suche</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/36">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Koralle, Fisch, Equipment..."
              className="w-full border border-white/10 bg-white/4 py-3 pl-10 pr-4 text-[15px] text-white/86 placeholder-white/28 focus:border-white/24 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex h-[46px] w-[46px] items-center justify-center border transition ${showFilters || selectedCats.size > 0 || minPrice || maxPrice ? "border-white/40 bg-white/8" : "border-white/10"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 6H20M7 12H17M10 18H14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 space-y-4 border-t border-white/8 pt-4">
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/36">Kategorie</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCat(cat)}
                    className={["rounded-full border px-3 py-1.5 text-[12px] font-medium transition", selectedCats.has(cat) ? "border-white/40 bg-white/10 text-white" : "border-white/8 text-white/44 hover:border-white/18"].join(" ")}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/36">Preis (CHF)</p>
              <div className="flex items-center gap-2 max-w-xs">
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Von" className="w-full border border-white/10 bg-white/4 px-3 py-2 text-[14px] text-white/80 placeholder-white/28 focus:border-white/24 focus:outline-none" />
                <span className="text-white/30">–</span>
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Bis" className="w-full border border-white/10 bg-white/4 px-3 py-2 text-[14px] text-white/80 placeholder-white/28 focus:border-white/24 focus:outline-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sort bar */}
      <div className="flex items-center gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 py-3 no-scrollbar border-b border-white/6">
        <span className="shrink-0 text-[13px] text-white/38">{results.length} Ergebnisse</span>
        <div className="ml-auto flex shrink-0 gap-2">
          {sortOptions.map((o) => (
            <button
              key={o}
              onClick={() => setSort(o)}
              className={["rounded-full px-3 py-1.5 text-[12px] font-medium transition", o === sort ? "bg-white/10 text-white" : "text-white/38 hover:text-white/62"].join(" ")}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 sm:px-6 lg:px-8 pt-5">
        {results.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-3 text-4xl">🔍</div>
            <h3 className="mb-1 text-[18px] font-semibold">Keine Ergebnisse</h3>
            <p className="text-[14px] text-white/40">Versuche andere Suchbegriffe oder Filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-x-8 stagger">
            {results.map((item, i) => (
              <ListingCard key={item.id} listing={item} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
