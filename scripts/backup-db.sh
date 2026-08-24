#!/bin/bash

# Configuration
BACKUP_DIR="/data/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER="automatiza-db"
DB_NAME="automatiza"
DB_USER="user"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting backup of $DB_NAME at $TIMESTAMP..."

# Perform the backup using pg_dump inside the container
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Compress the backup
gzip "$BACKUP_DIR/backup_$TIMESTAMP.sql"

echo "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Optional: Clean up old backups (older than 7 days)
# find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
