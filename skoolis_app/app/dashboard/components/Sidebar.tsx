"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sidebar">
            <div className="logo-container">
                <div className="logo">
                    <div className="logo-top" style={{ justifyContent: 'center', marginBottom: '15px' }}>
                        <img src="/skoolis_logo.png" alt="Skoolis Logo" style={{ maxHeight: '28px', width: 'auto', objectFit: 'contain' }} />
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
                    <li className={`nav-item ${isActive('/app/classes') ? 'active' : ''}`}>
                        <Link href="/app/classes">
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
                    <li className={`nav-item ${isActive('/app/professeurs') ? 'active' : ''}`}>
                        <Link href="/app/professeurs">
                            <i className="fas fa-chalkboard-teacher"></i>
                            <span>Professeurs</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/app/notes') ? 'active' : ''}`}>
                        <Link href="/app/notes">
                            <i className="fas fa-chart-line"></i>
                            <span>Notes & Moyennes</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive('/app/matieres') ? 'active' : ''}`}>
                        <Link href="/app/matieres">
                            <i className="fas fa-book"></i>
                            <span>Matières</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="nav-section">
                <h3 className="section-title">Comptabilité</h3>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link href="/app/inscription">
                            <i className="fas fa-file-invoice-dollar"></i>
                            <span>Frais d'inscription</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/app/ecolage">
                            <i className="fas fa-credit-card"></i>
                            <span>Frais d'Ecolage</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/app/arriere_ecolage">
                            <i className="fas fa-clock"></i>
                            <span>Arriéré d'écolage</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/app/autres-frais">
                            <i className="fas fa-receipt"></i>
                            <span>Autres Frais</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/app/bilan">
                            <i className="fas fa-chart-bar"></i>
                            <span>Bilan général</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/app/bilan-journalier">
                            <i className="fas fa-calendar-alt"></i>
                            <span>Bilan journalier / périodique</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/app/authentification">
                            <i className="fas fa-stamp"></i>
                            <span>Authentification de reçu</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="nav-section">
                <h3 className="section-title">Administration</h3>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link href="/app/configuration">
                            <i className="fas fa-cog"></i>
                            <span>Configuration</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/app/admin">
                            <i className="fas fa-user-shield"></i>
                            <span>Administrateur</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/app/users">
                            <i className="fas fa-users"></i>
                            <span>Utilisateurs</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="nav-section">
                <h3 className="section-title">Examens</h3>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link href="/app/resultats">
                            <i className="fas fa-poll"></i>
                            <span>Résultats</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/app/bepc-blanc">
                            <i className="fas fa-file-alt"></i>
                            <span>BEPC Blanc</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="nav-section">
                <h3 className="section-title">Aide</h3>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link href="/app/aide">
                            <i className="fas fa-question-circle"></i>
                            <span>Aide & Support</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a href="#" onClick={(e) => { e.preventDefault(); }}>
                            <i className="fas fa-floppy-disk"></i>
                            <span>Sauvegarde</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#">
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
                        <h4>Admin Principal</h4>
                        <p>admin@skoolis.com</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}
