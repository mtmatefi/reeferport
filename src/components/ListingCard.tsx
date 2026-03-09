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
    <article className="group relative border-b border-white/6 pb-5 last:border-0">
      <Link href={`/listing/${listing.id}`} className="grid grid-cols-[1fr_auto] gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/28">
              0{index + 1}
            </span>
            {listing.badge && (
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/52">
                {listing.badge}
              </span>
            )}
          </div>
          <h4 className="truncate text-[20px] font-semibold leading-tight tracking-[-0.04em] text-white/96">
            {listing.title}
          </h4>
          <p className="mt-0.5 truncate text-[13px] italic text-white/42">
            {listing.latin}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/6 px-2 py-0.5 text-[11px] text-white/46">
              {listing.category}
            </span>
            <span className="rounded-full bg-white/6 px-2 py-0.5 text-[11px] text-white/46">
              {listing.condition}
            </span>
            {listing.listingType === "B2C" && (
              <span className="rounded-full bg-[rgba(96,165,250,0.10)] px-2 py-0.5 text-[11px] text-[#93C5FD]">
                Händler
              </span>
            )}
          </div>
          <p className="mt-3 max-w-[210px] text-[13px] leading-[1.45] text-white/54">
            {listing.subtitle}
          </p>
          <div className="mt-4 flex items-end justify-between pr-1">
            <div>
              <div className="text-[18px] font-semibold tracking-[-0.03em]">
                {listing.currency} {listing.price.toLocaleString("de-CH")}
              </div>
              <div className="mt-0.5 text-[12px] text-white/36">
                {listing.location} · {listing.postedAt}
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-[130px] w-[100px] shrink-0 overflow-hidden bg-black">
          <img
            src={listing.image}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          setSaved((s) => !s);
        }}
        className="absolute bottom-[22px] right-[108px] p-1"
        aria-label={saved ? "Aus Merkliste entfernen" : "Auf Merkliste setzen"}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={saved ? "white" : "none"}
          stroke={saved ? "white" : "rgba(255,255,255,0.36)"}
          strokeWidth="1.6"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
        </svg>
      </button>
    </article>
  );
}
