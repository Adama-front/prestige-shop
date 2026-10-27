"use client";

import { fetchProducts } from "@/application/catalog/productsSlice";
import { selectNewArrivals } from "@/application/catalog/selectors";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import CardProduct from "@/presentation/components/Cards/CardProduct";
import { ProductSkeleton } from "@/presentation/components/ui/ProductSkeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { scrollReveal } from "@/shared/motion/motionTokens";

export default function NewArrivals() {
  const dispatch = useAppDispatch();
  const prefersReducedMotion = useReducedMotion();
  const products = useAppSelector(selectNewArrivals);
  const { status, error, items } = useAppSelector((state) => state.products);
  const [sortBy, setSortBy] = useState<"newest" | "price">("newest");

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  const sortedProducts = [...products].sort((a, b) =>
    sortBy === "newest"
      ? new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      : a.price - b.price
  );

  return (
    <section className="bg-white text-[#171B18] py-12" id="newArrivals" aria-busy={status === "idle" || status === "loading"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center">
          <motion.h2 {...scrollReveal("up", prefersReducedMotion)} className="text-2xl md:text-3xl font-bold text-center">Nouveautés</motion.h2>
          <p className="text-sm text-[#667069] text-center max-w-xl">Découvrez nos derniers produits ajoutés</p>
        </div>
        {items.length === 0 && (status === "idle" || status === "loading") ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" role="status" aria-label="Chargement des nouveautés">
            {Array.from({ length: 4 }, (_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : status === "failed" && items.length === 0 ? (
          <div className="py-12 text-center"><p className="mb-4">{error}</p><button onClick={() => dispatch(fetchProducts())} className="bg-[#F98909] text-[#171B18] px-4 py-2">Réessayer</button></div>
        ) : products.length ? (
          <motion.div {...scrollReveal("up", prefersReducedMotion)} className="flex flex-col items-center gap-5">
            {status === "failed" && <p className="text-sm text-[#667069]" role="status">Les données affichées n’ont pas pu être actualisées.</p>}
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => setSortBy("newest")} className={`px-4 py-2 text-sm ${sortBy === "newest" ? "bg-[#F98909] text-[#171B18]" : "bg-[#E8EBE3] text-[#171B18]"}`}>Plus récents</button>
              <button onClick={() => setSortBy("price")} className={`px-4 py-2 text-sm ${sortBy === "price" ? "bg-[#F98909] text-[#171B18]" : "bg-[#E8EBE3] text-[#171B18]"}`}>Prix croissant</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{sortedProducts.map((product) => <CardProduct key={product.id} product={product} />)}</div>
          </motion.div>
        ) : (
          <div className="py-12 text-center"><h3 className="text-xl font-semibold">Aucun nouveau produit</h3><p className="mt-2 text-[#667069]">Aucun produit ne correspond à cette sélection pour le moment.</p><Link href="/#products" className="mt-5 inline-flex bg-[#F98909] px-4 py-2 text-[#171B18]">Explorer nos produits</Link></div>
        )}
      </div>
    </section>
  );
}
