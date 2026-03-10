"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import { useStore } from "@/lib/store";

const TABS = ["Inserate", "Gespeichert", "Bewertungen", "Info"] as const;
type Tab = (typeof TABS)[number];

const REVIEWS = [
  { id: 1, name: "Marc S.",   avatar: "https://i.pravatar.cc/150?img=18", rating: 5, text: "Super Transaktion! Koralle war genau wie beschrieben. Sehr professionell und zuverlässig.", date: "Feb 2026", item: "Acropora Millepora Frag" },
  { id: 2, name: "Nina B.",   avatar: "https://i.pravatar.cc/150?img=26", rating: 5, text: "Professionelle Verpackung, schnelle Antwort. Top Händler, gerne wieder!", date: "Jan 2026", item: "Ultra Zoanthus Colony" },
  { id: 3, name: "Thomas K.", avatar: "https://i.pravatar.cc/150?img=8",  rating: 4, text: "Sehr gute Qualität. Kleine Verzögerung bei der Antwort, aber alles vollständig und korrekt.", date: "Dez 2025", item: "Mandarin Dragonet Paar" },
  { id: 4, name: "Sarah M.",  avatar: "https://i.pravatar.cc/150?img=31", rating: 5, text: "Absolut top! Fisch kam gesund an, Kommunikation war einwandfrei. Empfehle ich sehr!", date: "Nov 2025", item: "Oman Clown Pair" },
];

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= rating ? "rgba(255,255,255,0.75)" : "none"}
          stroke={s <= rating ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)"}
          strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

interface FullProfile {
  id: string; name: string; email: string; avatar: string;
  type: string; location: string; verified: boolean;
  rating: number; reviewCount: number; memberSince: string;
  salesCount: number; bio: string;
}

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("Inserate");
  const { session, sessionLoading, savedIds } = useStore();

  const [profile, setProfile]   = useState<FullProfile | null>(null);
  const [myListings, setMyListings] = useState<Record<string, unknown>[]>([]);
  const [savedListings, setSavedListings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session) { setLoading(false); return; }

    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch(`/api/listings?seller=${session.id}`).then((r) => r.json()),
    ]).then(([meData, listingsData]) => {
      if (meData.user) setProfile(meData.user);
      setMyListings(Array.isArray(listingsData) ? listingsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [session, sessionLoading]);

  useEffect(() => {
    if (!session || savedIds.size === 0) { setSavedListings([]); return; }
    fetch("/api/listings").then((r) => r.json()).then((all) => {
      if (Array.isArray(all)) {
        setSavedListings(all.filter((l: Record<string, unknown>) => savedIds.has(l.id as string)));
      }
    }).catch(() => {});
  }, [session, savedIds]);

  if (sessionLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-[#E8724A] animate-spin" />
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <p className="text-[16px] font-medium">Bitte melde dich an</p>
        <p className="text-[13px] text-white/40">Du musst eingeloggt sein, um dein Profil zu sehen.</p>
        <Link href="/" className="btn-coral px-5 py-2 text-[13px] font-semibold mt-2">Zur Startseite</Link>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8">
      {/* Banner */}
      <div className="relative h-32 overflow-hidden bg-[#06111C]">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 120% 200% at 30% 50%, rgba(232,114,74,0.18) 0%, rgba(45,212,191,0.10) 50%, transparent 70%)"
        }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(3,7,10,0.8)_100%)]" />
      </div>

      {/* Profile header */}
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Avatar */}
        <div className="-mt-10 mb-4">
          <div className="relative inline-block">
            <img src={profile.avatar} alt={profile.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-[#03070A]" />
            {profile.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-[#03070A] p-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mb-1 flex items-center gap-2.5 flex-wrap">
          <h1 className="text-[22px] font-semibold tracking-[-0.04em]">{profile.name}</h1>
          <span className="tag-coral">{profile.type}</span>
          {profile.verified && <span className="tag-teal">Verifiziert</span>}
        </div>
        <p className="text-[14px] text-white/38">{profile.location} · Mitglied seit {profile.memberSince}</p>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-4 border border-[rgba(45,200,190,0.09)] divide-x divide-[rgba(45,200,190,0.09)] rounded-xl overflow-hidden">
          {[
            { v: profile.salesCount > 0 ? `${profile.salesCount}+` : "–", l: "Verkäufe" },
            { v: profile.rating > 0 ? `★ ${profile.rating}` : "–",       l: "Bewertung" },
            { v: profile.reviewCount > 0 ? profile.reviewCount : "–",     l: "Reviews" },
            { v: savedIds.size,                                            l: "Gespeichert" },
          ].map((s) => (
            <div key={s.l} className="py-3.5 text-center">
              <p className="text-[18px] font-semibold tracking-[-0.04em]">{s.v}</p>
              <p className="mt-0.5 text-[10px] text-white/32">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-5 border-b border-white/7 no-scrollbar overflow-x-auto">
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`relative shrink-0 pb-3 text-[14px] font-medium tracking-[-0.02em] transition-colors ${active ? "text-white" : "text-white/32 hover:text-white/62"}`}>
                {t}
                {active && <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#E8724A] rounded-t-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 sm:px-6 lg:px-8 pt-5">
        {tab === "Inserate" && (
          myListings.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[14px] text-white/36">Noch keine Inserate</p>
              <Link href="/sell" className="mt-3 inline-block text-[13px] text-[#E8724A] underline underline-offset-2">Jetzt inserieren</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-6 stagger">
              {myListings.map((item, i) => <ListingCard key={item.id as string} listing={item as unknown as Parameters<typeof ListingCard>[0]["listing"]} rank={i + 1} />)}
            </div>
          )
        )}

        {tab === "Gespeichert" && (
          savedListings.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[14px] text-white/36">Noch nichts gespeichert</p>
              <Link href="/" className="mt-3 inline-block text-[13px] text-white/40 underline underline-offset-2">Inserate entdecken</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-6 stagger">
              {savedListings.map((item, i) => <ListingCard key={item.id as string} listing={item as unknown as Parameters<typeof ListingCard>[0]["listing"]} rank={i + 1} />)}
            </div>
          )
        )}

        {tab === "Bewertungen" && (
          profile.reviewCount === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[14px] text-white/36">Noch keine Bewertungen</p>
            </div>
          ) : (
            <div className="fade-up">
              {/* Summary */}
              <div className="mb-6 flex items-center gap-6 border border-[rgba(45,200,190,0.09)] p-5 rounded-xl">
                <div className="text-center">
                  <p className="text-[44px] font-semibold tracking-[-0.06em] leading-none">{profile.rating}</p>
                  <div className="mt-2 flex justify-center"><Stars rating={Math.round(profile.rating)} size={14} /></div>
                  <p className="mt-1.5 text-[12px] text-white/32">{profile.reviewCount} Bewertungen</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map((s) => {
                    const count = REVIEWS.filter((r) => r.rating === s).length;
                    const pct = Math.round((count / REVIEWS.length) * 100);
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="w-3 text-right text-[11px] text-white/30">{s}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/7 overflow-hidden">
                          <div className="h-full rounded-full bg-[#E8724A] transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-7 text-[11px] text-white/26">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-4 stagger">
                {REVIEWS.map((r) => (
                  <div key={r.id} className="border-b border-[rgba(45,200,190,0.07)] pb-5 last:border-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <img src={r.avatar} alt={r.name} className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <p className="text-[14px] font-medium">{r.name}</p>
                          <p className="text-[11px] text-white/30">{r.date}</p>
                        </div>
                      </div>
                      <Stars rating={r.rating} size={12} />
                    </div>
                    <p className="text-[14px] leading-relaxed text-white/62">{r.text}</p>
                    <p className="mt-1.5 text-[12px] text-white/28">Für: {r.item}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {tab === "Info" && (
          <div className="space-y-4 fade-up max-w-2xl">
            <div className="border border-[rgba(45,200,190,0.09)] p-5 rounded-xl">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/28">Über den Verkäufer</h3>
              <p className="text-[14px] leading-[1.7] text-white/60">
                {profile.bio || "Noch keine Beschreibung vorhanden."}
              </p>
            </div>
            <div className="border border-[rgba(45,200,190,0.09)] p-5 space-y-3 rounded-xl">
              <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/28">Details</h3>
              {[
                { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 10a3 3 0 110 0z", label: `Standort: ${profile.location}` },
                { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: `Mitglied seit: ${profile.memberSince}` },
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: profile.email },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-[14px] text-white/56">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/28">
                    <path d={item.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
