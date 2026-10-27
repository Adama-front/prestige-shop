import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddCartItemInput, CartItem } from "@/domain/cart/CartItem";
import { calculateShippingCost } from "@/application/cart/calculateShippingCost";

const initialState = {
  items: [] as CartItem[],
  total: 0,
  shippingCost: 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddCartItemInput>) => {
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
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Recalculer les frais de livraison
      state.shippingCost = calculateShippingCost(state.total);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
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
    updateShippingCost: (state, action: PayloadAction<number>) => {
      state.shippingCost = action.payload;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateShippingCost
} = cartSlice.actions;

export default cartSlice.reducer;
