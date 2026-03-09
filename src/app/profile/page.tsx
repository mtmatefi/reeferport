"use client";
import { useState } from "react";
import { listings, sellers } from "@/lib/data";
import ListingCard from "@/components/ListingCard";

const me = sellers[0];
const myListings = listings.filter((l) => l.seller.id === me.id);

const tabs = ["Inserate", "Bewertungen", "Info"] as const;
type Tab = (typeof tabs)[number];

const reviews = [
  {
    id: 1,
    author: "Marc S.",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "Super Transaktion, Koralle war genau wie beschrieben. Sehr empfehlenswert!",
    date: "Feb 2026",
    item: "Acropora Millepora Frag",
  },
  {
    id: 2,
    author: "Nina B.",
    avatar: "https://i.pravatar.cc/150?img=25",
    rating: 5,
    text: "Professionelle Verpackung, schnelle Antwort. Top Händler.",
    date: "Jan 2026",
    item: "Ultra Zoanthus Colony",
  },
  {
    id: 3,
    author: "Thomas K.",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 4,
    text: "Gute Qualität, etwas länger gewartet auf Antwort, aber alles in Ordnung.",
    date: "Dez 2025",
    item: "Mandarin Dragonet",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Inserate");

  return (
    <div className="pb-28">
      {/* Hero banner */}
      <div className="relative h-28 bg-gradient-to-br from-[#0A1F35] via-[#061A2E] to-[#03070A]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(96,165,250,0.18),transparent_60%)]" />
      </div>

      {/* Profile header */}
      <div className="relative px-5 pb-5">
        {/* Avatar */}
        <div className="relative -mt-12 mb-4 flex items-end justify-between">
          <div className="relative">
            <img
              src={me.avatar}
              alt={me.name}
              className="h-20 w-20 rounded-full object-cover ring-3 ring-[#03070A]"
            />
            {me.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#03070A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          <button className="mb-1 border border-white/12 px-4 py-2 text-[13px] font-medium text-white/70 transition hover:border-white/24 hover:text-white/90">
            Profil bearbeiten
          </button>
        </div>

        {/* Name & type */}
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-[22px] font-semibold tracking-[-0.04em]">{me.name}</h1>
          <span className="rounded-full bg-[rgba(96,165,250,0.12)] px-2.5 py-0.5 text-[11px] font-medium text-[#93C5FD]">
            {me.type}
          </span>
        </div>
        <p className="text-[14px] text-white/46">{me.location} · Mitglied seit {me.memberSince}</p>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 divide-x divide-white/6 border border-white/8 py-3.5">
          <div className="px-3 text-center">
            <div className="text-[20px] font-semibold tracking-[-0.04em]">{me.salesCount}+</div>
            <div className="mt-0.5 text-[11px] text-white/36">Verkäufe</div>
          </div>
          <div className="px-3 text-center">
            <div className="text-[20px] font-semibold tracking-[-0.04em]">★ {me.rating}</div>
            <div className="mt-0.5 text-[11px] text-white/36">Bewertung</div>
          </div>
          <div className="px-3 text-center">
            <div className="text-[20px] font-semibold tracking-[-0.04em]">{me.reviewCount}</div>
            <div className="mt-0.5 text-[11px] text-white/36">Reviews</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-5 border-b border-white/8 pb-3">
          {tabs.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  "relative pb-1 text-[15px] font-medium tracking-[-0.02em] transition-all duration-200",
                  active ? "text-white" : "text-white/34 hover:text-white/72",
                ].join(" ")}
              >
                {tab}
                {active && <span className="absolute inset-x-0 -bottom-[13px] h-px bg-white/80" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5 pt-4">
        {activeTab === "Inserate" && (
          <div className="space-y-5 stagger">
            {myListings.length === 0 ? (
              <p className="py-12 text-center text-[14px] text-white/38">
                Noch keine Inserate
              </p>
            ) : (
              myListings.map((item, i) => (
                <ListingCard key={item.id} listing={item} index={i + 1} />
              ))
            )}
          </div>
        )}

        {activeTab === "Bewertungen" && (
          <div className="space-y-4 stagger">
            {/* Rating summary */}
            <div className="mb-6 flex items-center gap-6 border-b border-white/6 pb-5">
              <div className="text-center">
                <div className="text-[42px] font-semibold tracking-[-0.06em]">{me.rating}</div>
                <div className="mt-1 flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(me.rating) ? "white" : "none"} stroke="white" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <div className="mt-1 text-[12px] text-white/36">{me.reviewCount} Bewertungen</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter((r) => r.rating === stars).length;
                  const pct = (count / reviews.length) * 100;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="w-3 text-right text-[11px] text-white/36">{stars}</span>
                      <div className="flex-1 overflow-hidden rounded-full bg-white/8 h-1.5">
                        <div className="h-full rounded-full bg-white/60" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {reviews.map((review) => (
              <div key={review.id} className="border-b border-white/6 pb-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.author} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <div className="text-[14px] font-medium">{review.author}</div>
                      <div className="text-[11px] text-white/36">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 pt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= review.rating ? "rgba(255,255,255,0.8)" : "none"} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-[14px] leading-relaxed text-white/64">{review.text}</p>
                <p className="mt-1.5 text-[12px] text-white/32">Für: {review.item}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Info" && (
          <div className="space-y-5 fade-in-up">
            <div className="border border-white/8 p-5">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/36">
                Über den Verkäufer
              </h3>
              <p className="text-[14px] leading-relaxed text-white/62">
                Professioneller Meerwasser-Händler mit Fokus auf LPS-Korallen, Anemonen und seltene Fische.
                Alle Tiere stammen aus CITES-konformen Quellen oder Eigenaufzucht.
                Systemparameter werden täglich gemessen und dokumentiert.
              </p>
            </div>
            <div className="border border-white/8 p-5">
              <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/36">
                Kontakt & Übergabe
              </h3>
              <div className="space-y-3 text-[14px] text-white/62">
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" /></svg>
                  {me.location}
                </div>
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  Mitglied seit {me.memberSince}
                </div>
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 17l6-6M15 11h4l2 3v3h-6v-6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Versand & Selbstabholung möglich
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
