#!/bin/bash

# Data Validation and Cleaning Script for SentiMate
# This script provides functions for validating and cleaning data in the SentiMate database.

# Configuration
DB_NAME="sentimate_db"
DB_USER="root"
DB_PASSWORD="password"
LOG_FILE="/var/log/sentimate/data_validation.log"

# Create log directory if it doesn't exist
mkdir -p $(dirname $LOG_FILE)

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Validate user data
validate_users() {
    log "Starting user data validation..."
    
    # Check for invalid email formats
    INVALID_EMAILS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, username, email FROM users
        WHERE email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ")
    
    if [ -n "$INVALID_EMAILS" ]; then
        log "Found invalid email formats:"
        log "$INVALID_EMAILS"
    else
        log "No invalid email formats found"
    fi
    
    # Check for duplicate usernames or emails
    DUPLICATE_USERS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT username, COUNT(*) as count FROM users GROUP BY username HAVING count > 1
        UNION ALL
        SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING count > 1
    ")
    
    if [ -n "$DUPLICATE_USERS" ]; then
        log "Found duplicate usernames or emails:"
        log "$DUPLICATE_USERS"
    else
        log "No duplicate usernames or emails found"
    fi
    
    # Check for users without roles
    USERS_WITHOUT_ROLES=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT u.id, u.username FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        WHERE ur.role_id IS NULL
    ")
    
    if [ -n "$USERS_WITHOUT_ROLES" ]; then
        log "Found users without roles:"
        log "$USERS_WITHOUT_ROLES"
        
        # Assign default user role to users without roles
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            INSERT INTO user_roles (user_id, role_id)
            SELECT u.id, r.id FROM users u, roles r
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            WHERE ur.role_id IS NULL AND r.name = 'ROLE_USER'
        "
        
        log "Assigned default user role to users without roles"
    else
        log "No users without roles found"
    fi
}

# Validate diary entries
validate_diary_entries() {
    log "Starting diary entry validation..."
    
    # Check for diary entries without users
    ORPHANED_ENTRIES=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, title FROM diary_entries
        WHERE user_id NOT IN (SELECT id FROM users)
    ")
    
    if [ -n "$ORPHANED_ENTRIES" ]; then
        log "Found orphaned diary entries:"
        log "$ORPHANED_ENTRIES"
    else
        log "No orphaned diary entries found"
    fi
    
    # Check for invalid mood scores
    INVALID_MOOD_SCORES=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, title, mood_score FROM diary_entries
        WHERE mood_score IS NOT NULL AND (mood_score < 1 OR mood_score > 10)
    ")
    
    if [ -n "$INVALID_MOOD_SCORES" ]; then
        log "Found invalid mood scores:"
        log "$INVALID_MOOD_SCORES"
        
        # Fix invalid mood scores
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            UPDATE diary_entries SET mood_score = 5
            WHERE mood_score IS NOT NULL AND (mood_score < 1 OR mood_score > 10)
        "
        
        log "Fixed invalid mood scores by setting them to 5"
    else
        log "No invalid mood scores found"
    fi
    
    # Check for invalid energy levels
    INVALID_ENERGY_LEVELS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, title, energy_level FROM diary_entries
        WHERE energy_level IS NOT NULL AND (energy_level < 1 OR energy_level > 10)
    ")
    
    if [ -n "$INVALID_ENERGY_LEVELS" ]; then
        log "Found invalid energy levels:"
        log "$INVALID_ENERGY_LEVELS"
        
        # Fix invalid energy levels
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            UPDATE diary_entries SET energy_level = 5
            WHERE energy_level IS NOT NULL AND (energy_level < 1 OR energy_level > 10)
        "
        
        log "Fixed invalid energy levels by setting them to 5"
    else
        log "No invalid energy levels found"
    fi
    
    # Check for invalid stress levels
    INVALID_STRESS_LEVELS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, title, stress_level FROM diary_entries
        WHERE stress_level IS NOT NULL AND (stress_level < 1 OR stress_level > 10)
    ")
    
    if [ -n "$INVALID_STRESS_LEVELS" ]; then
        log "Found invalid stress levels:"
        log "$INVALID_STRESS_LEVELS"
        
        # Fix invalid stress levels
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            UPDATE diary_entries SET stress_level = 5
            WHERE stress_level IS NOT NULL AND (stress_level < 1 OR stress_level > 10)
        "
        
        log "Fixed invalid stress levels by setting them to 5"
    else
        log "No invalid stress levels found"
    fi
    
    # Check for invalid sleep hours
    INVALID_SLEEP_HOURS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, title, sleep_hours FROM diary_entries
        WHERE sleep_hours IS NOT NULL AND (sleep_hours < 0 OR sleep_hours > 24)
    ")
    
    if [ -n "$INVALID_SLEEP_HOURS" ]; then
        log "Found invalid sleep hours:"
        log "$INVALID_SLEEP_HOURS"
        
        # Fix invalid sleep hours
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            UPDATE diary_entries SET sleep_hours = 8
            WHERE sleep_hours IS NOT NULL AND (sleep_hours < 0 OR sleep_hours > 24)
        "
        
        log "Fixed invalid sleep hours by setting them to 8"
    else
        log "No invalid sleep hours found"
    fi
}

# Validate emotions
validate_emotions() {
    log "Starting emotion validation..."
    
    # Check for emotions without diary entries
    ORPHANED_EMOTIONS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, name FROM emotions
        WHERE diary_entry_id NOT IN (SELECT id FROM diary_entries)
    ")
    
    if [ -n "$ORPHANED_EMOTIONS" ]; then
        log "Found orphaned emotions:"
        log "$ORPHANED_EMOTIONS"
        
        # Delete orphaned emotions
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            DELETE FROM emotions
            WHERE diary_entry_id NOT IN (SELECT id FROM diary_entries)
        "
        
        log "Deleted orphaned emotions"
    else
        log "No orphaned emotions found"
    fi
    
    # Check for invalid emotion intensities
    INVALID_INTENSITIES=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, name, intensity FROM emotions
        WHERE intensity IS NOT NULL AND (intensity < 1 OR intensity > 10)
    ")
    
    if [ -n "$INVALID_INTENSITIES" ]; then
        log "Found invalid emotion intensities:"
        log "$INVALID_INTENSITIES"
        
        # Fix invalid intensities
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            UPDATE emotions SET intensity = 5
            WHERE intensity IS NOT NULL AND (intensity < 1 OR intensity > 10)
        "
        
        log "Fixed invalid emotion intensities by setting them to 5"
    else
        log "No invalid emotion intensities found"
    fi
}

# Validate health data
validate_health_data() {
    log "Starting health data validation..."
    
    # Check for health data without users
    ORPHANED_HEALTH_DATA=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, date FROM health_data
        WHERE user_id NOT IN (SELECT id FROM users)
    ")
    
    if [ -n "$ORPHANED_HEALTH_DATA" ]; then
        log "Found orphaned health data:"
        log "$ORPHANED_HEALTH_DATA"
    else
        log "No orphaned health data found"
    fi
    
    # Check for invalid step counts
    INVALID_STEP_COUNTS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, date, step_count FROM health_data
        WHERE step_count IS NOT NULL AND step_count < 0
    ")
    
    if [ -n "$INVALID_STEP_COUNTS" ]; then
        log "Found invalid step counts:"
        log "$INVALID_STEP_COUNTS"
        
        # Fix invalid step counts
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            UPDATE health_data SET step_count = 0
            WHERE step_count IS NOT NULL AND step_count < 0
        "
        
        log "Fixed invalid step counts by setting them to 0"
    else
        log "No invalid step counts found"
    fi
    
    # Check for invalid heart rates
    INVALID_HEART_RATES=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, date, heart_rate_avg, heart_rate_min, heart_rate_max FROM health_data
        WHERE (heart_rate_avg IS NOT NULL AND (heart_rate_avg < 30 OR heart_rate_avg > 220))
        OR (heart_rate_min IS NOT NULL AND (heart_rate_min < 30 OR heart_rate_min > 220))
        OR (heart_rate_max IS NOT NULL AND (heart_rate_max < 30 OR heart_rate_max > 220))
    ")
    
    if [ -n "$INVALID_HEART_RATES" ]; then
        log "Found invalid heart rates:"
        log "$INVALID_HEART_RATES"
        
        # Fix invalid heart rates
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            UPDATE health_data SET heart_rate_avg = 70
            WHERE heart_rate_avg IS NOT NULL AND (heart_rate_avg < 30 OR heart_rate_avg > 220);
            
            UPDATE health_data SET heart_rate_min = 60
            WHERE heart_rate_min IS NOT NULL AND (heart_rate_min < 30 OR heart_rate_min > 220);
            
            UPDATE health_data SET heart_rate_max = 100
            WHERE heart_rate_max IS NOT NULL AND (heart_rate_max < 30 OR heart_rate_max > 220)
        "
        
        log "Fixed invalid heart rates"
    else
        log "No invalid heart rates found"
    fi
    
    # Check for invalid sleep durations
    INVALID_SLEEP_DURATIONS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, date, sleep_duration_minutes FROM health_data
        WHERE sleep_duration_minutes IS NOT NULL AND (sleep_duration_minutes < 0 OR sleep_duration_minutes > 1440)
    ")
    
    if [ -n "$INVALID_SLEEP_DURATIONS" ]; then
        log "Found invalid sleep durations:"
        log "$INVALID_SLEEP_DURATIONS"
        
        # Fix invalid sleep durations
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            UPDATE health_data SET sleep_duration_minutes = 480
            WHERE sleep_duration_minutes IS NOT NULL AND (sleep_duration_minutes < 0 OR sleep_duration_minutes > 1440)
        "
        
        log "Fixed invalid sleep durations by setting them to 480 minutes (8 hours)"
    else
        log "No invalid sleep durations found"
    fi
}

# Validate recommendations
validate_recommendations() {
    log "Starting recommendation validation..."
    
    # Check for recommendations without users
    ORPHANED_RECOMMENDATIONS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, title FROM recommendations
        WHERE user_id NOT IN (SELECT id FROM users)
    ")
    
    if [ -n "$ORPHANED_RECOMMENDATIONS" ]; then
        log "Found orphaned recommendations:"
        log "$ORPHANED_RECOMMENDATIONS"
    else
        log "No orphaned recommendations found"
    fi
    
    # Check for invalid priority levels
    INVALID_PRIORITY_LEVELS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT id, title, priority_level FROM recommendations
        WHERE priority_level IS NOT NULL AND (priority_level < 1 OR priority_level > 5)
    ")
    
    if [ -n "$INVALID_PRIORITY_LEVELS" ]; then
        log "Found invalid priority levels:"
        log "$INVALID_PRIORITY_LEVELS"
        
        # Fix invalid priority levels
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            UPDATE recommendations SET priority_level = 3
            WHERE priority_level IS NOT NULL AND (priority_level < 1 OR priority_level > 5)
        "
        
        log "Fixed invalid priority levels by setting them to 3"
    else
        log "No invalid priority levels found"
    fi
}

# Clean database (remove orphaned records)
clean_database() {
    log "Starting database cleaning..."
    
    # Delete orphaned diary entries
    DELETED_ENTRIES=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT COUNT(*) FROM diary_entries
        WHERE user_id NOT IN (SELECT id FROM users)
    " | tail -1)
    
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        DELETE FROM diary_entries
        WHERE user_id NOT IN (SELECT id FROM users)
    "
    
    log "Deleted $DELETED_ENTRIES orphaned diary entries"
    
    # Delete orphaned emotions (already handled in validate_emotions)
    
    # Delete orphaned health data
    DELETED_HEALTH_DATA=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT COUNT(*) FROM health_data
        WHERE user_id NOT IN (SELECT id FROM users)
    " | tail -1)
    
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        DELETE FROM health_data
        WHERE user_id NOT IN (SELECT id FROM users)
    "
    
    log "Deleted $DELETED_HEALTH_DATA orphaned health data records"
    
    # Delete orphaned recommendations
    DELETED_RECOMMENDATIONS=$(mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        SELECT COUNT(*) FROM recommendations
        WHERE user_id NOT IN (SELECT id FROM users)
    " | tail -1)
    
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        DELETE FROM recommendations
        WHERE user_id NOT IN (SELECT id FROM users)
    "
    
    log "Deleted $DELETED_RECOMMENDATIONS orphaned recommendations"
    
    # Optimize tables
    log "Optimizing database tables..."
    
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
        OPTIMIZE TABLE users, roles, user_roles, diary_entries, emotions, health_data, recommendations
    "
    
    log "Database optimization completed"
}

# Automated validation and cleaning schedule
schedule_validation_cleaning() {
    log "Setting up automated validation and cleaning schedule"
    
    # Create cron jobs for weekly validation and cleaning (Sunday at 2 AM)
    (crontab -l 2>/dev/null; echo "0 2 * * 0 $0 validate_all") | crontab -
    (crontab -l 2>/dev/null; echo "30 2 * * 0 $0 clean") | crontab -
    
    log "Automated validation scheduled for 2:00 AM every Sunday"
    log "Automated cleaning scheduled for 2:30 AM every Sunday"
}

# Main script execution
case "$1" in
    validate_users)
        validate_users
        ;;
    validate_diary)
        validate_diary_entries
        ;;
    validate_emotions)
        validate_emotions
        ;;
    validate_health)
        validate_health_data
        ;;
    validate_recommendations)
        validate_recommendations
        ;;
    validate_all)
        validate_users
        validate_diary_entries
        validate_emotions
        validate_health_data
        validate_recommendations
        ;;
    clean)
        clean_database
        ;;
    schedule)
        schedule_validation_cleaning
        ;;
    *)
        echo "Usage: $0 {validate_users|validate_diary|validate_emotions|validate_health|validate_recommendations|validate_all|clean|schedule}"
        exit 1
        ;;
esac

exit 0