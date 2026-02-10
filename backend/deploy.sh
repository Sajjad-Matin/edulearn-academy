#!/bin/bash

# Laravel Production Deployment Script
# Run this script on your server after pulling the latest code.

echo "🚀 Starting deployment..."

# 1. Install dependencies
echo "📦 Installing composer dependencies..."
composer install --no-dev --optimize-autoloader

# 2. Run database migrations
echo "🗄️ Running database migrations..."
# Use --force to run migrations in production
php artisan migrate --force

# 3. Optimize application
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 4. Storage Link
echo "🔗 Ensuring storage link exists..."
php artisan storage:link

# 5. Clear old compiled stuff
echo "🧹 Cleaning up..."
php artisan auth:clear-resets

echo "✅ Deployment complete!"
