"use client";
import Link from "next/link";
import { useState } from "react";
import { type Listing } from "@/lib/data";

interface Props {
  listing: Listing;
}

export default function HeroCard({ listing }: Props) {
  const [saved, setSaved] = useState(listing.saved);

  return (
    <section className="mb-7">
      <Link href={`/listing/${listing.id}`} className="group relative block overflow-hidden bg-black">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-[440px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.08)_30%,rgba(0,0,0,0.86))]" />

        {/* Top row */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          {listing.badge && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#60A5FA]" />
              {listing.badge}
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            className="ml-auto rounded-full bg-black/30 p-2 backdrop-blur-sm"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={saved ? "white" : "none"}
              stroke={saved ? "white" : "rgba(255,255,255,0.7)"}
              strokeWidth="1.8"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1.5 text-[11px] uppercase tracking-[0.24em] text-white/38">
                Diese Woche · {listing.category}
              </p>
              <h2 className="text-[32px] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
                {listing.title}
              </h2>
              <p className="mt-1 text-[13px] italic text-white/50">{listing.latin}</p>
            </div>
            <div className="shrink-0 pb-1 text-right">
              <div className="text-[26px] font-semibold tracking-[-0.04em]">
                {listing.currency} {listing.price}
              </div>
              <div className="mt-0.5 text-[12px] text-white/40">{listing.location}</div>
            </div>
          </div>

          <p className="max-w-[260px] text-[13px] leading-[1.5] text-white/62">
            {listing.subtitle}
          </p>

          {/* Seller badge */}
          <div className="mt-4 flex items-center gap-2">
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
            />
            <span className="text-[12px] text-white/52">
              {listing.seller.name}
            </span>
            {listing.seller.verified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#60A5FA"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span className="ml-auto flex items-center gap-1 text-[12px] text-white/38">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              {listing.views}
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
