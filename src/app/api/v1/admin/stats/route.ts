import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const [
      revenueAgg,
      totalOrders,
      pendingOrders,
      totalProducts,
      publishedProducts,
      promoProducts,
      newProducts,
      lowStockProducts,
      recentOrders,
      totalCustomers
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { totalXof: true }
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count(),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.product.count({ where: { discountPercent: { gt: 0 } } }),
      prisma.product.count({ where: { isNew: true } }),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: {
          id: true,
          title: true,
          stock: true,
          priceXof: true,
          imageUrl: true,
          isPublished: true
        },
        orderBy: { stock: "asc" },
        take: 6
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          items: { select: { id: true, quantity: true } },
          user: { select: { username: true, email: true } }
        }
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } })
    ]);

    return NextResponse.json({
      data: {
        totalRevenueXof: revenueAgg._sum.totalXof ?? 0,
        totalOrders,
        pendingOrders,
        totalProducts,
        publishedProducts,
        promoProducts,
        newProducts,
        totalCustomers,
        lowStockProducts,
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          status: order.status,
          customerName: `${order.firstName} ${order.lastName}`,
          phone: order.phone,
          city: order.city,
          totalXof: order.totalXof,
          itemsCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
          createdAt: order.createdAt.toISOString()
        }))
      }
    });
  } catch (err) {
    console.error("GET /api/v1/admin/stats failed", err);
    return apiError("service_unavailable", "Impossible de charger les statistiques.", 503);
  }
}
