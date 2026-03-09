import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nachrichten | Gesellschaftsbecken",
  description: "Deine Konversationen mit Käufern und Verkäufern auf Gesellschaftsbecken.",
  robots: { index: false, follow: false },
};

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
