"use client";
import {
  fetchProducts,
  Product,
  sortProducts
} from "@/store/slices/productsSlice";
import { useAppDispatch, useAppSelector } from "@/store/types";
import { useEffect, useState } from "react";
import CardProduct from "./Cards/CardProduct";

const ListProducts = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Get unique categories
  const categories = Array.from(
    new Set(items.map((product) => product.category))
  );

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    dispatch(sortProducts(sortValue));
  };

  // Filter products based on search query and selected category
  const filteredProducts = items.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesCategory;
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2ECC71]"></div>
      </div>
    );
  }

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
    <section className="bg-white text-black py-12" id="products">
      <div className="max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center gap-y-6">
          <div className="flex w-full items-center justify-center">
            <h2 className="text-2xl  md:text-3xl font-bold text-center text-gray-900">
              Découvrez Nos Collections Exclusives
            </h2>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer duration-300 ${
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
                  className={`px-4 py-2 cursor-pointer  text-sm font-medium transition-colors duration-300 ${
                    selectedCategory === category
                      ? "bg-[#2ECC71] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 "
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full flex items-center justify-center flex-col gap-y-3">
            <div className="flex w-full items-start">
              <select
                onChange={handleSortChange}
                className="px-4 py-2 duration-300 transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200  focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
              >
                <option value="">Trier par prix</option>
                <option value="price-low-high">Prix croissant</option>
                <option value="price-high-low">Prix décroissant</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
};

export default ListProducts;
