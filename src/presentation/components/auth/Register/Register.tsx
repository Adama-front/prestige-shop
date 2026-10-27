"use client";

import Link from "next/link";
import FormRegister from "./FormRegister";
import { motion, useReducedMotion } from "motion/react";
import { scrollReveal } from "@/shared/motion/motionTokens";

const Register = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F5F5EF] px-4 py-8 text-[#171B18] sm:px-6 lg:px-8">
      <motion.div
        {...scrollReveal("up", prefersReducedMotion)}
        className="grid min-h-[min(760px,calc(100vh-4rem))] w-full max-w-6xl overflow-hidden border border-[#DCE1D8] bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]"
      >
        <aside className="relative hidden min-h-[640px] overflow-hidden bg-[#171B18] lg:block">
          <div className="absolute inset-0 bg-[url('/images/hero/hero_2.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171B18]/90 via-[#171B18]/25 to-[#171B18]/10" />
          <div className="absolute left-8 top-8 flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center bg-[#F98909] text-lg font-bold text-[#171B18]">P</span>
            <span className="font-semibold tracking-wide">PrestigeShop</span>
          </div>
          <div className="absolute inset-x-8 bottom-10 text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#D9EC8B]">Un compte, plus de possibilités</p>
            <h2 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">Bienvenue dans votre boutique.</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">Créez votre compte et gardez vos essentiels à portée de main.</p>
          </div>
          <span aria-hidden="true" className="absolute right-8 top-28 h-16 w-16 border border-[#D9EC8B]/70" />
        </aside>

        <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#CC6500]">Rejoignez-nous <span className="ml-2 text-[#667069]">02 / 02</span></p>
              <h1 className="text-4xl font-bold leading-tight text-[#171B18] sm:text-5xl">Créez votre compte.</h1>
              <p className="mt-3 text-sm text-[#667069]">Quelques informations suffisent pour commencer.</p>
            </div>
            <FormRegister />
            <p className="mt-8 text-center text-sm text-[#667069]">
              Vous avez déjà un compte ?{" "}
              <Link href="/auth/login" className="font-semibold text-[#CC6500] underline decoration-[#D9EC8B] decoration-2 underline-offset-4 hover:text-[#171B18]">Connectez-vous</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Register;
