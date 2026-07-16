"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<{name?: string, email?: string} | null>(null);

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('skoolis_user');
            if (userStr) {
                setUser(JSON.parse(userStr));
            }
        } catch (e) {}
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sidebar">
            <div className="logo-container">
                <div className="logo">
                    <div className="logo-top" style={{ justifyContent: 'center', marginBottom: '0', height: '55px', display: 'flex', alignItems: 'center' }}>
                        <img src="/skoolis_logo_sombre.png" alt="Skoolis Logo" className="logo-light-theme" style={{ height: '55px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
                        <img src="/skoolis_logo_clair.png" alt="Skoolis Logo" className="logo-dark-theme" style={{ height: '55px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                    <div className="current-schoolyear">Année Scolaire : 2026-2027</div>
                </div>
                <button className="toggle-sidebar" id="toggleSidebar">
                    <i className="fas fa-bars"></i>
                </button>
            </div>
            <div className="nav-section">
                <h3 className="section-title">Principal</h3>
                <ul className="nav-menu">
                    <li className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                        <Link href="/dashboard">
                            <i className="fas fa-home"></i>
                            <span>Tableau de bord</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/classes') ? 'active' : ''}`}>
                        <Link href="/dashboard/classes">
                            <i className="fas fa-chalkboard"></i>
                            <span>Classes</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/students') ? 'active' : ''}`}>
                        <Link href="/dashboard/students">
                            <i className="fas fa-user-graduate"></i>
                            <span>Élèves</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/teachers') ? 'active' : ''}`}>
                        <Link href="/dashboard/teachers">
                            <i className="fas fa-chalkboard-teacher"></i>
                            <span>Professeurs</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/notes') ? 'active' : ''}`}>
                        <Link href="/dashboard/notes">
                            <i className="fas fa-edit"></i>
                            <span>Notes & Moyennes</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/matieres') ? 'active' : ''}`}>
                        <Link href="/dashboard/matieres">
                            <i className="fas fa-book"></i>
                            <span>Matières</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="nav-section">
                <h3 className="section-title">Comptabilité</h3>
                <ul className="nav-menu">
                    <li className={`nav-item ${isActive('/dashboard/inscription') ? 'active' : ''}`}>
                        <Link href="/dashboard/inscription">
                            <i className="fas fa-file-invoice-dollar"></i>
                            <span>Frais d'inscription</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/ecolage') ? 'active' : ''}`}>
                        <Link href="/dashboard/ecolage">
                            <i className="fas fa-credit-card"></i>
                            <span>Frais d'Ecolage</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/arriere_ecolage') ? 'active' : ''}`}>
                        <Link href="/dashboard/arriere_ecolage">
                            <i className="fas fa-clock"></i>
                            <span>Arriéré d'écolage</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/autres-frais') ? 'active' : ''}`}>
                        <Link href="/dashboard/autres-frais">
                            <i className="fas fa-receipt"></i>
                            <span>Autres frais</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/bilan') ? 'active' : ''}`}>
                        <Link href="/dashboard/bilan">
                            <i className="fas fa-chart-bar"></i>
                            <span>Bilan général</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/bilan-journalier') ? 'active' : ''}`}>
                        <Link href="/dashboard/bilan-journalier">
                            <i className="fas fa-calendar-day"></i>
                            <span>Bilan journalier</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/authentification') ? 'active' : ''}`}>
                        <Link href="/dashboard/authentification">
                            <i className="fas fa-shield-alt"></i>
                            <span>Authentification reçu</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="nav-section">
                <h3 className="section-title">Administration</h3>
                <ul className="nav-menu">
                    <li className={`nav-item ${isActive('/dashboard/config') ? 'active' : ''}`}>
                        <Link href="/dashboard/config">
                            <i className="fas fa-cog"></i>
                            <span>Configuration</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/admin') ? 'active' : ''}`}>
                        <Link href="/dashboard/admin">
                            <i className="fas fa-user-shield"></i>
                            <span>Administrateur</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/dashboard/users') ? 'active' : ''}`}>
                        <Link href="/dashboard/users">
                            <i className="fas fa-users"></i>
                            <span>Utilisateurs</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="nav-section">
                <h3 className="section-title">Examens</h3>
                <ul className="nav-menu">
                    <li className={`nav-item ${pathname.includes('/dashboard/resultats') ? 'active' : ''}`}>
                        <Link href="/dashboard/resultats">
                            <i className="fas fa-poll"></i>
                            <span>Résultats</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${pathname.includes('/dashboard/bepc-blanc') ? 'active' : ''}`}>
                        <Link href="/dashboard/bepc-blanc">
                            <i className="fas fa-file-alt"></i>
                            <span>BEPC Blanc</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="nav-section">
                <h3 className="section-title">Aide</h3>
                <ul className="nav-menu">
                    <li className={`nav-item ${pathname.includes('/dashboard/aide') ? 'active' : ''}`}>
                        <Link href="/dashboard/aide">
                            <i className="fas fa-question-circle"></i>
                            <span>Aide & Support</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${pathname.includes('/dashboard/sauvegarde') ? 'active' : ''}`}>
                        <Link href="/dashboard/sauvegarde">
                            <i className="fas fa-floppy-disk"></i>
                            <span>Sauvegarde</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${pathname.includes('/dashboard/mise-a-jour') ? 'active' : ''}`}>
                        <Link href="/dashboard/mise-a-jour">
                            <i className="fas fa-cloud-download-alt"></i>
                            <span>Mise à jour (Connect)</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            // Supprimer le cookie d'authentification
                            document.cookie = 'skoolis_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                            // Rediriger vers la page de login
                            window.location.href = '/login';
                        }}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Déconnexion</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="avatar">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="user-details">
                        <h4>{user?.name || "Admin Principal"}</h4>
                        <p>{user?.email || "admin@skoolis.com"}</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}
