# Cartographie des modules

| Domaine | Responsabilité principale |
|---------|---------------------------|
| School | Établissements, paramètres globaux école |
| Student | Élèves, inscriptions, dossiers |
| Teacher | Enseignants, affectations |
| Parent | Comptes parents, lien aux élèves |
| Attendance | Absences / retards |
| Grades | Évaluations, notes |
| Bulletin | Génération et diffusion des bulletins |
| Payments | Frais, paiements, relances |
| Notifications | Canaux email / push / database |
| Auth | Authentification, sessions, tokens |
| Audit | Journal d’audit, preuve |
| Sync | (Futur) orchestration sync client |
| Settings | Préférences par école / année |

Chaque module suit la structure sous `app/Domains/{Module}/` (Models, Services, Actions, DTO, Policies, Events, Listeners).
