"use client";
import { use, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listings } from "@/lib/data";
import { useStore } from "@/lib/store";
import { notFound } from "next/navigation";

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = listings.find((l) => l.id === id);
  if (!listing) notFound();

  const router = useRouter();
  const { isSaved, toggleSaved, startConversation } = useStore();
  const saved = isSaved(listing.id);

  const [imgIdx, setImgIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [msgText, setMsgText] = useState(`Hallo, ich interessiere mich für "${listing.title}". Ist es noch verfügbar?`);
  const [sent, setSent] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!msgText.trim()) return;
    const convId = startConversation(listing.id, listing.title, listing.seller.name, listing.seller.avatar);
    // Navigate to inbox conversation
    setSent(true);
    setTimeout(() => {
      setShowModal(false);
      router.push(`/inbox?conv=${convId}`);
    }, 1200);
  };

  const related = listings.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 3);

  return (
    <div>
      {/* Top bar – sits below the global TopBar */}
      <div className="sticky top-12 z-20 flex items-center gap-3 border-b border-white/7 glass px-4 sm:px-6 lg:px-8 py-3">
        <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:border-white/22">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-white/65">{listing.title}</p>
        </div>
        <button
          onClick={() => toggleSaved(listing.id)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:border-white/22 active:scale-90"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke={saved ? "white" : "rgba(255,255,255,0.55)"} strokeWidth="1.8">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (navigator.share) navigator.share({ title: listing.title, url: window.location.href });
            else navigator.clipboard.writeText(window.location.href);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:border-white/22"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Two-column on lg */}
      <div className="lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]">

        {/* ── Left: Images – sticky on desktop ────────────── */}
        <div className="lg:sticky lg:top-[96px] lg:self-start lg:border-r lg:border-white/7">
          {/* Main image */}
          <div className="relative bg-[#060D13] overflow-hidden cursor-zoom-in"
            onClick={() => { if (listing.images.length > 1) setImgIdx((i) => (i + 1) % listing.images.length); }}>
            <img
              src={listing.images[imgIdx] ?? listing.image}
              alt={listing.title}
              className="h-[280px] sm:h-[380px] lg:h-[520px] w-full object-cover transition-opacity duration-300"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03070A]/50 via-transparent to-transparent pointer-events-none" />
            {listing.images.length > 1 && (
              <div className="absolute bottom-3 right-3 rounded-full glass border border-white/12 px-2.5 py-1 text-[11px] text-white/60">
                {imgIdx + 1} / {listing.images.length}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto bg-[#03070A] px-4 sm:px-6 py-3 no-scrollbar">
              {listing.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`h-14 w-14 shrink-0 overflow-hidden border-2 transition-all ${i === imgIdx ? "border-white/55" : "border-transparent opacity-40 hover:opacity-65"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Details ───────────────────────────────── */}
        <div className="px-4 sm:px-6 lg:px-8 pb-32 lg:pb-8">
          {/* Badges */}
          <div className="mt-5 mb-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] text-white/46">{listing.category}</span>
            <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] text-white/46">{listing.condition}</span>
            {listing.listingType === "B2C" && (
              <span className="tag-blue rounded-full px-2.5 py-1 text-[11px]">Händler</span>
            )}
            {listing.badge && (
              <span className="rounded-full border border-white/14 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-white/58">{listing.badge}</span>
            )}
          </div>

          {/* Title + Price */}
          <div className="flex items-start gap-4 justify-between">
            <div>
              <h1 className="text-[26px] sm:text-[28px] font-semibold leading-[0.94] tracking-[-0.05em]">{listing.title}</h1>
              {listing.latin && <p className="mt-1.5 text-[13px] italic text-white/40">{listing.latin}</p>}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[26px] font-semibold tracking-[-0.045em]">
                {listing.currency} {listing.price.toLocaleString("de-CH")}
              </p>
              {listing.shipping && listing.shippingCost && (
                <p className="text-[12px] text-white/34">+ {listing.currency} {listing.shippingCost} Versand</p>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-white/36">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.7"/></svg>
              {listing.location}
            </span>
            <span>·</span>
            <span>Vor {listing.postedAt}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/></svg>
              {listing.views} Aufrufe
            </span>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {listing.tags.map((t) => (
              <Link key={t} href={`/search?q=${t}`}
                className="rounded-full border border-white/8 px-2.5 py-1 text-[12px] text-white/40 transition hover:border-white/18 hover:text-white/62">
                #{t}
              </Link>
            ))}
          </div>

          {/* CTA – desktop inline */}
          <div className="mt-6 hidden lg:flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-white py-3.5 text-[14px] font-semibold text-black transition hover:bg-white/92 active:scale-[0.98]"
              style={{ boxShadow: "0 8px 24px rgba(255,255,255,0.12)" }}
            >
              Verkäufer kontaktieren
            </button>
            <button
              onClick={() => toggleSaved(listing.id)}
              className={`flex h-[50px] w-[50px] items-center justify-center border transition hover:border-white/28 ${saved ? "border-white/36 bg-white/8" : "border-white/12"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke={saved ? "white" : "rgba(255,255,255,0.55)"} strokeWidth="1.8">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 border-t border-white/7" />

          {/* Description */}
          <div className="mt-5">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">Beschreibung</h2>
            <p className="text-[14px] sm:text-[15px] leading-[1.7] text-white/64">{listing.description}</p>
          </div>

          {/* Delivery */}
          <div className="mt-6 border-t border-white/7 pt-5">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">Übergabe</h2>
            <div className="flex flex-wrap gap-2">
              {listing.pickup && (
                <div className="flex items-center gap-2 rounded-full border border-white/9 px-3 py-2 text-[13px] text-white/52">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.7"/></svg>
                  Abholung in {listing.location}
                </div>
              )}
              {listing.shipping && (
                <div className="flex items-center gap-2 rounded-full border border-white/9 px-3 py-2 text-[13px] text-white/52">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="1" y="3" width="15" height="13" rx="1" stroke="currentColor" strokeWidth="1.7"/><path d="M16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="1.7"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                  Versand {listing.currency} {listing.shippingCost}
                </div>
              )}
            </div>
          </div>

          {/* Seller */}
          <div className="mt-6 border-t border-white/7 pt-5">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">Verkäufer</h2>
            <Link href="/profile" className="group flex items-center gap-3">
              <img src={listing.seller.avatar} alt={listing.seller.name} className="h-11 w-11 rounded-full object-cover ring-1 ring-white/12" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-semibold text-white/90 group-hover:text-white transition">{listing.seller.name}</span>
                  {listing.seller.verified && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <p className="text-[12px] text-white/36">
                  {listing.seller.type} · ★ {listing.seller.rating} ({listing.seller.reviewCount}) · seit {listing.seller.memberSince}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-auto text-white/20 group-hover:text-white/40 transition">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { v: `${listing.seller.salesCount}+`, l: "Verkäufe" },
                { v: `★ ${listing.seller.rating}`,    l: "Bewertung" },
                { v: `${listing.seller.reviewCount}`,  l: "Reviews" },
              ].map((s) => (
                <div key={s.l} className="border border-white/7 py-3 text-center">
                  <p className="text-[16px] font-semibold tracking-[-0.03em]">{s.v}</p>
                  <p className="mt-0.5 text-[10px] text-white/32">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related listings */}
          {related.length > 0 && (
            <div className="mt-6 border-t border-white/7 pt-5 pb-4">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">Ähnliche Inserate</h2>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/listing/${r.id}`} className="group flex items-center gap-3 hover:opacity-80 transition">
                    <img src={r.image} alt={r.title} className="h-12 w-12 object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-white/80 group-hover:text-white transition">{r.title}</p>
                      <p className="text-[12px] text-white/36">{r.currency} {r.price} · {r.location}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-auto shrink-0 text-white/20">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky CTA (mobile/tablet) ───────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-20 glass border-t border-white/7 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] lg:hidden">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-white py-3.5 text-[14px] font-semibold text-black transition hover:bg-white/92 active:scale-[0.98]"
            style={{ boxShadow: "0 8px 24px rgba(255,255,255,0.12)" }}
          >
            Verkäufer kontaktieren
          </button>
          <button
            onClick={() => toggleSaved(listing.id)}
            className={`flex h-[50px] w-[50px] items-center justify-center border transition ${saved ? "border-white/36 bg-white/8" : "border-white/12 hover:border-white/24"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke={saved ? "white" : "rgba(255,255,255,0.55)"} strokeWidth="1.8">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Contact modal ────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm px-4 fade-in"
          onClick={() => !sent && setShowModal(false)}>
          <div
            className="w-full max-w-lg border border-white/10 bg-[#080F17] p-6 pb-8 sm:pb-6 rounded-t-2xl sm:rounded-2xl slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {sent ? (
              <div className="py-4 text-center scale-in">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-semibold">Nachricht gesendet!</h3>
                <p className="mt-1 text-[14px] text-white/42">Du wirst weitergeleitet…</p>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/16 sm:hidden" />
                <div className="mb-4 flex items-center gap-3">
                  <img src={listing.seller.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-[14px] font-semibold">{listing.seller.name}</p>
                    <p className="text-[12px] text-white/38">antwortet meist innerhalb 2h</p>
                  </div>
                </div>
                <textarea
                  ref={textRef}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  rows={4}
                  className="w-full resize-none border border-white/10 bg-white/4 p-3.5 text-[14px] leading-relaxed text-white/82 placeholder-white/28 focus:border-white/24 focus:outline-none transition"
                  onClick={(e) => { e.currentTarget.select(); }}
                />
                <div className="mt-3 flex gap-2.5">
                  <button onClick={() => setShowModal(false)} className="flex-1 border border-white/10 py-3 text-[14px] font-medium text-white/46 transition hover:border-white/22 hover:text-white/70">
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!msgText.trim()}
                    className="flex-1 bg-white py-3 text-[14px] font-semibold text-black transition hover:bg-white/92 active:scale-[0.98] disabled:opacity-40"
                  >
                    Senden
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
