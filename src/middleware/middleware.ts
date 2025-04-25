import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Routes protégées
  const protectedRoutes = ["/profile", "/cart", "/checkout"];
  // Routes d'authentification
  const authRoutes = ["/auth/login", "/auth/register"];

  // Si l'utilisateur est sur une route protégée sans token
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    return response;
  }

  // Si l'utilisateur est sur une route d'authentification avec un token
  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    const response = NextResponse.redirect(new URL("/", request.url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/auth/:path*"
  ]
};
