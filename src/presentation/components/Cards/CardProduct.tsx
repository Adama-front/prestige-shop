"use client";

import { addToCart } from "@/application/cart/cartSlice";
import { Product } from "@/domain/catalog/Product";
import { useAppDispatch } from "@/application/store/hooks";
import Alert from "@/presentation/components/ui/Alert";
import { formatXof } from "@/shared/utils/formatXof";
import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <>
      {showAlert && (
        <Alert
          message={`${product.title} a été ajouté au panier`}
          type="success"
          onClose={() => setShowAlert(false)}
        />
      )}

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="group overflow-hidden border border-[#DCE1D8] bg-white transition-shadow duration-300 hover:shadow-lg"
      >
        <Link
          href={`/products/${product.id}`}
          className="relative block aspect-[4/3] overflow-hidden bg-[#F5F5EF]"
          aria-label={`Voir ${product.title}`}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="flex flex-col gap-3 p-3 md:p-4">
          <Link href={`/products/${product.id}`} className="min-h-10">
            <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-[#171B18] transition-colors group-hover:text-[#CC6500] md:text-base">
              {product.title}
            </h2>
          </Link>

          <p className="text-base font-bold text-[#CC6500] md:text-lg">
            {formatXof(product.price)}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full cursor-pointer items-center justify-center gap-2 bg-[#F98909] px-3 py-2 text-sm font-semibold text-[#171B18] transition-colors duration-300 hover:bg-[#D9EC8B]"
          >
            <ShoppingCart aria-hidden="true" size={17} />
            Ajouter
          </button>
        </div>
      </motion.article>
    </>
  );
};

export default CardProduct;
