"use client";

import Link from "next/link";

export default function MiseAJourPage() {
    return (
        <>
            <style jsx>{`
                @keyframes pulse-icon {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.25); }
                    50% { transform: scale(1.04); box-shadow: 0 0 0 12px rgba(255, 152, 0, 0); }
                }
            `}</style>

            <div className="page-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', padding: '40px 20px'}}>
                <div style={{textAlign: 'center', maxWidth: '600px'}}>
                    <div style={{
                        width: '120px', height: '120px',
                        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.12), rgba(255, 152, 0, 0.25))',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 32px',
                        border: '3px solid rgba(255, 152, 0, 0.3)',
                        animation: 'pulse-icon 2.5s infinite'
                    }}>
                        <i className="fas fa-cloud-download-alt" style={{fontSize: '52px', color: '#ff9800'}}></i>
                    </div>

                    <h2 style={{fontSize: '28px', color: 'var(--text-color)', marginBottom: '12px'}}>
                        Mise à jour & Skoolis Connect
                    </h2>
                    <p style={{fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px'}}>
                        Skoolis Connect vous permettra de synchroniser vos données avec nos serveurs cloud et de vérifier les mises à jour logicielles de votre client lourd.
                    </p>

                    <div style={{
                        background: 'var(--white)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '24px',
                        textAlign: 'left',
                        marginBottom: '32px',
                        boxShadow: 'var(--box-shadow)'
                    }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                            <h4 style={{margin: 0, color: 'var(--text-color)'}}>Version actuelle</h4>
                            <span className="badge badge-success">v1.0.0</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h4 style={{margin: 0, color: 'var(--text-color)'}}>Statut Cloud</h4>
                            <span className="badge badge-warning">Hors Ligne</span>
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                        <button className="btn btn-primary" onClick={() => alert("Recherche de mises à jour...")}>
                            <i className="fas fa-sync-alt"></i>
                            Vérifier les mises à jour
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
