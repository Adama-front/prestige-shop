"use client";
import Hero from "@/components/Hero";
import ListProducts from "@/components/ListProducts";
import { Newsletter } from "@/components/NewsLetter";
import PromotionGrid from "@/components/PromotionGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <PromotionGrid />
      <ListProducts />
      <Newsletter />
    </>
  );
}
