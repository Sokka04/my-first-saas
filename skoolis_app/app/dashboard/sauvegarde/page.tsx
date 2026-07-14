"use client";

import Link from "next/link";

export default function SauvegardePage() {
    return (
        <>
            <style jsx>{`
                @keyframes pulse-icon {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.25); }
                    50% { transform: scale(1.04); box-shadow: 0 0 0 12px rgba(76, 175, 80, 0); }
                }
            `}</style>

            <div className="page-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', padding: '40px 20px'}}>
                <div style={{textAlign: 'center', maxWidth: '600px'}}>
                    <div style={{
                        width: '120px', height: '120px',
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.12), rgba(76, 175, 80, 0.25))',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 32px',
                        border: '3px solid rgba(76, 175, 80, 0.3)',
                        animation: 'pulse-icon 2.5s infinite'
                    }}>
                        <i className="fas fa-floppy-disk" style={{fontSize: '52px', color: '#4caf50'}}></i>
                    </div>

                    <h2 style={{fontSize: '28px', color: 'var(--text-color)', marginBottom: '12px'}}>
                        Gestion des Sauvegardes
                    </h2>
                    <p style={{fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px'}}>
                        Interface de sauvegarde manuelle et de restauration des données de la base de données SQLite locale.
                    </p>

                    <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                        <button className="btn btn-primary" onClick={() => alert("Sauvegarde locale initiée...")}>
                            <i className="fas fa-download"></i>
                            Créer une sauvegarde locale
                        </button>
                        <Link href="/dashboard" className="btn btn-secondary">
                            <i className="fas fa-arrow-left"></i>
                            Retour
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
