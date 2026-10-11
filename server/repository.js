import { publicationState } from '../shared/content.js';

export function decodeRecord(row) {
  if (!row) return null;
  const record = {
    kind: row.kind, id: row.id, draft: JSON.parse(row.draft),
    published: row.published ? { content: JSON.parse(row.published), publishedAt: row.published_at } : null,
    version: row.version, sortOrder: row.sort_order, createdAt: row.created_at, updatedAt: row.updated_at,
  };
  return { ...record, publicationState: publicationState(record) };
}

export class ContentRepository {
  constructor(db) { this.db = db; }
  async nextSortOrder(kind) {
    const row = await this.db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM content WHERE kind = ?').bind(kind).first();
    if (!Number.isSafeInteger(row.next_order)) throw new Error('Invalid content order');
    return row.next_order;
  }
  async get(kind, id) {
    return decodeRecord(await this.db.prepare('SELECT * FROM content WHERE kind = ? AND id = ? AND deleted = 0').bind(kind, id).first());
  }
  async list(kind) {
    const { results } = await this.db.prepare('SELECT * FROM content WHERE deleted = 0 AND (? IS NULL OR kind = ?) ORDER BY updated_at DESC, kind, id').bind(kind ?? null, kind ?? null).all();
    return results.map(decodeRecord);
  }
  async publicList(kind, id = null) {
    const { results } = await this.db.prepare(`SELECT kind, id, published, published_at, sort_order FROM content WHERE kind = ? AND published IS NOT NULL AND deleted = 0 AND (? IS NULL OR id = ?) ORDER BY CASE WHEN kind = 'news' THEN json_extract(published, '$.articleDate') END DESC, sort_order ASC, id`).bind(kind, id, id).all();
    return results.map(row => ({ kind: row.kind, id: row.id, content: JSON.parse(row.published), publishedAt: row.published_at, sortOrder: row.sort_order }));
  }
  async operation(actor, requestId) {
    return this.db.prepare('SELECT fingerprint, response FROM operations WHERE actor = ? AND request_id = ?').bind(actor, requestId).first();
  }
  async mutate({actor, requestId, fingerprint, record, expectedVersion, deleting = false}) {
    const response = { record: deleting ? null : record, version: record.version, updatedAt: record.updatedAt };
    const args = [JSON.stringify(record.draft), record.published ? JSON.stringify(record.published.content) : null, record.version, record.updatedAt, record.published?.publishedAt ?? null, deleting ? 1 : 0, record.kind, record.id, expectedVersion];
    const mutation = expectedVersion === 0
      ? this.db.prepare('INSERT INTO content (draft, published, version, updated_at, published_at, deleted, kind, id, created_at, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(kind, id) DO NOTHING').bind(...args.slice(0, 8), record.createdAt, record.sortOrder)
      : this.db.prepare('UPDATE content SET draft = ?, published = ?, version = ?, updated_at = ?, published_at = ?, deleted = ? WHERE kind = ? AND id = ? AND version = ? AND deleted = 0').bind(...args);
    // D1 batch is a transaction: CAS mutation and its replay receipt commit together.
    // changes() gates the receipt so a stale update never records a false success.
    const results = await this.db.batch([
      mutation,
      this.db.prepare('INSERT INTO operations (actor, request_id, fingerprint, response, created_at) SELECT ?, ?, ?, ?, ? WHERE changes() = 1').bind(actor, requestId, fingerprint, JSON.stringify(response), record.updatedAt),
    ]);
    return results[0].meta.changes === 1 ? response : null;
  }
  async export() {
    const { results } = await this.db.prepare('SELECT * FROM content ORDER BY kind, id').all();
    return results.map(row => ({ ...decodeRecord(row), deleted: Boolean(row.deleted) }));
  }
}
