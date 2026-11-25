import { prismaProductRepository } from "@/infrastructure/catalog/PrismaProductRepository";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const categories = await prismaProductRepository.listCategories();
    return NextResponse.json({
      data: categories.map((category) => ({
        id: String(category.id),
        name: category.name,
        slug: category.slug
      }))
    });
  } catch (error) {
    console.error("GET /api/v1/categories failed", error);
    return NextResponse.json(
      {
        error: {
          code: "catalog_unavailable",
          message: "Les catégories sont temporairement indisponibles."
        }
      },
      { status: 503 }
    );
  }
}
