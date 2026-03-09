"use client";
import { use, useState } from "react";
import Link from "next/link";
import { listings } from "@/lib/data";
import SellerBadge from "@/components/SellerBadge";
import { notFound } from "next/navigation";

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = listings.find((l) => l.id === id);
  if (!listing) notFound();

  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(listing.saved);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="pb-10">
      {/* Back button (top bar on desktop) */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/8 bg-[rgba(3,7,10,0.94)] px-4 sm:px-6 lg:px-8 py-3 backdrop-blur-xl">
        <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <span className="text-[15px] font-medium text-white/70 truncate">{listing.title}</span>
        <button onClick={() => setSaved((s) => !s)} className="ml-auto p-1">
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={saved ? "white" : "none"}
            stroke={saved ? "white" : "rgba(255,255,255,0.5)"}
            strokeWidth="1.8">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Two-column layout on lg */}
      <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-0 xl:grid-cols-[1fr_440px]">

        {/* Left: Images */}
        <div className="lg:border-r lg:border-white/6">
          <div className="relative overflow-hidden bg-black">
            <img
              src={listing.images[activeImage] ?? listing.image}
              alt={listing.title}
              className="h-[300px] sm:h-[420px] lg:h-[560px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03070A]/60 via-transparent to-transparent" />
            {listing.images.length > 1 && (
              <div className="absolute bottom-4 right-4 rounded-full bg-black/40 px-2.5 py-1 text-[12px] text-white/70 backdrop-blur-sm">
                {activeImage + 1} / {listing.images.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto bg-[#03070A] px-4 sm:px-6 py-3 no-scrollbar">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-14 w-14 shrink-0 overflow-hidden border transition-all ${
                    i === activeImage ? "border-white/60" : "border-transparent opacity-40 hover:opacity-70"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="px-4 sm:px-6 lg:px-8 pt-5 lg:overflow-y-auto lg:max-h-[calc(100vh-53px)]">
          {/* Badges */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {listing.badge && (
              <span className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
                {listing.badge}
              </span>
            )}
            <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/46">{listing.category}</span>
            <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/46">{listing.condition}</span>
            {listing.listingType === "B2C" && (
              <span className="rounded-full bg-[rgba(96,165,250,0.12)] px-2.5 py-1 text-[11px] text-[#93C5FD]">Händler</span>
            )}
          </div>

          {/* Title + Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[26px] sm:text-[30px] font-semibold leading-[0.95] tracking-[-0.055em]">
                {listing.title}
              </h1>
              {listing.latin && (
                <p className="mt-1 text-[14px] italic text-white/46">{listing.latin}</p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[24px] font-semibold tracking-[-0.04em]">
                {listing.currency} {listing.price.toLocaleString("de-CH")}
              </div>
              {listing.shipping && listing.shippingCost && (
                <div className="mt-0.5 text-[12px] text-white/38">+ CHF {listing.shippingCost} Versand</div>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-white/40">
            <span className="flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>
              {listing.location}
            </span>
            <span>· Vor {listing.postedAt}</span>
            <span className="flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>
              {listing.views}
            </span>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {listing.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-[12px] text-white/50">
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA – shown inline on desktop instead of fixed bottom bar */}
          <div className="mt-6 hidden lg:flex gap-3">
            <button
              onClick={() => setShowContact(true)}
              className="flex-1 bg-white py-3.5 text-[14px] font-semibold text-black shadow-[0_12px_28px_rgba(255,255,255,0.12)] transition hover:bg-white/90 active:scale-[0.98]"
            >
              Verkäufer kontaktieren
            </button>
            <button className="flex h-[50px] w-[50px] items-center justify-center border border-white/14 transition hover:border-white/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* Description */}
          <div className="mt-6 border-t border-white/6 pt-5">
            <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/34">Beschreibung</h2>
            <p className="text-[14px] sm:text-[15px] leading-[1.65] text-white/70">{listing.description}</p>
          </div>

          {/* Shipping */}
          <div className="mt-6 border-t border-white/6 pt-5">
            <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/34">Übergabe</h2>
            <div className="flex flex-wrap gap-3">
              {listing.pickup && (
                <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[13px] text-white/60">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>
                  Abholung: {listing.location}
                </div>
              )}
              {listing.shipping && (
                <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[13px] text-white/60">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 17l6-6M15 11h4l2 3v3h-6v-6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Versand: CHF {listing.shippingCost}
                </div>
              )}
            </div>
          </div>

          {/* Seller */}
          <div className="mt-6 border-t border-white/6 pt-5 pb-8">
            <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/34">Verkäufer</h2>
            <SellerBadge seller={listing.seller} />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded border border-white/6 py-3">
                <div className="text-[17px] font-semibold tracking-[-0.03em]">{listing.seller.salesCount}+</div>
                <div className="mt-0.5 text-[11px] text-white/36">Verkäufe</div>
              </div>
              <div className="rounded border border-white/6 py-3">
                <div className="text-[17px] font-semibold tracking-[-0.03em]">★ {listing.seller.rating}</div>
                <div className="mt-0.5 text-[11px] text-white/36">Bewertung</div>
              </div>
              <div className="rounded border border-white/6 py-3">
                <div className="text-[17px] font-semibold tracking-[-0.03em]">seit {listing.seller.memberSince}</div>
                <div className="mt-0.5 text-[11px] text-white/36">Mitglied</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA – mobile/tablet only */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/8 bg-[rgba(3,7,10,0.95)] p-4 pb-8 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            onClick={() => setShowContact(true)}
            className="flex-1 bg-white py-3.5 text-[14px] font-semibold text-black shadow-[0_12px_28px_rgba(255,255,255,0.14)] transition hover:bg-white/90 active:scale-[0.98]"
          >
            Verkäufer kontaktieren
          </button>
          <button className="flex h-[50px] w-[50px] items-center justify-center border border-white/14 transition hover:border-white/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Contact modal */}
      {showContact && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowContact(false)}>
          <div
            className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-white/10 bg-[#080F14] p-6 pb-10 sm:pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/20 sm:hidden" />
            <h3 className="mb-1 text-[20px] font-semibold tracking-[-0.04em]">Nachricht senden</h3>
            <p className="mb-5 text-[14px] text-white/46">Direkte Nachricht an {listing.seller.name}</p>
            <textarea
              className="w-full resize-none rounded border border-white/10 bg-white/4 p-3.5 text-[14px] text-white/82 placeholder-white/28 focus:border-white/24 focus:outline-none"
              rows={4}
              placeholder={`Hallo, ich interessiere mich für "${listing.title}"...`}
            />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setShowContact(false)} className="flex-1 border border-white/12 py-3 text-[14px] text-white/60 transition hover:border-white/24">
                Abbrechen
              </button>
              <button className="flex-1 bg-white py-3 text-[14px] font-semibold text-black">Senden</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
