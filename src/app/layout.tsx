import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ReefPort – Meerwasser Marktplatz Schweiz",
  description:
    "Kaufe und verkaufe Meerwasserkorallen, Fische und Equipment in der Schweiz. B2C und C2C Marktplatz für Aquaristik-Enthusiasten.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-[#03070A] text-white antialiased">
        {/* Ambient background */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: [
              "radial-gradient(circle at 50% -10%, rgba(96,165,250,0.16) 0%, transparent 40%)",
              "radial-gradient(circle at 85% 20%, rgba(20,184,166,0.09) 0%, transparent 35%)",
              "radial-gradient(circle at 10% 75%, rgba(59,130,246,0.07) 0%, transparent 30%)",
            ].join(","),
          }}
        />

        {/* Sidebar – md+ */}
        <Sidebar />

        {/*
          Layout:
          - mobile:  full width, no left offset
          - md+:     offset by sidebar width (240px)
          - content is centered with max-w on desktop
        */}
        <div className="relative z-10 md:pl-[240px]">
          <main className="mx-auto min-h-screen w-full max-w-5xl pb-20 md:pb-0">
            {children}
          </main>
        </div>

        {/* Bottom nav – mobile only */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
