#!/usr/bin/env bash
# Exit on error
set -o errexit

# Change to server directory first
cd server
bundle install

# Build frontend
cd ../web
npm install
npm run build

# Copy built frontend to Rails public directory
cp -r dist/* ../server/public/

# Return to server directory
cd ../server

# Run database migrations
bin/rails db:migrate
