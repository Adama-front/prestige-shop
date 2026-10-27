import type { ProductRepository } from "@/application/catalog/ports/ProductRepository";
import type { Product } from "@/domain/catalog/Product";

export const getProductById = (repository: ProductRepository) =>
  (id: number): Promise<Product> => repository.getById(id);
