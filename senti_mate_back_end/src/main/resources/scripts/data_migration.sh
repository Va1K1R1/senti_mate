#!/bin/bash

# Data Migration Script for SentiMate
# This script provides functions for migrating data between different database environments or versions.

# Configuration
SOURCE_DB_NAME="sentimate_db_source"
SOURCE_DB_USER="root"
SOURCE_DB_PASSWORD="password"
SOURCE_DB_HOST="localhost"
SOURCE_DB_PORT="3306"

TARGET_DB_NAME="sentimate_db"
TARGET_DB_USER="root"
TARGET_DB_PASSWORD="password"
TARGET_DB_HOST="localhost"
TARGET_DB_PORT="3306"

MIGRATION_DIR="/var/migrations/sentimate"
LOG_FILE="/var/log/sentimate/data_migration.log"

# Create migration directory if it doesn't exist
mkdir -p $MIGRATION_DIR
mkdir -p $(dirname $LOG_FILE)

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Function to check database connection
check_connection() {
    local db_host=$1
    local db_port=$2
    local db_user=$3
    local db_password=$4
    local db_name=$5
    
    log "Checking connection to $db_name on $db_host:$db_port..."
    
    if mysql -h $db_host -P $db_port -u $db_user -p$db_password -e "USE $db_name" 2>/dev/null; then
        log "Connection to $db_name successful"
        return 0
    else
        log "ERROR: Failed to connect to $db_name"
        return 1
    fi
}

# Function to export data from source database
export_data() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local export_dir="$MIGRATION_DIR/export_$timestamp"
    
    mkdir -p $export_dir
    
    log "Exporting data from source database to $export_dir..."
    
    # Check source database connection
    check_connection $SOURCE_DB_HOST $SOURCE_DB_PORT $SOURCE_DB_USER $SOURCE_DB_PASSWORD $SOURCE_DB_NAME
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Export schema
    log "Exporting schema..."
    mysqldump -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD --no-data $SOURCE_DB_NAME > $export_dir/schema.sql
    
    # Export data table by table
    log "Exporting roles..."
    mysqldump -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD --no-create-info $SOURCE_DB_NAME roles > $export_dir/roles.sql
    
    log "Exporting users..."
    mysqldump -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD --no-create-info $SOURCE_DB_NAME users > $export_dir/users.sql
    
    log "Exporting user_roles..."
    mysqldump -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD --no-create-info $SOURCE_DB_NAME user_roles > $export_dir/user_roles.sql
    
    log "Exporting diary_entries..."
    mysqldump -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD --no-create-info $SOURCE_DB_NAME diary_entries > $export_dir/diary_entries.sql
    
    log "Exporting emotions..."
    mysqldump -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD --no-create-info $SOURCE_DB_NAME emotions > $export_dir/emotions.sql
    
    log "Exporting health_data..."
    mysqldump -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD --no-create-info $SOURCE_DB_NAME health_data > $export_dir/health_data.sql
    
    log "Exporting recommendations..."
    mysqldump -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD --no-create-info $SOURCE_DB_NAME recommendations > $export_dir/recommendations.sql
    
    # Create a complete dump for reference
    log "Creating complete database dump..."
    mysqldump -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD $SOURCE_DB_NAME > $export_dir/complete_dump.sql
    
    # Create a metadata file with export information
    cat > $export_dir/metadata.txt << EOF
Export Date: $(date)
Source Database: $SOURCE_DB_NAME
Source Host: $SOURCE_DB_HOST
Source Port: $SOURCE_DB_PORT
Source User: $SOURCE_DB_USER
EOF
    
    log "Data export completed successfully to $export_dir"
    echo $export_dir
}

# Function to import data to target database
import_data() {
    local import_dir=$1
    
    if [ -z "$import_dir" ]; then
        log "ERROR: No import directory specified"
        return 1
    fi
    
    if [ ! -d "$import_dir" ]; then
        log "ERROR: Import directory $import_dir does not exist"
        return 1
    fi
    
    log "Importing data from $import_dir to target database..."
    
    # Check target database connection
    check_connection $TARGET_DB_HOST $TARGET_DB_PORT $TARGET_DB_USER $TARGET_DB_PASSWORD $TARGET_DB_NAME
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Import schema (optional, as Flyway should handle this)
    if [ "$2" == "with-schema" ]; then
        log "Importing schema..."
        mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME < $import_dir/schema.sql
    fi
    
    # Import data table by table
    log "Importing roles..."
    mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME < $import_dir/roles.sql
    
    log "Importing users..."
    mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME < $import_dir/users.sql
    
    log "Importing user_roles..."
    mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME < $import_dir/user_roles.sql
    
    log "Importing diary_entries..."
    mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME < $import_dir/diary_entries.sql
    
    log "Importing emotions..."
    mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME < $import_dir/emotions.sql
    
    log "Importing health_data..."
    mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME < $import_dir/health_data.sql
    
    log "Importing recommendations..."
    mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME < $import_dir/recommendations.sql
    
    log "Data import completed successfully from $import_dir"
}

# Function to migrate data between environments
migrate_data() {
    log "Starting data migration from $SOURCE_DB_NAME to $TARGET_DB_NAME..."
    
    # Export data from source database
    export_dir=$(export_data)
    if [ $? -ne 0 ]; then
        log "ERROR: Data export failed"
        return 1
    fi
    
    # Import data to target database
    import_data $export_dir
    if [ $? -ne 0 ]; then
        log "ERROR: Data import failed"
        return 1
    fi
    
    log "Data migration completed successfully"
}

# Function to transform data during migration (for schema changes)
transform_data() {
    local export_dir=$1
    local transform_dir="$export_dir/transformed"
    
    if [ -z "$export_dir" ]; then
        log "ERROR: No export directory specified for transformation"
        return 1
    fi
    
    if [ ! -d "$export_dir" ]; then
        log "ERROR: Export directory $export_dir does not exist"
        return 1
    fi
    
    mkdir -p $transform_dir
    
    log "Transforming data from $export_dir to $transform_dir..."
    
    # Copy original files to transform directory
    cp $export_dir/*.sql $transform_dir/
    
    # Apply transformations as needed
    # Example: Rename a column in users table
    # sed -i 's/`old_column_name`/`new_column_name`/g' $transform_dir/users.sql
    
    # Example: Add a default value for a new column
    # sed -i 's/VALUES (/VALUES (DEFAULT, /g' $transform_dir/users.sql
    
    log "Data transformation completed successfully"
    echo $transform_dir
}

# Function to validate migration
validate_migration() {
    log "Validating migration between $SOURCE_DB_NAME and $TARGET_DB_NAME..."
    
    # Check source and target database connections
    check_connection $SOURCE_DB_HOST $SOURCE_DB_PORT $SOURCE_DB_USER $SOURCE_DB_PASSWORD $SOURCE_DB_NAME
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    check_connection $TARGET_DB_HOST $TARGET_DB_PORT $TARGET_DB_USER $TARGET_DB_PASSWORD $TARGET_DB_NAME
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Compare record counts for each table
    log "Comparing record counts..."
    
    tables=("roles" "users" "user_roles" "diary_entries" "emotions" "health_data" "recommendations")
    
    for table in "${tables[@]}"; do
        source_count=$(mysql -h $SOURCE_DB_HOST -P $SOURCE_DB_PORT -u $SOURCE_DB_USER -p$SOURCE_DB_PASSWORD -s -N -e "SELECT COUNT(*) FROM $SOURCE_DB_NAME.$table")
        target_count=$(mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD -s -N -e "SELECT COUNT(*) FROM $TARGET_DB_NAME.$table")
        
        log "Table $table: Source=$source_count, Target=$target_count"
        
        if [ "$source_count" != "$target_count" ]; then
            log "WARNING: Record count mismatch for table $table"
        fi
    done
    
    log "Migration validation completed"
}

# Function to rollback migration
rollback_migration() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        log "ERROR: No backup file specified for rollback"
        return 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        log "ERROR: Backup file $backup_file does not exist"
        return 1
    fi
    
    log "Rolling back migration using backup file $backup_file..."
    
    # Check target database connection
    check_connection $TARGET_DB_HOST $TARGET_DB_PORT $TARGET_DB_USER $TARGET_DB_PASSWORD $TARGET_DB_NAME
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Drop all tables in target database
    mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME -e "
        SET FOREIGN_KEY_CHECKS = 0;
        DROP TABLE IF EXISTS roles, users, user_roles, diary_entries, emotions, health_data, recommendations;
        SET FOREIGN_KEY_CHECKS = 1;
    "
    
    # Restore from backup
    mysql -h $TARGET_DB_HOST -P $TARGET_DB_PORT -u $TARGET_DB_USER -p$TARGET_DB_PASSWORD $TARGET_DB_NAME < $backup_file
    
    log "Migration rollback completed successfully"
}

# Main script execution
case "$1" in
    export)
        export_data
        ;;
    import)
        import_data "$2" "$3"
        ;;
    migrate)
        migrate_data
        ;;
    transform)
        transform_data "$2"
        ;;
    validate)
        validate_migration
        ;;
    rollback)
        rollback_migration "$2"
        ;;
    *)
        echo "Usage: $0 {export|import <export_dir> [with-schema]|migrate|transform <export_dir>|validate|rollback <backup_file>}"
        exit 1
        ;;
esac

exit 0