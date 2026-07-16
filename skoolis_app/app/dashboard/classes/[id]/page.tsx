"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ClassDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const classId = params.id as string;

    useEffect(() => {
        // Simulation d'un chargement
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [classId]);

    return (
        <div className="feature-section active">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                    onClick={() => router.back()} 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 12px', borderRadius: '8px' }}
                >
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div className="page-title" style={{ margin: 0 }}>
                    <h3>Détails de la classe</h3>
                    <p>ID de la classe : {classId}</p>
                </div>
            </div>

            <div className="bg-card border-border border" style={{ padding: '30px', borderRadius: '16px', marginTop: '20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted-foreground)' }}>
                        <i className="fas fa-spinner fa-spin fa-2x mb-3"></i>
                        <p>Chargement des informations...</p>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>
                            <i className="fas fa-tools"></i>
                        </div>
                        <h2 className="text-foreground" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Page en construction</h2>
                        <p className="text-muted-foreground" style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
                            La page de détails spécifiques pour la classe est en cours de développement. Vous pourrez bientôt y gérer les élèves, les notes et les présences.
                        </p>
                        <button onClick={() => router.back()} className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px' }}>
                            Retour à la liste des classes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
