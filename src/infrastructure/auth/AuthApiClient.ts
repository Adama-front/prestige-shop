import type { PublicUser } from "@/application/auth/authApiSchemas";
import { z } from "zod";

const userSchema = z.object({
  id: z.string().min(1),
  username: z.string(),
  email: z.string().email(),
  role: z.enum(["CUSTOMER", "ADMIN"]).default("CUSTOMER"),
  createdAt: z.string().datetime()
});

const authResponseSchema = z.object({
  data: z.object({ user: userSchema })
});

const getErrorMessage = (payload: unknown) => {
  if (
    typeof payload === "object" && payload !== null && "error" in payload &&
    typeof payload.error === "object" && payload.error !== null &&
    "message" in payload.error && typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }
  return "Une erreur est survenue. Réessayez.";
};

const request = async (
  path: string,
  init?: RequestInit
): Promise<PublicUser> => {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...init?.headers }
    });
  } catch {
    throw new Error("Impossible de joindre le serveur. Vérifiez votre connexion.");
  }

  const payload: unknown = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(getErrorMessage(payload));
  const parsed = authResponseSchema.safeParse(payload);
  if (!parsed.success) throw new Error("Le serveur a renvoyé une réponse invalide.");
  return parsed.data.data.user;
};

export const authApiClient = {
  register: (credentials: {
    username: string;
    email: string;
    password: string;
  }) =>
    request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials)
    }),
  login: (credentials: { username: string; password: string }) =>
    request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    }),
  me: () => request("/api/v1/auth/me"),
  logout: async () => {
    let response: Response;
    try {
      response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "same-origin"
      });
    } catch {
      throw new Error("Impossible de joindre le serveur. Vérifiez votre connexion.");
    }
    if (!response.ok) throw new Error("La déconnexion a échoué. Réessayez.");
  }
};
