"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
          stroke={active ? "white" : "rgba(255,255,255,0.35)"}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill={active ? "rgba(255,255,255,0.10)" : "none"}
        />
      </svg>
    ),
  },
  {
    label: "Suche",
    href: "/search",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="11"
          cy="11"
          r="7"
          stroke={active ? "white" : "rgba(255,255,255,0.35)"}
          strokeWidth="1.6"
        />
        <path
          d="M16.5 16.5L21 21"
          stroke={active ? "white" : "rgba(255,255,255,0.35)"}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Inserieren",
    href: "/sell",
    icon: (_active: boolean) => (
      <div className="relative flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(255,255,255,0.18)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5V19M5 12H19"
            stroke="#03070A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
  },
  {
    label: "Nachrichten",
    href: "/inbox",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
          stroke={active ? "white" : "rgba(255,255,255,0.35)"}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    badge: 3,
  },
  {
    label: "Profil",
    href: "/profile",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="8"
          r="4"
          stroke={active ? "white" : "rgba(255,255,255,0.35)"}
          strokeWidth="1.6"
        />
        <path
          d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20"
          stroke={active ? "white" : "rgba(255,255,255,0.35)"}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/8 bg-[rgba(3,7,10,0.92)] backdrop-blur-xl">
      <div className="grid grid-cols-5 px-2 py-2 pb-4">
        {navItems.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center gap-1 py-1"
            >
              <div className="relative">
                {item.icon(active)}
                {item.badge && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#60A5FA] text-[9px] font-semibold text-black">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.href !== "/sell" && (
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    active ? "text-white" : "text-white/30"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
