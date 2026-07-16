import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protéger toutes les routes sous /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const authCookie = request.cookies.get('skoolis_auth');
    
    // Si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
    if (!authCookie || authCookie.value !== 'true') {
      const loginUrl = new URL('/login-app', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Permettre l'accès aux autres routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
