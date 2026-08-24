#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/data/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
# Fallback to DB_HOST and DB_USER from env if container name isn't applicable
DB_CONTAINER="${DB_CONTAINER:-automatiza-db}"
DB_NAME="${DB_NAME:-automatiza}"
DB_USER="${DB_USER:-user}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting backup of $DB_NAME at $TIMESTAMP..."

# Check if we are running inside docker or have local pg_dump
if command -v pg_dump > /dev/null; then
    # Use DATABASE_URL if available, otherwise construct from parts
    if [ -n "$DATABASE_URL" ]; then
        pg_dump "$DATABASE_URL" > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
    else
        pg_dump -h "${DB_HOST:-localhost}" -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
    fi
elif command -v docker > /dev/null; then
    docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
else
    echo "Error: Neither pg_dump nor docker found. Cannot perform backup."
    exit 1
fi

# Compress the backup
gzip "$BACKUP_DIR/backup_$TIMESTAMP.sql"

echo "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Optional: Clean up old backups (older than 7 days)
# find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
