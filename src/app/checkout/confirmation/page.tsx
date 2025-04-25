"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ConfirmationPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page d'accueil après 10 secondes
    const timeout = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <section className="bg-white text-black pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col gap-y-6">
          <div className="flex w-full items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Commande confirmée
            </h2>
          </div>

          <div className="w-full flex items-start">
            <button
              onClick={() => router.push("/")}
              className="md:px-3 md:py-2 py-1.5 px-2 flex items-center gap-x-1 justify-center bg-[#2ECC71] text-white duration-300 text-xs md:text-sm cursor-pointer hover:bg-[#A3BE8C] transition-colors"
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

          <div className="bg-white shadow-xl p-6 md:p-8 rounded-lg">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Merci pour votre commande !
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Votre commande a été confirmée avec succès. Vous serez redirigé
                vers la page d&apos;accueil dans quelques secondes.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium  shadow-sm text-white bg-[#2ECC71] hover:bg-[#A3BE8C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2ECC71] transition-colors duration-300"
              >
                Retourner à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmationPage;
