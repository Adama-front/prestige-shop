import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/domain/catalog/Product";
import { getProductById } from "@/application/catalog/use-cases/getProductById";
import { getProducts } from "@/application/catalog/use-cases/getProducts";
import { productRepository } from "@/infrastructure/catalog/productRepository";

export type { Product } from "@/domain/catalog/Product";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  getProducts(productRepository),
  {
    condition: (_, { getState }) =>
      (getState() as { products: ProductsState }).products.status !== "loading"
  }
);

export const getById = createAsyncThunk(
  "products/getById",
  getProductById(productRepository)
);

type ProductsState = {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedProduct: Product | null;
};

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  selectedProduct: null
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<number>) => {
      state.selectedProduct =
        state.items.find((product) => product.id === action.payload) ?? null;
    },
    resetProducts: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Erreur lors du chargement des produits";
      })
      .addCase(getById.pending, (state) => {
        state.status = "loading";
        state.selectedProduct = null;
        state.error = null;
      })
      .addCase(getById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload;
      })
      .addCase(getById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Produit introuvable";
      });
  }
});

export const {
  setSelectedProduct,
  resetProducts
} = productsSlice.actions;
export default productsSlice.reducer;
