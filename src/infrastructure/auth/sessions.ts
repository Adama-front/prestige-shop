import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/infrastructure/database/prisma";
import type { PublicUser } from "@/application/auth/authApiSchemas";

const SESSION_COOKIE = "prestige_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const toPublicUser = (user: {
  id: string;
  username: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: Date;
}): PublicUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString()
});

export const createUserSession = async (userId: string) => {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
};

export const clearUserSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }

  cookieStore.delete(SESSION_COOKIE);
};

export const getCurrentUser = async (): Promise<PublicUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true
        }
      }
    }
  });

  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return toPublicUser(session.user);
};

export const requireCurrentUser = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
};

export const requireAdminUser = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
};
