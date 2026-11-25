import ScrollToTop from "@/presentation/components/ScrollToTop";
import SiteChrome from "@/presentation/components/Layout/SiteChrome";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/presentation/providers/StoreProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap"
});

export const metadata: Metadata = {
  title: "PrestigeShop",
  description:
    "PrestigeShop - Votre boutique en ligne incontournable pour des produits de qualité, des offres exclusives et une expérience d'achat fluide et sécurisée. Découvrez nos nouveautés et promotions dès maintenant !"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={plusJakartaSans.variable}>
      <body className="antialiased">
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
          <ScrollToTop />
        </StoreProvider>
      </body>
    </html>
  );
}
