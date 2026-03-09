import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mein Profil | Gesellschaftsbecken",
  description: "Verwalte deine Inserate, gespeicherten Artikel und Bewertungen auf Gesellschaftsbecken.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
