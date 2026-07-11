"use client";

import { useEffect, useRef } from "react";

export default function DashboardPage() {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // We can re-initialize the charts here if needed,
        // or just rely on the global script for now.
        if (typeof window !== "undefined" && (window as any).Chart && chartRef.current) {
            // Basic initialization logic to replace charts.js for this page
            // (Assuming chart.umd.min.js is loaded)
        }
    }, []);

    return (
        <>
            {/* Stats Cards */}
            <div className="stats-cards">
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: "#e3f2fd" }}>
                        <i className="fas fa-user-graduate" style={{ color: "#1976d2" }}></i>
                    </div>
                    <div className="card-info">
                        <h3>1,245</h3>
                        <p>Élèves</p>
                    </div>
                    <div className="card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>12%</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: "#f3e5f5" }}>
                        <i className="fas fa-chalkboard-teacher" style={{ color: "#7b1fa2" }}></i>
                    </div>
                    <div className="card-info">
                        <h3>68</h3>
                        <p>Professeurs</p>
                    </div>
                    <div className="card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>5%</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: "#e8f5e9" }}>
                        <i className="fas fa-chalkboard" style={{ color: "#388e3c" }}></i>
                    </div>
                    <div className="card-info">
                        <h3>32</h3>
                        <p>Classes</p>
                    </div>
                    <div className="card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>8%</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: "#fff3e0" }}>
                        <i className="fas fa-book" style={{ color: "#f57c00" }}></i>
                    </div>
                    <div className="card-info">
                        <h3>14</h3>
                        <p>Matières</p>
                    </div>
                    <div className="card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>3%</span>
                    </div>
                </div>
            </div>

            {/* Charts and Tables */}
            <div className="content-row">
                <div className="chart-container">
                    <div className="chart-header">
                        <h3>Évolution des moyennes générales</h3>
                        <select className="form-select" defaultValue="Cette année">
                            <option>Cette année</option>
                            <option>L'année dernière</option>
                            <option>Les 5 dernières années</option>
                        </select>
                    </div>
                    <div className="chart-placeholder">
                        <canvas id="gradesChart" ref={chartRef}></canvas>
                        <div className="placeholder-text">
                            <p>Graphique des moyennes générales par classe</p>
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <div className="section-header">
                        <h3>Actions rapides</h3>
                    </div>
                    <div className="actions-grid">
                        <a href="/dashboard/students" className="action-btn">
                            <i className="fas fa-user-plus"></i>
                            <span>Ajouter un élève</span>
                        </a>
                        <a href="/app/notes" className="action-btn">
                            <i className="fas fa-edit"></i>
                            <span>Saisir des notes</span>
                        </a>
                        <a href="/app/classes" className="action-btn">
                            <i className="fas fa-layer-group"></i>
                            <span>Créer une classe</span>
                        </a>
                        <a href="/app/ecolage" className="action-btn">
                            <i className="fas fa-money-check"></i>
                            <span>Paiements d'Ecolage</span>
                        </a>
                        <a href="#" className="action-btn">
                            <i className="fas fa-file-export"></i>
                            <span>Exporter résultats</span>
                        </a>
                        <a href="/app/professeurs" className="action-btn">
                            <i className="fas fa-user-tie"></i>
                            <span>Ajouter professeur</span>
                        </a>
                        <a href="/app/aide" className="action-btn">
                            <i className="fas fa-question-circle"></i>
                            <span>Support & Aide</span>
                        </a>
                    </div>
                </div>

                <div className="table-container">
                    <div className="table-header">
                        <h3>Dernières inscriptions</h3>
                        <a href="#" className="btn-view-all">Voir tout</a>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Classe</th>
                                <th>Date d'inscription</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="student-info">
                                        <div>
                                            <p className="student-name">Marie Kamga</p>
                                            <p className="student-id">#STD-2023-045</p>
                                        </div>
                                    </div>
                                </td>
                                <td>3ème A</td>
                                <td>15/09/2023</td>
                                <td><span className="status active">Actif</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="student-info">
                                        <div>
                                            <p className="student-name">Jean Fotso</p>
                                            <p className="student-id">#STD-2023-046</p>
                                        </div>
                                    </div>
                                </td>
                                <td>Terminale D</td>
                                <td>14/09/2023</td>
                                <td><span className="status active">Actif</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="student-info">
                                        <div>
                                            <p className="student-name">Anne Mbappe</p>
                                            <p className="student-id">#STD-2023-047</p>
                                        </div>
                                    </div>
                                </td>
                                <td>4ème B</td>
                                <td>13/09/2023</td>
                                <td><span className="status pending">En attente</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="student-info">
                                        <div>
                                            <p className="student-name">Paul Biya</p>
                                            <p className="student-id">#STD-2023-048</p>
                                        </div>
                                    </div>
                                </td>
                                <td>1ère C</td>
                                <td>12/09/2023</td>
                                <td><span className="status active">Actif</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="student-info">
                                        <div>
                                            <p className="student-name">Claire Ngo</p>
                                            <p className="student-id">#STD-2023-049</p>
                                        </div>
                                    </div>
                                </td>
                                <td>5ème A</td>
                                <td>11/09/2023</td>
                                <td><span className="status inactive">Inactif</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Additional Info */}
                <div className="table-container">
                    <div className="upcoming-events">
                        <div className="section-header">
                            <h3>Événements à venir</h3>
                            <a href="#" className="btn-view-all">Voir tout</a>
                        </div>
                        <div className="events-list">
                            <div className="event-item">
                                <div className="event-date">
                                    <span className="event-day">25</span>
                                    <span className="event-month">SEPT</span>
                                </div>
                                <div className="event-details">
                                    <h4>Réunion des parents</h4>
                                    <p>10h00 - Salle de conférence</p>
                                </div>
                            </div>
                            <div className="event-item">
                                <div className="event-date">
                                    <span className="event-day">28</span>
                                    <span className="event-month">SEPT</span>
                                </div>
                                <div className="event-details">
                                    <h4>Examen BEPC Blanc</h4>
                                    <p>Toutes les classes de 3ème</p>
                                </div>
                            </div>
                            <div className="event-item">
                                <div className="event-date">
                                    <span className="event-day">05</span>
                                    <span className="event-month">OCT</span>
                                </div>
                                <div className="event-details">
                                    <h4>Journée sportive</h4>
                                    <p>Stade municipal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="main-footer">
                <p>© 2026 Skoolis - School Management System. Created by Skoolis Technologies.</p>
                <div className="footer-links">
                    <a href="#">Confidentialité</a>
                    <a href="#">Conditions d'utilisation</a>
                    <a href="/app/aide">Aide</a>
                    <a href="#">Contact</a>
                </div>
            </footer>
        </>
    );
}
