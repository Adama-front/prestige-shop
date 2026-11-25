import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("prestige_session")?.value;
  const { pathname } = request.nextUrl;

  // ── 1. Admin protection (hors /admin/login) ──────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !token) {
    const adminLoginUrl = new URL("/admin/login", request.url);
    adminLoginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(adminLoginUrl);
  }

  // ── 2. Bypasser toutes les API et les routes admin ───────────────────────
  // Les routes API ne doivent JAMAIS être redirigées vers une page HTML.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/")
  ) {
    return applyClientAuth(request, token, pathname);
  }

  // ── 3. Vérification maintenance ───────────────────────────────────────────
  // S'applique aux pages publiques ET à /maintenance elle-même :
  // • Si maintenance ON  → redirect vers /maintenance (sauf si déjà dessus)
  // • Si maintenance OFF → si on est sur /maintenance, redirect vers /
  try {
    const settingsUrl = new URL("/api/v1/settings/public", request.url);
    const res = await fetch(settingsUrl.toString(), {
      headers: { "x-middleware-check": "1" },
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const json = (await res.json()) as {
        data?: { maintenanceMode?: boolean };
      };
      const isMaintenanceOn = json?.data?.maintenanceMode === true;

      if (isMaintenanceOn && pathname !== "/maintenance") {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }

      if (!isMaintenanceOn && pathname === "/maintenance") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  } catch {
    // Si l'API est inaccessible, on laisse passer (fail-open)
  }

  return applyClientAuth(request, token, pathname);
}

/** Gère les redirections auth client (protectedRoutes / authRoutes) */
function applyClientAuth(
  request: NextRequest,
  token: string | undefined,
  pathname: string
): NextResponse {
  const protectedRoutes = ["/profile", "/checkout"];
  const authRoutes = ["/auth/login", "/register"];

  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authRoutes.some((r) => pathname.startsWith(r)) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Toutes les routes sauf les fichiers statiques Next.js (_next/static,
     * _next/image, favicon.ico, images publiques).
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
