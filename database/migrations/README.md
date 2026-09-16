# Migrations Relationnelles PostgreSQL - Learnova

Les migrations de schéma sont gérées nativement avec **Prisma Migrate**.

L'historique complet et les scripts SQL d'évolution de la base de données se trouvent dans :
📁 [`backend/prisma/migrations/`](../../backend/prisma/migrations/)

### Principales étapes de migration :
1. `20260802100236_add_cascade_delete_to_questions` : Mise en place des suppressions en cascade pour l'intégrité relationnelle des questions/options de quiz.
2. `20260826112350_` : Support du mode examen, suivi fin du temps d'apprentissage (`learningTimeSeconds`), et lecture des supports textuels de cours.
3. `20260902112752_change_domain_to_string` : Généralisation dynamique des 14 domaines d'apprentissage académiques et professionnels.

### Commandes :
```bash
# Vérifier l'état des migrations
npx prisma migrate status

# Appliquer en production
npx prisma migrate deploy
```
