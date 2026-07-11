"use client";

import { useState, useEffect, useRef } from "react";

export default function StudentsPage() {
    const [activeTab, setActiveTab] = useState("liste");
    const [students, setStudents] = useState<any[]>([]);
    const [schoolClasses, setSchoolClasses] = useState<any[]>([]);
    const [schoolYears, setSchoolYears] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        nom: '', prenom: '', sexe: '', naissance: '', matricule: '', nationalite: '',
        statut: '', lieu_naissance: '', adresse: '', date_inscription: '',
        tuteur_nom: '', tuteur_prenoms: '', tuteur_contact: '', tuteur_profession: '', tuteur_email: '',
        classe: ''
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    // Modification state
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [modFormData, setModFormData] = useState({
        nom: '', prenom: '', sexe: '', naissance: '', matricule: '', nationalite: '',
        statut: '', lieu_naissance: '', adresse: '', date_inscription: '',
        tuteur_nom: '', tuteur_prenoms: '', tuteur_contact: '', tuteur_profession: '', tuteur_email: '',
        classe: '', annee_scolaire: ''
    });
    const [modPhotoFile, setModPhotoFile] = useState<File | null>(null);

    // Search and Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/students`, {
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            if (res.status === 401 || res.status === 419) {
                console.warn("Utilisateur non authentifié (401).");
                // window.location.href = '/connexion';
                return;
            }
            if (!res.ok) throw new Error("Erreur de chargement des élèves");
            const data = await res.json();
            setStudents(data.data || []);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchClassesAndYears = async () => {
        try {
            const [classesRes, yearsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/school-classes`, { headers: { 'Accept': 'application/json' }, credentials: 'include' }),
                fetch(`${API_BASE_URL}/school-years`, { headers: { 'Accept': 'application/json' }, credentials: 'include' })
            ]);
            
            if (classesRes.ok) {
                const classesData = await classesRes.json();
                setSchoolClasses(classesData.data || []);
            }
            
            if (yearsRes.ok) {
                const yearsData = await yearsRes.json();
                setSchoolYears(yearsData.data || []);
            }
        } catch (e) {
            console.error("Erreur chargement classes/années", e);
        }
    };

    useEffect(() => {
        fetchClassesAndYears();
    }, []);

    useEffect(() => {
        if (activeTab === "liste" || activeTab === "recherche") {
            fetchStudents();
        }
    }, [activeTab]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('first_name', formData.prenom);
            data.append('last_name', formData.nom);
            if (formData.sexe) data.append('gender', formData.sexe);
            if (formData.naissance) data.append('birth_date', formData.naissance);
            if (formData.matricule) data.append('registration_number', formData.matricule);
            if (photoFile) data.append('photo', photoFile);
            
            if (formData.statut) data.append('status', formData.statut);
            if (formData.lieu_naissance) data.append('birth_place', formData.lieu_naissance);
            if (formData.nationalite) data.append('nationality', formData.nationalite);
            if (formData.adresse) data.append('address', formData.adresse);
            if (formData.date_inscription) data.append('enrollment_date', formData.date_inscription);
            if (formData.tuteur_nom) data.append('tuteur_nom', formData.tuteur_nom);
            if (formData.tuteur_prenoms) data.append('tuteur_prenoms', formData.tuteur_prenoms);
            if (formData.tuteur_contact) data.append('tuteur_contact', formData.tuteur_contact);
            if (formData.tuteur_profession) data.append('tuteur_profession', formData.tuteur_profession);
            if (formData.tuteur_email) data.append('tuteur_email', formData.tuteur_email);
            if (formData.classe) data.append('school_class_id', formData.classe);

            const res = await fetch(`${API_BASE_URL}/students`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: data
            });

            if (res.ok) {
                alert("Élève enregistré avec succès !");
                setFormData({ 
                    nom: '', prenom: '', sexe: '', naissance: '', matricule: '', nationalite: '',
                    statut: '', lieu_naissance: '', adresse: '', date_inscription: '',
                    tuteur_nom: '', tuteur_prenoms: '', tuteur_contact: '', tuteur_profession: '', tuteur_email: '',
                    classe: ''
                });
                setPhotoFile(null);
                const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                setActiveTab("liste");
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Erreur lors de l'enregistrement");
            }
        } catch(e: any) {
            alert(e.message);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;

        try {
            const data = new FormData();
            data.append('_method', 'PUT'); // Laravel requirement for form-data PUT
            data.append('first_name', modFormData.prenom);
            data.append('last_name', modFormData.nom);
            if (modFormData.sexe) data.append('gender', modFormData.sexe);
            if (modFormData.naissance) data.append('birth_date', modFormData.naissance);
            if (modFormData.matricule) data.append('registration_number', modFormData.matricule);
            if (modPhotoFile) data.append('photo', modPhotoFile);

            if (modFormData.statut) data.append('status', modFormData.statut);
            if (modFormData.lieu_naissance) data.append('birth_place', modFormData.lieu_naissance);
            if (modFormData.nationalite) data.append('nationality', modFormData.nationalite);
            if (modFormData.adresse) data.append('address', modFormData.adresse);
            if (modFormData.date_inscription) data.append('enrollment_date', modFormData.date_inscription);
            if (modFormData.tuteur_nom) data.append('tuteur_nom', modFormData.tuteur_nom);
            if (modFormData.tuteur_prenoms) data.append('tuteur_prenoms', modFormData.tuteur_prenoms);
            if (modFormData.tuteur_contact) data.append('tuteur_contact', modFormData.tuteur_contact);
            if (modFormData.tuteur_profession) data.append('tuteur_profession', modFormData.tuteur_profession);
            if (modFormData.tuteur_email) data.append('tuteur_email', modFormData.tuteur_email);
            if (modFormData.classe) data.append('school_class_id', modFormData.classe);
            if (modFormData.annee_scolaire) data.append('school_year_id', modFormData.annee_scolaire);

            const res = await fetch(`${API_BASE_URL}/students/${selectedStudent.id}`, {
                method: 'POST', // Use POST with _method=PUT
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: data
            });

            if (res.ok) {
                alert("Élève mis à jour avec succès !");
                setSelectedStudent(null);
                setModPhotoFile(null);
                const fileInput = document.getElementById('mod-photo-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                setActiveTab("liste");
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Erreur lors de la mise à jour");
            }
        } catch(e: any) {
            alert(e.message);
        }
    };

    const handleDelete = async (id: number | string) => {
        if (!confirm("Voulez-vous supprimer cet élève ?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/students/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                fetchStudents();
            } else {
                throw new Error("Erreur lors de la suppression");
            }
        } catch (e: any) {
            alert(e.message);
        }
    };

    const editStudent = (student: any) => {
        setSelectedStudent(student);
        
        const primaryGuardian = student.guardians?.find((g: any) => g.pivot.is_primary) || {};
        const currentEnrollment = student.enrollments?.[0] || {}; // Simplification: we take the first/latest enrollment

        setModFormData({
            nom: student.last_name || '',
            prenom: student.first_name || '',
            sexe: student.gender || '',
            naissance: student.birth_date || '',
            matricule: student.registration_number || '',
            nationalite: student.nationality || '',
            statut: student.status || '',
            lieu_naissance: student.birth_place || '',
            adresse: student.address || '',
            date_inscription: student.enrollment_date || '',
            tuteur_nom: primaryGuardian.last_name || '',
            tuteur_prenoms: primaryGuardian.first_name || '',
            tuteur_contact: primaryGuardian.phone || '',
            tuteur_profession: primaryGuardian.profession || '',
            tuteur_email: primaryGuardian.email || '',
            classe: currentEnrollment.school_class_id || '',
            annee_scolaire: currentEnrollment.school_year_id || ''
        });
        setModPhotoFile(null);
        setActiveTab("modification");
    };

    const filteredStudents = students.filter(s => {
        const query = searchQuery.toLowerCase();
        return (
            (s.first_name && s.first_name.toLowerCase().includes(query)) ||
            (s.last_name && s.last_name.toLowerCase().includes(query)) ||
            (s.registration_number && s.registration_number.toLowerCase().includes(query))
        );
    });

    return (
        <>
            <div className="features-nav">
                <button className={`feature-btn ${activeTab === 'enregistrement' ? 'active' : ''}`} onClick={() => setActiveTab('enregistrement')}>
                    <i className="fas fa-user-plus"></i> Enregistrement
                </button>
                <button className={`feature-btn ${activeTab === 'liste' ? 'active' : ''}`} onClick={() => setActiveTab('liste')}>
                    <i className="fas fa-list"></i> Liste des élèves
                </button>
                <button className={`feature-btn ${activeTab === 'modification' ? 'active' : ''}`} onClick={() => setActiveTab('modification')}>
                    <i className="fas fa-edit"></i> Modifications
                </button>
                <button className={`feature-btn ${activeTab === 'recherche' ? 'active' : ''}`} onClick={() => setActiveTab('recherche')}>
                    <i className="fas fa-search"></i> Recherche
                </button>
            </div>

            {/* ONGLET ENREGISTREMENT */}
            <div className={`feature-section ${activeTab === 'enregistrement' ? 'active' : ''}`} style={{ display: activeTab === 'enregistrement' ? 'block' : 'none' }}>
                <div className="page-header">
                    <div className="page-title">
                        <h3>Enregistrement d'un nouvel élève</h3>
                        <p>Remplissez les informations et ajoutez une photo</p>
                    </div>
                </div>
                <div className="form-container">
                    <form onSubmit={handleSave}>
                        {/* ÉLÈVE */}
                        <div className="form-section">
                                <h4 className="form-section-title"><i className="fas fa-id-card"></i> Informations Personnelles</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Matricule</label>
                                        <input type="text" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} className="form-control" placeholder="Laisser vide pour gérer automatiquement" />
                                    </div>
                                    <div className="form-group">
                                        <label>Nom *</label>
                                        <input type="text" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} required className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Prénom *</label>
                                        <input type="text" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} required className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Sexe</label>
                                        <select value={formData.sexe} onChange={e => setFormData({...formData, sexe: e.target.value})} className="form-control">
                                            <option value="">Sélectionner</option>
                                            <option value="M">Masculin</option>
                                            <option value="F">Féminin</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Statut</label>
                                        <select value={formData.statut} onChange={e => setFormData({...formData, statut: e.target.value})} className="form-control">
                                            <option value="">Sélectionner</option>
                                            <option value="nouveau">Nouveau(elle)</option>
                                            <option value="redoublant">Redoublant(e)</option>
                                            <option value="triplant">Triplant(e)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Date de Naissance</label>
                                        <input type="date" value={formData.naissance} onChange={e => setFormData({...formData, naissance: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Lieu de naissance</label>
                                        <input type="text" value={formData.lieu_naissance} onChange={e => setFormData({...formData, lieu_naissance: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Nationalité</label>
                                        <input type="text" list="nationalities-list" value={formData.nationalite} onChange={e => setFormData({...formData, nationalite: e.target.value})} className="form-control" placeholder="Ex: Ivoirienne, Française..." />
                                        <datalist id="nationalities-list">
                                            <option value="Ivoirienne" />
                                            <option value="Française" />
                                            <option value="Sénégalaise" />
                                            <option value="Malienne" />
                                            <option value="Burkinabè" />
                                            <option value="Guinéenne" />
                                            <option value="Béninoise" />
                                            <option value="Togolaise" />
                                            <option value="Camerounaise" />
                                            <option value="Gabonaise" />
                                        </datalist>
                                    </div>
                                    <div className="form-group">
                                        <label>Adresse</label>
                                        <input type="text" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Photo de profil</label>
                                        <input type="file" id="photo-upload" accept="image/jpeg, image/png, image/webp" onChange={e => setPhotoFile(e.target.files?.[0] || null)} className="form-control" />
                                        <small className="text-muted">JPG, PNG, WEBP (Max 5Mo)</small>
                                    </div>
                                </div>
                            </div>

                            {/* TUTEUR */}
                            <div className="form-section">
                                <h4 className="form-section-title"><i className="fas fa-user-shield"></i> Informations du Tuteur / Parent</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nom du tuteur</label>
                                        <input type="text" value={formData.tuteur_nom} onChange={e => setFormData({...formData, tuteur_nom: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Prénom(s) du tuteur</label>
                                        <input type="text" value={formData.tuteur_prenoms} onChange={e => setFormData({...formData, tuteur_prenoms: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact (Téléphone)</label>
                                        <input type="text" value={formData.tuteur_contact} onChange={e => setFormData({...formData, tuteur_contact: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Profession</label>
                                        <input type="text" value={formData.tuteur_profession} onChange={e => setFormData({...formData, tuteur_profession: e.target.value})} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Email du tuteur</label>
                                        <input type="email" value={formData.tuteur_email} onChange={e => setFormData({...formData, tuteur_email: e.target.value})} className="form-control" />
                                    </div>
                                </div>
                            </div>

                            {/* INSCRIPTION */}
                            <div className="form-section">
                                <h4 className="form-section-title"><i className="fas fa-graduation-cap"></i> Inscription</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Classe *</label>
                                        <select value={formData.classe} onChange={e => setFormData({...formData, classe: e.target.value})} className="form-control" required>
                                            <option value="">Sélectionner une classe</option>
                                            {schoolClasses.map((c: any) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Date d'inscription</label>
                                        <input type="date" value={formData.date_inscription} onChange={e => setFormData({...formData, date_inscription: e.target.value})} className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save"></i> Enregistrer l'élève
                                </button>
                            </div>
                        </form>
                    </div>
            </div>

            {/* ONGLET LISTE */}
            <div className={`feature-section ${activeTab === 'liste' ? 'active' : ''}`} style={{ display: activeTab === 'liste' ? 'block' : 'none' }}>
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="page-title">
                        <h3>Liste des élèves</h3>
                        <p>Visualisez et gérez les élèves de votre établissement</p>
                    </div>
                    <div className="header-actions">
                        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="form-control" style={{width: '250px'}}>
                            <option value="">Toutes les classes</option>
                            {schoolClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="table-container full-width">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Matricule</th>
                                <th>Nom</th>
                                <th>Prénom(s)</th>
                                <th>Sexe</th>
                                <th>Date de naissance</th>
                                <th>Classe</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                                <tbody>
                                    {loading && <tr><td colSpan={8} style={{textAlign:'center', padding:'30px'}}><i className="fas fa-spinner fa-spin"></i> Chargement...</td></tr>}
                                    {error && <tr><td colSpan={8} style={{textAlign:'center', padding:'30px', color:'var(--danger-color)'}}><i className="fas fa-exclamation-triangle"></i> {error}</td></tr>}
                                    {!loading && !error && students.length === 0 && (
                                        <tr>
                                            <td colSpan={8} style={{textAlign:'center', padding:'40px', color:'var(--text-light)'}}>
                                                <i className="fas fa-users" style={{fontSize: '3rem', marginBottom: '10px', opacity: 0.5}}></i><br/>
                                                Aucun élève enregistré pour le moment.
                                            </td>
                                        </tr>
                                    )}
                                    {students.filter(s => selectedClass ? s.enrollments?.[0]?.school_class_id === parseInt(selectedClass) : true).map(s => {
                                        const currentEnrollment = s.enrollments?.[0];
                                        const className = currentEnrollment?.school_class?.name || '-';
                                        return (
                                        <tr key={s.id}>
                                            <td>
                                                <div className="avatar" style={{width: '40px', height: '40px'}}>
                                                    {s.photo_path ? (
                                                        <img src={`http://localhost:8000/storage/${s.photo_path}`} alt="Photo" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                                                    ) : (
                                                        <i className="fas fa-user" style={{lineHeight: '40px'}}></i>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{s.registration_number || <span className="text-muted" style={{fontSize: '0.8em', fontStyle: 'italic'}}>Géré automatiquement</span>}</td>
                                            <td><strong>{s.last_name}</strong></td>
                                            <td>{s.first_name}</td>
                                            <td>{s.gender === 'F' ? 'Féminin' : s.gender === 'M' ? 'Masculin' : '-'}</td>
                                            <td>{s.birth_date || <span className="text-muted">-</span>}</td>
                                            <td>{className}</td>
                                            <td>
                                                <div className="action-buttons" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                                    <button className="btn btn-secondary btn-small" onClick={() => editStudent(s)} title="Modifier">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <div className="dropdown" style={{position: 'relative', display: 'inline-block'}}>
                                                        <button className="btn btn-primary btn-small" title="Imprimer" onClick={(e) => {
                                                            const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                                                            if (dropdown) {
                                                                const isVisible = dropdown.style.display === 'block';
                                                                document.querySelectorAll('.print-dropdown').forEach(d => (d as HTMLElement).style.display = 'none');
                                                                dropdown.style.display = isVisible ? 'none' : 'block';
                                                            }
                                                        }}>
                                                            <i className="fas fa-print"></i>
                                                        </button>
                                                        <div className="print-dropdown dropdown-menu" style={{display: 'none', position: 'absolute', right: 0, zIndex: 100, minWidth: '180px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                                                            <a href="#" onClick={(e) => { e.preventDefault(); alert(`Impression Fiche Identité pour ${s.last_name}`); }} style={{display: 'block', padding: '8px 12px', textDecoration: 'none', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)'}}>
                                                                <i className="fas fa-id-card" style={{marginRight: '8px', color: 'var(--primary-color)'}}></i> Fiche identité
                                                            </a>
                                                            <a href="#" onClick={(e) => { e.preventDefault(); alert(`Impression Fiche de Notes pour ${s.last_name}`); }} style={{display: 'block', padding: '8px 12px', textDecoration: 'none', color: 'var(--text-color)'}}>
                                                                <i className="fas fa-file-alt" style={{marginRight: '8px', color: 'var(--primary-color)'}}></i> Fiche de notes
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(s.id)} title="Supprimer" style={{backgroundColor: 'var(--danger-color)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'}}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
            </div>

            {/* ONGLET MODIFICATIONS */}
            <div className={`feature-section ${activeTab === 'modification' ? 'active' : ''}`} style={{ display: activeTab === 'modification' ? 'block' : 'none' }}>
                <div className="page-header">
                    <div className="page-title">
                        <h3>Modifier un élève</h3>
                        <p>Mettez à jour les informations de l'élève sélectionné</p>
                    </div>
                </div>
                <div className="form-container">
                        {!selectedStudent ? (
                            <div style={{textAlign: 'center', padding: '50px 20px', color: 'var(--text-light)'}}>
                                <i className="fas fa-hand-pointer" style={{fontSize: '3rem', marginBottom: '15px', opacity: 0.5}}></i>
                                <h4>Aucun élève sélectionné</h4>
                                <p>Veuillez sélectionner un élève dans la <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('liste'); }} style={{color: 'var(--primary-color)'}}>Liste des élèves</a> pour le modifier.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdate}>
                                <div className="form-section">
                                    <h4 className="form-section-title"><i className="fas fa-id-card"></i> Informations Personnelles</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Matricule</label>
                                            <input type="text" value={modFormData.matricule} onChange={e => setModFormData({...modFormData, matricule: e.target.value})} className="form-control" placeholder="Laisser vide pour gérer automatiquement" />
                                        </div>
                                        <div className="form-group">
                                            <label>Nom *</label>
                                            <input type="text" value={modFormData.nom} onChange={e => setModFormData({...modFormData, nom: e.target.value})} required className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Prénom *</label>
                                            <input type="text" value={modFormData.prenom} onChange={e => setModFormData({...modFormData, prenom: e.target.value})} required className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Sexe</label>
                                            <select value={modFormData.sexe} onChange={e => setModFormData({...modFormData, sexe: e.target.value})} className="form-control">
                                                <option value="">Sélectionner</option>
                                                <option value="M">Masculin</option>
                                                <option value="F">Féminin</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Statut</label>
                                            <select value={modFormData.statut} onChange={e => setModFormData({...modFormData, statut: e.target.value})} className="form-control">
                                                <option value="">Sélectionner</option>
                                                <option value="nouveau">Nouveau(elle)</option>
                                                <option value="redoublant">Redoublant(e)</option>
                                                <option value="triplant">Triplant(e)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Date de Naissance</label>
                                            <input type="date" value={modFormData.naissance} onChange={e => setModFormData({...modFormData, naissance: e.target.value})} className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Lieu de naissance</label>
                                            <input type="text" value={modFormData.lieu_naissance} onChange={e => setModFormData({...modFormData, lieu_naissance: e.target.value})} className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Nationalité</label>
                                            <input type="text" list="nationalities-list" value={modFormData.nationalite} onChange={e => setModFormData({...modFormData, nationalite: e.target.value})} className="form-control" placeholder="Ex: Ivoirienne, Française..." />
                                        </div>
                                        <div className="form-group">
                                            <label>Adresse</label>
                                            <input type="text" value={modFormData.adresse} onChange={e => setModFormData({...modFormData, adresse: e.target.value})} className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Nouvelle Photo (optionnel)</label>
                                            <input type="file" id="mod-photo-upload" accept="image/jpeg, image/png, image/webp" onChange={e => setModPhotoFile(e.target.files?.[0] || null)} className="form-control" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h4 className="form-section-title"><i className="fas fa-user-shield"></i> Informations du Tuteur / Parent</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Nom du tuteur</label>
                                            <input type="text" value={modFormData.tuteur_nom} onChange={e => setModFormData({...modFormData, tuteur_nom: e.target.value})} className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Prénom(s) du tuteur</label>
                                            <input type="text" value={modFormData.tuteur_prenoms} onChange={e => setModFormData({...modFormData, tuteur_prenoms: e.target.value})} className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Contact (Téléphone)</label>
                                            <input type="text" value={modFormData.tuteur_contact} onChange={e => setModFormData({...modFormData, tuteur_contact: e.target.value})} className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Profession</label>
                                            <input type="text" value={modFormData.tuteur_profession} onChange={e => setModFormData({...modFormData, tuteur_profession: e.target.value})} className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Email du tuteur</label>
                                            <input type="email" value={modFormData.tuteur_email} onChange={e => setModFormData({...modFormData, tuteur_email: e.target.value})} className="form-control" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h4 className="form-section-title"><i className="fas fa-graduation-cap"></i> Inscription</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Classe</label>
                                            <select value={modFormData.classe} onChange={e => setModFormData({...modFormData, classe: e.target.value})} className="form-control">
                                                <option value="">Sélectionner une classe</option>
                                                {schoolClasses.map((c: any) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Date d'inscription</label>
                                            <input type="date" value={modFormData.date_inscription} onChange={e => setModFormData({...modFormData, date_inscription: e.target.value})} className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Année Scolaire (Historique)</label>
                                            <select value={modFormData.annee_scolaire} onChange={e => setModFormData({...modFormData, annee_scolaire: e.target.value})} className="form-control">
                                                <option value="">Année active par défaut</option>
                                                {schoolYears.map((y: any) => (
                                                    <option key={y.id} value={y.id}>{y.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedStudent(null)}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        <i className="fas fa-save"></i> Mettre à jour l'élève
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
            </div>

            {/* ONGLET RECHERCHE */}
            <div className={`feature-section ${activeTab === 'recherche' ? 'active' : ''}`} style={{ display: activeTab === 'recherche' ? 'block' : 'none' }}>
                <div className="page-header">
                    <div className="page-title">
                        <h3>Recherche d'élèves</h3>
                        <p>Trouvez rapidement un élève par son nom ou son matricule</p>
                    </div>
                </div>
                
                <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-body">
                        <div className="search-bar-container" style={{ display: 'flex', gap: '15px' }}>
                            <div className="search-input-wrapper" style={{ flex: 1, position: 'relative' }}>
                                <i className="fas fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}></i>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Entrez un nom, prénom ou matricule..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: '45px', height: '50px', fontSize: '1.1rem' }}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={fetchStudents} title="Rafraîchir les données">
                                <i className="fas fa-sync"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {searchQuery && (
                    <div className="card">
                        <div className="card-body">
                            <h4 style={{ marginBottom: '15px' }}>Résultats ({filteredStudents.length})</h4>
                            
                            {filteredStudents.length === 0 ? (
                                <div style={{textAlign: 'center', padding: '30px', color: 'var(--text-light)'}}>
                                    <i className="fas fa-search-minus" style={{fontSize: '2rem', marginBottom: '10px', opacity: 0.5}}></i>
                                    <p>Aucun élève ne correspond à "{searchQuery}"</p>
                                </div>
                            ) : (
                                <div className="table-container full-width">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Photo</th>
                                                <th>Nom & Prénom</th>
                                                <th>Matricule</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map(s => (
                                                <tr key={s.id}>
                                                    <td>
                                                        <div className="avatar" style={{width: '35px', height: '35px'}}>
                                                            {s.photo_path ? (
                                                                <img src={`http://localhost:8000/storage/${s.photo_path}`} alt="Photo" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                                                            ) : (
                                                                <i className="fas fa-user" style={{lineHeight: '35px'}}></i>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td><strong>{s.last_name} {s.first_name}</strong></td>
                                                    <td>{s.registration_number || <span className="text-muted" style={{fontSize: '0.8em', fontStyle: 'italic'}}>Géré automatiquement</span>}</td>
                                                    <td>
                                                        <button className="btn btn-secondary btn-small" onClick={() => editStudent(s)}>
                                                            <i className="fas fa-edit"></i> Modifier
                                                        </button>
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
            </div>
        </>
    );
}

