"use client";

import Link from "next/link";
import FormLogin from "./FormLogin";
import { motion, useReducedMotion } from "motion/react";
import { scrollReveal } from "@/shared/motion/motionTokens";

const Login = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-8 text-[#0F172A] sm:px-6 lg:px-8">
      <motion.div
        {...scrollReveal("up", prefersReducedMotion)}
        className="grid min-h-[min(760px,calc(100vh-4rem))] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]"
      >
        <aside className="relative hidden min-h-[640px] overflow-hidden bg-[#0F172A] lg:block">
          <div className="absolute inset-0 bg-[url('/images/hero/hero_1.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/25 to-[#0F172A]/10" />
          <div className="absolute left-8 top-8 flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#059669] text-lg font-bold text-[#0F172A]">P</span>
            <span className="font-semibold tracking-wide">PrestigeShop</span>
          </div>
          <div className="absolute inset-x-8 bottom-10 text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#D1FAE5]">Votre boutique, en toute simplicité</p>
            <h2 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">Le plaisir de trouver ce qu’il vous faut.</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">Retrouvez une sélection pensée pour accompagner votre quotidien.</p>
          </div>
          <span aria-hidden="true" className="absolute right-8 top-28 h-16 w-16 rounded-lg border border-[#D1FAE5]/70" />
        </aside>

        <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#047857]">Espace client <span className="ml-2 text-[#667069]">01 / 02</span></p>
              <h1 className="text-4xl font-bold leading-tight text-[#0F172A] sm:text-5xl">Heureux de vous revoir.</h1>
              <p className="mt-3 text-sm text-[#667069]">Connectez-vous pour retrouver votre espace et vos commandes.</p>
            </div>
            <FormLogin />
            <p className="mt-8 text-center text-sm text-[#667069]">
              Vous n’avez pas encore de compte ?{" "}
              <Link href="/register" className="font-semibold text-[#047857] underline decoration-[#D1FAE5] decoration-2 underline-offset-4 hover:text-[#0F172A]">Créer un compte</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;
