import { apiError } from "@/infrastructure/api/responses";
import { clearUserSession } from "@/infrastructure/auth/sessions";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    await clearUserSession();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("POST /api/v1/auth/logout failed", error);
    return apiError(
      "service_unavailable",
      "La déconnexion est temporairement indisponible.",
      503
    );
  }
}
