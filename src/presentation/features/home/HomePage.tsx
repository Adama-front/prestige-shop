import Hero from "@/presentation/components/Hero";
import ListProducts from "@/presentation/components/ListProducts";
import { Newsletter } from "@/presentation/components/NewsLetter";
import PromotionGrid from "@/presentation/components/PromotionGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromotionGrid />
      <ListProducts />
      <Newsletter />
    </>
  );
}
