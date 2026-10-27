"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Footer from "@/presentation/components/Layout/Footer";
import Header from "@/presentation/components/Layout/Header";
import { motionTokens } from "@/shared/motion/motionTokens";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isAuthPage = pathname === "/auth/login" || pathname === "/register";

  return (
    <>
      {!isAuthPage && <Header />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: prefersReducedMotion
              ? motionTokens.duration.fast
              : motionTokens.duration.normal,
            ease: motionTokens.easing
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {!isAuthPage && <Footer />}
    </>
  );
}
