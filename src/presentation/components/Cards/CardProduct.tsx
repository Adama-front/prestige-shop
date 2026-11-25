"use client";

import { addToCart } from "@/application/cart/cartSlice";
import { Product } from "@/domain/catalog/Product";
import { useAppDispatch } from "@/application/store/hooks";
import Alert from "@/presentation/components/ui/Alert";
import { formatXof } from "@/shared/utils/formatXof";
import { motion } from "motion/react";
import { Heart, ImageOff, ShoppingBag } from "lucide-react";
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
  const [isFavorite, setIsFavorite] = useState(false);

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
        className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-2.5 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-3"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F8FAFC]">
          <Link
            href={`/products/${product.id}`}
            className="block h-full w-full"
            aria-label={`Voir ${product.title}`}
          >
            {imageUnavailable ? (
              <span className="flex h-full w-full items-center justify-center text-[#64748B]">
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

          {(product.discount || product.isNew) && (
            <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">
              {product.discount && product.discount > 0 && (
                <span className="rounded-lg bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  -{product.discount}%
                </span>
              )}
              {product.isNew && (
                <span className="rounded-lg bg-[#059669] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  Nouveau
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            aria-label={
              isFavorite
                ? `Retirer ${product.title} des favoris`
                : `Ajouter ${product.title} aux favoris`
            }
            aria-pressed={isFavorite}
            className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#0F172A] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white"
          >
            <Heart
              aria-hidden="true"
              size={16}
              className={
                isFavorite
                  ? "fill-rose-500 text-rose-500"
                  : "text-[#0F172A]"
              }
            />
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-0.5 px-1">
          <Link href={`/products/${product.id}`}>
            <h2 className="truncate text-sm font-semibold text-[#0F172A] transition-colors group-hover:text-[#047857] sm:text-base">
              {product.title}
            </h2>
          </Link>
          <p className="truncate text-xs capitalize text-[#64748B]">
            {product.category}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 px-1 pb-0.5">
          <p className="min-w-0 text-base font-bold text-[#0F172A] sm:text-lg">
            {formatXof(product.price)}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Ajouter ${product.title} au panier`}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#059669] text-white shadow-sm transition-colors duration-200 hover:bg-[#047857]"
          >
            <ShoppingBag aria-hidden="true" size={18} />
          </button>
        </div>
      </motion.article>
    </>
  );
};

export default CardProduct;
