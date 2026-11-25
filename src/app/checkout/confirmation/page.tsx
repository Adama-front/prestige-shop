"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { scrollReveal } from "@/shared/motion/motionTokens";
import { Suspense, useEffect, useState } from "react";
import { getOrder, type OrderDto } from "@/infrastructure/orders/OrderApiClient";
import { formatXof } from "@/shared/utils/formatXof";

const ConfirmationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      setError("Aucune commande n’a été indiquée.");
      return;
    }

    let isCurrent = true;
    setIsLoading(true);
    void getOrder(orderId)
      .then((result) => {
        if (isCurrent) setOrder(result);
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Impossible de charger la commande."
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [orderId]);

  return (
    <section className="bg-white text-black pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col gap-y-6">
          <div className="flex w-full items-center justify-center">
            <motion.h2 {...scrollReveal("up", prefersReducedMotion)} className="text-2xl md:text-3xl font-bold text-gray-900">
              {isLoading ? "Chargement de votre commande…" : order ? "Commande confirmée" : "Commande introuvable"}
            </motion.h2>
          </div>

          <div className="w-full flex items-start">
            <button
              onClick={() => router.push("/")}
              className="md:px-3 md:py-2 py-1.5 px-2 flex items-center gap-x-1 justify-center bg-[#059669] text-[#0F172A] duration-300 text-xs md:text-sm cursor-pointer rounded-md hover:bg-[#047857] transition-colors"
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
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#F1F5F9] mb-4">
                <svg
                  className="h-6 w-6 text-[#047857]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  d={order ? "M5 12l4 4L19 6" : "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isLoading
                  ? "Nous récupérons le récapitulatif."
                  : order
                    ? `Merci ${order.deliveryAddress.firstName}, votre commande est enregistrée.`
                    : "Nous n’avons pas pu charger cette commande."}
              </h3>
              {error && <p role="alert" className="text-sm text-red-700 mb-4">{error}</p>}
              {order && (
                <div className="mb-6 border-y border-[#E2E8F0] py-4 text-left">
                  <p className="text-sm text-gray-600">Référence : <span className="font-medium text-[#0F172A]">{order.id}</span></p>
                  <p className="mt-2 text-sm text-gray-600">Paiement à la livraison</p>
                  <p className="mt-3 flex justify-between font-semibold text-[#0F172A]">
                    <span>Total</span><span className="text-[#047857]">{formatXof(order.totalXof)}</span>
                  </p>
                </div>
              )}
              {!order && !isLoading && !error && (
                <p className="text-sm text-gray-500 mb-6">Vérifiez le lien ou reconnectez-vous pour consulter vos commandes.</p>
              )}
              <Link
                href={order ? "/" : "/cart"}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#059669] hover:bg-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#059669] transition-colors duration-300"
              >
                {order ? "Continuer mes achats" : "Retourner au panier"}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-white" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
