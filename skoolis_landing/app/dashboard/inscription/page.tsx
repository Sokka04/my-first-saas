"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InscriptionPage() {
    const [activeTab, setActiveTab] = useState('tarifs');
    const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

    // Data lists
    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [feeConfigs, setFeeConfigs] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);

    // States for "Tarifs"
    const [tarifClassId, setTarifClassId] = useState('');
    const [tarifBoy, setTarifBoy] = useState('');
    const [tarifGirl, setTarifGirl] = useState('');

    // States for "Paiement"
    const [payClassId, setPayClassId] = useState('');
    const [payStudentId, setPayStudentId] = useState('');
    const [payExpectedAmount, setPayExpectedAmount] = useState<number>(0);
    const [payAmount, setPayAmount] = useState('');
    const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
    const [payMethod, setPayMethod] = useState('especes');
    const [payReference, setPayReference] = useState('');
    const [forceDouble, setForceDouble] = useState(false);

    useEffect(() => {
        fetchClasses();
        fetchFeeConfigs();
        fetchPayments();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/school-classes`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setClasses(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchFeeConfigs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/fee-configs`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setFeeConfigs(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchPayments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/payments`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setPayments(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchStudentsForClass = async (classId: string) => {
        setStudents([]);
        if (!classId) return;
        try {
            // Dans une vraie app, on aurait un point d'API students?class_id=X
            // Ici, on récupère tous les élèves et on filtre (ou si l'API le permet)
            const res = await fetch(`${API_BASE_URL}/students`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                // Assumons que le backend renvoie current_enrollment ou qu'on filtre manuellement
                const classStudents = data.data.filter((s: any) => s.current_enrollment?.school_class_id === classId);
                setStudents(classStudents);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const saveTarif = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/finance/fee-configs`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    school_class_id: tarifClassId,
                    amount_boy: parseFloat(tarifBoy),
                    amount_girl: parseFloat(tarifGirl),
                })
            });

            if (res.ok) {
                alert('Tarif enregistré avec succès');
                setTarifClassId('');
                setTarifBoy('');
                setTarifGirl('');
                fetchFeeConfigs();
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur');
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handlePayClassChange = (e: any) => {
        const val = e.target.value;
        setPayClassId(val);
        setPayStudentId('');
        setPayExpectedAmount(0);
        fetchStudentsForClass(val);
    };

    const handlePayStudentChange = (e: any) => {
        const val = e.target.value;
        setPayStudentId(val);
        
        if (val && payClassId) {
            const student = students.find(s => s.id === val);
            const config = feeConfigs.find(c => c.school_class_id === payClassId);
            if (student && config) {
                const isFemale = student.gender === 'F' || student.gender === 'female' || student.gender === 'fille';
                setPayExpectedAmount(isFemale ? parseFloat(config.amount_girl) : parseFloat(config.amount_boy));
            } else {
                setPayExpectedAmount(0);
            }
        } else {
            setPayExpectedAmount(0);
        }
    };

    const savePayment = async (e: any) => {
        e.preventDefault();
        if (!payStudentId || !payClassId || !payAmount) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/finance/payments`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    student_id: payStudentId,
                    school_class_id: payClassId,
                    expected_amount: payExpectedAmount,
                    paid_amount: parseFloat(payAmount),
                    payment_date: payDate,
                    payment_method: payMethod,
                    reference: payReference,
                    force_double_payment: forceDouble
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Paiement enregistré avec succès !');
                setPayAmount('');
                setPayReference('');
                setForceDouble(false);
                fetchPayments();
                setActiveTab('etats');
            } else if (res.status === 409) {
                // Conflit : Paiement le même jour
                const confirmed = window.confirm(data.message + "\n\nCliquez sur OK pour forcer le paiement.");
                if (confirmed) {
                    setForceDouble(true);
                    // L'utilisateur devra recliquer sur Enregistrer
                }
            } else {
                alert(data.message || 'Erreur lors du paiement');
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <>


            <div className="features-nav">
                <button 
                    className={`feature-btn ${activeTab === 'tarifs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tarifs')}
                >
                    <i className="fas fa-money-bill-wave"></i> Montant des Frais
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'paiement' ? 'active' : ''}`}
                    onClick={() => setActiveTab('paiement')}
                >
                    <i className="fas fa-credit-card"></i> Payer Inscription
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'etats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('etats')}
                >
                    <i className="fas fa-file-invoice"></i> États Financiers
                </button>
            </div>

            {/* Onglet Tarifs */}
            {activeTab === 'tarifs' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-money-bill-wave"></i> Configuration des tarifs</h3>
                            <p>Définissez le montant des frais par classe et par sexe</p>
                        </div>
                    </div>

                    <div className="form-container" style={{ marginBottom: '30px' }}>
                        <form onSubmit={saveTarif}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Classe *</label>
                                    <select value={tarifClassId} onChange={e => setTarifClassId(e.target.value)} required>
                                        <option value="">Sélectionner une classe</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Tarif Garçon (FCFA) *</label>
                                    <input type="number" min="0" value={tarifBoy} onChange={e => setTarifBoy(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Tarif Fille (FCFA) *</label>
                                    <input type="number" min="0" value={tarifGirl} onChange={e => setTarifGirl(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-actions" style={{marginTop: '20px'}}>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Enregistrer Tarif</button>
                            </div>
                        </form>
                    </div>

                    <div className="table-container full-width">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Classe</th>
                                    <th>Tarif Garçon (FCFA)</th>
                                    <th>Tarif Fille (FCFA)</th>
                                    <th>Date d'application</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeConfigs.map(config => (
                                    <tr key={config.id}>
                                        <td><strong>{config.school_class?.name}</strong></td>
                                        <td>{Number(config.amount_boy).toLocaleString()} FCFA</td>
                                        <td>{Number(config.amount_girl).toLocaleString()} FCFA</td>
                                        <td>{config.application_date}</td>
                                    </tr>
                                ))}
                                {feeConfigs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{textAlign: 'center', padding: '20px'}}>Aucun tarif configuré</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Onglet Paiement */}
            {activeTab === 'paiement' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-credit-card"></i> Payer frais d'inscription</h3>
                            <p>Enregistrement des paiements (versements multiples possibles)</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <form onSubmit={savePayment}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label><i className="fas fa-chalkboard"></i> Classe *</label>
                                    <select value={payClassId} onChange={handlePayClassChange} required>
                                        <option value="">Sélectionner une classe</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><i className="fas fa-user-graduate"></i> Élève *</label>
                                    <select value={payStudentId} onChange={handlePayStudentChange} required disabled={!payClassId}>
                                        <option value="">Sélectionner un élève</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.last_name} {s.first_name} ({s.matricule})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><i className="fas fa-bullseye"></i> Montant Attendue (Total)</label>
                                    <input type="text" value={payExpectedAmount > 0 ? `${payExpectedAmount.toLocaleString()} FCFA` : 'N/A'} readOnly style={{backgroundColor: '#e9ecef'}} />
                                </div>
                                <div className="form-group">
                                    <label><i className="fas fa-money-bill-wave"></i> Montant Payé Aujourd'hui *</label>
                                    <input type="number" min="0" value={payAmount} onChange={e => setPayAmount(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label><i className="fas fa-calendar"></i> Date de paiement *</label>
                                    <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label><i className="fas fa-credit-card"></i> Mode de paiement *</label>
                                    <select value={payMethod} onChange={e => setPayMethod(e.target.value)} required>
                                        <option value="especes">Espèces</option>
                                        <option value="cheque">Chèque</option>
                                        <option value="virement">Virement</option>
                                        <option value="mobile">Mobile Money</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><i className="fas fa-hashtag"></i> Référence (Optionnel)</label>
                                    <input type="text" value={payReference} onChange={e => setPayReference(e.target.value)} placeholder="N° transaction" />
                                </div>
                            </div>
                            
                            {forceDouble && (
                                <div className="alert" style={{backgroundColor: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginTop: '15px'}}>
                                    <i className="fas fa-exclamation-triangle"></i> Vous êtes sur le point de forcer un second paiement pour cet élève aujourd'hui.
                                </div>
                            )}

                            <div className="form-actions" style={{marginTop: '20px'}}>
                                <button type="submit" className={`btn ${forceDouble ? 'btn-danger' : 'btn-primary'}`}>
                                    <i className="fas fa-save"></i> {forceDouble ? 'Confirmer le double paiement' : 'Enregistrer le paiement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Onglet États Financiers */}
            {activeTab === 'etats' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-file-invoice"></i> États Financiers</h3>
                            <p>Historique de tous les paiements d'inscription</p>
                        </div>
                    </div>
                    
                    <div className="table-container full-width">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Élève</th>
                                    <th>Classe</th>
                                    <th>Montant Payé</th>
                                    <th>Mode</th>
                                    <th>Réf.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(p => (
                                    <tr key={p.id}>
                                        <td>{new Date(p.payment_date).toLocaleDateString('fr-FR')}</td>
                                        <td><strong>{p.student?.last_name} {p.student?.first_name}</strong></td>
                                        <td>{p.school_class?.name}</td>
                                        <td><span className="badge badge-success">{Number(p.paid_amount).toLocaleString()} FCFA</span></td>
                                        <td style={{textTransform: 'capitalize'}}>{p.payment_method}</td>
                                        <td>{p.reference || '-'}</td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>Aucun paiement enregistré.</td>
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
