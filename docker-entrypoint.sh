#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
# Using nc for availability check
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "PostgreSQL is up!"

# Initialize storage structure
STORAGE_ROOT=${STORAGE_PATH:-/data/storage}
echo "Initializing storage structure at $STORAGE_ROOT..."
mkdir -p "$STORAGE_ROOT/logos" \
         "$STORAGE_ROOT/previews" \
         "$STORAGE_ROOT/uploads" \
         "$STORAGE_ROOT/documents" \
         "$STORAGE_ROOT/proofs"

# Ensure permissions (app user in Docker typically has UID 1000 or similar)
# chmod -R 775 "$STORAGE_ROOT"

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting application..."
exec node .output/server/index.mjs
