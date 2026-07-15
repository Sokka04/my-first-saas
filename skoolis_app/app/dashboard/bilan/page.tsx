'use client';
import { useState, useEffect } from 'react';

// Ajout auto : helper d'entête d'authentification Bearer
const getAuthHeaders = (existingHeaders = {}) => {
    if (typeof window === 'undefined') return existingHeaders;
    const token = localStorage.getItem('skoolis_token');
    return token ? { ...existingHeaders, 'Authorization': `Bearer ${token}` } : existingHeaders;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function BilanGeneralPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchBilan = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch(`${API_BASE_URL}/finance/accounting/bilan-general`, { 
                /* credentials removed */,
                headers: getAuthHeaders({ 'Accept': 'application/json' })
            });
            if (res.ok) {
                setStats(await res.json());
            } else {
                const text = await res.text();
                setErrorMsg(`Erreur ${res.status}: ${text}`);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Impossible de contacter le serveur.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBilan();
    }, []);

    return (
        <>
            <div className="feature-section active">
                {errorMsg && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-triangle"></i> {errorMsg}
                    </div>
                )}

                <div className="stats-container">
                    <h4 className="stats-title"><i className="fas fa-chart-pie"></i> Statistiques Globales</h4>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-primary">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Frais d'Inscription</span>
                                <span className="stat-value">{stats ? stats.inscriptions?.toLocaleString() : '...'} FCFA</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-success">
                                <i className="fas fa-graduation-cap"></i>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Frais d'Écolage</span>
                                <span className="stat-value">{stats ? stats.ecolage?.toLocaleString() : '...'} FCFA</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-danger">
                                <i className="fas fa-history"></i>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Arriérés Récupérés</span>
                                <span className="stat-value">{stats ? stats.arrieres?.toLocaleString() : '...'} FCFA</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-warning">
                                <i className="fas fa-receipt"></i>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Autres Frais</span>
                                <span className="stat-value">{stats ? stats.autres_frais?.toLocaleString() : '...'} FCFA</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-container">
                    <div className="stat-card stat-card-hero">
                        <div>
                            <h4 className="stat-hero-title">Total des revenus encaissés</h4>
                            <div className="stat-hero-value">{stats ? stats.total_global?.toLocaleString() : '...'} FCFA</div>
                        </div>
                        <i className="fas fa-wallet stat-hero-icon"></i>
                    </div>
                </div>
            </div>
        </>
    );
}
