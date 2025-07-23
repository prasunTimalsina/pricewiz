-- This is an empty migration.
-- 1) Add a generated tsvector column on title
ALTER TABLE "Product"
  ADD COLUMN "_fts_title" tsvector
    GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;

-- 2) Create a GIN index on that column
CREATE INDEX "Product_title_fts_idx"
  ON "Product" USING GIN("_fts_title");
