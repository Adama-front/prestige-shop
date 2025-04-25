"use client";

import CardProduct from "@/components/Cards/CardProduct";
import { useAppSelector } from "@/store/types";
import { Product } from "@/types/product";
import Link from "next/link";
import { useState } from "react";

export default function NewArrivals() {
  const products = useAppSelector((state) => state.products.items);
  const [sortBy, setSortBy] = useState<"newest" | "price">("newest");

  // Filtrer les nouveaux produits (par exemple, produits ajoutés dans les 30 derniers jours)
  const newProducts = products.filter((product: Product) => {
    const productDate = new Date(product.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return productDate >= thirtyDaysAgo;
  });

  // Trier les produits
  const sortedProducts = [...newProducts].sort((a: Product, b: Product) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return a.price - b.price;
    }
  });

  return (
    <section className="bg-white text-black py-12" id="newArrivals">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 w-full flex items-center justify-center flex-col">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
            Nouveautés
          </h2>
          <p className="text-sm text-gray-600 text-center max-w-xl">
            Découvrez nos derniers produits ajoutés
          </p>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="w-full flex items-center justify-center flex-col gap-5">
            <div className="flex w-full items-center justify-center space-x-">
              <button
                onClick={() => setSortBy("newest")}
                className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors duration-300  ${
                  sortBy === "newest"
                    ? "bg-[#2ECC71] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Plus récents
              </button>
              <button
                onClick={() => setSortBy("price")}
                className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors duration-300  ${
                  sortBy === "price"
                    ? "bg-[#2ECC71] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Prix croissant
              </button>
            </div>{" "}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product: Product) => (
                <CardProduct key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex w-full shadow-xl items-center justify-center flex-col gap-y-5 min-h-[70vh] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="md:w-28 md:h-28 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="md:w-20 md:h-20 w-14 h-14"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <style>
                      {`.cls-1{fill:#90fc95}.cls-2{fill:#2ECC71}.cls-3{fill:#ffe76e}.cls-4{fill:#ffc444}.cls-5{fill:#2ECC71}.cls-6{fill:#2ECC71}.cls-7{fill:#f88}.cls-8{fill:#f97171}.cls-9{fill:#2ECC71}.cls-10{fill:#ffffff}.cls-11{fill:#d4ffd4}.cls-12{fill:#ffbdbd}.cls-13{fill:#2ECC71}.cls-14{fill:#fff4c5}`}
                    </style>
                  </defs>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_2" data-name="Layer 2">
                      <rect
                        className="cls-1"
                        x="117.69"
                        y="24"
                        width="54.7"
                        height="54.7"
                      />

                      <path
                        className="cls-2"
                        d="M172.4,80.7h-54.7a2,2,0,0,1-2-2V24a2,2,0,0,1,2-2h54.7a2,2,0,0,1,2,2V78.7A2,2,0,0,1,172.4,80.7Zm-52.7-4h50.7V26h-50.7Z"
                      />

                      <rect
                        className="cls-3"
                        x="83.46"
                        y="54.17"
                        width="49.07"
                        height="49.07"
                      />

                      <rect
                        className="cls-4"
                        x="83.46"
                        y="70.7"
                        width="49.07"
                        height="32.54"
                      />

                      <path
                        className="cls-2"
                        d="M132.53,105.24H83.46a2,2,0,0,1-2-2V54.17a2,2,0,0,1,2-2h49.07a2,2,0,0,1,2,2v49.07A2,2,0,0,1,132.53,105.24Zm-47.07-4h45.07V56.17H85.46Z"
                      />

                      <rect
                        className="cls-5"
                        x="115.5"
                        y="41.37"
                        width="54.7"
                        height="76.22"
                        transform="translate(98.04 -77.73) rotate(45)"
                      />

                      <polygon
                        className="cls-6"
                        points="135.24 125.77 189.14 71.87 187.97 70.7 112.95 70.7 96.56 87.09 135.24 125.77"
                      />

                      <path
                        className="cls-2"
                        d="M135.24,127.77a2,2,0,0,1-1.41-.59L95.15,88.5a2,2,0,0,1,0-2.83L149,31.78a2,2,0,0,1,2.83,0l38.68,38.68a2,2,0,0,1,0,2.83l-53.9,53.9A2,2,0,0,1,135.24,127.77ZM99.39,87.09l35.85,35.85,51.07-51.07L150.46,36Z"
                      />

                      <rect
                        className="cls-7"
                        x="41.14"
                        y="44"
                        width="49.07"
                        height="49.07"
                      />

                      <rect
                        className="cls-8"
                        x="41.14"
                        y="70.7"
                        width="49.07"
                        height="22.37"
                      />

                      <path
                        className="cls-2"
                        d="M90.21,95.07H41.14a2,2,0,0,1-2-2V44a2,2,0,0,1,2-2H90.21a2,2,0,0,1,2,2V93.07A2,2,0,0,1,90.21,95.07Zm-47.07-4H88.21V46H43.14Z"
                      />

                      <path
                        className="cls-9"
                        d="M189.14,177.3H68.67a12,12,0,0,1-11.14-7.55L27.72,95.16A12,12,0,0,1,38.86,78.7H189.14Z"
                      />

                      <path
                        className="cls-10"
                        d="M177.53,166.5H68.67A12,12,0,0,1,57.53,159L27.72,95.16A12,12,0,0,1,38.86,78.7H177.53Z"
                      />

                      <path
                        className="cls-2"
                        d="M189.14,179.3H68.67a13.93,13.93,0,0,1-13-8.8L25.86,95.9a14,14,0,0,1,13-19.2H189.14a2,2,0,0,1,2,2V177.3A2,2,0,0,1,189.14,179.3ZM38.86,80.7a10,10,0,0,0-9.29,13.71L59.38,169a10,10,0,0,0,9.29,6.29H187.14V80.7Z"
                      />

                      <circle className="cls-1" cx="219.14" cy="54" r="10" />

                      <path
                        className="cls-2"
                        d="M219.14,66a12,12,0,1,1,12-12A12,12,0,0,1,219.14,66Zm0-20a8,8,0,1,0,8,8A8,8,0,0,0,219.14,46Z"
                      />

                      <path
                        className="cls-2"
                        d="M189.14,80.7a2,2,0,0,1-2-2V67.93a2,2,0,0,1,1.07-1.77l20.52-10.77a2,2,0,0,1,1.86,3.54L191.14,69.14V78.7A2,2,0,0,1,189.14,80.7Z"
                      />

                      <circle className="cls-6" cx="61.14" cy="212" r="20" />

                      <circle
                        className="cls-5"
                        cx="61.14"
                        cy="207.14"
                        r="15.14"
                      />

                      <path
                        className="cls-2"
                        d="M61.14,234a22,22,0,1,1,22-22A22,22,0,0,1,61.14,234Zm0-40a18,18,0,1,0,18,18A18,18,0,0,0,61.14,194Z"
                      />

                      <path
                        className="cls-2"
                        d="M211.79,214H81.14a2,2,0,0,1,0-4H211.79a15.35,15.35,0,1,0,0-30.7H189.14a2,2,0,0,1,0-4h22.65a19.35,19.35,0,1,1,0,38.7Z"
                      />

                      <circle className="cls-6" cx="169.14" cy="212" r="20" />

                      <circle
                        className="cls-5"
                        cx="169.14"
                        cy="207.14"
                        r="15.14"
                      />

                      <path
                        className="cls-2"
                        d="M169.14,234a22,22,0,1,1,22-22A22,22,0,0,1,169.14,234Zm0-40a18,18,0,1,0,18,18A18,18,0,0,0,169.14,194Z"
                      />

                      <circle className="cls-11" cx="31" cy="46" r="5" />

                      <circle className="cls-11" cx="37" cy="171" r="4" />

                      <circle className="cls-11" cx="198" cy="222" r="3" />

                      <circle className="cls-11" cx="88" cy="24" r="2" />

                      <circle className="cls-11" cx="45" cy="185" r="1" />

                      <circle className="cls-12" cx="11" cy="84" r="5" />

                      <circle className="cls-12" cx="124" cy="10" r="4" />

                      <circle className="cls-12" cx="171" cy="247" r="3" />

                      <circle className="cls-12" cx="224" cy="160" r="2" />

                      <circle className="cls-12" cx="69" cy="236" r="1" />

                      <circle className="cls-13" cx="137" cy="229" r="5" />

                      <circle className="cls-13" cx="203" cy="123" r="4" />

                      <circle className="cls-13" cx="187" cy="34" r="3" />

                      <circle className="cls-13" cx="218" cy="140" r="2" />

                      <circle className="cls-13" cx="43" cy="229" r="1" />

                      <circle className="cls-14" cx="245" cy="142" r="5" />

                      <circle className="cls-14" cx="224" cy="91" r="4" />

                      <circle className="cls-14" cx="101" cy="191" r="3" />

                      <circle className="cls-14" cx="26" cy="142" r="2" />

                      <circle className="cls-14" cx="52" cy="28" r="1" />
                    </g>
                  </g>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-center">
                Aucun nouveau produit disponible
              </h2>
              <p className="text-center">
                Revenez plus tard pour découvrir nos prochaines nouveautés
              </p>
              <Link href="/#products">
                <button className="text-white cursor-pointer md:text-sm bg-[#2ECC71] px-4 py-2 hover:bg-[#A3BE8C] transition-colors duration-300 flex items-center gap-2">
                  Explorer nos produits
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
