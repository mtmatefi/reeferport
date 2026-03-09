import type { Metadata } from "next";
import { sellers } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const seller = sellers.find((s) => s.id === id);
  if (!seller) return { title: "Shop | ReefPort" };
  return {
    title: `${seller.name} | ReefPort Shop`,
    description: `${seller.bio ?? `Meerwasser-${seller.type} aus ${seller.location} auf ReefPort.`} ★ ${seller.rating} · ${seller.reviewCount} Bewertungen.`,
    openGraph: {
      title: `${seller.name} – ReefPort`,
      description: `Meerwasser-${seller.type} aus ${seller.location}. ${seller.salesCount}+ Verkäufe.`,
      url: `https://reefport.ch/shop/${id}`,
    },
  };
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
