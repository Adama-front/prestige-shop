import { adminCreateManagerSchema } from "@/application/admin/adminSchemas";
import { ensureAdminApi } from "@/infrastructure/admin/adminAuth";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { hashPassword } from "@/infrastructure/auth/passwords";
import { prisma } from "@/infrastructure/database/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { error } = await ensureAdminApi();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";

    const users = await prisma.user.findMany({
      where: q
        ? {
            OR: [
              { username: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } }
            ]
          }
        : undefined,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          where: { status: { not: "CANCELLED" } },
          select: { totalXof: true }
        },
        _count: { select: { orders: true } }
      },
      orderBy: [{ role: "desc" }, { createdAt: "desc" }]
    });

    return NextResponse.json({
      data: users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        ordersCount: u._count.orders,
        totalSpentXof: u.orders.reduce((sum, o) => sum + o.totalXof, 0),
        createdAt: u.createdAt.toISOString()
      }))
    });
  } catch (err) {
    console.error("GET /api/v1/admin/customers failed", err);
    return apiError("service_unavailable", "Impossible de charger les clients.", 503);
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

    const parsed = adminCreateManagerSchema.safeParse(payload);
    if (!parsed.success) return validationError(parsed.error.issues);

    const username = parsed.data.username.trim();
    const email = parsed.data.email.trim();

    try {
      const created = await prisma.user.create({
        data: {
          username,
          usernameNormalized: username.toLowerCase(),
          email,
          emailNormalized: email.toLowerCase(),
          passwordHash: await hashPassword(parsed.data.password),
          role: "ADMIN"
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      return NextResponse.json(
        {
          data: {
            ...created,
            ordersCount: 0,
            totalSpentXof: 0,
            createdAt: created.createdAt.toISOString()
          }
        },
        { status: 201 }
      );
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return apiError(
          "account_already_exists",
          "Ce nom d'utilisateur ou cette adresse email est déjà utilisé.",
          409
        );
      }
      throw err;
    }
  } catch (err) {
    console.error("POST /api/v1/admin/customers failed", err);
    return apiError(
      "service_unavailable",
      "Impossible de créer le gestionnaire.",
      503
    );
  }
}
