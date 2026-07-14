import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Vérifier la présence du cookie de connexion (défini lors du login)
    const isAuthenticated = request.cookies.has('skoolis_auth');
    
    // Vérifier si l'utilisateur essaie d'accéder à une page du dashboard
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

    if (isDashboardRoute && !isAuthenticated) {
        // Rediriger vers la page de login si non authentifié
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si l'utilisateur est déjà connecté et essaie d'aller sur /login, on le renvoie vers le dashboard
    if (request.nextUrl.pathname === '/login' && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Spécifier les chemins sur lesquels le middleware doit s'exécuter
export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
