import { apiError } from "@/infrastructure/api/responses";
import { getCurrentUser } from "@/infrastructure/auth/sessions";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("unauthenticated", "Connexion requise.", 401);
    return NextResponse.json({ data: { user } });
  } catch (error) {
    console.error("GET /api/v1/auth/me failed", error);
    return apiError(
      "service_unavailable",
      "La session est temporairement indisponible.",
      503
    );
  }
}
