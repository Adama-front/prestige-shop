"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto flex justify-center items-center flex-col pt-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-[#2ECC71] mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Oups ! Page non trouvée
          </h2>
          <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été
            déplacée. Revenez à la page d&apos;accueil et continuez votre
            shopping.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-[#2ECC71] text-white px-8 py-3 cursor-pointer  font-medium hover:bg-[#A3BE8C] transition-colors duration-300"
            >
              Retour à l&apos;accueil
            </motion.button>
          </Link>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-800 px-8 py-3 font-medium cursor-pointer w-max hover:bg-gray-200 transition-colors duration-300"
          >
            Page précédente
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
