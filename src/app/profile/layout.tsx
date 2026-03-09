import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mein Profil | ReefPort",
  description: "Verwalte deine Inserate, gespeicherten Artikel und Bewertungen auf ReefPort.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
