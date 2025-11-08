#!/bin/bash
# Usage: doRestore.sh [backup-file]
# If no argument, restores from latest backup
# Make script executable: chmod +x doRestore.sh

if [ -z "$1" ]; then
    BACKUP_FILE=$(ls -t ./db-backups/backup_*.sql.gz 2>/dev/null | head -1)
    if [ -z "$BACKUP_FILE" ]; then
        echo "No backups found in ./db-backups/"
        exit 1
    fi
else
    BACKUP_FILE="$1"
    if [ ! -f "$BACKUP_FILE" ]; then
        echo "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
fi

echo "Restoring from: $BACKUP_FILE"

echo "Stopping api, session-db, and nginx containers and running db container..."
sudo --preserve-env docker compose -f docker-compose.prod.yaml stop api session-db nginx || true
sudo --preserve-env docker compose -f docker-compose.prod.yaml up db -d --wait || true

echo "Dropping and recreating database..."
sudo --preserve-env docker compose -f docker-compose.prod.yaml exec -T db \
  psql -U ${DATABASE_USER} -c "DROP DATABASE IF EXISTS ${DATABASE_NAME};"

sudo --preserve-env docker compose -f docker-compose.prod.yaml exec -T db \
  psql -U ${DATABASE_USER} -c "CREATE DATABASE ${DATABASE_NAME};"

gunzip < "$BACKUP_FILE" | sudo --preserve-env docker compose -f docker-compose.prod.yaml exec -T db \
  psql -U ${DATABASE_USER} -d ${DATABASE_NAME}

# Lift containers back up manually or on doDeploy.sh
echo "Restoration complete! Please start the containers back up using doDeploy.sh" 
