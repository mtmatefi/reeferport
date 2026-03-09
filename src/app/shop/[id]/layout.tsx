import type { Metadata } from "next";
import { sellers } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const seller = sellers.find((s) => s.id === id);
  if (!seller) return { title: "Shop | Gesellschaftsbecken" };
  return {
    title: `${seller.name} | Gesellschaftsbecken Shop`,
    description: `${seller.bio ?? `Meerwasser-${seller.type} aus ${seller.location} auf Gesellschaftsbecken.`} ★ ${seller.rating} · ${seller.reviewCount} Bewertungen.`,
    openGraph: {
      title: `${seller.name} – Gesellschaftsbecken`,
      description: `Meerwasser-${seller.type} aus ${seller.location}. ${seller.salesCount}+ Verkäufe.`,
      url: `https://gesellschaftsbecken.ch/shop/${id}`,
    },
  };
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
