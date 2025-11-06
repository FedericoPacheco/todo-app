#!/bin/bash

# Make script executable: chmod +x doDeploy.sh

echo "Starting deployment..."

echo "Getting latest changes..."
# Temporality on development branch for testing purposes
git pull origin development
# git pull origin main

echo "Checking for SSL certificates..."
if [ ! -f "deploy/nginx/ssl/cert.pem" ]; then
    echo "Error: SSL certificates not found!"
    echo "Please ensure certificates are in deploy/nginx/ssl/"
    exit 1
fi

echo "Building frontend..."
cd ../front-end
# Prefer npm ci for reproducible installs; fall back to npm install if no lockfile
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
npm run build:prod
cd ../deploy

echo "Deploying with Docker Compose..."
sudo docker compose -f docker-compose.prod.yaml down
sudo docker network create todo-net
sudo docker compose -f docker-compose.prod.yaml up -d --build --wait

echo "Running database migrations..."
sudo docker compose -f docker-compose.prod.yaml exec -T api npm run db-migrate:up

echo "Deployment complete!"
sudo docker compose -f docker-compose.prod.yaml ps