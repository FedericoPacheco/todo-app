#!/bin/bash
# Usage: bash doBackup.sh
# Make script executable: chmod +x doBackup.sh

DATABASE_USER=postgres
DATABASE_NAME=todo-db

mkdir -p ./db-backups
sudo docker compose -f docker-compose.prod.yaml exec -T db \
  pg_dump -U $DATABASE_USER $DATABASE_NAME | gzip > "./db-backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz"

echo "Backup created!"