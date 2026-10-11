CREATE TABLE IF NOT EXISTS content (
  kind TEXT NOT NULL CHECK (kind IN ('news', 'projects')),
  id TEXT NOT NULL,
  draft TEXT NOT NULL CHECK (json_valid(draft)),
  published TEXT CHECK (published IS NULL OR json_valid(published)),
  deleted INTEGER NOT NULL DEFAULT 0 CHECK (deleted IN (0, 1)),
  version INTEGER NOT NULL CHECK (version > 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT,
  PRIMARY KEY (kind, id)
);
CREATE INDEX IF NOT EXISTS content_updated ON content(updated_at DESC);
CREATE TABLE IF NOT EXISTS operations (
  actor TEXT NOT NULL,
  request_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (actor, request_id)
);
