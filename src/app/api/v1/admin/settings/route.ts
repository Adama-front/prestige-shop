import { adminSettingsSchema } from "@/application/admin/adminSchemas";
import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_SETTINGS = {
  id: 1,
  storeName: "PrestigeShop",
  supportEmail: "contact@prestigeshop.ci",
  supportPhone: "+225 07 00 00 00 00",
  defaultShippingCostXof: 2000,
  maintenanceMode: false,
  maintenanceMessage:
    "Notre boutique est actuellement en maintenance. Nous revenons très vite !"
};

export async function GET() {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const settings = await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: {},
      create: DEFAULT_SETTINGS
    });

    return NextResponse.json({ data: settings });
  } catch (err) {
    console.error("GET /api/v1/admin/settings failed", err);
    return apiError(
      "service_unavailable",
      "Impossible de charger les paramètres.",
      503
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("validation_error", "Le corps JSON est invalide.", 422);
    }

    const parsed = adminSettingsSchema.safeParse(payload);
    if (!parsed.success) return validationError(parsed.error.issues);

    const updated = await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: { id: 1, ...parsed.data }
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("PATCH /api/v1/admin/settings failed", err);
    return apiError(
      "service_unavailable",
      "Impossible d'enregistrer les paramètres.",
      503
    );
  }
}
