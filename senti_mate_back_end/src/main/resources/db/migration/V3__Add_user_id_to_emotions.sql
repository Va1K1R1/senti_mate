-- Add user_id column to emotions table
ALTER TABLE emotions
ADD COLUMN user_id BIGINT NOT NULL AFTER diary_entry_id,
ADD CONSTRAINT fk_emotions_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
ADD INDEX idx_emotions_user_id (user_id);

-- Update existing emotions to set user_id from their diary entries
UPDATE emotions e
JOIN diary_entries d ON e.diary_entry_id = d.id
SET e.user_id = d.user_id;