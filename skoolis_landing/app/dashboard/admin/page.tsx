'use client';
import { useState } from 'react';

export default function AdminPage() {
    return (
        <>


            <div className="page-actions">
                <button className="btn btn-primary" id="addAdminBtn">
                    <i className="fas fa-plus"></i>
                    Ajouter un Profil de Connexion
                </button>
                <div className="action-buttons">
                    <button className="btn btn-secondary" id="exportBtn">
                        <i className="fas fa-file-export"></i>
                        Exporter
                    </button>
                    <button className="btn btn-secondary" id="filterBtn">
                        <i className="fas fa-filter"></i>
                        Filtres
                    </button>
                </div>
            </div>

            <div className="stats-cards">
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#e3f2fd' }}>
                        <i className="fas fa-user-shield" style={{ color: '#1976d2' }}></i>
                    </div>
                    <div className="card-info">
                        <h3>8</h3>
                        <p>Administrateurs Actifs</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#f3e5f5' }}>
                        <i className="fas fa-user-clock" style={{ color: '#7b1fa2' }}></i>
                    </div>
                    <div className="card-info">
                        <h3>2</h3>
                        <p>Administrateurs Inactifs</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#e8f5e9' }}>
                        <i className="fas fa-crown" style={{ color: '#388e3c' }}></i>
                    </div>
                    <div className="card-info">
                        <h3>1</h3>
                        <p>Super Administrateur</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#fff3e0' }}>
                        <i className="fas fa-history" style={{ color: '#f57c00' }}></i>
                    </div>
                    <div className="card-info">
                        <h3>24h</h3>
                        <p>Dernière connexion</p>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3>Liste des Administrateurs</h3>
                    <div className="table-actions">
                        <div className="records-count">
                            <span id="adminCount">10 administrateurs trouvés</span>
                        </div>
                        <select className="form-select" id="roleFilter">
                            <option value="all">Tous les rôles</option>
                            <option value="super">Super Admin</option>
                            <option value="principal">Admin Principal</option>
                            <option value="secondary">Admin Secondaire</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" id="selectAll" />
                                </th>
                                <th>Nom Complet</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Téléphone</th>
                                <th>Date de création</th>
                                <th>Dernière connexion</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="adminTableBody">
                            <tr>
                                <td>
                                    <input type="checkbox" className="row-checkbox" />
                                </td>
                                <td>
                                    <div className="user-info">
                                        <div>
                                            <p className="user-name">Jean Dupont</p>
                                            <p className="user-title">Super Admin</p>
                                        </div>
                                    </div>
                                </td>
                                <td>jean.dupont@skoolis.com</td>
                                <td><span className="role-badge super-admin">Super Admin</span></td>
                                <td>+237 6XX XX XX XX</td>
                                <td>15/01/2023</td>
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
                                        <button className="action-btn delete-btn" title="Supprimer">
                                            <i className="fas fa-trash"></i>
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
                    <button className="pagination-btn">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                    <div className="pagination-info">
                        <span>Page 1 sur 3</span>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="section-header">
                    <h3>Permissions par Rôle</h3>
                    <button className="btn btn-secondary" id="editPermissionsBtn">
                        <i className="fas fa-edit"></i>
                        Modifier les permissions
                    </button>
                </div>

                <div className="permissions-grid">
                    <div className="permission-card">
                        <div className="permission-header">
                            <h4>Super Admin</h4>
                            <span className="permission-count">Toutes permissions</span>
                        </div>
                        <ul className="permission-list">
                            <li><i className="fas fa-check-circle"></i> Accès complet au système</li>
                            <li><i className="fas fa-check-circle"></i> Création d'administrateurs</li>
                            <li><i className="fas fa-check-circle"></i> Modifier toutes les configurations</li>
                            <li><i className="fas fa-check-circle"></i> Supprimer n'importe quel compte</li>
                        </ul>
                    </div>

                    <div className="permission-card">
                        <div className="permission-header">
                            <h4>Admin Principal</h4>
                            <span className="permission-count">15 permissions</span>
                        </div>
                        <ul className="permission-list">
                            <li><i className="fas fa-check-circle"></i> Gestion des élèves et professeurs</li>
                            <li><i className="fas fa-check-circle"></i> Gestion des classes et matières</li>
                            <li><i className="fas fa-check-circle"></i> Accès à la comptabilité</li>
                            <li><i className="fas fa-check-circle"></i> Génération de rapports</li>
                        </ul>
                    </div>

                    <div className="permission-card">
                        <div className="permission-header">
                            <h4>Admin Secondaire</h4>
                            <span className="permission-count">8 permissions</span>
                        </div>
                        <ul className="permission-list">
                            <li><i className="fas fa-check-circle"></i> Saisie des notes</li>
                            <li><i className="fas fa-check-circle"></i> Consultation des données</li>
                            <li><i className="fas fa-check-circle"></i> Gestion des absences</li>
                            <li><i className="fas fa-check-circle"></i> Édition limitée</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
