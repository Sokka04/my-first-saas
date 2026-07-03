# Rapport d'Analyse Globale & Avancement du Projet Skoolis

Ce document présente l'analyse complète de l'état actuel du projet **Skoolis**, le niveau d'avancement (pourcentages de finition par composant et global) et les chantiers nécessaires pour obtenir un produit minimal viable (MVP) robuste.

---

## 1. Pourcentage de Finition du Projet

L'évaluation ci-dessous distingue la partie **Maquette graphique / Prototype client** (très avancée visuellement) de la partie **Moteur applicatif / Backend / Intégration réelle** (au stade de fondations).

### 📊 Tableau de bord de l'avancement

| Composant / Étape | État actuel | % Finition | Remarques / Observations |
| :--- | :--- | :---: | :--- |
| **Site Vitrine (Next.js)** | Fichiers React complets | **95%** | Design premium moderne, SEO configuré, responsive, prêt pour la production. |
| **Portail SaaS (Next.js `/app`)** | Intégration de l'iframe/legacy | **80%** | Charge dynamiquement les pages statiques et réécrit les chemins d'accès (`href/src`), mais n'est pas connecté à l'authentification réelle ni à l'API. |
| **Prototype ERP (HTML/CSS/JS Legacy)** | Fichiers statiques sous `public/skolis` | **90%** *(en tant que maquette)* | Comporte de nombreux écrans (élèves, comptabilité, notes, classements) fonctionnant en local avec du `localStorage` ou des données factices. |
| **API Backend - Socle (Laravel)** | Fondations et Docker | **25%** | Docker, Nginx, Sanctum et migrations de base (écoles, rôles Spatie, audit_logs) configurés. Routes `/health` et `/me` fonctionnelles. |
| **API Backend - Métier (Laravel DDD)** | Aucun code métier implémenté | **0%** | Les domaines métier (élèves, classes, enseignants, notes, écolage, bulletins, paiements) n'existent que dans la documentation. |
| **Client Desktop (Electron)** | Fichier README uniquement | **0%** | Reste entièrement à développer. |
| **Bibliothèque partagée (`shared`)** | Constantes et interfaces minimales | **10%** | Contient uniquement deux fichiers squelettiques (`RoleNames` et `ApiVersion`). |
| **Infrastructure (Docker / Nginx)** | Configuration prête | **85%** | Docker Compose opérationnel avec MySQL/MariaDB, Nginx, configurations SSL et scripts de backup. |

### 📈 Taux de Finition Global du Projet : **35%**
*Le projet dispose d'une excellente vitrine et d'une maquette d'interface client très complète, mais le "moteur" (la base de données dynamique, l'API métier et la synchronisation des données) est à construire.*

---

## 2. Fonctionnement Actuel du Projet

Skoolis est structuré comme un monorepo hybride :

1. **Le Frontend (Next.js dans `skoolis_landing`)** :
   - Gère le site public (Landing, tarifs, fonctionnalités, contact).
   - Fournit une page `/connexion` qui simule l'authentification (elle redirige directement vers `/app` en dur sans interroger l'API).
   - Dans le dossier `/app`, Next.js charge des pages HTML statiques situées dans `public/skolis` via le composant `LegacyHtmlContainer` et le helper `skolis-legacy.ts` qui intercepte et réécrit les liens à la volée.

2. **Le Client de Gestion (HTML/JS Legacy dans `public/skolis`)** :
   - C'est l'application de gestion scolaire proprement dite telle qu'elle s'affiche pour l'utilisateur.
   - **Interactions utilisateurs** : Tout est géré côté client (Navigateur). 
     - **Stockage local** : Les fonctions comme le gestionnaire de sauvegarde (`BackupManager`) font un dump de la mémoire du navigateur dans le `localStorage` ou téléchargent un fichier JSON.
     - **Calculs** : Le calcul des moyennes, classements et l'affichage des bulletins (`ResultatsManager` dans `skoolis-core.js`) sont basés sur des tableaux codés en dur (`sampleStudents`).
     - **Graphiques** : Des widgets dynamiques (générés avec Chart.js via `charts.js` et `app.js`) simulent l'évolution des moyennes.
     - **Formulaires** : Les formulaires (inscription d'élèves, saisie de notes, configuration d'école) valident les champs en JavaScript (`FormManager`), mais ne sauvegardent rien de manière persistante sur un serveur.

3. **Le Backend (Laravel dans `skoolis_api`)** :
   - Conçu selon une architecture modulaire DDD (Domain-Driven Design).
   - Pour le moment, il ne sert que de squelette technique. Les migrations créent les tables de base de données transversales (les structures des écoles, les comptes utilisateurs, le journal d'audit et les permissions de rôles), mais il n'y a aucune table ni aucun contrôleur pour gérer les données scolaires réelles.

---

## 3. Ce qu'il manque pour obtenir un projet Viable (MVP)

Pour transformer ce prototype visuel en une application SaaS viable capable d'accueillir des écoles réelles, plusieurs chantiers majeurs doivent être réalisés :

### A. Établir le modèle de données et l'API Laravel (Priorité 1)
Actuellement, aucune donnée (élèves, notes, paiements) n'est enregistrée en base de données. Il faut créer :
- [ ] Les migrations de base de données pour les entités clés :
  - `classes` (niveaux, salles, capacité).
  - `students` (informations personnelles, matricules, contacts parents).
  - `teachers` (matières enseignées, classes assignées).
  - `enrollments` (liaison étudiant-classe-année scolaire).
  - `grades` (notes des devoirs, examens, coefficients, trimestres).
  - `payments` (frais d'inscription, frais d'écolage payés/restants).
- [ ] Les modèles PHP correspondants sous `app/Domains/{Domain}/Models` (ex: `app/Domains/Student/Models/Student.php`).
- [ ] Les contrôleurs et endpoints API associés dans `routes/api.php` pour permettre la lecture/écriture sécurisée de ces entités.

### B. Connecter le Frontend à l'API (Priorité 2)
L'application client doit cesser d'utiliser des données simulées et interagir avec l'API :
- [ ] **Authentification réelle** : Remplacer le formulaire factice de `connexion/page.tsx` par un appel API vers Laravel Sanctum pour récupérer un token d'accès sécurisé.
- [ ] **Remplacement des mocks JS par des appels Fetch** : Modifier `public/skolis/assets/js/app.js` et les pages associées pour exécuter des requêtes HTTP (`GET`, `POST`, `PUT`, `DELETE`) vers `skoolis_api` au lieu de lire/écrire dans le `localStorage` ou des variables locales.
- [ ] **Sécurité Multi-écoles (Tenant Isolation)** : Assurer que chaque requête API transmet le `school_id` ou utilise le token de l'utilisateur pour cloisonner strictement les données d'une école à l'autre (conformément aux règles du middleware `school.team` déjà en place côté Laravel).

### C. Migration Progressive ou Remplacement du Code Legacy (Recommandé)
L'intégration de fichiers HTML statiques via un chargeur Next.js (`skolis-legacy.ts`) est une excellente solution temporaire pour maquetter, mais pose de lourdes limites pour un produit final (difficulté de maintenance, manque de typage, gestion laborieuse du routage et des scripts globaux).
- [ ] **Recommandation** : Réécrire progressivement les écrans du dossier `public/skolis` (élèves, notes, comptabilité) sous forme de composants React natifs Next.js dans `skoolis_landing/app/app/`. Cela permettra de bénéficier d'une gestion d'état moderne (React Query, SWR), d'une sécurité accrue, et d'un typage TypeScript rigoureux.

### D. Développement du Client Electron & Stratégie Hors-Ligne (Priorité 3)
La documentation du projet évoque une synchronisation future et un client lourd Electron pour les écoles ayant des connexions internet instables.
- [ ] Initialiser le projet sous `skoolis_desktop` avec Electron.
- [ ] Mettre en place la stratégie de synchronisation locale (SQLite local synchronisé avec MariaDB via l'API lors des retours de connexion).
