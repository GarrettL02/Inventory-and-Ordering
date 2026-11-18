-- Per-user switch for the live distributor (DigiKey) lookups. 1 = on, 0 = off.
ALTER TABLE userSettings
  ADD COLUMN distributorLookups TINYINT(1) NOT NULL DEFAULT 1 AFTER theme;
