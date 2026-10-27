"use client";

import { motion, useReducedMotion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motionTokens, scrollReveal } from "@/shared/motion/motionTokens";

interface Promotion {
  id: number;
  title: string;
  subtitle?: string;
  discount?: string;
  image: StaticImageData | string;
  link: string;
  size?: "large" | "medium" | "small";
}

const PromotionCard = ({ promotion }: { promotion: Promotion }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      {...scrollReveal("up", prefersReducedMotion)}
      className="group overflow-hidden w-full h-full shadow-lg relative "
    >
      <Image
        src={promotion.image}
        alt={promotion.title}
        width={800}
        height={600}
        className="transition-transform w-full h-full duration-500 group-hover:scale-110 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex flex-col justify-center items-center text-white p-2 md:p-4 text-center">
        {promotion.discount && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-[var(--context-blue)] text-[#151914] px-2 md:px-3 py-1.5 text-xs font-bold mb-2"
          >
            {promotion.discount}
          </motion.span>
        )}
        <h2 className="md:text-2xl text-xl font-bold mb-2">
          {promotion.title}
        </h2>
        {promotion.subtitle && (
          <p className="text-sm mb-4">{promotion.subtitle}</p>
        )}
        <Link
          href={promotion.link}
          className="text-[#171B18] font-bold bg-[#F98909] px-4 py-2 text-sm  transition-all duration-300 hover:bg-[#D9EC8B] hover:scale-105 flex items-center"
        >
          Shop Now
        </Link>
      </div>
    </motion.div>
  );
};

export default function PromotionGrid() {
  const prefersReducedMotion = useReducedMotion();
  const promotions: Promotion[] = [
    {
      id: 1,
      title: "Style Femme",
      subtitle: "Jusqu'à 70% de réduction",
      image: "/images/offre/offre_1.jpg",
      link: "/shop/women",
      size: "large"
    },
    {
      id: 2,
      title: "Sacs à main",
      discount: "35% de réduction",
      image: "/images/offre/offre_2.jpg",
      link: "/shop/handbags",
      size: "medium"
    },
    {
      id: 3,
      title: "Montres",
      discount: "45% de réduction",
      image: "/images/offre/offre_3.jpg",
      link: "/shop/watches",
      size: "medium"
    },
    {
      id: 4,
      title: "Sacs à dos",
      subtitle: "Entre 40% et 60% de réduction",
      image: "/images/offre/offre_4.jpg",
      link: "/shop/backpacks",
      size: "large"
    }
  ];

  return (
    <section className="bg-white text-black py-12">
      <div className="max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center gap-y-6">
          <motion.div {...scrollReveal("up", prefersReducedMotion)} className="flex flex-col gap-y-2">
            {" "}
            <h2 className="text-2xl  md:text-3xl font-bold text-center text-gray-900">
              Offres Exclusives du Moment
            </h2>
            <p className="text-sm text-gray-600 text-center max-w-xl">
              Découvrez nos promotions irrésistibles sur les articles
              tendance.Profitez de réductions exceptionnelles avant qu&apos;il
              ne soit trop tard !
            </p>
          </motion.div>
          <motion.div {...scrollReveal("up", prefersReducedMotion, motionTokens.stagger)} className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* Large Promotion */}
            <div className="h-[190px] md:h-[400px]">
              {promotions
                .filter((p) => p.size === "large" && p.id === 1)
                .map((promotion) => (
                  <PromotionCard key={promotion.id} promotion={promotion} />
                ))}
            </div>

            {/* Medium Promotions Grid */}
            <div className="grid grid-rows-2 gap-5">
              <div className="grid grid-cols-2 gap-5">
                {promotions
                  .filter((p) => p.size === "medium")
                  .map((promotion) => (
                    <div key={promotion.id} className="h-[190px]">
                      <PromotionCard promotion={promotion} />
                    </div>
                  ))}
              </div>
              <div className="h-[190px]">
                {promotions
                  .filter((p) => p.size === "large" && p.id === 4)
                  .map((promotion) => (
                    <PromotionCard key={promotion.id} promotion={promotion} />
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
