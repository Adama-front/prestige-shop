"use client";
import Alert from "@/presentation/components/ui/Alert";
import OptimizedImage from "@/presentation/components/ui/OptimizedImage";
import { useAppSelector } from "@/application/store/hooks";
import Link from "next/link";
import { Suspense, useState } from "react";
import { formatXof } from "@/shared/utils/formatXof";
import { motion, useReducedMotion } from "framer-motion";
import { scrollReveal } from "@/shared/motion/motionTokens";

const CheckoutContent = () => {
  const prefersReducedMotion = useReducedMotion();
  const { items, total, shippingCost } = useAppSelector((state) => state.cart);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone1: "",
    phone2: "",
    city: "",
    district: "",
    address: "",
    additionalInfo: ""
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(true);
  };

  const calculateTotal = () => {
    return total + shippingCost;
  };

  if (items.length === 0) {
    return (
      <section className="bg-white text-black pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center">
          <motion.h1 {...scrollReveal("up", prefersReducedMotion)} className="text-2xl md:text-3xl font-bold text-gray-900">
            Votre panier est vide
          </motion.h1>
          <p className="max-w-xl text-gray-600">
            Ajoutez des produits à votre panier avant de préparer une commande.
          </p>
          <Link href="/#products" className="bg-[#F98909] text-[#171B18] px-5 py-3 hover:bg-[#D9EC8B] transition-colors duration-300">
            Explorer nos produits
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {showAlert && (
        <Alert
          message="Aucune commande n’a été envoyée. Les informations saisies ne sont ni enregistrées ni transmises. La création de commande sera disponible après l’intégration du backend."
          type="warning"
          duration={8000}
          onClose={() => setShowAlert(false)}
        />
      )}
      <section className="bg-white text-black pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col gap-y-6">
            <div className="flex w-full items-center justify-center">
              <motion.h2 {...scrollReveal("up", prefersReducedMotion)} className="text-2xl md:text-3xl font-bold text-gray-900">
                Finaliser votre commande
              </motion.h2>
            </div>
            <div className="w-full flex items-start">
              <Link href="/cart" className="md:px-3 md:py-2 py-1.5 px-2 flex items-center gap-x-1 justify-center bg-[#F98909] text-[#171B18] duration-300 text-xs md:text-sm hover:bg-[#D9EC8B] transition-colors">
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
              </Link>
            </div>

            <motion.div {...scrollReveal("up", prefersReducedMotion)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping Address Form */}
              <div className="lg:col-span-2">
                <div className="bg-white  shadow-xl p-2 md:p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Adresse de livraison
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Prénom
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          autoComplete="given-name"
                          maxLength={80}
                          required
                          className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#F98909] focus:border-[#F98909]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nom
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          autoComplete="family-name"
                          maxLength={80}
                          required
                          className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#F98909] focus:border-[#F98909]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="phone1"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Numéro de téléphone principal
                        </label>
                        <input
                          type="tel"
                          id="phone1"
                          name="phone1"
                          value={formData.phone1}
                          onChange={handleChange}
                          autoComplete="tel"
                          inputMode="tel"
                          maxLength={24}
                          required
                          className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#F98909] focus:border-[#F98909]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone2"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Numéro de téléphone secondaire
                        </label>
                        <input
                          type="tel"
                          id="phone2"
                          name="phone2"
                          value={formData.phone2}
                          onChange={handleChange}
                          inputMode="tel"
                          maxLength={24}
                          className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#F98909] focus:border-[#F98909]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Ville
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          autoComplete="address-level2"
                          maxLength={100}
                          required
                          className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#F98909] focus:border-[#F98909]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="district"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Quartier
                        </label>
                        <input
                          type="text"
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          autoComplete="address-level3"
                          maxLength={100}
                          required
                          className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#F98909] focus:border-[#F98909]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Adresse complète
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        autoComplete="street-address"
                        maxLength={200}
                        required
                        className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#F98909] focus:border-[#F98909]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="additionalInfo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Informations supplémentaires (optionnel)
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        maxLength={500}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#F98909] focus:border-[#F98909]"
                        placeholder="Instructions de livraison, points de repère, etc."
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-[#F98909] text-[#171B18] py-3 px-4 cursor-pointer hover:bg-[#D9EC8B] transition-colors duration-300"
                      >
                        Vérifier le formulaire
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Review */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-xl p-2 md:p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Récapitulatif de votre commande
                  </h3>

                  {/* Payment Notice */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 font-medium">
                          Commande non envoyée
                        </p>
                        <p className="text-sm text-yellow-600 mt-1">
                          Ce formulaire ne crée aucune commande et ne transmet
                          aucune donnée. Cette étape sera activée avec le backend.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Articles (
                      {items.reduce((sum, item) => sum + item.quantity, 0)})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 bg-gray-100 overflow-hidden">
                            <OptimizedImage
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <div className="w-full">
                                <Link
                                  href={`/products/${item.id}`}
                                  className="text-sm font-medium text-gray-900 hover:text-[#F98909] duration-300 transition-colors"
                                >
                                  {item.name.split(" ").slice(0, 4).join(" ") +
                                    (item.name.split(" ").length > 3
                                      ? "..."
                                      : "")}
                                </Link>
                                <div className="flex items-center text-sm text-gray-500 justify-between">
                                  <p>Quantité: {item.quantity}</p>
                                  <p>
                                    Prix:{" "}
                                    {formatXof(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Sous-total
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatXof(total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Frais de livraison
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            shippingCost === 0
                              ? "text-green-600"
                              : "text-gray-900"
                          }`}
                        >
                          {shippingCost === 0
                            ? "Gratuit"
                            : formatXof(shippingCost)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-base font-semibold text-gray-900">
                            Total
                          </span>
                          <span className="text-base font-semibold text-[#F98909]">
                            {formatXof(calculateTotal())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

const Checkout = () => (
  <Suspense fallback={<div className="min-h-[40vh] bg-[var(--background)]" />}>
    <CheckoutContent />
  </Suspense>
);

export default Checkout;
