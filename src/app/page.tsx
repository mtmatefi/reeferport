"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import HeroCard from "@/components/HeroCard";
import ListingCard from "@/components/ListingCard";
import { listings, sellers, categories, type Category } from "@/lib/data";

const tabs = ["Discover", "Drops", "Collectors"] as const;
type Tab = (typeof tabs)[number];

const DROPS = [
  { title: "Nächster Drop", date: "22. März 2026", seller: "CoralHaus Luzern", label: "SPS Paket · 12 Frags" },
  { title: "Private Sale", date: "29. März 2026", seller: "ReefLab Zürich",   label: "Ultra LPS · 6 Stück" },
  { title: "Charity Auction", date: "5. April 2026", seller: "OceanBreeder",   label: "Wildfang-Abgabe" },
];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("Discover");
  const [cat, setCat] = useState<Category | "Alle">("Alle");

  const filtered = useMemo(
    () => listings.filter((l) => cat === "Alle" || l.category === cat),
    [cat]
  );
  const hero = listings[0];
  const grid = filtered.filter((l) => l.id !== hero.id);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-10">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="mb-7 flex items-start justify-between">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/25 md:hidden">
            Reef Market · CH
          </p>
          <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.055em] leading-[0.92] text-white/96">
            Dive into rarity.
          </h1>
          <p className="mt-2 text-[14px] text-white/36 hidden md:block">
            Meerwasser-Marktplatz Schweiz — B2C &amp; C2C
          </p>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <Link href="/search" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition hover:border-white/22 md:hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6"/><path d="M16.5 16.5L21 21" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </Link>
          <Link href="/profile" className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/12 md:hidden">
            <img src="https://i.pravatar.cc/150?img=47" alt="Profil" className="h-full w-full object-cover" />
          </Link>
        </div>
      </header>

      {/* ── Tab bar ────────────────────────────────────────── */}
      <div className="mb-7 flex gap-6 border-b border-[rgba(45,200,190,0.08)] pb-0 no-scrollbar overflow-x-auto">
        {tabs.map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "relative shrink-0 pb-3 text-[15px] font-medium tracking-[-0.02em] transition-colors duration-200",
                active ? "text-[#FF9972]" : "text-white/32 hover:text-white/64",
              ].join(" ")}
            >
              {t}
              {active && <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#E8724A] rounded-t-full" />}
            </button>
          );
        })}
      </div>

      {/* ══ DISCOVER ══════════════════════════════════════════ */}
      {tab === "Discover" && (
        <>
          {/* Hero + sidebar panel */}
          <div className="mb-8 lg:grid lg:grid-cols-[1fr_288px] lg:gap-6 xl:grid-cols-[1fr_312px]">
            <HeroCard listing={hero} />

            {/* Right panel */}
            <div className="mt-5 lg:mt-0 flex flex-col gap-4">
              {/* Stats – dynamic */}
              <div className="grid grid-cols-3 border border-[rgba(45,200,190,0.09)] divide-x divide-[rgba(45,200,190,0.09)]">
                {[
                  { n: listings.length.toString(), label: "Inserate" },
                  { n: sellers.length.toString(),  label: "Verkäufer" },
                  { n: "8",                         label: "Kantone" },
                ].map((s) => (
                  <div key={s.label} className="py-4 text-center">
                    <p className="text-[22px] font-semibold tracking-[-0.04em]">{s.n}</p>
                    <p className="mt-0.5 text-[11px] text-white/34">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Trending tags */}
              <div className="hidden lg:block border border-[rgba(45,200,190,0.09)] p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/26">Trending</p>
                <div className="flex flex-wrap gap-2">
                  {["LPS", "SPS", "WYSIWYG", "Nachzucht", "Euphyllia", "Zoanthus"].map((tag) => (
                    <Link key={tag} href={`/search?q=${tag}`}
                      className="rounded-full border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.3)] px-2.5 py-1 text-[12px] text-white/44 transition hover:border-[rgba(232,114,74,0.25)] hover:text-[#FF9972]">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Seller spotlight */}
              <div className="hidden lg:block border border-[rgba(45,200,190,0.09)] p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/26">Top Shops</p>
                {[
                  { id: "s6", name: "ReefAlliance Shop",  sub: "Official · ★ 4.9", img: "https://i.pravatar.cc/150?img=33", official: true },
                  { id: "s1", name: "CoralHaus Luzern",   sub: "Händler · ★ 4.9",  img: "https://i.pravatar.cc/150?img=3",  official: false },
                  { id: "s3", name: "ReefLab Zürich",     sub: "Händler · ★ 5.0",  img: "https://i.pravatar.cc/150?img=7",  official: false },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3 py-2.5 border-b border-[rgba(45,200,190,0.07)] last:border-0">
                    <div className="relative">
                      <img src={s.img} alt={s.name} className="h-8 w-8 rounded-full object-cover" />
                      {s.official && <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-[#2DD4BF] ring-2 ring-[#071C28]" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-white/84">{s.name}</p>
                      <p className="text-[11px] text-white/36">{s.sub}</p>
                    </div>
                    <Link href={`/shop/${s.id}`} className="ml-auto text-[12px] text-white/36 hover:text-white/60 transition">Shop →</Link>
                  </div>
                ))}
              </div>

              {/* Insert CTA */}
              <div className="hidden lg:block border border-[rgba(45,200,190,0.09)] p-4">
                <p className="text-[14px] font-semibold tracking-[-0.03em] mb-1">Jetzt inserieren</p>
                <p className="text-[13px] text-white/38 mb-3.5">Zeige deine Korallen der Community.</p>
                <Link href="/sell" className="flex items-center justify-center gap-2 btn-coral py-3 text-[13px] rounded-lg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
                  Inserat erstellen
                </Link>
              </div>
            </div>
          </div>

          {/* ── Category filter ──────────────────────────────── */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((c) => {
              const active = c.label === cat;
              return (
                <button
                  key={c.label}
                  onClick={() => setCat(c.label)}
                  className={[
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
                    active
                      ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.12)] text-[#FF9972]"
                      : "border-[rgba(45,200,190,0.09)] text-white/40 hover:border-[rgba(232,114,74,0.22)] hover:text-white/70",
                  ].join(" ")}
                >
                  <span className="text-[13px]">{c.icon}</span>
                  <span>{c.label}</span>
                  {c.count > 0 && (
                    <span className={`text-[10px] tabular-nums ${active ? "text-white/60" : "text-white/26"}`}>
                      {c.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Listings grid ────────────────────────────────── */}
          <div className="border-t border-[rgba(45,200,190,0.08)] pt-1">
            <div className="mb-4 flex items-baseline justify-between pt-4">
              <h2 className="text-[18px] font-semibold tracking-[-0.04em] text-white/90">
                {cat === "Alle" ? "Alle Inserate" : cat}
              </h2>
              <span className="text-[13px] text-white/30">{filtered.length} gefunden</span>
            </div>

            {grid.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[32px] mb-3">🔍</p>
                <p className="text-[15px] font-medium text-white/50">Keine Inserate in dieser Kategorie</p>
                <button onClick={() => setCat("Alle")} className="mt-3 text-[13px] text-white/36 underline underline-offset-2">Alle anzeigen</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-6 stagger">
                {grid.map((item, i) => (
                  <ListingCard key={item.id} listing={item} rank={i + 2} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ══ DROPS ═════════════════════════════════════════════ */}
      {tab === "Drops" && (
        <div className="fade-up">
          <p className="mb-6 text-[14px] text-white/42">Exklusive Editionen – limitiert und terminiert.</p>
          <div className="space-y-3 stagger">
            {DROPS.map((d, i) => (
              <div key={i} className="flex items-center gap-4 border border-white/7 p-4 transition hover:border-white/14">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30 text-center leading-tight">
                  {d.date.split(" ").slice(0, 2).join("\n")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold tracking-[-0.03em]">{d.title}</p>
                  <p className="text-[12px] text-white/36">{d.seller} · {d.label}</p>
                </div>
                <button className="shrink-0 rounded-full border border-white/12 px-3 py-1.5 text-[12px] font-medium text-white/50 transition hover:border-white/24 hover:text-white/80">
                  Erinnern
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 border border-dashed border-white/10 p-6 text-center">
            <p className="text-[14px] text-white/36">Du willst einen eigenen Drop veranstalten?</p>
            <Link href="/sell" className="mt-3 inline-block rounded-full bg-white/8 px-5 py-2 text-[13px] font-medium text-white/70 transition hover:bg-white/12">
              Jetzt anfragen →
            </Link>
          </div>
        </div>
      )}

      {/* ══ COLLECTORS ════════════════════════════════════════ */}
      {tab === "Collectors" && (
        <div className="fade-up">
          <p className="mb-6 text-[14px] text-white/42">Kuratierte High-End-Inserate – CHF 150+</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-6 stagger">
            {listings.filter((l) => l.price >= 130).map((item, i) => (
              <ListingCard key={item.id} listing={item} rank={i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
