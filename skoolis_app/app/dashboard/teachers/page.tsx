"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function TeachersPage() {
    const [activeTab, setActiveTab] = useState("liste");
    const [teachers, setTeachers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: 'homme',
        birth_date: '',
        birth_place: '',
        address: '',
        nationality: '',
        marital_status: 'celibataire',
        education_level: '',
        status: '',
        hire_date: '',
        primary_subject: '',
        secondary_subject: '',
        tertiary_subject: '',
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

    const fetchTeachers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/teachers`, {
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setTeachers(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch teachers", e);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handlePhotoChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: any) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if ((formData as any)[key]) {
                    data.append(key, (formData as any)[key]);
                }
            });
            if (photo) {
                data.append('photo', photo);
            }

            const res = await fetch(`${API_BASE_URL}/teachers`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: data
            });

            if (res.ok) {
                alert("Professeur créé avec succès !");
                setFormData({
                    first_name: '', last_name: '', email: '', phone: '', gender: 'homme',
                    birth_date: '', birth_place: '', address: '', nationality: '', marital_status: 'celibataire',
                    education_level: '', status: '', hire_date: '', primary_subject: '', secondary_subject: '', tertiary_subject: ''
                });
                setPhoto(null);
                setPhotoPreview(null);
                fetchTeachers();
                setActiveTab("liste");
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Erreur lors de la création");
            }
        } catch(e: any) {
            alert(e.message);
        }
    };

    return (
        <>
            <div className="features-nav">
                <button 
                    className={`feature-btn ${activeTab === 'liste' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liste')}
                >
                    <i className="fas fa-list"></i> Liste des professeurs
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'enregistrement' ? 'active' : ''}`}
                    onClick={() => setActiveTab('enregistrement')}
                >
                    <i className="fas fa-user-plus"></i> Nouveau professeur
                </button>
                <button className="feature-btn">
                    <i className="fas fa-tasks"></i> Affectations
                </button>
                <button className="feature-btn">
                    <i className="fas fa-chart-pie"></i> Statistiques
                </button>
            </div>

            {/* Section Liste des professeurs */}
            {activeTab === 'liste' && (
                <div className="feature-section active" id="liste">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Liste des professeurs</h3>
                            <p>Tous les enseignants de l'établissement</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn btn-primary">
                                <i className="fas fa-print"></i> Imprimer liste
                            </button>
                        </div>
                    </div>

                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Statut:</label>
                            <select className="form-select">
                                <option value="">Tous les statuts</option>
                                <option value="titulaire">Titulaire</option>
                                <option value="vacataire">Vacataire</option>
                                <option value="contractuel">Contractuel</option>
                                <option value="ancien">Ancien(ne)</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Matière:</label>
                            <select className="form-select">
                                <option value="">Toutes les matières</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Nom & Prénoms</th>
                                    <th>Matière principale</th>
                                    <th>Statut</th>
                                    <th>Contact</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map(teacher => (
                                    <tr key={teacher.id}>
                                        <td>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden' }}>
                                                {teacher.photo ? (
                                                    <img src={`http://127.0.0.1:8000/storage/${teacher.photo}`} alt="photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <i className="fas fa-user" style={{ padding: '12px', color: '#999' }}></i>
                                                )}
                                            </div>
                                        </td>
                                        <td>{teacher.last_name} {teacher.first_name}</td>
                                        <td>{teacher.primary_subject || '-'}</td>
                                        <td>{teacher.status || '-'}</td>
                                        <td>{teacher.phone || teacher.email || '-'}</td>
                                        <td>
                                            <button className="action-btn view-btn"><i className="fas fa-eye"></i></button>
                                            <button className="action-btn edit-btn"><i className="fas fa-edit"></i></button>
                                        </td>
                                    </tr>
                                ))}
                                {teachers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>Aucun professeur trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Section Nouveau professeur */}
            {activeTab === 'enregistrement' && (
                <div className="feature-section active" id="enregistrement">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Ajouter un nouveau professeur</h3>
                            <p>Enregistrez un nouvel enseignant dans le système</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <form onSubmit={handleSave}>
                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-user-tie"></i> Informations personnelles
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nom *</label>
                                        <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Prénoms *</label>
                                        <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Genre</label>
                                        <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                            <option value="homme">Homme</option>
                                            <option value="femme">Femme</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Date de naissance</label>
                                        <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Lieu de naissance</label>
                                        <input type="text" value={formData.birth_place} onChange={e => setFormData({...formData, birth_place: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Adresse</label>
                                        <textarea rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Nationalité</label>
                                        <input type="text" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Situation matrimoniale</label>
                                        <select value={formData.marital_status} onChange={e => setFormData({...formData, marital_status: e.target.value})}>
                                            <option value="celibataire">Célibataire</option>
                                            <option value="marie">Marié(e)</option>
                                            <option value="divorce">Divorcé(e)</option>
                                            <option value="veuf">Veuf(ve)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Téléphone</label>
                                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Niveau d'études</label>
                                        <input type="text" value={formData.education_level} onChange={e => setFormData({...formData, education_level: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Photo</label>
                                        <input type="file" accept="image/*" onChange={handlePhotoChange} />
                                        {photoPreview && (
                                            <div className="image-preview" style={{marginTop: '10px'}}>
                                                <img src={photoPreview} alt="Aperçu" style={{maxWidth: '100px', maxHeight: '100px'}} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-id-card"></i> Informations professionnelles
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Statut *</label>
                                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} required>
                                            <option value="">Sélectionner un statut</option>
                                            <option value="titulaire">Titulaire</option>
                                            <option value="vacataire">Vacataire</option>
                                            <option value="contractuel">Contractuel</option>
                                            <option value="ancien">Ancien(ne)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Date d'embauche</label>
                                        <input type="date" value={formData.hire_date} onChange={e => setFormData({...formData, hire_date: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-book"></i> Matières enseignées
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Matière principale</label>
                                        <input type="text" value={formData.primary_subject} onChange={e => setFormData({...formData, primary_subject: e.target.value})} placeholder="Ex: Mathématiques" />
                                    </div>
                                    <div className="form-group">
                                        <label>Matière secondaire</label>
                                        <input type="text" value={formData.secondary_subject} onChange={e => setFormData({...formData, secondary_subject: e.target.value})} placeholder="Ex: Physique" />
                                    </div>
                                    <div className="form-group">
                                        <label>Matière tertiaire</label>
                                        <input type="text" value={formData.tertiary_subject} onChange={e => setFormData({...formData, tertiary_subject: e.target.value})} />
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
        </>
    );
}
