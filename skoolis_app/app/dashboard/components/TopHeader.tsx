"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TopHeader() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [showNotifs, setShowNotifs] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{label: string, href: string}[]>([]);
    const pathname = usePathname();
    const notifsRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<HTMLDivElement>(null);

    const allPages = [
        { label: 'Tableau de bord', href: '/dashboard' },
        { label: 'Gestion des Classes', href: '/dashboard/classes' },
        { label: 'Gestion des Élèves', href: '/dashboard/students' },
        { label: 'Gestion des Professeurs', href: '/dashboard/teachers' },
        { label: 'Notes et Moyennes', href: '/dashboard/notes' },
        { label: 'Gestion des Matières', href: '/dashboard/matieres' },
        { label: "Frais d'inscription", href: '/dashboard/inscription' },
        { label: "Frais d'Ecolage", href: '/dashboard/ecolage' },
        { label: "Arriéré d'Ecolage", href: '/dashboard/arriere_ecolage' },
        { label: 'Autres Frais', href: '/dashboard/autres-frais' },
        { label: 'Bilan Financier', href: '/dashboard/bilan' },
        { label: 'Bilan Journalier', href: '/dashboard/bilan-journalier' },
        { label: 'Résultats & Bulletins', href: '/dashboard/resultats' },
        { label: 'BEPC Blanc', href: '/dashboard/bepc-blanc' },
        { label: 'Configuration', href: '/dashboard/config' },
        { label: 'Administrateurs', href: '/dashboard/admin' },
        { label: 'Utilisateurs', href: '/dashboard/users' },
        { label: 'Authentification Reçu', href: '/dashboard/authentification' },
        { label: 'Sauvegarde', href: '/dashboard/sauvegarde' },
        { label: 'Mise à jour', href: '/dashboard/mise-a-jour' },
        { label: 'Aide & Support', href: '/dashboard/aide' },
    ];

    const notifications = [
        { id: 1, icon: 'fas fa-user-plus', text: 'Nouvel élève inscrit en 3ème A', time: 'Il y a 5 min', read: false },
        { id: 2, icon: 'fas fa-money-bill', text: 'Paiement reçu — Tranche 2', time: 'Il y a 30 min', read: false },
        { id: 3, icon: 'fas fa-exclamation-triangle', text: 'Capacité atteinte en 6ème B', time: 'Il y a 2h', read: false },
    ];

    const messages = [
        { id: 1, sender: 'M. Koné', text: 'Les bulletins sont prêts pour validation.', time: 'Il y a 10 min', read: false },
        { id: 2, sender: 'Mme Diallo', text: 'Demande de congé pour la semaine prochaine.', time: 'Il y a 1h', read: false },
        { id: 3, sender: 'Direction', text: 'Réunion pédagogique lundi 9h.', time: 'Il y a 3h', read: false },
        { id: 4, sender: 'Secrétariat', text: 'Rappel : dossiers incomplets à vérifier.', time: 'Hier', read: true },
        { id: 5, sender: 'IT Support', text: 'Mise à jour serveur programmée ce soir.', time: 'Hier', read: true },
    ];

    useEffect(() => {
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

    // Fermer les dropdowns au clic extérieur
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
            if (messagesRef.current && !messagesRef.current.contains(e.target as Node)) setShowMessages(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
        window.localStorage.setItem("skoolis-theme", newTheme);
        document.cookie = "skoolis-theme=" + newTheme + "; path=/; max-age=31536000; SameSite=Lax";
    };

    const handleSearch = (q: string) => {
        setSearchQuery(q);
        if (q.trim().length < 2) { setSearchResults([]); return; }
        const lower = q.toLowerCase();
        setSearchResults(allPages.filter(p => p.label.toLowerCase().includes(lower)));
    };

    const handleLogout = () => {
        document.cookie = 'skoolis_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('skoolis_token');
        localStorage.removeItem('skoolis_user');
        window.location.href = '/login-app';
    };

    const getHeaderContent = () => {
        if (pathname?.includes('/dashboard/admin')) return { title: 'Gestion des Administrateurs', subtitle: 'Créez et gérez les comptes administrateurs du système' };
        if (pathname?.includes('/dashboard/users')) return { title: 'Gestion des Utilisateurs', subtitle: 'Gérez les accès et permissions des utilisateurs du système' };
        if (pathname?.includes('/dashboard/config')) return { title: 'Configuration du système', subtitle: 'Gérez les paramètres scolaires et système de Skoolis' };
        if (pathname?.includes('/dashboard/bilan-journalier')) return { title: 'Bilan Journalier et Périodique', subtitle: 'Analysez les encaissements sur une période précise' };
        if (pathname?.includes('/dashboard/bilan')) return { title: 'Bilan Financier Général', subtitle: "Analyse des revenus globaux de l'établissement" };
        if (pathname?.includes('/dashboard/authentification')) return { title: 'Authentification de Reçu', subtitle: "Vérifier l'authenticité d'un reçu de paiement" };
        if (pathname?.includes('/dashboard/classes')) return { title: 'Gestion des Classes', subtitle: "Gérez toutes les classes de l'établissement" };
        if (pathname?.includes('/dashboard/students')) return { title: 'Gestion des Élèves', subtitle: 'Gérez les inscriptions et les informations des élèves' };
        if (pathname?.includes('/dashboard/teachers')) return { title: 'Gestion des Professeurs', subtitle: "Gérez l'équipe pédagogique et leurs affectations" };
        if (pathname?.includes('/dashboard/notes')) return { title: 'Notes et Moyennes', subtitle: 'Saisie des notes et calcul des moyennes' };
        if (pathname?.includes('/dashboard/matieres')) return { title: 'Gestion des Matières', subtitle: 'Créez, gérez et attribuez les matières' };
        if (pathname?.includes('/dashboard/inscription')) return { title: "Frais d'inscription", subtitle: "Gestion des frais d'inscription et des paiements" };
        if (pathname?.includes('/dashboard/ecolage')) return { title: "Frais d'Ecolage", subtitle: 'Gestion des frais de scolarité, tranches et aménagements' };
        if (pathname?.includes('/dashboard/arriere_ecolage')) return { title: "Arriéré d'Ecolage", subtitle: 'Gestion des paiements en retard et des remises' };
        if (pathname?.includes('/dashboard/autres-frais')) return { title: 'Autres Frais', subtitle: 'Gestion des frais divers (uniforme, cantine, etc.)' };
        if (pathname?.includes('/dashboard/resultats')) return { title: 'Résultats & Bulletins', subtitle: 'Classements, bulletins et délibérations scolaires' };
        if (pathname?.includes('/dashboard/bepc-blanc')) return { title: 'BEPC Blanc', subtitle: "Simulation et préparation au Brevet d'Études du Premier Cycle" };
        if (pathname?.includes('/dashboard/aide')) return { title: 'Aide & Support', subtitle: "Centre d'aide et documentation utilisateur" };
        if (pathname?.includes('/dashboard/sauvegarde')) return { title: 'Sauvegarde & Restauration', subtitle: 'Gérez les sauvegardes de vos données locales' };
        if (pathname?.includes('/dashboard/mise-a-jour')) return { title: 'Mise à jour (Skoolis Connect)', subtitle: 'Vérifiez les mises à jour et connectez-vous au cloud' };
        return { title: 'Skoolis - Tableau de bord', subtitle: 'Bienvenue dans votre espace de gestion scolaire' };
    };

    const content = getHeaderContent();

    const dropdownStyle: React.CSSProperties = {
        position: 'absolute', top: '100%', right: 0, marginTop: '8px',
        width: '340px', maxHeight: '400px', overflowY: 'auto',
        borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.18)',
        zIndex: 1000, padding: '0',
        background: 'var(--white, #fff)',
        border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
    };

    const itemStyle = (read: boolean): React.CSSProperties => ({
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        padding: '14px 16px', cursor: 'pointer', transition: 'background 0.2s',
        borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))',
        opacity: read ? 0.6 : 1,
    });

    return (
        <header className="top-header">
            <div className="header-left">
                <h2>{content.title}</h2>
                <p>{content.subtitle}</p>
            </div>
            <div className="header-right">
                {/* Recherche fonctionnelle */}
                <div className="search-box" style={{ position: 'relative', overflow: 'visible', zIndex: 999 }}>
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Rechercher une page..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onBlur={() => setTimeout(() => setSearchResults([]), 300)}
                    />
                    {searchResults.length > 0 && (
                        <div style={{
                            position: 'absolute', top: '110%', left: 0, right: 0,
                            background: 'var(--white, #fff)', border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                            borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.18)',
                            zIndex: 1000, padding: '4px 0', maxHeight: '300px', overflowY: 'auto',
                        }}>
                            {searchResults.map(r => (
                                <a key={r.href} href={r.href}
                                   style={{ display: 'block', padding: '10px 16px', textDecoration: 'none', color: 'inherit', fontSize: '14px', transition: 'background 0.15s' }}
                                   onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--secondary-color, #f3e5f5)')}
                                   onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <i className="fas fa-arrow-right" style={{ marginRight: '8px', opacity: 0.5, fontSize: '12px' }}></i>
                                    {r.label}
                                </a>
                            ))}
                            <a href="/dashboard/aide"
                               style={{ display: 'block', padding: '10px 16px', textDecoration: 'none', color: 'var(--primary-color, #7b1fa2)', fontSize: '13px', fontWeight: 600, textAlign: 'center', borderTop: '1px solid var(--border-color, rgba(0,0,0,0.08))' }}
                            >
                                <i className="fas fa-question-circle" style={{ marginRight: '6px' }}></i>
                                Regarder l{"'"}aide
                            </a>
                        </div>
                    )}
                </div>

                <div className="header-icons">
                    {/* Notifications */}
                    <div ref={notifsRef} style={{ position: 'relative' }}>
                        <button className="icon-btn notification" onClick={() => { setShowNotifs(!showNotifs); setShowMessages(false); }}>
                            <i className="fas fa-bell"></i>
                            <span className="badge">{notifications.filter(n => !n.read).length}</span>
                        </button>
                        {showNotifs && (
                            <div style={dropdownStyle}>
                                <div style={{ padding: '14px 16px', fontWeight: 600, fontSize: '15px', borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))' }}>
                                    Notifications
                                </div>
                                {notifications.map(n => (
                                    <div key={n.id} style={itemStyle(n.read)}
                                         onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--secondary-color, #f3e5f5)')}
                                         onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color, #7b1fa2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px' }}>
                                            <i className={n.icon}></i>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.4 }}>{n.text}</p>
                                            <span style={{ fontSize: '11px', opacity: 0.5 }}>{n.time}</span>
                                        </div>
                                        {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color, #7b1fa2)', flexShrink: 0, marginTop: '4px' }}></div>}
                                    </div>
                                ))}
                                <div style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 500, color: 'var(--primary-color, #7b1fa2)', cursor: 'pointer' }}>
                                    Voir toutes les notifications
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    <div ref={messagesRef} style={{ position: 'relative' }}>
                        <button className="icon-btn" onClick={() => { setShowMessages(!showMessages); setShowNotifs(false); }}>
                            <i className="fas fa-envelope"></i>
                            <span className="badge">{messages.filter(m => !m.read).length}</span>
                        </button>
                        {showMessages && (
                            <div style={dropdownStyle}>
                                <div style={{ padding: '14px 16px', fontWeight: 600, fontSize: '15px', borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))' }}>
                                    Messages
                                </div>
                                {messages.map(m => (
                                    <div key={m.id} style={itemStyle(m.read)}
                                         onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--secondary-color, #f3e5f5)')}
                                         onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color, #7b1fa2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', fontWeight: 700 }}>
                                            {m.sender.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{m.sender}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '12px', opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.text}</p>
                                            <span style={{ fontSize: '11px', opacity: 0.5 }}>{m.time}</span>
                                        </div>
                                        {!m.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color, #7b1fa2)', flexShrink: 0, marginTop: '4px' }}></div>}
                                    </div>
                                ))}
                                <div style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 500, color: 'var(--primary-color, #7b1fa2)', cursor: 'pointer' }}>
                                    Voir tous les messages
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mode sombre */}
                    <button className="icon-btn" id="themeToggle" onClick={toggleTheme}>
                        <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
                    </button>

                    {/* Déconnexion */}
                    <button className="icon-btn" onClick={handleLogout} title="Se déconnecter">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </div>
            </div>
        </header>
    );
}
