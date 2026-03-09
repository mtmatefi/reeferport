"use client";
import { use, useState } from "react";
import Link from "next/link";
import { listings } from "@/lib/data";
import SellerBadge from "@/components/SellerBadge";
import { notFound } from "next/navigation";

export default function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const listing = listings.find((l) => l.id === id);

  if (!listing) notFound();

  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(listing.saved);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="pb-36">
      {/* Image gallery */}
      <div className="relative">
        <div className="relative h-[360px] overflow-hidden bg-black">
          <img
            src={listing.images[activeImage] ?? listing.image}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#03070A] via-transparent to-transparent" />

          {/* Back button */}
          <Link
            href="/"
            className="absolute left-4 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Save button */}
          <button
            onClick={() => setSaved((s) => !s)}
            className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={saved ? "white" : "none"}
              stroke={saved ? "white" : "rgba(255,255,255,0.85)"}
              strokeWidth="1.8"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Image counter */}
          {listing.images.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/40 px-2.5 py-1 text-[12px] text-white/70 backdrop-blur-sm">
              {activeImage + 1} / {listing.images.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {listing.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto bg-[#03070A] px-5 py-3 no-scrollbar">
            {listing.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-14 w-14 shrink-0 overflow-hidden border transition-all ${
                  i === activeImage ? "border-white/60" : "border-transparent opacity-50"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-5">
        {/* Badge row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {listing.badge && (
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
              {listing.badge}
            </span>
          )}
          <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/46">
            {listing.category}
          </span>
          <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/46">
            {listing.condition}
          </span>
          {listing.listingType === "B2C" && (
            <span className="rounded-full bg-[rgba(96,165,250,0.12)] px-2.5 py-1 text-[11px] text-[#93C5FD]">
              Händler
            </span>
          )}
        </div>

        {/* Title & price */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold leading-[0.95] tracking-[-0.055em] text-white">
              {listing.title}
            </h1>
            {listing.latin && (
              <p className="mt-1 text-[14px] italic text-white/46">{listing.latin}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[26px] font-semibold tracking-[-0.04em]">
              {listing.currency} {listing.price.toLocaleString("de-CH")}
            </div>
            {listing.shipping && listing.shippingCost && (
              <div className="mt-0.5 text-[12px] text-white/38">
                + CHF {listing.shippingCost} Versand
              </div>
            )}
          </div>
        </div>

        {/* Location & time */}
        <div className="mt-3 flex items-center gap-3 text-[13px] text-white/40">
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {listing.location}
          </span>
          <span>·</span>
          <span>Vor {listing.postedAt}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {listing.views}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {listing.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[12px] text-white/50"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mt-6 border-t border-white/6 pt-5">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/36">
            Beschreibung
          </h2>
          <p className="text-[15px] leading-[1.65] text-white/70">{listing.description}</p>
        </div>

        {/* Shipping / pickup */}
        <div className="mt-6 border-t border-white/6 pt-5">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/36">
            Übergabe
          </h2>
          <div className="flex gap-3">
            {listing.pickup && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[13px] text-white/60">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                Abholung: {listing.location}
              </div>
            )}
            {listing.shipping && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[13px] text-white/60">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 17l6-6M15 11h4l2 3v3h-6v-6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Versand: CHF {listing.shippingCost}
              </div>
            )}
          </div>
        </div>

        {/* Seller */}
        <div className="mt-6 border-t border-white/6 pt-5">
          <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/36">
            Verkäufer
          </h2>
          <SellerBadge seller={listing.seller} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded border border-white/6 py-3">
              <div className="text-[18px] font-semibold tracking-[-0.03em]">
                {listing.seller.salesCount}+
              </div>
              <div className="mt-0.5 text-[11px] text-white/36">Verkäufe</div>
            </div>
            <div className="rounded border border-white/6 py-3">
              <div className="text-[18px] font-semibold tracking-[-0.03em]">
                ★ {listing.seller.rating}
              </div>
              <div className="mt-0.5 text-[11px] text-white/36">Bewertung</div>
            </div>
            <div className="rounded border border-white/6 py-3">
              <div className="text-[18px] font-semibold tracking-[-0.03em]">
                seit {listing.seller.memberSince}
              </div>
              <div className="mt-0.5 text-[11px] text-white/36">Mitglied</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/8 bg-[rgba(3,7,10,0.95)] p-4 pb-8 backdrop-blur-xl">
        <div className="mx-auto flex max-w-sm gap-3">
          <button
            onClick={() => setShowContact(true)}
            className="flex-1 bg-white py-3.5 text-[14px] font-semibold text-black shadow-[0_12px_28px_rgba(255,255,255,0.14)] transition hover:scale-[1.01] active:scale-[0.98]"
          >
            Verkäufer kontaktieren
          </button>
          <button className="flex h-[50px] w-[50px] items-center justify-center border border-white/14 transition hover:border-white/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contact modal */}
      {showContact && (
        <div
          className="fixed inset-0 z-40 flex items-end bg-black/60 backdrop-blur-sm"
          onClick={() => setShowContact(false)}
        >
          <div
            className="w-full rounded-t-2xl border-t border-white/10 bg-[#080F14] p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-white/20" />
            <h3 className="mb-2 text-[20px] font-semibold tracking-[-0.04em]">Nachricht senden</h3>
            <p className="mb-5 text-[14px] text-white/46">
              Direkte Nachricht an {listing.seller.name}
            </p>
            <textarea
              className="w-full resize-none rounded border border-white/10 bg-white/4 p-3.5 text-[14px] text-white/82 placeholder-white/28 focus:border-white/24 focus:outline-none"
              rows={4}
              placeholder={`Hallo, ich interessiere mich für Ihr Inserat "${listing.title}"...`}
            />
            <button className="mt-4 w-full bg-white py-3.5 text-[14px] font-semibold text-black">
              Senden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
