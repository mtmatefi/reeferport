import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nachrichten | ReefPort",
  description: "Deine Konversationen mit Käufern und Verkäufern auf ReefPort.",
  robots: { index: false, follow: false },
};

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
