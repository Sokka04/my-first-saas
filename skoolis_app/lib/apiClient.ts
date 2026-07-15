const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

interface FetchOptions extends RequestInit {
    // Possibilité d'ajouter des options personnalisées si besoin
}

/**
 * Wrapper centralisé pour les appels API (Fetch)
 * Gère automatiquement l'injection de l'URL de base, les credentials Sanctum,
 * et la redirection en cas d'erreur 401 (Non authentifié).
 */
export async function apiClient(endpoint: string, options: FetchOptions = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers = new Headers(options.headers || {});
    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
    }
    // Si on envoie du JSON et qu'on a pas précisé le Content-Type
    if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
        ...options,
        headers,
        credentials: options.credentials || 'include', // Important pour Sanctum (cookies session)
    };

    try {
        const response = await fetch(url, config);

        // Interception globale des erreurs 401 (Non autorisé / Token expiré)
        if (response.status === 401) {
            console.warn("API Client: 401 Unauthorized détecté. Redirection vers le login.");
            // On s'assure d'être côté client avant d'utiliser window
            if (typeof window !== 'undefined') {
                window.location.href = '/login-app';
            }
            // On peut aussi throw une erreur spécifique pour l'attraper dans le composant si besoin
            throw new Error('Unauthorized');
        }

        return response;
    } catch (error) {
        // Log global des erreurs réseau
        console.error("API Client Error:", error);
        throw error;
    }
}

// Helpers pratiques
export const api = {
    get: (endpoint: string, options?: FetchOptions) => apiClient(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, body: any, options?: FetchOptions) => 
        apiClient(endpoint, { ...options, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body), headers: body instanceof FormData ? options?.headers : { 'Content-Type': 'application/json', ...options?.headers } }),
    put: (endpoint: string, body: any, options?: FetchOptions) => 
        apiClient(endpoint, { ...options, method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body), headers: body instanceof FormData ? options?.headers : { 'Content-Type': 'application/json', ...options?.headers } }),
    delete: (endpoint: string, options?: FetchOptions) => apiClient(endpoint, { ...options, method: 'DELETE' }),
};
