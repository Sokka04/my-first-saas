"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Database, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [schoolYear, setSchoolYear] = useState("2024-2025");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        // Simulation d'une vérification de connexion
        setTimeout(() => {
            if (!identifier || !password) {
                setErrorMsg("Veuillez remplir tous les champs.");
                setIsLoading(false);
                return;
            }

            // Ici, vous ferez votre vérification réelle avec l'API.
            console.log("Connexion avec :", { identifier, password, schoolYear });
            
            // Définir un cookie pour indiquer que l'utilisateur est connecté (valable 1 jour)
            document.cookie = `skoolis_auth=true; path=/; max-age=86400`;
            
            // Redirection vers le dashboard
            router.push("/dashboard");
        }, 1200);
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden home-surface text-foreground">
            {/* Arrière-plan animé vibrant (Glassmorphism) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[5%] w-[40vw] h-[40vw] rounded-full bg-primary/40 blur-[100px] opacity-80"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[5%] w-[50vw] h-[50vw] rounded-full bg-secondary/40 blur-[120px] opacity-80"
                />
            </div>

            {/* Conteneur Principal */}
            <div className="relative z-10 w-full max-w-md px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="backdrop-blur-2xl bg-card/40 dark:bg-card/40 border border-primary/10 shadow-[0_8px_30px_color-mix(in_oklch,var(--primary)_15%,transparent)] rounded-3xl p-8 sm:p-10"
                >
                    <div className="text-center mb-8">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 ring-1 ring-primary/20 shadow-inner"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                        </motion.div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Connexion</h1>
                        <p className="text-sm text-muted-foreground mt-2">Accédez à votre espace d'administration</p>
                    </div>

                    <AnimatePresence>
                        {errorMsg && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="flex items-center gap-3 p-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-xl">
                                    <AlertCircle className="w-5 h-5 shrink-0 text-destructive" />
                                    <p className="text-destructive font-medium">{errorMsg}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="identifier" className="text-sm font-medium text-foreground ml-1">Identifiant</label>
                            <motion.div whileFocus="focused" initial="idle" className="relative group">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <input 
                                    type="text" 
                                    id="identifier" 
                                    placeholder="admin@skoolis.com" 
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-background/50 border border-input rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                                />
                            </motion.div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">Mot de passe</label>
                                <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Oublié ?</a>
                            </div>
                            <motion.div whileFocus="focused" initial="idle" className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-background/50 border border-input rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                                />
                            </motion.div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="schoolYear" className="text-sm font-medium text-foreground ml-1">Année Académique</label>
                            <div className="relative group">
                                <Database className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <select 
                                    id="schoolYear" 
                                    value={schoolYear}
                                    onChange={(e) => setSchoolYear(e.target.value)}
                                    className="w-full pl-11 pr-10 py-3 bg-background/50 border border-input rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                                >
                                    <option value="2024-2025">Année 2024 - 2025</option>
                                    <option value="2023-2024">Année 2023 - 2024 (Archives)</option>
                                    <option value="2022-2023">Année 2022 - 2023 (Archives)</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            disabled={isLoading}
                            className="w-full relative flex items-center justify-center gap-2 py-3.5 mt-2 bg-primary text-primary-foreground font-medium rounded-xl shadow-[0_8px_20px_color-mix(in_oklch,var(--primary)_30%,transparent)] hover:shadow-[0_8px_25px_color-mix(in_oklch,var(--primary)_40%,transparent)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Connexion en cours...</span>
                                </>
                            ) : (
                                <span>Se connecter</span>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Signature Skoolis */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-8 text-center"
                >
                    <p className="text-xs text-muted-foreground/60 tracking-wider font-medium uppercase">
                        Propulsé par <span className="text-muted-foreground/80 font-bold">Skoolis</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
