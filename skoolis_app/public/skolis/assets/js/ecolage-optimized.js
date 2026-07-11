// ============================================
// pages/ecolage.js - Gestion des frais d'écolage
// Version consolidée et optimisée
// ============================================

/**
 * Module de gestion des frais d'écolage
 * Utilise les utilitaires de utils.js et les gestionnaires de app.js
 */
const EcolageManager = {
    // Données en mémoire
    data: {
        tarifs: [],
        paiements: [],
        engagements: [],
        élèves: [],
        relances: []
    },
    
    // Configuration
    config: {
        tranches: [1, 2, 3, 4],
        modesReglement: ['Espèces', 'Chèque', 'Virement', 'Mobile Money'],
        delaiRelance: 15 // jours
    },
    
    /**
     * Initialisation du module
     */
    init() {
        console.log('Initialisation du module Écolage...');
        
        // Charger les données
        this.loadData();
        
        // Initialiser la navigation des fonctionnalités
        this.initFeatureNavigation();
        
        // Initialiser les formulaires
        this.initForms();
        
        // Initialiser les tableaux
        this.initTables();
        
        // Définir la date du jour par défaut
        this.setDefaultDates();
        
        console.log('✓ Module Écolage initialisé');
    },
    
    /**
     * Charge les données depuis le localStorage
     */
    loadData() {
        this.data.tarifs = Utils.storage.get('ecolage_tarifs', this.getDemoTarifs());
        this.data.paiements = Utils.storage.get('ecolage_paiements', []);
        this.data.engagements = Utils.storage.get('ecolage_engagements', []);
        this.data.élèves = Utils.storage.get('élèves', this.getDemoEleves());
        this.data.relances = Utils.storage.get('ecolage_relances', []);
    },
    
    /**
     * Sauvegarde les données dans le localStorage
     * @param {string} key - Clé de données à sauvegarder
     */
    saveData(key) {
        Utils.storage.set(`ecolage_${key}`, this.data[key]);
    },
    
    /**
     * Navigation entre les fonctionnalités
     */
    initFeatureNavigation() {
        const featureBtns = document.querySelectorAll('.feature-btn');
        
        if (featureBtns.length === 0) return;
        
        featureBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const feature = btn.getAttribute('data-feature');
                
                // Retirer active de tous les boutons
                featureBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Cacher toutes les sections
                document.querySelectorAll('.feature-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Afficher la section ciblée
                const targetSection = document.getElementById(feature);
                if (targetSection) {
                    targetSection.classList.add('active');
                    
                    // Charger les données de la section
                    this.loadFeatureData(feature);
                }
            });
        });
    },
    
    /**
     * Charge les données d'une fonctionnalité
     * @param {string} feature - Nom de la fonctionnalité
     */
    loadFeatureData(feature) {
        switch (feature) {
            case 'tarifs-ecolage':
                this.displayTarifs();
                break;
            case 'paiements-ecolage':
                this.loadElevesForPaiement();
                break;
            case 'liste-paiements':
                this.displayPaiements();
                break;
            case 'engagements':
                this.displayEngagements();
                break;
            case 'relance':
                this.displayRelances();
                break;
        }
    },
    
    /**
     * Initialise tous les formulaires
     */
    initForms() {
        this.initFormTarifs();
        this.initFormPaiement();
        this.initFormEngagement();
        this.initFormRelance();
    },
    
    /**
     * Initialise le formulaire des tarifs
     */
    initFormTarifs() {
        const form = document.getElementById('formTarifEcolage');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const tarif = {
                id: Utils.generateId(),
                classe: formData.get('classe'),
                garcon: parseFloat(formData.get('montant_garcon')),
                fille: parseFloat(formData.get('montant_fille')),
                tranches: parseInt(formData.get('nb_tranches')),
                date_application: formData.get('date_application')
            };
            
            // Validation
            if (!tarif.classe || !tarif.garcon || !tarif.fille) {
                Utils.showNotification('Veuillez remplir tous les champs', 'error');
                return;
            }
            
            // Ajouter ou mettre à jour
            const existingIndex = this.data.tarifs.findIndex(t => t.classe === tarif.classe);
            if (existingIndex !== -1) {
                this.data.tarifs[existingIndex] = tarif;
                Utils.showNotification('Tarif mis à jour', 'success');
            } else {
                this.data.tarifs.push(tarif);
                Utils.showNotification('Tarif ajouté avec succès', 'success');
            }
            
            // Sauvegarder et rafraîchir
            this.saveData('tarifs');
            this.displayTarifs();
            form.reset();
        });
    },
    
    /**
     * Initialise le formulaire de paiement
     */
    initFormPaiement() {
        const form = document.getElementById('formPaiementEcolage');
        if (!form) return;
        
        // Événement de sélection d'élève
        const selectEleve = form.querySelector('[name="eleve_id"]');
        if (selectEleve) {
            selectEleve.addEventListener('change', (e) => {
                this.loadEleveDetails(e.target.value);
            });
        }
        
        // Soumission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPaiement(form);
        });
    },
    
    /**
     * Traite un paiement
     * @param {HTMLFormElement} form - Formulaire de paiement
     */
    processPaiement(form) {
        const formData = new FormData(form);
        
        const paiement = {
            id: Utils.generateId(),
            eleve_id: formData.get('eleve_id'),
            eleve_nom: form.querySelector('[name="eleve_id"] option:checked').text,
            montant: parseFloat(formData.get('montant')),
            tranche: parseInt(formData.get('tranche')),
            mode_reglement: formData.get('mode_reglement'),
            date: formData.get('date'),
            numero_recu: formData.get('numero_recu') || this.generateNumeroRecu(),
            observation: formData.get('observation') || ''
        };
        
        // Validation
        if (!paiement.eleve_id || !paiement.montant || !paiement.tranche) {
            Utils.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        // Enregistrer
        this.data.paiements.push(paiement);
        this.saveData('paiements');
        
        // Notification et reset
        Utils.showNotification(`Paiement enregistré - Reçu N° ${paiement.numero_recu}`, 'success');
        form.reset();
        
        // Proposer d'imprimer le reçu
        Utils.showConfirm(
            'Voulez-vous imprimer le reçu ?',
            () => this.printReceipt(paiement),
            null
        );
    },
    
    /**
     * Initialise le formulaire d'engagement
     */
    initFormEngagement() {
        const form = document.getElementById('formEngagement');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const engagement = {
                id: Utils.generateId(),
                eleve_id: formData.get('eleve_id'),
                eleve_nom: form.querySelector('[name="eleve_id"] option:checked').text,
                montant_promis: parseFloat(formData.get('montant_promis')),
                date_echeance: formData.get('date_echeance'),
                date_engagement: formData.get('date_engagement'),
                observation: formData.get('observation') || '',
                statut: 'En attente'
            };
            
            this.data.engagements.push(engagement);
            this.saveData('engagements');
            
            Utils.showNotification('Engagement enregistré', 'success');
            form.reset();
            this.displayEngagements();
        });
    },
    
    /**
     * Initialise le formulaire de relance
     */
    initFormRelance() {
        const btnGenererRelance = document.getElementById('btnGenererRelance');
        if (!btnGenererRelance) return;
        
        btnGenererRelance.addEventListener('click', () => {
            this.genererRelances();
        });
    },
    
    /**
     * Initialise les tableaux
     */
    initTables() {
        // Les tableaux sont gérés automatiquement par TableManager dans app.js
        // Ajouter seulement les événements spécifiques
        
        // Boutons d'action dans les tableaux
        document.addEventListener('click', (e) => {
            // Modifier un tarif
            if (e.target.closest('.btn-edit-tarif')) {
                const id = e.target.closest('.btn-edit-tarif').dataset.id;
                this.editTarif(id);
            }
            
            // Supprimer un tarif
            if (e.target.closest('.btn-delete-tarif')) {
                const id = e.target.closest('.btn-delete-tarif').dataset.id;
                this.deleteTarif(id);
            }
            
            // Imprimer un reçu
            if (e.target.closest('.btn-print-receipt')) {
                const id = e.target.closest('.btn-print-receipt').dataset.id;
                const paiement = this.data.paiements.find(p => p.id === id);
                if (paiement) this.printReceipt(paiement);
            }
        });
    },
    
    /**
     * Définit les dates par défaut dans les formulaires
     */
    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        
        // Date de paiement
        const datePaiement = document.getElementById('date_paiement_ecolage');
        if (datePaiement && !datePaiement.value) {
            datePaiement.value = today;
        }
        
        // Date d'engagement
        const dateEngagement = document.getElementById('date_engagement');
        if (dateEngagement && !dateEngagement.value) {
            dateEngagement.value = today;
        }
        
        // Date d'échéance (15 jours)
        const dateEcheance = document.getElementById('date_echeance');
        if (dateEcheance && !dateEcheance.value) {
            const echeance = new Date();
            echeance.setDate(echeance.getDate() + this.config.delaiRelance);
            dateEcheance.value = echeance.toISOString().split('T')[0];
        }
    },
    
    /**
     * Affiche la liste des tarifs
     */
    displayTarifs() {
        const tbody = document.querySelector('#tableTarifs tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.data.tarifs.map(tarif => `
            <tr>
                <td>${tarif.classe}</td>
                <td>${Utils.formatCurrency(tarif.garcon)}</td>
                <td>${Utils.formatCurrency(tarif.fille)}</td>
                <td>${tarif.tranches}</td>
                <td>${Utils.formatDate(tarif.date_application)}</td>
                <td class="actions">
                    <button class="btn-icon btn-edit-tarif" data-id="${tarif.id}" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete-tarif" data-id="${tarif.id}" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },
    
    /**
     * Affiche la liste des paiements
     */
    displayPaiements() {
        const tbody = document.querySelector('#tablePaiements tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.data.paiements.map(p => `
            <tr>
                <td>${p.numero_recu}</td>
                <td>${Utils.formatDate(p.date)}</td>
                <td>${p.eleve_nom}</td>
                <td>Tranche ${p.tranche}</td>
                <td>${Utils.formatCurrency(p.montant)}</td>
                <td>${p.mode_reglement}</td>
                <td class="actions">
                    <button class="btn-icon btn-print-receipt" data-id="${p.id}" title="Imprimer">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },
    
    /**
     * Affiche la liste des engagements
     */
    displayEngagements() {
        const tbody = document.querySelector('#tableEngagements tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.data.engagements.map(eng => `
            <tr>
                <td>${Utils.formatDate(eng.date_engagement)}</td>
                <td>${eng.eleve_nom}</td>
                <td>${Utils.formatCurrency(eng.montant_promis)}</td>
                <td>${Utils.formatDate(eng.date_echeance)}</td>
                <td>
                    <span class="badge badge-${eng.statut === 'Honoré' ? 'success' : 'warning'}">
                        ${eng.statut}
                    </span>
                </td>
                <td>${Utils.truncate(eng.observation, 50)}</td>
            </tr>
        `).join('');
    },
    
    /**
     * Affiche la liste des relances
     */
    displayRelances() {
        const tbody = document.querySelector('#tableRelances tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.data.relances.map(rel => `
            <tr>
                <td>${rel.eleve_nom}</td>
                <td>${rel.tuteur_contact}</td>
                <td>${Utils.formatCurrency(rel.montant_du)}</td>
                <td>${Utils.formatDate(rel.derniere_relance)}</td>
                <td>${rel.nb_relances}</td>
            </tr>
        `).join('');
    },
    
    /**
     * Charge les élèves pour le formulaire de paiement
     */
    loadElevesForPaiement() {
        const select = document.querySelector('[name="eleve_id"]');
        if (!select) return;
        
        select.innerHTML = '<option value="">Sélectionner un élève</option>' +
            this.data.élèves.map(élève => `
                <option value="${élève.id}">${élève.nom} ${élève.prenom} - ${élève.classe}</option>
            `).join('');
    },
    
    /**
     * Charge les détails d'un élève
     * @param {string} eleveId - ID de l'élève
     */
    loadEleveDetails(eleveId) {
        const élève = this.data.élèves.find(e => e.id === eleveId);
        if (!élève) return;
        
        // Remplir les champs d'information
        const infosDiv = document.getElementById('infosEleve');
        if (infosDiv) {
            infosDiv.innerHTML = `
                <p><strong>Classe:</strong> ${élève.classe}</p>
                <p><strong>Montant écolage:</strong> ${Utils.formatCurrency(élève.montant_ecolage)}</p>
                <p><strong>Nombre de tranches:</strong> ${élève.tranches}</p>
            `;
        }
    },
    
    /**
     * Génère un numéro de reçu unique
     * @returns {string} Numéro de reçu
     */
    generateNumeroRecu() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const count = this.data.paiements.length + 1;
        return `REC-ECO-${year}${month}-${String(count).padStart(4, '0')}`;
    },
    
    /**
     * Imprime un reçu de paiement
     * @param {object} paiement - Données du paiement
     */
    printReceipt(paiement) {
        // TODO: Implémenter l'impression du reçu
        console.log('Impression du reçu:', paiement);
        Utils.showNotification('Fonction d\'impression à venir', 'info');
    },
    
    /**
     * Génère les relances automatiques
     */
    genererRelances() {
        // Logique de génération des relances
        const aujourdHui = new Date();
        const relances = [];
        
        this.data.engagements.forEach(eng => {
            if (eng.statut !== 'Honoré') {
                const dateEcheance = new Date(eng.date_echeance);
                const joursRetard = Math.floor((aujourdHui - dateEcheance) / (1000 * 60 * 60 * 24));
                
                if (joursRetard > 0) {
                    relances.push({
                        eleve_id: eng.eleve_id,
                        eleve_nom: eng.eleve_nom,
                        montant_du: eng.montant_promis,
                        jours_retard: joursRetard,
                        derniere_relance: new Date().toISOString().split('T')[0]
                    });
                }
            }
        });
        
        if (relances.length === 0) {
            Utils.showNotification('Aucune relance à générer', 'info');
            return;
        }
        
        this.data.relances = relances;
        this.saveData('relances');
        this.displayRelances();
        
        Utils.showNotification(`${relances.length} relance(s) générée(s)`, 'success');
    },
    
    /**
     * Modifie un tarif
     * @param {string} id - ID du tarif
     */
    editTarif(id) {
        const tarif = this.data.tarifs.find(t => t.id === id);
        if (!tarif) return;
        
        // Remplir le formulaire
        const form = document.getElementById('formTarifEcolage');
        if (form) {
            form.querySelector('[name="classe"]').value = tarif.classe;
            form.querySelector('[name="montant_garcon"]').value = tarif.garcon;
            form.querySelector('[name="montant_fille"]').value = tarif.fille;
            form.querySelector('[name="nb_tranches"]').value = tarif.tranches;
            form.querySelector('[name="date_application"]').value = tarif.date_application;
            
            // Scroll vers le formulaire
            Utils.scrollTo(form);
        }
    },
    
    /**
     * Supprime un tarif
     * @param {string} id - ID du tarif
     */
    deleteTarif(id) {
        Utils.showConfirm(
            'Êtes-vous sûr de vouloir supprimer ce tarif ?',
            () => {
                this.data.tarifs = this.data.tarifs.filter(t => t.id !== id);
                this.saveData('tarifs');
                this.displayTarifs();
                Utils.showNotification('Tarif supprimé', 'success');
            }
        );
    },
    
    /**
     * Données de démo - Tarifs
     */
    getDemoTarifs() {
        return [
            { id: '1', classe: '6A', garcon: 300000, fille: 270000, tranches: 3, date_application: '2024-09-01' },
            { id: '2', classe: '5B', garcon: 330000, fille: 300000, tranches: 3, date_application: '2024-09-01' },
            { id: '3', classe: '4C', garcon: 360000, fille: 330000, tranches: 3, date_application: '2024-09-01' }
        ];
    },
    
    /**
     * Données de démo - Élèves
     */
    getDemoEleves() {
        return [
            {
                id: '1',
                matricule: 'STD-2024-001',
                nom: 'Kamga',
                prenom: 'Marie',
                classe: '6A',
                sexe: 'F',
                montant_ecolage: 270000,
                tranches: 3
            },
            {
                id: '2',
                matricule: 'STD-2024-002',
                nom: 'Nkoa',
                prenom: 'Paul',
                classe: '5B',
                sexe: 'M',
                montant_ecolage: 330000,
                tranches: 3
            }
        ];
    }
};

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', () => {
    EcolageManager.init();
});

// Exposer globalement si nécessaire
window.EcolageManager = EcolageManager;
