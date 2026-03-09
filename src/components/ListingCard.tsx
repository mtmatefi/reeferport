"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { type Listing } from "@/lib/data";

interface Props { listing: Listing; rank?: number; }

export default function ListingCard({ listing, rank }: Props) {
  const { isSaved, toggleSaved } = useStore();
  const saved = isSaved(listing.id);

  return (
    <article className="group relative border-b border-[rgba(45,200,190,0.08)] py-5 last:border-0">
      {/* ── Bookmark – absolute top-right, outside Link ── */}
      <button
        onClick={() => toggleSaved(listing.id)}
        className="absolute right-0 top-5 z-10 p-2 transition-transform active:scale-85"
        aria-label={saved ? "Aus Merkliste entfernen" : "Merken"}
      >
        <svg
          width="17" height="17" viewBox="0 0 24 24"
          fill={saved ? "white" : "none"}
          stroke={saved ? "white" : "rgba(255,255,255,0.25)"}
          strokeWidth="1.7"
          className="transition-all duration-200"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Main link – right padding so title doesn't run into bookmark ── */}
      <Link href={`/listing/${listing.id}`} className="flex gap-4 pr-8">
        {/* Image */}
        <div className="relative h-[118px] w-[88px] sm:h-[128px] sm:w-[96px] shrink-0 overflow-hidden bg-[#0D2435] rounded-lg">
          <img
            src={listing.image}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          {listing.badge && (
            <span className="absolute bottom-1.5 left-1.5 block rounded-sm bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/70 backdrop-blur-sm">
              {listing.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Tags row */}
          <div className="mb-1.5 flex items-center gap-1.5 flex-wrap">
            {rank !== undefined && (
              <span className="text-[10px] font-medium tabular-nums text-white/20">
                {String(rank).padStart(2, "0")}
              </span>
            )}
            <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[10px] text-white/40">
              {listing.category}
            </span>
            {listing.listingType === "B2C" && (
              <span className="tag-coral">Händler</span>
            )}
            <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[10px] text-white/40">
              {listing.condition}
            </span>
          </div>

          {/* Title */}
          <h4 className="truncate text-[17px] sm:text-[18px] font-semibold leading-snug tracking-[-0.035em] text-white/95">
            {listing.title}
          </h4>
          {listing.latin && (
            <p className="mt-0.5 truncate text-[12px] italic text-white/36">{listing.latin}</p>
          )}

          {/* Subtitle */}
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.5] text-white/46">
            {listing.subtitle}
          </p>

          {/* Footer: price + "Ansehen" */}
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[16px] font-semibold tracking-[-0.03em] text-white/96">
                {listing.currency} {listing.price.toLocaleString("de-CH")}
              </p>
              <p className="text-[11px] text-white/30">
                {listing.location} · {listing.postedAt}
              </p>
            </div>
            {/* "Ansehen" on right – no overlap possible since pr-8 + no absolute */}
            <span className="hidden sm:inline shrink-0 text-[12px] font-medium text-white/24 transition-colors group-hover:text-white/62">
              Ansehen →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
