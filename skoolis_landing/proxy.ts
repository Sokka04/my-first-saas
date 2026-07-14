import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BLOCKED_LEGACY_HTML = /^\/skolis\/(index\.html|pages\/[a-z0-9-]+\.html)$/i;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bloquer l'accès direct aux vieux fichiers HTML
  if (BLOCKED_LEGACY_HTML.test(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 2. Protection des routes du dashboard
  const isAuthenticated = request.cookies.has('skoolis_auth');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isDashboardLoginRoute = pathname === '/login-app';

  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login-app', request.url));
  }

  if (isDashboardLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/skolis/:path*", "/dashboard/:path*", "/login-app"],
};