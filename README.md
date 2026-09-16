# Learnova - Plateforme E-Learning Intelligente

<div align="center">

![Learnova Banner](frontend/public/favicon.svg)

**Projet de Fin d'Études / Stage d'Ingénierie**  
**Ministère de l'Enseignement Supérieur et de la Recherche Scientifique**  
**Institut Supérieur des Sciences Appliquées et de Technologie de Sousse (ISSAT Sousse)**  
*En partenariat avec : **Vaerdia***  

**Réalisé par :** Ben Amor Yassine  
**Encadré par :** M. Achraf Makhloufi  
**Année universitaire :** 2026 / 2027  

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 1. Présentation Générale

**Learnova** est une plateforme d'apprentissage en ligne (*e-learning*) intelligente, conçue selon les plus hauts standards académiques et industriels (comparable aux références mondiales telles que **Coursera** et **Udemy**).

Elle propose un parcours complet et immersif composé de sessions pédagogiques structurées, de cours vidéo intégrant des notes de cours exhaustives, d'un système d'évaluation continue et sommative rigoureux, de la génération de certificats sécurisés vérifiables par QR code, et de mécanismes avancés de gamification.

---

## 2. Métriques Clés du Catalogue Pédagogique (100% Données Réelles)

Contrairement aux projets utilisant des données factices (*mock data*), Learnova intègre un corpus pédagogique riche et validé :

- **108 Formations Professionnelles** réparties sur **14 Domaines d'Apprentissage** majeurs :
  - *Informatique & Data*, *Ingénierie Logicielle*, *Marketing Digital*, *Finance & Business*, *Management & Leadership*, *Design & Création*, *Langues & Communication*, *Santé & Bien-être*, *Développement Personnel*, *Sciences Académiques*, *Musique & Arts*, *Vente & E-commerce*, *Sciences Humaines & Sociales*, *Droit & Juridique*.
- **142 Sessions Pédagogiques** ordonnées et cohérentes.
- **568 Vidéos de Cours** validées via le protocole officiel YouTube oEmbed (`HTTP 200 OK`, 0 vidéo inaccessible).
- **Supports Textuels Riches** : Chaque vidéo est accompagnée de notes de cours exhaustives en Markdown (Introduction, Notions Théoriques, Cas d'Usage Réels, Synthèse).
- **250 Évaluations Rigoureuses** :
  - **108 Examens Finaux** certifiants de **40 questions** chacun (seuil de réussite : **70%**).
  - **142 Quiz Pratiques** de **3 questions** ciblées par session (seuil de réussite : **70%**).
- **Miniatures Haute Définition** : Images réelles et thématiques issues d'Unsplash pour chaque cours.

---

## 3. Architecture Technique

```mermaid
graph TD
    Client["Client Web (React 18 + Vite)"]
    API["API REST (NestJS 10 + TypeScript)"]
    Auth["JWT & Passport Strategy"]
    Adapter["@prisma/adapter-pg (Pool natif)"]
    ORM["Prisma 7 ORM (prisma.config.ts)"]
    DB[("Base de Données PostgreSQL 15+")]

    Client -->|Requêtes HTTP / REST| API
    API --> Auth
    API --> ORM
    ORM --> Adapter
    Adapter --> DB
```

### Stack Technologique :
- **Frontend** : React 18, React Router v6, Vite, Context API, CSS3 modulaire responsive, Lucide Icons, Canvas QR Code.
- **Backend** : NestJS 10, TypeScript 5, Passport JWT, Bcrypt, Class-Validator, RxJS.
- **Base de Données & ORM** : PostgreSQL 15+, Prisma 7.8.0 avec architecture découplée (`prisma.config.ts`), adaptateur de pilote natif `@prisma/adapter-pg` et `pg.Pool`.

---

## 4. Fonctionnalités Clés

### A. Gestion des Formations & Sessions
- Navigation par domaine, niveau de difficulté (*Débutant*, *Intermédiaire*, *Avancé*) et type d'accès.
- Découpage pédagogique en sessions progressives avec indicateurs d'avancement en temps réel.

### B. Lecteur Vidéo & Supports de Cours
- Intégration fluide du lecteur vidéo interactif (YouTube IFrame API).
- Enregistrement précis du temps d'apprentissage effectif (`learningTimeSeconds`).
- Affichage de notes de cours au format Markdown synchronisées sous la vidéo.

### C. Évaluations & Certifications
- **Quiz de Session** : Auto-évaluation immédiate pour valider les acquis de chaque session.
- **Examen Final Certifiant** : Examen chronométré de 40 questions conditionnant la délivrance du certificat.
- **Certificat d'Authenticité** : Certificat officiel téléchargeable avec numéro unique et **Code QR scannable** menant à la page publique de vérification (`/certificates/verify/:certificateNumber`).

### D. Gamification & Engagement
- Calcul automatique des séries d'apprentissage (*streaks* quotidiennes).
- Attribution dynamique de badges et points d'expérience selon les jalons franchis.

---

## 5. Modélisation de la Base de Données

Les modèles conceptuels, logiques et physiques conformes à la spécification du mémoire sont disponibles dans le dossier [`database/`](database/) :
- **MCD** : [`database/diagrams/MCD.drawio`](database/diagrams/MCD.drawio)
- **MLD** : [`database/diagrams/MLD.drawio`](database/diagrams/MLD.drawio)
- **MPD** : [`database/diagrams/MPD.drawio`](database/diagrams/MPD.drawio)
- **Sauvegardes** : [`database/backups/README.md`](database/backups/README.md) (scripts automatisés `backup.sh` / `backup.bat`)

---

## 6. Structure du Projet

```text
learnova-platform/
├── backend/                  # Serveur d'API NestJS
│   ├── prisma/               # Schéma Prisma, migrations et seed
│   ├── prisma.config.ts      # Configuration moderne Prisma 7
│   ├── scripts/              # Scripts de maintenance & vérification
│   └── src/                  # Modules métiers (Auth, Courses, Sessions, Quiz, Certificates...)
├── frontend/                 # Application monopage React / Vite
│   ├── public/               # Actifs statiques et favicons
│   └── src/
│       ├── components/       # Composants réutilisables (Player, Certificate, Navbar...)
│       ├── pages/            # Vues principales (Dashboard, Courses, Exam, Quiz...)
│       └── services/         # Clients API Axios
├── database/                 # Documentation et ingénierie de la base de données
│   ├── diagrams/             # Diagrammes MCD, MLD, MPD (draw.io)
│   ├── migrations/           # Historique des migrations Prisma
│   ├── seeds/                # Spécifications du jeu de données réel
│   └── backups/              # Scripts de sauvegarde et restauration
└── README.md                 # Documentation principale du projet
```

---

## 7. Installation et Lancement Local

### Prérequis
- **Node.js** : v18+ ou v20+
- **PostgreSQL** : v15+ en cours d'exécution sur le port 5432

### Configuration du Backend
1. Naviguer dans le dossier backend :
   ```bash
   cd backend
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Créer le fichier `.env` :
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/learnova-platform?schema=public"
   JWT_SECRET="learnova_jwt_secret_key_2026"
   PORT=3000
   ```
4. Appliquer les migrations et initialiser la base de données :
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npx prisma db seed
   ```
5. Démarrer le serveur NestJS en mode développement :
   ```bash
   npm run start:dev
   ```
   L'API est accessible à l'adresse : `http://localhost:3000/api`

### Configuration du Frontend
1. Ouvrir un second terminal et naviguer dans `frontend` :
   ```bash
   cd frontend
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer l'application React avec Vite :
   ```bash
   npm run dev
   ```
   L'application est disponible sur : `http://localhost:5173`

---

## 8. Comptes de Test Pré-configurés

| Rôle | Email | Mot de passe | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin@learnova.com` | `admin123` | Gestion complète, statistiques, administration |
| **Apprenant** | `learner@learnova.com` | `learner123` | Inscriptions, visionnage, quiz, examens, certificats |

---

## 9. Validation & Tests

```bash
# Vérification du backend (TypeScript & NestJS Build)
cd backend && npm run build

# Vérification du frontend (Vite Build)
cd frontend && npm run build
```

---

## 10. Mentions Légales & Droits

Projet développé dans le cadre du stage d'ingénierie à **Vaerdia** pour l'obtention du Diplôme National d'Ingénieur à l'**ISSAT Sousse**.  
Tous droits réservés © 2026 / 2027 - Ben Amor Yassine.
