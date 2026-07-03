# API HTTP — conventions

## Base URL

- Préfixe : **`/api/v1`**
- Format : **JSON**
- Auth : **Bearer token** (Laravel Sanctum), header `Authorization: Bearer {token}`
- CSRF : pour les clients same-origin (SPA), cookie + header `X-XSRF-TOKEN` selon configuration Sanctum.

## Versionnement

Breaking changes → nouvelle version (`v2`). Les clients doivent annoncer une version client si besoin (header optionnel, à documenter lors de la première release).

## Erreurs

Réponses structurées Laravel / HTTP standards :

- `401` — non authentifié
- `403` — interdit (policy / permission)
- `422` — validation
- `404` — ressource inconnue **dans le périmètre** `school_id`

Ne jamais exposer une ressource d’une autre école : répondre `404` plutôt que `403` si nécessaire pour éviter la fuite d’existence.

## Pagination

Cursor ou `page` / `per_page` (à uniformiser dans les contrôleurs ; défaut Laravel `paginate` documenté par ressource).

## Idempotence (sync futur)

Les endpoints de mutation critique pourront exiger un header `Idempotency-Key` ; à ajouter au moment de la sync.
