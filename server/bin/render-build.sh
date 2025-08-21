#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Ruby dependencies
bundle install

# Build frontend
cd ../web
npm install
npm run build

# Copy built frontend to Rails public directory
cp -r dist/* ../server/public/

# Return to server directory
cd ../server

# Precompile assets
bin/rails assets:precompile
bin/rails assets:clean

# Run database migrations
bin/rails db:migrate
