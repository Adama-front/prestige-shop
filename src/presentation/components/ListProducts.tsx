"use client";
import {
  fetchProducts,
  Product,
} from "@/application/catalog/productsSlice";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import { useEffect, useState } from "react";
import CardProduct from "@/presentation/components/Cards/CardProduct";
import { ProductSkeleton } from "@/presentation/components/ui/ProductSkeleton";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { motion, useReducedMotion } from "framer-motion";
import { scrollReveal } from "@/shared/motion/motionTokens";

const ListProducts = () => {
  const dispatch = useAppDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { items, status, error } = useAppSelector((state) => state.products);
  const isProductsLoading = status === "idle" || status === "loading";

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortValue, setSortValue] = useState("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  // Get unique categories
  const categories = Array.from(
    new Set(items.map((product) => product.category))
  );

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(e.target.value);
  };

  // Filter products based on search query and selected category
  const filteredProducts = items.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesCategory;
  }).sort((a, b) => sortValue === "price-low-high" ? a.price - b.price : sortValue === "price-high-low" ? b.price - a.price : 0);

  if (status === "failed")
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Erreur de chargement</p>
          <p className="text-gray-600">{error}</p>
          <button onClick={() => dispatch(fetchProducts())} className="mt-3 bg-[#F98909] px-4 py-2 text-[#171B18]">Réessayer</button>
        </div>
      </div>
    );

  return (
    <section
      className="bg-white text-black py-12"
      id="products"
      aria-busy={isProductsLoading}
    >
      <div className="max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center gap-y-6">
          <div className="flex w-full items-center justify-center">
            {isProductsLoading ? (
              <Skeleton className="h-8 w-72 max-w-[90vw] md:h-10" />
            ) : (
              <motion.h2 {...scrollReveal("up", prefersReducedMotion)} className="text-2xl md:text-3xl font-bold text-center text-gray-900">
                Découvrez Nos Collections Exclusives
              </motion.h2>
            )}
          </div>
          <div className="w-full flex items-center justify-center">
            <motion.div {...scrollReveal("left", prefersReducedMotion)} className="flex flex-wrap gap-2">
              {isProductsLoading ? (
                <div
                  className="flex flex-wrap justify-center gap-2"
                  role="status"
                  aria-label="Chargement des catégories"
                >
                  {["w-16", "w-24", "w-28", "w-20", "w-24"].map((width, index) => (
                    <Skeleton key={index} className={`h-9 ${width}`} />
                  ))}
                </div>
              ) : (
                <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer duration-300 ${
                  !selectedCategory
                    ? "bg-[#F98909] text-[#171B18]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tous
                </button>
              )}
              {!isProductsLoading && categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 cursor-pointer  text-sm font-medium transition-colors duration-300 ${
                    selectedCategory === category
                      ? "bg-[#F98909] text-[#171B18]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 "
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
          <div className="w-full flex items-center justify-center flex-col gap-y-3">
            <div className="flex w-full items-start">
              {isProductsLoading ? (
                <Skeleton className="h-10 w-40" />
              ) : (
                <select
                onChange={handleSortChange}
                className="px-4 py-2 duration-300 transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200  focus:outline-none focus:ring-2 focus:ring-[#F98909] focus:border-transparent"
              >
                <option value="">Trier par prix</option>
                <option value="price-low-high">Prix croissant</option>
                <option value="price-high-low">Prix décroissant</option>
                </select>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {isProductsLoading ? (
            <div
              className="grid w-full grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              role="status"
              aria-label="Chargement des produits"
            >
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: Product) => (
                <CardProduct key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* No Results Message */}
          {!isProductsLoading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucun produit ne correspond à votre recherche
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListProducts;
