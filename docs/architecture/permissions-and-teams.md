# Permissions (Spatie) et équipes par école

- **Teams** : la clé d’équipe est `school_id` (voir `config/permission.php`).
- **Contexte** : le middleware `school.team` (`SetPermissionsTeamFromUser`) appelle `setPermissionsTeamId($user->school_id)` après `auth:sanctum`, pour que les vérifications de rôles / permissions s’appliquent dans le bon établissement.
- **Comptes sans école** (`school_id` null) : contexte plateforme ; les rôles globaux (si vous en définissez avec `school_id` null en base) devront être documentés et testés à part.

Les noms de rôles métier sont centralisés côté code dans `shared/constants/RoleNames.php` (convention, pas encore en base).
