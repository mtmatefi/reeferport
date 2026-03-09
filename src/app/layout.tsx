import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

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
        <div className="relative mx-auto min-h-screen max-w-sm overflow-hidden bg-[#03070A]">
          {/* Ambient background gradients */}
          <div
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              background: [
                "radial-gradient(circle at 50% -10%, rgba(96,165,250,0.18) 0%, transparent 34%)",
                "radial-gradient(circle at 85% 20%, rgba(20,184,166,0.10) 0%, transparent 30%)",
                "radial-gradient(circle at 10% 75%, rgba(59,130,246,0.08) 0%, transparent 28%)",
              ].join(","),
            }}
          />

          {/* Page content */}
          <div className="relative z-10 min-h-screen">
            {children}
          </div>

          {/* Global bottom nav */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
