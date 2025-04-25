"use client";
import { addToCart } from "@/store/slices/cartSlice";
import { Product } from "@/store/slices/productsSlice";
import { useAppDispatch, useAppSelector } from "@/store/types";
import Link from "next/link";
import { useState } from "react";
import Alert from "../ui/Alert";
import OptimizedImage from "../ui/OptimizedImage";
import CardProduct from "./CardProduct";

interface CardProductDetailProps {
  product: Product;
}

const CardProductDetail = ({ product }: CardProductDetailProps) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.products);
  const [showAlert, setShowAlert] = useState(false);

  // Filter products based on search query and selected category
  const filteredProducts = items.filter((item) => {
    const matchesCategory = item.category === product.category;
    return matchesCategory;
  });

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id.toString(),
        name: product.title,
        price: product.price,
        quantity: 1,
        image: product.image
      })
    );
    setShowAlert(true);
  };

  const [heart, setHeart] = useState(false);
  const handleHeartClick = () => {
    setHeart(!heart);
  };

  const generateRandomStock = (min = 5, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const stock = generateRandomStock();

  return (
    <>
      {showAlert && (
        <Alert
          message={`${product.title} a été ajouté au panier`}
          type="success"
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="w-full flex flex-col gap-y-20">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div className="w-full  bg-white flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <OptimizedImage
                src={product.image}
                alt={product.title}
                className="shadow-lg object-contain h-[300px] md:h-[400px]"
              />
            </div>
          </div>

          <div className="w-full flex items-start flex-col gap-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            <div className="w-full flex items-center gap-x-1">
              <div className=" flex items-center gap-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index}>
                    <span className="text-amber-300">
                      <svg
                        className="w-6 h-6 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-sm">(269 reviews)</p>
            </div>

            <div className="w-full flex items-center justify-between">
              <p className="text-2xl font-bold text-[#2ECC71]">
                {product.price.toFixed(2)} €
              </p>

              <div className=" flex items-center gap-x-1 md:gap-x-3">
                <Link
                  href=""
                  className="w-9 h-9 md:w-10 md:h-10   p-1 flex items-center justify-center text-[#2ECC71]  hover:text-white bg-gray-100 hover:bg-[#2ECC71] duration-300 transition-colors"
                >
                  <svg
                    className="w-[25px] h-[25px] "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-width="2"
                      d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                    />
                  </svg>
                </Link>{" "}
                <div
                  onClick={handleHeartClick}
                  className="w-9 h-9 md:w-10 md:h-10  p-1 flex items-center justify-center text-[#2ECC71] hover:text-white bg-gray-100 hover:bg-[#2ECC71] duration-300 transition-colors"
                >
                  {heart ? (
                    <svg
                      className="w-[25px] h-[25px] "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                    </svg>
                  ) : (
                    <svg
                      className=" w-[25px] h-[25px] "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke-width="2"
                        d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {product.description}
            </p>
            <div className="w-full flex items-center justify-between text-sm md:text-[18px]">
              <div className="flex items-center space-x-1 ">
                <span>Categorie :</span>
                <span className=" text-gray-600  ">{product.category}</span>
              </div>
              <div className="flex items-center space-x-1 ">
                <span>Stocks :</span>
                <span
                  className={`${
                    stock > 10 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {stock}
                </span>
              </div>
            </div>

            <div className="w-full pt-5">
              <button
                onClick={handleAddToCart}
                className="text-white w-full  cursor-pointer  md:text-lg bg-[#2ECC71] px-4 py-2  hover:bg-[#A3BE8C] transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Ajouter
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-6">
          <div className="flex w-full items-start justify-start">
            <h2 className="text-2xl  md:text-3xl font-bold text-left text-gray-900">
              Vous pourriez aussi aimer
            </h2>
          </div>
          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map((product: Product) => (
              <CardProduct key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardProductDetail;
