"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EcolagePage() {
    const [activeTab, setActiveTab] = useState('tarifs-ecolage');
    const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

    // Lists
    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    
    // Configs
    const [tuitionConfigs, setTuitionConfigs] = useState<any[]>([]);
    const [classInstallments, setClassInstallments] = useState<any[]>([]);
    const [allPayments, setAllPayments] = useState<any[]>([]);

    // 1. Montant Ecolage (Global)
    const [tarifClassId, setTarifClassId] = useState('');
    const [tarifBoy, setTarifBoy] = useState('');
    const [tarifGirl, setTarifGirl] = useState('');
    const [tranchesCount, setTranchesCount] = useState(3);
    const [tranchesInputs, setTranchesInputs] = useState<any[]>([]);

    // 2. Enregistrer/Modifier (Override)
    const [modClassId, setModClassId] = useState('');
    const [modStudentId, setModStudentId] = useState('');
    const [modTranchesCount, setModTranchesCount] = useState(3);
    const [modTranchesInputs, setModTranchesInputs] = useState<any[]>([]);

    // 3. Payer Ecolage
    const [payClassId, setPayClassId] = useState('');
    const [payStudentId, setPayStudentId] = useState('');
    const [payExpectedAmount, setPayExpectedAmount] = useState(0);
    const [payPaidSoFar, setPayPaidSoFar] = useState(0);
    const [payAmount, setPayAmount] = useState('');
    const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
    const [payMethod, setPayMethod] = useState('especes');
    const [payReference, setPayReference] = useState('');
    const [studentInstallments, setStudentInstallments] = useState<any[]>([]);

    // 4. Liste (Filtres)
    const [filterClass, setFilterClass] = useState('');
    const [filterTranche, setFilterTranche] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // paye, attente

    useEffect(() => {
        fetchClasses();
        fetchConfigs();
        fetchPayments();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/school-classes`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setClasses(data.data || []);
            }
        } catch (e) { console.error(e); }
    };

    const fetchConfigs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/tuition-configs`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setTuitionConfigs(data.data.configs || []);
                setClassInstallments(data.data.installments || []);
            }
        } catch (e) { console.error(e); }
    };

    const fetchPayments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/finance/tuition-payments`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setAllPayments(data.data || []);
            }
        } catch (e) { console.error(e); }
    };

    const fetchStudentsForClass = async (classId: string) => {
        setStudents([]);
        if (!classId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/students`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                const classStudents = data.data.filter((s: any) => s.current_enrollment?.school_class_id === classId);
                setStudents(classStudents);
            }
        } catch (e) { console.error(e); }
    };

    // ------------- ONGLET 1: MONTANT ECOLAGE -------------
    useEffect(() => {
        const arr = [];
        for (let i = 1; i <= tranchesCount; i++) {
            arr.push({ installment_number: i, amount: '', deadline: '' });
        }
        setTranchesInputs(arr);
    }, [tranchesCount]);

    const handleTrancheInputChange = (index: number, field: string, value: string) => {
        const newInputs = [...tranchesInputs];
        newInputs[index][field] = value;
        setTranchesInputs(newInputs);
    };

    const saveTarifsGlobaux = async (e: any) => {
        e.preventDefault();
        try {
            // 1. Sauvegarder les totaux (fee-configs)
            const res1 = await fetch(`${API_BASE_URL}/finance/tuition-configs`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    school_class_id: tarifClassId,
                    amount_boy: parseFloat(tarifBoy) || 0,
                    amount_girl: parseFloat(tarifGirl) || 0,
                })
            });

            // 2. Sauvegarder les tranches
            const res2 = await fetch(`${API_BASE_URL}/finance/tuition-class-installments`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    school_class_id: tarifClassId,
                    installments: tranchesInputs.map(t => ({
                        installment_number: t.installment_number,
                        amount: parseFloat(t.amount) || 0,
                        deadline: t.deadline
                    }))
                })
            });

            if (res1.ok && res2.ok) {
                alert('Configuration enregistrée avec succès');
                fetchConfigs();
                setTarifClassId('');
                setTarifBoy('');
                setTarifGirl('');
            } else {
                alert('Erreur lors de l\'enregistrement');
            }
        } catch (error: any) { alert(error.message); }
    };

    // ------------- ONGLET 2: ENREGISTRER/MODIFIER (REMISES) -------------
    const handleModClassChange = (e: any) => {
        setModClassId(e.target.value);
        setModStudentId('');
        fetchStudentsForClass(e.target.value);
    };

    const handleModStudentChange = async (e: any) => {
        setModStudentId(e.target.value);
        if (e.target.value) {
            // Fetch student tuition details to pre-fill
            try {
                const res = await fetch(`${API_BASE_URL}/finance/tuition-student/${e.target.value}`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    const installments = data.data.installments;
                    setModTranchesCount(installments.length > 0 ? installments.length : 3);
                    
                    const arr = [];
                    for (let i = 0; i < (installments.length > 0 ? installments.length : 3); i++) {
                        arr.push({ 
                            installment_number: i + 1, 
                            amount: installments[i]?.amount || '', 
                            deadline: installments[i]?.deadline || '' 
                        });
                    }
                    setModTranchesInputs(arr);
                }
            } catch (err) { console.error(err); }
        }
    };

    useEffect(() => {
        if (!modStudentId) {
            const arr = [];
            for (let i = 1; i <= modTranchesCount; i++) {
                arr.push({ installment_number: i, amount: '', deadline: '' });
            }
            setModTranchesInputs(arr);
        }
    }, [modTranchesCount]);

    const handleModTrancheChange = (index: number, field: string, value: string) => {
        const newInputs = [...modTranchesInputs];
        newInputs[index][field] = value;
        setModTranchesInputs(newInputs);
    };

    const saveStudentOverride = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/finance/tuition-student-installments`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    student_id: modStudentId,
                    installments: modTranchesInputs.map(t => ({
                        installment_number: t.installment_number,
                        amount: parseFloat(t.amount) || 0,
                        deadline: t.deadline
                    }))
                })
            });
            if (res.ok) {
                alert('Aménagement enregistré pour cet élève !');
                setModStudentId('');
            } else {
                alert('Erreur lors de l\'enregistrement');
            }
        } catch (error: any) { alert(error.message); }
    };

    // ------------- ONGLET 3: PAYER ECOLAGE -------------
    const handlePayClassChange = (e: any) => {
        setPayClassId(e.target.value);
        setPayStudentId('');
        fetchStudentsForClass(e.target.value);
        resetPayStates();
    };

    const resetPayStates = () => {
        setPayExpectedAmount(0);
        setPayPaidSoFar(0);
        setStudentInstallments([]);
    };

    const handlePayStudentChange = async (e: any) => {
        const val = e.target.value;
        setPayStudentId(val);
        if (!val) {
            resetPayStates();
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/finance/tuition-student/${val}`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setStudentInstallments(data.data.installments);
                setPayPaidSoFar(data.data.total_paid);
                
                let totalExpected = 0;
                data.data.installments.forEach((inst: any) => {
                    totalExpected += parseFloat(inst.amount);
                });
                setPayExpectedAmount(totalExpected);
            }
        } catch (err) { console.error(err); }
    };

    const savePayment = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/finance/tuition-payments`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    student_id: payStudentId,
                    school_class_id: payClassId,
                    paid_amount: parseFloat(payAmount),
                    payment_date: payDate,
                    payment_method: payMethod,
                    reference: payReference
                })
            });

            if (res.ok) {
                alert('Paiement enregistré avec succès !');
                setPayAmount('');
                handlePayStudentChange({target: {value: payStudentId}}); // reload balances
                fetchPayments(); // refresh list
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur lors du paiement');
            }
        } catch (error: any) { alert(error.message); }
    };

    // ------------- CALCULS ETATS -------------
    const getTrancheStatus = (installments: any[], totalPaid: number) => {
        let accumulated = 0;
        return installments.map(inst => {
            accumulated += parseFloat(inst.amount);
            const isPaid = totalPaid >= accumulated;
            return {
                ...inst,
                status: isPaid ? 'Soldé' : (totalPaid > (accumulated - parseFloat(inst.amount)) ? 'En cours' : 'Impayé')
            };
        });
    };

    return (
        <>


            <div className="features-nav">
                <button className={`feature-btn ${activeTab === 'tarifs-ecolage' ? 'active' : ''}`} onClick={() => setActiveTab('tarifs-ecolage')}>
                    <i className="fas fa-money-bill-wave"></i> Montant écolage
                </button>
                <button className={`feature-btn ${activeTab === 'enregistrer-ecolage' ? 'active' : ''}`} onClick={() => setActiveTab('enregistrer-ecolage')}>
                    <i className="fas fa-edit"></i> Enregistrer/Modifier (Remises)
                </button>
                <button className={`feature-btn ${activeTab === 'payer-ecolage' ? 'active' : ''}`} onClick={() => setActiveTab('payer-ecolage')}>
                    <i className="fas fa-credit-card"></i> Payer écolage
                </button>
                <button className={`feature-btn ${activeTab === 'liste-paiements' ? 'active' : ''}`} onClick={() => setActiveTab('liste-paiements')}>
                    <i className="fas fa-list-check"></i> Liste des paiements
                </button>
            </div>

            {/* ONGLET 1 : MONTANT ECOLAGE */}
            {activeTab === 'tarifs-ecolage' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-money-bill-wave"></i> Configuration des Tarifs</h3>
                            <p>Définissez les frais globaux et les montants par tranche (Les surcharges individuelles se font dans "Enregistrer/Modifier")</p>
                        </div>
                    </div>

                    <div className="form-container" style={{marginBottom: '30px'}}>
                        <form onSubmit={saveTarifsGlobaux}>
                            <h4 style={{marginBottom: '15px'}}><i className="fas fa-cog"></i> 1. Tarifs Globaux Annuels</h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Classe *</label>
                                    <select value={tarifClassId} onChange={e => setTarifClassId(e.target.value)} required>
                                        <option value="">Sélectionner une classe</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Total Garçon (FCFA) *</label>
                                    <input type="number" min="0" value={tarifBoy} onChange={e => setTarifBoy(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Total Fille (FCFA) *</label>
                                    <input type="number" min="0" value={tarifGirl} onChange={e => setTarifGirl(e.target.value)} required />
                                </div>
                            </div>

                            <hr style={{margin: '20px 0'}} />

                            <h4 style={{marginBottom: '15px'}}><i className="fas fa-calendar-alt"></i> 2. Configuration des Tranches</h4>
                            <div className="form-group" style={{maxWidth: '300px', marginBottom: '20px'}}>
                                <label>Nombre de tranches</label>
                                <select value={tranchesCount} onChange={e => setTranchesCount(parseInt(e.target.value))}>
                                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>

                            <div className="form-grid compact">
                                {tranchesInputs.map((tranche, idx) => (
                                    <div className="form-group" key={idx} style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px'}}>
                                        <label><strong>Tranche {tranche.installment_number}</strong></label>
                                        <input 
                                            type="number" 
                                            placeholder="Montant attendu (FCFA)" 
                                            value={tranche.amount} 
                                            onChange={e => handleTrancheInputChange(idx, 'amount', e.target.value)} 
                                            required 
                                            style={{marginBottom: '10px'}}
                                        />
                                        <label style={{fontSize: '0.85em'}}>Date limite (Optionnel)</label>
                                        <input 
                                            type="date" 
                                            value={tranche.deadline} 
                                            onChange={e => handleTrancheInputChange(idx, 'deadline', e.target.value)} 
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="form-actions" style={{marginTop: '20px'}}>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Enregistrer Configuration Globale</button>
                            </div>
                        </form>
                    </div>

                    {/* Affichage des configs existantes pour info */}
                    <div className="table-container full-width">
                        <h4>Configurations actuelles (Totaux Annuels)</h4>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Classe</th>
                                    <th>Garçon (FCFA)</th>
                                    <th>Fille (FCFA)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tuitionConfigs.map(c => (
                                    <tr key={c.id}>
                                        <td><strong>{c.school_class?.name}</strong></td>
                                        <td>{Number(c.amount_boy).toLocaleString()}</td>
                                        <td>{Number(c.amount_girl).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {tuitionConfigs.length === 0 && <tr><td colSpan={3} style={{textAlign: 'center'}}>Aucune configuration</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ONGLET 2 : ENREGISTRER/MODIFIER (REMISES) */}
            {activeTab === 'enregistrer-ecolage' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-edit"></i> Aménagements et Remises</h3>
                            <p>Surchargez les montants des tranches pour un élève spécifique (Bourse, Cas social, etc.)</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <form onSubmit={saveStudentOverride}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Classe</label>
                                    <select value={modClassId} onChange={handleModClassChange}>
                                        <option value="">Sélectionner une classe</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Élève *</label>
                                    <select value={modStudentId} onChange={handleModStudentChange} required disabled={!modClassId}>
                                        <option value="">Sélectionner un élève</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>)}
                                    </select>
                                </div>
                                {modStudentId && (
                                    <div className="form-group">
                                        <label>Nombre de tranches pour cet élève</label>
                                        <select value={modTranchesCount} onChange={e => setModTranchesCount(parseInt(e.target.value))}>
                                            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {modStudentId && (
                                <>
                                    <h4 style={{marginTop: '20px', marginBottom: '15px'}}><i className="fas fa-list-ol"></i> Nouveaux montants des tranches pour cet élève</h4>
                                    <div className="form-grid compact">
                                        {modTranchesInputs.map((tranche, idx) => (
                                            <div className="form-group" key={idx} style={{backgroundColor: '#e9ecef', padding: '15px', borderRadius: '8px'}}>
                                                <label><strong>Tranche {tranche.installment_number}</strong></label>
                                                <input 
                                                    type="number" 
                                                    placeholder="Montant personnalisé" 
                                                    value={tranche.amount} 
                                                    onChange={e => handleModTrancheChange(idx, 'amount', e.target.value)} 
                                                    required 
                                                    style={{marginBottom: '10px'}}
                                                />
                                                <label style={{fontSize: '0.85em'}}>Date limite (Optionnel)</label>
                                                <input 
                                                    type="date" 
                                                    value={tranche.deadline} 
                                                    onChange={e => handleModTrancheChange(idx, 'deadline', e.target.value)} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-actions" style={{marginTop: '20px'}}>
                                        <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Enregistrer l'aménagement</button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* ONGLET 3 : PAYER ECOLAGE */}
            {activeTab === 'payer-ecolage' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-credit-card"></i> Payer Écolage</h3>
                            <p>Enregistrez un versement libre, le système calculera les tranches soldées automatiquement.</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <form onSubmit={savePayment}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Classe *</label>
                                    <select value={payClassId} onChange={handlePayClassChange} required>
                                        <option value="">Sélectionner une classe</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Élève *</label>
                                    <select value={payStudentId} onChange={handlePayStudentChange} required disabled={!payClassId}>
                                        <option value="">Sélectionner un élève</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            {payStudentId && (
                                <div className="form-grid compact" style={{backgroundColor: '#e8f4f8', padding: '15px', borderRadius: '8px', margin: '20px 0'}}>
                                    <div className="form-group" style={{marginBottom: 0}}>
                                        <label>Total Attendu</label>
                                        <h4>{payExpectedAmount.toLocaleString()} FCFA</h4>
                                    </div>
                                    <div className="form-group" style={{marginBottom: 0}}>
                                        <label>Déjà Payé (Cagnotte)</label>
                                        <h4 style={{color: '#28a745'}}>{payPaidSoFar.toLocaleString()} FCFA</h4>
                                    </div>
                                    <div className="form-group" style={{marginBottom: 0}}>
                                        <label>Reste à payer</label>
                                        <h4 style={{color: '#dc3545'}}>{(payExpectedAmount - payPaidSoFar).toLocaleString()} FCFA</h4>
                                    </div>
                                </div>
                            )}

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Montant Versé Aujourd'hui (FCFA) *</label>
                                    <input type="number" min="1" value={payAmount} onChange={e => setPayAmount(e.target.value)} required />
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
                            </div>

                            <div className="form-actions" style={{marginTop: '20px'}}>
                                <button type="submit" className="btn btn-primary" disabled={!payStudentId}><i className="fas fa-save"></i> Enregistrer le paiement</button>
                            </div>
                        </form>

                        {payStudentId && studentInstallments.length > 0 && (
                            <div style={{marginTop: '40px'}}>
                                <h4><i className="fas fa-chart-bar"></i> État des Tranches de cet élève</h4>
                                <table className="data-table" style={{marginTop: '10px'}}>
                                    <thead>
                                        <tr>
                                            <th>Tranche</th>
                                            <th>Montant Attendu</th>
                                            <th>Date Limite</th>
                                            <th>Statut Actuel</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getTrancheStatus(studentInstallments, payPaidSoFar).map((t: any) => (
                                            <tr key={t.installment_number}>
                                                <td>Tranche {t.installment_number}</td>
                                                <td>{Number(t.amount).toLocaleString()} FCFA</td>
                                                <td>{t.deadline || '-'}</td>
                                                <td>
                                                    <span className={`badge ${t.status === 'Soldé' ? 'badge-success' : t.status === 'En cours' ? 'badge-warning' : 'badge-danger'}`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ONGLET 4 : LISTE DES PAIEMENTS */}
            {activeTab === 'liste-paiements' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3><i className="fas fa-list-check"></i> Historique des Versements</h3>
                            <p>Liste complète de tous les paiements d'écolage</p>
                        </div>
                    </div>

                    <div className="table-container full-width">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Élève</th>
                                    <th>Classe</th>
                                    <th>Montant Versé</th>
                                    <th>Mode</th>
                                    <th>Réf.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPayments.map(p => (
                                    <tr key={p.id}>
                                        <td>{new Date(p.payment_date).toLocaleDateString('fr-FR')}</td>
                                        <td><strong>{p.student?.last_name} {p.student?.first_name}</strong></td>
                                        <td>{p.school_class?.name}</td>
                                        <td><span className="badge badge-success">{Number(p.paid_amount).toLocaleString()} FCFA</span></td>
                                        <td style={{textTransform: 'capitalize'}}>{p.payment_method}</td>
                                        <td>{p.reference || '-'}</td>
                                    </tr>
                                ))}
                                {allPayments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>Aucun versement enregistré.</td>
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
