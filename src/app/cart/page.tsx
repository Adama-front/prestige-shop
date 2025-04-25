"use client";
import Alert from "@/components/ui/Alert";
import OptimizedImage from "@/components/ui/OptimizedImage";
import {
  clearCart,
  removeFromCart,
  updateQuantity
} from "@/store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/types";
import Link from "next/link";
import { useState } from "react";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, total, shippingCost } = useAppSelector((state) => state.cart);
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
  }>({
    show: false,
    message: "",
    type: "success"
  });

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    const itemToRemove = items.find((item) => item.id === id);
    dispatch(removeFromCart(id));
    setAlertInfo({
      show: true,
      message: `${itemToRemove?.name || "Produit"} a été supprimé du panier`,
      type: "info"
    });
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setAlertInfo({
      show: true,
      message: "Votre panier a été vidé",
      type: "warning"
    });
  };

  const calculateTotal = () => {
    return total + shippingCost;
  };

  if (items.length === 0) {
    return (
      <div className="flex w-full items-center bg-white text-black justify-center pt-28 pb-12">
        <div className="flex w-full shadow-xl items-center justify-center flex-col gap-y-5 min-h-[70vh] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:w-28 md:h-28 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="md:w-16 md:h-16 w-10 h-10"
              viewBox="0 -0.5 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.3147 30.9442C11.9424 30.9442 13.2618 29.6247 13.2618 27.9971C13.2618 26.3695 11.9424 25.05 10.3147 25.05C8.68712 25.05 7.36768 26.3695 7.36768 27.9971C7.36768 29.6247 8.68712 30.9442 10.3147 30.9442Z"
                fill="#2ECC71"
              />
              <path
                d="M26.5232 30.9442C28.1509 30.9442 29.4703 29.6247 29.4703 27.9971C29.4703 26.3695 28.1509 25.05 26.5232 25.05C24.8956 25.05 23.5762 26.3695 23.5762 27.9971C23.5762 29.6247 24.8956 30.9442 26.5232 30.9442Z"
                fill="#2ECC71"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M30.526 5.89412H7.44717L6.60911 2.28116C6.45421 1.61335 6.1084 1.0662 5.57167 0.63972C5.03494 0.21324 4.42381 0 3.73827 0H1.47353C0.659722 0 0 0.659722 0 1.47353C0 2.28733 0.659722 2.94706 1.47353 2.94706H3.73827L4.42186 5.89412H4.42059L8.21564 22.4326C8.29244 22.7673 8.46515 23.0416 8.73378 23.2556C9.0024 23.4695 9.30842 23.5765 9.65183 23.5765H26.8066C27.1441 23.5765 27.4459 23.4728 27.7121 23.2654C27.9783 23.0581 28.1527 22.7908 28.2354 22.4635L31.9547 7.72829C32.0103 7.50802 32.0147 7.28674 31.968 7.06443C31.9212 6.84212 31.828 6.64136 31.6884 6.46214C31.5488 6.28293 31.377 6.14345 31.1728 6.04372C30.9688 5.94399 30.7532 5.89412 30.526 5.89412Z"
                fill="url(#paint0_linear_103_1445)"
              />
              <g style={{ mixBlendMode: "hard-light" }}>
                <g style={{ mixBlendMode: "hard-light" }}>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.95667 10.7179C8.94284 10.661 8.93245 10.6034 8.91504 10.5453C8.91504 10.4871 8.91504 10.4287 8.91504 10.3701C8.91504 9.96323 9.0589 9.61592 9.34663 9.32819C9.63435 9.04047 9.98167 8.89661 10.3886 8.89661C10.7285 8.89661 11.0321 9.00165 11.2993 9.21174C11.5665 9.42183 11.7402 9.69203 11.8205 10.0224L13.9565 18.817L13.9567 18.8175C13.9705 18.8744 13.9809 18.932 13.9878 18.9901C13.9948 19.0483 13.9983 19.1067 13.9983 19.1653C13.9983 19.5722 13.8544 19.9195 13.5667 20.2072C13.279 20.4949 12.9317 20.6388 12.5248 20.6388C12.1848 20.6388 11.8813 20.5338 11.614 20.3237C11.3468 20.1136 11.1731 19.8434 11.0929 19.5131L8.95667 10.7179ZM17.6405 10.059C17.5603 9.72864 17.3865 9.45844 17.1193 9.24835C16.8521 9.03826 16.5485 8.93321 16.2086 8.93321C15.8017 8.93321 15.4544 9.07707 15.1666 9.3648C14.8789 9.65252 14.7351 9.99984 14.7351 10.4067C14.7351 10.4653 14.7385 10.5237 14.7455 10.5819C14.7525 10.64 14.7629 10.6976 14.7767 10.7545L16.9129 19.5497C16.9931 19.88 17.1668 20.1502 17.4341 20.3603C17.7013 20.5704 18.0049 20.6754 18.3448 20.6754C18.7517 20.6754 19.099 20.5315 19.3867 20.2438C19.6744 19.9561 19.8183 19.6088 19.8183 19.2019C19.8183 19.1433 19.8148 19.0849 19.8079 19.0267C19.8009 18.9686 19.7905 18.911 19.7767 18.8541L19.7766 18.8536L17.6405 10.059Z"
                    fill="white"
                    fillOpacity="0.6"
                  />
                </g>
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_103_1445"
                  x1="0"
                  y1="0"
                  x2="19.7144"
                  y2="29.6608"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#A3BE8C" />
                  <stop offset="1" stop-color="#2ECC71" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-center">
            Votre panier est actuellement vide
          </h2>
          <p className="text-center">
            Parcourez notre sélection et trouvez les articles parfaits pour vous
            !
          </p>
          <Link href="/#products">
            <button className="text-white cursor-pointer md:text-sm bg-[#2ECC71] px-4 py-2 hover:bg-[#A3BE8C] transition-colors duration-300 flex items-center gap-2">
              Explorer nos produits
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {alertInfo.show && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        />
      )}
      <section className="bg-white text-black pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col gap-y-6">
            <div className="flex w-full items-start justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Mon Panier
              </h2>
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white font-bold hover:bg-red-600 cursor-pointer  text-xs md:text-sm p-2 transition-colors duration-300 flex items-center gap-x-1"
              >
                <svg
                  className="md:h-5 md:w-5 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span> Vider le panier</span>
              </button>
            </div>

            {/* Information sur les frais de livraison */}
            <div className="bg-green-50 px-2 py-4   md:p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="md:ml-3 ml-1">
                  <h3 className="md:text-sm text-xs font-medium text-green-800">
                    Frais de livraison
                  </h3>
                  <div className="mt-2 md:text-sm text-xs text-green-700">
                    <ul className="list-disc pl-3 md:pl-5 space-y-1">
                      <li>
                        Livraison gratuite pour les commandes de 100€ et plus
                      </li>
                      <li>Frais de 5€ pour les commandes entre 50€ et 100€</li>
                      <li>Frais de 10€ pour les commandes de moins de 50€</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}

              <div className="lg:col-span-2">
                <div className="bg-white  shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 ">
                        <tr>
                          <th className="px-7 py-3 text-left text-xs  font-medium text-gray-500 uppercase tracking-wider">
                            Produit
                          </th>
                          <th className="px-9 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prix
                          </th>
                          <th className="px-7 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantité
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-16 w-16 flex-shrink-0 bg-gray-100  overflow-hidden">
                                  <OptimizedImage
                                    src={item.image}
                                    alt={item.name}
                                    className="h-16 w-16"
                                  />
                                </div>
                                <div className="ml-4">
                                  <Link
                                    href={`/products/${item.id}`}
                                    className="text-sm font-medium text-gray-900 hover:text-[#2ECC71] duration-300 transition-colors"
                                  >
                                    {item.name
                                      .split(" ")
                                      .slice(0, 3)
                                      .join(" ") +
                                      (item.name.split(" ").length > 3
                                        ? "..."
                                        : "")}
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                              {item.price.toFixed(2)} €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-20 text-center  outline-none  shadow-xl focus:ring-1 focus:ring-[#2ECC71] "
                              />
                            </td>

                            <td className=" pl-11 whitespace-nowrap text-center ">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-600 hover:bg-red-100 p-2 flex items-center justify-center cursor-pointer transition-colors duration-300"
                              >
                                <svg
                                  className="h-5 w-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white w-full  shadow-xl p-2 md:p-4">
                  <div className="w-full flex items-center justify-between mb-4">
                    {" "}
                    <h3 className="text-sm uppercase font-semibold text-gray-900">
                      Résumé de la commande
                    </h3>
                    <span className="text-sm">
                      ({items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      article
                      {items.reduce((sum, item) => sum + item.quantity, 0) > 1
                        ? "s"
                        : ""}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="text-gray-900">
                        {total.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <span className="text-gray-600">
                          Frais de livraison
                        </span>
                        {total < 100 && (
                          <div className="text-xs text-[#2ECC71] mt-1">
                            {total < 50 ? (
                              <span>
                                Ajoutez {(50 - total).toFixed(2)} € pour réduire
                                les frais à 5€
                              </span>
                            ) : (
                              <span>
                                Ajoutez {(100 - total).toFixed(2)} € pour la
                                livraison gratuite
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span
                        className={`${
                          shippingCost === 0
                            ? "text-green-600 font-medium"
                            : "text-gray-900"
                        }`}
                      >
                        {shippingCost === 0
                          ? "Gratuit"
                          : `${shippingCost.toFixed(2)} €`}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-lg font-semibold text-[#2ECC71]">
                          {calculateTotal().toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-y-3">
                    <Link href="/checkout">
                      <button className="w-full bg-[#2ECC71] cursor-pointer text-white py-3 px-4  hover:bg-[#A3BE8C] transition-colors duration-300">
                        Passer à la caisse
                      </button>
                    </Link>
                    <Link href="/#products">
                      <button className="w-full border border-[#2ECC71] hover:border-[#A3BE8C] cursor-pointer text-[#2ECC71] py-3 px-4 hover:bg-[#A3BE8C] hover:text-white transition-colors duration-300">
                        Continuer les achats
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
