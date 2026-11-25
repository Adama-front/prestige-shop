import { loginRequestSchema } from "@/application/auth/authApiSchemas";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { createUserSession } from "@/infrastructure/auth/sessions";
import { verifyPassword } from "@/infrastructure/auth/passwords";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiError("validation_error", "Le corps JSON est invalide.", 422);
  }

  const parsed = loginRequestSchema.safeParse(payload);
  if (!parsed.success) return validationError(parsed.error.issues);

  try {
    const identifier = parsed.data.username.toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { usernameNormalized: identifier },
          { emailNormalized: identifier }
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        passwordHash: true
      }
    });

    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return apiError(
        "invalid_credentials",
        "Identifiants administrateur incorrects.",
        401
      );
    }

    if (user.role !== "ADMIN") {
      return apiError(
        "forbidden",
        "Accès refusé : ce portail est réservé aux administrateurs.",
        403
      );
    }

    await createUserSession(user.id);
    return NextResponse.json({
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString()
        }
      }
    });
  } catch (error) {
    console.error("POST /api/v1/admin/auth/login failed", error);
    return apiError(
      "service_unavailable",
      "L'authentification admin est temporairement indisponible.",
      503
    );
  }
}
