import { adminCategorySchema } from "@/application/admin/adminSchemas";
import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { Prisma } from "@/generated/prisma/client";
import { slugify } from "@/shared/utils/slugify";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({
      data: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        productsCount: cat._count.products,
        createdAt: cat.createdAt.toISOString()
      }))
    });
  } catch (err) {
    console.error("GET /api/v1/admin/categories failed", err);
    return apiError("service_unavailable", "Impossible de charger les catégories.", 503);
  }
}

export async function POST(request: Request) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("validation_error", "Le corps JSON est invalide.", 422);
    }

    const parsed = adminCategorySchema.safeParse(payload);
    if (!parsed.success) return validationError(parsed.error.issues);

    const slug = parsed.data.slug || slugify(parsed.data.name);
    if (!slug) {
      return apiError("validation_error", "Le slug généré est invalide.", 422);
    }

    try {
      const created = await prisma.category.create({
        data: { name: parsed.data.name, slug },
        include: { _count: { select: { products: true } } }
      });

      return NextResponse.json(
        {
          data: {
            id: created.id,
            name: created.name,
            slug: created.slug,
            productsCount: created._count.products,
            createdAt: created.createdAt.toISOString()
          }
        },
        { status: 201 }
      );
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return apiError(
          "duplicate_slug",
          "Une catégorie avec ce slug existe déjà.",
          409
        );
      }
      throw err;
    }
  } catch (err) {
    console.error("POST /api/v1/admin/categories failed", err);
    return apiError("service_unavailable", "Impossible de créer la catégorie.", 503);
  }
}
