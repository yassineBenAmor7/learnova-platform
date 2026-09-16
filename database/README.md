# Learnova - Base de Données Relationnelle PostgreSQL & Prisma 7

Ce répertoire contient la documentation technique, les modèles conceptuels et physiques (MCD / MLD / MPD), les migrations et les spécifications d'alimentation (seeding) de la plateforme **Learnova**.

---

## 1. Stack Base de Données

- **SGBD** : PostgreSQL 15+
- **ORM** : Prisma 7.8.0 avec architecture moderne `prisma.config.ts`
- **Adaptateur de Pilote Natif** : `@prisma/adapter-pg`
- **Gestionnaire de Connexions** : `pg.Pool` (node-postgres)
- **Migrations** : Prisma Migrate (`backend/prisma/migrations/`)
- **Intégrité Référentielle** : Clés étrangères avec suppressions en cascade (`onDelete: Cascade`), index composites, contraintes d'unicité

---

## 2. Structure du Répertoire

- **`diagrams/`** : Diagrammes Entité-Association (MCD / ERD) Mermaid et dictionnaire de données.
- **`migrations/`** : Historique des migrations relationnelles appliquées.
- **`seed/`** : Référence des scripts d'alimentation garantissant 100% de données réelles (zéro mock data).

---

## 3. Commandes Usuelles (depuis `backend/`)

```bash
# Valider le schéma Prisma
npx prisma validate

# Générer le client Prisma 7 typé
npx prisma generate

# Vérifier l'état de synchronisation des migrations
npx prisma migrate status

# Appliquer les migrations
npx prisma migrate deploy

# Initialiser et alimenter la base de données
npx prisma db seed
```
