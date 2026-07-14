"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function NotesPage() {
    const [activeTab, setActiveTab] = useState("enregistrement");
    
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    
    // Nouveaux states
    const [studentGrades, setStudentGrades] = useState<any[]>([]);
    const [studentPeriodAverage, setStudentPeriodAverage] = useState<number | null>(null);
    const [classPeriodAverages, setClassPeriodAverages] = useState<any[]>([]);
    const [classAnnualAverages, setClassAnnualAverages] = useState<any[]>([]);

    // Pour la saisie des notes (Bulk)
    const [gradeInput, setGradeInput] = useState<Record<string, any>>({});
    const [evalType, setEvalType] = useState('composition'); // ou examen_pratique

    const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        fetchClasses();
        setSubjects([
            { id: 'uuid-maths', name: 'Mathématiques', type: 'composition' },
            { id: 'uuid-physique', name: 'Physique', type: 'composition' },
            { id: 'uuid-sport', name: 'EPS', type: 'examen_pratique' },
        ]);
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/classes`, {
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setClasses(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchStudentsForClass = async (classId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/students?class_id=${classId}`, {
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setStudents(data.data || []);
                // Initialiser le state des notes
                const initialGrades: Record<string, any> = {};
                (data.data || []).forEach((s: any) => {
                    initialGrades[s.id] = {
                        interrogation: '',
                        devoir: '',
                        composition: '',
                        examen_pratique: '',
                        appreciation: ''
                    };
                });
                setGradeInput(initialGrades);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleClassChange = (e: any) => {
        const val = e.target.value;
        setSelectedClass(val);
        if (val) fetchStudentsForClass(val);
        else setStudents([]);
    };

    const handleSubjectChange = (e: any) => {
        const val = e.target.value;
        setSelectedSubject(val);
        const subj = subjects.find(s => s.id === val);
        if (subj) {
            setEvalType(subj.type);
        }
    };

    const handleGradeChange = (studentId: string, field: string, value: string) => {
        setGradeInput(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const saveNotes = async () => {
        if (!selectedClass || !selectedPeriod || !selectedSubject) {
            alert("Veuillez sélectionner la classe, la période et la matière.");
            return;
        }

        const gradesArray = Object.keys(gradeInput).map(studentId => {
            const input = gradeInput[studentId];
            return {
                student_id: studentId,
                interrogation: input.interrogation ? parseFloat(input.interrogation) : null,
                devoir: input.devoir ? parseFloat(input.devoir) : null,
                composition: evalType === 'composition' && input.composition ? parseFloat(input.composition) : null,
                examen_pratique: evalType === 'examen_pratique' && input.examen_pratique ? parseFloat(input.examen_pratique) : null,
                appreciation: input.appreciation || null,
            };
        });

        try {
            const res = await fetch(`${API_BASE_URL}/grades/bulk`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    school_class_id: selectedClass,
                    subject_id: selectedSubject,
                    period: selectedPeriod,
                    grades: gradesArray
                })
            });

            if (res.ok) {
                alert("Notes enregistrées avec succès !");
            } else {
                const errData = await res.json();
                alert(errData.message || "Erreur lors de l'enregistrement.");
            }
        } catch(e: any) {
            alert(e.message);
        }
    };

    const fetchGrades = async () => {
        try {
            let url = `${API_BASE_URL}/grades?`;
            if (selectedClass) url += `class_id=${selectedClass}&`;
            if (selectedPeriod) url += `period=${selectedPeriod}&`;
            if (selectedSubject) url += `subject_id=${selectedSubject}&`;

            const res = await fetch(url, {
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setGrades(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchStudentGrades = async () => {
        if (!selectedStudent) return;
        try {
            let url = `${API_BASE_URL}/grades?student_id=${selectedStudent}`;
            if (selectedPeriod) url += `&period=${selectedPeriod}`;
            const res = await fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setStudentGrades(data.data || []);
            }

            if (selectedPeriod) {
                const resAvg = await fetch(`${API_BASE_URL}/students/${selectedStudent}/period-average?period=${selectedPeriod}`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
                if (resAvg.ok) {
                    const avgData = await resAvg.json();
                    setStudentPeriodAverage(avgData.moyenne_generale);
                }
            } else {
                setStudentPeriodAverage(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchClassPeriodAverages = async () => {
        if (!selectedClass || !selectedPeriod) return;
        try {
            const res = await fetch(`${API_BASE_URL}/classes/${selectedClass}/period-averages?period=${selectedPeriod}`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setClassPeriodAverages(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchClassAnnualAverages = async () => {
        if (!selectedClass) return;
        try {
            const res = await fetch(`${API_BASE_URL}/classes/${selectedClass}/annual-averages`, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setClassAnnualAverages(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (activeTab === 'liste') {
            fetchGrades();
        } else if (activeTab === 'note_eleve') {
            fetchStudentGrades();
        } else if (activeTab === 'moyenne_periodique') {
            fetchClassPeriodAverages();
        } else if (activeTab === 'moyenne_annuelle') {
            fetchClassAnnualAverages();
        }
    }, [activeTab, selectedClass, selectedPeriod, selectedSubject, selectedStudent]);

    return (
        <>
            <div className="features-nav">
                <button 
                    className={`feature-btn ${activeTab === 'enregistrement' ? 'active' : ''}`}
                    onClick={() => setActiveTab('enregistrement')}
                >
                    <i className="fas fa-plus-circle"></i> Enregistrer des notes
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'liste' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liste')}
                >
                    <i className="fas fa-list"></i> Voir les notes
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'note_eleve' ? 'active' : ''}`}
                    onClick={() => setActiveTab('note_eleve')}
                >
                    <i className="fas fa-user-graduate"></i> Note d'un élève
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'moyenne_periodique' ? 'active' : ''}`}
                    onClick={() => setActiveTab('moyenne_periodique')}
                >
                    <i className="fas fa-calendar-alt"></i> Moyenne Périodique
                </button>
                <button 
                    className={`feature-btn ${activeTab === 'moyenne_annuelle' ? 'active' : ''}`}
                    onClick={() => setActiveTab('moyenne_annuelle')}
                >
                    <i className="fas fa-chart-bar"></i> Moyenne Annuelle
                </button>
            </div>

            {/* Section Enregistrement des notes */}
            {activeTab === 'enregistrement' && (
                <div className="feature-section active" id="enregistrement">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Enregistrement des notes</h3>
                            <p>Saisissez les notes pour une classe, période et matière spécifiques</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn btn-secondary">
                                <i className="fas fa-times"></i> Annuler
                            </button>
                            <button className="btn btn-primary" onClick={saveNotes}>
                                <i className="fas fa-save"></i> Enregistrer
                            </button>
                        </div>
                    </div>

                    <div className="form-container">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Classe *</label>
                                <select value={selectedClass} onChange={handleClassChange} required>
                                    <option value="">Sélectionner une classe</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Période *</label>
                                <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} required>
                                    <option value="">Sélectionner une période</option>
                                    <option value="trimestre1">1er Trimestre</option>
                                    <option value="trimestre2">2ème Trimestre</option>
                                    <option value="trimestre3">3ème Trimestre</option>
                                    <option value="semestre1">1er Semestre</option>
                                    <option value="semestre2">2ème Semestre</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Matière *</label>
                                <select value={selectedSubject} onChange={handleSubjectChange} required>
                                    <option value="">Sélectionner une matière</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Types d'évaluation (auto-détecté) :</label>
                            <div className="évaluation-types" style={{display: 'flex', gap: '15px'}}>
                                <label><input type="checkbox" checked disabled /> Interrogation</label>
                                <label><input type="checkbox" checked disabled /> Devoir</label>
                                {evalType === 'composition' && (
                                    <label><input type="checkbox" checked disabled /> Composition</label>
                                )}
                                {evalType === 'examen_pratique' && (
                                    <label><input type="checkbox" checked disabled /> Examen Pratique</label>
                                )}
                            </div>
                        </div>

                        <div style={{height: '20px'}}></div>

                        <div className="table-container full-width">
                            <table className="data-table notes-table">
                                <thead>
                                    <tr>
                                        <th>Élève</th>
                                        <th>Interro (20)</th>
                                        <th>Devoir (20)</th>
                                        {evalType === 'composition' ? <th>Compo (20)</th> : <th>Ex. Pratique (20)</th>}
                                        <th>Appréciations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.last_name} {student.first_name}</td>
                                            <td>
                                                <input type="number" min="0" max="20" step="0.25" style={{width:'80px', padding:'5px'}}
                                                    value={gradeInput[student.id]?.interrogation || ''}
                                                    onChange={e => handleGradeChange(student.id, 'interrogation', e.target.value)} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" max="20" step="0.25" style={{width:'80px', padding:'5px'}}
                                                    value={gradeInput[student.id]?.devoir || ''}
                                                    onChange={e => handleGradeChange(student.id, 'devoir', e.target.value)} />
                                            </td>
                                            <td>
                                                {evalType === 'composition' ? (
                                                    <input type="number" min="0" max="20" step="0.25" style={{width:'80px', padding:'5px'}}
                                                        value={gradeInput[student.id]?.composition || ''}
                                                        onChange={e => handleGradeChange(student.id, 'composition', e.target.value)} />
                                                ) : (
                                                    <input type="number" min="0" max="20" step="0.25" style={{width:'80px', padding:'5px'}}
                                                        value={gradeInput[student.id]?.examen_pratique || ''}
                                                        onChange={e => handleGradeChange(student.id, 'examen_pratique', e.target.value)} />
                                                )}
                                            </td>
                                            <td>
                                                <input type="text" style={{width:'100%', padding:'5px'}}
                                                    value={gradeInput[student.id]?.appreciation || ''}
                                                    onChange={e => handleGradeChange(student.id, 'appreciation', e.target.value)} />
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="empty-table" style={{textAlign:'center', padding:'20px'}}>
                                                Sélectionnez d'abord une classe, une période et une matière
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Section Voir les notes */}
            {activeTab === 'liste' && (
                <div className="feature-section active" id="liste">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Liste des notes</h3>
                            <p>Consultez toutes les notes enregistrées</p>
                        </div>
                    </div>

                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Classe:</label>
                            <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                                <option value="">Toutes les classes</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Période:</label>
                            <select className="form-select" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                                <option value="">Toutes les périodes</option>
                                <option value="trimestre1">1er Trimestre</option>
                                <option value="trimestre2">2ème Trimestre</option>
                                <option value="trimestre3">3ème Trimestre</option>
                                <option value="semestre1">1er Semestre</option>
                                <option value="semestre2">2ème Semestre</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Matière:</label>
                            <select className="form-select" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                                <option value="">Toutes les matières</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="table-container full-width">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Élève</th>
                                    <th>Matière</th>
                                    <th>Période</th>
                                    <th>Interro</th>
                                    <th>Devoir</th>
                                    <th>Moy. classe</th>
                                    <th>Compo / P.</th>
                                    <th>Moy. matière</th>
                                    <th>Rang</th>
                                    <th>Appréciations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map(g => (
                                    <tr key={g.id}>
                                        <td>{g.student ? `${g.student.last_name} ${g.student.first_name}` : '-'}</td>
                                        <td>{g.subject ? g.subject.name : 'Inconnue'}</td>
                                        <td>{g.period}</td>
                                        <td>{g.interrogation ?? '-'}</td>
                                        <td>{g.devoir ?? '-'}</td>
                                        <td><strong>{g.note_classe ?? '-'}</strong></td>
                                        <td>{g.composition ?? g.examen_pratique ?? '-'}</td>
                                        <td><strong>{g.moyenne_matiere ?? '-'}</strong></td>
                                        <td>{g.rank ?? '-'}</td>
                                        <td>{g.appreciation ?? '-'}</td>
                                    </tr>
                                ))}
                                {grades.length === 0 && (
                                    <tr>
                                        <td colSpan={10} style={{textAlign: 'center', padding: '20px'}}>Aucune note trouvée.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Section Note d'un élève */}
            {activeTab === 'note_eleve' && (
                <div className="feature-section active" id="note_eleve">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Note d'un élève</h3>
                            <p>Consulter les notes spécifiques d'un élève</p>
                        </div>
                    </div>
                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Classe:</label>
                            <select className="form-select" value={selectedClass} onChange={handleClassChange}>
                                <option value="">Sélectionner une classe</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Élève:</label>
                            <select className="form-select" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                                <option value="">Sélectionner un élève</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Période:</label>
                            <select className="form-select" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                                <option value="">Toutes les périodes</option>
                                <option value="trimestre1">1er Trimestre</option>
                                <option value="trimestre2">2ème Trimestre</option>
                                <option value="trimestre3">3ème Trimestre</option>
                                <option value="semestre1">1er Semestre</option>
                                <option value="semestre2">2ème Semestre</option>
                            </select>
                        </div>
                    </div>
                    
                    {studentPeriodAverage !== null && selectedPeriod && (
                        <div className="alert alert-info" style={{margin: '20px 0', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '8px'}}>
                            <strong>Moyenne Périodique de l'élève :</strong> {studentPeriodAverage.toFixed(2)}
                        </div>
                    )}

                    <div className="table-container full-width">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Matière</th>
                                    <th>Période</th>
                                    <th>Interro</th>
                                    <th>Devoir</th>
                                    <th>Moy. classe</th>
                                    <th>Compo / P.</th>
                                    <th>Moy. matière</th>
                                    <th>Appréciations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentGrades.map(g => (
                                    <tr key={g.id}>
                                        <td>{g.subject ? g.subject.name : 'Inconnue'}</td>
                                        <td>{g.period}</td>
                                        <td>{g.interrogation ?? '-'}</td>
                                        <td>{g.devoir ?? '-'}</td>
                                        <td><strong>{g.note_classe ?? '-'}</strong></td>
                                        <td>{g.composition ?? g.examen_pratique ?? '-'}</td>
                                        <td><strong>{g.moyenne_matiere ?? '-'}</strong></td>
                                        <td>{g.appreciation ?? '-'}</td>
                                    </tr>
                                ))}
                                {studentGrades.length === 0 && (
                                    <tr>
                                        <td colSpan={8} style={{textAlign: 'center', padding: '20px'}}>Aucune note trouvée.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Section Moyenne Périodique */}
            {activeTab === 'moyenne_periodique' && (
                <div className="feature-section active" id="moyenne_periodique">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Moyenne Périodique</h3>
                            <p>Calcul et consultation des moyennes générales par période</p>
                        </div>
                    </div>
                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Classe:</label>
                            <select className="form-select" value={selectedClass} onChange={handleClassChange}>
                                <option value="">Sélectionner une classe</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Période:</label>
                            <select className="form-select" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                                <option value="">Sélectionner une période</option>
                                <option value="trimestre1">1er Trimestre</option>
                                <option value="trimestre2">2ème Trimestre</option>
                                <option value="trimestre3">3ème Trimestre</option>
                                <option value="semestre1">1er Semestre</option>
                                <option value="semestre2">2ème Semestre</option>
                            </select>
                        </div>
                    </div>
                    <div className="table-container full-width">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Rang</th>
                                    <th>Élève</th>
                                    <th>Moyenne Générale</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classPeriodAverages.map((item, index) => (
                                    <tr key={item.student.id}>
                                        <td><strong>{item.rank}</strong></td>
                                        <td>{item.student.last_name} {item.student.first_name}</td>
                                        <td>{item.moyenne_generale !== null ? item.moyenne_generale.toFixed(2) : '-'}</td>
                                    </tr>
                                ))}
                                {classPeriodAverages.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{textAlign: 'center', padding: '20px'}}>Aucune donnée.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Section Moyenne Annuelle */}
            {activeTab === 'moyenne_annuelle' && (
                <div className="feature-section active" id="moyenne_annuelle">
                    <div className="page-header">
                        <div className="page-title">
                            <h3>Moyenne Annuelle</h3>
                            <p>Calcul et consultation des moyennes générales annuelles</p>
                        </div>
                    </div>
                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Classe:</label>
                            <select className="form-select" value={selectedClass} onChange={handleClassChange}>
                                <option value="">Sélectionner une classe</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="table-container full-width">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Rang</th>
                                    <th>Élève</th>
                                    <th>Moyenne Annuelle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classAnnualAverages.map((item, index) => (
                                    <tr key={item.student.id}>
                                        <td><strong>{item.rank}</strong></td>
                                        <td>{item.student.last_name} {item.student.first_name}</td>
                                        <td>{item.moyenne_generale !== null ? item.moyenne_generale.toFixed(2) : '-'}</td>
                                    </tr>
                                ))}
                                {classAnnualAverages.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{textAlign: 'center', padding: '20px'}}>Aucune donnée.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
