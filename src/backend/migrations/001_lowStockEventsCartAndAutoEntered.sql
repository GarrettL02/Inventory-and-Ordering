-- 001: lowStockEvents cleanup
--   - drop `ordered` and `checked` (nothing uses them; finished orders will live in their own table)
--   - rename `sent` to `inCart` (1 = part was moved to the cart in the UI)
--   - add `autoEntered` (1 = created by a stock drop below minStockLevel, 0 = a person submitted it).
--     Only autoEntered rows are removed automatically when stock rises back to the minimum or above.
--     Existing rows become 0 (manual), so they are never removed automatically.
-- One statement on purpose: MySQL commits DDL immediately, so this either applies or it doesn't.
ALTER TABLE lowStockEvents
  DROP INDEX idx_lowStockEvents_ordered,
  DROP COLUMN ordered,
  DROP COLUMN checked,
  CHANGE COLUMN sent inCart TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN autoEntered TINYINT(1) NOT NULL DEFAULT 0 AFTER inCart;
