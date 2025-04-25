"use client";

import { fetchProducts, sortProducts } from "@/store/slices/productsSlice";
import { useAppDispatch, useAppSelector } from "@/store/types";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import CardProduct from "../Cards/CardProduct";

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [maxPrice, setMaxPrice] = useState(1000);

  // Chargement initial des produits
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
    if (option !== "default") {
      dispatch(sortProducts(option));
    }
  };

  // Gestion des changements de catégorie
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <section className="pb-16 pt-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#2ECC71] mb-6 text-center ">
            Recherche Facile, Résultats Parfaits
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-white p-4 shadow-md">
              <h2 className="text-xl font-semibold text-[#2ECC71] mb-4">
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
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
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
                    Prix maximum : {maxPrice}€
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
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="max-w-xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2ECC71] pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* Résultats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <CardProduct key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-gray-600">Aucun produit trouvé</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
