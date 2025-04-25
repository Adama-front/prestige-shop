import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ScrollToTop from "@/components/ScrollToTop";
import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import StoreProvider from "./storeProvider";

export const metadata: Metadata = {
  title: "PrestigeShop",
  description:
    "PrestigeShop - Votre boutique en ligne incontournable pour des produits de qualité, des offres exclusives et une expérience d'achat fluide et sécurisée. Découvrez nos nouveautés et promotions dès maintenant !"
};

const lora = Lora({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lora.className} antialiased`}>
        <StoreProvider>
          <Header />
          {children}
          <ScrollToTop />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
