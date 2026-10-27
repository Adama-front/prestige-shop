import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/application/auth/authSlice";
import cartReducer from "@/application/cart/cartSlice";
import productsReducer from "@/application/catalog/productsSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer
  }
});

export default store;
