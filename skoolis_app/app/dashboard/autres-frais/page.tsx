'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AutresFraisPage() {
    const [activeTab, setActiveTab] = useState('configuration-frais');
    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    
    // Config Fees
    const [fees, setFees] = useState<any[]>([]);
    const [feeName, setFeeName] = useState('');
    const [feeType, setFeeType] = useState('unique');
    const [feeClassId, setFeeClassId] = useState('');
    const [feeAmountBoy, setFeeAmountBoy] = useState('');
    const [feeAmountGirl, setFeeAmountGirl] = useState('');
    const [feeDeadline, setFeeDeadline] = useState('');
    const [feeDesc, setFeeDesc] = useState('');

    // Assign Student Fee
    const [assignStudentClassId, setAssignStudentClassId] = useState('');
    const [assignStudentId, setAssignStudentId] = useState('');
    const [assignFeeId, setAssignFeeId] = useState('');
    const [assignAmount, setAssignAmount] = useState('');
    const [assignStatus, setAssignStatus] = useState('du');
    const [assignDate, setAssignDate] = useState('');
    const [assignRemarks, setAssignRemarks] = useState('');
    
    // Assign Class Fee
    const [assignClassClassId, setAssignClassClassId] = useState('');
    const [assignClassFeeId, setAssignClassFeeId] = useState('');
    const [assignClassAmountBoy, setAssignClassAmountBoy] = useState('');
    const [assignClassAmountGirl, setAssignClassAmountGirl] = useState('');
    const [assignClassDate, setAssignClassDate] = useState('');

    // Pay Fee
    const [payClassId, setPayClassId] = useState('');
    const [payStudentId, setPayStudentId] = useState('');
    const [studentDues, setStudentDues] = useState<any[]>([]);
    const [selectedDueId, setSelectedDueId] = useState('');
    const [payAmount, setPayAmount] = useState('');
    const [payDate, setPayDate] = useState('');
    const [payMethod, setPayMethod] = useState('especes');
    const [payRef, setPayRef] = useState('');
    const [payNotes, setPayNotes] = useState('');
    
    // Stats
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetchClasses();
        fetchFees();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/school-classes`, { credentials: 'include' });
            if (res.ok) setClasses(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchFees = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/other-fees`, { credentials: 'include' });
            if (res.ok) setFees(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchStudentsForClass = async (classId: string) => {
        if (!classId) { setStudents([]); return; }
        try {
            const res = await fetch(`${API_BASE_URL}/students?school_class_id=${classId}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setStudents(data.data || data);
            }
        } catch (err) { console.error(err); }
    };

    // --- TAB 1: CONFIGURATION ---
    const submitAddFee = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/other-fees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: feeName,
                    type: feeType,
                    school_class_id: feeClassId || null,
                    amount_boy: parseFloat(feeAmountBoy),
                    amount_girl: parseFloat(feeAmountGirl),
                    deadline: feeDeadline || null,
                    description: feeDesc
                })
            });
            if (res.ok) {
                alert('Frais ajouté avec succès !');
                fetchFees();
                setFeeName('');
                setFeeAmountBoy('');
                setFeeAmountGirl('');
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur');
            }
        } catch (err: any) { alert(err.message); }
    };

    const deleteFee = async (id: string) => {
        if (!confirm('Voulez-vous supprimer ce frais ?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/finance/other-fees/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                alert('Supprimé !');
                fetchFees();
            }
        } catch (err) { console.error(err); }
    };

    // --- TAB 2: ASSIGN STUDENT ---
    const submitAssignStudent = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/other-fees/assign-student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    student_id: assignStudentId,
                    other_fee_id: assignFeeId,
                    amount: parseFloat(assignAmount),
                    status: assignStatus,
                    assignment_date: assignDate,
                    remarks: assignRemarks
                })
            });
            if (res.ok) {
                alert('Frais assigné avec succès !');
                setAssignAmount('');
                setAssignRemarks('');
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur');
            }
        } catch (err: any) { alert(err.message); }
    };

    // --- TAB 3: ASSIGN CLASS ---
    const submitAssignClass = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/other-fees/assign-class`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    school_class_id: assignClassClassId,
                    other_fee_id: assignClassFeeId,
                    amount_boy: parseFloat(assignClassAmountBoy),
                    amount_girl: parseFloat(assignClassAmountGirl),
                    assignment_date: assignClassDate
                })
            });
            if (res.ok) {
                const data = await res.json();
                alert(data.message);
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur');
            }
        } catch (err: any) { alert(err.message); }
    };

    // --- TAB 4: PAY FEE ---
    const handlePayStudentChange = async (e: any) => {
        const sid = e.target.value;
        setPayStudentId(sid);
        if (!sid) { setStudentDues([]); return; }
        try {
            const res = await fetch(`${API_BASE_URL}/finance/other-fees/student/${sid}/dues`, { credentials: 'include' });
            if (res.ok) setStudentDues(await res.json());
        } catch (err) { console.error(err); }
    };

    const submitPayment = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/other-fees/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    student_other_fee_id: selectedDueId,
                    paid_amount: parseFloat(payAmount),
                    payment_date: payDate,
                    payment_method: payMethod,
                    reference: payRef,
                    notes: payNotes
                })
            });
            if (res.ok) {
                alert('Paiement enregistré !');
                setPayAmount('');
                setPayRef('');
                setPayNotes('');
                handlePayStudentChange({target: {value: payStudentId}}); // reload
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur');
            }
        } catch (err: any) { alert(err.message); }
    };

    // --- TAB 5: STATS ---
    const loadStats = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/other-fees/stats`, { credentials: 'include' });
            if (res.ok) setStats(await res.json());
        } catch (err) { console.error(err); }
    };
    
    useEffect(() => {
        if (activeTab === 'etat-financier') loadStats();
    }, [activeTab]);

    return (
        <>


            <div className="features-nav">
                <button className={`feature-btn ${activeTab === 'configuration-frais' ? 'active' : ''}`} onClick={() => setActiveTab('configuration-frais')}>
                    <i className="fas fa-cog"></i> Configuration des Frais
                </button>
                <button className={`feature-btn ${activeTab === 'frais-élève' ? 'active' : ''}`} onClick={() => setActiveTab('frais-élève')}>
                    <i className="fas fa-user-graduate"></i> Frais par Élève
                </button>
                <button className={`feature-btn ${activeTab === 'frais-classe' ? 'active' : ''}`} onClick={() => setActiveTab('frais-classe')}>
                    <i className="fas fa-chalkboard"></i> Frais par Classe
                </button>
                <button className={`feature-btn ${activeTab === 'payer-frais' ? 'active' : ''}`} onClick={() => setActiveTab('payer-frais')}>
                    <i className="fas fa-credit-card"></i> Payer Frais
                </button>
                <button className={`feature-btn ${activeTab === 'etat-financier' ? 'active' : ''}`} onClick={() => setActiveTab('etat-financier')}>
                    <i className="fas fa-chart-pie"></i> État Financier
                </button>
            </div>

            {/* ONGLET 1: CONFIGURATION */}
            {activeTab === 'configuration-frais' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-cog"></i> Configuration des Frais</h3>
                            <p>Créez et configurez les différents types de frais pour l'école</p>
                        </div>
                    </div>
                    
                    <div className="form-container">
                        <div className="form-section">
                            <h4 className="form-section-title"><i className="fas fa-plus-circle"></i> Ajouter un nouveau Frais</h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nom du frais *</label>
                                    <input type="text" value={feeName} onChange={e => setFeeName(e.target.value)} placeholder="Ex: Uniforme" />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select value={feeType} onChange={e => setFeeType(e.target.value)}>
                                        <option value="unique">Unique (une fois)</option>
                                        <option value="journalier">Journalier</option>
                                        <option value="periodique">Périodique</option>
                                        <option value="occasionnel">Occasionnel</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Classe assignée (Optionnel)</label>
                                    <select value={feeClassId} onChange={e => setFeeClassId(e.target.value)}>
                                        <option value="">Toutes les classes</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Montant Garçon (FCFA) *</label>
                                    <input type="number" min="0" value={feeAmountBoy} onChange={e => setFeeAmountBoy(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Montant Fille (FCFA) *</label>
                                    <input type="number" min="0" value={feeAmountGirl} onChange={e => setFeeAmountGirl(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Date limite</label>
                                    <input type="date" value={feeDeadline} onChange={e => setFeeDeadline(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-actions" style={{marginTop: '20px'}}>
                                <button className="btn btn-primary" onClick={submitAddFee}><i className="fas fa-plus"></i> Ajouter ce frais</button>
                            </div>
                        </div>

                        <div className="form-section" style={{marginTop: '30px'}}>
                            <h4 className="form-section-title"><i className="fas fa-list"></i> Liste des frais configurés</h4>
                            <div className="table-responsive">
                                <table className="frais-table" style={{width: '100%', borderCollapse: 'collapse', marginTop: '15px'}}>
                                    <thead style={{backgroundColor: '#f8f9fa'}}>
                                        <tr>
                                            <th style={{padding: '10px', textAlign: 'left'}}>Nom</th>
                                            <th style={{padding: '10px', textAlign: 'left'}}>Type</th>
                                            <th style={{padding: '10px', textAlign: 'left'}}>Classe</th>
                                            <th style={{padding: '10px', textAlign: 'left'}}>Garçon</th>
                                            <th style={{padding: '10px', textAlign: 'left'}}>Fille</th>
                                            <th style={{padding: '10px', textAlign: 'left'}}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fees.length === 0 ? (
                                            <tr><td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>Aucun frais configuré</td></tr>
                                        ) : fees.map(f => (
                                            <tr key={f.id} style={{borderBottom: '1px solid #eee'}}>
                                                <td style={{padding: '10px'}}>{f.name}</td>
                                                <td style={{padding: '10px'}}>{f.type}</td>
                                                <td style={{padding: '10px'}}>{f.school_class?.name || 'Toutes'}</td>
                                                <td style={{padding: '10px'}}>{f.amount_boy}</td>
                                                <td style={{padding: '10px'}}>{f.amount_girl}</td>
                                                <td style={{padding: '10px'}}>
                                                    <button onClick={() => deleteFee(f.id)} style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer'}}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ONGLET 2: FRAIS PAR ÉLÈVE */}
            {activeTab === 'frais-élève' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-user-graduate"></i> Frais par Élève</h3>
                            <p>Assignation et gestion des frais individuellement par élève</p>
                        </div>
                    </div>
                    <div className="form-container">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Classe</label>
                                <select value={assignStudentClassId} onChange={e => { setAssignStudentClassId(e.target.value); fetchStudentsForClass(e.target.value); }}>
                                    <option value="">Sélectionner une classe</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Élève</label>
                                <select value={assignStudentId} onChange={e => setAssignStudentId(e.target.value)} disabled={!assignStudentClassId}>
                                    <option value="">Sélectionner un élève</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Frais</label>
                                <select value={assignFeeId} onChange={e => {
                                    setAssignFeeId(e.target.value);
                                    const f = fees.find(x => x.id === e.target.value);
                                    if(f) {
                                        const s = students.find(x => x.id === assignStudentId);
                                        if(s && s.gender === 'F') setAssignAmount(f.amount_girl);
                                        else setAssignAmount(f.amount_boy);
                                    }
                                }}>
                                    <option value="">Sélectionner un frais</option>
                                    {fees.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Montant (FCFA) *</label>
                                <input type="number" min="0" value={assignAmount} onChange={e => setAssignAmount(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Statut</label>
                                <select value={assignStatus} onChange={e => setAssignStatus(e.target.value)}>
                                    <option value="du">Dû</option>
                                    <option value="paye">Payé (comptant)</option>
                                    <option value="exonere">Exonéré</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date d'assignation *</label>
                                <input type="date" value={assignDate} onChange={e => setAssignDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-actions" style={{marginTop: '20px'}}>
                            <button className="btn btn-primary" onClick={submitAssignStudent} disabled={!assignStudentId || !assignFeeId}><i className="fas fa-save"></i> Assigner le frais</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ONGLET 3: FRAIS PAR CLASSE */}
            {activeTab === 'frais-classe' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-chalkboard"></i> Frais par Classe</h3>
                            <p>Assignation en masse des frais à toute une classe</p>
                        </div>
                    </div>
                    <div className="form-container">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Classe cible *</label>
                                <select value={assignClassClassId} onChange={e => setAssignClassClassId(e.target.value)}>
                                    <option value="">Sélectionner une classe</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Frais *</label>
                                <select value={assignClassFeeId} onChange={e => {
                                    setAssignClassFeeId(e.target.value);
                                    const f = fees.find(x => x.id === e.target.value);
                                    if(f) {
                                        setAssignClassAmountBoy(f.amount_boy);
                                        setAssignClassAmountGirl(f.amount_girl);
                                    }
                                }}>
                                    <option value="">Sélectionner un frais</option>
                                    {fees.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Montant Garçon (FCFA) *</label>
                                <input type="number" min="0" value={assignClassAmountBoy} onChange={e => setAssignClassAmountBoy(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Montant Fille (FCFA) *</label>
                                <input type="number" min="0" value={assignClassAmountGirl} onChange={e => setAssignClassAmountGirl(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Date d'assignation *</label>
                                <input type="date" value={assignClassDate} onChange={e => setAssignClassDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-actions" style={{marginTop: '20px'}}>
                            <button className="btn btn-primary" onClick={submitAssignClass} disabled={!assignClassClassId || !assignClassFeeId}><i className="fas fa-users"></i> Assigner à toute la classe</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ONGLET 4: PAYER FRAIS */}
            {activeTab === 'payer-frais' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-credit-card"></i> Payer Frais</h3>
                            <p>Enregistrement des paiements pour les frais divers</p>
                        </div>
                    </div>
                    <div className="form-container">
                        <div className="form-grid" style={{marginBottom: '30px'}}>
                            <div className="form-group">
                                <label>Classe</label>
                                <select value={payClassId} onChange={e => { setPayClassId(e.target.value); fetchStudentsForClass(e.target.value); setStudentDues([]); }}>
                                    <option value="">Sélectionner une classe</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Élève</label>
                                <select value={payStudentId} onChange={handlePayStudentChange} disabled={!payClassId}>
                                    <option value="">Sélectionner un élève</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>)}
                                </select>
                            </div>
                        </div>

                        {studentDues.length > 0 ? (
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Frais à payer</label>
                                    <select value={selectedDueId} onChange={e => setSelectedDueId(e.target.value)}>
                                        <option value="">Sélectionner le frais concerné</option>
                                        {studentDues.filter(d => d.reste_a_payer > 0).map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.other_fee?.name} - Reste: {d.reste_a_payer} FCFA
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Montant payé (FCFA) *</label>
                                    <input type="number" min="1" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Méthode</label>
                                    <select value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                                        <option value="especes">Espèces</option>
                                        <option value="mobile">Mobile Money</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Référence</label>
                                    <input type="text" value={payRef} onChange={e => setPayRef(e.target.value)} />
                                </div>
                                <div className="form-actions full-width" style={{marginTop: '20px'}}>
                                    <button className="btn btn-primary" onClick={submitPayment} disabled={!selectedDueId}><i className="fas fa-save"></i> Valider Paiement</button>
                                </div>
                            </div>
                        ) : (
                            payStudentId && <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>Cet élève n'a aucun frais en attente de paiement.</div>
                        )}
                    </div>
                </div>
            )}

            {/* ONGLET 5: ETAT FINANCIER */}
            {activeTab === 'etat-financier' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-chart-pie"></i> État Financier Global</h3>
                            <p>Bilan des recouvrements pour les frais annexes</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn btn-primary" onClick={loadStats}><i className="fas fa-sync-alt"></i> Rafraîchir</button>
                        </div>
                    </div>
                    {stats && (
                        <div className="etat-summary" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '20px'}}>
                            <div className="summary-card" style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                                <h5 style={{color: '#666'}}>Total Attendu</h5>
                                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#333'}}>{stats.total_attendu.toLocaleString()} FCFA</div>
                            </div>
                            <div className="summary-card" style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                                <h5 style={{color: '#666'}}>Total Perçu</h5>
                                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)'}}>{stats.total_percu.toLocaleString()} FCFA</div>
                            </div>
                            <div className="summary-card" style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                                <h5 style={{color: '#666'}}>Total Restant (Impayés)</h5>
                                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger-color)'}}>{stats.total_restant.toLocaleString()} FCFA</div>
                            </div>
                            <div className="summary-card" style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                                <h5 style={{color: '#666'}}>Taux de Recouvrement</h5>
                                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)'}}>{stats.taux_recouvrement}%</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
