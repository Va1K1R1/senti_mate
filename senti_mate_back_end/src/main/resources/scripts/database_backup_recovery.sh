#!/bin/bash

# Database Backup and Recovery Script for SentiMate
# This script provides functions for backing up and recovering the MySQL database used by SentiMate.

# Configuration
DB_NAME="sentimate_db"
DB_USER="root"
DB_PASSWORD="password"
BACKUP_DIR="/var/backups/sentimate"
RETENTION_DAYS=30
LOG_FILE="/var/log/sentimate/database_backup.log"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR
mkdir -p $(dirname $LOG_FILE)

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Backup function
backup_database() {
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/sentimate_backup_$TIMESTAMP.sql.gz"
    
    log "Starting database backup..."
    
    # Create backup with mysqldump and compress it
    if mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_FILE; then
        log "Backup completed successfully: $BACKUP_FILE"
        
        # Create a symlink to the latest backup
        ln -sf $BACKUP_FILE $BACKUP_DIR/latest_backup.sql.gz
        
        # Remove old backups
        find $BACKUP_DIR -name "sentimate_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
        log "Removed backups older than $RETENTION_DAYS days"
    else
        log "ERROR: Backup failed!"
        exit 1
    fi
}

# Recovery function
recover_database() {
    if [ -z "$1" ]; then
        BACKUP_FILE="$BACKUP_DIR/latest_backup.sql.gz"
        log "No backup file specified, using latest backup: $BACKUP_FILE"
    else
        BACKUP_FILE="$1"
        log "Using specified backup file: $BACKUP_FILE"
    fi
    
    if [ ! -f "$BACKUP_FILE" ]; then
        log "ERROR: Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    log "Starting database recovery..."
    
    # Drop and recreate the database
    mysql -u $DB_USER -p$DB_PASSWORD -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;"
    
    # Restore from backup
    if gunzip < $BACKUP_FILE | mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME; then
        log "Recovery completed successfully from: $BACKUP_FILE"
    else
        log "ERROR: Recovery failed!"
        exit 1
    fi
}

# Point-in-time recovery function
point_in_time_recovery() {
    if [ -z "$1" ]; then
        log "ERROR: No timestamp specified for point-in-time recovery"
        exit 1
    fi
    
    RECOVERY_TIMESTAMP="$1"
    log "Starting point-in-time recovery to: $RECOVERY_TIMESTAMP"
    
    # Find the closest backup before the specified timestamp
    BACKUP_FILE=$(find $BACKUP_DIR -name "sentimate_backup_*.sql.gz" -type f | sort | grep -v "sentimate_backup_$RECOVERY_TIMESTAMP" | tail -1)
    
    if [ -z "$BACKUP_FILE" ]; then
        log "ERROR: No suitable backup found for point-in-time recovery"
        exit 1
    fi
    
    log "Using backup file: $BACKUP_FILE"
    
    # Restore from backup
    recover_database $BACKUP_FILE
    
    # Apply binary logs up to the specified timestamp
    # Note: This requires binary logging to be enabled in MySQL
    log "Applying binary logs up to: $RECOVERY_TIMESTAMP"
    mysqlbinlog --stop-datetime="$RECOVERY_TIMESTAMP" /var/lib/mysql/mysql-bin.* | mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME
    
    log "Point-in-time recovery completed successfully"
}

# Automated backup schedule
schedule_backups() {
    log "Setting up automated backup schedule"
    
    # Create a cron job for daily backups at 2 AM
    (crontab -l 2>/dev/null; echo "0 2 * * * $0 backup") | crontab -
    
    log "Automated backups scheduled for 2 AM daily"
}

# Main script execution
case "$1" in
    backup)
        backup_database
        ;;
    recover)
        recover_database "$2"
        ;;
    point-in-time)
        point_in_time_recovery "$2"
        ;;
    schedule)
        schedule_backups
        ;;
    *)
        echo "Usage: $0 {backup|recover [backup_file]|point-in-time [timestamp]|schedule}"
        exit 1
        ;;
esac

exit 0