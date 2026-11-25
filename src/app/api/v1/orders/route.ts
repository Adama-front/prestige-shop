import { createOrderSchema } from "@/application/orders/createOrderSchema";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { getCurrentUser } from "@/infrastructure/auth/sessions";
import { prisma } from "@/infrastructure/database/prisma";
import {
  prismaOrderRepository,
  OrderAmountTooLargeError,
  ProductUnavailableError,
  StockUnavailableError,
  toOrderDto
} from "@/infrastructure/orders/PrismaOrderRepository";
import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("unauthenticated", "Connexion requise.", 401);

    const orders = await prismaOrderRepository.listForUser(user.id);
    return NextResponse.json({ data: orders.map(toOrderDto) });
  } catch (error) {
    console.error("GET /api/v1/orders failed", error);
    return apiError("service_unavailable", "Les commandes sont indisponibles.", 503);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("unauthenticated", "Connexion requise.", 401);

    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (!idempotencyKey || idempotencyKey.length > 128) {
      return apiError(
        "validation_error",
        "La clé de commande est manquante ou invalide.",
        422
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("validation_error", "Le corps JSON est invalide.", 422);
    }

    const parsed = createOrderSchema.safeParse(payload);
    if (!parsed.success) return validationError(parsed.error.issues);

    try {
      const order = await prismaOrderRepository.create(
        user.id,
        idempotencyKey,
        parsed.data
      );
      return NextResponse.json(
        { data: toOrderDto(order) },
        {
          status: 201,
          headers: { Location: `/api/v1/orders/${order.id}` }
        }
      );
    } catch (error) {
      if (error instanceof StockUnavailableError) {
        return apiError("stock_unavailable", error.message, 409);
      }
      if (error instanceof ProductUnavailableError) {
        return apiError("product_not_found", error.message, 409);
      }
      if (error instanceof OrderAmountTooLargeError) {
        return apiError("validation_error", error.message, 422);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const existingOrder = await prisma.order.findUnique({
          where: { userId_idempotencyKey: { userId: user.id, idempotencyKey } },
          include: { items: true }
        });
        if (existingOrder) {
          return NextResponse.json({ data: toOrderDto(existingOrder) });
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("POST /api/v1/orders failed", error);
    return apiError(
      "service_unavailable",
      "La commande ne peut pas être créée pour le moment.",
      503
    );
  }
}
