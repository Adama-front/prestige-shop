import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import type { OrderStatus } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const VALID_STATUSES = new Set<OrderStatus>([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
]);

export async function GET(request: Request) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const q = searchParams.get("q")?.trim() ?? "";

    const status =
      statusParam && VALID_STATUSES.has(statusParam as OrderStatus)
        ? (statusParam as OrderStatus)
        : undefined;

    const orders = await prisma.order.findMany({
      where: {
        ...(status && { status }),
        ...(q && {
          OR: [
            { id: { contains: q, mode: "insensitive" } },
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } }
          ]
        })
      },
      include: {
        items: true,
        user: { select: { id: true, username: true, email: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      data: orders.map((order) => ({
        id: order.id,
        status: order.status,
        paymentMethod: order.paymentMethod,
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        secondaryPhone: order.secondaryPhone,
        city: order.city,
        district: order.district,
        address: order.address,
        additionalInfo: order.additionalInfo,
        subtotalXof: order.subtotalXof,
        shippingCostXof: order.shippingCostXof,
        totalXof: order.totalXof,
        createdAt: order.createdAt.toISOString(),
        user: order.user,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productTitle: item.productTitle,
          imageUrl: item.imageUrl,
          unitPriceXof: item.unitPriceXof,
          quantity: item.quantity,
          lineTotalXof: item.lineTotalXof
        }))
      }))
    });
  } catch (err) {
    console.error("GET /api/v1/admin/orders failed", err);
    return apiError("service_unavailable", "Impossible de charger les commandes.", 503);
  }
}
