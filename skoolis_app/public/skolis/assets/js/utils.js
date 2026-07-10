// ============================================
// utils.js - Utilitaires réutilisables
// ============================================

const Utils = {
    // ========== FORMATAGE ==========

    /**
     * Formate une date au format français (DD/MM/YYYY)
     * @param {string|Date} date - Date à formater
     * @returns {string} Date formatée
     */
    formatDate(date) {
        if (!date) return '-';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('fr-FR');
    },

    /**
     * Formate une date/heure au format français complet
     * @param {string|Date} date - Date à formater
     * @returns {string} Date et heure formatées
     */
    formatDateTime(date) {
        if (!date) return '-';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('fr-FR') + ' à ' + d.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Formate un montant en FCFA
     * @param {number} amount - Montant à formater
     * @returns {string} Montant formaté
     */
    formatCurrency(amount) {
        if (amount === null || amount === undefined) return '0 FCFA';
        return Number(amount).toLocaleString('fr-FR') + ' FCFA';
    },

    /**
     * Formate un nombre avec séparateurs de milliers
     * @param {number} number - Nombre à formater
     * @returns {string} Nombre formaté
     */
    formatNumber(number) {
        if (number === null || number === undefined) return '0';
        return Number(number).toLocaleString('fr-FR');
    },

    /**
     * Formate un pourcentage
     * @param {number} value - Valeur à formater
     * @param {number} decimals - Nombre de décimales (défaut: 1)
     * @returns {string} Pourcentage formaté
     */
    formatPercent(value, decimals = 1) {
        if (value === null || value === undefined) return '0%';
        return Number(value).toFixed(decimals) + '%';
    },

    /**
     * Capitalise la première lettre d'une chaîne
     * @param {string} str - Chaîne à capitaliser
     * @returns {string} Chaîne capitalisée
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    /**
     * Tronque un texte et ajoute des points de suspension
     * @param {string} text - Texte à tronquer
     * @param {number} maxLength - Longueur maximale
     * @returns {string} Texte tronqué
     */
    truncate(text, maxLength = 50) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // ========== VALIDATION ==========

    /**
     * Valide un email
     * @param {string} email - Email à valider
     * @returns {boolean} true si valide
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Valide un numéro de téléphone camerounais
     * @param {string} phone - Numéro à valider
     * @returns {boolean} true si valide
     */
    validatePhone(phone) {
        // Format: +237 6XX XXX XXX ou 6XXXXXXXX
        const phoneRegex = /^(\+237)?[26][0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    /**
     * Valide un mot de passe (min 6 caractères)
     * @param {string} password - Mot de passe à valider
     * @returns {object} {valid: boolean, message: string}
     */
    validatePassword(password) {
        if (!password || password.length < 6) {
            return {
                valid: false,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            };
        }
        return { valid: true, message: '' };
    },

    /**
     * Valide un formulaire complet
     * @param {HTMLFormElement} form - Formulaire à valider
     * @returns {object} {valid: boolean, errors: array}
     */
    validateForm(form) {
        const errors = [];
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                errors.push({
                    field: field.name || field.id,
                    message: `Le champ ${field.placeholder || field.name} est requis`
                });
            }

            // Validation spécifique par type
            if (field.type === 'email' && field.value && !this.validateEmail(field.value)) {
                errors.push({
                    field: field.name || field.id,
                    message: 'Email invalide'
                });
            }

            if (field.type === 'tel' && field.value && !this.validatePhone(field.value)) {
                errors.push({
                    field: field.name || field.id,
                    message: 'Numéro de téléphone invalide'
                });
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // ========== STOCKAGE LOCAL ==========

    storage: {
        /**
         * Récupère une valeur du localStorage
         * @param {string} key - Clé de stockage
         * @param {*} defaultValue - Valeur par défaut si clé inexistante
         * @returns {*} Valeur stockée ou valeur par défaut
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error(`Erreur lors de la lecture de ${key}:`, error);
                return defaultValue;
            }
        },

        /**
         * Stocke une valeur dans le localStorage
         * @param {string} key - Clé de stockage
         * @param {*} value - Valeur à stocker
         * @returns {boolean} true si succès
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error(`Erreur lors de l'écriture de ${key}:`, error);
                return false;
            }
        },

        /**
         * Supprime une valeur du localStorage
         * @param {string} key - Clé à supprimer
         * @returns {boolean} true si succès
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error(`Erreur lors de la suppression de ${key}:`, error);
                return false;
            }
        },

        /**
         * Efface tout le localStorage
         */
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Erreur lors du nettoyage du localStorage:', error);
                return false;
            }
        }
    },

    // ========== NOTIFICATIONS ==========

    /**
     * Affiche une notification toast
     * @param {string} message - Message à afficher
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Durée en ms (défaut: 3000)
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Supprimer les notifications existantes
        document.querySelectorAll('.notification-toast').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;

        const iconMap = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        const colorMap = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };

        notification.innerHTML = `
            <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
            <span>${message}</span>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${colorMap[type] || colorMap.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 400px;
            word-wrap: break-word;
            font-family: 'Poppins', sans-serif;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },

    /**
     * Affiche une boîte de confirmation
     * @param {string} message - Message de confirmation
     * @param {function} onConfirm - Callback si confirmé
     * @param {function} onCancel - Callback si annulé
     */
    showConfirm(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.2s ease;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            font-family: 'Poppins', sans-serif;
        `;

        dialog.innerHTML = `
            <p style="margin-bottom: 20px; color: #333; font-size: 16px;">${message}</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn-cancel" style="
                    padding: 10px 20px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: 'Poppins', sans-serif;
                ">Annuler</button>
                <button class="btn-confirm" style="
                    padding: 10px 20px;
                    border: none;
                    background: #7b1fa2;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: 'Poppins', sans-serif;
                ">Confirmer</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const btnCancel = dialog.querySelector('.btn-cancel');
        const btnConfirm = dialog.querySelector('.btn-confirm');

        btnCancel.addEventListener('click', () => {
            overlay.remove();
            if (onCancel) onCancel();
        });

        btnConfirm.addEventListener('click', () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                if (onCancel) onCancel();
            }
        });
    },

    // ========== UTILITAIRES DIVERS ==========

    /**
     * Fonction debounce pour limiter les appels
     * @param {function} func - Fonction à exécuter
     * @param {number} wait - Délai d'attente en ms
     * @returns {function} Fonction debounced
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Génère un ID unique
     * @returns {string} ID unique
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Clone profond d'un objet
     * @param {object} obj - Objet à cloner
     * @returns {object} Copie de l'objet
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Vérifie si un objet est vide
     * @param {object} obj - Objet à vérifier
     * @returns {boolean} true si vide
     */
    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    },

    /**
     * Attend un certain délai (pour async/await)
     * @param {number} ms - Millisecondes à attendre
     * @returns {Promise} Promise résolue après le délai
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Récupère les paramètres URL
     * @returns {object} Objet contenant les paramètres
     */
    getUrlParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    },

    /**
     * Scroll fluide vers un élément
     * @param {string|HTMLElement} target - Sélecteur ou élément cible
     */
    scrollTo(target) {
        const element = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    /**
     * Copie du texte dans le presse-papiers
     * @param {string} text - Texte à copier
     * @returns {Promise<boolean>} true si succès
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copié dans le presse-papiers', 'success');
            return true;
        } catch (error) {
            console.error('Erreur de copie:', error);
            this.showNotification('Erreur lors de la copie', 'error');
            return false;
        }
    },

    /**
     * Télécharge un fichier
     * @param {string} content - Contenu du fichier
     * @param {string} filename - Nom du fichier
     * @param {string} mimeType - Type MIME (défaut: text/plain)
     */
    downloadFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Exporte un tableau en CSV
     * @param {array} data - Données à exporter
     * @param {string} filename - Nom du fichier
     */
    exportToCSV(data, filename = 'export.csv') {
        if (!data || data.length === 0) {
            this.showNotification('Aucune donnée à exporter', 'warning');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header =>
                    JSON.stringify(row[header] || '')
                ).join(',')
            )
        ].join('\n');

        this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
        this.showNotification('Exportation réussie', 'success');
    }
};

// Ajouter les styles d'animation
const utilsStyles = document.createElement('style');
utilsStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(utilsStyles);

// Exposer Utils globalement
window.Utils = Utils;