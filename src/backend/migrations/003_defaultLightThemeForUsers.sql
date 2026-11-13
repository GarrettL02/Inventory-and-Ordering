ALTER TABLE userSettings
  MODIFY theme ENUM('light','dark') NOT NULL DEFAULT 'light';

INSERT INTO userSettings (userId, theme)
SELECT users.id, 'light'
FROM users
LEFT JOIN userSettings ON userSettings.userId = users.id
WHERE userSettings.userId IS NULL;

DROP TRIGGER IF EXISTS trg_users_create_settings;

CREATE TRIGGER trg_users_create_settings
AFTER INSERT ON users
FOR EACH ROW
  INSERT INTO userSettings (userId, theme) VALUES (NEW.id, 'light');
