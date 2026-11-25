import { adminCategorySchema } from "@/application/admin/adminSchemas";
import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { Prisma } from "@/generated/prisma/client";
import { slugify } from "@/shared/utils/slugify";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ categoryId: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const { categoryId } = await params;
    const id = Number(categoryId);
    if (!Number.isInteger(id) || id <= 0) {
      return apiError("validation_error", "Identifiant de catégorie invalide.", 422);
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("validation_error", "Le corps JSON est invalide.", 422);
    }

    const parsed = adminCategorySchema.safeParse(payload);
    if (!parsed.success) return validationError(parsed.error.issues);

    const slug = parsed.data.slug || slugify(parsed.data.name);

    try {
      const updated = await prisma.category.update({
        where: { id },
        data: { name: parsed.data.name, slug },
        include: { _count: { select: { products: true } } }
      });

      return NextResponse.json({
        data: {
          id: updated.id,
          name: updated.name,
          slug: updated.slug,
          productsCount: updated._count.products,
          createdAt: updated.createdAt.toISOString()
        }
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return apiError(
          "duplicate_slug",
          "Une autre catégorie utilise déjà ce slug.",
          409
        );
      }
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return apiError("category_not_found", "Catégorie introuvable.", 404);
      }
      throw err;
    }
  } catch (err) {
    console.error("PATCH /api/v1/admin/categories/[categoryId] failed", err);
    return apiError("service_unavailable", "Impossible de modifier la catégorie.", 503);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const { categoryId } = await params;
    const id = Number(categoryId);
    if (!Number.isInteger(id) || id <= 0) {
      return apiError("validation_error", "Identifiant de catégorie invalide.", 422);
    }

    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    });
    if (productsCount > 0) {
      return apiError(
        "category_in_use",
        `Impossible de supprimer cette catégorie : ${productsCount} produit(s) y sont associés.`,
        409
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ data: { deleted: true, id } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return apiError("category_not_found", "Catégorie introuvable.", 404);
    }
    console.error("DELETE /api/v1/admin/categories/[categoryId] failed", err);
    return apiError("service_unavailable", "Impossible de supprimer la catégorie.", 503);
  }
}
