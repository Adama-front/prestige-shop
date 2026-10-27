"use client";
import CardProductDetail from "@/presentation/components/Cards/CardProductDetail";
import { getById } from "@/application/catalog/productsSlice";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { scrollReveal } from "@/shared/motion/motionTokens";

const Detail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const prefersReducedMotion = useReducedMotion();
  const { selectedProduct, status, error } = useAppSelector(
    (state) => state.products
  );

  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(getById(parseInt(id as string, 10)));
    }
  }, [dispatch, id]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F98909]"></div>
      </div>
    );

  if (status === "failed")
    return (
      <div className="min-h-screen flex flex-col gap-y-3 items-center justify-center w-full px-4 text-lg">
        <p>Erreur : {error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#F98909] text-[#171B18] duration-300 text-sm cursor-pointer hover:bg-[#D9EC8B] transition-colors"
        >
          Retour
        </button>
      </div>
    );

  if (!selectedProduct)
    return (
      <div className="min-h-screen flex items-center justify-center w-full px-4 text-lg">
        Produit introuvable
      </div>
    );

  return (
    <section className="bg-white text-black pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center gap-y-6">
          <div className="flex w-full items-center justify-center">
            <motion.h2 {...scrollReveal("up", prefersReducedMotion)} className="text-2xl md:text-3xl font-bold text-center text-gray-900">
              Tout Ce Que Vous Devez Savoir
            </motion.h2>
          </div>
          <div className="w-full flex items-start">
            <button
              onClick={() => router.back()}
              className="md:px-3 md:py-2 py-1.5 px-2 flex items-center gap-x-1 justify-center bg-[#F98909] text-[#171B18] duration-300 text-xs md:text-sm cursor-pointer hover:bg-[#D9EC8B] transition-colors"
            >
              <svg
                className="md:w-6 md:h-6 w-5 h-5"
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
                  strokeWidth="2"
                  d="M5 12h14M5 12l4-4m-4 4 4 4"
                />
              </svg>
              <span>Retour</span>
            </button>
          </div>
          <div className="w-full pt-5">
            <motion.div {...scrollReveal("right", prefersReducedMotion)} className="w-full">
              <CardProductDetail product={selectedProduct} />
            </motion.div>
          </div>

          {/* Section des commentaires */}
          <motion.section {...scrollReveal("up", prefersReducedMotion)} className="mt-8 border-t border-[#DCE1D8] pt-6" aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="text-xl font-semibold text-[#171B18]">Avis clients</h2>
            <p className="mt-2 text-sm text-[#667069]">La consultation et la publication des avis seront disponibles après l’intégration du backend.</p>
          </motion.section>
        </div>
      </div>
    </section>
  );
};

export default Detail;
