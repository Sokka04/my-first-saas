"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import './matieres.css'; // Optional: Use existing globals.css or components

export default function MatieresPage() {
    const [activeTab, setActiveTab] = useState('enregistrement');
    
    // States for "Enregistrement"
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    
    // Data states
    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    
    // States for "Attribution"
    const [assignClassId, setAssignClassId] = useState('');
    const [assignSubjectId, setAssignSubjectId] = useState('');
    const [assignTeacherId, setAssignTeacherId] = useState('');
    const [assignCoefficient, setAssignCoefficient] = useState('1');
    const [assignEvalType, setAssignEvalType] = useState('composition');
    
    // States for "Matières par classe"
    const [viewClassId, setViewClassId] = useState('');
    const [classSubjects, setClassSubjects] = useState<any[]>([]);

    const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        fetchSubjects();
        fetchClasses();
        fetchTeachers();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/subjects`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setSubjects(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

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

    const fetchTeachers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/teachers`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setTeachers(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const saveSubject = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/subjects`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    code,
                    category,
                    description
                })
            });

            if (res.ok) {
                alert('Matière créée avec succès');
                setCode('');
                setName('');
                setCategory('');
                setDescription('');
                fetchSubjects();
                setActiveTab('liste');
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur');
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    const assignSubject = async (e: any) => {
        e.preventDefault();
        if (!assignClassId || !assignSubjectId || !assignCoefficient || !assignEvalType) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/classes/${assignClassId}/subjects`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    school_class_id: assignClassId,
                    subject_id: assignSubjectId,
                    coefficient: parseFloat(assignCoefficient),
                    evaluation_type: assignEvalType,
                    teacher_id: assignTeacherId || null
                })
            });

            if (res.ok) {
                alert('Matière attribuée avec succès !');
                setAssignSubjectId('');
                setAssignTeacherId('');
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur lors de l\'attribution');
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    const fetchClassSubjects = async (classId: string) => {
        if (!classId) {
            setClassSubjects([]);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/classes/${classId}/subjects`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setClassSubjects(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleViewClassChange = (e: any) => {
        const val = e.target.value;
        setViewClassId(val);
        fetchClassSubjects(val);
    };

    return (
        <>


            <div className="features-nav">
                <button 
                    className={`feature-btn ${activeTab === 'enregistrement' ? 'active' : ''}`}
                    onClick={() => setActiveTab('enregistrement')}
                >
                    <i className="fas fa-plus-circle"></i> Enregistrer une matière
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'liste' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liste')}
                >
                    <i className="fas fa-list"></i> Liste des matières
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'attribution' ? 'active' : ''}`}
                    onClick={() => setActiveTab('attribution')}
                >
                    <i className="fas fa-link"></i> Attribution matières
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'par-classe' ? 'active' : ''}`}
                    onClick={() => setActiveTab('par-classe')}
                >
                    <i className="fas fa-chalkboard"></i> Matières par classe
                </button>
            </div>

            {/* Enregistrement d'une matière */}
            {activeTab === 'enregistrement' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Enregistrement d'une nouvelle matière</h3>
                            <p>Créez une nouvelle matière avec ses détails (le coefficient s'assigne lors de l'attribution à une classe)</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <form onSubmit={saveSubject}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Code de la matière</label>
                                    <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="MATH, FR, PCT" />
                                </div>
                                <div className="form-group">
                                    <label>Nom de la matière *</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Mathématiques" required />
                                </div>
                                <div className="form-group">
                                    <label>Catégorie *</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} required>
                                        <option value="">Sélectionner</option>
                                        <option value="scientifique">Scientifique</option>
                                        <option value="litteraire">Littéraire</option>
                                        <option value="technique">Technique</option>
                                        <option value="art">Art</option>
                                        <option value="sport">Éducation Physique</option>
                                        <option value="langue">Langue</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Description de la matière..."></textarea>
                                </div>
                            </div>
                            <div className="form-actions" style={{marginTop: '20px'}}>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Liste des matières */}
            {activeTab === 'liste' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Liste des matières</h3>
                            <p><span>{subjects.length}</span> matières enregistrées</p>
                        </div>
                    </div>
                    <div className="table-container full-width">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Nom</th>
                                    <th>Catégorie</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.code || '-'}</td>
                                        <td>{s.name}</td>
                                        <td><span className="status-badge" style={{textTransform: 'capitalize'}}>{s.category || 'N/A'}</span></td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon" title="Modifier"><i className="fas fa-edit"></i></button>
                                                <button className="btn-icon delete" title="Supprimer"><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {subjects.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{textAlign: 'center', padding: '20px'}}>Aucune matière trouvée</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Attribution matières */}
            {activeTab === 'attribution' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Attribution des matières aux classes</h3>
                            <p>Définissez les matières enseignées dans chaque classe, leur coefficient et le professeur</p>
                        </div>
                    </div>
                    <div className="form-container">
                        <form onSubmit={assignSubject}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Classe *</label>
                                    <select value={assignClassId} onChange={e => setAssignClassId(e.target.value)} required>
                                        <option value="">Sélectionner une classe</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Matière *</label>
                                    <select value={assignSubjectId} onChange={e => setAssignSubjectId(e.target.value)} required>
                                        <option value="">Sélectionner une matière</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.code || 'N/A'})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Type d'évaluation principale *</label>
                                    <select value={assignEvalType} onChange={e => setAssignEvalType(e.target.value)} required>
                                        <option value="composition">Composition classique (Écrit)</option>
                                        <option value="examen_pratique">Examen Pratique (ex: Sport, Art)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Coefficient *</label>
                                    <input type="number" step="0.5" min="0.5" value={assignCoefficient} onChange={e => setAssignCoefficient(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Professeur (Optionnel)</label>
                                    <select value={assignTeacherId} onChange={e => setAssignTeacherId(e.target.value)}>
                                        <option value="">Aucun professeur spécifique</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.last_name} {t.first_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions" style={{marginTop: '20px'}}>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-link"></i> Attribuer à la classe</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Matières par classe */}
            {activeTab === 'par-classe' && (
                <div className="feature-section active">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Programme par classe</h3>
                            <p>Visualisez toutes les matières enseignées dans une classe spécifique</p>
                        </div>
                    </div>
                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Classe:</label>
                            <select className="form-select" value={viewClassId} onChange={handleViewClassChange}>
                                <option value="">Sélectionner une classe</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {viewClassId && (
                        <div className="table-container full-width">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Matière</th>
                                        <th>Coefficient</th>
                                        <th>Évaluation</th>
                                        <th>Professeur</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classSubjects.map((cs: any) => (
                                        <tr key={cs.id}>
                                            <td><strong>{cs.subject?.name}</strong></td>
                                            <td><span className="badge badge-info">x {cs.coefficient}</span></td>
                                            <td>{cs.evaluation_type === 'composition' ? 'Composition' : 'Pratique'}</td>
                                            <td>{cs.teacher ? `${cs.teacher.last_name} ${cs.teacher.first_name}` : <span style={{color: '#999'}}>Non assigné</span>}</td>
                                        </tr>
                                    ))}
                                    {classSubjects.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{textAlign: 'center', padding: '20px'}}>Aucune matière attribuée à cette classe.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
