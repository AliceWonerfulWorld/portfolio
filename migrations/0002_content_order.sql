ALTER TABLE content ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS content_public_order ON content(kind, deleted, sort_order);
