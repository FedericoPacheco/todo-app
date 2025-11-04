#!/bin/bash

# Make script executable: chmod +x doDeploy.sh

echo "Starting deployment..."

echo "Getting latest changes..."
git pull origin main

# Certificates are preserved (not tracked by git)
# Check if certificates exist
if [ ! -f "deploy/nginx/ssl/cert.pem" ]; then
    echo "Error: SSL certificates not found!"
    echo "Please ensure certificates are in deploy/nginx/ssl/"
    exit 1
fi

echo "Building frontend..."
cd ../front-end
npm install
npm run build:prod
cd ../deploy

# Deploy with Docker Compose
echo "Starting Docker containers..."
docker compose -f docker-compose.prod.yaml down
docker compose -f docker-compose.prod.yaml up -d --build

# Show status
echo "Deployment complete!"
docker compose -f docker-compose.prod.yaml ps   