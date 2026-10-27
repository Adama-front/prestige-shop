"use client";

import { addToCart } from "@/application/cart/cartSlice";
import { Product } from "@/domain/catalog/Product";
import { useAppDispatch } from "@/application/store/hooks";
import Alert from "@/presentation/components/ui/Alert";
import { formatXof } from "@/shared/utils/formatXof";
import { motion } from "motion/react";
import { ImageOff, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const CardProduct = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [imageUnavailable, setImageUnavailable] = useState(false);

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
          className="relative block aspect-[3/2] overflow-hidden bg-[#F5F5EF]"
          aria-label={`Voir ${product.title}`}
        >
          {imageUnavailable ? (
            <span className="absolute inset-0 flex items-center justify-center text-[#667069]">
              <ImageOff aria-hidden="true" size={28} strokeWidth={1.5} />
            </span>
          ) : (
            <Image
              src={product.image}
              alt={product.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageUnavailable(true)}
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </Link>

        <div className="flex flex-col gap-2 p-2.5 md:p-3">
          <Link href={`/products/${product.id}`} className="min-h-9">
            <h2 className="line-clamp-2 text-xs font-semibold leading-[1.125rem] text-[#171B18] transition-colors group-hover:text-[#CC6500] md:text-sm">
              {product.title}
            </h2>
          </Link>

          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 text-sm font-bold text-[#CC6500] md:text-base">
              {formatXof(product.price)}
            </p>

            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Ajouter ${product.title} au panier`}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-2 bg-[#F98909] px-2.5 py-1.5 text-xs font-semibold text-[#171B18] transition-colors duration-300 hover:bg-[#D9EC8B] md:px-3 md:text-sm"
            >
              <ShoppingCart aria-hidden="true" size={17} />
              <span className="hidden md:inline">Ajouter</span>
            </button>
          </div>
        </div>
      </motion.article>
    </>
  );
};

export default CardProduct;
