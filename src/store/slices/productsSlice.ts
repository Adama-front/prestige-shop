import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fonction pour récupérer tous les produits depuis une API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des produits");
    }
    return await response.json();
  }
);

// Fonction pour récupérer un produit par ID depuis une API
export const getById = createAsyncThunk(
  "products/getById",
  async (id: number) => {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) {
      throw new Error("Produit non trouvé");
    }
    return await response.json();
  }
);

// Définition de l'interface Product
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  discount?: number;
  rating: {
    rate: number;
    count: number;
  };
  createdAt: string;
  stock: number;
}

// Définition de l'état initial avec des types corrects
const initialState: {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedProduct: Product | null;
} = {
  items: [],
  status: "idle",
  error: null,
  selectedProduct: null
};

// Création du slice Redux
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct =
        state.items.find((product) => product.id === action.payload) || null;
    },
    filterByCategory: (state, action) => {
      state.items = state.items.filter(
        (product) =>
          product.category.toLowerCase() === action.payload.toLowerCase()
      );
    },
    resetProducts: (state) => {
      state.items = [];
    },
    sortProducts: (state, action) => {
      if (state.items.length > 0) {
        switch (action.payload) {
          case "price-low-high":
            state.items.sort((a, b) => a.price - b.price);
            break;
          case "price-high-low":
            state.items.sort((a, b) => b.price - a.price);
            break;
          default:
            console.warn("Critère de tri inconnu");
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
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

      // Get Product By ID
      .addCase(getById.pending, (state) => {
        state.status = "loading";
        state.selectedProduct = null;
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

// Export des actions et du reducer
export const {
  setSelectedProduct,
  filterByCategory,
  resetProducts,
  sortProducts
} = productsSlice.actions;
export default productsSlice.reducer;
