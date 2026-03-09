"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const nav = [
  { label: "Home",   href: "/",        d: "M3 12L12 3L21 12V21H15V15H9V21H3V12Z" },
  { label: "Suche",  href: "/search",  d: "M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" },
  { label: "",       href: "/sell",    sell: true },
  { label: "Chat",   href: "/inbox",   d: "M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" },
  { label: "Profil", href: "/profile", d: "M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totalUnread } = useStore();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 glass border-t border-white/7"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="grid grid-cols-5 px-1 pt-2 pb-2">
        {nav.map((item) => {
          if (item.sell) {
            return (
              <Link key="sell" href="/sell" className="flex justify-center py-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8724A] shadow-[0_6px_20px_rgba(232,114,74,0.35)] transition active:scale-95">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
              </Link>
            );
          }
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href!);
          const isInbox = item.href === "/inbox";
          return (
            <Link key={item.href} href={item.href!} className="flex flex-col items-center gap-1 py-1 transition active:scale-95">
              <div className="relative">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d={item.d} stroke={active ? "white" : "rgba(255,255,255,0.34)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill={active ? "rgba(255,255,255,0.08)" : "none"} />
                </svg>
                {isInbox && totalUnread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E8724A] px-1 text-[9px] font-semibold text-white">
                    {totalUnread}
                  </span>
                )}
              </div>
              {item.label && (
                <span className={`text-[10px] font-medium ${active ? "text-white" : "text-white/30"}`}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
