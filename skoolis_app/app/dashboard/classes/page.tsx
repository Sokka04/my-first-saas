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

    // Calculate Stats
    const totalClasses = classes.length;
    const totalStudents = classes.reduce((acc, cls) => acc + (cls.students_count || 0), 0);
    const assignedTeachers = new Set(classes.filter(c => c.teacher_id).map(c => c.teacher_id)).size;
    const avgStudents = totalClasses > 0 ? (totalStudents / totalClasses).toFixed(1) : "0";

    return (
        <main className="main-content" style={{ padding: '20px' }}>
            {/* Top Header */}
            <header className="top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div className="header-left">
                    <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--primary-color)' }}>Gestion des Classes</h2>
                    <p style={{ margin: '5px 0 0', color: 'var(--text-muted)' }}>Créez, gérez et organisez les classes de l'établissement</p>
                </div>
                <div className="header-right" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div className="search-box" style={{ position: 'relative' }}>
                        <i className="fas fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e' }}></i>
                        <input type="text" placeholder="Rechercher une classe..." style={{ padding: '10px 15px 10px 40px', borderRadius: '20px', border: '1px solid #e0e0e0', outline: 'none' }} />
                    </div>
                    <div className="header-icons" style={{ display: 'flex', gap: '10px' }}>
                        <button className="icon-btn notification" style={{ border: 'none', background: '#f5f5f5', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', position: 'relative' }}>
                            <i className="fas fa-bell"></i>
                            <span className="badge" style={{ position: 'absolute', top: '0', right: '0', background: 'var(--accent-color, #ff9800)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>2</span>
                        </button>
                        <button className="icon-btn" style={{ border: 'none', background: '#f5f5f5', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}>
                            <i className="fas fa-moon"></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* Statistiques rapides */}
            <div className="stats-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div className="card-icon" style={{ backgroundColor: 'rgba(123, 31, 162, 0.1)', color: 'var(--primary-color)', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        <i className="fas fa-chalkboard"></i>
                    </div>
                    <div className="card-info">
                        <h3 style={{ margin: 0, fontSize: '24px' }}>{totalClasses}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Classes actives</p>
                    </div>
                </div>
                <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div className="card-icon" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="card-info">
                        <h3 style={{ margin: 0, fontSize: '24px' }}>{totalStudents}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Élèves total</p>
                    </div>
                </div>
                <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div className="card-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="card-info">
                        <h3 style={{ margin: 0, fontSize: '24px' }}>{assignedTeachers}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Professeurs assignés</p>
                    </div>
                </div>
                <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div className="card-icon" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        <i className="fas fa-chart-bar"></i>
                    </div>
                    <div className="card-info">
                        <h3 style={{ margin: 0, fontSize: '24px' }}>{avgStudents}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Moyenne d'élèves/classe</p>
                    </div>
                </div>
            </div>

            {/* Navigation des fonctionnalités */}
            <div className="features-nav" style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
                <button 
                    className={`feature-btn ${activeTab === 'liste' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('liste')}
                    style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: activeTab === 'liste' ? 'bold' : 'normal', color: activeTab === 'liste' ? 'var(--primary-color)' : 'var(--text-muted)', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: activeTab === 'liste' ? '2px solid var(--primary-color)' : 'none' }}>
                    <i className="fas fa-list"></i> Liste des classes
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'enregistrement' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('enregistrement')}
                    style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: activeTab === 'enregistrement' ? 'bold' : 'normal', color: activeTab === 'enregistrement' ? 'var(--primary-color)' : 'var(--text-muted)', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: activeTab === 'enregistrement' ? '2px solid var(--primary-color)' : 'none' }}>
                    <i className="fas fa-plus-circle"></i> Nouvelle classe
                </button>
                {/* Attribuer Titulaire and Effectifs are mockups for now to match UI */}
                <button 
                    className="feature-btn"
                    style={{ background: 'none', border: 'none', fontSize: '16px', color: 'var(--text-muted)', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-user-tie"></i> Attribuer titulaire
                </button>
                <button 
                    className="feature-btn"
                    style={{ background: 'none', border: 'none', fontSize: '16px', color: 'var(--text-muted)', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-chart-pie"></i> Effectifs & Statistiques
                </button>
            </div>

            {/* Section Liste des classes */}
            {activeTab === 'liste' && (
                <div className="feature-section" id="liste">
                    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="page-title">
                            <h3 style={{ margin: 0, fontSize: '20px' }}>Liste des classes</h3>
                            <p style={{ margin: '5px 0 0', color: 'var(--text-muted)' }}>Gérez toutes les classes de l'établissement</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn btn-primary" style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                                <i className="fas fa-print"></i> Imprimer liste
                            </button>
                        </div>
                    </div>

                    <div className="filters-container" style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Cycle:</label>
                            <select className="form-select" style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                <option value="">Tous les cycles</option>
                                <option value="primaire">Primaire</option>
                                <option value="college">Collège</option>
                                <option value="lycee">Lycée</option>
                            </select>
                        </div>
                        <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Niveau:</label>
                            <select className="form-select" style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                <option value="">Tous les niveaux</option>
                                <option value="6eme">6ème</option>
                                <option value="5eme">5ème</option>
                                <option value="4eme">4ème</option>
                                <option value="3eme">3ème</option>
                            </select>
                        </div>
                    </div>

                    <div className="classes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {loading && <p>Chargement des classes...</p>}
                        {!loading && classes.length === 0 && <p>Aucune classe enregistrée.</p>}
                        {classes.map(cls => (
                            <div key={cls.id} className="class-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid var(--primary-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '20px', color: 'var(--text-color)' }}>{cls.name}</h4>
                                        <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{cls.cycle || 'Non défini'} • {cls.level || '-'}</span>
                                    </div>
                                    <div style={{ background: '#f5f5f5', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                                        <i className="fas fa-users"></i>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                                        <i className="fas fa-user-tie" style={{ marginRight: '8px' }}></i>
                                        {cls.teacher ? `${cls.teacher.first_name} ${cls.teacher.last_name}` : 'Aucun titulaire'}
                                    </p>
                                </div>
                                <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '10px', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                                        <span>Effectif: <strong>{cls.students_count || 0}</strong></span>
                                        <span style={{ color: 'var(--text-muted)' }}>Capacité: {cls.capacity || '-'}</span>
                                    </div>
                                    {cls.capacity && (
                                        <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.min(((cls.students_count || 0) / cls.capacity) * 100, 100)}%`, height: '100%', background: ((cls.students_count || 0) > cls.capacity) ? '#f44336' : 'var(--primary-color)' }}></div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button style={{ flex: 1, background: '#f5f5f5', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', color: 'var(--text-color)' }}>
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
                <div className="feature-section" id="enregistrement">
                    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="page-title">
                            <h3 style={{ margin: 0, fontSize: '20px' }}>Créer une nouvelle classe</h3>
                            <p style={{ margin: '5px 0 0', color: 'var(--text-muted)' }}>Configurez une nouvelle classe pour l'année scolaire</p>
                        </div>
                    </div>

                    <div className="form-container" style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <form onSubmit={handleSave}>
                            <div className="form-section" style={{ marginBottom: '30px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                                    <i className="fas fa-info-circle"></i> Informations de base
                                </h4>
                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontWeight: 'bold' }}>Nom de la classe <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} placeholder="Ex: 3ème A" />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontWeight: 'bold' }}>Niveau <span style={{ color: 'red' }}>*</span></label>
                                        <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
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
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontWeight: 'bold' }}>Cycle <span style={{ color: 'red' }}>*</span></label>
                                        <select value={formData.cycle} onChange={e => setFormData({...formData, cycle: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                            <option value="">Sélectionner un cycle</option>
                                            <option value="primaire">Primaire</option>
                                            <option value="college">Collège</option>
                                            <option value="lycee">Lycée</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontWeight: 'bold' }}>Capacité maximale</label>
                                        <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} min="1" max="1000" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} placeholder="45" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section" style={{ marginBottom: '30px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                                    <i className="fas fa-chalkboard-teacher"></i> Professeur titulaire
                                </h4>
                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontWeight: 'bold' }}>Titulaire de la classe</label>
                                        <select value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                            <option value="">Aucun titulaire assigné</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.first_name} {teacher.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Vous pourrez modifier cela plus tard</small>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <button type="button" onClick={() => setActiveTab('liste')} style={{ background: '#f5f5f5', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    <i className="fas fa-times"></i> Annuler
                                </button>
                                <button type="submit" style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    <i className="fas fa-save"></i> Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    );
}
