/**
 * eleves.js - Script de gestion du CRUD des élèves via l'API Skoolis
 * Ce script remplace l'ancienne logique basée sur localStorage.
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    // Ne charger que si on est sur la feature "liste" ou lors du chargement initial
    loadStudents();
});

/**
 * Fonction utilitaire pour gérer les requêtes fetch avec credentials
 */
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(options.headers || {})
            },
            credentials: 'include' // Très important pour Sanctum (cookies)
        });

        if (response.status === 401 || response.status === 419) {
            // Redirection vers la page de connexion si la session est expirée/absente
            console.warn('Session expirée ou non authentifié. Redirection...');
            window.location.href = 'http://localhost:3000/'; 
            return null;
        }

        if (!response.ok) {
            let errorMsg = `Erreur réseau: ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.message) errorMsg = errorData.message;
            } catch (e) {}
            throw new Error(errorMsg);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * 1. Charger la liste des élèves
 */
async function loadStudents() {
    const tableBody = document.getElementById('studentsTableBody');
    const totalCount = document.getElementById('totalStudents');
    if (!tableBody) return;

    // État: Chargement
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 20px;">
                <i class="fas fa-spinner fa-spin"></i> Chargement des élèves en cours...
            </td>
        </tr>
    `;

    try {
        const response = await apiFetch('/students');
        if (!response) return; // Si null, c'est qu'il y a eu un redirect 401

        const students = response.data;
        if (totalCount) totalCount.innerText = students.length;

        // État: Vide
        if (students.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px; color: var(--text-light);">
                        <i class="fas fa-info-circle"></i> Aucun élève enregistré pour le moment.
                    </td>
                </tr>
            `;
            return;
        }

        // Rendu des élèves
        tableBody.innerHTML = students.map(student => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="color: #aaa;"></i>
                        </div>
                        <strong>${student.last_name} ${student.first_name}</strong>
                    </div>
                </td>
                <td>${student.registration_number || 'N/A'}</td>
                <td>-</td>
                <td>${student.birth_date || '-'}</td>
                <td>-</td>
                <td>-</td>
                <td>
                    <button class="btn btn-secondary btn-small" onclick="deleteStudent('${student.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        // État: Erreur
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: red;">
                    <i class="fas fa-exclamation-triangle"></i> Erreur lors du chargement des élèves : ${error.message}
                </td>
            </tr>
        `;
    }
}

/**
 * 2. Créer un nouvel élève
 */
async function saveStudent() {
    // Empêcher le comportement par défaut si appelé depuis un formulaire (bien qu'ici ce soit un onclick sur bouton)
    event && event.preventDefault();

    const btn = document.querySelector('button[onclick="saveStudent()"]');
    const originalText = btn.innerHTML;
    
    // Récupérer les champs du DOM
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const sexe = document.getElementById('sexe').value;
    const naissance = document.getElementById('naissance').value;
    const matricule = document.getElementById('matricule').value.trim();
    
    if (!nom || !prenom) {
        alert("Le nom et le prénom sont obligatoires.");
        return;
    }

    const payload = {
        first_name: prenom,
        last_name: nom,
        gender: sexe || null,
        birth_date: naissance || null,
        registration_number: matricule || null
    };

    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
        btn.disabled = true;

        const response = await apiFetch('/students', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (response) {
            alert('Élève enregistré avec succès !');
            resetForm(); // Vide le formulaire
            
            // Revenir à l'onglet liste
            const listeBtn = document.querySelector('button[data-feature="liste"]');
            if (listeBtn) listeBtn.click();
            
            // Recharger la liste
            loadStudents();
        }
    } catch (error) {
        alert(`Erreur lors de l'enregistrement : ${error.message}`);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

/**
 * 3. Supprimer un élève
 */
async function deleteStudent(id) {
    if (!confirm("Voulez-vous vraiment supprimer cet élève ?")) {
        return;
    }

    try {
        const response = await apiFetch(`/students/${id}`, {
            method: 'DELETE'
        });

        if (response) {
            // Recharger la liste
            loadStudents();
        }
    } catch (error) {
        alert(`Erreur lors de la suppression : ${error.message}`);
    }
}

function resetForm() {
    const form = document.getElementById('studentForm');
    if (form) form.reset();
}
