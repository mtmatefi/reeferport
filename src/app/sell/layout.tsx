import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inserat erstellen | Gesellschaftsbecken",
  description:
    "Inseriere deine Korallen, Fische oder Aquarium-Equipment kostenlos auf Gesellschaftsbecken – dem Schweizer Meerwasser-Marktplatz. Mit KI-Assistent: Einfach Foto hochladen und alles wird automatisch erkannt.",
  keywords: ["Korallen verkaufen", "Meerwasserfisch inserieren", "Aquarium Equipment verkaufen", "Koralle Frag verkaufen CH"],
  openGraph: {
    title: "Inserat erstellen – Gesellschaftsbecken",
    description: "Foto hochladen → KI erkennt dein Tier → Inserat in 60 Sekunden.",
    url: "https://gesellschaftsbecken.ch/sell",
  },
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children;
}
