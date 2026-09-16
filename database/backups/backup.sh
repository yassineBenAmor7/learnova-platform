#!/usr/bin/env bash
# ==============================================================================
# Learnova - PostgreSQL Automated Backup Script (Linux / macOS / WSL)
# ==============================================================================

set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-learnova-platform}"
DB_USER="${DB_USER:-postgres}"

BACKUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/archives"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/learnova_backup_${TIMESTAMP}.dump"

mkdir -p "${BACKUP_DIR}"

echo "=========================================="
echo "Starting Learnova Database Backup..."
echo "Host:     ${DB_HOST}:${DB_PORT}"
echo "Database: ${DB_NAME}"
echo "Target:   ${BACKUP_FILE}"
echo "=========================================="

pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -F c \
  -b \
  -v \
  -f "${BACKUP_FILE}" \
  "${DB_NAME}"

echo "Backup completed successfully!"
echo "File size: $(du -h "${BACKUP_FILE}" | cut -f1)"

# Keep only backups from the last 30 days
find "${BACKUP_DIR}" -type f -name "learnova_backup_*.dump" -mtime +30 -exec rm -f {} +
echo "Old archives rotation checked."
