#!/bin/bash
# Usage: bash doBackup.sh
# Make script executable: chmod +x doBackup.sh

sudo --preserve-env docker compose -f docker-compose.prod.yaml exec -T db \
  pg_dump -U ${DATABASE_USER} ${DATABASE_NAME} | gzip > "./db-backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz"

echo "Backup created!"