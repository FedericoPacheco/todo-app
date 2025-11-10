#!/bin/bash
# Make script executable: chmod +x doDeploy.sh

echo "Creating debugging file..."
cat > .env <<EOF
DATABASE_USER=$DATABASE_USER
DATABASE_PASSWORD=$DATABASE_PASSWORD
DATABASE_NAME=$DATABASE_NAME
SESSION_PASSWORD=$SESSION_PASSWORD
SESSION_SECRET=$SESSION_SECRET
EOF

echo "Starting deployment..."

echo "Checking for SSL certificates..."
if [ ! -f "./nginx/ssl/cert.pem" ]; then
    echo "Error: SSL certificates not found!"
    echo "Please ensure certificates are in deploy/nginx/ssl/"
    exit 1
fi

echo "Stopping containers..."
sudo --preserve-env=DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,SESSION_PASSWORD,SESSION_SECRET docker compose -f docker-compose.prod.yaml down || true

echo "Deploying containers with new changes..."
sudo --preserve-env=DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,SESSION_PASSWORD,SESSION_SECRET docker network create todo-net || true
sudo --preserve-env=DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,SESSION_PASSWORD,SESSION_SECRET docker compose -f docker-compose.prod.yaml up -d --build --wait

echo "Running database migrations..."
sudo --preserve-env=DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,SESSION_PASSWORD,SESSION_SECRET docker compose -f docker-compose.prod.yaml exec -T api npm run db-migrate:up

echo "Deployment complete!"
sudo --preserve-env=DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,SESSION_PASSWORD,SESSION_SECRET docker compose -f docker-compose.prod.yaml ps