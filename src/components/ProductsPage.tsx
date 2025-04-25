"use client";

import {
  fetchProducts,
  Product,
  sortProducts
} from "@/store/slices/productsSlice";
import { AppDispatch, RootState } from "@/store/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardProduct from "./Cards/CardProduct";

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector(
    (state: RootState) => state.products
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Get unique categories
  const categories = Array.from(
    new Set(items.map((product) => product.category))
  );

  // Filter products based on search query and selected category
  const filteredProducts = items.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    dispatch(sortProducts(sortValue));
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2ECC71]"></div>
      </div>
    );

  if (status === "failed")
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Erreur de chargement</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-[#2ECC71] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-[#2ECC71] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <select
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          >
            <option value="">Trier par prix</option>
            <option value="price-low-high">Prix croissant</option>
            <option value="price-high-low">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <CardProduct key={product.id} product={product} />
        ))}
      </div>

      {/* No Results Message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucun produit ne correspond à votre recherche
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
