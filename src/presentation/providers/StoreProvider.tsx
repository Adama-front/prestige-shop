"use client";

import store from "@/application/store/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "@/application/auth/authSlice";
import { hydrateCart } from "@/application/cart/cartSlice";

const CART_STORAGE_KEY = "prestige_cart";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    void store.dispatch(checkAuth());

    // Hydratation du panier depuis localStorage
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          store.dispatch(hydrateCart(parsed));
        }
      }
    } catch (err) {
      console.error("Échec de récupération du panier depuis localStorage", err);
    }

    // Persistance des modifications du panier dans localStorage
    let previousItems = store.getState().cart.items;
    const unsubscribe = store.subscribe(() => {
      const currentItems = store.getState().cart.items;
      if (currentItems !== previousItems) {
        previousItems = currentItems;
        try {
          if (currentItems.length > 0) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentItems));
          } else {
            localStorage.removeItem(CART_STORAGE_KEY);
          }
        } catch (err) {
          console.error("Échec de sauvegarde du panier dans localStorage", err);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
