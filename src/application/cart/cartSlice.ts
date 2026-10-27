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
      const payload = action.payload;
      if (!payload || typeof payload !== "object") return;

      const { id, quantity = 1 } = payload;
      if (
        typeof id !== "string" ||
        !id.trim() ||
        typeof payload.name !== "string" ||
        !payload.name.trim() ||
        typeof payload.image !== "string" ||
        !payload.image.trim() ||
        !Number.isFinite(payload.price) ||
        payload.price < 0 ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1
      ) {
        return;
      }

      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem && !Number.isSafeInteger(existingItem.quantity + quantity)) {
        return;
      }

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
      state.shippingCost = state.items.length
        ? calculateShippingCost(state.total)
        : 0;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Recalculer les frais de livraison
      state.shippingCost = state.items.length
        ? calculateShippingCost(state.total)
        : 0;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && Number.isSafeInteger(quantity) && quantity > 0) {
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
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
