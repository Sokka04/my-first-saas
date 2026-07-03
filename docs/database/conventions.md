# Conventions base de données

## Colonnes transverses (entités métier)

Lorsque applicable :

| Colonne | Usage |
|--------|--------|
| `id` | UUID (char 36), généré côté app |
| `school_id` | Isolation multi-écoles ; index obligatoire |
| `school_year_id` | Données liées à une année (notes, bulletins, présences annuelles, etc.) |
| `created_by` / `updated_by` | `users.id` (UUID), nullable si inconnu |
| `created_at` / `updated_at` | Timestamps |
| `deleted_at` | Soft delete quand la suppression doit être traçable / réversible |

## Filtrage des requêtes

Toute liste métier doit inclure **`school_id`** ; les données scolaires courantes incluent en plus **`school_year_id`** pour limiter la volumétrie et les index.

## Archivage

- Table **`school_years`** : référentiel des années (ex. 2025-2026).
- **Clôturer** une année : statut métier + politique d’accès en lecture ; pas de “DELETE” massif pour l’historique.
- **Partitions / tables froides** : à étudier quand la volumétrie l’imposera (après mesure sur MariaDB).

## Fichiers

Contenu binaire uniquement sur disque : `storage/app/schools/{school_uuid}/students|bulletins|logos|exports`.

## Audit

Table **`audit_logs`** (voir migration) pour les actions sensibles : qui, quoi, entité, avant/après, IP, contexte appareil.
