# Procédures de Sauvegarde et Restauration - Learnova

Ce dossier contient la documentation opérationnelle et les scripts automatisés de sauvegarde (backup) et restauration (restore) pour la base de données PostgreSQL de la plateforme Learnova.

---

## 1. Vue d'Ensemble

La base de données relationnelle PostgreSQL `learnova-platform` héberge :
- Les comptes utilisateurs et rôles sécurisés (mots de passe hashés bcrypt).
- Le catalogue de 108 formations professionnelles réparties sur 14 domaines d'apprentissage.
- 142 sessions pédagogiques et 568 vidéos certifiées YouTube avec notes de cours complètes en Markdown.
- Les examens finaux certifiants (40 questions par examen, seuil de 70%) et quiz pratiques.
- Les inscriptions, le suivi temporel du temps d'apprentissage (`learningTimeSeconds`), les certificats vérifiables avec code QR et le statut de gamification.

---

## 2. Scripts Disponibles

| Fichier | Environnement | Description |
| :--- | :--- | :--- |
| `backup.sh` | Linux / macOS / WSL | Sauvegarde compressée horodatée (`.sql.gz` ou `.dump`) |
| `restore.sh` | Linux / macOS / WSL | Restauration complète à partir d'un fichier de sauvegarde |
| `backup.bat` | Windows PowerShell / CMD | Sauvegarde automatique avec horodatage Windows |
| `restore.bat` | Windows PowerShell / CMD | Restauration guidée pour environnement Windows |

---

## 3. Utilisation Rapide

### Configuration des variables d'environnement
Avant d'exécuter un script, configurez les accès à PostgreSQL :

```bash
# Variables par défaut
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="learnova-platform"
export DB_USER="postgres"
export PGPASSWORD="your_password"
```

### Exécution d'une sauvegarde

**Sous Linux / macOS / WSL :**
```bash
chmod +x database/backups/backup.sh
./database/backups/backup.sh
```

**Sous Windows (PowerShell ou Invite de commandes) :**
```cmd
cd database\backups
backup.bat
```

Les fichiers générés sont enregistrés dans `database/backups/archives/` au format :
`learnova_backup_YYYYMMDD_HHMMSS.dump` (format Custom optimisé pour `pg_restore`).

### Restauration d'une sauvegarde

**Sous Linux / macOS / WSL :**
```bash
./database/backups/restore.sh database/backups/archives/learnova_backup_YYYYMMDD_HHMMSS.dump
```

**Sous Windows :**
```cmd
restore.bat archives\learnova_backup_YYYYMMDD_HHMMSS.dump
```

---

## 4. Automatisation avec Cron (Production Linux)

Pour planifier une sauvegarde quotidienne automatique à 02:00 du matin :

```bash
crontab -e
```
Ajouter la ligne suivante :
```cron
0 2 * * * /path/to/learnova-platform/database/backups/backup.sh >> /var/log/learnova_backup.log 2>&1
```

Une rotation automatique des sauvegardes de plus de 30 jours est intégrée dans `backup.sh`.
