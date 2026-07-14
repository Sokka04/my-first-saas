"use client";

import Link from "next/link";

export default function AidePage() {
    return (
        <>
            <style jsx>{`
                @keyframes pulse-icon {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.25); }
                    50% { transform: scale(1.04); box-shadow: 0 0 0 12px rgba(33, 150, 243, 0); }
                }
            `}</style>

            <div className="page-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', padding: '40px 20px'}}>
                <div style={{textAlign: 'center', maxWidth: '600px'}}>
                    <div style={{
                        width: '120px', height: '120px',
                        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.25))',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 32px',
                        border: '3px solid rgba(33, 150, 243, 0.3)',
                        animation: 'pulse-icon 2.5s infinite'
                    }}>
                        <i className="fas fa-question-circle" style={{fontSize: '52px', color: '#2196f3'}}></i>
                    </div>

                    <h2 style={{fontSize: '28px', color: 'var(--text-color)', marginBottom: '12px'}}>
                        Aide & Support
                    </h2>
                    <p style={{fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px'}}>
                        Le centre d'aide complet avec la documentation utilisateur, les tutoriels vidéo et le support technique sera bientôt disponible.
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
                        <h4 style={{margin: '0 0 16px', color: '#2196f3'}}>
                            <i className="fas fa-life-ring"></i>
                            En cas d'urgence
                        </h4>
                        <p style={{margin: 0, fontSize: '14px', color: 'var(--text-muted)'}}>
                            Veuillez contacter le support technique Skoolis directement à l'adresse <strong>support@skoolis.com</strong> ou par téléphone au <strong>+228 90 00 00 00</strong>.
                        </p>
                    </div>

                    <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                        <Link href="/dashboard" className="btn btn-secondary">
                            <i className="fas fa-arrow-left"></i>
                            Retour au Tableau de bord
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
