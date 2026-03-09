"use client";
import { use, useState } from "react";
import Link from "next/link";
import { listings, sellers } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import { notFound } from "next/navigation";

const TABS = ["Alle Artikel", "Korallen", "Fische", "Wirbellose", "Frags", "Equipment"] as const;
type Tab = (typeof TABS)[number];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "rgba(255,255,255,0.7)" : "none"}
          stroke={s <= Math.round(rating) ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)"}
          strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function ShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const seller = sellers.find((s) => s.id === id);
  if (!seller) notFound();

  const shopListings = listings.filter((l) => l.seller.id === id);
  const [tab, setTab] = useState<Tab>("Alle Artikel");

  const filtered = tab === "Alle Artikel"
    ? shopListings
    : shopListings.filter((l) => l.category === tab);

  const categoryTabs = TABS.filter((t) => {
    if (t === "Alle Artikel") return true;
    return shopListings.some((l) => l.category === t);
  });

  const reefAllianceAccent = seller.id === "s6";

  return (
    <div className="pb-24 md:pb-8">
      {/* Banner */}
      <div className="relative h-44 overflow-hidden"
        style={{
          background: reefAllianceAccent
            ? "linear-gradient(135deg, #03111E 0%, #041825 40%, #060D13 100%)"
            : "linear-gradient(135deg, #06111C 0%, #03070A 100%)",
        }}>
        {reefAllianceAccent && (
          <>
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse 100% 180% at 20% 60%, rgba(45,212,191,0.18) 0%, transparent 55%), radial-gradient(ellipse 80% 140% at 80% 30%, rgba(96,165,250,0.14) 0%, transparent 50%)"
            }} />
            {/* Animated dots */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white pulse-dot"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    left: `${10 + i * 12}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.3}s`,
                  }} />
              ))}
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(3,7,10,0.85)_100%)]" />
        {/* Shop identity – centered */}
        <div className="absolute inset-x-0 bottom-0 flex items-end px-4 sm:px-6 lg:px-8 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={seller.avatar} alt={seller.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-[#03070A]" />
              {seller.verified && (
                <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-[#03070A] p-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[20px] font-semibold tracking-[-0.04em]">{seller.name}</h1>
                {reefAllianceAccent && (
                  <span className="rounded-full bg-[rgba(45,212,191,0.15)] border border-[rgba(45,212,191,0.25)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5EEAD4]">
                    Official Shop
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Stars rating={seller.rating} />
                <span className="text-[12px] text-white/42">{seller.rating} · {seller.reviewCount} Bewertungen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="absolute left-4 top-4 sm:left-6">
          <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-black/30 backdrop-blur-md transition hover:border-white/28">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Stats bar */}
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 border border-white/7 divide-x divide-white/7">
          {[
            { v: `${seller.salesCount.toLocaleString("de-CH")}+`, l: "Verkäufe" },
            { v: `★ ${seller.rating}`,  l: "Bewertung" },
            { v: seller.reviewCount,    l: "Reviews" },
            { v: shopListings.length,   l: "Artikel" },
          ].map((s) => (
            <div key={s.l} className="py-3.5 text-center last:hidden sm:last:block">
              <p className="text-[18px] font-semibold tracking-[-0.04em]">{s.v}</p>
              <p className="mt-0.5 text-[10px] text-white/32">{s.l}</p>
            </div>
          ))}
        </div>

        {/* About */}
        {seller.bio && (
          <div className="mt-5 border border-white/7 p-4">
            <p className="text-[13px] leading-[1.7] text-white/54">{seller.bio}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-[12px] text-white/36">
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>
                {seller.location}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6"/></svg>
                Seit {seller.memberSince}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="1.6"/></svg>
                CITES-konform · Verifiziert
              </span>
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div className="mt-5 flex gap-4 border-b border-white/7 no-scrollbar overflow-x-auto">
          {categoryTabs.map((t) => {
            const active = t === tab;
            const count = t === "Alle Artikel" ? shopListings.length : shopListings.filter((l) => l.category === t).length;
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`relative shrink-0 pb-3 text-[13px] font-medium tracking-[-0.02em] transition-colors ${active ? "text-white" : "text-white/32 hover:text-white/62"}`}>
                {t}
                <span className={`ml-1.5 text-[11px] tabular-nums ${active ? "text-white/50" : "text-white/20"}`}>{count}</span>
                {active && <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-white/70 rounded-t-full" />}
              </button>
            );
          })}
        </div>

        {/* Listings */}
        <div className="pt-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[14px] text-white/36">Keine Artikel in dieser Kategorie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-6 stagger">
              {filtered.map((item, i) => (
                <ListingCard key={item.id} listing={item} rank={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
