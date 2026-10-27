import type { Product } from "@/domain/catalog/Product";

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product>;
}
