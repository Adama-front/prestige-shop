import { adminProductSchema } from "@/application/admin/adminSchemas";
import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") ?? "all";
    const q = searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    const perPage = Math.min(
      50,
      Math.max(1, Number(searchParams.get("perPage") || "12") || 12)
    );

    const where = {
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } }
        ]
      }),
      ...(filter === "published" && { isPublished: true }),
      ...(filter === "draft" && { isPublished: false }),
      ...(filter === "new" && { isNew: true }),
      ...(filter === "promo" && { discountPercent: { gt: 0 } }),
      ...(filter === "low-stock" && { stock: { lte: 5 } })
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } }
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * perPage,
        take: perPage
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      data: products.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        priceXof: p.priceXof,
        stock: p.stock,
        isPublished: p.isPublished,
        isNew: p.isNew,
        discountPercent: p.discountPercent,
        categoryId: p.categoryId,
        category: p.category,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
      })),
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.max(1, Math.ceil(total / perPage))
      }
    });
  } catch (err) {
    console.error("GET /api/v1/admin/products failed", err);
    return apiError("service_unavailable", "Impossible de charger les produits.", 503);
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

    const parsed = adminProductSchema.safeParse(payload);
    if (!parsed.success) return validationError(parsed.error.issues);

    const category = await prisma.category.findUnique({
      where: { id: parsed.data.categoryId }
    });
    if (!category) {
      return apiError("category_not_found", "La catégorie sélectionnée n'existe pas.", 404);
    }

    const created = await prisma.product.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        imageUrl: parsed.data.imageUrl,
        categoryId: parsed.data.categoryId,
        priceXof: parsed.data.priceXof,
        stock: parsed.data.stock,
        isPublished: parsed.data.isPublished,
        isNew: parsed.data.isNew,
        discountPercent: parsed.data.discountPercent
      },
      include: {
        category: { select: { id: true, name: true, slug: true } }
      }
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/v1/admin/products failed", err);
    return apiError("service_unavailable", "Impossible de créer le produit.", 503);
  }
}
