import { productQuerySchema } from "@/application/catalog/productQuerySchema";
import { prismaProductRepository } from "@/infrastructure/catalog/PrismaProductRepository";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsedQuery = productQuerySchema.safeParse(
    Object.fromEntries(url.searchParams.entries())
  );

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Les filtres du catalogue sont invalides.",
          details: parsedQuery.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        }
      },
      { status: 422 }
    );
  }

  try {
    const result = await prismaProductRepository.list(parsedQuery.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/v1/products failed", error);
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
