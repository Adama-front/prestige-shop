"use client";
import { addToCart } from "@/store/slices/cartSlice";
import { Product } from "@/store/slices/productsSlice";
import { useAppDispatch } from "@/store/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Alert from "../ui/Alert";

interface ProductCardProps {
  product: Product;
}
const CardProduct = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [showAlert, setShowAlert] = useState(false);

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

  const randomRating = (Math.random() * (5 - 1) + 1).toFixed(1);
  return (
    <>
      {showAlert && (
        <Alert
          message={`${product.title} a été ajouté au panier`}
          type="success"
          onClose={() => setShowAlert(false)}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white  shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div className="relative h-28 md:h-48 w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-2 md:p-4"
          />
          <div className=" absolute right-1 top-2 rotate-45">
            {" "}
            <div className="md:hidden flex items-center gap-x-1 bg-green-50 p-1">
              <span className="text-amber-300">
                <svg
                  className="md:w-6 md:h-6 w-4 h-4"
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
              <span className="font-medium text-xs md:text-sm">
                {randomRating}
              </span>
            </div>
          </div>
        </div>
        <div className="p-2 md:p-4 w-full flex-col flex gap-y-2">
          <Link href={`/products/${product.id}`}>
            <h2 className="md:text-lg text-sm  font-semibold duration-300   line-clamp-1 hover:text-[#2ECC71] transition-colors">
              {product.title}
            </h2>
          </Link>
          <p className="text-[#2ECC71] font-bold md:text-xl text-lg ">
            {product.price.toFixed(2)} €
          </p>
          <div className="flex md:justify-between justify-center items-center">
            <div className="hidden md:flex items-center gap-x-1">
              <span className="text-amber-300">
                <svg
                  className="md:w-6 md:h-6 w-4 h-4"
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
              <span className="font-medium text-xs md:text-sm">
                {randomRating}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="text-white cursor-pointer  md:text-sm bg-[#2ECC71] px-4 py-2  hover:bg-[#A3BE8C] transition-colors duration-300 flex items-center gap-2"
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
      </motion.div>
    </>
  );
};

export default CardProduct;
