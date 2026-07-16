"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

// Ajout auto : helper d'entête d'authentification Bearer
const getAuthHeaders = (existingHeaders = {}) => {
    if (typeof window === 'undefined') return existingHeaders;
    const token = localStorage.getItem('skoolis_token');
    return token ? { ...existingHeaders, 'Authorization': `Bearer ${token}` } : existingHeaders;
};

export default function DashboardPage() {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        classes: 0,
        subjects: 0
    });
    const [latestStudents, setLatestStudents] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
                    headers: getAuthHeaders({
                        'Accept': 'application/json',
                    })
                });

                if (res.status === 401 || res.status === 419) {
                    console.warn("Utilisateur non authentifié (401).");
                    // window.location.href = '/connexion';
                    return;
                }

                if (!res.ok) throw new Error("Erreur de chargement des statistiques");

                const data = await res.json();
                setStats(data.stats);
                setLatestStudents(data.latest_students);
                setChartData(data.chart_data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
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
                        <h3>{loading ? '...' : stats.students}</h3>
                        <p>Élèves</p>
                    </div>
                    <div className="card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>Actifs</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: "#f3e5f5" }}>
                        <i className="fas fa-chalkboard-teacher" style={{ color: "#7b1fa2" }}></i>
                    </div>
                    <div className="card-info">
                        <h3>{loading ? '...' : stats.teachers}</h3>
                        <p>Professeurs</p>
                    </div>
                    <div className="card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>Actifs</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: "#e8f5e9" }}>
                        <i className="fas fa-chalkboard" style={{ color: "#388e3c" }}></i>
                    </div>
                    <div className="card-info">
                        <h3>{loading ? '...' : stats.classes}</h3>
                        <p>Classes</p>
                    </div>
                    <div className="card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>Actives</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: "#fff3e0" }}>
                        <i className="fas fa-book" style={{ color: "#f57c00" }}></i>
                    </div>
                    <div className="card-info">
                        <h3>{loading ? '...' : stats.subjects}</h3>
                        <p>Matières</p>
                    </div>
                    <div className="card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>Configurées</span>
                    </div>
                </div>
            </div>

            {/* Charts and Tables */}
            <div className="content-row">
                <div className="chart-container">
                    <div className="chart-header">
                        <h3>Évolution des inscriptions ({new Date().getFullYear()})</h3>
                        <select className="form-select" defaultValue="Cette année">
                            <option>Cette année</option>
                            <option>L'année dernière</option>
                            <option>Les 5 dernières années</option>
                        </select>
                    </div>
                    <div className="chart-placeholder" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card-bg)', marginTop: '20px' }}>
                        {loading ? (
                            <p style={{color: 'var(--text-light)'}}>Chargement du graphique...</p>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="var(--text-light)" fontSize={12} />
                                    <YAxis stroke="var(--text-light)" fontSize={12} allowDecimals={false} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="enrollments" name="Inscriptions" stroke="var(--primary-color)" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="placeholder-text">
                                <p>Aucune donnée disponible</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="quick-actions">
                    <div className="section-header">
                        <h3>Actions rapides</h3>
                    </div>
                    <div className="actions-grid">
                        <Link href="/dashboard/students" className="action-btn">
                            <i className="fas fa-user-plus"></i>
                            <span>Ajouter un élève</span>
                        </Link>
                        <a href="/dashboard/notes" className="action-btn">
                            <i className="fas fa-edit"></i>
                            <span>Saisir des notes</span>
                        </a>
                        <a href="/dashboard/classes" className="action-btn">
                            <i className="fas fa-layer-group"></i>
                            <span>Créer une classe</span>
                        </a>
                        <a href="/dashboard/ecolage" className="action-btn">
                            <i className="fas fa-money-check"></i>
                            <span>Paiements d'Ecolage</span>
                        </a>
                        <a href="#" className="action-btn">
                            <i className="fas fa-file-export"></i>
                            <span>Exporter résultats</span>
                        </a>
                        <a href="/dashboard/teachers" className="action-btn">
                            <i className="fas fa-user-tie"></i>
                            <span>Ajouter professeur</span>
                        </a>
                        <a href="/dashboard/aide" className="action-btn">
                            <i className="fas fa-question-circle"></i>
                            <span>Support & Aide</span>
                        </a>
                    </div>
                </div>

                <div className="table-container">
                    <div className="table-header">
                        <h3>Dernières inscriptions</h3>
                        <Link href="/dashboard/students" className="btn-view-all">Voir tout</Link>
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
                            {loading && <tr><td colSpan={4} style={{textAlign:'center', padding:'20px'}}>Chargement...</td></tr>}
                            {!loading && latestStudents.length === 0 && (
                                <tr><td colSpan={4} style={{textAlign:'center', padding:'20px', color:'var(--text-light)'}}>Aucune inscription récente</td></tr>
                            )}
                            {!loading && latestStudents.map(student => (
                                <tr key={student.id}>
                                    <td>
                                        <div className="student-info">
                                            <div className="avatar" style={{width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', overflow: 'hidden'}}>
                                                {student.photo_path ? (
                                                    <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000'}/storage/${student.photo_path}`} alt="Photo" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                                ) : (
                                                    <i className="fas fa-user text-muted"></i>
                                                )}
                                            </div>
                                            <div>
                                                <p className="student-name">{student.first_name} {student.last_name}</p>
                                                <p className="student-id">{student.registration_number ? `#${student.registration_number}` : <span style={{fontSize:'0.8em', fontStyle:'italic'}}>Géré auto.</span>}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{student.enrollments?.[0]?.school_class?.name || '-'}</td>
                                    <td>{new Date(student.created_at).toLocaleDateString('fr-FR')}</td>
                                    <td>
                                        <span className={`status ${student.status === 'inactif' ? 'inactive' : 'active'}`}>
                                            {student.status === 'inactif' ? 'Inactif' : 'Actif'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="main-footer">
                <p>© {new Date().getFullYear()} Skoolis - School Management System. Created by Skoolis Technologies.</p>
                <div className="footer-links">
                    <a href="#">Confidentialité</a>
                    <a href="#">Conditions d'utilisation</a>
                    <a href="/dashboard/aide">Aide</a>
                    <a href="#">Contact</a>
                </div>
            </footer>
        </>
    );
}
