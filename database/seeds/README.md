# Alimentation des Données (Seeding) - Learnova

Le pipeline de peuplement garantit une base de données de niveau production, avec **100% de données réelles et vérifiées** (aucune donnée fictive / zéro mock data).

### Données Actuelles en Base :
- **Utilisateurs & Rôles** : Administrateur (`admin@learnova.com`) et Apprenant (`learner@learnova.com`).
- **108 Formations Professionnelles** réparties sur 14 domaines d'apprentissage (Informatique, IA & Data, Ingénierie Logicielle, Marketing, Finance & Business, Management, Design & Création, Langues, etc.).
- **142 Sessions Pédagogiques**.
- **568 Vidéos de Cours** validées avec le protocole officiel oEmbed de YouTube (100% fonctionnelles, intégrables sans blocage).
- **Supports Pédagogiques Détaillés** : Notes de cours exhaustives au format Markdown pour chaque vidéo (Introduction, Concepts Clés, Applications Pratiques, Exercices d'Auto-évaluation, Synthèse).
- **250 Évaluations Rigoureuses** :
  - **108 Examens Finaux** certifiants de 40 questions chacun (seuil de réussite : 70%).
  - **142 Quiz Pratiques** de 3 questions ciblées par session (seuil de réussite : 70%).
- **Certificats Numériques d'Authenticité** avec code QR dynamique de vérification publique.

### Scripts d'Exécution :
Les scripts TypeScript de seeding et d'enrichissement se trouvent dans :
- [`backend/prisma/seed.ts`](../../backend/prisma/seed.ts)
- [`backend/scripts/fix-all-videos-coherent.ts`](../../backend/scripts/fix-all-videos-coherent.ts)

Pour ré-exécuter le seed :
```bash
cd backend
npx prisma db seed
```
