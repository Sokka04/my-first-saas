"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
                method: "GET",
                headers: { Accept: "application/json" },
                credentials: "include",
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Identifiants incorrects. Veuillez réessayer.");
            }

            document.cookie = `skoolis_auth=true; path=/; max-age=86400`;
            router.push("/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erreur de connexion.";
            setErrorMsg(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-root">
            <div className="login-page">

                {/* Marque */}
                <div className="login-brand">
                    <picture>
                        {/* Fond sombre → logo clair */}
                        <source
                            srcSet="http://localhost:3001/skoolis_logo_clair.png"
                            media="(prefers-color-scheme: dark)"
                        />
                        {/* Fond clair → logo sombre (défaut) */}
                        <img
                            src="http://localhost:3001/skoolis_logo_sombre.png"
                            alt="Skoolis"
                            style={{ width: '120px', height: 'auto', marginBottom: '4px' }}
                        />
                    </picture>
                    <p>Espace d'administration scolaire</p>
                </div>

                {/* Carte */}
                <div className="login-card">
                    <h2>Connexion</h2>
                    <p>Entrez vos identifiants pour accéder à votre tableau de bord.</p>

                    {errorMsg && (
                        <div className="form-error-banner">
                            <i className="fas fa-circle-exclamation"></i>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Adresse e-mail
                            </label>
                            <div className="input-group">
                                <i className="fas fa-envelope"></i>
                                <input
                                    className="form-input"
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="vous@etablissement.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    className="form-input"
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            <span className="btn-label">Se connecter</span>
                            <span className="btn-spinner"></span>
                        </button>
                    </form>
                </div>

                <p className="login-footer">Propulsé par Skoolis</p>
            </div>
        </div>
    );
}
