"use client";
import Link from "next/link";
import { useState } from "react";
import { type Listing } from "@/lib/data";

interface Props {
  listing: Listing;
  index: number;
}

export default function ListingCard({ listing, index }: Props) {
  const [saved, setSaved] = useState(listing.saved);

  return (
    <article className="group relative border-b border-white/6 pb-5 pt-1 last:border-0">
      <Link href={`/listing/${listing.id}`} className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative h-[120px] w-[90px] sm:h-[130px] sm:w-[100px] shrink-0 overflow-hidden bg-black">
          <img
            src={listing.image}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/28">
              0{index}
            </span>
            {listing.badge && (
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/48">
                {listing.badge}
              </span>
            )}
          </div>
          <h4 className="truncate text-[18px] sm:text-[20px] font-semibold leading-tight tracking-[-0.04em] text-white/96">
            {listing.title}
          </h4>
          <p className="mt-0.5 truncate text-[12px] italic text-white/40">
            {listing.latin}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] text-white/44">
              {listing.category}
            </span>
            <span className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] text-white/44">
              {listing.condition}
            </span>
            {listing.listingType === "B2C" && (
              <span className="rounded-full bg-[rgba(96,165,250,0.10)] px-2 py-0.5 text-[10px] text-[#93C5FD]">
                Händler
              </span>
            )}
          </div>

          <p className="mt-2 line-clamp-2 text-[13px] leading-[1.45] text-white/52">
            {listing.subtitle}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-[17px] font-semibold tracking-[-0.03em]">
                {listing.currency} {listing.price.toLocaleString("de-CH")}
              </div>
              <div className="text-[11px] text-white/34">
                {listing.location} · {listing.postedAt}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSaved((s) => !s);
                }}
                className="p-1"
                aria-label={saved ? "Merkliste entfernen" : "Merkliste"}
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill={saved ? "white" : "none"}
                  stroke={saved ? "white" : "rgba(255,255,255,0.34)"}
                  strokeWidth="1.6"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="hidden sm:block text-[13px] font-medium text-white/50 transition group-hover:text-white">
                Ansehen →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
