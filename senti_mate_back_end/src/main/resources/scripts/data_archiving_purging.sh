#!/bin/bash

# Data Archiving and Purging Script for SentiMate
# This script provides functions for archiving and purging old data from the SentiMate database.

# Configuration
DB_NAME="sentimate_db"
DB_USER="j"
DB_PASSWORD="4820"
ARCHIVE_DIR="/var/archives/sentimate"
LOG_FILE="/var/log/sentimate/data_archiving.log"

# Retention periods (in days)
DIARY_RETENTION=730  # 2 years
HEALTH_DATA_RETENTION=1095  # 3 years
RECOMMENDATION_RETENTION=365  # 1 year

# Create archive directory if it doesn't exist
mkdir -p $ARCHIVE_DIR
mkdir -p $(dirname $LOG_FILE)

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Archive function for diary entries
archive_diary_entries() {
    CUTOFF_DATE=$(date -d "$DIARY_RETENTION days ago" +%Y-%m-%d)
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    ARCHIVE_FILE="$ARCHIVE_DIR/diary_entries_archive_$TIMESTAMP.csv"
    
    log "Starting diary entries archiving for entries older than $CUTOFF_DATE..."
    
    # Export old diary entries to CSV
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT d.*, e.id as emotion_id, e.name as emotion_name, e.intensity, e.description as emotion_description, e.color_code, e.created_at as emotion_created_at
        FROM diary_entries d
        LEFT JOIN emotions e ON d.id = e.diary_entry_id
        WHERE d.created_at < '$CUTOFF_DATE'
        INTO OUTFILE '$ARCHIVE_FILE'
        FIELDS TERMINATED BY ',' 
        ENCLOSED BY '\"' 
        LINES TERMINATED BY '\n'
    "
    
    if [ $? -eq 0 ]; then
        log "Diary entries successfully archived to: $ARCHIVE_FILE"
        
        # Compress the archive
        gzip $ARCHIVE_FILE
        log "Archive compressed: $ARCHIVE_FILE.gz"
        
        return 0
    else
        log "ERROR: Failed to archive diary entries"
        return 1
    fi
}

# Archive function for health data
archive_health_data() {
    CUTOFF_DATE=$(date -d "$HEALTH_DATA_RETENTION days ago" +%Y-%m-%d)
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    ARCHIVE_FILE="$ARCHIVE_DIR/health_data_archive_$TIMESTAMP.csv"
    
    log "Starting health data archiving for data older than $CUTOFF_DATE..."
    
    # Export old health data to CSV
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT * FROM health_data
        WHERE date < '$CUTOFF_DATE'
        INTO OUTFILE '$ARCHIVE_FILE'
        FIELDS TERMINATED BY ',' 
        ENCLOSED BY '\"' 
        LINES TERMINATED BY '\n'
    "
    
    if [ $? -eq 0 ]; then
        log "Health data successfully archived to: $ARCHIVE_FILE"
        
        # Compress the archive
        gzip $ARCHIVE_FILE
        log "Archive compressed: $ARCHIVE_FILE.gz"
        
        return 0
    else
        log "ERROR: Failed to archive health data"
        return 1
    fi
}

# Archive function for recommendations
archive_recommendations() {
    CUTOFF_DATE=$(date -d "$RECOMMENDATION_RETENTION days ago" +%Y-%m-%d)
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    ARCHIVE_FILE="$ARCHIVE_DIR/recommendations_archive_$TIMESTAMP.csv"
    
    log "Starting recommendations archiving for entries older than $CUTOFF_DATE..."
    
    # Export old recommendations to CSV
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT * FROM recommendations
        WHERE created_at < '$CUTOFF_DATE'
        INTO OUTFILE '$ARCHIVE_FILE'
        FIELDS TERMINATED BY ',' 
        ENCLOSED BY '\"' 
        LINES TERMINATED BY '\n'
    "
    
    if [ $? -eq 0 ]; then
        log "Recommendations successfully archived to: $ARCHIVE_FILE"
        
        # Compress the archive
        gzip $ARCHIVE_FILE
        log "Archive compressed: $ARCHIVE_FILE.gz"
        
        return 0
    else
        log "ERROR: Failed to archive recommendations"
        return 1
    fi
}

# Purge function for diary entries
purge_diary_entries() {
    CUTOFF_DATE=$(date -d "$DIARY_RETENTION days ago" +%Y-%m-%d)
    
    log "Starting purge of diary entries older than $CUTOFF_DATE..."
    
    # First archive the data
    archive_diary_entries
    
    if [ $? -eq 0 ]; then
        # Delete emotions related to old diary entries
        DELETED_EMOTIONS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            SELECT COUNT(*) FROM emotions e
            JOIN diary_entries d ON e.diary_entry_id = d.id
            WHERE d.created_at < '$CUTOFF_DATE'
        " | tail -1)
        
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            DELETE e FROM emotions e
            JOIN diary_entries d ON e.diary_entry_id = d.id
            WHERE d.created_at < '$CUTOFF_DATE'
        "
        
        # Delete old diary entries
        DELETED_ENTRIES=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            SELECT COUNT(*) FROM diary_entries
            WHERE created_at < '$CUTOFF_DATE'
        " | tail -1)
        
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            DELETE FROM diary_entries
            WHERE created_at < '$CUTOFF_DATE'
        "
        
        log "Purged $DELETED_EMOTIONS emotions and $DELETED_ENTRIES diary entries older than $CUTOFF_DATE"
    else
        log "ERROR: Skipping purge because archiving failed"
    fi
}

# Purge function for health data
purge_health_data() {
    CUTOFF_DATE=$(date -d "$HEALTH_DATA_RETENTION days ago" +%Y-%m-%d)
    
    log "Starting purge of health data older than $CUTOFF_DATE..."
    
    # First archive the data
    archive_health_data
    
    if [ $? -eq 0 ]; then
        # Delete old health data
        DELETED_RECORDS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            SELECT COUNT(*) FROM health_data
            WHERE date < '$CUTOFF_DATE'
        " | tail -1)
        
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            DELETE FROM health_data
            WHERE date < '$CUTOFF_DATE'
        "
        
        log "Purged $DELETED_RECORDS health data records older than $CUTOFF_DATE"
    else
        log "ERROR: Skipping purge because archiving failed"
    fi
}

# Purge function for recommendations
purge_recommendations() {
    CUTOFF_DATE=$(date -d "$RECOMMENDATION_RETENTION days ago" +%Y-%m-%d)
    
    log "Starting purge of recommendations older than $CUTOFF_DATE..."
    
    # First archive the data
    archive_recommendations
    
    if [ $? -eq 0 ]; then
        # Delete old recommendations
        DELETED_RECORDS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            SELECT COUNT(*) FROM recommendations
            WHERE created_at < '$CUTOFF_DATE'
        " | tail -1)
        
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            DELETE FROM recommendations
            WHERE created_at < '$CUTOFF_DATE'
        "
        
        log "Purged $DELETED_RECORDS recommendations older than $CUTOFF_DATE"
    else
        log "ERROR: Skipping purge because archiving failed"
    fi
}

# Automated archiving and purging schedule
schedule_archiving_purging() {
    log "Setting up automated archiving and purging schedule"
    
    # Create cron jobs for monthly archiving and purging (1st day of each month at 3 AM)
    (crontab -l 2>/dev/null; echo "0 3 1 * * $0 archive_all") | crontab -
    (crontab -l 2>/dev/null; echo "0 4 1 * * $0 purge_all") | crontab -
    
    log "Automated archiving scheduled for 3 AM on the 1st day of each month"
    log "Automated purging scheduled for 4 AM on the 1st day of each month"
}

# Main script execution
case "$1" in
    archive_diary)
        archive_diary_entries
        ;;
    archive_health)
        archive_health_data
        ;;
    archive_recommendations)
        archive_recommendations
        ;;
    archive_all)
        archive_diary_entries
        archive_health_data
        archive_recommendations
        ;;
    purge_diary)
        purge_diary_entries
        ;;
    purge_health)
        purge_health_data
        ;;
    purge_recommendations)
        purge_recommendations
        ;;
    purge_all)
        purge_diary_entries
        purge_health_data
        purge_recommendations
        ;;
    schedule)
        schedule_archiving_purging
        ;;
    *)
        echo "Usage: $0 {archive_diary|archive_health|archive_recommendations|archive_all|purge_diary|purge_health|purge_recommendations|purge_all|schedule}"
        exit 1
        ;;
esac

exit 0