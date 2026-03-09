"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const nav = [
  { label: "Entdecken",    href: "/",         icon: "M3 12L12 3L21 12V21H15V15H9V21H3V12Z" },
  { label: "Suche",        href: "/search",   icon: "M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" },
  { label: "Nachrichten",  href: "/inbox",    icon: "M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" },
  { label: "ReefAlliance", href: "/shop/s6",  icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10", official: true },
  { label: "Profil",       href: "/profile",  icon: "M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { totalUnread } = useStore();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-30 border-r border-white/7 glass" style={{ width: "248px" }}>

      {/* Brand */}
      <div className="px-6 pt-7 pb-6 border-b border-white/6">
        <Link href="/" className="block group">
          <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-white/28 mb-1 group-hover:text-white/40 transition-colors">
            Switzerland
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-semibold tracking-[-0.06em] text-white/94">ReefPort</span>
            <span className="text-[11px] font-medium text-white/26 tracking-wide">Beta</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const isInbox = item.href === "/inbox";
          const isOfficial = (item as { official?: boolean }).official;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150",
                active
                  ? isOfficial ? "bg-[rgba(45,212,191,0.10)] text-[#5EEAD4]" : "bg-white/9 text-white"
                  : isOfficial ? "text-[#5EEAD4]/60 hover:bg-[rgba(45,212,191,0.07)] hover:text-[#5EEAD4]/90" : "text-white/44 hover:text-white/78 hover:bg-white/5",
              ].join(" ")}
            >
              {active && (
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${isOfficial ? "bg-[#2DD4BF]" : "bg-white/70"}`} />
              )}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d={item.icon} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{item.label}</span>
              {isOfficial && !active && (
                <span className="ml-auto rounded-full border border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.08)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5EEAD4]/70">
                  Shop
                </span>
              )}
              {isInbox && totalUnread > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#60A5FA] px-1.5 text-[10px] font-semibold text-black">
                  {totalUnread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sell CTA */}
      <div className="px-4 pb-3">
        <Link
          href="/sell"
          className={[
            "flex items-center justify-center gap-2.5 w-full py-3 text-[14px] font-semibold transition-all duration-150",
            pathname === "/sell"
              ? "bg-white/90 text-black"
              : "bg-white text-black hover:bg-white/90 active:scale-[0.98]",
          ].join(" ")}
          style={{ boxShadow: "0 8px 24px rgba(255,255,255,0.10)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Inserieren
        </Link>
      </div>

      {/* User */}
      <div className="border-t border-white/6 px-3 py-3">
        <Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5 transition group">
          <div className="relative">
            <img src="https://i.pravatar.cc/150?img=47" alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/14" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#22C55E] ring-2 ring-[#03070A]" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white/86 truncate group-hover:text-white/96 transition">CoralHaus Luzern</p>
            <p className="text-[11px] text-white/32">Händler · Verifiziert</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-auto shrink-0 text-white/20">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
