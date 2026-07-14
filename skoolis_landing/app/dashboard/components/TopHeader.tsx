"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopHeader() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const pathname = usePathname();

    useEffect(() => {
        // Init theme from localStorage on mount
        const savedTheme = window.localStorage.getItem("skoolis-theme");
        const currentTheme = savedTheme === "dark" ? "dark" : "light";
        
        setTheme(currentTheme);
        if (currentTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            document.querySelector('.container')?.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
            document.querySelector('.container')?.removeAttribute("data-theme");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        
        if (newTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            document.querySelector('.container')?.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
            document.querySelector('.container')?.removeAttribute("data-theme");
        }
        
        // Save to localStorage
        window.localStorage.setItem("skoolis-theme", newTheme);
        // Save to cookie
        document.cookie = "skoolis-theme=" + newTheme + "; path=/; max-age=31536000; SameSite=Lax";
    };

    const getHeaderContent = () => {
        if (pathname?.includes('/dashboard/admin')) {
            return { title: 'Gestion des Administrateurs', subtitle: 'Créez et gérez les comptes administrateurs du système' };
        }
        if (pathname?.includes('/dashboard/users')) {
            return { title: 'Gestion des Utilisateurs', subtitle: 'Gérez les accès et permissions des utilisateurs du système' };
        }
        if (pathname?.includes('/dashboard/config')) {
            return { title: 'Configuration du système', subtitle: 'Gérez les paramètres scolaires et système de Skoolis' };
        }
        if (pathname?.includes('/dashboard/bilan-journalier')) {
            return { title: 'Bilan Journalier et Périodique', subtitle: 'Analysez les encaissements sur une période précise' };
        }
        if (pathname?.includes('/dashboard/bilan')) {
            return { title: 'Bilan Financier Général', subtitle: 'Analyse des revenus globaux de l\'établissement' };
        }
        if (pathname?.includes('/dashboard/authentification')) {
            return { title: 'Authentification de Reçu', subtitle: 'Vérifier l\'authenticité d\'un reçu de paiement' };
        }
        if (pathname?.includes('/dashboard/classes')) {
            return { title: 'Gestion des Classes', subtitle: 'Gérez toutes les classes de l\'établissement' };
        }
        if (pathname?.includes('/dashboard/students')) {
            return { title: 'Gestion des Élèves', subtitle: 'Gérez les inscriptions et les informations des élèves' };
        }
        if (pathname?.includes('/dashboard/teachers')) {
            return { title: 'Gestion des Professeurs', subtitle: 'Gérez l\'équipe pédagogique et leurs affectations' };
        }
        if (pathname?.includes('/dashboard/notes')) {
            return { title: 'Notes et Moyennes', subtitle: 'Saisie des notes et calcul des moyennes' };
        }
        if (pathname?.includes('/dashboard/matieres')) {
            return { title: 'Gestion des Matières', subtitle: 'Créez, gérez et attribuez les matières' };
        }
        if (pathname?.includes('/dashboard/inscription')) {
            return { title: 'Frais d\'inscription', subtitle: 'Gestion des frais d\'inscription et des paiements' };
        }
        if (pathname?.includes('/dashboard/ecolage')) {
            return { title: 'Frais d\'Ecolage', subtitle: 'Gestion des frais de scolarité, tranches et aménagements' };
        }
        if (pathname?.includes('/dashboard/arriere_ecolage')) {
            return { title: 'Arriéré d\'Ecolage', subtitle: 'Gestion des paiements en retard et des remises' };
        }
        if (pathname?.includes('/dashboard/autres-frais')) {
            return { title: 'Autres Frais', subtitle: 'Gestion des frais divers (uniforme, cantine, etc.)' };
        }
        if (pathname?.includes('/dashboard/resultats')) {
            return { title: 'Résultats & Bulletins', subtitle: 'Classements, bulletins et délibérations scolaires' };
        }
        if (pathname?.includes('/dashboard/bepc-blanc')) {
            return { title: 'BEPC Blanc', subtitle: 'Simulation et préparation au Brevet d\'Études du Premier Cycle' };
        }
        if (pathname?.includes('/dashboard/aide')) {
            return { title: 'Aide & Support', subtitle: 'Centre d\'aide et documentation utilisateur' };
        }
        if (pathname?.includes('/dashboard/sauvegarde')) {
            return { title: 'Sauvegarde & Restauration', subtitle: 'Gérez les sauvegardes de vos données locales' };
        }
        if (pathname?.includes('/dashboard/mise-a-jour')) {
            return { title: 'Mise à jour (Skoolis Connect)', subtitle: 'Vérifiez les mises à jour et connectez-vous au cloud' };
        }
        // Default
        return { title: 'Skoolis - Tableau de bord', subtitle: 'Bienvenue dans votre espace de gestion scolaire' };
    };

    const content = getHeaderContent();

    return (
        <header className="top-header">
            <div className="header-left">
                <h2>{content.title}</h2>
                <p>{content.subtitle}</p>
            </div>
            <div className="header-right">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Rechercher..." />
                </div>
                <div className="header-icons">
                    <button className="icon-btn notification">
                        <i className="fas fa-bell"></i>
                        <span className="badge">3</span>
                    </button>
                    <button className="icon-btn">
                        <i className="fas fa-envelope"></i>
                        <span className="badge">5</span>
                    </button>
                    <button className="icon-btn" id="themeToggle" onClick={toggleTheme}>
                        <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
                    </button>
                    <button className="icon-btn">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </div>
            </div>
        </header>
    );
}
