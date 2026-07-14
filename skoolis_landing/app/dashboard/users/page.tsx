'use client';
import { useState } from 'react';

export default function UsersPage() {
    return (
        <>


            <div className="page-actions">
                <button className="btn btn-primary" id="addUserBtn">
                    <i className="fas fa-plus"></i>
                    Ajouter un Utilisateur
                </button>
                <div className="action-buttons">
                    <button className="btn btn-secondary">
                        <i className="fas fa-file-export"></i>
                        Exporter
                    </button>
                    <button className="btn btn-secondary">
                        <i className="fas fa-filter"></i>
                        Filtres
                    </button>
                    <button className="btn btn-secondary">
                        <i className="fas fa-sync-alt"></i>
                        Actualiser
                    </button>
                </div>
            </div>

            <div className="stats-cards">
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#e3f2fd' }}>
                        <i className="fas fa-users" style={{ color: '#1976d2' }}></i>
                    </div>
                    <div className="card-info">
                        <h3>85</h3>
                        <p>Utilisateurs Totaux</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#f3e5f5' }}>
                        <i className="fas fa-user-check" style={{ color: '#7b1fa2' }}></i>
                    </div>
                    <div className="card-info">
                        <h3>78</h3>
                        <p>Utilisateurs Actifs</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#e8f5e9' }}>
                        <i className="fas fa-user-clock" style={{ color: '#388e3c' }}></i>
                    </div>
                    <div className="card-info">
                        <h3>5</h3>
                        <p>En attente</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#fff3e0' }}>
                        <i className="fas fa-user-slash" style={{ color: '#f57c00' }}></i>
                    </div>
                    <div className="card-info">
                        <h3>2</h3>
                        <p>Utilisateurs Bloqués</p>
                    </div>
                </div>
            </div>

            <div className="filter-tabs">
                <button className="filter-tab active" data-type="all">
                    <i className="fas fa-users"></i>
                    Tous les Utilisateurs (85)
                </button>
                <button className="filter-tab" data-type="professors">
                    <i className="fas fa-chalkboard-teacher"></i>
                    Professeurs (45)
                </button>
                <button className="filter-tab" data-type="secretaries">
                    <i className="fas fa-user-tie"></i>
                    Secrétaires (15)
                </button>
                <button className="filter-tab" data-type="accountants">
                    <i className="fas fa-calculator"></i>
                    Comptables (8)
                </button>
                <button className="filter-tab" data-type="parents">
                    <i className="fas fa-user-friends"></i>
                    Parents (17)
                </button>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3>Liste des Utilisateurs</h3>
                    <div className="table-actions">
                        <div className="records-count">
                            <span>85 utilisateurs trouvés</span>
                        </div>
                        <select className="form-select">
                            <option>Trier par: Date d'ajout</option>
                            <option>Trier par: Nom A-Z</option>
                            <option>Trier par: Type d'utilisateur</option>
                            <option>Trier par: Statut</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" id="selectAllUsers" />
                                </th>
                                <th>Utilisateur</th>
                                <th>Type</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                                <th>Date de création</th>
                                <th>Dernière connexion</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="checkbox" className="row-checkbox" />
                                </td>
                                <td>
                                    <div className="user-info">
                                        <div>
                                            <p className="user-name">Pierre Mbappé</p>
                                            <p className="user-title">Professeur de Maths</p>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="user-type professor">Professeur</span></td>
                                <td>pierre.mbappe@skoolis.com</td>
                                <td>+237 6XX XX XX XX</td>
                                <td>10/01/2023</td>
                                <td>Il y a 2 heures</td>
                                <td><span className="status active">Actif</span></td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn edit-btn" title="Modifier">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="action-btn view-btn" title="Voir détails">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="action-btn reset-btn" title="Réinitialiser mot de passe">
                                            <i className="fas fa-key"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="checkbox" className="row-checkbox" />
                                </td>
                                <td>
                                    <div className="user-info">
                                        <div>
                                            <p className="user-name">David Fotso</p>
                                            <p className="user-title">Comptable</p>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="user-type accountant">Comptable</span></td>
                                <td>david.fotso@skoolis.com</td>
                                <td>+237 6XX XX XX XX</td>
                                <td>20/03/2023</td>
                                <td>Il y a 3 jours</td>
                                <td><span className="status active">Actif</span></td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn edit-btn" title="Modifier">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="action-btn view-btn" title="Voir détails">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="action-btn reset-btn" title="Réinitialiser mot de passe">
                                            <i className="fas fa-key"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button className="pagination-btn" disabled>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="pagination-btn active">1</button>
                    <button className="pagination-btn">2</button>
                    <button className="pagination-btn">3</button>
                    <button className="pagination-btn">4</button>
                    <button className="pagination-btn">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                    <div className="pagination-info">
                        <span>Page 1 sur 8</span>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="section-header">
                    <h3>Journal des activités récentes</h3>
                    <button className="btn btn-secondary">
                        <i className="fas fa-history"></i>
                        Voir tout l'historique
                    </button>
                </div>

                <div className="activity-log">
                    <div className="activity-item">
                        <div className="activity-icon">
                            <i className="fas fa-sign-in-alt"></i>
                        </div>
                        <div className="activity-content">
                            <p><strong>Pierre Mbappé</strong> s'est connecté au système</p>
                            <span className="activity-time">Il y a 2 heures</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">
                            <i className="fas fa-key"></i>
                        </div>
                        <div className="activity-content">
                            <p><strong>Sophie Nkeng</strong> a modifié son mot de passe</p>
                            <span className="activity-time">Il y a 1 jour</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="activity-content">
                            <p><strong>Nouvel utilisateur</strong> créé: Martine Kamga</p>
                            <span className="activity-time">Il y a 1 semaine</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">
                            <i className="fas fa-ban"></i>
                        </div>
                        <div className="activity-content">
                            <p><strong>Jean-Paul Biya</strong> a été bloqué temporairement</p>
                            <span className="activity-time">Il y a 2 semaines</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
