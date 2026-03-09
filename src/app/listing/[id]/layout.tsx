import type { Metadata } from "next";
import { listings } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = listings.find((x) => x.id === id);
  if (!l) return { title: "Inserat | ReefPort" };

  const priceStr = `${l.currency} ${l.price.toLocaleString("de-CH")}`;
  const title = `${l.title}${l.latin ? ` (${l.latin})` : ""} – ${priceStr} | ReefPort`;
  const description = `${l.subtitle}. ${l.condition} · ${l.location}${l.shipping ? " · Versand möglich" : ""}. ${l.description.slice(0, 120)}…`;

  return {
    title,
    description,
    keywords: [l.title, l.category, l.condition, l.location, ...(l.latin ? [l.latin] : []), ...l.tags],
    openGraph: {
      title: `${l.title} – ${priceStr}`,
      description,
      images: [{ url: l.image, width: 1200, height: 800, alt: l.title }],
      url: `https://reefport.ch/listing/${id}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${l.title} – ${priceStr}`,
      description,
      images: [l.image],
    },
    other: {
      "product:price:amount": l.price.toString(),
      "product:price:currency": l.currency,
      "product:condition": l.condition === "Neu" ? "new" : "used",
      "product:availability": "in stock",
    },
  };
}

export default function ListingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
