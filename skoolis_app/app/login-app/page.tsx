"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

// Types d'erreurs possibles
type ErrorType = "credentials" | "server" | "network" | "unknown" | null;

interface ErrorState {
    type: ErrorType;
    message: string;
    icon: string;
}

const ERROR_MAP: Record<NonNullable<ErrorType>, { icon: string; default: string }> = {
    credentials: {
        icon: "fas fa-user-slash",
        default: "Identifiants incorrects. Vérifiez votre e-mail et mot de passe.",
    },
    server: {
        icon: "fas fa-server",
        default: "Le serveur est momentanément indisponible. Réessayez dans quelques instants.",
    },
    network: {
        icon: "fas fa-wifi",
        default: "Impossible de joindre le serveur. Vérifiez votre connexion internet.",
    },
    unknown: {
        icon: "fas fa-circle-exclamation",
        default: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    },
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorState | null>(null);
    const [isDark, setIsDark] = useState(false);
    const [ready, setReady] = useState(false);

    // Appliquer le thème sauvegardé + animation d'entrée
    useEffect(() => {
        // Nettoyer l'URL
        if (window.location.search) {
            window.history.replaceState({}, "", "/login-app");
        }
        // Lire le thème sauvegardé
        const savedTheme = localStorage.getItem('skoolis-theme');
        const dark = savedTheme === 'dark';
        setIsDark(dark);
        if (dark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        // Déclencher l'animation d'apparition
        requestAnimationFrame(() => setReady(true));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const apiBase  = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";
        const loginUrl = `${apiBase}/login`;

        // Helper : fetch avec timeout 10s
        const fetchWithTimeout = async (url: string, options: RequestInit) => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 10_000);
            try {
                return await fetch(url, { ...options, signal: controller.signal });
            } finally {
                clearTimeout(timer);
            }
        };

        try {
            let res: Response;
            try {
                res = await fetchWithTimeout(loginUrl, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });
            } catch (err: unknown) {
                const isTimeout = err instanceof DOMException && err.name === "AbortError";
                setError({
                    type: isTimeout ? "server" : "network",
                    message: isTimeout
                        ? "La connexion a expiré. Le serveur ne répond pas."
                        : ERROR_MAP.network.default,
                    icon: isTimeout ? ERROR_MAP.server.icon : ERROR_MAP.network.icon,
                });
                return;
            }

            if (res.status === 401 || res.status === 422) {
                const data = await res.json().catch(() => ({}));
                setError({
                    type: "credentials",
                    message: data.message || ERROR_MAP.credentials.default,
                    icon: ERROR_MAP.credentials.icon,
                });
                return;
            }

            if (res.status >= 500) {
                setError({ type: "server", message: ERROR_MAP.server.default, icon: ERROR_MAP.server.icon });
                return;
            }

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError({ type: "unknown", message: data.message || ERROR_MAP.unknown.default, icon: ERROR_MAP.unknown.icon });
                return;
            }

            // Succès — stocker le token Bearer
            const data = await res.json();
            localStorage.setItem("skoolis_token", data.token);
            document.cookie = `skoolis_auth=true; path=/; max-age=86400`;
            router.push("/dashboard");

        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="login-root" style={{ opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1)' }}>
            <div className="login-page">

                {/* Marque */}
                <div className="login-brand">
                    <img
                        src={isDark ? "/skoolis_logo_clair.png" : "/skoolis_logo_sombre.png"}
                        alt="Skoolis"
                        style={{ width: '120px', height: 'auto', marginBottom: '4px' }}
                    />
                    <p>Espace d{"'"}administration scolaire</p>
                </div>

                {/* Carte */}
                <div className="login-card">
                    <h2>Connexion</h2>
                    <p>Entrez vos identifiants pour accéder à votre tableau de bord.</p>

                    {/* Bannière d'erreur contextuelle */}
                    {error && (
                        <div className={`form-error-banner form-error-banner--${error.type}`}>
                            <i className={error.icon}></i>
                            <span>{error.message}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} method="post" autoComplete="on">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Adresse e-mail
                            </label>
                            <div className="input-group">
                                <i className="fas fa-envelope"></i>
                                <input
                                    className={`form-input${error?.type === "credentials" ? " input-error" : ""}`}
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="vous@etablissement.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Mot de passe
                            </label>
                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input
                                    className={`form-input${error?.type === "credentials" ? " input-error" : ""}`}
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" name="remember" />
                                Se souvenir de moi
                            </label>
                            <a href="#">Mot de passe oublié ?</a>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary btn-block${isLoading ? " loading" : ""}`}
                            disabled={isLoading}
                        >
                            <span className="btn-label">
                                {isLoading ? "Connexion en cours…" : "Se connecter"}
                            </span>
                            <span className="btn-spinner"></span>
                        </button>
                    </form>
                </div>

                <p className="login-footer">Propulsé par Skoolis</p>
            </div>
        </div>
    );
}
