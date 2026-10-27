"use client";

import { fetchProducts } from "@/application/catalog/productsSlice";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import { motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import CardProduct from "@/presentation/components/Cards/CardProduct";
import { SearchSkeleton } from "@/presentation/components/ui/SearchSkeleton";
import { formatXof } from "@/shared/utils/formatXof";
import { scrollReveal } from "@/shared/motion/motionTokens";

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { items: products, status, error } = useAppSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [maxPrice, setMaxPrice] = useState(1000);
  const isLoading = products.length === 0 && (status === "idle" || status === "loading");

  // Chargement initial des produits
  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  // Calcul du prix maximum
  useEffect(() => {
    if (products.length > 0) {
      const maxProductPrice = Math.max(
        ...products.map((product) => product.price)
      );
      setMaxPrice(maxProductPrice);
    }
  }, [products]);

  // Liste des catégories uniques
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category))
  ];

  // Filtrage et tri des produits
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  // Gestion des changements de tri
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Gestion des changements de catégorie
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (status === "failed" && products.length === 0) return <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3" role="alert"><p>{error || "Impossible de charger les produits."}</p><button onClick={() => dispatch(fetchProducts())} className="bg-[#F98909] px-4 py-2 text-[#171B18]">Réessayer</button></div>;
  if (isLoading) {
    return <SearchSkeleton />;
  }

  return (
    <section className="pb-16 pt-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {status === "failed" && products.length > 0 && (
          <div className="mb-6 border border-[#DCE1D8] bg-[#F5F5EF] p-3 text-sm text-[#171B18]" role="alert">
            <p>{error || "Impossible d’actualiser les produits."}</p>
            <button type="button" onClick={() => dispatch(fetchProducts())} className="mt-2 font-semibold text-[#CC6500] underline">Réessayer</button>
          </div>
        )}
        <div className="flex w-full items-center justify-center">
          <motion.h1 {...scrollReveal("up", prefersReducedMotion)} className="text-3xl md:text-5xl font-extrabold text-[#F98909] mb-6 text-center ">
            Recherche Facile, Résultats Parfaits
          </motion.h1>
        </div>
        <Suspense fallback={<SearchSkeleton />}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtres */}
            <motion.div
              {...scrollReveal("left", prefersReducedMotion)}
              className="lg:w-64 flex-shrink-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
            >
              <div className="bg-white p-4 shadow-md">
                <h2 className="text-xl font-semibold text-[#F98909] mb-4">
                  Filtres
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F98909]"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix maximum : {formatXof(maxPrice)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(...products.map((p) => p.price))}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trier par
                    </label>
                    <select
                      value={sortOption}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F98909]"
                    >
                      <option value="default">Par défaut</option>
                      <option value="price-low-high">Prix : croissant</option>
                      <option value="price-high-low">Prix : décroissant</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contenu principal */}
            <div className="flex-1">
              {/* Barre de recherche */}
              <motion.div
                {...scrollReveal("up", prefersReducedMotion)}
                className="mb-8"
              >
                <div className="max-w-xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F98909] pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </motion.div>

              {/* Résultats */}
              <Suspense fallback={<SearchSkeleton />}>
                <motion.div
                  {...scrollReveal("right", prefersReducedMotion)}
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <CardProduct key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-xl text-gray-600">
                        {searchQuery || selectedCategory !== "all" || maxPrice < Math.max(...products.map((product) => product.price)) ? "Aucun produit ne correspond à ces filtres." : "Aucun produit disponible pour le moment."}
                      </p>
                    </div>
                  )}
                </motion.div>
              </Suspense>
            </div>
          </div>
        </Suspense>
      </div>
    </section>
  );
};

export default SearchPage;
