# Skoolis Ecosystem

Bienvenue dans le dépôt principal du projet **Skoolis**. 

Skoolis est une plateforme complète composée de plusieurs applications et services qui interagissent ensemble pour fournir une expérience d'apprentissage ou de gestion scolaire globale. Ce dépôt centralise l'ensemble des modules (frontend, backend, mobile, desktop et infrastructure) nécessaires au fonctionnement du projet.

## Architecture du Projet

Le projet est divisé en plusieurs sous-dossiers, chacun représentant un composant clé de l'écosystème :

### 1. Interfaces Utilisateurs (Frontends)
- **`skoolis_landing`** : Le site vitrine et la page d'accueil marketing. C'est ici que sont présentées les offres, les fonctionnalités et les formulaires d'inscription ou de contact.
- **`skoolis_app`** : L'application web principale (le tableau de bord ou espace utilisateur). C'est le cœur du produit utilisé par les clients depuis leur navigateur.
- **`skoolis_connect_app`** : Le projet dédié à l'application mobile (iOS/Android) et/ou la PWA (Progressive Web App) pour permettre un accès nomade.
- **`skoolis_desktop`** : La version logicielle pour ordinateur (bureau), offrant potentiellement des fonctionnalités hors-ligne ou des notifications natives.

### 2. Services Backend et API
- **`skoolis_api`** : Le serveur backend principal. Il contient toute la logique métier, la gestion de la base de données, l'authentification et les routes API consommées par tous les frontends (web, mobile, desktop).

### 3. Ressources Communes et Infrastructure
- **`shared`** : Un espace pour le code partagé entre plusieurs applications (par exemple, des types TypeScript communs, des utilitaires, des composants UI de base).
- **`infrastructure`** : Les configurations liées au déploiement, à l'hébergement, aux bases de données ou à l'intégration continue (CI/CD).
- **`docs`** : La documentation technique et fonctionnelle détaillée du projet.

## Comment s'orienter ?

Si vous êtes un nouveau développeur rejoignant le projet, voici quelques recommandations :
- **Pour modifier le site public** : Rendez-vous dans `skoolis_landing`.
- **Pour travailler sur le produit web** : C'est dans `skoolis_app` (ex: pour l'espace utilisateur ou le dashboard).
- **Pour ajouter un point d'API ou modifier la base de données** : Regardez dans `skoolis_api`.
- **Pour développer l'application mobile** : Consultez `skoolis_connect_app`.

Chaque sous-dossier possède généralement son propre fichier `README.md` et ses propres commandes (comme `npm install`, `npm run dev`, etc.) pour le lancer localement. N'hésitez pas à les consulter !
