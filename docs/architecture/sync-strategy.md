# Stratégie de synchronisation (préparation)

## Objectif

Permettre plus tard : clients **Electron hors ligne**, plusieurs postes, éventuelle résolution de conflits, sans refonte des identifiants.

## Décisions déjà prises

- **Clés primaires UUID** sur les entités métier exposées hors serveur (élèves, notes, paiements, etc.).
- **Horodatages** `created_at` / `updated_at` sur les tables concernées.
- **Scoping** obligatoire : `school_id`, et souvent `school_year_id` pour les données pédagogiques.

## À spécifier avant implémentation

- Modèle de conflit (last-write-wins vs merge métier).
- Journal des changements (event log / outbox) côté API.
- Filtres de sync par domaine (ex. uniquement une année, un périmètre classe).
- Authentification des appareils (tokens Sanctum par machine ou certificat).

Ce document sera complété quand les flux offline seront cadrés avec les utilisateurs finaux.
