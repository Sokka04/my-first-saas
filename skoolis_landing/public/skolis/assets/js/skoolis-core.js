// ============================================
// skoolis-core.js – Modules complémentaires Skoolis
// Statut serveur · Sauvegarde · Mise à jour
// ============================================

/* ======================================================
   1. SERVER STATUS MANAGER
   Affiche l'état de la connexion au serveur Skoolis
   ====================================================== */
const ServerStatusManager = {
    STATUS: {
        ONLINE:      { key: 'online',       label: 'Connecté à Skoolis',             icon: 'fa-circle-check',    cls: 'status-online' },
        OFFLINE:     { key: 'offline',      label: 'Hors ligne',                     icon: 'fa-circle-xmark',    cls: 'status-offline' },
        MAINTENANCE: { key: 'maintenance',  label: 'Maintenance en cours sur Skoolis',icon: 'fa-tools',           cls: 'status-maintenance' },
        ERROR:       { key: 'error',        label: 'Problème de connexion',          icon: 'fa-triangle-exclamation', cls: 'status-error' },
    },

    currentStatus: null,
    intervalId: null,
    PING_URL: 'https://status.skoolis.app/ping', // remplace par ton vrai endpoint

    /**
     * Initialise le widget de statut dans le header
     */
    init() {
        this._injectWidget();
        this._check();
        this.intervalId = setInterval(() => this._check(), 30_000); // toutes les 30s
    },

    /**
     * Injecte le badge dans .header-icons
     */
    _injectWidget() {
        const headerIcons = document.querySelector('.header-icons');
        if (!headerIcons) return;

        const badge = document.createElement('div');
        badge.id = 'server-status-badge';
        badge.className = 'server-status-badge status-checking';
        badge.title = 'Statut du serveur Skoolis';
        badge.innerHTML = `
            <i class="fas fa-circle-notch fa-spin"></i>
            <span class="status-label">Vérification...</span>
        `;
        badge.addEventListener('click', () => this._showStatusDetail());

        // Insérer avant le bouton thème
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            headerIcons.insertBefore(badge, themeBtn);
        } else {
            headerIcons.prepend(badge);
        }
    },

    /**
     * Vérifie la connexion (fetch avec timeout)
     */
    async _check() {
        try {
            // Simuler le comportement réseau avec navigator.onLine + un fetch rapide
            if (!navigator.onLine) {
                this._apply(this.STATUS.OFFLINE);
                return;
            }

            const ctrl = new AbortController();
            const timeout = setTimeout(() => ctrl.abort(), 5000);

            const res = await fetch(this.PING_URL, {
                method: 'HEAD',
                mode: 'no-cors',
                signal: ctrl.signal,
                cache: 'no-store',
            }).catch(() => null);

            clearTimeout(timeout);

            if (res === null) {
                // fetch a échoué → hors ligne ou erreur
                this._apply(navigator.onLine ? this.STATUS.ERROR : this.STATUS.OFFLINE);
            } else {
                this._apply(this.STATUS.ONLINE);
            }
        } catch (e) {
            if (e.name === 'AbortError') {
                this._apply(this.STATUS.ERROR);
            } else {
                this._apply(navigator.onLine ? this.STATUS.MAINTENANCE : this.STATUS.OFFLINE);
            }
        }
    },

    /**
     * Met à jour l'affichage du badge
     */
    _apply(status) {
        this.currentStatus = status;
        const badge = document.getElementById('server-status-badge');
        if (!badge) return;

        // Réinitialiser les classes
        badge.className = `server-status-badge ${status.cls}`;
        badge.innerHTML = `
            <i class="fas ${status.icon}"></i>
            <span class="status-label">${status.label}</span>
        `;
        badge.title = status.label;
    },

    /**
     * Affiche un popup de détail
     */
    _showStatusDetail() {
        const st = this.currentStatus || this.STATUS.ERROR;
        const last = new Date().toLocaleTimeString('fr-FR');

        const existing = document.getElementById('statusDetailPopup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'statusDetailPopup';
        popup.className = 'popup active';
        popup.innerHTML = `
            <div class="popup-content" style="max-width:420px;">
                <div class="popup-header">
                    <h4><i class="fas fa-server"></i> &nbsp;Statut du serveur Skoolis</h4>
                    <button class="popup-close" onclick="document.getElementById('statusDetailPopup').remove(); document.body.style.overflow='';">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="popup-body" style="padding:24px;">
                    <div class="status-detail-card ${st.cls}">
                        <i class="fas ${st.icon} fa-2x"></i>
                        <div>
                            <strong>${st.label}</strong>
                            <p style="margin:4px 0 0; font-size:13px; opacity:.8;">Dernière vérification : ${last}</p>
                        </div>
                    </div>
                    <div style="margin-top:16px; font-size:13px; color:var(--text-light); line-height:1.7;">
                        ${st.key === 'online'       ? 'Vous êtes correctement connecté(e) aux serveurs Skoolis. Toutes les fonctionnalités sont disponibles.' : ''}
                        ${st.key === 'offline'      ? 'Votre appareil n\'est pas connecté à Internet. Certaines fonctionnalités peuvent être indisponibles.' : ''}
                        ${st.key === 'maintenance'  ? 'Les serveurs Skoolis sont temporairement en maintenance. Vos données locales sont préservées.' : ''}
                        ${st.key === 'error'        ? 'Impossible de joindre les serveurs Skoolis. Vérifiez votre connexion Internet ou réessayez.' : ''}
                    </div>
                </div>
                <div class="popup-footer">
                    <button class="btn btn-secondary" onclick="document.getElementById('statusDetailPopup').remove(); document.body.style.overflow='';">Fermer</button>
                    <button class="btn btn-primary" onclick="ServerStatusManager._check(); document.getElementById('statusDetailPopup').remove(); document.body.style.overflow='';">
                        <i class="fas fa-sync-alt"></i> Vérifier maintenant
                    </button>
                </div>
            </div>
        `;
        popup.addEventListener('click', (e) => {
            if (e.target === popup) { popup.remove(); document.body.style.overflow = ''; }
        });
        document.body.appendChild(popup);
        document.body.style.overflow = 'hidden';
    }
};

/* ======================================================
   2. UPDATE MANAGER (Màj – Skoolis Connect)
   ====================================================== */
const UpdateManager = {
    CURRENT_VERSION: '1.2.0',
    LATEST_VERSION: null,

    init() {
        this._injectSidebarLink();
        this._checkUpdate();
    },

    _injectSidebarLink() {
        // Cherche la section "Aide" dans la sidebar pour y ajouter le bouton Màj
        const navMenus = document.querySelectorAll('.nav-section');
        let aideSection = null;
        navMenus.forEach(s => {
            const title = s.querySelector('.section-title');
            if (title && title.textContent.trim().toLowerCase() === 'aide') aideSection = s;
        });

        if (!aideSection) return;

        const ul = aideSection.querySelector('.nav-menu');
        if (!ul) return;

        const li = document.createElement('li');
        li.className = 'nav-item';
        li.id = 'nav-update-item';
        li.innerHTML = `
            <a href="#" onclick="UpdateManager.openPopup(); return false;">
                <i class="fas fa-cloud-arrow-up"></i>
                <span>Mise à jour (Skoolis Connect)</span>
                <span class="update-dot" id="updateDot" style="display:none;"></span>
            </a>
        `;
        ul.appendChild(li);
    },

    _checkUpdate() {
        // Simulé – en production, fetch l'API Skoolis
        setTimeout(() => {
            this.LATEST_VERSION = '1.3.1'; // simulé
            const dot = document.getElementById('updateDot');
            if (dot && this.LATEST_VERSION !== this.CURRENT_VERSION) {
                dot.style.display = 'inline-block';
            }
        }, 3000);
    },

    openPopup() {
        const existing = document.getElementById('updatePopup');
        if (existing) existing.remove();

        const hasUpdate = this.LATEST_VERSION && this.LATEST_VERSION !== this.CURRENT_VERSION;

        const popup = document.createElement('div');
        popup.id = 'updatePopup';
        popup.className = 'popup active';
        popup.innerHTML = `
            <div class="popup-content" style="max-width:520px;">
                <div class="popup-header">
                    <h4><i class="fas fa-cloud-arrow-up"></i> &nbsp;Skoolis Connect – Mise à jour</h4>
                    <button class="popup-close" onclick="document.getElementById('updatePopup').remove(); document.body.style.overflow='';">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="popup-body" style="padding:24px;">
                    <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
                        <div style="width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,var(--primary-color),var(--primary-light)); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <i class="fas fa-graduation-cap fa-xl" style="color:white;"></i>
                        </div>
                        <div>
                            <h3 style="font-size:1.1rem; margin:0 0 4px;">Skoolis Connect</h3>
                            <p style="font-size:13px; color:var(--text-light);">Synchronisation & Mise à jour de l'application</p>
                        </div>
                    </div>

                    <div class="update-version-row">
                        <div class="update-version-card">
                            <p>Version actuelle</p>
                            <strong>v${this.CURRENT_VERSION}</strong>
                        </div>
                        <i class="fas fa-arrow-right" style="color:var(--text-light);"></i>
                        <div class="update-version-card ${hasUpdate ? 'has-update' : ''}">
                            <p>Dernière version</p>
                            <strong>${this.LATEST_VERSION ? 'v' + this.LATEST_VERSION : '—'}</strong>
                            ${hasUpdate ? '<span class="badge-new">Nouveau</span>' : ''}
                        </div>
                    </div>

                    ${hasUpdate ? `
                    <div style="background:var(--success-bg); border-left:4px solid var(--success-color); padding:12px 16px; border-radius:6px; margin-top:16px; font-size:13px;">
                        <strong style="color:var(--success-color);"><i class="fas fa-circle-info"></i> &nbsp;Mise à jour disponible !</strong>
                        <p style="margin:6px 0 0; color:var(--text-color);">La version ${this.LATEST_VERSION} apporte de nouvelles fonctionnalités et des corrections de bugs.</p>
                    </div>` : `
                    <div style="background:var(--success-bg); border-left:4px solid var(--success-color); padding:12px 16px; border-radius:6px; margin-top:16px; font-size:13px;">
                        <strong style="color:var(--success-color);"><i class="fas fa-circle-check"></i> &nbsp;Skoolis est à jour</strong>
                        <p style="margin:6px 0 0;">Vous utilisez la dernière version disponible.</p>
                    </div>`}

                    <div style="margin-top:20px; font-size:13px; color:var(--text-light); line-height:1.7;">
                        <strong>Skoolis Connect</strong> vous permet de synchroniser vos données avec le cloud Skoolis, de recevoir les mises à jour automatiquement et d'accéder à votre espace depuis n'importe quel appareil.
                    </div>
                </div>
                <div class="popup-footer">
                    <button class="btn btn-secondary" onclick="document.getElementById('updatePopup').remove(); document.body.style.overflow='';">Fermer</button>
                    ${hasUpdate ? `<button class="btn btn-primary" onclick="UpdateManager._startUpdate()">
                        <i class="fas fa-download"></i> Installer la mise à jour
                    </button>` : `<button class="btn btn-primary" onclick="document.getElementById('updatePopup').remove(); document.body.style.overflow='';">
                        <i class="fas fa-check"></i> Parfait
                    </button>`}
                </div>
            </div>
        `;
        popup.addEventListener('click', e => { if (e.target === popup) { popup.remove(); document.body.style.overflow = ''; } });
        document.body.appendChild(popup);
        document.body.style.overflow = 'hidden';
    },

    _startUpdate() {
        const popup = document.getElementById('updatePopup');
        if (!popup) return;
        const body = popup.querySelector('.popup-body');
        body.innerHTML = `
            <div style="text-align:center; padding:32px 0;">
                <i class="fas fa-circle-notch fa-spin fa-3x" style="color:var(--primary-color);"></i>
                <h3 style="margin:20px 0 8px;">Installation en cours…</h3>
                <p style="color:var(--text-light); font-size:14px;">Téléchargement de la mise à jour v${this.LATEST_VERSION}</p>
                <div class="update-progress-bar">
                    <div class="update-progress-fill" id="updateProgressFill"></div>
                </div>
            </div>
        `;
        const footer = popup.querySelector('.popup-footer');
        footer.innerHTML = '';

        let pct = 0;
        const iv = setInterval(() => {
            pct += Math.random() * 15;
            if (pct >= 100) { pct = 100; clearInterval(iv); this._updateDone(); }
            const fill = document.getElementById('updateProgressFill');
            if (fill) fill.style.width = pct + '%';
        }, 400);
    },

    _updateDone() {
        const popup = document.getElementById('updatePopup');
        if (!popup) return;
        popup.querySelector('.popup-body').innerHTML = `
            <div style="text-align:center; padding:32px 0;">
                <i class="fas fa-circle-check fa-3x" style="color:var(--success-color);"></i>
                <h3 style="margin:20px 0 8px;">Mise à jour réussie !</h3>
                <p style="color:var(--text-light); font-size:14px;">Skoolis v${this.LATEST_VERSION} est maintenant installée.</p>
            </div>
        `;
        const footer = popup.querySelector('.popup-footer');
        footer.innerHTML = `<button class="btn btn-primary" onclick="location.reload()"><i class="fas fa-rotate-right"></i> Redémarrer</button>`;
        this.LATEST_VERSION = null; // plus d'update disponible
        const dot = document.getElementById('updateDot');
        if (dot) dot.style.display = 'none';
    }
};

/* ======================================================
   3. BACKUP MANAGER – Sauvegarde automatique
   ====================================================== */
const BackupManager = {
    STORAGE_KEY: 'skoolis-backup-settings',
    LAST_BACKUP_KEY: 'skoolis-last-backup',

    defaultSettings: {
        autoBackup: true,
        frequency: 'daily', // 'daily' | 'weekly' | 'manual'
    },

    settings: {},

    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        this.settings = saved ? JSON.parse(saved) : { ...this.defaultSettings };
        this._scheduleAutoBackup();
    },

    getLastBackupInfo() {
        const ts = localStorage.getItem(this.LAST_BACKUP_KEY);
        if (!ts) return null;
        const d = new Date(parseInt(ts));
        return d.toLocaleString('fr-FR');
    },

    _scheduleAutoBackup() {
        if (!this.settings.autoBackup) return;

        const last = localStorage.getItem(this.LAST_BACKUP_KEY);
        const now  = Date.now();
        const DAY  = 86_400_000;
        const due  = this.settings.frequency === 'daily' ? DAY : DAY * 7;

        if (!last || (now - parseInt(last)) >= due) {
            setTimeout(() => this._doBackup('auto'), 5000);
        }
    },

    _doBackup(mode = 'manual') {
        // Collecte toutes les données localStorage de l'app
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            data[k] = localStorage.getItem(k);
        }
        const blob = JSON.stringify({ timestamp: new Date().toISOString(), mode, data }, null, 2);
        localStorage.setItem(this.LAST_BACKUP_KEY, Date.now().toString());

        if (mode === 'auto') {
            typeof Utils !== 'undefined' && Utils.showNotification && Utils.showNotification('Sauvegarde automatique effectuée', 'success', 3000);
        }
        return blob;
    },

    exportToUSB() {
        const blob = this._doBackup('export');
        const a = document.createElement('a');
        a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(blob);
        a.download = `skoolis-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        typeof Utils !== 'undefined' && Utils.showNotification && Utils.showNotification('Sauvegarde exportée avec succès', 'success');
    },

    saveSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
    },

    /**
     * Ouvre le panneau de sauvegarde (peut être appelé depuis n'importe quelle page)
     */
    openPanel() {
        const existing = document.getElementById('backupPanel');
        if (existing) existing.remove();

        const last = this.getLastBackupInfo();
        const s = this.settings;

        const popup = document.createElement('div');
        popup.id = 'backupPanel';
        popup.className = 'popup active';
        popup.innerHTML = `
            <div class="popup-content" style="max-width:540px;">
                <div class="popup-header">
                    <h4><i class="fas fa-floppy-disk"></i> &nbsp;Sauvegarde des données</h4>
                    <button class="popup-close" onclick="document.getElementById('backupPanel').remove(); document.body.style.overflow='';">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="popup-body" style="padding:24px;">

                    <!-- Statut dernière sauvegarde -->
                    <div class="backup-status-row">
                        <div class="backup-status-icon ${last ? 'ok' : 'none'}">
                            <i class="fas ${last ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
                        </div>
                        <div>
                            <strong>${last ? 'Dernière sauvegarde' : 'Aucune sauvegarde'}</strong>
                            <p style="margin:2px 0 0; font-size:13px; color:var(--text-light);">
                                ${last ? last : 'Aucune sauvegarde n\'a encore été effectuée.'}
                            </p>
                        </div>
                    </div>

                    <!-- Paramètres sauvegarde automatique -->
                    <div class="backup-section">
                        <h4 class="form-section-title"><i class="fas fa-clock-rotate-left"></i> &nbsp;Sauvegarde automatique</h4>
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <label class="backup-toggle-row" id="autoBackupRow">
                                <div>
                                    <strong>Sauvegarde automatique</strong>
                                    <p style="font-size:12px; color:var(--text-light); margin:2px 0 0;">Sauvegarder les données automatiquement</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="autoBackupCheck" ${s.autoBackup ? 'checked' : ''} onchange="BackupManager._toggleAuto(this.checked)">
                                    <span class="toggle-slider"></span>
                                </label>
                            </label>

                            <div class="backup-option-row" id="backupFrequencyRow" style="${!s.autoBackup ? 'opacity:.4; pointer-events:none;' : ''}">
                                <label style="font-size:14px; flex:1;">Fréquence :</label>
                                <select id="backupFrequency" class="form-select" style="max-width:180px;" onchange="BackupManager._changeFreq(this.value)">
                                    <option value="daily"  ${s.frequency === 'daily'  ? 'selected' : ''}>Journalière</option>
                                    <option value="weekly" ${s.frequency === 'weekly' ? 'selected' : ''}>Hebdomadaire</option>
                                    <option value="manual" ${s.frequency === 'manual' ? 'selected' : ''}>Manuelle uniquement</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Actions manuelles -->
                    <div class="backup-section">
                        <h4 class="form-section-title"><i class="fas fa-hand-pointer"></i> &nbsp;Actions manuelles</h4>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <button class="btn btn-secondary" onclick="BackupManager._manualNow()">
                                <i class="fas fa-floppy-disk"></i> Sauvegarder maintenant
                            </button>
                            <button class="btn btn-outline" onclick="BackupManager.exportToUSB()">
                                <i class="fas fa-usb"></i> Exporter sur clé USB / Télécharger
                            </button>
                        </div>
                    </div>

                    <div style="margin-top:8px; font-size:12px; color:var(--text-light); line-height:1.6;">
                        <i class="fas fa-circle-info"></i> &nbsp;La sauvegarde journalière s'effectue automatiquement à chaque ouverture de l'application si les données ont plus de 24h.
                    </div>
                </div>
                <div class="popup-footer">
                    <button class="btn btn-secondary" onclick="document.getElementById('backupPanel').remove(); document.body.style.overflow='';">Fermer</button>
                </div>
            </div>
        `;
        popup.addEventListener('click', e => { if (e.target === popup) { popup.remove(); document.body.style.overflow = ''; } });
        document.body.appendChild(popup);
        document.body.style.overflow = 'hidden';
    },

    _toggleAuto(val) {
        this.settings.autoBackup = val;
        this.saveSettings({});
        const row = document.getElementById('backupFrequencyRow');
        if (row) row.style.cssText = !val ? 'opacity:.4; pointer-events:none;' : '';
        Utils && Utils.showNotification && Utils.showNotification(val ? 'Sauvegarde automatique activée' : 'Sauvegarde automatique désactivée', val ? 'success' : 'warning', 2500);
    },

    _changeFreq(val) {
        this.settings.frequency = val;
        this.saveSettings({});
        Utils && Utils.showNotification && Utils.showNotification('Fréquence mise à jour', 'success', 2000);
    },

    _manualNow() {
        this._doBackup('manual');
        Utils && Utils.showNotification && Utils.showNotification('Sauvegarde effectuée avec succès !', 'success');
        // Rafraîchir le label
        const panel = document.getElementById('backupPanel');
        if (panel) { panel.remove(); document.body.style.overflow = ''; setTimeout(() => this.openPanel(), 200); }
    }
};

/* ======================================================
   4. RÉSULTATS PAR CLASSE – helpers pour resultats.html
   ====================================================== */
const ResultatsManager = {

    // Données de démonstration
    sampleStudents: {
        '3A': [
            { nom:'ABALO Kossi',     mat:'EL-001', t1:16.5, t2:17.4, t3:18.2, decision:'Admis(e)' },
            { nom:'AKAKPO Ama',      mat:'EL-002', t1:15.0, t2:16.8, t3:17.5, decision:'Admis(e)' },
            { nom:'MENSAH Kofi',     mat:'EL-003', t1:14.2, t2:15.2, t3:14.8, decision:'Admis(e)' },
            { nom:'AGBEKO Yawa',     mat:'EL-004', t1:12.5, t2:13.7, t3:12.0, decision:'Admis(e)' },
            { nom:'DOSSOU Mawuli',   mat:'EL-005', t1:11.8, t2:12.9, t3:13.4, decision:'Admis(e)' },
            { nom:'KPOGO Séna',      mat:'EL-010', t1:8.2,  t2:7.5,  t3:8.8,  decision:'Redoublement' },
            { nom:'TCHANTCHOU Eli',  mat:'EL-011', t1:9.5,  t2:9.0,  t3:10.2, decision:'Redoublement' },
        ],
        '3B': [
            { nom:'ADEOTI Reine',    mat:'EL-020', t1:18.0, t2:17.5, t3:18.8, decision:'Admis(e)' },
            { nom:'GBEDEGAN Koffi',  mat:'EL-021', t1:13.2, t2:14.0, t3:13.8, decision:'Admis(e)' },
            { nom:'LOGOH Afia',      mat:'EL-022', t1:10.5, t2:11.2, t3:9.8,  decision:'Redoublement' },
        ],
        '4A': [
            { nom:'NOUATIN Pélagie', mat:'EL-030', t1:15.8, t2:16.2, t3:15.5, decision:'Admis(e)' },
            { nom:'SAMA Kevin',      mat:'EL-031', t1:12.0, t2:11.5, t3:13.2, decision:'Admis(e)' },
        ],
        '5A': [
            { nom:'BOCCO Afi',       mat:'EL-040', t1:17.2, t2:16.8, t3:17.5, decision:'Admis(e)' },
            { nom:'KOMI Delali',     mat:'EL-041', t1:9.5,  t2:10.2, t3:9.0,  decision:'Redoublement' },
        ],
        '6A': [
            { nom:'NAPO Essivi',     mat:'EL-050', t1:16.0, t2:15.5, t3:16.8, decision:'Admis(e)' },
            { nom:'TEVI Edwige',     mat:'EL-051', t1:13.5, t2:14.2, t3:13.0, decision:'Admis(e)' },
        ],
    },

    moy(s) {
        return +((s.t1 + s.t2 + s.t3) / 3).toFixed(2);
    },

    mention(m) {
        if (m >= 16) return { txt:'Très Bien', cls:'badge-green' };
        if (m >= 14) return { txt:'Bien',      cls:'badge-blue' };
        if (m >= 12) return { txt:'Assez Bien',cls:'badge-orange' };
        if (m >= 10) return { txt:'Passable',  cls:'badge-yellow' };
        return          { txt:'Insuffisant',   cls:'badge-red' };
    },

    /**
     * Affiche le classement d'une classe triée par ordre de mérite ou alphabétique
     */
    buildClassementTable(classeId, tbody, sortMode = 'merite') {
        const students = this.sampleStudents[classeId];
        if (!students) { tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-light);">Aucune donnée pour cette classe.</td></tr>`; return; }

        let list = students.map((s, i) => ({ ...s, moy: this.moy(s), idx: i }));

        if (sortMode === 'merite') {
            list.sort((a, b) => b.moy - a.moy);
        } else {
            list.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
        }

        tbody.innerHTML = list.map((s, rank) => {
            const m = this.mention(s.moy);
            const rankDisplay = sortMode === 'merite' ? `<span style="font-weight:700; color:${rank === 0 ? '#f57c00' : 'var(--text-color)'};">${rank < 3 ? ['🥇','🥈','🥉'][rank] + ' ' : ''}${rank + 1}</span>` : '—';
            const moyColor = s.moy >= 10 ? '#4caf50' : '#f44336';
            return `<tr>
                <td>${rankDisplay}</td>
                <td><strong>${s.nom}</strong></td>
                <td style="color:var(--text-light); font-size:13px;">${s.mat}</td>
                <td>${s.t1}</td>
                <td>${s.t2}</td>
                <td>${s.t3}</td>
                <td><span style="font-weight:700; color:${moyColor};">${s.moy}</span></td>
                <td><span class="${m.cls}">${m.txt}</span></td>
                <td><span class="${s.decision === 'Admis(e)' ? 'status active' : 'status inactive'}">${s.decision}</span></td>
            </tr>`;
        }).join('');
    },

    /**
     * Génère l'HTML d'un bulletin
     */
    buildBulletinHTML(student, classe, periode, dateConseil) {
        const moy = this.moy(student);
        const m = this.mention(moy);
        const matieres = [
            { nom:'Mathématiques', coef:4, note: +((student.t1 + student.t2) / 2).toFixed(1) },
            { nom:'Français',      coef:4, note: +((student.t2 + student.t3) / 2).toFixed(1) },
            { nom:'Histoire-Géo',  coef:2, note: +((student.t1 + student.t3) / 2).toFixed(1) },
            { nom:'Sciences',      coef:3, note: +((student.t2 + student.t3) / 2).toFixed(1) },
            { nom:'Anglais',       coef:2, note: student.t1 },
            { nom:'Physique-Chimie', coef:3, note: student.t2 },
            { nom:'SVT',           coef:2, note: student.t3 },
            { nom:'EPS',           coef:1, note: 15.0 },
        ];

        return `
            <div class="bulletin-sheet" data-student="${student.mat}">
                <div class="bulletin-header">
                    <div class="bulletin-header-left">
                        <p style="font-weight:600;">RÉPUBLIQUE TOGOLAISE</p>
                        <p style="font-size:12px;">Travail – Liberté – Patrie</p>
                    </div>
                    <div class="bulletin-header-center">
                        <h3>BULLETIN DE NOTES</h3>
                        <p>${periode} · Année scolaire 2023-2024</p>
                        ${dateConseil ? `<p style="font-size:12px;">Conseil de classe du ${dateConseil}</p>` : ''}
                    </div>
                    <div class="bulletin-header-right">
                        <div class="bulletin-logo-circle">S</div>
                        <p style="font-size:11px; color:var(--primary-color); font-weight:600;">Skoolis</p>
                    </div>
                </div>

                <div class="bulletin-student-info">
                    <div><strong>Nom & Prénom :</strong> ${student.nom}</div>
                    <div><strong>Matricule :</strong> ${student.mat}</div>
                    <div><strong>Classe :</strong> ${classe}</div>
                    <div><strong>Rang :</strong> —</div>
                </div>

                <table class="bulletin-table">
                    <thead>
                        <tr>
                            <th>Matière</th>
                            <th>Coef.</th>
                            <th>Note /20</th>
                            <th>Moy. Coef.</th>
                            <th>Appréciation</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${matieres.map(mat => {
                            const appClass = mat.note >= 14 ? 'color:#4caf50;' : mat.note >= 10 ? '' : 'color:#f44336;';
                            const app = mat.note >= 16 ? 'Excellent' : mat.note >= 14 ? 'Très Bien' : mat.note >= 12 ? 'Bien' : mat.note >= 10 ? 'Assez Bien' : 'Insuffisant';
                            return `<tr>
                                <td>${mat.nom}</td>
                                <td style="text-align:center;">${mat.coef}</td>
                                <td style="text-align:center; font-weight:600; ${appClass}">${mat.note}</td>
                                <td style="text-align:center;">${(mat.note * mat.coef).toFixed(1)}</td>
                                <td style="text-align:center; ${appClass}">${app}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background:var(--primary-color); color:white; font-weight:700;">
                            <td colspan="2">MOYENNE GÉNÉRALE</td>
                            <td style="text-align:center;" colspan="2">${moy} / 20</td>
                            <td style="text-align:center;">${m.txt}</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="bulletin-footer">
                    <div class="bulletin-sign-box">
                        <p><strong>Chef d'établissement</strong></p>
                        <div class="bulletin-sign-area"></div>
                    </div>
                    <div class="bulletin-sign-box">
                        <p><strong>Visa des parents</strong></p>
                        <div class="bulletin-sign-area"></div>
                    </div>
                </div>
            </div>
        `;
    }
};

/* ======================================================
   5. INITIALISATION GLOBALE DES MODULES
   ====================================================== */
const initSkoolisCoreModules = () => {
    if (window.__skoolisCoreInitialized) return;
    window.__skoolisCoreInitialized = true;

    ServerStatusManager.init();
    UpdateManager.init();
    BackupManager.init();

    window.ServerStatusManager = ServerStatusManager;
    window.UpdateManager       = UpdateManager;
    window.BackupManager       = BackupManager;
    window.ResultatsManager    = ResultatsManager;
};

if (!window.__skoolisCoreBootstrapped) {
    window.__skoolisCoreBootstrapped = true;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSkoolisCoreModules, { once: true });
    } else {
        setTimeout(initSkoolisCoreModules, 0);
    }
}
