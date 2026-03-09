"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { listings, type Category } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import { Suspense } from "react";

const SORTS = ["Neueste", "Preis ↑", "Preis ↓", "Beliebteste"] as const;
type Sort = (typeof SORTS)[number];

function SearchContent() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState<Sort>("Neueste");
  const [cats, setCats] = useState<Set<Category>>(new Set());
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [type, setType] = useState<"Alle" | "B2C" | "C2C">("Alle");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const catList: Category[] = ["Korallen", "Fische", "Wirbellose", "Equipment", "Frags"];
  const toggleCat = (c: Category) => setCats((p) => { const n = new Set(p); n.has(c) ? n.delete(c) : n.add(c); return n; });
  const clearAll = () => { setCats(new Set()); setMinP(""); setMaxP(""); setType("Alle"); setSort("Neueste"); };
  const hasFilters = cats.size > 0 || minP || maxP || type !== "Alle" || sort !== "Neueste";

  const results = useMemo(() => {
    let r = listings.filter((l) => {
      const query = q.toLowerCase();
      const matchQ = !query || [l.title, l.latin, l.location, ...l.tags].some((s) => s.toLowerCase().includes(query));
      const matchC = cats.size === 0 || cats.has(l.category);
      const matchMin = !minP || l.price >= Number(minP);
      const matchMax = !maxP || l.price <= Number(maxP);
      const matchT = type === "Alle" || l.listingType === type;
      return matchQ && matchC && matchMin && matchMax && matchT;
    });
    if (sort === "Preis ↑")    r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "Preis ↓")    r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "Beliebteste") r = [...r].sort((a, b) => b.views - a.views);
    return r;
  }, [q, sort, cats, minP, maxP, type]);

  return (
    <div className="pb-24 md:pb-6">
      {/* Search bar */}
      <div className="sticky top-0 z-10 glass border-b border-white/7 px-4 sm:px-6 lg:px-8 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/32 pointer-events-none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Koralle, Fisch, Equipment, Ort…"
              className="w-full border border-white/10 bg-white/4 py-2.5 pl-10 pr-10 text-[15px] text-white/88 placeholder-white/26 focus:border-white/22 focus:outline-none transition"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/55 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`relative flex h-[42px] w-[42px] shrink-0 items-center justify-center border transition ${filtersOpen || hasFilters ? "border-white/30 bg-white/8 text-white" : "border-white/10 text-white/44 hover:border-white/22 hover:text-white/70"}`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            {hasFilters && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#60A5FA]" />}
          </button>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="mt-3 border-t border-white/7 pt-3 space-y-4 fade-in pb-1">
            {/* Type */}
            <div className="flex gap-2">
              {(["Alle", "B2C", "C2C"] as const).map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition ${type === t ? "border-white/28 bg-white/9 text-white" : "border-white/8 text-white/40 hover:border-white/16"}`}>
                  {t === "B2C" ? "Händler" : t === "C2C" ? "Privat" : "Alle Typen"}
                </button>
              ))}
            </div>
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {catList.map((c) => (
                <button key={c} onClick={() => toggleCat(c)}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${cats.has(c) ? "border-white/28 bg-white/9 text-white" : "border-white/8 text-white/40 hover:border-white/16"}`}>
                  {c}
                </button>
              ))}
            </div>
            {/* Price */}
            <div className="flex items-center gap-2 max-w-xs">
              <span className="text-[12px] text-white/34 shrink-0">CHF</span>
              <input type="number" value={minP} onChange={(e) => setMinP(e.target.value)} placeholder="0" className="w-full border border-white/10 bg-white/4 px-2.5 py-2 text-[13px] text-white/78 placeholder-white/26 focus:border-white/22 focus:outline-none" />
              <span className="text-white/28">–</span>
              <input type="number" value={maxP} onChange={(e) => setMaxP(e.target.value)} placeholder="∞" className="w-full border border-white/10 bg-white/4 px-2.5 py-2 text-[13px] text-white/78 placeholder-white/26 focus:border-white/22 focus:outline-none" />
            </div>
            {hasFilters && (
              <button onClick={clearAll} className="text-[12px] text-white/36 underline underline-offset-2 hover:text-white/58 transition">
                Alle Filter zurücksetzen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sort + count */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-white/7 no-scrollbar">
        <span className="text-[13px] text-white/34 shrink-0">
          {results.length} {results.length === 1 ? "Inserat" : "Inserate"}
        </span>
        <div className="ml-auto flex shrink-0 gap-1">
          {SORTS.map((s) => (
            <button key={s} onClick={() => setSort(s)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${s === sort ? "bg-white/9 text-white border border-white/14" : "text-white/36 hover:text-white/60"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        {results.length === 0 ? (
          <div className="py-20 text-center fade-in">
            <p className="mb-3 text-[40px]">🔍</p>
            <h3 className="mb-1 text-[18px] font-semibold tracking-[-0.03em]">Keine Ergebnisse</h3>
            <p className="text-[14px] text-white/38 mb-4">Versuche andere Suchbegriffe oder Filter</p>
            {hasFilters && <button onClick={clearAll} className="text-[13px] text-white/50 underline underline-offset-2">Filter zurücksetzen</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-6 stagger">
            {results.map((item, i) => (
              <ListingCard key={item.id} listing={item} rank={i + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Quick suggestions when empty query */}
      {!q && results.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 mt-4 pb-2">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/24">Beliebte Suchen</p>
          <div className="flex flex-wrap gap-2">
            {["Euphyllia", "Zoanthus", "Clownfisch", "Acropora", "Mandarin", "Tridacna", "LED Lampe"].map((s) => (
              <button key={s} onClick={() => setQ(s)}
                className="rounded-full border border-white/8 px-3 py-1.5 text-[12px] text-white/38 transition hover:border-white/18 hover:text-white/62">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
