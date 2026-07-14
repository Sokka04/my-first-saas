"use client";

import { useState } from "react";

export default function ResultatsPage() {
    const [activeTab, setActiveTab] = useState("resultats-classe");
    const [showDelibPopup, setShowDelibPopup] = useState(false);
    const [showApercuPopup, setShowApercuPopup] = useState(false);
    const [currentSortMode, setCurrentSortMode] = useState("merite");
    const [modeUnEleve, setModeUnEleve] = useState(false);

    const validerEleve = (e: any) => {
        const btn = e.target;
        btn.textContent = '✓ Validé';
        btn.disabled = true;
        btn.style.background = '#2e7d32';
        alert("Décision validée pour l'élève"); // Basic mock
    };

    return (
        <>
            {/* Stats rapides */}
            <div className="stats-cards">
                <div className="card">
                    <div className="card-icon" style={{backgroundColor: 'rgba(123,31,162,0.1)', color: 'var(--primary-color)'}}>
                        <i className="fas fa-graduation-cap"></i>
                    </div>
                    <div className="card-info"><h3>420</h3><p>Élèves évalués</p></div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{backgroundColor: 'rgba(76,175,80,0.1)', color: '#4caf50'}}>
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="card-info"><h3>76%</h3><p>Taux de réussite</p></div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{backgroundColor: 'rgba(33,150,243,0.1)', color: '#2196f3'}}>
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="card-info"><h3>12.4/20</h3><p>Moyenne générale</p></div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{backgroundColor: 'rgba(255,152,0,0.1)', color: '#ff9800'}}>
                        <i className="fas fa-file-pdf"></i>
                    </div>
                    <div className="card-info"><h3 id="bulletinsGeneres">0</h3><p>Bulletins générés</p></div>
                </div>
            </div>

            {/* Onglets fonctionnalités */}
            <div className="features-nav">
                <button className={`feature-btn ${activeTab === 'resultats-classe' ? 'active' : ''}`} onClick={() => setActiveTab('resultats-classe')}>
                    <i className="fas fa-list-ol"></i>
                    Résultats par classe
                </button>
                <button className={`feature-btn ${activeTab === 'bulletins' ? 'active' : ''}`} onClick={() => setActiveTab('bulletins')}>
                    <i className="fas fa-file-invoice"></i>
                    Générer bulletins
                </button>
                <button className={`feature-btn ${activeTab === 'deliberation' ? 'active' : ''}`} onClick={() => setActiveTab('deliberation')}>
                    <i className="fas fa-gavel"></i>
                    Délibération
                </button>
                <button className={`feature-btn ${activeTab === 'statistiques' ? 'active' : ''}`} onClick={() => setActiveTab('statistiques')}>
                    <i className="fas fa-chart-bar"></i>
                    Statistiques
                </button>
            </div>

            {/* SECTION 1 – RÉSULTATS PAR CLASSE */}
            {activeTab === 'resultats-classe' && (
                <div className="feature-section active" id="resultats-classe">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Résultats par classe</h3>
                            <p>Consultez et imprimez les résultats triés par ordre de mérite ou alphabétique</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn btn-primary" onClick={() => window.print()}>
                                <i className="fas fa-print"></i> Imprimer
                            </button>
                        </div>
                    </div>

                    {/* Filtres + tri */}
                    <div className="filters-container" style={{flexWrap: 'wrap', gap: '12px'}}>
                        <div className="filter-group">
                            <label>Classe :</label>
                            <select className="form-select" id="rc_classe">
                                <option value="3A">3ème A</option>
                                <option value="3B">3ème B</option>
                                <option value="4A">4ème A</option>
                                <option value="5A">5ème A</option>
                                <option value="6A">6ème A</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Période :</label>
                            <select className="form-select" id="rc_periode">
                                <option value="t1">1er Trimestre</option>
                                <option value="t2">2ème Trimestre</option>
                                <option value="t3">3ème Trimestre</option>
                                <option value="annuel">Annuel</option>
                            </select>
                        </div>
                        <div className="classement-sort-bar" style={{marginBottom: 0}}>
                            <button className={`sort-btn ${currentSortMode === 'merite' ? 'active' : ''}`} onClick={() => setCurrentSortMode('merite')}>
                                <i className="fas fa-trophy"></i> Ordre de mérite
                            </button>
                            <button className={`sort-btn ${currentSortMode === 'alpha' ? 'active' : ''}`} onClick={() => setCurrentSortMode('alpha')}>
                                <i className="fas fa-sort-alpha-down"></i> Ordre alphabétique
                            </button>
                        </div>
                    </div>

                    <div className="table-card">
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Rang</th>
                                        <th>Nom & Prénom</th>
                                        <th>Matricule</th>
                                        <th>Moy. T1</th>
                                        <th>Moy. T2</th>
                                        <th>Moy. T3</th>
                                        <th>Moyenne</th>
                                        <th>Mention</th>
                                        <th>Décision</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Mock Data */}
                                    <tr>
                                        <td>1</td>
                                        <td>ABALO Kossi</td>
                                        <td>EL-2024-001</td>
                                        <td>16.5</td><td>17.4</td><td>18.2</td>
                                        <td><strong>17.4</strong></td>
                                        <td>Très Bien</td>
                                        <td>Admis</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>AKAKPO Ama</td>
                                        <td>EL-2024-002</td>
                                        <td>15.0</td><td>16.8</td><td>17.5</td>
                                        <td><strong>16.4</strong></td>
                                        <td>Très Bien</td>
                                        <td>Admis</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 2 – GÉNÉRER BULLETINS */}
            {activeTab === 'bulletins' && (
                <div className="feature-section active" id="bulletins">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Générer les bulletins de notes</h3>
                            <p>Configurez et imprimez les bulletins de classe ou individuels</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <form id="bulletinForm" onSubmit={(e) => e.preventDefault()}>
                            {/* Critères */}
                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-filter"></i> Critères de génération
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="bull_annee">Année scolaire *</label>
                                        <select id="bull_annee" required>
                                            <option value="2023-2024">2023-2024</option>
                                            <option value="2024-2025">2024-2025</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bull_periode">Période *</label>
                                        <select id="bull_periode" required>
                                            <option value="">Sélectionner une période</option>
                                            <option value="1er Trimestre">1er Trimestre</option>
                                            <option value="2ème Trimestre">2ème Trimestre</option>
                                            <option value="3ème Trimestre">3ème Trimestre</option>
                                            <option value="Bilan annuel">Bilan annuel</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bull_classe">Classe *</label>
                                        <select id="bull_classe" required>
                                            <option value="">Sélectionner une classe</option>
                                            <option value="3A">3ème A</option>
                                            <option value="3B">3ème B</option>
                                            <option value="4A">4ème A</option>
                                            <option value="5A">5ème A</option>
                                            <option value="6A">6ème A</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Date du conseil */}
                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-calendar-check"></i> Date du conseil de classe
                                </h4>
                                <div className="conseil-date-group">
                                    <i className="fas fa-calendar-alt" style={{color: 'var(--primary-color)'}}></i>
                                    <label htmlFor="dateConseil">Date du conseil :</label>
                                    <input type="date" id="dateConseil" />
                                </div>
                            </div>

                            {/* Impression */}
                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-print"></i> Options d'impression
                                </h4>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                    <label className="backup-toggle-row" style={{cursor: 'default'}}>
                                        <div>
                                            <strong>Un seul élève</strong>
                                            <p style={{fontSize: '12px', color: 'var(--text-light)', margin: '2px 0 0'}}>Sélectionner un élève spécifique</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" id="modeUnEleve" checked={modeUnEleve} onChange={(e) => setModeUnEleve(e.target.checked)} />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </label>

                                    {modeUnEleve && (
                                        <div id="eleveSelectGroup" style={{padding: '10px 16px', background: 'var(--bg-color)', borderRadius: '10px', border: '1.5px solid var(--border-color)'}}>
                                            <label htmlFor="bull_eleve" style={{fontSize: '14px', fontWeight: 500}}>Élève :</label>
                                            <select id="bull_eleve" className="form-select" style={{marginTop: '8px', width: '100%'}}>
                                                <option value="">— Sélectionner un élève —</option>
                                                <option value="EL-2024-001">ABALO Kossi (EL-2024-001)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions" style={{marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
                                <button type="reset" className="btn btn-secondary" onClick={() => setModeUnEleve(false)}>
                                    <i className="fas fa-times"></i> Réinitialiser
                                </button>
                                <button type="button" className="btn btn-outline" onClick={() => setShowApercuPopup(true)}>
                                    <i className="fas fa-eye"></i> Aperçu
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => alert("Génération des bulletins...")}>
                                    <i className="fas fa-print"></i> Générer & Imprimer
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Historique bulletins générés */}
                    <div className="table-card" style={{marginTop: '24px'}}>
                        <div className="table-header">
                            <h3>Bulletins récemment générés</h3>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Élève / Classe</th>
                                        <th>Période</th>
                                        <th>Moyenne</th>
                                        <th>Date de génération</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="bulletinsHistorique">
                                    <tr>
                                        <td colSpan={5} style={{textAlign: 'center', padding: '32px', color: 'var(--text-muted)'}}>
                                            <i className="fas fa-inbox" style={{fontSize: '28px', marginBottom: '8px', display: 'block', opacity: 0.3}}></i>
                                            Aucun bulletin généré pour le moment.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 3 – DÉLIBÉRATION */}
            {activeTab === 'deliberation' && (
                <div className="feature-section active" id="deliberation">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Délibération</h3>
                            <p>Validez les décisions : admission, passage, redoublement</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn btn-primary" onClick={() => setShowDelibPopup(true)}>
                                <i className="fas fa-gavel"></i> Valider la délibération
                            </button>
                        </div>
                    </div>

                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Classe :</label>
                            <select className="form-select" id="delib_classe">
                                <option value="3A">3ème A</option>
                                <option value="3B">3ème B</option>
                                <option value="4A">4ème A</option>
                                <option value="5A">5ème A</option>
                                <option value="6A">6ème A</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Année scolaire :</label>
                            <select className="form-select">
                                <option>2023-2024</option>
                                <option>2024-2025</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-card">
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Élève</th>
                                        <th>Matricule</th>
                                        <th>Moy. T1</th>
                                        <th>Moy. T2</th>
                                        <th>Moy. T3</th>
                                        <th>Moy. Annuelle</th>
                                        <th>Décision</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>ABALO Kossi</td><td>EL-2024-001</td>
                                        <td>16.5</td><td>17.4</td><td>18.2</td>
                                        <td><strong>17.4</strong></td>
                                        <td>
                                            <select className="form-select" style={{minWidth: '130px'}} defaultValue="Admis(e)">
                                                <option>Admis(e)</option>
                                                <option>Passage en classe sup.</option>
                                                <option>Redoublement</option>
                                                <option>Exclusion</option>
                                            </select>
                                        </td>
                                        <td><button className="btn btn-small btn-success" onClick={validerEleve}>Valider</button></td>
                                    </tr>
                                    <tr>
                                        <td>AKAKPO Ama</td><td>EL-2024-002</td>
                                        <td>15.0</td><td>16.8</td><td>17.5</td>
                                        <td><strong>16.4</strong></td>
                                        <td>
                                            <select className="form-select" style={{minWidth: '130px'}} defaultValue="Admis(e)">
                                                <option>Admis(e)</option>
                                                <option>Passage en classe sup.</option>
                                                <option>Redoublement</option>
                                                <option>Exclusion</option>
                                            </select>
                                        </td>
                                        <td><button className="btn btn-small btn-success" onClick={validerEleve}>Valider</button></td>
                                    </tr>
                                    <tr>
                                        <td>KPOGO Séna</td><td>EL-2024-010</td>
                                        <td>8.2</td><td>7.5</td><td>8.8</td>
                                        <td><strong style={{color: '#f44336'}}>8.2</strong></td>
                                        <td>
                                            <select className="form-select" style={{minWidth: '130px'}} defaultValue="Redoublement">
                                                <option>Admis(e)</option>
                                                <option>Passage en classe sup.</option>
                                                <option>Redoublement</option>
                                                <option>Exclusion</option>
                                            </select>
                                        </td>
                                        <td><button className="btn btn-small btn-success" onClick={validerEleve}>Valider</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 4 – STATISTIQUES */}
            {activeTab === 'statistiques' && (
                <div className="feature-section active" id="statistiques">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Statistiques des résultats</h3>
                            <p>Analysez les performances scolaires par période et par classe</p>
                        </div>
                    </div>
                    <div className="stats-container">
                        <div className="stats-chart-container">
                            <div className="chart-container">
                                <div className="chart-header">
                                    <h3>Répartition des moyennes par classe</h3>
                                </div>
                                <div className="chart-placeholder">
                                    {/* <canvas id="resultatsChart"></canvas> */}
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)'}}>
                                        Graphique des résultats (Chart.js)
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="summary-cards">
                            <div className="summary-card">
                                <div className="summary-icon" style={{background: 'rgba(76,175,80,0.1)'}}><i className="fas fa-trophy" style={{color: '#4caf50'}}></i></div>
                                <div className="summary-info"><h4>Très Bien (≥16)</h4><h3>42 élèves</h3></div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-icon" style={{background: 'rgba(33,150,243,0.1)'}}><i className="fas fa-star" style={{color: '#2196f3'}}></i></div>
                                <div className="summary-info"><h4>Bien (14 – 15.9)</h4><h3>98 élèves</h3></div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-icon" style={{background: 'rgba(255,152,0,0.1)'}}><i className="fas fa-check" style={{color: '#ff9800'}}></i></div>
                                <div className="summary-info"><h4>Assez Bien (12 – 13.9)</h4><h3>145 élèves</h3></div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-icon" style={{background: 'rgba(244,67,54,0.1)'}}><i className="fas fa-exclamation-triangle" style={{color: '#f44336'}}></i></div>
                                <div className="summary-info"><h4>Échec (&lt; 10)</h4><h3>52 élèves</h3></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* POPUP : VALIDATION DÉLIBÉRATION */}
            {showDelibPopup && (
                <div className="popup" style={{display: 'flex'}} id="validerDelibPopup">
                    <div className="popup-content" style={{maxWidth: '480px'}}>
                        <div className="popup-header">
                            <h4><i className="fas fa-gavel"></i> &nbsp;Valider la délibération</h4>
                            <button className="popup-close" onClick={() => setShowDelibPopup(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="popup-body" style={{padding: '24px'}}>
                            <div style={{background: 'rgba(255,152,0,0.1)', borderLeft: '4px solid #ff9800', padding: '14px 18px', borderRadius: '6px', marginBottom: '16px'}}>
                                <p style={{margin: 0, fontSize: '14px'}}><i className="fas fa-exclamation-triangle" style={{color: '#ff9800'}}></i>
                                &nbsp;<strong>Attention :</strong> Cette action est irréversible. Les décisions seront définitivement enregistrées.</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="delib_motif">Observations (optionnel)</label>
                                <textarea id="delib_motif" rows={3} style={{width: '100%', resize: 'none', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: '"Poppins", sans-serif'}} placeholder="Ajouter une observation pour le procès-verbal..."></textarea>
                            </div>
                        </div>
                        <div className="popup-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDelibPopup(false)}>Annuler</button>
                            <button className="btn btn-primary" onClick={() => { setShowDelibPopup(false); alert("Délibération enregistrée avec succès"); }}>
                                <i className="fas fa-check-circle"></i> Confirmer la délibération
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* POPUP : APERÇU BULLETINS */}
            {showApercuPopup && (
                <div className="popup" style={{display: 'flex'}} id="aperçuBulletinsPopup">
                    <div className="popup-content" style={{maxWidth: '800px'}}>
                        <div className="popup-header">
                            <h4><i className="fas fa-eye"></i> &nbsp;Aperçu des bulletins</h4>
                            <button className="popup-close" onClick={() => setShowApercuPopup(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="popup-body" style={{padding: '24px'}}>
                            <div className="bulletins-preview-container" id="bulletinsPreviewContent">
                                <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                                    Simulation de l'aperçu du bulletin...
                                </div>
                            </div>
                        </div>
                        <div className="popup-footer">
                            <button className="btn btn-secondary" onClick={() => setShowApercuPopup(false)}>Fermer</button>
                            <button className="btn btn-primary" onClick={() => { setShowApercuPopup(false); alert("Impression..."); }}>
                                <i className="fas fa-print"></i> Imprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
