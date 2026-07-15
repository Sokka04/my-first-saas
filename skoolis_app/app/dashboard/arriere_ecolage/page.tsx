"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Ajout auto : helper d'entête d'authentification Bearer
const getAuthHeaders = (existingHeaders = {}) => {
    if (typeof window === 'undefined') return existingHeaders;
    const token = localStorage.getItem('skoolis_token');
    return token ? { ...existingHeaders, 'Authorization': `Bearer ${token}` } : existingHeaders;
};

export default function ArriereEcolagePage() {
    const [activeTab, setActiveTab] = useState('payer-arriere');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [arrears, setArrears] = useState<any[]>([]);

    // Init Modal
    const [showInitModal, setShowInitModal] = useState(false);
    const [initClassId, setInitClassId] = useState('');
    const [initStudentId, setInitStudentId] = useState('');
    const [initAmount, setInitAmount] = useState('');
    const [initYear, setInitYear] = useState('2024-2025');

    // 1. Payer arriéré
    const [payClassId, setPayClassId] = useState('');
    const [payStudentId, setPayStudentId] = useState('');
    const [currentArrear, setCurrentArrear] = useState<any>(null);
    const [payAmount, setPayAmount] = useState('');
    const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
    const [payMethod, setPayMethod] = useState('especes');
    const [payReference, setPayReference] = useState('');
    const [payNotes, setPayNotes] = useState('');

    // 2. Remise
    const [discountAmount, setDiscountAmount] = useState('');

    useEffect(() => {
        fetchClasses();
        fetchArrears();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/school-classes`, { headers: getAuthHeaders({ 'Accept': 'application/json' }) });
            if (res.ok) {
                const data = await res.json();
                setClasses(data.data || []);
            }
        } catch (e) { console.error(e); }
    };

    const fetchArrears = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/arrears`, { headers: getAuthHeaders({ 'Accept': 'application/json' }) });
            if (res.ok) {
                const data = await res.json();
                setArrears(data.data || []);
            }
        } catch (e) { console.error(e); }
    };

    const fetchStudentsForClass = async (classId: string) => {
        setStudents([]);
        if (!classId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/students`, { headers: getAuthHeaders({ 'Accept': 'application/json' }) });
            if (res.ok) {
                const data = await res.json();
                const classStudents = data.data.filter((s: any) => s.current_enrollment?.school_class_id === classId);
                setStudents(classStudents);
            }
        } catch (e) { console.error(e); }
    };

    // --- INIT ARREAR ---
    const handleInitClassChange = (e: any) => {
        setInitClassId(e.target.value);
        setInitStudentId('');
        fetchStudentsForClass(e.target.value);
    };

    const handleInitYearChange = (e: any) => {
        let val = e.target.value;
        // On ne formate automatiquement que si l'utilisateur ajoute des caractères (pas s'il supprime)
        if (val.length > initYear.length && /^\d{4}$/.test(val)) {
            const nextYear = parseInt(val) + 1;
            val = `${val}-${nextYear}`;
        }
        setInitYear(val);
    };

    const submitInitArrear = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/finance/arrears/init`, {
                method: 'POST',
                headers: getAuthHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
                
                body: JSON.stringify({
                    student_id: initStudentId,
                    original_amount: parseFloat(initAmount),
                    academic_year: initYear
                })
            });
            if (res.ok) {
                alert('Arriéré initialisé');
                setShowInitModal(false);
                fetchArrears();
            } else {
                alert('Erreur lors de l\'initialisation');
            }
        } catch (err: any) { alert(err.message); }
    };

    // --- SHARED ---
    const handlePayClassChange = (e: any) => {
        setPayClassId(e.target.value);
        setPayStudentId('');
        setCurrentArrear(null);
        fetchStudentsForClass(e.target.value);
    };

    const handlePayStudentChange = async (e: any) => {
        const val = e.target.value;
        setPayStudentId(val);
        setCurrentArrear(null);
        if (!val) return;

        try {
            const res = await fetch(`${API_BASE_URL}/finance/arrears/student/${val}`, { headers: getAuthHeaders({ 'Accept': 'application/json' }) });
            if (res.ok) {
                const data = await res.json();
                setCurrentArrear(data.data);
                setDiscountAmount(data.data.discount_amount);
            } else if (res.status === 404) {
                alert("Cet élève n'a aucun arriéré enregistré.");
                setPayStudentId('');
            }
        } catch (err) { console.error(err); }
    };

    const reloadCurrentArrear = async () => {
        if (!payStudentId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/finance/arrears/student/${payStudentId}`, { headers: getAuthHeaders({ 'Accept': 'application/json' }) });
            if (res.ok) {
                const data = await res.json();
                setCurrentArrear(data.data);
                setDiscountAmount(data.data.discount_amount);
                fetchArrears();
            }
        } catch (err) { console.error(err); }
    };

    // --- PAYER ---
    const submitPayment = async (e: any) => {
        e.preventDefault();
        if (!currentArrear) return;
        try {
            const res = await fetch(`${API_BASE_URL}/finance/arrears/payments`, {
                method: 'POST',
                headers: getAuthHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
                
                body: JSON.stringify({
                    arrear_id: currentArrear.id,
                    paid_amount: parseFloat(payAmount),
                    payment_date: payDate,
                    payment_method: payMethod,
                    reference: payReference,
                    notes: payNotes
                })
            });

            if (res.ok) {
                alert('Paiement enregistré !');
                setPayAmount('');
                setPayReference('');
                setPayNotes('');
                reloadCurrentArrear();
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur');
            }
        } catch (err: any) { alert(err.message); }
    };

    // --- REMISE ---
    const submitDiscount = async (e: any) => {
        e.preventDefault();
        if (!currentArrear) return;
        try {
            const res = await fetch(`${API_BASE_URL}/finance/arrears/discount`, {
                method: 'POST',
                headers: getAuthHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
                
                body: JSON.stringify({
                    arrear_id: currentArrear.id,
                    discount_amount: parseFloat(discountAmount) || 0
                })
            });
            if (res.ok) {
                alert('Remise appliquée !');
                reloadCurrentArrear();
            }
        } catch (err: any) { alert(err.message); }
    };

    // --- GRACIER ---
    const submitForgive = async () => {
        if (!currentArrear) return;
        if (!window.confirm("Êtes-vous sûr de vouloir gracier (effacer) la dette de cet élève ?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/finance/arrears/forgive`, {
                method: 'POST',
                headers: getAuthHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
                
                body: JSON.stringify({ arrear_id: currentArrear.id })
            });
            if (res.ok) {
                alert('Dette graciée !');
                reloadCurrentArrear();
            }
        } catch (err: any) { alert(err.message); }
    };


    return (
        <>
            <div className="page-actions" style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px 25px', backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
                <button className="btn btn-outline-primary" onClick={() => setShowInitModal(true)} style={{padding: '8px 15px', borderRadius: '20px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.9rem'}}>
                    <i className="fas fa-plus"></i> Déclarer un arriéré
                </button>
            </div>

            {showInitModal && (
                <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px'}}>
                        <h3 style={{marginBottom: '20px'}}>Initialiser un arriéré</h3>
                        <form onSubmit={submitInitArrear}>
                            <div className="form-group" style={{marginBottom: '15px'}}>
                                <label>Classe *</label>
                                <select value={initClassId} onChange={handleInitClassChange} required className="form-control" style={{width: '100%', padding: '10px'}}>
                                    <option value="">Sélectionner une classe</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{marginBottom: '15px'}}>
                                <label>Élève *</label>
                                <select value={initStudentId} onChange={e => setInitStudentId(e.target.value)} required className="form-control" style={{width: '100%', padding: '10px'}} disabled={!initClassId}>
                                    <option value="">Sélectionner un élève</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{marginBottom: '15px'}}>
                                <label>Dette Totale (FCFA) *</label>
                                <input type="number" min="1" value={initAmount} onChange={e => setInitAmount(e.target.value)} required className="form-control" style={{width: '100%', padding: '10px'}} />
                            </div>
                            <div className="form-group" style={{marginBottom: '20px'}}>
                                <label>Année de la dette</label>
                                <input type="text" value={initYear} onChange={handleInitYearChange} placeholder="Ex: 2024-2025" className="form-control" style={{width: '100%', padding: '10px'}} maxLength={9} />
                            </div>
                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowInitModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="features-nav">
                <button className={`feature-btn ${activeTab === 'payer-arriere' ? 'active' : ''}`} onClick={() => setActiveTab('payer-arriere')}>
                    <i className="fas fa-money-check-alt"></i> Payer arriéré
                </button>
                <button className={`feature-btn ${activeTab === 'remise-arriere' ? 'active' : ''}`} onClick={() => setActiveTab('remise-arriere')}>
                    <i className="fas fa-percentage"></i> Remise sur Arriéré
                </button>
                <button className={`feature-btn ${activeTab === 'gracier' ? 'active' : ''}`} onClick={() => setActiveTab('gracier')}>
                    <i className="fas fa-hand-holding-heart"></i> Gracier
                </button>
                <button className={`feature-btn ${activeTab === 'rechercher-recu' ? 'active' : ''}`} onClick={() => setActiveTab('rechercher-recu')}>
                    <i className="fas fa-search-dollar"></i> Rechercher reçu / Historique
                </button>
            </div>

            {/* Selection commune */}
            {(activeTab === 'payer-arriere' || activeTab === 'remise-arriere' || activeTab === 'gracier') && (
                <div style={{backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px'}}>
                    <h4 style={{marginBottom: '15px'}}><i className="fas fa-search"></i> Sélectionner le dossier d'arriéré</h4>
                    <div className="form-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
                        <div className="form-group">
                            <label>Classe</label>
                            <select value={payClassId} onChange={handlePayClassChange}>
                                <option value="">Sélectionner une classe</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Élève avec arriéré</label>
                            <select value={payStudentId} onChange={handlePayStudentChange} disabled={!payClassId}>
                                <option value="">Sélectionner un élève</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>)}
                            </select>
                        </div>
                    </div>

                    {currentArrear && (
                        <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div>
                                    <span style={{color: '#666', fontSize: '0.9rem'}}>Dette Initiale ({currentArrear.academic_year})</span>
                                    <h4 style={{margin: '5px 0'}}>{Number(currentArrear.original_amount).toLocaleString()} FCFA</h4>
                                </div>
                                <div>
                                    <span style={{color: '#666', fontSize: '0.9rem'}}>Remise</span>
                                    <h4 style={{margin: '5px 0'}}>{Number(currentArrear.discount_amount).toLocaleString()} FCFA</h4>
                                </div>
                                <div>
                                    <span style={{color: '#666', fontSize: '0.9rem'}}>Déjà Remboursé</span>
                                    <h4 style={{margin: '5px 0', color: '#28a745'}}>{Number(currentArrear.total_paid).toLocaleString()} FCFA</h4>
                                </div>
                                <div>
                                    <span style={{color: '#666', fontSize: '0.9rem'}}>Statut</span>
                                    {currentArrear.is_forgiven ? (
                                        <h4 style={{margin: '5px 0', color: '#17a2b8'}}><i className="fas fa-handshake"></i> GRACIÉ</h4>
                                    ) : (
                                        <h4 style={{margin: '5px 0', color: currentArrear.reste_a_payer === 0 ? '#28a745' : '#dc3545'}}>
                                            {currentArrear.reste_a_payer === 0 ? 'SOLDÉ' : `Reste: ${Number(currentArrear.reste_a_payer).toLocaleString()} FCFA`}
                                        </h4>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ONGLET 1: PAYER */}
            {activeTab === 'payer-arriere' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-money-check-alt"></i> Enregistrer un paiement</h3>
                        </div>
                    </div>
                    {currentArrear && !currentArrear.is_forgiven && currentArrear.reste_a_payer > 0 ? (
                        <div className="form-container">
                            <form onSubmit={submitPayment}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Montant Versé Aujourd'hui (FCFA) *</label>
                                        <input type="number" min="1" max={currentArrear.reste_a_payer} value={payAmount} onChange={e => setPayAmount(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Date de paiement *</label>
                                        <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Mode de paiement</label>
                                        <select value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                                            <option value="especes">Espèces</option>
                                            <option value="cheque">Chèque</option>
                                            <option value="virement">Virement</option>
                                            <option value="mobile">Mobile Money</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Référence (Optionnel)</label>
                                        <input type="text" value={payReference} onChange={e => setPayReference(e.target.value)} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Notes (Optionnel)</label>
                                        <textarea value={payNotes} onChange={e => setPayNotes(e.target.value)} rows={2}></textarea>
                                    </div>
                                </div>
                                <div className="form-actions" style={{marginTop: '20px'}}>
                                    <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Enregistrer le paiement</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div style={{textAlign: 'center', padding: '40px', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                            <i className="fas fa-info-circle" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                            <p>Veuillez sélectionner un élève ayant un arriéré non soldé pour enregistrer un paiement.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ONGLET 2: REMISE */}
            {activeTab === 'remise-arriere' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-percentage"></i> Appliquer une remise exceptionnelle</h3>
                        </div>
                    </div>
                    {currentArrear && !currentArrear.is_forgiven ? (
                        <div className="form-container">
                            <form onSubmit={submitDiscount}>
                                <div className="form-group" style={{maxWidth: '400px'}}>
                                    <label>Montant de la remise (FCFA) *</label>
                                    <input type="number" min="0" value={discountAmount} onChange={e => setDiscountAmount(e.target.value)} required />
                                    <small style={{color: '#666'}}>Ce montant sera déduit de la dette initiale de l'élève.</small>
                                </div>
                                <div className="form-actions" style={{marginTop: '20px'}}>
                                    <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Appliquer la remise</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div style={{textAlign: 'center', padding: '40px', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                            <i className="fas fa-info-circle" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                            <p>Veuillez sélectionner un élève ayant un arriéré pour appliquer une remise.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ONGLET 3: GRACIER */}
            {activeTab === 'gracier' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-hand-holding-heart"></i> Gracier la dette</h3>
                            <p style={{color: '#dc3545'}}>Attention : Cette action annulera définitivement le reste à payer de cet élève !</p>
                        </div>
                    </div>
                    {currentArrear && !currentArrear.is_forgiven && currentArrear.reste_a_payer > 0 ? (
                        <div className="form-container" style={{textAlign: 'center', padding: '40px'}}>
                            <i className="fas fa-exclamation-triangle" style={{fontSize: '3rem', color: '#dc3545', marginBottom: '20px'}}></i>
                            <h3>Voulez-vous effacer la dette de {currentArrear.reste_a_payer.toLocaleString()} FCFA ?</h3>
                            <button className="btn btn-danger" onClick={submitForgive} style={{marginTop: '20px', padding: '10px 30px', fontSize: '1.1rem'}}>
                                <i className="fas fa-check"></i> Oui, Gracirer cet élève
                            </button>
                        </div>
                    ) : (
                        <div style={{textAlign: 'center', padding: '40px', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                            <i className="fas fa-info-circle" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                            <p>Veuillez sélectionner un élève ayant un arriéré non soldé pour le gracier.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ONGLET 4 : HISTORIQUE */}
            {activeTab === 'rechercher-recu' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-search-dollar"></i> Suivi des arriérés</h3>
                            <p>Liste des élèves ayant des arriérés</p>
                        </div>
                    </div>

                    <div className="table-container full-width">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Élève</th>
                                    <th>Année Source</th>
                                    <th>Dette Initiale</th>
                                    <th>Remboursé</th>
                                    <th>Reste à payer</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrears.map(a => (
                                    <tr key={a.id}>
                                        <td><strong>{a.student?.last_name} {a.student?.first_name}</strong></td>
                                        <td>{a.academic_year}</td>
                                        <td>{Number(a.original_amount).toLocaleString()} F</td>
                                        <td><span style={{color: '#28a745'}}>{Number(a.total_paid).toLocaleString()} F</span></td>
                                        <td><strong>{Number(a.reste_a_payer).toLocaleString()} F</strong></td>
                                        <td>
                                            {a.is_forgiven ? <span className="badge badge-info">Gracié</span> :
                                             a.reste_a_payer === 0 ? <span className="badge badge-success">Soldé</span> :
                                             <span className="badge badge-danger">Impayé</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                                {arrears.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>Aucun arriéré dans le système.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
