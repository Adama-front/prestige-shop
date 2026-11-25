"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Footer from "@/presentation/components/Layout/Footer";
import Header from "@/presentation/components/Layout/Header";
import { motionTokens } from "@/shared/motion/motionTokens";

/**
 * SiteChrome — layout shell pour les pages publiques.
 *
 * La vérification du mode maintenance est désormais gérée côté serveur
 * dans le middleware (src/middleware.ts) qui redirige vers /maintenance.
 * Cette version est simplifiée : plus de fetch côté client.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const isAuthPage = pathname === "/auth/login" || pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin");
  const isMaintenancePage = pathname === "/maintenance";

  // Les pages admin et maintenance ont leur propre layout complet
  if (isAdminPage || isMaintenancePage) {
    return <>{children}</>;
  }

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
