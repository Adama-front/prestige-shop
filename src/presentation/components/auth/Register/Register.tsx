"use client";

import Link from "next/link";
import FormRegister from "./FormRegister";
import { motion, useReducedMotion } from "framer-motion";
import { scrollReveal } from "@/shared/motion/motionTokens";

const Register = () => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="min-h-screen flex items-center justify-center bg-white text-black py-10">
      <motion.div {...scrollReveal("up", prefersReducedMotion)} className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center gap-y-6">
          <div className="flex w-full items-center justify-center flex-col gap-y-2">
            <div className="md:w-10   md:h-10 h-8 w-8  flex items-center justify-center bg-[#F98909] text-[#171B18]">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-y-1">
              <h2 className="text-2xl  md:text-3xl font-bold text-center text-gray-900">
                Créer un compte
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Ou{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#F98909] hover:text-[#CC6500]"
                >
                  connectez-vous à votre compte existant
                </Link>
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <FormRegister />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Register;
