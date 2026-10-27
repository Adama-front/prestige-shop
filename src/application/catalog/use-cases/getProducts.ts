import type { ProductRepository } from "@/application/catalog/ports/ProductRepository";
import type { Product } from "@/domain/catalog/Product";

export const getProducts = (repository: ProductRepository) =>
  (): Promise<Product[]> => repository.getAll();
