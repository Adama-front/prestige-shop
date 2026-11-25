import type { ProductQuery } from "@/application/catalog/productQuerySchema";
import { prisma } from "@/infrastructure/database/prisma";

const productSelect = {
  id: true,
  title: true,
  description: true,
  imageUrl: true,
  priceXof: true,
  stock: true,
  isNew: true,
  discountPercent: true,
  createdAt: true,
  category: {
    select: { id: true, name: true, slug: true }
  }
} as const;

export const toPublicProduct = (product: {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  priceXof: number;
  stock: number;
  isNew: boolean;
  discountPercent: number;
  createdAt: Date;
  category: { id: number; name: string; slug: string };
}) => ({
  id: product.id,
  title: product.title,
  description: product.description,
  category: {
    id: String(product.category.id),
    name: product.category.name,
    slug: product.category.slug
  },
  imageUrl: product.imageUrl,
  priceXof: product.priceXof,
  stock: product.stock,
  isNew: product.isNew,
  discountPercent: product.discountPercent > 0 ? product.discountPercent : null,
  createdAt: product.createdAt.toISOString(),
  rating: { average: null, count: 0 }
});

export class PrismaProductRepository {
  async list(query: ProductQuery) {
    const where = {
      isPublished: true,
      stock: { gt: 0 },
      ...(query.category && {
        category: { slug: query.category.toLowerCase() }
      }),
      ...(query.q && {
        OR: [
          { title: { contains: query.q, mode: "insensitive" as const } },
          { description: { contains: query.q, mode: "insensitive" as const } }
        ]
      }),
      ...(query.priceMin !== undefined || query.priceMax !== undefined
        ? {
            priceXof: {
              ...(query.priceMin !== undefined && { gte: query.priceMin }),
              ...(query.priceMax !== undefined && { lte: query.priceMax })
            }
          }
        : {})
    };

    const orderBy =
      query.sort === "price_asc"
        ? [{ priceXof: "asc" as const }, { id: "asc" as const }]
        : query.sort === "price_desc"
          ? [{ priceXof: "desc" as const }, { id: "asc" as const }]
          : [{ createdAt: "desc" as const }, { id: "desc" as const }];

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        select: productSelect,
        orderBy,
        skip: (query.page - 1) * query.perPage,
        take: query.perPage
      }),
      prisma.product.count({ where })
    ]);

    return {
      data: products.map(toPublicProduct),
      meta: {
        page: query.page,
        perPage: query.perPage,
        total,
        totalPages: Math.ceil(total / query.perPage)
      }
    };
  }

  async getById(id: number) {
    const product = await prisma.product.findFirst({
      where: { id, isPublished: true, stock: { gt: 0 } },
      select: productSelect
    });

    return product ? toPublicProduct(product) : null;
  }

  async listCategories() {
    return prisma.category.findMany({
      where: { products: { some: { isPublished: true, stock: { gt: 0 } } } },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" }
    });
  }
}

export const prismaProductRepository = new PrismaProductRepository();
