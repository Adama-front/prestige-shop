import { productIdSchema } from "@/application/catalog/productQuerySchema";
import { prismaProductRepository } from "@/infrastructure/catalog/PrismaProductRepository";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;
  const parsedId = productIdSchema.safeParse(productId);
  if (!parsedId.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "L’identifiant du produit est invalide."
        }
      },
      { status: 422 }
    );
  }

  try {
    const product = await prismaProductRepository.getById(parsedId.data);
    if (!product) {
      return NextResponse.json(
        { error: { code: "product_not_found", message: "Produit non trouvé." } },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("GET /api/v1/products/:productId failed", error);
    return NextResponse.json(
      {
        error: {
          code: "catalog_unavailable",
          message: "Le catalogue est temporairement indisponible."
        }
      },
      { status: 503 }
    );
  }
}
