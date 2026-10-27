import type { Product } from "@/domain/catalog/Product";
import type { ProductRepository } from "@/application/catalog/ports/ProductRepository";

const API_BASE_URL = "https://fakestoreapi.com/products";

type FakeStoreProduct = Omit<Product, "createdAt" | "stock">;

// Fake Store fournit des prix de démonstration sans devise exploitable.
// Ils sont traités comme montants nominaux FCFA (arrondis), sans conversion FX.
const toProduct = (payload: FakeStoreProduct): Product => ({
  ...payload,
  price: Math.round(payload.price)
});

export class FakeStoreProductRepository implements ProductRepository {
  async getAll(): Promise<Product[]> {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des produits");
    }

    const products = (await response.json()) as FakeStoreProduct[];
    return products.map(toProduct);
  }

  async getById(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Produit non trouvé");
    }

    const product = (await response.json()) as FakeStoreProduct;
    return toProduct(product);
  }
}
