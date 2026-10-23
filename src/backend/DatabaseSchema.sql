-- =====================================================================
-- DatabaseSchema.sql
-- Full current schema for a fresh install (equals every migration applied).
-- When the schema changes: add a new numbered file in ./migrations AND
-- update this file so it always reflects the latest state.
--
-- NOTE: table names are camelCase. On Linux (e.g. the Oracle VM) MySQL table
-- names are case-sensitive, so always use the exact casing in queries.
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- Inventory
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
  id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  parentId INT UNSIGNED NULL,
  name     VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_categories_parentId (parentId),
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parentId) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS storageLocations (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_storageLocations_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS manufacturers (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_manufacturers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS parts (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  categoryId         INT UNSIGNED NULL,
  storageLocationId  INT UNSIGNED NOT NULL,
  name               VARCHAR(255) NOT NULL,
  description        VARCHAR(255) NOT NULL DEFAULT '',
  comment            TEXT NULL,
  stockLevel         INT NOT NULL DEFAULT 0,
  minStockLevel      INT NOT NULL DEFAULT 0,
  averagePrice       DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
  internalPartNumber VARCHAR(255) NULL,
  partURL            VARCHAR(2048) NULL,
  status             VARCHAR(64) NULL,
  partCondition      VARCHAR(64) NULL,
  createdAt          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_parts_categoryId (categoryId),
  KEY idx_parts_storageLocationId (storageLocationId),
  KEY idx_parts_name (name),
  CONSTRAINT fk_parts_category
    FOREIGN KEY (categoryId) REFERENCES categories (id) ON DELETE SET NULL,
  CONSTRAINT fk_parts_storageLocation
    FOREIGN KEY (storageLocationId) REFERENCES storageLocations (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Used by the Digikey lookup (finds the Digikey part number via the manufacturer name).
CREATE TABLE IF NOT EXISTS partManufacturers (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  partId         INT UNSIGNED NOT NULL,
  manufacturerId INT UNSIGNED NOT NULL,
  partNumber     VARCHAR(255) NULL,
  PRIMARY KEY (id),
  KEY idx_partManufacturers_partId (partId),
  KEY idx_partManufacturers_manufacturerId (manufacturerId),
  CONSTRAINT fk_partManufacturers_part
    FOREIGN KEY (partId) REFERENCES parts (id) ON DELETE CASCADE,
  CONSTRAINT fk_partManufacturers_manufacturer
    FOREIGN KEY (manufacturerId) REFERENCES manufacturers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS partAttachments (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  partId       INT UNSIGNED NOT NULL,
  filename     VARCHAR(255) NOT NULL,
  originalName VARCHAR(255) NULL,
  mimeType     VARCHAR(127) NULL,
  isPrimary    TINYINT(1) NOT NULL DEFAULT 0,
  createdAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_partAttachments_partId (partId),
  CONSTRAINT fk_partAttachments_part
    FOREIGN KEY (partId) REFERENCES parts (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- App tables
-- ---------------------------------------------------------------------

-- passwordHash = argon2/bcrypt hash, never plaintext.
CREATE TABLE IF NOT EXISTS users (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username     VARCHAR(100) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  displayName  VARCHAR(255) NULL,
  role         ENUM('user','admin') NOT NULL DEFAULT 'user',
  isActive     TINYINT(1) NOT NULL DEFAULT 1,
  createdAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastLoginAt  DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Part requests / low stock list. Rows are created by application code when a
-- stock change drops a part below minStockLevel, or when a user submits the
-- PartRequest form.
--   partId = 0  -> "new part" request (no real part has id 0, so no FK on purpose)
--   sent        -> part has been moved to the cart in the UI
--   ordered = 1 -> workflow finished, row hidden from the UI table
CREATE TABLE IF NOT EXISTS lowStockEvents (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  partId             INT UNSIGNED NOT NULL DEFAULT 0,
  stockLevel         INT NOT NULL DEFAULT 0,
  minStockLevel      INT NOT NULL DEFAULT 0,
  quantity           INT NOT NULL DEFAULT 1,
  urgency            TINYINT NOT NULL DEFAULT 1,
  requestedBy        VARCHAR(100) NOT NULL DEFAULT 'system',
  triggeredAt        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent               TINYINT(1) NOT NULL DEFAULT 0,
  ordered            TINYINT(1) NOT NULL DEFAULT 0,
  checked            TINYINT(1) NOT NULL DEFAULT 0,
  newPartName        VARCHAR(255) NULL,
  newPartDescription VARCHAR(255) NULL,
  newPartComment     TEXT NULL,
  newPartURL         VARCHAR(2048) NULL,
  PRIMARY KEY (id),
  KEY idx_lowStockEvents_partId (partId),
  KEY idx_lowStockEvents_ordered (ordered)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit trail of stock changes. The service layer writes a row here and
-- decides whether a lowStockEvents row is needed.
CREATE TABLE IF NOT EXISTS stockMovements (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  partId          INT UNSIGNED NOT NULL,
  delta           INT NOT NULL,
  stockLevelAfter INT NOT NULL,
  reason          VARCHAR(64) NOT NULL DEFAULT 'manual',
  userId          INT UNSIGNED NULL,
  createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stockMovements_partId (partId),
  KEY idx_stockMovements_createdAt (createdAt),
  CONSTRAINT fk_stockMovements_part
    FOREIGN KEY (partId) REFERENCES parts (id) ON DELETE CASCADE,
  CONSTRAINT fk_stockMovements_user
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tracks which files in ./migrations have been applied.
CREATE TABLE IF NOT EXISTS schemaMigrations (
  filename  VARCHAR(255) NOT NULL,
  appliedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (filename)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
