import { adminProductPatchSchema } from "@/application/admin/adminSchemas";
import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ productId: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const { productId } = await params;
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) {
      return apiError("validation_error", "Identifiant de produit invalide.", 422);
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("validation_error", "Le corps JSON est invalide.", 422);
    }

    const parsed = adminProductPatchSchema.safeParse(payload);
    if (!parsed.success) return validationError(parsed.error.issues);

    if (parsed.data.categoryId !== undefined) {
      const cat = await prisma.category.findUnique({
        where: { id: parsed.data.categoryId }
      });
      if (!cat) {
        return apiError("category_not_found", "La catégorie sélectionnée n'existe pas.", 404);
      }
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return apiError("product_not_found", "Produit introuvable.", 404);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
      include: {
        category: { select: { id: true, name: true, slug: true } }
      }
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("PATCH /api/v1/admin/products/[productId] failed", err);
    return apiError("service_unavailable", "Impossible de mettre à jour le produit.", 503);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const { productId } = await params;
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) {
      return apiError("validation_error", "Identifiant de produit invalide.", 422);
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return apiError("product_not_found", "Produit introuvable.", 404);
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ data: { deleted: true, id } });
  } catch (err) {
    console.error("DELETE /api/v1/admin/products/[productId] failed", err);
    return apiError("service_unavailable", "Impossible de supprimer le produit.", 503);
  }
}

