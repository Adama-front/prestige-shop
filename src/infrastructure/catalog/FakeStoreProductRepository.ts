import type { Product } from "@/domain/catalog/Product";
import type { ProductRepository } from "@/application/catalog/ports/ProductRepository";
import { z } from "zod";

const API_BASE_URL = "https://fakestoreapi.com/products";
const REQUEST_TIMEOUT_MS = 12_000;

const fakeStoreProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string(),
  category: z.string().min(1),
  image: z.string().min(1),
  rating: z.object({
    rate: z.number(),
    count: z.number().int().nonnegative()
  })
});

type FakeStoreProduct = z.infer<typeof fakeStoreProductSchema>;

class CatalogRequestError extends Error {}

const fetchJson = async (url: string): Promise<unknown> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new CatalogRequestError(
        response.status === 404
          ? "Produit non trouvé"
          : `Le catalogue répond avec une erreur (${response.status}). Réessayez.`
      );
    }

    try {
      return await response.json();
    } catch {
      throw new CatalogRequestError(
        "Le catalogue a renvoyé une réponse illisible. Réessayez."
      );
    }
  } catch (error) {
    if (error instanceof CatalogRequestError) throw error;
    if (controller.signal.aborted) {
      throw new CatalogRequestError(
        "Le catalogue met trop de temps à répondre. Vérifiez votre connexion puis réessayez."
      );
    }
    throw new CatalogRequestError(
      "Impossible de joindre le catalogue. Vérifiez votre connexion puis réessayez."
    );
  } finally {
    clearTimeout(timeoutId);
  }
};

const parseProduct = (payload: unknown): FakeStoreProduct => {
  const result = fakeStoreProductSchema.safeParse(payload);
  if (!result.success) {
    throw new CatalogRequestError(
      "Le catalogue a renvoyé un produit invalide. Réessayez plus tard."
    );
  }

  return result.data;
};

// Fake Store fournit des prix de démonstration sans devise exploitable.
// Ils sont traités comme montants nominaux FCFA (arrondis), sans conversion FX.
const toProduct = (payload: FakeStoreProduct): Product => ({
  ...payload,
  price: Math.round(payload.price)
});

export class FakeStoreProductRepository implements ProductRepository {
  async getAll(): Promise<Product[]> {
    const payload = await fetchJson(API_BASE_URL);
    const result = z.array(fakeStoreProductSchema).safeParse(payload);
    if (!result.success) {
      throw new CatalogRequestError(
        "Le catalogue a renvoyé des produits invalides. Réessayez plus tard."
      );
    }

    return result.data.map(toProduct);
  }

  async getById(id: number): Promise<Product> {
    return toProduct(parseProduct(await fetchJson(`${API_BASE_URL}/${id}`)));
  }
}
