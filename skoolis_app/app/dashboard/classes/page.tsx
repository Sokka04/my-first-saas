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
        capacity: '',
        teacher_id: ''
    });

    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [modFormData, setModFormData] = useState({
        name: '',
        level: '',
        capacity: '',
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

    const handleSave = async () => {
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
                setFormData({ name: '', level: '', capacity: '', teacher_id: '' });
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

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette classe ? ATTENTION : Cela supprimera également tous les élèves inscrits dans cette classe !")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/school-classes/${id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });

            if (res.ok) {
                alert("Classe et élèves associés supprimés avec succès !");
                fetchClasses();
            } else {
                throw new Error("Erreur lors de la suppression");
            }
        } catch(e: any) {
            alert(e.message);
        }
    };

    const openEditForm = (schoolClass: any) => {
        setSelectedClass(schoolClass);
        setModFormData({
            name: schoolClass.name || '',
            level: schoolClass.level || '',
            capacity: schoolClass.capacity ? String(schoolClass.capacity) : '',
            teacher_id: schoolClass.teacher_id || ''
        });
        setActiveTab("modification");
    };

    const handleEdit = async () => {
        if (!selectedClass) return;

        try {
            const dataToSubmit = {
                ...modFormData,
                capacity: modFormData.capacity ? parseInt(modFormData.capacity) : null,
                teacher_id: modFormData.teacher_id || null
            };

            const res = await fetch(`${API_BASE_URL}/school-classes/${selectedClass.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(dataToSubmit)
            });

            if (res.ok) {
                alert("Classe mise à jour avec succès !");
                setSelectedClass(null);
                fetchClasses();
                setActiveTab("liste");
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Erreur lors de la mise à jour");
            }
        } catch(e: any) {
            alert(e.message);
        }
    };

    return (
        <>
            <div className="page-header">
                <h2>Gestion des Classes</h2>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setActiveTab('creation')}>
                        <i className="fas fa-plus"></i> Créer une classe
                    </button>
                </div>
            </div>

            <div className="tabs-container">
                <div className="tabs">
                    <button className={`tab-btn ${activeTab === 'liste' ? 'active' : ''}`} onClick={() => setActiveTab('liste')}>Liste des Classes</button>
                    <button className={`tab-btn ${activeTab === 'creation' ? 'active' : ''}`} onClick={() => setActiveTab('creation')}>Créer une classe</button>
                    {activeTab === 'modification' && (
                        <button className="tab-btn active">Modifier une classe</button>
                    )}
                </div>

                <div className="tab-content">
                    {/* TAB LISTE */}
                    {activeTab === 'liste' && (
                        <div id="liste-tab" className="tab-pane active">
                            <div className="content-card">
                                <div className="table-controls">
                                    <div className="search-box">
                                        <i className="fas fa-search"></i>
                                        <input type="text" placeholder="Rechercher une classe..." />
                                    </div>
                                    <div className="filters">
                                        <select className="form-select">
                                            <option value="">Tous les niveaux</option>
                                            {/* We can populate levels dynamically later */}
                                        </select>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Nom de la Classe</th>
                                                <th>Niveau</th>
                                                <th>Professeur Titulaire</th>
                                                <th>Élèves</th>
                                                <th>Capacité max</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading && <tr><td colSpan={6} style={{textAlign:'center', padding:'20px'}}>Chargement...</td></tr>}
                                            {error && <tr><td colSpan={6} style={{color:'red', textAlign:'center', padding:'20px'}}>{error}</td></tr>}
                                            {!loading && !error && classes.length === 0 && (
                                                <tr><td colSpan={6} style={{textAlign:'center', padding:'20px'}}>Aucune classe trouvée.</td></tr>
                                            )}
                                            {classes.map(cls => (
                                                <tr key={cls.id}>
                                                    <td><strong>{cls.name}</strong></td>
                                                    <td>{cls.level || '-'}</td>
                                                    <td>
                                                        {cls.teacher ? (
                                                            <span>{cls.teacher.first_name} {cls.teacher.last_name}</span>
                                                        ) : (
                                                            <span className="text-muted" style={{fontStyle:'italic'}}>Non assigné</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            padding: '4px 8px', 
                                                            borderRadius: '12px', 
                                                            backgroundColor: cls.students_count > 0 ? '#e3f2fd' : '#f5f5f5',
                                                            color: cls.students_count > 0 ? '#1976d2' : '#9e9e9e',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {cls.students_count || 0}
                                                        </span>
                                                    </td>
                                                    <td>{cls.capacity ? `${cls.capacity} places` : '-'}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button className="btn-icon view" title="Voir les détails">
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                            <button className="btn-icon edit" title="Modifier" onClick={() => openEditForm(cls)}>
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button className="btn-icon delete" title="Supprimer" onClick={() => handleDelete(cls.id)}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB CREATION */}
                    {activeTab === 'creation' && (
                        <div id="creation-tab" className="tab-pane active">
                            <div className="content-card">
                                <h3 className="section-title">Informations de la classe</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nom de la classe <span className="required">*</span></label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-control" placeholder="ex: 6ème A" />
                                    </div>
                                    <div className="form-group">
                                        <label>Niveau (Optionnel)</label>
                                        <input type="text" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="form-control" placeholder="ex: Collège, Lycée..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Capacité (Nombre max d'élèves)</label>
                                        <input type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="form-control" placeholder="ex: 40" />
                                    </div>
                                    <div className="form-group">
                                        <label>Professeur Titulaire (Optionnel)</label>
                                        <select value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="form-select">
                                            <option value="">Sélectionner un professeur...</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.first_name} {teacher.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions mt-4">
                                    <button className="btn-secondary" onClick={() => setActiveTab('liste')}>Annuler</button>
                                    <button className="btn-primary" onClick={handleSave}>Enregistrer la classe</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB MODIFICATION */}
                    {activeTab === 'modification' && selectedClass && (
                        <div id="modification-tab" className="tab-pane active">
                            <div className="content-card">
                                <h3 className="section-title">Modifier la classe</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nom de la classe <span className="required">*</span></label>
                                        <input type="text" value={modFormData.name} onChange={e => setModFormData({...modFormData, name: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Niveau (Optionnel)</label>
                                        <input type="text" value={modFormData.level} onChange={e => setModFormData({...modFormData, level: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Capacité (Nombre max d'élèves)</label>
                                        <input type="number" min="1" value={modFormData.capacity} onChange={e => setModFormData({...modFormData, capacity: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Professeur Titulaire (Optionnel)</label>
                                        <select value={modFormData.teacher_id} onChange={e => setModFormData({...modFormData, teacher_id: e.target.value})} className="form-select">
                                            <option value="">Sélectionner un professeur...</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.first_name} {teacher.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions mt-4">
                                    <button className="btn-secondary" onClick={() => setActiveTab('liste')}>Annuler</button>
                                    <button className="btn-primary" onClick={handleEdit}>Mettre à jour la classe</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
