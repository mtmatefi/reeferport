"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { CoralIcon } from "@/components/Logo";

const NAV = [
  { label: "Entdecken",   href: "/",        icon: "M3 12L12 3L21 12V21H15V15H9V21H3V12Z" },
  { label: "Suche",       href: "/search",  icon: "M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" },
  { label: "Nachrichten", href: "/inbox",   icon: "M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" },
  { label: "ReefAlliance", href: "/shop/s6", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", official: true },
  { label: "Profil",      href: "/profile", icon: "M20 21V19a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalUnread, session } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-30 transition-all duration-300",
        scrolled
          ? "border-b border-white/8 bg-[rgba(3,7,10,0.92)] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex w-full max-w-6xl items-center px-4 transition-all duration-300",
          scrolled ? "h-12" : "h-16",
        ].join(" ")}
      >
        {/* Logo */}
        <Link href="/" className="group mr-5 flex items-center gap-2 shrink-0">
          <CoralIcon size={scrolled ? 26 : 32} className="transition-all duration-300" />
          <span
            className={[
              "font-semibold tracking-[-0.04em] text-white/94 transition-all duration-300 hidden sm:block",
              scrolled ? "text-[14px]" : "text-[17px]",
            ].join(" ")}
          >
            Gesellschaftsbecken
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const isInbox = item.href === "/inbox";
            const isOfficial = item.official;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-medium transition-all duration-150",
                  active
                    ? isOfficial
                      ? "bg-[rgba(45,212,191,0.12)] text-[#5EEAD4]"
                      : "bg-white/9 text-white"
                    : isOfficial
                    ? "text-[#5EEAD4]/55 hover:bg-[rgba(45,212,191,0.07)] hover:text-[#5EEAD4]/80"
                    : "text-white/45 hover:text-white/80 hover:bg-white/5",
                ].join(" ")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d={item.icon} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{item.label}</span>
                {isOfficial && (
                  <span className="rounded-full border border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.08)] px-1 py-px text-[8px] font-semibold uppercase tracking-[0.12em] text-[#5EEAD4]/70">
                    Shop
                  </span>
                )}
                {isInbox && totalUnread > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#60A5FA] px-1 text-[9px] font-semibold text-black">
                    {totalUnread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Suchen…"
                className="w-40 rounded-xl border border-white/12 bg-white/6 px-3 py-1.5 text-[13px] text-white placeholder-white/30 outline-none focus:border-blue-400/40 focus:w-56 transition-all duration-200"
              />
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white/40 transition hover:bg-white/6 hover:text-white/80"
              aria-label="Suche öffnen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {/* Inserieren CTA */}
          <Link
            href="/sell"
            className={[
              "hidden md:flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-300",
              scrolled
                ? "bg-white text-black hover:bg-white/90 shadow-[0_4px_16px_rgba(255,255,255,0.10)]"
                : "bg-white text-black hover:bg-white/90 shadow-[0_4px_20px_rgba(255,255,255,0.12)]",
              "active:scale-[0.97]",
            ].join(" ")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Inserieren
          </Link>

          {/* Profile avatar (small) */}
          <Link href="/profile" className="relative hidden md:block">
            <img
              src={session?.avatar ?? "https://i.pravatar.cc/150?img=47"}
              alt={session?.name ?? "Profil"}
              className={[
                "rounded-full object-cover ring-1 ring-white/14 transition-all duration-300",
                scrolled ? "h-7 w-7" : "h-8 w-8",
              ].join(" ")}
            />
            {session && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#22C55E] ring-1 ring-[#03070A]" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
