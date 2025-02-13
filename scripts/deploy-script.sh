#!/bin/bash

# Stop the PM2 daemon processes
echo "Stopping PM2 processes..."
pm2 stop server || true
pm2 stop cron || true

# Navigate to the project directory (modify this path as needed)
cd ./TradeGlobaX2/ || exit

# Pull the latest code from the repository
echo "Pulling latest code from repository..."
git pull origin main

# Install dependencies and build the project
echo "Installing dependencies..."
npm run installAll
npm run buildWeb

# Start the PM2 processes
echo "Starting PM2 processes..."
pm2 start ./backend/APIservice/server.js
pm2 start ./backend/webFetcher/cron.js

echo "Deployment completed successfully!"