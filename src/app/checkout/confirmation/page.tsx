"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { scrollReveal } from "@/shared/motion/motionTokens";

const ConfirmationPage = () => {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-white text-black pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col gap-y-6">
          <div className="flex w-full items-center justify-center">
            <motion.h2 {...scrollReveal("up", prefersReducedMotion)} className="text-2xl md:text-3xl font-bold text-gray-900">
              Validation de commande indisponible
            </motion.h2>
          </div>

          <div className="w-full flex items-start">
            <button
              onClick={() => router.push("/")}
              className="md:px-3 md:py-2 py-1.5 px-2 flex items-center gap-x-1 justify-center bg-[#F98909] text-[#171B18] duration-300 text-xs md:text-sm cursor-pointer hover:bg-[#CC6500] transition-colors"
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
              <span>Retour à l&apos;accueil</span>
            </button>
          </div>

          <motion.div {...scrollReveal("up", prefersReducedMotion)} className="bg-white shadow-xl p-6 md:p-8 rounded-lg">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#E8EBE3] mb-4">
                <svg
                  className="h-6 w-6 text-[#CC6500]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune commande n’a été créée.
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Votre panier n’a pas été envoyé et reste accessible. La validation sera activée après l’intégration du backend.
              </p>
              <Link
                href="/cart"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium  shadow-sm text-white bg-[#F98909] hover:bg-[#CC6500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F98909] transition-colors duration-300"
              >
                Retourner au panier
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmationPage;
