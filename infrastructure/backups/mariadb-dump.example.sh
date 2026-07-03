#!/usr/bin/env bash
# Exemple de dump quotidien — à placer dans cron + rotation des fichiers.
set -euo pipefail
BACKUP_DIR="/var/backups/skoolis"
DATE="$(date +%Y%m%d_%H%M)"
mkdir -p "$BACKUP_DIR"
mysqldump -h 127.0.0.1 -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" \
  | gzip > "$BACKUP_DIR/skoolis_${DATE}.sql.gz"
