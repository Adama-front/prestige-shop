import type { Product } from "@/domain/catalog/Product";
import type { ProductRepository } from "@/application/catalog/ports/ProductRepository";
import { z } from "zod";

const productDtoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string().min(1),
    slug: z.string().min(1)
  }),
  imageUrl: z.string().url(),
  priceXof: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  isNew: z.boolean().optional(),
  discountPercent: z.number().min(1).max(100).nullable(),
  createdAt: z.string().datetime(),
  rating: z.object({
    average: z.number().min(1).max(5).nullable(),
    count: z.number().int().nonnegative()
  })
});

const productListResponseSchema = z.object({
  data: z.array(productDtoSchema),
  meta: z.object({
    page: z.number().int().positive(),
    perPage: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative()
  })
});

const productResponseSchema = z.object({ data: productDtoSchema });

type ProductDto = z.infer<typeof productDtoSchema>;

const toProduct = (dto: ProductDto): Product => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  category: dto.category.name,
  image: dto.imageUrl,
  price: dto.priceXof,
  stock: dto.stock,
  isNew: dto.isNew,
  discount: dto.discountPercent ?? undefined,
  createdAt: dto.createdAt,
  rating: {
    rate: dto.rating.average,
    count: dto.rating.count
  }
});

class CatalogApiError extends Error {}

const fetchJson = async (url: string): Promise<unknown> => {
  try {
    const response = await fetch(url, { cache: "no-store" });
    const payload: unknown = await response.json();
    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null && "error" in payload &&
        typeof payload.error === "object" && payload.error !== null &&
        "message" in payload.error && typeof payload.error.message === "string"
          ? payload.error.message
          : "Impossible de charger le catalogue.";
      throw new CatalogApiError(message);
    }
    return payload;
  } catch (error) {
    if (error instanceof CatalogApiError) throw error;
    throw new CatalogApiError(
      "Impossible de joindre le catalogue. Vérifiez votre connexion puis réessayez."
    );
  }
};

export class CatalogApiProductRepository implements ProductRepository {
  async getAll(): Promise<Product[]> {
    const firstPagePayload = await fetchJson(
      "/api/v1/products?perPage=100&page=1"
    );
    const firstPage = productListResponseSchema.safeParse(firstPagePayload);
    if (!firstPage.success) {
      throw new CatalogApiError("Le catalogue a renvoyé une réponse invalide.");
    }

    const remainingPages = Array.from(
      { length: Math.max(firstPage.data.meta.totalPages - 1, 0) },
      (_, index) => index + 2
    );
    const laterPages = await Promise.all(
      remainingPages.map(async (page) => {
        const payload = await fetchJson(
          `/api/v1/products?perPage=100&page=${page}`
        );
        const parsed = productListResponseSchema.safeParse(payload);
        if (!parsed.success) {
          throw new CatalogApiError("Le catalogue a renvoyé une réponse invalide.");
        }
        return parsed.data.data;
      })
    );

    return [...firstPage.data.data, ...laterPages.flat()].map(toProduct);
  }

  async getById(id: number): Promise<Product> {
    const payload = await fetchJson(`/api/v1/products/${id}`);
    const parsed = productResponseSchema.safeParse(payload);
    if (!parsed.success) {
      throw new CatalogApiError("Le catalogue a renvoyé un produit invalide.");
    }
    return toProduct(parsed.data.data);
  }
}
