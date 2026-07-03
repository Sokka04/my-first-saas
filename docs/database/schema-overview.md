# Vue schéma (phase initiale)

## Référentiels

- **schools** — établissement (tenant logique).
- **school_years** — année scolaire par école (début / fin, libellé, statut).

## Sécurité & accès

- **users** — comptes avec `school_id` nullable (ex. super-admin plateforme).
- **roles / permissions** (Spatie) — **teams** activés avec `school_id` pour des rôles par école.
- **personal_access_tokens** (Sanctum) — tokens API (SPA, Electron, mobile).

## Métier (à détailler dans les migrations suivantes)

Entités prévues : students, teachers, parents/guardians, classes, subjects, enrollments, attendances, grades, bulletins, payments, notifications, settings par école.

## Transversal

- **audit_logs** — traçabilité des changements sensibles.

Les migrations successives ajouteront les tables métier en respectant `school_id`, `school_year_id` et UUID.
