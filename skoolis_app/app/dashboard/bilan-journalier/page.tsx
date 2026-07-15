'use client';
import { useState } from 'react';

// Ajout auto : helper d'entête d'authentification Bearer
const getAuthHeaders = (existingHeaders = {}) => {
    if (typeof window === 'undefined') return existingHeaders;
    const token = localStorage.getItem('skoolis_token');
    return token ? { ...existingHeaders, 'Authorization': `Bearer ${token}` } : existingHeaders;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function BilanJournalierPage() {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchDailyBilan = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch(`${API_BASE_URL}/finance/accounting/bilan-journalier?start_date=${startDate}&end_date=${endDate}`, {
                
                headers: getAuthHeaders({ 'Accept': 'application/json' })
            });
            if (res.ok) {
                setData(await res.json());
            } else {
                setErrorMsg('Erreur serveur lors du chargement.');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Impossible de contacter le serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className="feature-section active">
                {errorMsg && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-triangle"></i> {errorMsg}
                    </div>
                )}

                <div className="form-container">
                    <div className="form-section">
                        <h4 className="form-section-title">
                            <i className="fas fa-calendar-alt"></i>
                            Période d'analyse
                        </h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label><i className="fas fa-calendar"></i> Date de début</label>
                                <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label><i className="fas fa-calendar"></i> Date de fin</label>
                                <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={fetchDailyBilan} disabled={loading}>
                                <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'}`}></i> 
                                {loading ? ' Chargement...' : ' Afficher le bilan'}
                            </button>
                        </div>
                    </div>

                    {data && (
                        <div className="resultats-bilan">
                            <h4 className="form-section-title">
                                <i className="fas fa-chart-line"></i>
                                Résultats de la période
                            </h4>
                            
                            <div className="stats-resume">
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-money-check-alt"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h5>Total encaissé</h5>
                                        <div className="stat-value">{data.total_amount?.toLocaleString()} FCFA</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-receipt"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h5>Nombre de paiements</h5>
                                        <div className="stat-value">{data.payments?.length || 0}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="details-bilan mt-4">
                                <h5 className="details-title">
                                    <i className="fas fa-list-ul"></i>
                                    Détails des transactions
                                </h5>
                                <div className="table-responsive">
                                    <table className="details-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Reçu N°</th>
                                                <th>Élève</th>
                                                <th>Type</th>
                                                <th>Méthode</th>
                                                <th>Montant (FCFA)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.payments?.length > 0 ? (
                                                data.payments.map((p: any) => (
                                                    <tr key={p.id}>
                                                        <td>{p.payment_date}</td>
                                                        <td><span className="badge badge-info">{p.receipt_number}</span></td>
                                                        <td><strong>{p.student}</strong></td>
                                                        <td><span className={`badge ${p.type === 'Inscription' ? 'badge-primary' : p.type === 'Ecolage' ? 'badge-success' : p.type === 'Arriéré' ? 'badge-danger' : 'badge-warning'}`}>{p.type}</span></td>
                                                        <td className="text-capitalize">{p.method}</td>
                                                        <td className="fw-bold">{p.amount?.toLocaleString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center p-4">Aucune transaction sur cette période.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
