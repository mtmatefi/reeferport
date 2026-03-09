import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suche | ReefPort – Korallen, Fische & Equipment",
  description:
    "Durchsuche Hunderte Inserate: Korallen (LPS, SPS, Weichkorallen), Meerwasserfische, Wirbellose und Aquarium-Equipment aus der ganzen Schweiz.",
  keywords: ["Korallen kaufen", "Meerwasserfische Schweiz", "Aquarium Equipment", "Zoanthus", "Acropora", "Clownfisch", "LPS", "SPS"],
  openGraph: {
    title: "ReefPort Suche – Meerwasser-Inserate Schweiz",
    description: "Finde Korallen, Fische und Equipment von Händlern und Privatpersonen in der Schweiz.",
    url: "https://reefport.ch/search",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
