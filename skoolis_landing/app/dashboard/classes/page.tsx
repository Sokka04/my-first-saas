"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ClassesPage() {
    const [activeTab, setActiveTab] = useState("liste");
    const [classes, setClasses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        cycle: '',
        capacity: '45',
        teacher_id: ''
    });

    const [assignForm, setAssignForm] = useState({
        class_id: '',
        teacher_id: ''
    });

    const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/school-classes`, {
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });

            if (!res.ok) throw new Error("Erreur lors de la récupération des classes");

            const json = await res.json();
            setClasses(json.data || []);
        } catch(e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/teachers`, {
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            if (res.ok) {
                const json = await res.json();
                setTeachers(json.data || []);
            }
        } catch(e) {
            console.error("Erreur enseignants", e);
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchTeachers();
    }, []);

    const handleSave = async (e: any) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                capacity: formData.capacity ? parseInt(formData.capacity) : null,
                teacher_id: formData.teacher_id || null
            };

            const res = await fetch(`${API_BASE_URL}/school-classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(dataToSubmit)
            });

            if (res.ok) {
                alert("Classe créée avec succès !");
                setFormData({ name: '', level: '', cycle: '', capacity: '45', teacher_id: '' });
                fetchClasses();
                setActiveTab("liste");
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Erreur lors de la création");
            }
        } catch(e: any) {
            alert(e.message);
        }
    };

    const handleAssignTeacher = async (e: any) => {
        e.preventDefault();
        if (!assignForm.class_id || !assignForm.teacher_id) {
            alert("Veuillez sélectionner une classe et un professeur.");
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/school-classes/${assignForm.class_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ teacher_id: assignForm.teacher_id })
            });
            if (res.ok) {
                alert("Professeur assigné avec succès !");
                setAssignForm({ class_id: '', teacher_id: '' });
                fetchClasses();
                setActiveTab("liste");
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Erreur lors de l'assignation");
            }
        } catch(e: any) {
            alert(e.message);
        }
    };

    // Calculate Stats
    const totalClasses = classes.length;
    const totalStudents = classes.reduce((acc, cls) => acc + (cls.students_count || 0), 0);
    const assignedTeachers = new Set(classes.filter(c => c.teacher_id).map(c => c.teacher_id)).size;
    const avgStudents = totalClasses > 0 ? (totalStudents / totalClasses).toFixed(1) : "0";

    return (
        <>
            {/* Statistiques rapides */}
            <div className="stats-cards">
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(123, 31, 162, 0.1)', color: 'var(--primary-color)' }}>
                        <i className="fas fa-chalkboard"></i>
                    </div>
                    <div className="card-info">
                        <h3>{totalClasses}</h3>
                        <p>Classes actives</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}>
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="card-info">
                        <h3>{totalStudents}</h3>
                        <p>Élèves total</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                        <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="card-info">
                        <h3>{assignedTeachers}</h3>
                        <p>Professeurs assignés</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}>
                        <i className="fas fa-chart-bar"></i>
                    </div>
                    <div className="card-info">
                        <h3>{avgStudents}</h3>
                        <p>Moyenne d'élèves/classe</p>
                    </div>
                </div>
            </div>

            {/* Navigation des fonctionnalités */}
            <div className="features-nav">
                <button 
                    className={`feature-btn ${activeTab === 'liste' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('liste')}
                >
                    <i className="fas fa-list"></i> Liste des classes
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'enregistrement' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('enregistrement')}
                >
                    <i className="fas fa-plus-circle"></i> Nouvelle classe
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'titulaire' ? 'active' : ''}`}
                    onClick={() => setActiveTab('titulaire')}
                >
                    <i className="fas fa-user-tie"></i> Attribuer titulaire
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'effectif' ? 'active' : ''}`}
                    onClick={() => setActiveTab('effectif')}
                >
                    <i className="fas fa-chart-pie"></i> Effectifs & Statistiques
                </button>
            </div>

            {/* Section Liste des classes */}
            {activeTab === 'liste' && (
                <div className="feature-section active" id="liste">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Liste des classes</h3>
                            <p>Gérez toutes les classes de l'établissement</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn btn-primary">
                                <i className="fas fa-print"></i> Imprimer liste
                            </button>
                        </div>
                    </div>

                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Cycle:</label>
                            <select className="form-select">
                                <option value="">Tous les cycles</option>
                                <option value="primaire">Primaire</option>
                                <option value="college">Collège</option>
                                <option value="lycee">Lycée</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Niveau:</label>
                            <select className="form-select">
                                <option value="">Tous les niveaux</option>
                                <option value="6eme">6ème</option>
                                <option value="5eme">5ème</option>
                                <option value="4eme">4ème</option>
                                <option value="3eme">3ème</option>
                            </select>
                        </div>
                    </div>

                    <div className="classes-grid">
                        {loading && <p>Chargement des classes...</p>}
                        {!loading && classes.length === 0 && <p>Aucune classe enregistrée.</p>}
                        {classes.map(cls => (
                            <div key={cls.id} className="card class-card">
                                <div className="card-header">
                                    <div>
                                        <h4>{cls.name}</h4>
                                        <span className="badge badge-info">{cls.cycle || 'Non défini'} • {cls.level || '-'}</span>
                                    </div>
                                    <div className="card-icon" style={{backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3'}}>
                                        <i className="fas fa-users"></i>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p className="teacher-info">
                                        <i className="fas fa-user-tie"></i>
                                        {cls.teacher ? `${cls.teacher.first_name} ${cls.teacher.last_name}` : 'Aucun titulaire'}
                                    </p>
                                </div>
                                <div className="capacity-bar-container" style={{ background: '#f5f5f5', borderRadius: '8px', padding: '10px', marginBottom: '15px' }}>
                                    <div className="capacity-labels" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                                        <span>Effectif: <strong>{cls.students_count || 0}</strong></span>
                                        <span className="text-muted">Capacité: {cls.capacity || '-'}</span>
                                    </div>
                                    {cls.capacity && (
                                        <div className="progress-bar-bg" style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div className="progress-bar-fill" style={{ width: `${Math.min(((cls.students_count || 0) / cls.capacity) * 100, 100)}%`, height: '100%', background: ((cls.students_count || 0) > cls.capacity) ? '#f44336' : 'var(--primary-color)' }}></div>
                                        </div>
                                    )}
                                </div>
                                <div className="card-actions">
                                    <button className="btn btn-secondary w-100">
                                        <i className="fas fa-eye"></i> Détails
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Section Nouvelle classe */}
            {activeTab === 'enregistrement' && (
                <div className="feature-section active" id="enregistrement">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Créer une nouvelle classe</h3>
                            <p>Configurez une nouvelle classe pour l'année scolaire</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <form onSubmit={handleSave}>
                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-info-circle"></i> Informations de base
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nom de la classe <span className="required">*</span></label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="form-control" placeholder="Ex: 3ème A" />
                                    </div>
                                    <div className="form-group">
                                        <label>Niveau <span className="required">*</span></label>
                                        <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} required className="form-control">
                                            <option value="">Sélectionner un niveau</option>
                                            <option value="6eme">6ème</option>
                                            <option value="5eme">5ème</option>
                                            <option value="4eme">4ème</option>
                                            <option value="3eme">3ème</option>
                                            <option value="2nde">2nde</option>
                                            <option value="1ere">1ère</option>
                                            <option value="terminale">Terminale</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Cycle <span className="required">*</span></label>
                                        <select value={formData.cycle} onChange={e => setFormData({...formData, cycle: e.target.value})} required className="form-control">
                                            <option value="">Sélectionner un cycle</option>
                                            <option value="primaire">Primaire</option>
                                            <option value="college">Collège</option>
                                            <option value="lycee">Lycée</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Capacité maximale</label>
                                        <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} min="1" max="1000" className="form-control" placeholder="45" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-chalkboard-teacher"></i> Professeur titulaire
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Titulaire de la classe</label>
                                        <select value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="form-select">
                                            <option value="">Aucun titulaire assigné</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.first_name} {teacher.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="form-help">Vous pourrez modifier cela plus tard</small>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('liste')}>
                                    <i className="fas fa-times"></i> Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save"></i> Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Section Attribuer titulaire */}
            {activeTab === 'titulaire' && (
                <div className="feature-section active" id="titulaire">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Attribuer un titulaire à une classe</h3>
                            <p>Assignez ou changez le professeur titulaire d'une classe</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Sélectionner la classe</label>
                                <select 
                                    className="form-control" 
                                    value={assignForm.class_id} 
                                    onChange={e => setAssignForm({...assignForm, class_id: e.target.value})}
                                >
                                    <option value="">Choisir une classe</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Sélectionner le titulaire</label>
                                <select 
                                    className="form-control"
                                    value={assignForm.teacher_id} 
                                    onChange={e => setAssignForm({...assignForm, teacher_id: e.target.value})}
                                >
                                    <option value="">Choisir un professeur</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.first_name} {teacher.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {assignForm.class_id && (() => {
                            const selectedCls = classes.find(c => c.id.toString() === assignForm.class_id);
                            if (!selectedCls) return null;
                            return (
                                <div className="class-info-card">
                                    <div className="class-info-header">
                                        <h4>Informations de la classe</h4>
                                    </div>
                                    <div className="class-info-body">
                                        <div className="info-row">
                                            <span className="info-label">Classe:</span>
                                            <span className="info-value">{selectedCls.name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Niveau:</span>
                                            <span className="info-value">{selectedCls.level || '-'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Effectif actuel:</span>
                                            <span className="info-value">{selectedCls.students_count || 0}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Titulaire actuel:</span>
                                            <span className="info-value">{selectedCls.teacher ? `${selectedCls.teacher.first_name} ${selectedCls.teacher.last_name}` : 'Aucun'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="form-actions" style={{ marginTop: '30px' }}>
                            <button className="btn btn-secondary" onClick={() => setAssignForm({ class_id: '', teacher_id: '' })}>
                                Annuler
                            </button>
                            <button className="btn btn-primary" onClick={handleAssignTeacher}>
                                <i className="fas fa-save"></i> Attribuer le titulaire
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Section Effectifs & Statistiques */}
            {activeTab === 'effectif' && (
                <div className="feature-section active" id="effectif">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Effectifs et statistiques</h3>
                            <p>Visualisez les statistiques par classe et niveau</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn btn-primary">
                                <i className="fas fa-download"></i> Exporter données
                            </button>
                        </div>
                    </div>

                    <div className="stats-container">
                        <div className="stats-chart-container">
                            <div className="chart-container">
                                <div className="chart-header">
                                    <h3>Répartition des effectifs par classe</h3>
                                </div>
                                <div className="chart-placeholder">
                                    <canvas id="effectifsChart"></canvas>
                                </div>
                            </div>
                        </div>

                        <div className="detailed-stats">
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Classe</th>
                                            <th>Niveau</th>
                                            <th>Effectif</th>
                                            <th>Capacité</th>
                                            <th>Taux remplissage</th>
                                            <th>Titulaire</th>
                                            <th>Moyenne classe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classes.map(cls => {
                                            const fillRate = cls.capacity ? Math.round(((cls.students_count || 0) / cls.capacity) * 100) : 0;
                                            return (
                                                <tr key={cls.id}>
                                                    <td>{cls.name}</td>
                                                    <td>{cls.level || '-'}</td>
                                                    <td>{cls.students_count || 0}</td>
                                                    <td>{cls.capacity || '-'}</td>
                                                    <td>
                                                        <div className="progress-bar-bg" style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden', display: 'inline-block', width: '60px', verticalAlign: 'middle', marginRight: '10px' }}>
                                                            <div className="progress-bar-fill" style={{ width: `${Math.min(fillRate, 100)}%`, height: '100%', background: fillRate > 100 ? '#f44336' : 'var(--primary-color)' }}></div>
                                                        </div>
                                                        {fillRate}%
                                                    </td>
                                                    <td>{cls.teacher ? `${cls.teacher.first_name} ${cls.teacher.last_name}` : 'Aucun'}</td>
                                                    <td>-</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="summary-cards">
                            <div className="summary-card">
                                <div className="summary-icon" style={{backgroundColor: 'rgba(123, 31, 162, 0.1)'}}>
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="summary-info">
                                    <h4>Effectif total</h4>
                                    <h3>{totalStudents}</h3>
                                </div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-icon" style={{backgroundColor: 'rgba(33, 150, 243, 0.1)'}}>
                                    <i className="fas fa-percentage"></i>
                                </div>
                                <div className="summary-info">
                                    <h4>Taux de remplissage</h4>
                                    <h3>{totalClasses > 0 ? Math.round(classes.reduce((acc, cls) => acc + (cls.capacity ? ((cls.students_count || 0) / cls.capacity) : 0), 0) / totalClasses * 100) : 0}%</h3>
                                </div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-icon" style={{backgroundColor: 'rgba(76, 175, 80, 0.1)'}}>
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <div className="summary-info">
                                    <h4>Moyenne générale</h4>
                                    <h3>-</h3>
                                </div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-icon" style={{backgroundColor: 'rgba(255, 152, 0, 0.1)'}}>
                                    <i className="fas fa-balance-scale"></i>
                                </div>
                                <div className="summary-info">
                                    <h4>Ratio filles/garçons</h4>
                                    <h3>-</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
