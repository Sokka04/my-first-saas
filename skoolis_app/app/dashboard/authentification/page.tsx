'use client';
import { useState } from 'react';

// Ajout auto : helper d'entête d'authentification Bearer
const getAuthHeaders = (existingHeaders = {}) => {
    if (typeof window === 'undefined') return existingHeaders;
    const token = localStorage.getItem('skoolis_token');
    return token ? { ...existingHeaders, 'Authorization': `Bearer ${token}` } : existingHeaders;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AuthentificationPage() {
    const [receiptNumber, setReceiptNumber] = useState('');
    const [receiptData, setReceiptData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const verifyReceipt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiptNumber) return;

        setLoading(true);
        setErrorMsg('');
        setReceiptData(null);
        
        try {
            const res = await fetch(`${API_BASE_URL}/finance/accounting/receipts/${receiptNumber}`, {
                
                headers: getAuthHeaders({ 'Accept': 'application/json' })
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.valid) {
                    setReceiptData(data);
                } else {
                    setErrorMsg('Reçu introuvable ou invalide.');
                }
            } else {
                if (res.status === 404) {
                    setErrorMsg('Ce reçu n\'existe pas dans la base de données.');
                } else {
                    setErrorMsg('Erreur serveur lors de la vérification.');
                }
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
                            <i className="fas fa-shield-alt"></i>
                            Vérification Sécurisée
                        </h4>
                        <p className="auth-description">
                            Saisissez le numéro figurant sur le reçu (ex: REC-INS-240712-A1B2) pour confirmer sa validité dans notre base de données.
                        </p>
                        
                        <form onSubmit={verifyReceipt}>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="form-group" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <i className="fas fa-search" style={{ position: 'absolute', left: '15px', color: 'var(--border-color)', fontSize: '1.2rem' }}></i>
                                        <input 
                                            type="text" 
                                            placeholder="REC-..." 
                                            value={receiptNumber}
                                            onChange={e => setReceiptNumber(e.target.value.toUpperCase())}
                                            className="receipt-input"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-actions" style={{ justifyContent: 'center', marginTop: '30px' }}>
                                <button type="submit" className="btn btn-primary" disabled={loading || !receiptNumber} style={{ padding: '12px 40px', fontSize: '1.1rem' }}>
                                    <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-check-circle'}`}></i> 
                                    {loading ? ' Vérification...' : ' Vérifier le reçu'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {receiptData && receiptData.valid && (
                        <div className="resultats-bilan">
                            <h4 className="form-section-title text-success">
                                <i className="fas fa-check-circle"></i>
                                Reçu Authentique - Validé
                            </h4>
                            
                            <div className="stats-resume">
                                <div className="stat-card">
                                    <div className="stat-icon stat-icon-solid-primary">
                                        <i className="fas fa-hashtag"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h5>Numéro Officiel</h5>
                                        <div className="stat-value" style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>{receiptData.receipt_number}</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon stat-icon-solid-success">
                                        <i className="fas fa-calendar-check"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h5>Horodatage</h5>
                                        <div className="stat-value" style={{ fontSize: '1.1rem' }}>{new Date(receiptData.created_at).toLocaleString('fr-FR')}</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon stat-icon-solid-warning">
                                        <i className="fas fa-user-graduate"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h5>Bénéficiaire</h5>
                                        <div className="stat-value">{receiptData.student}</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon stat-icon-solid-danger">
                                        <i className="fas fa-tag"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h5>Objet / Canal</h5>
                                        <div className="stat-value" style={{ fontSize: '1.1rem' }}>
                                            <span className="badge badge-info">{receiptData.type}</span> 
                                            <span style={{ marginLeft: '10px', textTransform: 'capitalize' }}>
                                                <i className={`fas fa-${receiptData.method === 'especes' ? 'coins' : receiptData.method === 'flooz' ? 'mobile-alt' : 'credit-card'}`}></i> {receiptData.method}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="receipt-certified">
                                <div>
                                    <span className="receipt-certified-label">Montant Certifié</span>
                                </div>
                                <div className="receipt-certified-value">
                                    {receiptData.amount?.toLocaleString()} <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>FCFA</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
