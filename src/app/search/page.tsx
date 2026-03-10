"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  listings,
  type Category,
  type OfferType,
  SUBCATEGORIES,
  EQUIPMENT_TYPES,
  EQUIPMENT_BRANDS,
  OFFER_TYPE_LABELS,
} from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import { Suspense } from "react";

const SORTS = ["Neueste", "Preis ↑", "Preis ↓", "Beliebteste"] as const;
type Sort = (typeof SORTS)[number];

/* ── Style helpers ────────────────────────────────────────────────────────── */
const pill = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition ${
    active
      ? "border-[rgba(232,114,74,0.40)] bg-[rgba(232,114,74,0.10)] text-[#FF9972]"
      : "border-[rgba(45,200,190,0.09)] text-white/40 hover:border-[rgba(45,200,190,0.18)]"
  }`;

const inputCls =
  "w-full border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.3)] px-2.5 py-2 text-[13px] text-white/78 placeholder-white/26 focus:border-[rgba(232,114,74,0.35)] focus:outline-none rounded";

const sectionLabel = "text-[11px] font-semibold uppercase tracking-[0.15em] text-white/28 mb-2";

/* ── Offer-type badge for result cards ────────────────────────────────────── */
function OfferBadge({ listing }: { listing: (typeof listings)[number] }) {
  if (listing.offerType === "gift")
    return (
      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
        Gratis
      </span>
    );
  if (listing.offerType === "trade")
    return (
      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
        Tausch
      </span>
    );
  return null;
}

/* ════════════════════════════════════════════════════════════════════════════ */

function SearchContent() {
  const params = useSearchParams();

  /* ── State ─────────────────────────────────────────────────────────────── */
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState<Sort>("Neueste");
  const [cats, setCats] = useState<Set<Category>>(new Set());
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [type, setType] = useState<"Alle" | "B2C" | "C2C">("Alle");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Offer type filter
  const [offerFilter, setOfferFilter] = useState<"Alle" | OfferType>("Alle");

  // Subcategory filter (only when a single category is selected)
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  // Equipment-specific filters
  const [eqType, setEqType] = useState<string | null>(null);
  const [eqBrands, setEqBrands] = useState<Set<string>>(new Set());
  const [tankMin, setTankMin] = useState("");
  const [tankMax, setTankMax] = useState("");
  const [wattMin, setWattMin] = useState("");
  const [wattMax, setWattMax] = useState("");
  const [eqCondition, setEqCondition] = useState<"Alle" | "Neu" | "Gebraucht">("Alle");

  // CITES toggle
  const [citesOnly, setCitesOnly] = useState(false);

  /* ── Derived ───────────────────────────────────────────────────────────── */
  const catList: Category[] = [
    "Korallen",
    "Fische",
    "Wirbellose",
    "Anemonen",
    "Equipment",
    "Frags",
  ];

  const singleCat = cats.size === 1 ? [...cats][0] : null;
  const showEquipmentFilters = singleCat === "Equipment";
  const subcats = singleCat ? SUBCATEGORIES[singleCat] : [];

  const toggleCat = (c: Category) => {
    setCats((p) => {
      const n = new Set(p);
      n.has(c) ? n.delete(c) : n.add(c);
      return n;
    });
    // reset subcategory & equipment filters when category changes
    setSelectedSub(null);
    setEqType(null);
    setEqBrands(new Set());
    setTankMin("");
    setTankMax("");
    setWattMin("");
    setWattMax("");
    setEqCondition("Alle");
  };

  const toggleBrand = (b: string) =>
    setEqBrands((p) => {
      const n = new Set(p);
      n.has(b) ? n.delete(b) : n.add(b);
      return n;
    });

  const hasFilters =
    cats.size > 0 ||
    minP ||
    maxP ||
    type !== "Alle" ||
    sort !== "Neueste" ||
    offerFilter !== "Alle" ||
    selectedSub !== null ||
    eqType !== null ||
    eqBrands.size > 0 ||
    tankMin ||
    tankMax ||
    wattMin ||
    wattMax ||
    eqCondition !== "Alle" ||
    citesOnly;

  const clearAll = () => {
    setCats(new Set());
    setMinP("");
    setMaxP("");
    setType("Alle");
    setSort("Neueste");
    setOfferFilter("Alle");
    setSelectedSub(null);
    setEqType(null);
    setEqBrands(new Set());
    setTankMin("");
    setTankMax("");
    setWattMin("");
    setWattMax("");
    setEqCondition("Alle");
    setCitesOnly(false);
  };

  /* ── Filter + sort ─────────────────────────────────────────────────────── */
  const results = useMemo(() => {
    let r = listings.filter((l) => {
      const query = q.toLowerCase();
      const matchQ =
        !query ||
        [l.title, l.latin, l.location, ...l.tags].some((s) =>
          s.toLowerCase().includes(query),
        );
      const matchC = cats.size === 0 || cats.has(l.category);
      const matchMin = !minP || l.price >= Number(minP);
      const matchMax = !maxP || l.price <= Number(maxP);
      const matchT = type === "Alle" || l.listingType === type;
      const matchOffer =
        offerFilter === "Alle" || l.offerType === offerFilter;
      const matchSub = !selectedSub || l.subcategory === selectedSub;

      // Equipment filters
      const matchEqType = !eqType || l.equipmentType === eqType;
      const matchEqBrand =
        eqBrands.size === 0 || (l.brand && eqBrands.has(l.brand));
      const matchTankMin =
        !tankMin || (l.tankSizeMax !== undefined && l.tankSizeMax >= Number(tankMin));
      const matchTankMax =
        !tankMax || (l.tankSizeMin !== undefined && l.tankSizeMin <= Number(tankMax));
      const matchWattMin =
        !wattMin || (l.wattage !== undefined && l.wattage >= Number(wattMin));
      const matchWattMax =
        !wattMax || (l.wattage !== undefined && l.wattage <= Number(wattMax));
      const matchEqCond =
        eqCondition === "Alle" || l.condition === eqCondition;

      // CITES
      const matchCites =
        !citesOnly || (l.citesRequired === true && !!l.citesNumber);

      return (
        matchQ &&
        matchC &&
        matchMin &&
        matchMax &&
        matchT &&
        matchOffer &&
        matchSub &&
        matchEqType &&
        matchEqBrand &&
        matchTankMin &&
        matchTankMax &&
        matchWattMin &&
        matchWattMax &&
        matchEqCond &&
        matchCites
      );
    });

    if (sort === "Preis ↑") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "Preis ↓") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "Beliebteste") r = [...r].sort((a, b) => b.views - a.views);
    return r;
  }, [
    q,
    sort,
    cats,
    minP,
    maxP,
    type,
    offerFilter,
    selectedSub,
    eqType,
    eqBrands,
    tankMin,
    tankMax,
    wattMin,
    wattMax,
    eqCondition,
    citesOnly,
  ]);

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="pb-24 md:pb-6">
      {/* ── Search bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 glass border-b border-white/7 px-4 sm:px-6 lg:px-8 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/32 pointer-events-none"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M16.5 16.5L21 21"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Koralle, Fisch, Equipment, Ort…"
              className="w-full border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.35)] py-2.5 pl-10 pr-10 text-[15px] text-white/88 placeholder-white/26 focus:border-[rgba(232,114,74,0.35)] focus:outline-none transition rounded-xl"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/55 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`relative flex h-[42px] w-[42px] shrink-0 items-center justify-center border transition rounded-xl ${
              filtersOpen || hasFilters
                ? "border-[rgba(232,114,74,0.40)] bg-[rgba(232,114,74,0.10)] text-[#FF9972]"
                : "border-[rgba(45,200,190,0.14)] text-white/44 hover:border-[rgba(45,200,190,0.28)] hover:text-white/70"
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6H20M7 12H17M10 18H14"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            {hasFilters && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#E8724A]" />
            )}
          </button>
        </div>

        {/* ── Filter panel ────────────────────────────────────────────── */}
        {filtersOpen && (
          <div className="mt-3 border-t border-white/7 pt-3 space-y-4 fade-in pb-1">
            {/* Listing type (B2C / C2C) */}
            <div>
              <p className={sectionLabel}>Inserattyp</p>
              <div className="flex gap-2">
                {(["Alle", "B2C", "C2C"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={pill(type === t)}
                  >
                    {t === "B2C" ? "Händler" : t === "C2C" ? "Privat" : "Alle Typen"}
                  </button>
                ))}
              </div>
            </div>

            {/* Offer type */}
            <div>
              <p className={sectionLabel}>Angebotsart</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOfferFilter("Alle")}
                  className={pill(offerFilter === "Alle")}
                >
                  Alle
                </button>
                {(Object.keys(OFFER_TYPE_LABELS) as OfferType[]).map((ot) => (
                  <button
                    key={ot}
                    onClick={() => setOfferFilter(ot)}
                    className={pill(offerFilter === ot)}
                  >
                    {OFFER_TYPE_LABELS[ot]}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className={sectionLabel}>Kategorie</p>
              <div className="flex flex-wrap gap-2">
                {catList.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCat(c)}
                    className={pill(cats.has(c))}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategory (when single category selected) */}
            {singleCat && subcats.length > 0 && (
              <div>
                <p className={sectionLabel}>Unterkategorie</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSub(null)}
                    className={pill(selectedSub === null)}
                  >
                    Alle
                  </button>
                  {subcats.map((sc) => (
                    <button
                      key={sc.value}
                      onClick={() =>
                        setSelectedSub(selectedSub === sc.value ? null : sc.value)
                      }
                      className={pill(selectedSub === sc.value)}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Equipment-specific filters ─────────────────────────── */}
            {showEquipmentFilters && (
              <>
                {/* Equipment type */}
                <div>
                  <p className={sectionLabel}>Equipment-Typ</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setEqType(null)}
                      className={pill(eqType === null)}
                    >
                      Alle
                    </button>
                    {EQUIPMENT_TYPES.map((et) => (
                      <button
                        key={et.value}
                        onClick={() =>
                          setEqType(eqType === et.value ? null : et.value)
                        }
                        className={pill(eqType === et.value)}
                      >
                        <span className="mr-1">{et.icon}</span>
                        {et.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand multi-select */}
                <div>
                  <p className={sectionLabel}>Marke</p>
                  <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                    {EQUIPMENT_BRANDS.map((b) => (
                      <button
                        key={b}
                        onClick={() => toggleBrand(b)}
                        className={`rounded border px-2.5 py-1 text-[11px] font-medium transition ${
                          eqBrands.has(b)
                            ? "border-[rgba(232,114,74,0.40)] bg-[rgba(232,114,74,0.10)] text-[#FF9972]"
                            : "border-[rgba(45,200,190,0.09)] text-white/36 hover:border-[rgba(45,200,190,0.18)]"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tank size range */}
                <div>
                  <p className={sectionLabel}>Beckengrösse (Liter)</p>
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      type="number"
                      value={tankMin}
                      onChange={(e) => setTankMin(e.target.value)}
                      placeholder="Min"
                      className={inputCls}
                    />
                    <span className="text-white/28">–</span>
                    <input
                      type="number"
                      value={tankMax}
                      onChange={(e) => setTankMax(e.target.value)}
                      placeholder="Max"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Wattage range */}
                <div>
                  <p className={sectionLabel}>Leistung (Watt)</p>
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      type="number"
                      value={wattMin}
                      onChange={(e) => setWattMin(e.target.value)}
                      placeholder="Min"
                      className={inputCls}
                    />
                    <span className="text-white/28">–</span>
                    <input
                      type="number"
                      value={wattMax}
                      onChange={(e) => setWattMax(e.target.value)}
                      placeholder="Max"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Condition (Neu / Gebraucht) */}
                <div>
                  <p className={sectionLabel}>Zustand</p>
                  <div className="flex gap-2">
                    {(["Alle", "Neu", "Gebraucht"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setEqCondition(c)}
                        className={pill(eqCondition === c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Price range */}
            <div>
              <p className={sectionLabel}>Preis (CHF)</p>
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="number"
                  value={minP}
                  onChange={(e) => setMinP(e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
                <span className="text-white/28">–</span>
                <input
                  type="number"
                  value={maxP}
                  onChange={(e) => setMaxP(e.target.value)}
                  placeholder="∞"
                  className={inputCls}
                />
              </div>
            </div>

            {/* CITES toggle */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer group/cites">
                <button
                  onClick={() => setCitesOnly((v) => !v)}
                  className={`relative h-5 w-9 rounded-full border transition-colors ${
                    citesOnly
                      ? "border-[rgba(232,114,74,0.50)] bg-[rgba(232,114,74,0.25)]"
                      : "border-[rgba(45,200,190,0.14)] bg-[rgba(7,51,68,0.4)]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full transition-transform ${
                      citesOnly
                        ? "translate-x-4 bg-[#E8724A]"
                        : "translate-x-0 bg-white/30"
                    }`}
                  />
                </button>
                <span className="text-[12px] text-white/50 group-hover/cites:text-white/70 transition select-none">
                  Nur CITES-konforme Inserate
                </span>
              </label>
            </div>

            {/* Reset all */}
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-[12px] text-white/36 underline underline-offset-2 hover:text-white/58 transition"
              >
                Alle Filter zurücksetzen
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Sort + count ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-white/7 no-scrollbar">
        <span className="text-[13px] text-white/34 shrink-0">
          {results.length} {results.length === 1 ? "Inserat" : "Inserate"}
        </span>
        <div className="ml-auto flex shrink-0 gap-1">
          {SORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                s === sort
                  ? "bg-[rgba(232,114,74,0.10)] text-[#FF9972] border border-[rgba(232,114,74,0.30)]"
                  : "text-white/36 hover:text-white/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        {results.length === 0 ? (
          <div className="py-20 text-center fade-in">
            <p className="mb-3 text-[40px]">🔍</p>
            <h3 className="mb-1 text-[18px] font-semibold tracking-[-0.03em]">
              Keine Ergebnisse
            </h3>
            <p className="text-[14px] text-white/38 mb-4">
              Versuche andere Suchbegriffe oder Filter
            </p>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-[13px] text-white/50 underline underline-offset-2"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-6 stagger">
            {results.map((item, i) => (
              <div key={item.id} className="relative">
                {/* Offer-type & subcategory badges overlaid above card */}
                <div className="absolute right-10 top-5 z-[5] flex items-center gap-1.5">
                  <OfferBadge listing={item} />
                  {item.subcategory && (
                    <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[10px] text-white/34">
                      {item.subcategory}
                    </span>
                  )}
                </div>
                <ListingCard listing={item} rank={i + 1} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick suggestions when empty query ──────────────────────────── */}
      {!q && results.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 mt-4 pb-2">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/24">
            Beliebte Suchen
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Euphyllia",
              "Zoanthus",
              "Clownfisch",
              "Acropora",
              "Mandarin",
              "Tridacna",
              "LED Lampe",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="rounded-full border border-[rgba(45,200,190,0.10)] px-3 py-1.5 text-[12px] text-white/38 transition hover:border-[rgba(45,200,190,0.22)] hover:text-white/62"
              >
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
