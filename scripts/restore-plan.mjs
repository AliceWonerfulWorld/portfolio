import { SCHEMA_VERSION, validateContent } from '../shared/content.js';
import { validateIdentity } from '../server/service.js';

const quote = value => value === null ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`;
const timestamp = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && new Date(value).toISOString() === value;
// Restore only into an empty replacement database. Existing IDs cause a SQL error.
export function restoreSql(bundle) {
  if (bundle?.schemaVersion !== SCHEMA_VERSION || !Array.isArray(bundle.records)) throw new Error('Unsupported backup schema');
  const ids = new Set();
  return bundle.records.map(record => {
    validateIdentity(record.kind, record.id);
    const key = `${record.kind}/${record.id}`;
    if (ids.has(key)) throw new Error('Duplicate backup ID');
    ids.add(key);
    if (!Number.isSafeInteger(record.version) || record.version < 1 || !Number.isSafeInteger(record.sortOrder) || record.sortOrder < 0 || !timestamp(record.createdAt) || !timestamp(record.updatedAt) || typeof record.deleted !== 'boolean') throw new Error(`Invalid backup metadata: ${key}`);
    if (Object.keys(validateContent(record.kind, record.draft).errors).length) throw new Error(`Invalid draft: ${key}`);
    if (record.published && (record.deleted || !timestamp(record.published.publishedAt) || Object.keys(validateContent(record.kind, record.published.content, true).errors).length)) throw new Error(`Invalid published snapshot: ${key}`);
    const values = [record.kind, record.id, JSON.stringify(record.draft), record.published ? JSON.stringify(record.published.content) : null, record.version, record.createdAt, record.updatedAt, record.published?.publishedAt ?? null, record.deleted ? 1 : 0, record.sortOrder];
    return `INSERT INTO content (kind, id, draft, published, version, created_at, updated_at, published_at, deleted, sort_order) VALUES (${values.map(quote).join(', ')});`;
  }).join('\n') + '\n';
}
