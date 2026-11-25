import { adminOrderStatusSchema } from "@/application/admin/adminSchemas";
import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ orderId: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const { orderId } = await params;

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("validation_error", "Le corps JSON est invalide.", 422);
    }

    const parsed = adminOrderStatusSchema.safeParse(payload);
    if (!parsed.success) return validationError(parsed.error.issues);

    try {
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: { status: parsed.data.status },
        select: { id: true, status: true, updatedAt: true }
      });

      return NextResponse.json({ data: updated });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return apiError("order_not_found", "Commande introuvable.", 404);
      }
      throw err;
    }
  } catch (err) {
    console.error("PATCH /api/v1/admin/orders/[orderId] failed", err);
    return apiError("service_unavailable", "Impossible de modifier la commande.", 503);
  }
}
