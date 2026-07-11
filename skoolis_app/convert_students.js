const fs = require('fs');

const htmlContent = fs.readFileSync('public/skolis/pages/eleves.html', 'utf8');

// Extract the <main> part
const mainMatch = htmlContent.match(/<main class="main-content">([\s\S]*?)<\/main>/);
if (!mainMatch) {
    console.error("Main content not found!");
    process.exit(1);
}

let mainHtml = mainMatch[1];

// Convert to JSX
mainHtml = mainHtml.replace(/class=/g, 'className=')
                   .replace(/onclick=/g, 'onClick=')
                   .replace(/onchange=/g, 'onChange=')
                   .replace(/oninput=/g, 'onInput=')
                   .replace(/for=/g, 'htmlFor=')
                   .replace(/style="([^"]*)"/g, (match, styleStr) => {
                       // simple style to object
                       if (!styleStr.trim()) return 'style={{}}';
                       const styleObj = {};
                       styleStr.split(';').forEach(rule => {
                           const parts = rule.split(':');
                           if (parts.length === 2) {
                               const key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                               const value = parts[1].trim();
                               styleObj[key] = value;
                           }
                       });
                       return `style={${JSON.stringify(styleObj)}}`;
                   })
                   .replace(/<input([^>]*?)>/g, (match) => {
                       if (match.endsWith('/>')) return match;
                       return match.replace(/>$/, ' />');
                   })
                   .replace(/<img([^>]*?)>/g, (match) => {
                       if (match.endsWith('/>')) return match;
                       return match.replace(/>$/, ' />');
                   })
                   // Remove script and link tags from main if any
                   .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                   // Close <br>, <hr>
                   .replace(/<br>/g, '<br />')
                   .replace(/<hr>/g, '<hr />')
                   .replace(/<!--[\s\S]*?-->/g, ''); // strip comments to avoid errors

const componentCode = `
"use client";

import { useState, useEffect } from "react";
import { TopHeader } from "../components/TopHeader";

export default function StudentsPage() {
    const [activeTab, setActiveTab] = useState("liste");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        nom: '', prenom: '', sexe: '', naissance: '', matricule: ''
    });

    const API_BASE_URL = 'http://localhost:8000/api/v1';

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await fetch(\`\${API_BASE_URL}/students\`, {
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            if (res.status === 401 || res.status === 419) {
                window.location.href = '/';
                return;
            }
            if (!res.ok) throw new Error("Erreur de chargement");
            const data = await res.json();
            setStudents(data.data || []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "liste") {
            fetchStudents();
        }
    }, [activeTab]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(\`\${API_BASE_URL}/students\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    first_name: formData.prenom,
                    last_name: formData.nom,
                    gender: formData.sexe,
                    birth_date: formData.naissance,
                    registration_number: formData.matricule
                })
            });
            if (res.ok) {
                alert("Élève enregistré avec succès !");
                setFormData({ nom: '', prenom: '', sexe: '', naissance: '', matricule: '' });
                setActiveTab("liste");
            } else {
                throw new Error("Erreur de sauvegarde");
            }
        } catch(e) {
            alert(e.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Voulez-vous supprimer cet élève ?")) return;
        try {
            await fetch(\`\${API_BASE_URL}/students/\${id}\`, {
                method: 'DELETE',
                credentials: 'include'
            });
            fetchStudents();
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <>
            <div className="features-nav">
                <button className={\`feature-btn \${activeTab === 'enregistrement' ? 'active' : ''}\`} onClick={() => setActiveTab('enregistrement')}>
                    <i className="fas fa-user-plus"></i> Enregistrement
                </button>
                <button className={\`feature-btn \${activeTab === 'liste' ? 'active' : ''}\`} onClick={() => setActiveTab('liste')}>
                    <i className="fas fa-list"></i> Liste des élèves
                </button>
                <button className={\`feature-btn \${activeTab === 'modification' ? 'active' : ''}\`} onClick={() => setActiveTab('modification')}>
                    <i className="fas fa-edit"></i> Modifications
                </button>
                <button className={\`feature-btn \${activeTab === 'recherche' ? 'active' : ''}\`} onClick={() => setActiveTab('recherche')}>
                    <i className="fas fa-search"></i> Recherche
                </button>
                <button className={\`feature-btn \${activeTab === 'photo' ? 'active' : ''}\`} onClick={() => setActiveTab('photo')}>
                    <i className="fas fa-camera"></i> Photo élève
                </button>
            </div>

            <div className={\`feature-section \${activeTab === 'enregistrement' ? 'active' : ''}\`} style={{ display: activeTab === 'enregistrement' ? 'block' : 'none' }}>
                <div className="page-header">
                    <div className="page-title">
                        <h3>Enregistrement d'un nouvel élève</h3>
                        <p>Remplissez toutes les informations requises</p>
                    </div>
                    <div className="page-actions">
                        <button className="btn btn-primary" onClick={handleSave}>
                            <i className="fas fa-save"></i> Enregistrer
                        </button>
                    </div>
                </div>
                <div className="form-container">
                    <form id="studentForm" onSubmit={handleSave}>
                        <div className="form-section">
                            <h4 className="form-section-title"><i className="fas fa-id-card"></i> Identité</h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nom *</label>
                                    <input type="text" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Prénom *</label>
                                    <input type="text" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Sexe</label>
                                    <select value={formData.sexe} onChange={e => setFormData({...formData, sexe: e.target.value})}>
                                        <option value="">Sélectionner</option>
                                        <option value="M">Masculin</option>
                                        <option value="F">Féminin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date de Naissance</label>
                                    <input type="date" value={formData.naissance} onChange={e => setFormData({...formData, naissance: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Matricule</label>
                                    <input type="text" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className={\`feature-section \${activeTab === 'liste' ? 'active' : ''}\`} style={{ display: activeTab === 'liste' ? 'block' : 'none' }}>
                <div className="page-header">
                    <div className="page-title">
                        <h3>Liste des élèves</h3>
                        <p><span id="totalStudents">{students.length}</span> élèves inscrits</p>
                    </div>
                </div>
                <div className="table-container full-width">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nom & Prénom</th>
                                <th>Matricule</th>
                                <th>Classe</th>
                                <th>Date de naissance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan={5} style={{textAlign:'center', padding:'20px'}}>Chargement...</td></tr> : null}
                            {error ? <tr><td colSpan={5} style={{textAlign:'center', padding:'20px', color:'red'}}>{error}</td></tr> : null}
                            {!loading && !error && students.length === 0 ? <tr><td colSpan={5} style={{textAlign:'center', padding:'20px'}}>Aucun élève.</td></tr> : null}
                            {students.map(s => (
                                <tr key={s.id}>
                                    <td><strong>{s.last_name} {s.first_name}</strong></td>
                                    <td>{s.registration_number || '-'}</td>
                                    <td>-</td>
                                    <td>{s.birth_date || '-'}</td>
                                    <td>
                                        <button className="btn btn-secondary btn-small" onClick={() => handleDelete(s.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Other tabs placeholders for this iteration */}
            <div className={\`feature-section \${activeTab === 'modification' ? 'active' : ''}\`} style={{ display: activeTab === 'modification' ? 'block' : 'none' }}>
                <div className="page-header"><div className="page-title"><h3>Modifications</h3><p>À venir dans une prochaine itération</p></div></div>
            </div>
            <div className={\`feature-section \${activeTab === 'recherche' ? 'active' : ''}\`} style={{ display: activeTab === 'recherche' ? 'block' : 'none' }}>
                <div className="page-header"><div className="page-title"><h3>Recherche</h3><p>À venir dans une prochaine itération</p></div></div>
            </div>
            <div className={\`feature-section \${activeTab === 'photo' ? 'active' : ''}\`} style={{ display: activeTab === 'photo' ? 'block' : 'none' }}>
                <div className="page-header"><div className="page-title"><h3>Photo</h3><p>À venir dans une prochaine itération</p></div></div>
            </div>
        </>
    );
}
`;

fs.mkdirSync('app/dashboard/students', { recursive: true });
fs.writeFileSync('app/dashboard/students/page.tsx', componentCode);
console.log("Done");
