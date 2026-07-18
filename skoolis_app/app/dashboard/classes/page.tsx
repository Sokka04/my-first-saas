"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

// Ajout auto : helper d'entête d'authentification Bearer
const getAuthHeaders = (existingHeaders = {}) => {
    if (typeof window === 'undefined') return existingHeaders;
    const token = localStorage.getItem('skoolis_token');
    return token ? { ...existingHeaders, 'Authorization': `Bearer ${token}` } : existingHeaders;
};

const getCycleColorHex = (cycle: string) => {
    switch (cycle) {
        case 'Maternelle': return '#a855f7';
        case 'Primaire': return '#3b82f6';
        case 'Collège': return '#10b981';
        case 'Lycée': return '#f59e0b';
        case 'Crèche': return '#ec4899';
        default: return '#64748b';
    }
};

export default function ClassesPage() {
    const [activeTab, setActiveTab] = useState("liste");
    const [classes, setClasses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClassAction, setSelectedClassAction] = useState<{id: string, name: string, level: string | null, action: 'manage' | 'stats'} | null>(null);
    const [classeClickCount, setClasseClickCount] = useState(0);
    const [showCycleToast, setShowCycleToast] = useState(false);
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [validationToastMsg, setValidationToastMsg] = useState<string | null>(null);
    const [successToastMsg, setSuccessToastMsg] = useState<string | null>(null);
    const [submitFailCount, setSubmitFailCount] = useState(0);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printTarget, setPrintTarget] = useState('all');
    const [printType, setPrintType] = useState('classes_list');

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        cycle: '',
        capacity: '45',
        teacher_id: ''
    });

    const [assignForm, setAssignForm] = useState({
        class_id: '',
        teacher_id: ''
    });

    const [filterCycle, setFilterCycle] = useState("");
    const [filterLevel, setFilterLevel] = useState("");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/school-classes`, {
                headers: getAuthHeaders({ 'Accept': 'application/json' })
            });

            if (!res.ok) throw new Error("Erreur lors de la récupération des classes");

            const json = await res.json();
            setClasses(json.data || []);
        } catch(e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/teachers`, {
                headers: getAuthHeaders({ 'Accept': 'application/json' })
            });
            if (res.ok) {
                const json = await res.json();
                setTeachers(json.data || []);
            }
        } catch(e) {
            console.error("Erreur enseignants", e);
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchTeachers();
    }, []);

    const handleSave = async (e: any) => {
        e.preventDefault();

        // Check which field is failing
        let failingField: 'name' | 'cycle' | 'level' | null = null;
        if (!formData.name) failingField = 'name';
        else if (!formData.cycle) failingField = 'cycle';
        else if (!formData.level) failingField = 'level';

        if (failingField) {
            const nextFailCount = submitFailCount + 1;
            setSubmitFailCount(nextFailCount);

            if (nextFailCount >= 2) {
                // User forced it, show guided tour
                setValidationToastMsg(null);
                setShakeField(null);
                
                let title = '';
                let description = '';
                let elementId = '';
                
                if (failingField === 'name') {
                    title = 'Nom de la classe requis';
                    description = 'Veuillez saisir le nom de la classe (ex: 6ème A) pour continuer.';
                    elementId = '#form-name-input';
                } else if (failingField === 'cycle') {
                    title = 'Cycle requis';
                    description = 'Veuillez sélectionner le cycle (Primaire, Collège, etc.) auquel appartient la classe.';
                    elementId = '#form-cycle-select';
                } else if (failingField === 'level') {
                    title = 'Classe requise';
                    description = 'Veuillez sélectionner la classe dans cette liste.';
                    elementId = '#form-level-select';
                }

                const driverObj = driver({
                    showProgress: false,
                    animate: true,
                    popoverClass: 'driverjs-theme',
                    doneBtnText: 'Compris !',
                    steps: [
                        { element: elementId, popover: { title, description, side: "top", align: 'start' } }
                    ]
                });
                driverObj.drive();
                setSubmitFailCount(0);
                return;
            }

            // Normal shake and toast
            setShakeField(failingField);
            const messages = {
                'name': "Veuillez entrer le nom de la classe.",
                'cycle': "Veuillez sélectionner le cycle.",
                'level': "Veuillez sélectionner la classe avant d'enregistrer."
            };
            setValidationToastMsg(messages[failingField]);
            setTimeout(() => setShakeField(null), 500);
            setTimeout(() => setValidationToastMsg(null), 4000);
            return;
        }

        // Reset fail count if successful
        setSubmitFailCount(0);

        try {
            const dataToSubmit = {
                ...formData,
                level: formData.cycle, // Backend 'level' stores the UI 'cycle' (e.g. Primary)
                cycle: formData.level, // Backend 'cycle' stores the UI 'level' (e.g. 6eme)
                capacity: formData.capacity ? parseInt(formData.capacity) : null,
                teacher_id: formData.teacher_id || null
            };

            const res = await fetch(`${API_BASE_URL}/school-classes`, {
                method: 'POST',
                headers: getAuthHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }),
                
                body: JSON.stringify(dataToSubmit)
            });

            if (res.ok) {
                setSuccessToastMsg("Classe créée avec succès !");
                setTimeout(() => setSuccessToastMsg(null), 4000);
                setFormData({ name: '', level: '', cycle: '', capacity: '45', teacher_id: '' });
                fetchClasses();
                setActiveTab("liste");
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Erreur lors de la création");
            }
        } catch(e: any) {
            setValidationToastMsg(e.message || "Une erreur inattendue est survenue");
            setTimeout(() => setValidationToastMsg(null), 4000);
        }
    };

    const handleAssignTeacher = async (e: any) => {
        e.preventDefault();
        if (!assignForm.class_id || !assignForm.teacher_id) {
            setValidationToastMsg("Veuillez sélectionner une classe et un professeur.");
            setTimeout(() => setValidationToastMsg(null), 4000);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/school-classes/${assignForm.class_id}`, {
                method: 'PUT',
                headers: getAuthHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }),
                
                body: JSON.stringify({ teacher_id: assignForm.teacher_id })
            });
            if (res.ok) {
                setSuccessToastMsg("Professeur assigné avec succès !");
                setTimeout(() => setSuccessToastMsg(null), 4000);
                setAssignForm({ class_id: '', teacher_id: '' });
                fetchClasses();
                setActiveTab("liste");
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Erreur lors de l'assignation");
            }
        } catch(e: any) {
            setValidationToastMsg(e.message || "Une erreur inattendue est survenue");
            setTimeout(() => setValidationToastMsg(null), 4000);
        }
    };

    // Calculate Stats
    const totalClasses = classes.length;
    const totalStudents = classes.reduce((acc, cls) => acc + (cls.students_count || 0), 0);
    const assignedTeachers = new Set(classes.filter(c => c.teacher_id).map(c => c.teacher_id)).size;
    const avgStudents = totalClasses > 0 ? (totalStudents / totalClasses).toFixed(1) : "0";

    const translateCycle = (c?: string) => {
        if (!c) return 'Non défini';
        const lower = c.toLowerCase();
        if (lower.includes('primary') || lower.includes('primaire')) return 'Primaire';
        if (lower.includes('middle') || lower.includes('college')) return 'Collège';
        if (lower.includes('high') || lower.includes('lycee') || lower.includes('lycée')) return 'Lycée';
        if (lower.includes('maternelle')) return 'Maternelle';
        if (lower.includes('crèche') || lower.includes('creche')) return 'Crèche';
        return c;
    };

    const levelOptionsForCycle = (selectedCycle: string) => {
        const cycle = selectedCycle.toLowerCase();
        if (cycle === 'creche' || cycle === 'crèche') return [{v: 'creche', l: 'Crèche'}];
        if (cycle === 'maternelle') return [{v: 'je1', l: 'JE1'}, {v: 'je2', l: 'JE2'}];
        if (cycle === 'primaire' || cycle === 'primary') return [
            {v: 'cp1', l: 'CP1'}, {v: 'cp2', l: 'CP2'}, 
            {v: 'ce1', l: 'CE1'}, {v: 'ce2', l: 'CE2'}, 
            {v: 'cm1', l: 'CM1'}, {v: 'cm2', l: 'CM2'}
        ];
        if (cycle === 'college' || cycle === 'middle school') return [
            {v: '6eme', l: '6ème'}, {v: '5eme', l: '5ème'}, 
            {v: '4eme', l: '4ème'}, {v: '3eme', l: '3ème'}
        ];
        if (cycle === 'lycee' || cycle === 'high school') return [
            {v: '2nde', l: '2nde'}, {v: '1ere', l: '1ère'}, {v: 'terminale', l: 'Terminale'}
        ];
        
        return [
            {v: 'creche', l: 'Crèche'}, {v: 'je1', l: 'JE1'}, {v: 'je2', l: 'JE2'},
            {v: 'cp1', l: 'CP1'}, {v: 'cp2', l: 'CP2'}, {v: 'ce1', l: 'CE1'}, {v: 'ce2', l: 'CE2'}, {v: 'cm1', l: 'CM1'}, {v: 'cm2', l: 'CM2'},
            {v: '6eme', l: '6ème'}, {v: '5eme', l: '5ème'}, {v: '4eme', l: '4ème'}, {v: '3eme', l: '3ème'},
            {v: '2nde', l: '2nde'}, {v: '1ere', l: '1ère'}, {v: 'terminale', l: 'Terminale'}
        ];
    };

    const getCycleColors = (c?: string) => {
        if (!c) return { badgeBg: 'bg-gray-100 dark:bg-gray-800', badgeText: 'text-gray-600 dark:text-gray-300', cardBg: 'bg-card', cardBorder: 'border-border', barBg: 'bg-gray-400 dark:bg-gray-600', buttonBg: 'bg-gray-600 dark:bg-gray-700', buttonText: 'text-white' };
        const lower = c.toLowerCase();
        if (lower.includes('creche') || lower.includes('crèche')) 
            return { badgeBg: 'bg-pink-100 dark:bg-pink-500/20', badgeText: 'text-pink-600 dark:text-pink-400', cardBg: 'bg-pink-50/50 dark:bg-pink-500/5', cardBorder: 'border-pink-100 dark:border-pink-500/20', barBg: 'bg-pink-500 dark:bg-pink-600', buttonBg: 'bg-pink-600 dark:bg-pink-700', buttonText: 'text-white' };
        if (lower.includes('maternelle')) 
            return { badgeBg: 'bg-amber-100 dark:bg-amber-500/20', badgeText: 'text-amber-600 dark:text-amber-400', cardBg: 'bg-amber-50/50 dark:bg-amber-500/5', cardBorder: 'border-amber-100 dark:border-amber-500/20', barBg: 'bg-amber-500 dark:bg-amber-600', buttonBg: 'bg-amber-600 dark:bg-amber-700', buttonText: 'text-white' };
        if (lower.includes('primary') || lower.includes('primaire')) 
            return { badgeBg: 'bg-blue-100 dark:bg-blue-500/20', badgeText: 'text-blue-600 dark:text-blue-400', cardBg: 'bg-blue-50/50 dark:bg-blue-500/5', cardBorder: 'border-blue-100 dark:border-blue-500/20', barBg: 'bg-blue-500 dark:bg-blue-600', buttonBg: 'bg-blue-600 dark:bg-blue-700', buttonText: 'text-white' };
        if (lower.includes('middle') || lower.includes('college') || lower.includes('collège')) 
            return { badgeBg: 'bg-emerald-100 dark:bg-emerald-500/20', badgeText: 'text-emerald-600 dark:text-emerald-400', cardBg: 'bg-emerald-50/50 dark:bg-emerald-500/5', cardBorder: 'border-emerald-100 dark:border-emerald-500/20', barBg: 'bg-emerald-500 dark:bg-emerald-600', buttonBg: 'bg-emerald-600 dark:bg-emerald-700', buttonText: 'text-white' };
        if (lower.includes('high') || lower.includes('lycee') || lower.includes('lycée')) 
            return { badgeBg: 'bg-purple-100 dark:bg-purple-500/20', badgeText: 'text-purple-600 dark:text-purple-400', cardBg: 'bg-purple-50/50 dark:bg-purple-500/5', cardBorder: 'border-purple-100 dark:border-purple-500/20', barBg: 'bg-purple-500 dark:bg-purple-600', buttonBg: 'bg-purple-600 dark:bg-purple-700', buttonText: 'text-white' };
        
        return { badgeBg: 'bg-primary/10 dark:bg-primary/20', badgeText: 'text-primary dark:text-primary', cardBg: 'bg-card', cardBorder: 'border-border', barBg: 'bg-primary', buttonBg: 'bg-primary', buttonText: 'text-primary-foreground' };
    };

    const filteredClasses = classes.filter(cls => {
        let matchCycle = true;
        let matchLevel = true;
        
        if (filterCycle) {
            // Frontend Cycle corresponds to Backend 'level'
            const rawCycle = (cls.level || '').toLowerCase();
            const filter = filterCycle.toLowerCase();
            
            let isMatch = false;
            if (filter === 'primaire') {
                isMatch = rawCycle.includes('primaire') || rawCycle.includes('primary');
            } else if (filter === 'college') {
                isMatch = rawCycle.includes('college') || rawCycle.includes('collège') || rawCycle.includes('middle');
            } else if (filter === 'lycee') {
                isMatch = rawCycle.includes('lycee') || rawCycle.includes('lycée') || rawCycle.includes('high');
            } else if (filter === 'maternelle') {
                isMatch = rawCycle.includes('maternelle');
            } else if (filter === 'creche') {
                isMatch = rawCycle.includes('creche') || rawCycle.includes('crèche');
            } else {
                isMatch = rawCycle.includes(filter);
            }
            
            if (!isMatch) matchCycle = false;
        }

        if (filterLevel) {
            // Frontend Niveau corresponds to Backend 'cycle' (and we fallback to name for old records)
            const rawLevel = (cls.cycle || cls.name || '').toLowerCase().replace('è', 'e').replace('é', 'e').trim();
            const filter = filterLevel.toLowerCase().replace('è', 'e').replace('é', 'e').trim();
            if (!rawLevel.includes(filter)) matchLevel = false;
        }

        return matchCycle && matchLevel;
    });

    return (
        <>
            {/* Statistiques rapides */}
            <div className="stats-cards">
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(123, 31, 162, 0.1)', color: 'var(--primary-color)' }}>
                        <i className="fas fa-chalkboard"></i>
                    </div>
                    <div className="card-info">
                        <h3>{totalClasses}</h3>
                        <p>Classes actives</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}>
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="card-info">
                        <h3>{totalStudents}</h3>
                        <p>Élèves total</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                        <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="card-info">
                        <h3>{assignedTeachers}</h3>
                        <p>Professeurs assignés</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}>
                        <i className="fas fa-chart-bar"></i>
                    </div>
                    <div className="card-info">
                        <h3>{avgStudents}</h3>
                        <p>Moyenne d'élèves/classe</p>
                    </div>
                </div>
            </div>

            {/* Navigation des fonctionnalités */}
            <div className="features-nav">
                <button 
                    className={`feature-btn ${activeTab === 'liste' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('liste')}
                >
                    <i className="fas fa-list"></i> Liste des classes
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'enregistrement' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('enregistrement')}
                >
                    <i className="fas fa-plus-circle"></i> Nouvelle classe
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'titulaire' ? 'active' : ''}`}
                    onClick={() => setActiveTab('titulaire')}
                >
                    <i className="fas fa-user-tie"></i> Attribuer titulaire
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'effectif' ? 'active' : ''}`}
                    onClick={() => setActiveTab('effectif')}
                >
                    <i className="fas fa-chart-pie"></i> Effectifs & Statistiques
                </button>
            </div>

            {/* Section Liste des classes */}
            {activeTab === 'liste' && (
                <div className="feature-section active" id="liste">
                    <div className="page-header">
                        <div className="page-title">
                            <h3 style={{ margin: 0, marginBottom: '4px' }}>Liste des classes</h3>
                            <p style={{ margin: 0 }}>Gérez toutes les classes de l'établissement</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowPrintModal(true)}>
                            <i className="fas fa-print"></i> Imprimer
                        </button>
                    </div>

                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Cycle:</label>
                            <select className="form-select" value={filterCycle} onChange={(e) => setFilterCycle(e.target.value)}>
                                <option value="">Tous les cycles</option>
                                <option value="creche">Crèche</option>
                                <option value="maternelle">Maternelle</option>
                                <option value="primaire">Primaire</option>
                                <option value="college">Collège</option>
                                <option value="lycee">Lycée</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Classe:</label>
                            <select className="form-select" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
                                <option value="">Toutes les classes</option>
                                {levelOptionsForCycle(filterCycle).map(opt => (
                                    <option key={opt.v} value={opt.v}>{opt.l}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 print:hidden">
                        {loading && <p className="col-span-full text-muted-foreground text-center py-8">Chargement des classes...</p>}
                        {!loading && filteredClasses.length === 0 && <p className="col-span-full text-muted-foreground text-center py-8">Aucune classe trouvée.</p>}
                        {filteredClasses.map(cls => {
                            const cycleColors = getCycleColors(cls.level);
                            return (
                            <div key={cls.id} className={`${cycleColors.cardBg} ${cycleColors.cardBorder} border shadow-sm transition-all group relative hover:-translate-y-1 hover:shadow-md`} style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                {/* Section supérieure : Informations */}
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                        <div style={{ overflow: 'hidden' }}>
                                            <h4 className="text-foreground font-bold truncate" style={{ fontSize: '18px', marginBottom: '4px', margin: 0 }} title={cls.name}>{cls.name}</h4>
                                            <div className={`${cycleColors.badgeBg} ${cycleColors.badgeText} font-semibold truncate`} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', display: 'inline-block', maxWidth: '100%', marginTop: '4px' }}>
                                                {translateCycle(cls.level)} • {cls.cycle || '-'}
                                            </div>
                                        </div>
                                        <div className={`${cycleColors.badgeBg} ${cycleColors.badgeText} shadow-sm`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0 }}>
                                            <i className="fas fa-users" style={{ fontSize: '18px' }}></i>
                                        </div>
                                    </div>
                                    
                                    <div className="text-muted-foreground font-medium" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', marginTop: 'auto' }}>
                                        <div className="bg-background/80 text-secondary-foreground shadow-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }}>
                                            <i className="fas fa-user-tie" style={{ fontSize: '12px' }}></i>
                                        </div>
                                        <span className="truncate" title={cls.teacher ? `${cls.teacher.first_name} ${cls.teacher.last_name}` : 'Aucun titulaire assigné'}>
                                            {cls.teacher ? `${cls.teacher.first_name} ${cls.teacher.last_name}` : 'Aucun titulaire assigné'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Section inférieure : Effectifs */}
                                <div className="bg-background" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                                        <span className="text-foreground font-semibold">Effectif: {cls.students_count || 0}</span>
                                        <span className="text-muted-foreground">Capacité: {cls.capacity || '-'}</span>
                                    </div>
                                    {cls.capacity && (
                                        <div className="bg-background/80 border-border border" style={{ height: '8px', width: '100%', borderRadius: '999px', overflow: 'hidden' }}>
                                            <div 
                                                className={`${((cls.students_count || 0) > cls.capacity) ? 'bg-destructive' : cycleColors.barBg}`}
                                                style={{ 
                                                    height: '100%',
                                                    borderRadius: '999px',
                                                    transition: 'all 0.5s ease',
                                                    width: `${Math.min(((cls.students_count || 0) / cls.capacity) * 100, 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                                   {/* Overlay au survol */}
                                <div className="absolute inset-0 bg-background/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover:pointer-events-auto" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                                    <div className={`${cycleColors.badgeBg} ${cycleColors.badgeText} mb-3`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%' }}>
                                        <i className="fas fa-eye" style={{ fontSize: '20px' }}></i>
                                    </div>
                                    <h4 className="text-foreground font-bold" style={{ fontSize: '18px', marginBottom: '4px', textAlign: 'center' }}>{cls.name}</h4>
                                    <p className="text-muted-foreground" style={{ fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                                        {cls.students_count || 0} élèves inscrits
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                        <button onClick={(e) => { e.preventDefault(); setSelectedClassAction({ id: cls.id, name: cls.name, level: cls.level, action: 'manage' }); }} className={`${cycleColors.buttonBg} ${cycleColors.buttonText} transition-opacity hover:opacity-90`} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                                            <i className="fas fa-edit" style={{ marginRight: '6px' }}></i> Gérer
                                        </button>
                                        <button onClick={(e) => { e.preventDefault(); setSelectedClassAction({ id: cls.id, name: cls.name, level: cls.level, action: 'stats' }); }} className="bg-secondary text-secondary-foreground transition-opacity hover:opacity-90" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                                            <i className="fas fa-chart-pie" style={{ marginRight: '6px' }}></i> Stats
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>

                    {/* Vue dédiée pour l'impression (Tableau et En-tête/Pied) */}
                    {/* Vue dédiée pour l'impression (Tableau et En-tête/Pied) */}
                    <div className="hidden print:block" style={{ fontFamily: "'Times New Roman', Times, serif", padding: '8mm' }}>
                        {printType === 'students_list' && (
                            <style type="text/css" media="print">
                                {`@page { size: landscape; margin: 0; }`}
                            </style>
                        )}
                        {printType !== 'students_list' && (
                            <style type="text/css" media="print">
                                {`@page { size: portrait; margin: 0; }`}
                            </style>
                        )}

                        <div className="w-full mb-16">
                            {/* En-tête d'impression */}
                            <div className="mb-10 flex flex-col">
                                {/* Section 1 : Info École & République */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex flex-col items-start w-1/3">
                                        <h2 className="text-sm font-black m-0 text-black uppercase">COMPLEXE SCOLAIRE SKOOLIS</h2>
                                        <p className="text-xs text-black m-0 mt-1">BP 12345 Lomé, Togo</p>
                                        <p className="text-xs text-black m-0 mt-1">Tél: +228 90 00 00 00</p>
                                    </div>
                                    <div className="flex flex-col items-end justify-start w-1/3 text-right">
                                        <h3 className="text-sm font-black m-0 text-black uppercase">République Togolaise</h3>
                                        <p className="text-xs text-black m-0 italic mt-1">Travail - Liberté - Patrie</p>
                                        <div className="w-16 h-[2px] bg-black my-2"></div>
                                    </div>
                                </div>

                                {/* Section 2 : Titre du document */}
                                <div className="flex justify-between items-center py-2 mt-16 mb-12">
                                    <div className="w-1/4">
                                        <p className="text-black font-bold m-0 text-sm">Année scolaire 2026-2027</p>
                                    </div>
                                    
                                    <div className="w-2/4 flex flex-col items-center">
                                        <h1 className="text-xl font-black uppercase tracking-widest text-black m-0 text-center">
                                            {printType === 'classes_list' && 'Liste globale des classes'}
                                            {printType === 'students_list' && "Fiche d'identité des élèves"}
                                            {printType === 'grades' && 'Fiche de notation trimestrielle'}
                                            {printType === 'attendance' && 'Fiche de suivi des présences'}
                                        </h1>
                                    </div>

                                    <div className="w-1/4 flex justify-end">
                                        <p className="text-black font-bold m-0 text-sm">
                                            {printTarget === 'all' ? 'Toutes les classes' : `Classe : ${classes.find(c => c.id === printTarget)?.name || ''}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Section 3 : Informations supplémentaires (Grades / Attendance) */}
                                {(printType === 'attendance' || printType === 'grades') && (
                                    <div className="flex justify-between items-end mb-4 px-2">
                                        {printType === 'attendance' && (
                                            <p className="text-black font-bold m-0 text-sm">Période : ........................................................................</p>
                                        )}
                                        {printType === 'grades' && (
                                            <div className="flex w-full justify-between">
                                                <p className="text-sm font-bold text-black m-0">Matière : ........................................................................</p>
                                                <p className="text-sm font-bold text-black m-0">Enseignant : ........................................................................</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tableau d'impression dynamique */}
                            <table className="w-full text-left border-collapse" style={{ border: '1px solid black', fontSize: '11px' }}>
                                <thead>
                                    {printType === 'classes_list' && (
                                        <tr className="bg-gray-100">
                                            <th className="border border-black p-2 font-bold text-black" style={{ backgroundColor: '#f3f4f6' }}>Nom de la classe</th>
                                            <th className="border border-black p-2 font-bold text-black" style={{ backgroundColor: '#f3f4f6' }}>Cycle</th>
                                            <th className="border border-black p-2 font-bold text-black" style={{ backgroundColor: '#f3f4f6' }}>Niveau</th>
                                            <th className="border border-black p-2 font-bold text-black text-center" style={{ backgroundColor: '#f3f4f6' }}>Effectif</th>
                                            <th className="border border-black p-2 font-bold text-black text-center" style={{ backgroundColor: '#f3f4f6' }}>Capacité</th>
                                        </tr>
                                    )}
                                    {printType === 'students_list' && (
                                        <tr className="bg-gray-100">
                                            <th className="border border-black p-2 font-bold text-black text-center w-10" style={{ backgroundColor: '#f3f4f6' }}>N°</th>
                                            <th className="border border-black p-2 font-bold text-black" style={{ backgroundColor: '#f3f4f6' }}>Matricule</th>
                                            <th className="border border-black p-2 px-4 font-bold text-black min-w-[200px]" style={{ backgroundColor: '#f3f4f6' }}>Nom & Prénom(s)</th>
                                            <th className="border border-black p-2 font-bold text-black text-center" style={{ backgroundColor: '#f3f4f6' }}>Sexe</th>
                                            <th className="border border-black p-2 font-bold text-black" style={{ backgroundColor: '#f3f4f6' }}>Date de naissance</th>
                                            <th className="border border-black p-2 font-bold text-black" style={{ backgroundColor: '#f3f4f6' }}>Lieu de naissance</th>
                                            <th className="border border-black p-2 font-bold text-black" style={{ backgroundColor: '#f3f4f6' }}>Nationalité</th>
                                            <th className="border border-black p-2 font-bold text-black" style={{ backgroundColor: '#f3f4f6' }}>Contact Parent</th>
                                        </tr>
                                    )}
                                    {printType === 'grades' && (
                                        <>
                                            <tr className="bg-gray-100">
                                                <th rowSpan={2} className="border border-black p-2 font-bold text-black w-10 text-center" style={{ backgroundColor: '#f3f4f6' }}>N°</th>
                                                <th rowSpan={2} className="border border-black p-2 px-4 font-bold text-black min-w-[200px]" style={{ backgroundColor: '#f3f4f6' }}>Nom & Prénoms</th>
                                                <th colSpan={2} className="border border-black p-2 font-bold text-black text-center" style={{ backgroundColor: '#f3f4f6' }}>Interrogations</th>
                                                <th colSpan={2} className="border border-black p-2 font-bold text-black text-center" style={{ backgroundColor: '#f3f4f6' }}>Devoirs</th>
                                                <th rowSpan={2} className="border border-black p-2 font-bold text-black text-center w-24" style={{ backgroundColor: '#f3f4f6' }}>Composition</th>
                                                <th rowSpan={2} className="border border-black p-2 font-bold text-black text-center w-40" style={{ backgroundColor: '#f3f4f6' }}>Moyenne / Observations</th>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <th className="border border-black p-2 font-bold text-black text-center text-xs" style={{ backgroundColor: '#f9fafb' }}>Interro 1</th>
                                                <th className="border border-black p-2 font-bold text-black text-center text-xs" style={{ backgroundColor: '#f9fafb' }}>Interro 2</th>
                                                <th className="border border-black p-2 font-bold text-black text-center text-xs" style={{ backgroundColor: '#f9fafb' }}>Devoir 1</th>
                                                <th className="border border-black p-2 font-bold text-black text-center text-xs" style={{ backgroundColor: '#f9fafb' }}>Devoir 2</th>
                                            </tr>
                                        </>
                                    )}
                                    {printType === 'attendance' && (
                                        <tr className="bg-gray-100">
                                            <th className="border border-black p-2 font-bold text-black w-10 text-center" style={{ backgroundColor: '#f3f4f6' }}>N°</th>
                                            <th className="border border-black p-2 px-4 font-bold text-black min-w-[200px]" style={{ backgroundColor: '#f3f4f6' }}>Nom & Prénoms</th>
                                            {Array.from({length: 25}).map((_, i) => (
                                                <th key={i} className="border border-black p-1 font-bold text-black text-center w-6" style={{ backgroundColor: '#f3f4f6' }}></th>
                                            ))}
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {printType === 'classes_list' ? (
                                        filteredClasses.map((cls, idx) => (
                                            <tr key={cls.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="border border-black p-1 px-2 text-black font-semibold">{cls.name}</td>
                                                <td className="border border-black p-1 px-2 text-black">{cls.cycle || '-'}</td>
                                                <td className="border border-black p-1 px-2 text-black">{translateCycle(cls.level)}</td>
                                                <td className="border border-black p-1 px-2 text-center text-black">{cls.students_count || 0}</td>
                                                <td className="border border-black p-1 px-2 text-center text-black">{cls.capacity}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num, idx) => (
                                            <tr key={num} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                {printType === 'students_list' && (
                                                    <>
                                                        <td className="border border-black p-1 px-2 text-center text-black font-medium">{num}</td>
                                                        <td className="border border-black p-1 px-2 text-black font-mono">MAT-{202600 + num}</td>
                                                        <td className="border border-black p-1 px-4 text-black font-bold uppercase">Élève Exemple {num}</td>
                                                        <td className="border border-black p-1 px-2 text-center text-black">{num % 2 === 0 ? 'F' : 'M'}</td>
                                                        <td className="border border-black p-1 px-2 text-black">12/05/201{num%10}</td>
                                                        <td className="border border-black p-1 px-2 text-black">Lomé</td>
                                                        <td className="border border-black p-1 px-2 text-black">Togolaise</td>
                                                        <td className="border border-black p-1 px-2 text-black">+228 90 00 00 0{num}</td>
                                                    </>
                                                )}
                                                {printType === 'grades' && (
                                                    <>
                                                        <td className="border border-black p-1 px-2 text-center text-black font-medium">{num}</td>
                                                        <td className="border border-black p-1 px-4 text-black font-bold uppercase">Élève Exemple {num}</td>
                                                        <td className="border border-black p-1" style={{ height: '22px' }}></td>
                                                        <td className="border border-black p-1" style={{ height: '22px' }}></td>
                                                        <td className="border border-black p-1" style={{ height: '22px' }}></td>
                                                        <td className="border border-black p-1" style={{ height: '22px' }}></td>
                                                        <td className="border border-black p-1" style={{ height: '22px' }}></td>
                                                        <td className="border border-black p-1" style={{ height: '22px' }}></td>
                                                    </>
                                                )}
                                                {printType === 'attendance' && (
                                                    <>
                                                        <td className="border border-black p-1 px-2 text-center text-black font-medium">{num}</td>
                                                        <td className="border border-black p-1 px-4 text-black font-bold uppercase">Élève Exemple {num}</td>
                                                        {Array.from({length: 25}).map((_, i) => (
                                                            <td key={i} className="border border-black p-1 bg-white" style={{ height: '22px', backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '4px 4px' }}></td>
                                                        ))}
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Signature / Fait à */}
                            <div className="mt-8 flex justify-end w-full pr-8">
                                <div className="text-center">
                                    <p className="text-black text-base m-0 italic">
                                        Fait à Lomé, le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    <p className="text-black font-bold text-base mt-8">La Direction</p>
                                </div>
                            </div>
                        </div>

                        {/* Pied de page global */}
                        <div className="pt-2 border-t border-black flex justify-between items-center text-xs text-gray-500 bg-white px-2" style={{ fontFamily: "'Times New Roman', Times, serif", position: 'fixed', bottom: '12mm', left: '8mm', right: '8mm' }}>
                            <div className="w-1/3"></div>
                            <p className="m-0 text-xs text-black w-1/3 text-center mb-1">
                                <span className="italic font-normal">Propulsé par</span> <span className="font-bold">Skoolis</span>
                            </p>
                            <p className="m-0 font-medium w-1/3 text-right">Imprimé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Section Nouvelle classe */}
            {activeTab === 'enregistrement' && (
                <div className="feature-section active" id="enregistrement">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Créer une nouvelle classe</h3>
                            <p>Configurez une nouvelle classe pour l'année scolaire</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <form onSubmit={handleSave}>
                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-info-circle"></i> Informations de base
                                </h4>
                                <div className="form-grid">
                                    <div className={`form-group ${shakeField === 'name' ? 'shake-animation' : ''}`}>
                                        <label style={shakeField === 'name' ? { color: 'var(--destructive)', fontWeight: 'bold' } : {}}>Nom de la classe <span className="required">*</span></label>
                                        <input id="form-name-input" type="text" value={formData.name} onChange={e => {
                                            setFormData({...formData, name: e.target.value});
                                            setSubmitFailCount(0);
                                            if (shakeField === 'name') { setShakeField(null); setValidationToastMsg(null); }
                                        }} className="form-control" style={shakeField === 'name' ? { borderColor: 'var(--destructive)', outlineColor: 'var(--destructive)', boxShadow: '0 0 0 2px var(--destructive)' } : {}} placeholder="Ex: 3ème A" />
                                    </div>
                                    <div className={`form-group ${shakeField === 'cycle' ? 'shake-animation' : ''}`}>
                                        <label style={shakeField === 'cycle' ? { color: 'var(--destructive)', fontWeight: 'bold' } : {}}>Cycle <span className="required">*</span></label>
                                        <select id="form-cycle-select" value={formData.cycle} onChange={e => {
                                            // Reset level when cycle changes
                                            setFormData({...formData, cycle: e.target.value, level: ''});
                                            setClasseClickCount(0); // reset tracker when user fixes the issue
                                            setSubmitFailCount(0);
                                            if (shakeField === 'cycle') { setShakeField(null); setValidationToastMsg(null); }
                                        }} className="form-control" style={shakeField === 'cycle' ? { borderColor: 'var(--destructive)', outlineColor: 'var(--destructive)', boxShadow: '0 0 0 2px var(--destructive)' } : {}}>
                                            <option value="">Sélectionner un cycle</option>
                                            <option value="Crèche">Crèche</option>
                                            <option value="Maternelle">Maternelle</option>
                                            <option value="Primary">Primaire</option>
                                            <option value="Middle School">Collège</option>
                                            <option value="High School">Lycée</option>
                                        </select>
                                    </div>
                                    <div className={`form-group ${shakeField === 'level' ? 'shake-animation' : ''}`} onClick={() => {
                                        if (!formData.cycle) {
                                            const next = classeClickCount + 1;
                                            setClasseClickCount(next);
                                            
                                            if (next === 1) {
                                                setShowCycleToast(true);
                                                setTimeout(() => setShowCycleToast(false), 3000);
                                            } else if (next >= 2) {
                                                setShowCycleToast(false);
                                                const driverObj = driver({
                                                    showProgress: true,
                                                    animate: true,
                                                    popoverClass: 'driverjs-theme',
                                                    nextBtnText: 'Suivant →',
                                                    prevBtnText: '← Précédent',
                                                    doneBtnText: 'Compris !',
                                                    progressText: '{{current}} sur {{total}}',
                                                    allowClose: false,
                                                    steps: [
                                                        { 
                                                            element: '#form-cycle-select', 
                                                            popover: { 
                                                                title: '1. Choisissez le cycle', 
                                                                description: 'Vous devez d\'abord sélectionner le cycle (Primaire, Collège, etc.) auquel appartient la classe.', 
                                                                side: "left", 
                                                                align: 'start',
                                                                onNextClick: () => {
                                                                    const cycleSelect = document.getElementById('form-cycle-select') as HTMLSelectElement;
                                                                    if (!cycleSelect || !cycleSelect.value) {
                                                                        setShowCycleToast(true);
                                                                        setTimeout(() => setShowCycleToast(false), 3000);
                                                                        return;
                                                                    }
                                                                    driverObj.moveNext();
                                                                }
                                                            }
                                                        },
                                                        { element: '#form-level-select', popover: { title: '2. Choisissez la classe', description: 'Une fois le cycle sélectionné, les classes correspondantes apparaîtront ici.', side: "left", align: 'start' }},
                                                    ]
                                                });
                                                driverObj.drive();
                                                setClasseClickCount(0); // reset
                                            }
                                        }
                                    }}>
                                        <label style={shakeField === 'level' ? { color: 'var(--destructive)', fontWeight: 'bold' } : {}}>Classe <span className="required">*</span></label>
                                        <div style={!formData.cycle ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}}>
                                            <select id="form-level-select" value={formData.level} onChange={e => {
                                                setFormData({...formData, level: e.target.value});
                                                setSubmitFailCount(0);
                                                if (shakeField === 'level') { setShakeField(null); setValidationToastMsg(null); }
                                            }} className="form-control" disabled={!formData.cycle} style={!formData.cycle ? { pointerEvents: 'none' } : (shakeField === 'level' ? { borderColor: 'var(--destructive)', outlineColor: 'var(--destructive)', boxShadow: '0 0 0 2px var(--destructive)' } : {})}>
                                                <option value="">Sélectionner une classe</option>
                                            {levelOptionsForCycle(formData.cycle).map(opt => (
                                                <option key={opt.v} value={opt.v}>{opt.l}</option>
                                            ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Capacité maximale</label>
                                        <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} min="1" max="1000" className="form-control" placeholder="45" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <i className="fas fa-chalkboard-teacher"></i> Professeur titulaire
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Titulaire de la classe</label>
                                        <select value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="form-select">
                                            <option value="">Aucun titulaire assigné</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.first_name} {teacher.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="form-help">Vous pourrez modifier cela plus tard</small>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('liste')}>
                                    <i className="fas fa-times"></i> Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save"></i> Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Section Attribuer titulaire */}
            {activeTab === 'titulaire' && (
                <div className="feature-section active" id="titulaire">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Attribuer un titulaire à une classe</h3>
                            <p>Assignez ou changez le professeur titulaire d'une classe</p>
                        </div>
                    </div>

                    <div className="form-container">
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%' }}>
                            <div className="form-group" style={{ margin: 0, flex: 1 }}>
                                <label>Sélectionner la classe</label>
                                <select 
                                    className="form-control" 
                                    style={{ width: '100%', padding: '12px' }}
                                    value={assignForm.class_id} 
                                    onChange={e => setAssignForm({...assignForm, class_id: e.target.value})}
                                >
                                    <option value="">Choisir une classe</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ margin: 0, flex: 1 }}>
                                <label>Sélectionner le titulaire</label>
                                <select 
                                    className="form-control"
                                    style={{ width: '100%', padding: '12px' }}
                                    value={assignForm.teacher_id} 
                                    onChange={e => setAssignForm({...assignForm, teacher_id: e.target.value})}
                                >
                                    <option value="">Choisir un professeur</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.first_name} {teacher.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {assignForm.class_id && (() => {
                            const selectedCls = classes.find(c => c.id.toString() === assignForm.class_id);
                            if (!selectedCls) return null;
                            return (
                                <div className="class-info-card">
                                    <div className="class-info-header">
                                        <h4>Informations de la classe</h4>
                                    </div>
                                    <div className="class-info-body">
                                        <div className="info-row">
                                            <span className="info-label">Classe:</span>
                                            <span className="info-value">{selectedCls.name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Niveau:</span>
                                            <span className="info-value">{selectedCls.level || '-'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Effectif actuel:</span>
                                            <span className="info-value">{selectedCls.students_count || 0}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Titulaire actuel:</span>
                                            <span className="info-value">{selectedCls.teacher ? `${selectedCls.teacher.first_name} ${selectedCls.teacher.last_name}` : 'Aucun'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="form-actions" style={{ marginTop: '30px' }}>
                            <button className="btn btn-secondary" onClick={() => setAssignForm({ class_id: '', teacher_id: '' })}>
                                Annuler
                            </button>
                            <button className="btn btn-primary" onClick={handleAssignTeacher}>
                                <i className="fas fa-save"></i> Attribuer le titulaire
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Section Effectifs & Statistiques */}
            {activeTab === 'effectif' && (
                <div className="feature-section active" id="effectif">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Effectifs et statistiques</h3>
                            <p>Visualisez les statistiques par classe et niveau</p>
                        </div>
                        <button className="btn btn-primary">
                            <i className="fas fa-download"></i> Exporter données
                        </button>
                    </div>

                    <div className="stats-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {classes.length > 0 && (
                            <div className="chart-container" style={{ background: 'var(--color-card)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
                                <div className="chart-header" style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: 'var(--color-foreground)' }}>Répartition des effectifs par classe</h3>
                                </div>
                                <div style={{ width: '100%', height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={classes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)' }} />
                                            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)' }} />
                                            <Tooltip 
                                                cursor={{ fill: 'var(--color-muted)', opacity: 0.5 }}
                                                contentStyle={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
                                                itemStyle={{ color: 'var(--color-foreground)', padding: 0, margin: 0 }}
                                                labelStyle={{ color: 'var(--color-muted-foreground)', fontWeight: 'bold', marginBottom: '8px', padding: 0 }}
                                                formatter={(value) => [`${value} élèves`, 'Effectif']}
                                            />
                                            <Bar dataKey="students_count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                                {classes.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={getCycleColorHex(entry.cycle)} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        <div className="table-container" style={{ overflowX: 'hidden', width: '100%' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Classe</th>
                                        <th>Niveau</th>
                                        <th>Effectif</th>
                                        <th>Capacité</th>
                                        <th>Taux remplissage</th>
                                        <th>Titulaire</th>
                                        <th>Moyenne classe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.map(cls => {
                                        const fillRate = cls.capacity ? Math.round(((cls.students_count || 0) / cls.capacity) * 100) : 0;
                                        return (
                                            <tr key={cls.id}>
                                                <td>{cls.name}</td>
                                                <td>{cls.cycle || '-'}</td>
                                                <td>{cls.students_count || 0}</td>
                                                <td>{cls.capacity || '-'}</td>
                                                <td>
                                                    <div className="progress-bar-bg" style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden', display: 'inline-block', width: '60px', verticalAlign: 'middle', marginRight: '10px' }}>
                                                        <div className="progress-bar-fill" style={{ width: `${Math.min(fillRate, 100)}%`, height: '100%', background: fillRate > 100 ? '#f44336' : 'var(--primary-color)' }}></div>
                                                    </div>
                                                    {fillRate}%
                                                </td>
                                                <td>{cls.teacher ? `${cls.teacher.first_name} ${cls.teacher.last_name}` : 'Aucun'}</td>
                                                <td>-</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="summary-cards">
                            <div className="summary-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left', gap: '16px' }}>
                                <div className="summary-icon" style={{ backgroundColor: 'rgba(123, 31, 162, 0.1)', flexShrink: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="summary-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 style={{ margin: 0, marginBottom: '4px', lineHeight: 1 }}>Effectif total</h4>
                                    <h3 style={{ margin: 0, lineHeight: 1 }}>{totalStudents}</h3>
                                </div>
                            </div>
                            <div className="summary-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left', gap: '16px' }}>
                                <div className="summary-icon" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', flexShrink: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-percentage"></i>
                                </div>
                                <div className="summary-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 style={{ margin: 0, marginBottom: '4px', lineHeight: 1 }}>Taux de remplissage</h4>
                                    <h3 style={{ margin: 0, lineHeight: 1 }}>{totalClasses > 0 ? Math.round(classes.reduce((acc, cls) => acc + (cls.capacity ? ((cls.students_count || 0) / cls.capacity) : 0), 0) / totalClasses * 100) : 0}%</h3>
                                </div>
                            </div>
                            <div className="summary-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left', gap: '16px' }}>
                                <div className="summary-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', flexShrink: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <div className="summary-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 style={{ margin: 0, marginBottom: '4px', lineHeight: 1 }}>Moyenne générale</h4>
                                    <h3 style={{ margin: 0, lineHeight: 1 }}>-</h3>
                                </div>
                            </div>
                            <div className="summary-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left', gap: '16px' }}>
                                <div className="summary-icon" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', flexShrink: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-balance-scale"></i>
                                </div>
                                <div className="summary-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 style={{ margin: 0, marginBottom: '4px', lineHeight: 1 }}>Ratio filles/garçons</h4>
                                    <h3 style={{ margin: 0, lineHeight: 1 }}>-</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals for actions */}
            {selectedClassAction && (
                <div 
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" 
                    style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}
                    onClick={() => setSelectedClassAction(null)}
                >
                    <div 
                        className="bg-card text-card-foreground border-border w-full max-w-md rounded-2xl border shadow-xl relative overflow-hidden"
                        style={{ display: 'flex', flexDirection: 'column' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(() => {
                            const modalColors = getCycleColors(selectedClassAction.level || '');
                            return (
                                <>
                                    {/* Color accent line at top */}
                                    <div className={`${modalColors.barBg}`} style={{ height: '4px', width: '100%' }}></div>
                                    
                                    <div style={{ padding: '32px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <h3 className="text-foreground" style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                                                {selectedClassAction.action === 'manage' ? 'Gérer la classe' : 'Statistiques'}
                                            </h3>
                                            <button 
                                                onClick={() => setSelectedClassAction(null)}
                                                className="text-muted-foreground hover:bg-secondary transition-colors"
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'transparent' }}
                                            >
                                                <i className="fas fa-times" style={{ fontSize: '18px' }}></i>
                                            </button>
                                        </div>
                                        
                                        <div style={{ marginBottom: '24px' }}>
                                            <span className={`${modalColors.badgeBg} ${modalColors.badgeText}`} style={{ display: 'inline-flex', borderRadius: '999px', padding: '6px 16px', fontSize: '14px', fontWeight: '600' }}>
                                                {selectedClassAction.name}
                                            </span>
                                        </div>

                                        <div className="text-muted-foreground" style={{ textAlign: 'center', padding: '24px 0', marginBottom: '32px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                                <div className={`${modalColors.buttonBg} ${modalColors.buttonText} shadow-sm`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', fontSize: '28px' }}>
                                                    <i className={selectedClassAction.action === 'manage' ? "fas fa-tools" : "fas fa-chart-pie"}></i>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '15px', lineHeight: '1.5', margin: 0 }}>
                                                L'interface {selectedClassAction.action === 'manage' ? 'de gestion' : 'des statistiques'} pour cette classe sera bientôt disponible.
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => setSelectedClassAction(null)}
                                            className={`${modalColors.buttonBg} ${modalColors.buttonText} hover:opacity-90 transition-opacity`}
                                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}
                                        >
                                            Fermer
                                        </button>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Animation Notification pour la sélection de classe sans cycle */}
            <div 
                className="fixed bottom-4 right-4 z-[99999] transition-all duration-300 ease-in-out"
                style={{ 
                    opacity: showCycleToast ? 1 : 0, 
                    transform: showCycleToast ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                    pointerEvents: showCycleToast ? 'auto' : 'none'
                }}
            >
                <div className="bg-destructive text-destructive-foreground shadow-lg rounded-lg p-4 flex items-center gap-3">
                    <i className="fas fa-exclamation-circle text-xl"></i>
                    <div>
                        <h4 className="font-bold text-sm">Action requise</h4>
                        <p className="text-sm opacity-90">Veuillez sélectionner le cycle d'abord !</p>
                    </div>
                </div>
            </div>

            {/* Modal d'impression */}
            {showPrintModal && (
                <div className="modal-overlay fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-6 sm:p-8 backdrop-blur-sm" onClick={() => setShowPrintModal(false)}>
                    <div className="bg-card text-card-foreground w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
                        <div className="border-b border-border flex items-center justify-between shrink-0" style={{ padding: '32px' }}>
                            <h3 className="text-xl font-bold m-0 flex items-center gap-3">
                                <i className="fas fa-print text-primary"></i> Configuration d'impression
                            </h3>
                            <button onClick={() => setShowPrintModal(false)} className="text-muted-foreground hover:bg-secondary w-8 h-8 rounded-full flex items-center justify-center transition-colors border-none bg-transparent cursor-pointer">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div className="flex flex-col gap-6 overflow-y-auto" style={{ padding: '32px' }}>
                            <div className="form-group mb-0">
                                <label className="block mb-3 font-semibold text-lg">Que voulez-vous imprimer ?</label>
                                <select 
                                    className="form-control w-full bg-background border border-border rounded-lg text-foreground shadow-sm"
                                    style={{ padding: '16px', fontSize: '16px', height: 'auto' }}
                                    value={printType}
                                    onChange={(e) => setPrintType(e.target.value)}
                                >
                                    <option value="classes_list">Liste globale des classes</option>
                                    <option value="students_list">Identité des élèves (par classe)</option>
                                    <option value="grades">Fiches de notes (bulletins)</option>
                                    <option value="attendance">Registre de présences</option>
                                </select>
                            </div>

                            <div className="form-group mb-0">
                                <label className="block mb-3 font-semibold text-lg">Classe concernée</label>
                                <select 
                                    className="form-control w-full bg-background border border-border rounded-lg text-foreground shadow-sm"
                                    style={{ padding: '16px', fontSize: '16px', height: 'auto', ...(printType === 'classes_list' ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                                    value={printTarget}
                                    onChange={(e) => setPrintTarget(e.target.value)}
                                    disabled={printType === 'classes_list'}
                                >
                                    {printType !== 'classes_list' && <option value="all">Toutes les classes</option>}
                                    {printType === 'classes_list' && <option value="all">Automatique (Vue actuelle)</option>}
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.cycle})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-border bg-muted/20 flex flex-wrap justify-end gap-4 shrink-0" style={{ padding: '32px' }}>
                            <button 
                                onClick={() => setShowPrintModal(false)}
                                className="rounded-lg border border-border bg-background hover:bg-secondary font-medium transition-colors cursor-pointer text-foreground shadow-sm"
                                style={{ padding: '12px 24px', fontSize: '16px' }}
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={() => {
                                    setShowPrintModal(false);
                                    setTimeout(() => window.print(), 300);
                                }}
                                className="rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer border-none shadow-md whitespace-nowrap"
                                style={{ padding: '12px 24px', fontSize: '16px' }}
                            >
                                <i className="fas fa-file-pdf text-lg"></i> Imprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animation Notification pour l'oubli de la classe à l'enregistrement */}
            <div 
                className="fixed bottom-4 right-4 z-[99999] transition-all duration-300 ease-in-out"
                style={{ 
                    opacity: validationToastMsg ? 1 : 0, 
                    transform: validationToastMsg ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                    pointerEvents: validationToastMsg ? 'auto' : 'none'
                }}
            >
                <div className="bg-destructive text-destructive-foreground shadow-lg rounded-lg p-4 flex items-center gap-3">
                    <i className="fas fa-exclamation-triangle text-xl"></i>
                    <div>
                        <h4 className="font-bold text-sm">Erreur</h4>
                        <p className="text-sm opacity-90">{validationToastMsg}</p>
                    </div>
                </div>
            </div>

            {/* Animation Notification pour le succès */}
            <div 
                className="fixed bottom-4 right-4 z-[99999] transition-all duration-300 ease-in-out"
                style={{ 
                    opacity: successToastMsg ? 1 : 0, 
                    transform: successToastMsg ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                    pointerEvents: successToastMsg ? 'auto' : 'none'
                }}
            >
                <div className="bg-emerald-500 text-white shadow-xl rounded-lg p-4 flex items-center gap-3 border border-emerald-400/20">
                    <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                        <i className="fas fa-check text-white"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Succès</h4>
                        <p className="text-sm opacity-90">{successToastMsg}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
