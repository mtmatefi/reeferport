"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Discover",
    href: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Suche",
    href: "/search",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Inserieren",
    href: "/sell",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    highlight: true,
  },
  {
    label: "Nachrichten",
    href: "/inbox",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    badge: 3,
  },
  {
    label: "Profil",
    href: "/profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-30 border-r border-white/8 bg-[rgba(3,7,10,0.96)] backdrop-blur-xl"
      style={{ width: "var(--sidebar-w, 240px)" }}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/6">
        <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/30 mb-1.5">Reef Market</p>
        <h1 className="text-[22px] font-semibold tracking-[-0.05em] leading-tight text-white/95">
          ReefPort
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-150",
                item.highlight
                  ? "bg-white text-black hover:bg-white/90 mt-3"
                  : active
                  ? "bg-white/10 text-white"
                  : "text-white/46 hover:text-white/80 hover:bg-white/5",
              ].join(" ")}
            >
              <span className={item.highlight ? "text-black" : active ? "text-white" : "text-white/46"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#60A5FA] text-[10px] font-semibold text-black">
                  {item.badge}
                </span>
              )}
              {active && !item.highlight && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/60 rounded-r" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/6 px-4 py-4">
        <Link href="/profile" className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition">
          <img src="https://i.pravatar.cc/150?img=47" alt="Profil" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/16" />
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-white/86 truncate">Mein Profil</div>
            <div className="text-[11px] text-white/36 truncate">CoralHaus Luzern</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
