import { apiError } from "@/infrastructure/api/responses";
import { getCurrentUser } from "@/infrastructure/auth/sessions";
import { prismaOrderRepository, toOrderDto } from "@/infrastructure/orders/PrismaOrderRepository";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("unauthenticated", "Connexion requise.", 401);

    const { orderId } = await context.params;
    if (!orderId || orderId.length > 64) {
      return apiError("order_not_found", "Commande non trouvée.", 404);
    }

    const order = await prismaOrderRepository.getForUser(user.id, orderId);
    if (!order) return apiError("order_not_found", "Commande non trouvée.", 404);
    return NextResponse.json({ data: toOrderDto(order) });
  } catch (error) {
    console.error("GET /api/v1/orders/:orderId failed", error);
    return apiError("service_unavailable", "La commande est indisponible.", 503);
  }
}
