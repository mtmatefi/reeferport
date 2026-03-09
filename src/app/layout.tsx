import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  metadataBase: new URL("https://gesellschaftsbecken.ch"),
  title: {
    default: "Gesellschaftsbecken – Meerwasser Marktplatz Schweiz",
    template: "%s | Gesellschaftsbecken",
  },
  description:
    "Der führende Schweizer Marktplatz für Meerwasseraquaristik. Kaufe und verkaufe Korallen (LPS, SPS, Zoanthus), Meerwasserfische, Wirbellose und Aquarium-Equipment. B2C & C2C · Versand CH.",
  keywords: [
    "Meerwasser Marktplatz Schweiz", "Korallen kaufen Schweiz", "Korallen verkaufen",
    "LPS Korallen", "SPS Korallen", "Zoanthus", "Meerwasserfische", "Aquarium Equipment",
    "Clownfisch", "Acropora", "Euphyllia", "Tridacna", "Frag", "Nachzucht",
  ],
  authors: [{ name: "Gesellschaftsbecken" }],
  creator: "Gesellschaftsbecken",
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "https://gesellschaftsbecken.ch",
    siteName: "Gesellschaftsbecken",
    title: "Gesellschaftsbecken – Meerwasser Marktplatz Schweiz",
    description: "Kaufe & verkaufe Korallen, Fische und Equipment · B2C & C2C · Versand CH.",
  },
  twitter: { card: "summary_large_image", site: "@gesellschaftsbecken" },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gesellschaftsbecken.ch" },
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

          {/* Top bar – all screen sizes */}
          <TopBar />

          {/* Main content area */}
          <div className="relative z-10">
            <main className="mx-auto min-h-screen w-full max-w-6xl pt-20 pb-[72px] md:pb-6 px-0">
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
