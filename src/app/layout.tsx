import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "ReefPort – Meerwasser Marktplatz Schweiz",
  description: "Kaufe und verkaufe Meerwasserkorallen, Fische und Equipment in der Schweiz.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-[#03070A] text-white antialiased">
        <StoreProvider>
          {/* Ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              background: [
                "radial-gradient(ellipse 80% 50% at 50% -15%, rgba(96,165,250,0.13) 0%, transparent 60%)",
                "radial-gradient(ellipse 50% 40% at 90% 15%, rgba(45,212,191,0.07) 0%, transparent 55%)",
                "radial-gradient(ellipse 40% 35% at 5% 80%,  rgba(59,130,246,0.06) 0%, transparent 50%)",
              ].join(","),
            }}
          />

          {/* Sidebar – tablet & desktop */}
          <Sidebar />

          {/* Main content area */}
          <div className="relative z-10 md:pl-[248px]">
            <main className="mx-auto min-h-screen w-full max-w-6xl pb-[72px] md:pb-6">
              {children}
            </main>
          </div>

          {/* Bottom nav – mobile only */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
