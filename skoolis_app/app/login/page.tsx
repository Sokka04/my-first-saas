"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css"; // We will create this specific CSS file

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [schoolYear, setSchoolYear] = useState("2023-2024");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        // Simulation d'une vérification de connexion (sensible à la casse pour le mot de passe)
        setTimeout(() => {
            if (!identifier || !password) {
                setErrorMsg("Veuillez remplir tous les champs.");
                setIsLoading(false);
                return;
            }

            // Ici, vous ferez votre vérification réelle.
            // "Sensible à la casse" est géré naturellement en comparant les strings.
            // On simule un succès et une redirection vers le dashboard.
            console.log("Connexion avec :", { identifier, password, schoolYear });
            
            // Définir un cookie pour indiquer que l'utilisateur est connecté (valable 1 jour)
            document.cookie = `skoolis_auth=true; path=/; max-age=86400`;
            
            // Redirection vers le dashboard
            router.push("/dashboard");
        }, 1200);
    };

    return (
        <div className="loginContainer">
            {/* PANNEAU GAUCHE - MARQUE & ANIMATIONS */}
            <div className="leftPanel">
                <div className="floatingShapes">
                    <div className="shape shape1"></div>
                    <div className="shape shape2"></div>
                    <div className="shape shape3"></div>
                </div>
                
                <div className="leftContent">
                    <h1>Skoolis</h1>
                    <p>
                        Gérez votre établissement avec intelligence et simplicité. 
                        Toutes vos données scolaires, à portée de clic, année après année.
                    </p>
                </div>
            </div>

            {/* PANNEAU DROIT - FORMULAIRE */}
            <div className="rightPanel">
                <div className="loginCard">
                    <div className="loginHeader">
                        <h2>Bienvenue</h2>
                        <p>Connectez-vous pour accéder à votre espace</p>
                    </div>

                    {errorMsg && (
                        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #ffcdd2' }}>
                            <i className="fas fa-exclamation-circle" style={{marginRight: '8px'}}></i>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Identifiant */}
                        <div className="formGroup">
                            <label htmlFor="identifier">Email ou Nom d'utilisateur</label>
                            <div className="inputWrapper">
                                <input 
                                    type="text" 
                                    id="identifier" 
                                    placeholder="admin@skoolis.com" 
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                                <i className="fas fa-user"></i>
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div className="formGroup">
                            <label htmlFor="password">Mot de passe</label>
                            <div className="inputWrapper">
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="Votre mot de passe" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <i className="fas fa-lock"></i>
                            </div>
                            <a href="#" className="forgotPassword">Mot de passe oublié ?</a>
                        </div>

                        {/* Choix de l'année (Charger la base d'une autre année) */}
                        <div className="formGroup">
                            <label htmlFor="schoolYear">Année académique (Base de données)</label>
                            <div className="inputWrapper">
                                <select 
                                    id="schoolYear" 
                                    value={schoolYear}
                                    onChange={(e) => setSchoolYear(e.target.value)}
                                >
                                    <option value="2024-2025">Année 2024 - 2025</option>
                                    <option value="2023-2024">Année 2023 - 2024 (Archives)</option>
                                    <option value="2022-2023">Année 2022 - 2023 (Archives)</option>
                                </select>
                                <i className="fas fa-database"></i>
                            </div>
                        </div>

                        {/* Bouton de connexion */}
                        <button type="submit" className="submitBtn" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i> Se connecter
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
