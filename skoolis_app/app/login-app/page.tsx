"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
            // Demander le cookie CSRF à Sanctum
            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                method: "GET",
                headers: { Accept: "application/json" },
            });

            // Appel de login
            const res = await fetch("http://localhost:8000/api/v1/login", {
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
                throw new Error(data.message || "Identifiants incorrects");
            }

            // Définir le cookie local pour le middleware proxy
            document.cookie = `skoolis_auth=true; path=/; max-age=86400`;
            
            // Redirection vers le dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setErrorMsg(err.message || "Erreur de connexion");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <style dangerouslySetInnerHTML={{ __html: `
                .login-wrapper {
                    --primary-color: #7b1fa2;
                    --primary-light: #9c27b0;
                    --primary-dark: #4a0072;
                    --secondary-color: #f3e5f5;
                    --text-color: #333333;
                    --text-light: #666666;
                    --bg-color: #f5f5f5;
                    --bg-light: #fafafa;
                    --white: #ffffff;
                    --border-radius: 8px;
                    --border-radius-lg: 12px;
                    --border-color: rgba(0, 0, 0, 0.1);
                    --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    --box-shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.15);
                    --transition: all 0.3s ease;
                    --danger-color: #c62828;
                    --danger-bg: #ffebee;

                    font-family: 'Poppins', sans-serif;
                    color: var(--text-color);
                    line-height: 1.6;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background:
                        radial-gradient(circle at 15% 20%, rgba(123, 31, 162, 0.10), transparent 45%),
                        radial-gradient(circle at 85% 80%, rgba(156, 39, 176, 0.10), transparent 45%),
                        var(--bg-color);
                }

                :global(.dark) .login-wrapper {
                    --primary-color: #9c27b0;
                    --primary-light: #ba68c8;
                    --primary-dark: #7b1fa2;
                    --secondary-color: #4a0072;
                    --text-color: #f5f5f5;
                    --text-light: #cccccc;
                    --bg-color: #121212;
                    --bg-light: #1a1a1a;
                    --white: #1e1e1e;
                    --border-color: rgba(255, 255, 255, 0.1);
                    --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                    --box-shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.4);
                    --danger-bg: #3a1010;
                }

                .login-wrapper * {
                    box-sizing: border-box;
                }

                .login-wrapper .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px 20px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    border-radius: var(--border-radius);
                    border: none;
                    cursor: pointer;
                    transition: var(--transition);
                    text-decoration: none;
                    white-space: nowrap;
                }

                .login-wrapper .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .login-wrapper .btn-primary {
                    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
                    color: white;
                }

                .login-wrapper .btn-primary:hover:not(:disabled) {
                    background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
                    box-shadow: 0 4px 12px rgba(123, 31, 162, 0.3);
                    transform: translateY(-2px);
                }

                .login-wrapper .btn-block {
                    width: 100%;
                    display: flex;
                }

                .login-wrapper .form-group {
                    margin-bottom: 20px;
                }

                .login-wrapper .form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: var(--text-color);
                    font-size: 0.95rem;
                }

                .login-wrapper .form-input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    background-color: var(--white);
                    color: var(--text-color);
                    font-size: 0.95rem;
                    transition: var(--transition);
                    font-family: 'Poppins', sans-serif;
                }

                .login-wrapper .form-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.1);
                }

                .login-wrapper .input-group {
                    position: relative;
                    transition: transform 0.2s ease;
                }

                .login-wrapper .input-group:focus-within {
                    transform: translateY(-1px);
                }

                .login-wrapper .input-group i {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-light);
                    transition: color 0.2s ease;
                }

                .login-wrapper .input-group:focus-within i {
                    color: var(--primary-color);
                }

                .login-wrapper .input-group .form-input {
                    padding-left: 45px;
                }

                .login-wrapper .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    color: var(--text-color);
                }

                .login-wrapper .checkbox-label input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    accent-color: var(--primary-color);
                }

                .login-wrapper .login-page-inner {
                    width: 100%;
                    max-width: 400px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 22px;
                    opacity: 0;
                    transform: translateY(16px);
                    animation: loginEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes loginEnter {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .login-wrapper .login-brand {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    text-align: center;
                }

                .login-wrapper .logo-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.9rem;
                    font-weight: 700;
                    box-shadow: 0 8px 20px rgba(123, 31, 162, 0.3);
                }

                .login-wrapper .login-brand h1 {
                    font-size: 1.6rem;
                    color: var(--primary-color);
                    font-weight: 700;
                    margin: 0;
                }

                .login-wrapper .login-brand p {
                    color: var(--text-light);
                    font-size: 0.9rem;
                    margin: 0;
                }

                .login-wrapper .login-card {
                    width: 100%;
                    background-color: var(--white);
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--box-shadow-lg);
                    padding: 36px 32px;
                    border: 1px solid var(--border-color);
                }

                .login-wrapper .login-card h2 {
                    font-size: 1.15rem;
                    font-weight: 600;
                    margin: 0 0 6px 0;
                    color: var(--text-color);
                }

                .login-wrapper .login-card > p {
                    color: var(--text-light);
                    font-size: 0.88rem;
                    margin: 0 0 24px 0;
                }

                .login-wrapper .form-options {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    font-size: 0.85rem;
                }

                .login-wrapper .form-options a {
                    color: var(--primary-color);
                    text-decoration: none;
                    font-weight: 500;
                }

                .login-wrapper .form-options a:hover {
                    text-decoration: underline;
                }

                .login-wrapper .btn-primary.btn-block {
                    position: relative;
                    height: 46px;
                }

                .login-wrapper .btn-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2.5px solid rgba(255, 255, 255, 0.4);
                    border-top-color: white;
                    border-radius: 50%;
                    display: none;
                    animation: loginSpin 0.7s linear infinite;
                }

                @keyframes loginSpin {
                    to { transform: rotate(360deg); }
                }

                .login-wrapper .btn-primary.loading .btn-label {
                    opacity: 0;
                }

                .login-wrapper .btn-primary.loading .btn-spinner {
                    display: block;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    margin-left: -9px;
                    margin-top: -9px;
                }

                .login-wrapper .form-error-banner {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--danger-bg);
                    color: var(--danger-color);
                    border-radius: var(--border-radius);
                    padding: 10px 14px;
                    font-size: 0.85rem;
                    margin-bottom: 18px;
                }

                .login-wrapper .login-footer {
                    text-align: center;
                    font-size: 0.78rem;
                    color: var(--text-light);
                    opacity: 0.75;
                    margin: 0;
                }
            ` }} />

            <div className="login-page-inner">
                <div className="login-brand">
                    <div className="logo-icon">S</div>
                    <h1>Skoolis</h1>
                    <p>Espace d'administration scolaire</p>
                </div>

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
                            <label className="form-label" htmlFor="email">Adresse e-mail</label>
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
                            <label className="form-label" htmlFor="password">Mot de passe</label>
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

                        <button type="submit" className={`btn btn-primary btn-block ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
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
