import { registerRequestSchema } from "@/application/auth/authApiSchemas";
import { apiError, validationError } from "@/infrastructure/api/responses";
import { prisma } from "@/infrastructure/database/prisma";
import { Prisma } from "@/generated/prisma/client";
import { hashPassword } from "@/infrastructure/auth/passwords";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiError("validation_error", "Le corps JSON est invalide.", 422);
  }

  const parsed = registerRequestSchema.safeParse(payload);
  if (!parsed.success) return validationError(parsed.error.issues);

  const username = parsed.data.username.trim();
  const email = parsed.data.email.trim();

  try {
    const user = await prisma.user.create({
      data: {
        username,
        usernameNormalized: username.toLowerCase(),
        email,
        emailNormalized: email.toLowerCase(),
        passwordHash: await hashPassword(parsed.data.password)
      },
      select: { id: true, username: true, email: true, createdAt: true }
    });

    return NextResponse.json(
      {
        data: {
          user: { ...user, createdAt: user.createdAt.toISOString() }
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return apiError(
        "account_already_exists",
        "Ce nom d’utilisateur ou cette adresse email est déjà utilisé.",
        409
      );
    }

    console.error("POST /api/v1/auth/register failed", error);
    return apiError(
      "service_unavailable",
      "L’inscription est temporairement indisponible.",
      503
    );
  }
}
