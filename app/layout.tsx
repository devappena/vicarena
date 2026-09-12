import { Outfit, Bebas_Neue } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Arena Direct — Scores, classements et calendrier",
  description:
    "Scores live de toutes les compétitions, classements, calendrier et statistiques. UEFA, CAF, FIFA et championnats du monde.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${outfit.variable} ${bebas.variable} font-sans pitch-grid antialiased`}>
        <FavoritesProvider>
          <Header />
          <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 pb-16 pt-24">{children}</main>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}
