'use client';
import { useState } from 'react';

export default function ConfigurationPage() {
    const [activeTab, setActiveTab] = useState('school');

    return (
        <>


            <div className="config-tabs">
                <button 
                    className={`config-tab ${activeTab === 'school' ? 'active' : ''}`}
                    onClick={() => setActiveTab('school')}
                >
                    <i className="fas fa-school"></i>
                    <span>Configuration Scolaire</span>
                </button>
                <button 
                    className={`config-tab ${activeTab === 'system' ? 'active' : ''}`}
                    onClick={() => setActiveTab('system')}
                >
                    <i className="fas fa-cogs"></i>
                    <span>Configuration Système</span>
                </button>
            </div>

            {activeTab === 'school' && (
                <div className="config-section active" id="school-config">
                    <div className="config-header">
                        <h3><i className="fas fa-school"></i> Configuration Scolaire</h3>
                        <p>Gérez les paramètres relatifs à l'établissement et à l'année scolaire</p>
                    </div>

                    <div className="config-grid">
                        {/* Année Scolaire */}
                        <div className="config-card">
                            <div className="config-card-header">
                                <h4><i className="fas fa-calendar-alt"></i> Année Scolaire</h4>
                                <span className="config-badge">Obligatoire</span>
                            </div>
                            <div className="config-card-body">
                                <div className="form-group">
                                    <label htmlFor="newSchoolYear">Créer une nouvelle année scolaire</label>
                                    <div className="input-group">
                                        <input type="text" id="newSchoolYear" placeholder="Ex: 2024-2025" className="form-control" />
                                    </div>
                                    <br />
                                    <button className="btn btn-primary" id="createSchoolYear">
                                        <i className="fas fa-plus"></i> Ajouter l'année scolaire
                                    </button>
                                    <p className="help-text">L'année scolaire doit être au format "AAAA-AAAA"</p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="schoolYear">Année scolaire actuelle</label>
                                    <select id="schoolYear" className="form-control" defaultValue="2023-2024">
                                        <option value="2023-2024">2023-2024</option>
                                        <option value="2024-2025">2024-2025</option>
                                        <option value="2025-2026">2025-2026</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Périodes de l'année scolaire</label>
                                    <div className="periods-list" id="periodsList">
                                        <div className="period-item">
                                            <span>1er Trimestre</span>
                                            <span className="period-dates">09/2023 - 12/2023</span>
                                        </div>
                                        <div className="period-item">
                                            <span>2ème Trimestre</span>
                                            <span className="period-dates">01/2024 - 03/2024</span>
                                        </div>
                                        <div className="period-item">
                                            <span>3ème Trimestre</span>
                                            <span className="period-dates">04/2024 - 06/2024</span>
                                        </div>
                                    </div>

                                    <button className="btn btn-secondary" id="managePeriods">
                                        <i className="fas fa-calendar-plus"></i> Gérer les périodes
                                    </button>
                                </div>

                                <div className="form-group">
                                    <label>Passage des élèves</label>
                                    <div className="form-actions">
                                        <button className="btn btn-secondary" id="manualPromotion">
                                            <i className="fas fa-user-graduate"></i> Passer les élèves manuellement
                                        </button>
                                        <p className="help-text">Permet de contrôler individuellement le passage des élèves</p>
                                    </div>
                                </div>

                                <button className="btn btn-primary">
                                    <i className="fas fa-save"></i> Enregistrer
                                </button>
                            </div>
                        </div>

                        {/* Informations Établissement */}
                        <div className="config-card">
                            <div className="config-card-header">
                                <h4><i className="fas fa-university"></i> Informations Établissement</h4>
                                <span className="config-badge warning">Modification limitée</span>
                            </div>
                            <div className="config-card-body">
                                <div className="logo-upload">
                                    <div className="logo-preview">
                                        <img src="/assets/images/logo-placeholder.png" alt="Logo établissement" id="schoolLogo" />
                                    </div>
                                    <div className="logo-controls">
                                        <button className="btn btn-secondary" id="uploadLogo">
                                            <i className="fas fa-upload"></i> Changer le logo
                                        </button>
                                        <p className="help-text">Format recommandé: PNG, JPG, JPEG</p>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="schoolName">Nom de l'établissement</label>
                                    <input type="text" id="schoolName" defaultValue="Notre Dame de la Trinité" className="form-control" readOnly />
                                    <p className="help-text warning">
                                        <i className="fas fa-exclamation-triangle"></i> Modifiable une seule fois après contact du support
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="schoolMinistere">Ministère de tutelle</label>
                                    <input type="text" id="schoolMinistere" defaultValue="Ministère de l'Éducation Nationale" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="schoolBP">Boîte Postale (BP)</label>
                                    <input type="text" id="schoolBP" defaultValue="1234" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="schoolPhone">Téléphone</label>
                                    <input type="tel" id="schoolPhone" defaultValue="+237 6XX XXX XXX" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="schoolAddress">Adresse complète</label>
                                    <textarea id="schoolAddress" className="form-control" rows={3} defaultValue="Quartier Bastos, Yaoundé, Cameroun"></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="schoolDirector">Chef d'établissement / Proviseur</label>
                                    <input type="text" id="schoolDirector" defaultValue="Père Jean Dupont" className="form-control" readOnly />
                                    <p className="help-text warning">
                                        <i className="fas fa-exclamation-triangle"></i> Modifiable une seule fois
                                    </p>
                                </div>

                                <button className="btn btn-primary">
                                    <i className="fas fa-save"></i> Enregistrer
                                </button>
                            </div>
                        </div>

                        {/* Règles de Passage */}
                        <div className="config-card">
                            <div className="config-card-header">
                                <h4><i className="fas fa-graduation-cap"></i> Règles de Passage</h4>
                                <span className="config-badge">Important</span>
                            </div>
                            <div className="config-card-body">
                                <div className="form-group">
                                    <label htmlFor="passingAverage">Moyenne minimale de passage</label>
                                    <div className="input-with-unit">
                                        <input type="number" id="passingAverage" defaultValue="10" min="6" max="20" step="0.5" className="form-control" />
                                        <span className="input-unit">/20</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="maxFailingSubjects">Nombre maximal de matières en échec (optionnel)</label>
                                    <input type="number" id="maxFailingSubjects" defaultValue="8" min="0" max="10" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label>Critères supplémentaires (optionnel)</label>
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input type="checkbox" defaultChecked />
                                            <span>Assiduité requise (≥ 80%)</span>
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" defaultChecked />
                                            <span>Notes de conduite considérées</span>
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" />
                                            <span>Projet de fin d'année obligatoire</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="passingRules">Règles personnalisées</label>
                                    <textarea id="passingRules" className="form-control" rows={4} placeholder="Ajoutez des règles spécifiques..."></textarea>
                                </div>

                                <button className="btn btn-primary">
                                    <i className="fas fa-save"></i> Appliquer les règles
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'system' && (
                <div className="config-section active" id="system-config">
                    <div className="config-header">
                        <h3><i className="fas fa-cogs"></i> Configuration Système</h3>
                        <p>Paramètres généraux et maintenance du logiciel</p>
                    </div>

                    <div className="config-grid">
                        <div className="config-card">
                            <div className="config-card-header">
                                <h4><i className="fas fa-clock"></i> Date et Heure</h4>
                                <span className="config-badge">Synchronisé</span>
                            </div>
                            <div className="config-card-body">
                                <div className="current-time">
                                    <div className="time-display">
                                        <i className="fas fa-clock"></i>
                                        <span id="currentTime">12:30:00</span>
                                    </div>
                                    <div className="date-display">
                                        <i className="fas fa-calendar"></i>
                                        <span id="currentDate">12/07/2024</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="timezone">Fuseau horaire actuelle</label>
                                    <select id="timezone" className="form-control" defaultValue="UTC+0">
                                        <option value="UTC+1">UTC+1 (Afrique de l'Ouest)</option>
                                        <option value="UTC+0">UTC+0 (GMT)</option>
                                        <option value="UTC+2">UTC+2 (Afrique Centrale)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="dateFormat">Format de date</label>
                                    <select id="dateFormat" className="form-control" defaultValue="dd/mm/yyyy">
                                        <option value="dd/mm/yyyy">JJ/MM/AAAA</option>
                                        <option value="mm/dd/yyyy">MM/JJ/AAAA</option>
                                        <option value="yyyy-mm-dd">AAAA-MM-JJ</option>
                                    </select>
                                </div>

                                <button className="btn btn-primary">
                                    <i className="fas fa-sync"></i> Synchroniser
                                </button>
                            </div>
                        </div>

                        <div className="config-card">
                            <div className="config-card-header">
                                <h4><i className="fas fa-palette"></i> Thème et Apparence</h4>
                                <span className="config-badge">Personnalisable</span>
                            </div>
                            <div className="config-card-body">
                                <div className="form-group">
                                    <label htmlFor="theme">Thème du système</label>
                                    <select id="theme" className="form-control" defaultValue="light">
                                        <option value="light">Blanc</option>
                                        <option value="dark">Sombre</option>
                                        <option value="purple">Violet Skoolis</option>
                                        <option value="blue">Bleu Professionnel</option>
                                        <option value="green">Vert Émeraude</option>
                                    </select>
                                </div>

                                <div className="theme-preview">
                                    <div className="theme-option active" data-theme="light">
                                        <div className="theme-color" style={{ background: 'linear-gradient(135deg, #ffffff, #f5f5f5)' }}></div>
                                        <span>Blanc</span>
                                    </div>
                                    <div className="theme-option" data-theme="purple">
                                        <div className="theme-color" style={{ background: 'linear-gradient(135deg, #7b1fa2, #9c27b0)' }}></div>
                                        <span>Violet Skoolis</span>
                                    </div>
                                    <div className="theme-option" data-theme="dark">
                                        <div className="theme-color" style={{ background: 'linear-gradient(135deg, #121212, #333)' }}></div>
                                        <span>Sombre</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="language">Langue du système</label>
                                    <select id="language" className="form-control" defaultValue="fr">
                                        <option value="fr">Français</option>
                                        <option value="en">Anglais</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="currency">Devise du système</label>
                                    <select id="currency" className="form-control" defaultValue="XAF">
                                        <option value="XAF">FCFA (XOF)</option>
                                        <option value="EUR">Euro (€)</option>
                                        <option value="USD">Dollar US ($)</option>
                                        <option value="CAD">Dollar Canadien (C$)</option>
                                    </select>
                                </div>

                                <button className="btn btn-primary">
                                    <i className="fas fa-check"></i> Appliquer
                                </button>
                            </div>
                        </div>

                        <div className="config-card">
                            <div className="config-card-header">
                                <h4><i className="fas fa-database"></i> Base de données</h4>
                                <span className="config-badge warning">Administrateur</span>
                            </div>
                            <div className="config-card-body">
                                <div className="db-info">
                                    <div className="info-item">
                                        <span className="info-label">Taille de la base</span>
                                        <span className="info-value">245.7 MB</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Dernière sauvegarde</span>
                                        <span className="info-value">Hier, 22:30</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Statut</span>
                                        <span className="info-value success">Connecté</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-secondary" id="loadOldDB">
                                        <i className="fas fa-upload"></i> Charger ancienne base
                                    </button>
                                    <p className="help-text">
                                        <i className="fas fa-info-circle"></i> Lecture seule - Déconnexion requise
                                    </p>
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-secondary" id="clearCache">
                                        <i className="fas fa-broom"></i> Vider le cache
                                    </button>
                                    <span className="cache-size">(87.3 MB)</span>
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-danger" id="resetApp">
                                        <i className="fas fa-exclamation-triangle"></i> Réinitialiser
                                    </button>
                                    <p className="help-text danger">
                                        <i className="fas fa-radiation"></i> Action irréversible - Triple confirmation requise
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="config-card">
                            <div className="config-card-header">
                                <h4><i className="fas fa-software"></i> Mise à jour du logiciel</h4>
                                <span className="config-badge">Recommandé</span>
                            </div>
                            <div className="config-card-body">
                                <div className="update-info">
                                    <div className="info-item">
                                        <span className="info-label">Version actuelle</span>
                                        <span className="info-value">1.0.0</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Description</span>
                                        <span className="info-value">Mise à jour de sécurité...</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Auteur</span>
                                        <span className="info-value">Skoolis Technologies</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Dernière mise à jour</span>
                                        <span className="info-value">Il y a 2 jours</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary">
                                        <i className="fas fa-download"></i> Mettre à jour
                                    </button>

                                    <button className="btn btn-secondary" id="checkUpdates">
                                        <i className="fas fa-sync"></i> Vérifier les mises à jour
                                    </button>
                                </div>
                                <div className="update-notification success">
                                    <i className="fas fa-check-circle"></i>
                                    <span>Votre logiciel est à jour !</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
