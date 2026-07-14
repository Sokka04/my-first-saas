"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BEPCBlancPage() {
    const [showComingSoon, setShowComingSoon] = useState(false);

    useEffect(() => {
        // Auto-show popup on load
        setTimeout(() => {
            setShowComingSoon(true);
        }, 500);
    }, []);

    return (
        <>
            <style jsx>{`
                @keyframes pulse-bepc {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(123,31,162,0.25); }
                    50% { transform: scale(1.04); box-shadow: 0 0 0 12px rgba(123,31,162,0); }
                }
                @keyframes blink-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.2; }
                }
            `}</style>

            {/* Page de présentation BEPC Blanc */}
            <div className="page-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', padding: '40px 20px'}}>
                <div style={{textAlign: 'center', maxWidth: '600px'}}>
                    {/* Icône animée */}
                    <div style={{
                        width: '120px', height: '120px',
                        background: 'linear-gradient(135deg, rgba(123,31,162,0.12), rgba(123,31,162,0.25))',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 32px',
                        border: '3px solid rgba(123,31,162,0.3)',
                        animation: 'pulse-bepc 2.5s infinite'
                    }}>
                        <i className="fas fa-graduation-cap" style={{fontSize: '52px', color: 'var(--primary-color)'}}></i>
                    </div>

                    <h2 style={{fontSize: '28px', color: 'var(--text-color)', marginBottom: '12px'}}>
                        Module BEPC Blanc
                    </h2>
                    <p style={{fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px'}}>
                        Ce module permettra d'organiser et gérer les examens blancs du BEPC pour votre établissement.
                        Il est actuellement en cours de développement et sera disponible prochainement.
                    </p>

                    {/* Fonctionnalités à venir */}
                    <div style={{
                        background: 'var(--white)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '24px',
                        textAlign: 'left',
                        marginBottom: '32px',
                        boxShadow: 'var(--box-shadow)'
                    }}>
                        <h4 style={{margin: '0 0 16px', color: 'var(--primary-color)'}}>
                            <i className="fas fa-list-check"></i>
                            Fonctionnalités prévues
                        </h4>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px dashed var(--border-color)'}}>
                                <i className="fas fa-clock" style={{color: '#ff9800', width: '18px'}}></i>
                                <span style={{fontSize: '14px'}}>Planification des sessions d'examen</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px dashed var(--border-color)'}}>
                                <i className="fas fa-clock" style={{color: '#ff9800', width: '18px'}}></i>
                                <span style={{fontSize: '14px'}}>Génération de numéros de table</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px dashed var(--border-color)'}}>
                                <i className="fas fa-clock" style={{color: '#ff9800', width: '18px'}}></i>
                                <span style={{fontSize: '14px'}}>Saisie des notes par matière</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px dashed var(--border-color)'}}>
                                <i className="fas fa-clock" style={{color: '#ff9800', width: '18px'}}></i>
                                <span style={{fontSize: '14px'}}>Classement et résultats BEPC</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0'}}>
                                <i className="fas fa-clock" style={{color: '#ff9800', width: '18px'}}></i>
                                <span style={{fontSize: '14px'}}>Génération de convocations</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0'}}>
                                <i className="fas fa-clock" style={{color: '#ff9800', width: '18px'}}></i>
                                <span style={{fontSize: '14px'}}>Statistiques et taux de réussite</span>
                            </div>
                        </div>
                    </div>

                    {/* Badge "En développement" */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        background: 'rgba(255,152,0,0.1)',
                        border: '1px solid rgba(255,152,0,0.4)',
                        borderRadius: '30px',
                        padding: '10px 24px',
                        marginBottom: '28px'
                    }}>
                        <span style={{width: '10px', height: '10px', background: '#ff9800', borderRadius: '50%', animation: 'blink-dot 1.2s infinite'}}></span>
                        <span style={{color: '#e65100', fontWeight: 600, fontSize: '14px'}}>Module en développement</span>
                    </div>

                    <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                        <button className="btn btn-primary" onClick={() => setShowComingSoon(true)}>
                            <i className="fas fa-info-circle"></i>
                            Plus d'informations
                        </button>
                        <Link href="/dashboard/resultats" className="btn btn-secondary">
                            <i className="fas fa-arrow-left"></i>
                            Retour aux Résultats
                        </Link>
                    </div>
                </div>
            </div>

            {/* Popup BEPC Blanc Coming Soon */}
            {showComingSoon && (
                <div className="popup" style={{display: 'flex'}} id="bepcComingSoonPopup">
                    <div className="popup-content" style={{maxWidth: '480px'}}>
                        <div className="popup-header" style={{background: 'linear-gradient(135deg, #7b1fa2, #9c27b0)', color: 'white', borderRadius: '8px 8px 0 0'}}>
                            <h4 style={{color: 'white'}}>
                                <i className="fas fa-graduation-cap"></i>
                                Module BEPC Blanc
                            </h4>
                            <button className="popup-close" onClick={() => setShowComingSoon(false)} style={{color: 'white'}}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="popup-body" style={{padding: '28px'}}>
                            {/* Icône centrale */}
                            <div style={{textAlign: 'center', marginBottom: '20px'}}>
                                <div style={{
                                    width: '72px', height: '72px',
                                    background: 'linear-gradient(135deg, #7b1fa2, #9c27b0)',
                                    borderRadius: '50%',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <i className="fas fa-tools" style={{fontSize: '28px', color: 'white'}}></i>
                                </div>
                                <h3 style={{color: 'var(--primary-color)', margin: '0 0 8px'}}>Fonctionnalité en cours de développement</h3>
                                <p style={{color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, margin: 0}}>
                                    Le module <strong>BEPC Blanc</strong> est actuellement en développement par l'équipe Skoolis.
                                    Il sera disponible dans une prochaine mise à jour de l'application.
                                </p>
                            </div>

                            <div style={{background: 'rgba(123,31,162,0.06)', borderRadius: '8px', padding: '16px', marginBottom: '16px'}}>
                                <p style={{margin: '0 0 8px', fontWeight: 600, fontSize: '13px', color: 'var(--primary-color)'}}>
                                    <i className="fas fa-calendar-check"></i> Disponibilité prévue
                                </p>
                                <p style={{margin: 0, fontSize: '13px', color: 'var(--text-muted)'}}>
                                    Ce module sera intégré lors de la prochaine version majeure de Skoolis.
                                    Vous serez notifié automatiquement dès sa disponibilité.
                                </p>
                            </div>

                            <div style={{background: 'rgba(33,150,243,0.06)', borderRadius: '8px', padding: '16px'}}>
                                <p style={{margin: '0 0 8px', fontWeight: 600, fontSize: '13px', color: '#1565c0'}}>
                                    <i className="fas fa-lightbulb"></i> En attendant
                                </p>
                                <p style={{margin: 0, fontSize: '13px', color: 'var(--text-muted)'}}>
                                    Vous pouvez utiliser le module <Link href="/dashboard/resultats" style={{color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600}}>Résultats & Bulletins</Link>
                                    pour gérer les notes et délibérations de vos élèves.
                                </p>
                            </div>
                        </div>
                        <div className="popup-footer" style={{justifyContent: 'center'}}>
                            <Link href="/dashboard/resultats" className="btn btn-primary">
                                <i className="fas fa-poll"></i>
                                Aller aux Résultats
                            </Link>
                            <button className="btn btn-secondary" onClick={() => setShowComingSoon(false)}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
