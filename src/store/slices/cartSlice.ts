import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const initialState = {
  items: [] as CartItem[],
  total: 0,
  shippingCost: 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...action.payload, quantity });
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Calculer les frais de livraison en fonction du total
      state.shippingCost = calculateShippingCost(state.total);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Recalculer les frais de livraison
      state.shippingCost = calculateShippingCost(state.total);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Recalculer les frais de livraison
        state.shippingCost = calculateShippingCost(state.total);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.shippingCost = 0;
    },
    updateShippingCost: (state, action) => {
      state.shippingCost = action.payload;
    }
  }
});

// Fonction pour calculer les frais de livraison en fonction du total
const calculateShippingCost = (total: number): number => {
  // Gratuit pour les commandes de plus de 100€
  if (total >= 100) {
    return 0;
  }

  // 5€ pour les commandes entre 50€ et 100€
  if (total >= 50) {
    return 5;
  }

  // 10€ pour les commandes de moins de 50€
  return 10;
};

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateShippingCost
} = cartSlice.actions;

export default cartSlice.reducer;
