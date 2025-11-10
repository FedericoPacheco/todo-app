#!/bin/bash
# Make script executable: chmod +x doDeploy.sh


# If changing postgres credentials, make sure to remove the stale volume to force recreation
# (quick and dirty solution, beware of data loss!):
# sudo docker volume rm deploy_postgres-data

# echo "Creating env variables debugging file inside server..."
# cat > debug-env <<EOF
# DATABASE_USER=$DATABASE_USER
# DATABASE_PASSWORD=$DATABASE_PASSWORD
# DATABASE_NAME=$DATABASE_NAME
# SESSION_PASSWORD=$SESSION_PASSWORD
# SESSION_SECRET=$SESSION_SECRET
# EOF

echo "Starting deployment..."

echo "Checking for SSL certificates..."
if [ ! -f "./nginx/ssl/cert.pem" ]; then
    echo "Error: SSL certificates not found!"
    echo "Please ensure certificates are in deploy/nginx/ssl/"
    exit 1
fi

echo "Stopping containers..."
sudo --preserve-env docker compose -f docker-compose.prod.yaml down || true

echo "Deploying containers with new changes..."
sudo --preserve-env docker network create todo-net || true
sudo --preserve-env docker compose -f docker-compose.prod.yaml up -d --build --wait

# echo "Creating env variables debugging file inside api container..."
# sudo docker compose -f docker-compose.prod.yaml exec -T api sh -c 'env > debug-env-inside-api'
# Read file inside server: sudo docker compose -f docker-compose.prod.yaml exec api cat debug-env-inside-api

echo "Running database migrations..."
sudo --preserve-env docker compose -f docker-compose.prod.yaml exec -T api npm run db-migrate:up

echo "Deployment complete!"
sudo --preserve-env docker compose -f docker-compose.prod.yaml ps