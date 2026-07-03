# Règles métier — noyau (brouillon)

Ce document doit être enrichi avec les parties prenantes (direction, comptabilité, vie scolaire).

## Multi-écoles

- Un utilisateur “standard” est rattaché à **une** `school_id` sauf profils plateforme explicitement multi-écoles.
- Les rôles Spatie sont **par école** (team = `school_id`).

## Année scolaire

- Les données pédagogiques “courantes” sont rattachées à une **`school_year_id`**.
- Le changement d’année est une opération métier dédiée (clôture / ouverture), pas une simple date système.

## Notes & bulletins

- (À définir) Barème, arrondis, rattrapages, validation par le conseil.
- Toute modification de note après validation doit générer une entrée **audit** et idéalement une justification.

## Données personnelles

- Photos : format et poids max (objectif **WebP**, ~100 Ko après compression côté serveur).
- Conservation : alignement sur la réglementation locale (à préciser par pays).

## Paiements

- (À définir) Facturation, échéances, relances ; pas de logique financière dans Electron.
