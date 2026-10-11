import { emptyContent, SCHEMA_VERSION, validateContent } from '../shared/content.js';

export function migrationRecords(news, projects, timestamp = '2026-10-11T00:00:00.000Z', imagePath = value => value) {
  const records = [
    ...news.map((item, sortOrder) => {
      const match = item.date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
      if (!match) throw new Error(`Unrecognized article date: ${item.date}`);
      return {kind: 'news', sortOrder, id: String(item.id), content: {...emptyContent('news'), title: item.title, body: item.content, articleDate: `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`, link: item.link === '#' ? '' : item.link ?? ''}};
    }),
    ...projects.map((item, sortOrder) => ({kind: 'projects', sortOrder, id: item.id, content: {
      ...emptyContent('projects'), title: item.title, summary: item.summary || item.description.split('\n')[0], body: item.description,
      titleImage: imagePath(item.titleImage), contentImage: imagePath(item.contentImage ?? ''), tags: item.tags ?? [],
      ...Object.fromEntries(['link', 'demoLink', 'githubLink', 'detailsLink'].map(field => [field, item[field] === '#' ? '' : item[field] ?? ''])),
    }})),
  ].map(({kind, id, content, sortOrder}) => {
    const {errors} = validateContent(kind, content, true);
    if (Object.keys(errors).length) throw new Error(`${kind}/${id}: ${JSON.stringify(errors)}`);
    return {kind, id, sortOrder, draft: content, published: {content, publishedAt: timestamp}, publicationState: 'published', version: 1, createdAt: timestamp, updatedAt: timestamp};
  });
  if (new Set(records.map(record => `${record.kind}/${record.id}`)).size !== records.length) throw new Error('Duplicate legacy IDs');
  return {schemaVersion: SCHEMA_VERSION, exportedAt: timestamp, records};
}
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
export function migrationSql(bundle) {
  return bundle.records.map(record => `INSERT INTO content (kind, id, draft, published, version, created_at, updated_at, published_at, sort_order) VALUES (${[record.kind, record.id, JSON.stringify(record.draft), JSON.stringify(record.published.content), record.version, record.createdAt, record.updatedAt, record.published.publishedAt, record.sortOrder].map(quote).join(', ')}) ON CONFLICT(kind, id) DO NOTHING;`).join('\n') + '\n';
}
