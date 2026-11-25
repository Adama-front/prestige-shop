import { adminUpdateUserRoleSchema } from "@/application/admin/adminSchemas";
import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ userId: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { error, user: currentAdmin } = await ensureAdminApi();
    if (error || !currentAdmin) return error!;

    const { userId } = await params;

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("validation_error", "Le corps JSON est invalide.", 422);
    }

    const parsed = adminUpdateUserRoleSchema.safeParse(payload);
    if (!parsed.success) return validationError(parsed.error.issues);

    if (userId === currentAdmin.id && parsed.data.role !== "ADMIN") {
      return apiError(
        "self_demote_forbidden",
        "Vous ne pouvez pas retirer vos propres droits administrateur.",
        409
      );
    }

    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { role: parsed.data.role },
        select: { id: true, role: true }
      });

      return NextResponse.json({ data: updated });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return apiError("user_not_found", "Utilisateur introuvable.", 404);
      }
      throw err;
    }
  } catch (err) {
    console.error("PATCH /api/v1/admin/customers/[userId] failed", err);
    return apiError("service_unavailable", "Impossible de modifier le rôle.", 503);
  }
}
