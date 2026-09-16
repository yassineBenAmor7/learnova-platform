#!/usr/bin/env bash
# ==============================================================================
# Learnova - PostgreSQL Database Restore Script (Linux / macOS / WSL)
# ==============================================================================

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <path_to_backup_file.dump>"
  exit 1
fi

BACKUP_FILE="$1"
if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file '${BACKUP_FILE}' not found!"
  exit 1
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-learnova-platform}"
DB_USER="${DB_USER:-postgres}"

echo "=========================================="
echo "Starting Learnova Database Restore..."
echo "Host:     ${DB_HOST}:${DB_PORT}"
echo "Database: ${DB_NAME}"
echo "Source:   ${BACKUP_FILE}"
echo "=========================================="

read -p "Warning: This will overwrite data in '${DB_NAME}'. Continue? (y/N) " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Restore cancelled."
  exit 0
fi

pg_restore \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  -c \
  --if-exists \
  -v \
  "${BACKUP_FILE}"

echo "Database restored successfully!"
