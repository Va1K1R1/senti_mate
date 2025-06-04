-- Insert default roles
INSERT INTO roles (name, description) VALUES
('ROLE_USER', 'Standard user role with basic permissions'),
('ROLE_ADMIN', 'Administrator role with full permissions'),
('ROLE_MODERATOR', 'Moderator role with content management permissions');

-- Insert default admin user (password: admin123)
-- Note: In a real production environment, use a secure password and change it immediately after deployment
INSERT INTO users (username, email, password, first_name, last_name, is_active, is_email_verified)
VALUES ('admin', 'admin@sentimate.com', '$2a$10$OwuE0yDqX8X6YVA0qJlYAOZVpZuMGZpYRRTXSKKJ1dWUCJMd0nYbO', 'Admin', 'User', true, true);

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';