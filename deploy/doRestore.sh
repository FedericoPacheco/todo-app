#!/bin/bash
# Usage: doRestore.sh db-backups/backup_20251107_143022.sql.gz
# Make script executable: chmod +x doRestore.sh

DATABASE_USER=postgres
DATABASE_NAME=todo-db

if [ -z "$1" ] || [ ! -f "$1" ]; then
    echo "Usage: bash doRestore.sh <backup-file>"
    exit 1
fi

echo "Restoring from: $1"

sudo docker compose -f docker-compose.prod.yaml down
sudo docker compose -f docker-compose.prod.yaml up -d db --wait

sudo docker compose -f docker-compose.prod.yaml exec -T db \
  psql -U $DATABASE_USER -c "DROP DATABASE IF EXISTS \"$DATABASE_NAME\";"

sudo docker compose -f docker-compose.prod.yaml exec -T db \
  psql -U $DATABASE_USER -c "CREATE DATABASE \"$DATABASE_NAME\";"

gunzip < "$1" | sudo docker compose -f docker-compose.prod.yaml exec -T db \
  psql -U $DATABASE_USER -d $DATABASE_NAME

sudo docker compose -f docker-compose.prod.yaml down
sudo docker compose -f docker-compose.prod.yaml up -d --wait

echo "Restoration complete!"