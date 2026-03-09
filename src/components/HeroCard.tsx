"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { type Listing } from "@/lib/data";

export default function HeroCard({ listing }: { listing: Listing }) {
  const { isSaved, toggleSaved } = useStore();
  const saved = isSaved(listing.id);

  return (
    <Link href={`/listing/${listing.id}`} className="group relative block overflow-hidden bg-[#060D13]">
      <img
        src={listing.image}
        alt={listing.title}
        className="h-[360px] sm:h-[440px] lg:h-[520px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        loading="eager"
      />
      {/* Layered gradients for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.55)_65%,rgba(3,7,10,0.95)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,transparent_60%)]" />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4">
        {listing.badge ? (
          <div className="flex items-center gap-1.5 rounded-full border border-white/14 bg-black/40 px-3 py-1.5 backdrop-blur-md">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#60A5FA]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">{listing.badge}</span>
          </div>
        ) : <div />}
        <button
          onClick={(e) => { e.preventDefault(); toggleSaved(listing.id); }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-black/40 backdrop-blur-md transition hover:border-white/30 active:scale-90"
          aria-label={saved ? "Aus Merkliste entfernen" : "Auf Merkliste"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke="white" strokeWidth="1.8">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">
          {listing.category} · Featured
        </p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] sm:text-[34px] font-semibold leading-[0.9] tracking-[-0.055em] text-white">
              {listing.title}
            </h2>
            {listing.latin && (
              <p className="mt-1.5 text-[13px] italic text-white/46">{listing.latin}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.04em] text-white">
              {listing.currency} {listing.price.toLocaleString("de-CH")}
            </p>
            <p className="mt-0.5 text-[12px] text-white/38">{listing.location}</p>
          </div>
        </div>

        <p className="mt-3 max-w-[300px] text-[13px] leading-[1.55] text-white/58">
          {listing.subtitle}
        </p>

        {/* Seller row */}
        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3.5">
          <img src={listing.seller.avatar} alt={listing.seller.name} className="h-6 w-6 rounded-full object-cover ring-1 ring-white/16" />
          <span className="text-[12px] font-medium text-white/52">{listing.seller.name}</span>
          {listing.seller.verified && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <div className="ml-auto flex items-center gap-3 text-[12px] text-white/32">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>
              {listing.views}
            </span>
            <span className="flex items-center gap-1">Vor {listing.postedAt}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
