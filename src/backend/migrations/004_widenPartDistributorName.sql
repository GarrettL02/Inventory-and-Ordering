-- partDistributors.distributor held a short code ('digikey', 'mouser') in VARCHAR(32).
-- It now also holds any distributor name a person types (eBay, McMaster-Carr, ...),
-- so it needs more room.
ALTER TABLE partDistributors
  MODIFY distributor VARCHAR(100) NOT NULL;
