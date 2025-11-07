#!/bin/bash
# Make script executable: chmod +x doDeploy.sh

echo "Starting deployment..."

echo "Checking for SSL certificates..."
if [ ! -f "./nginx/ssl/cert.pem" ]; then
    echo "Error: SSL certificates not found!"
    echo "Please ensure certificates are in deploy/nginx/ssl/"
    exit 1
fi

echo "Stopping containers..."
sudo docker compose -f docker-compose.prod.yaml down

echo "Deploying containers with new changes..."
sudo docker network create todo-net || true
sudo docker compose -f docker-compose.prod.yaml up -d --build --wait

echo "Running database migrations..."
sudo docker compose -f docker-compose.prod.yaml exec -T api npm run db-migrate:up

echo "Deployment complete!"
sudo docker compose -f docker-compose.prod.yaml ps