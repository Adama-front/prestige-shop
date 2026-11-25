import { apiError } from "@/infrastructure/api/responses";
import { getCurrentUser } from "@/infrastructure/auth/sessions";

export const ensureAdminApi = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: apiError("unauthenticated", "Connexion requise.", 401),
      user: null
    };
  }
  if (user.role !== "ADMIN") {
    return {
      error: apiError("forbidden", "Accès réservé aux administrateurs.", 403),
      user: null
    };
  }
  return { error: null, user };
};
