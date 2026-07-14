"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [schoolYear, setSchoolYear] = useState("2024-2025");
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
                body: JSON.stringify({ email: identifier, password }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Identifiants incorrects");
            }

            console.log("Connexion Sanctum réussie :", { identifier, schoolYear });
            
            // Définir le cookie local pour le middleware (fallback) ou laisser le middleware vérifier XSRF-TOKEN
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
        <>
            <style jsx>{`
                @keyframes slide-in-top {
                    0% { transform: translateY(-30px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .login-card-container {
                    animation: slide-in-top 0.5s ease-out forwards;
                    width: 100%;
                    max-width: 420px;
                }
                .input-with-icon {
                    position: relative;
                }
                .input-with-icon i {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .input-with-icon input, .input-with-icon select {
                    padding-left: 40px !important;
                    width: 100%;
                }
                .input-with-icon input:focus + i, .input-with-icon select:focus + i {
                    color: var(--primary-color);
                }
            `}</style>

            <div className="login-card-container">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, var(--primary-color), #9c27b0)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '28px',
                        marginBottom: '16px',
                        boxShadow: '0 8px 16px rgba(123, 31, 162, 0.2)'
                    }}>
                        <i className="fas fa-graduation-cap"></i>
                    </div>
                    <h2 style={{ color: 'var(--text-color)', margin: '0 0 8px', fontSize: '24px' }}>Espace Logiciel</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Connectez-vous pour accéder à votre établissement</p>
                </div>

                <div className="card" style={{ padding: '32px' }}>
                    {errorMsg && (
                        <div style={{
                            background: 'rgba(244, 67, 54, 0.1)',
                            color: '#f44336',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <i className="fas fa-exclamation-circle"></i>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Identifiant */}
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-color)' }}>
                                Email métier
                            </label>
                            <div className="input-with-icon">
                                <input 
                                    type="email" 
                                    placeholder="ex: admin@school.com" 
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                />
                                <i className="fas fa-envelope"></i>
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontWeight: 500, color: 'var(--text-color)' }}>
                                    Mot de passe
                                </label>
                            </div>
                            <div className="input-with-icon">
                                <input 
                                    type="password" 
                                    placeholder="Votre mot de passe" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                />
                                <i className="fas fa-lock"></i>
                            </div>
                        </div>

                        {/* Choix de l'année */}
                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-color)' }}>
                                Année académique
                            </label>
                            <div className="input-with-icon">
                                <select 
                                    value={schoolYear}
                                    onChange={(e) => setSchoolYear(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        backgroundColor: 'var(--white)',
                                        transition: 'border-color 0.3s',
                                        cursor: 'pointer'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                >
                                    <option value="2024-2025">Année 2024 - 2025</option>
                                    <option value="2023-2024">Année 2023 - 2024 (Archives)</option>
                                </select>
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                        </div>

                        {/* Bouton de connexion */}
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isLoading}
                            style={{ width: '100%', padding: '14px', fontSize: '15px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                        >
                            {isLoading ? (
                                <><i className="fas fa-spinner fa-spin"></i> Connexion...</>
                            ) : (
                                <><i className="fas fa-sign-in-alt"></i> Se connecter</>
                            )}
                        </button>
                    </form>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        Propulsé par <strong>Skoolis</strong>
                    </p>
                </div>
            </div>
        </>
    );
}
