export const SCHEMA_VERSION = 1;
export const SAVE_STATES = Object.freeze({ dirty: '未保存の変更', saving: '保存中', saved: '下書き保存済み', error: '保存失敗' });
export const PUBLICATION_STATES = Object.freeze({ draft: '下書き・未公開', published: '公開済み', changed: '公開済み・変更下書きあり' });
export const CONTENT_KINDS = ['news', 'projects'];

export function publicationState(record) {
  if (!record.published) return 'draft';
  return JSON.stringify(record.draft) === JSON.stringify(record.published.content) ? 'published' : 'changed';
}

export function emptyContent(kind) {
  return kind === 'news'
    ? { title: '', body: '', articleDate: '', link: '' }
    : { title: '', summary: '', body: '', titleImage: '', titleImageAlt: '', contentImage: '', contentImageAlt: '', tags: [], link: '', demoLink: '', githubLink: '', detailsLink: '', production: '' };
}

export function validateContent(kind, input, publishing = false) {
  const errors = Object.create(null);
  if (!CONTENT_KINDS.includes(kind) || !input || typeof input !== 'object' || Array.isArray(input)) return { content: null, errors: { content: 'データ形式が不正です。' } };
  const template = emptyContent(kind);
  const content = {};
  for (const [field, initial] of Object.entries(template)) {
    const value = input[field] ?? initial;
    if (Array.isArray(initial)) {
      if (!Array.isArray(value) || value.length > 50 || value.some(tag => typeof tag !== 'string' || tag.length > 200)) errors[field] = '技術タグは200文字以内、50件以内で入力してください。';
      content[field] = Array.isArray(value) ? [...value] : [];
    } else {
      const limit = field === 'body' ? 100000 : field === 'production' ? 5000 : 2000;
      if (typeof value !== 'string' || value.length > limit) errors[field] = `${limit}文字以内のテキストを入力してください。`;
      content[field] = typeof value === 'string' ? value : '';
    }
  }
  for (const field of ['link', 'demoLink', 'githubLink', 'detailsLink', 'titleImage', 'contentImage']) {
    if (!content[field]) continue;
    if (['titleImage', 'contentImage'].includes(field) && /^\/content\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp)$/.test(content[field])) continue;
    if (['titleImage', 'contentImage'].includes(field) && /^\/api\/media\/[a-zA-Z0-9_-]{1,100}$/.test(content[field])) continue;
    try {
      const url = new URL(content[field]);
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error();
    } catch { errors[field] = 'httpまたはhttpsの有効なURLを入力してください。'; }
  }
  if (kind === 'news' && content.articleDate) {
    const date = content.articleDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) errors.articleDate = '有効な日付を入力してください。';
  }
  if (publishing) {
    for (const field of kind === 'news' ? ['title', 'body', 'articleDate'] : ['title', 'summary']) {
      if (!content[field].trim()) errors[field] = '公開には入力が必要です。';
    }
  }
  for (const field of Object.keys(input)) if (!Object.hasOwn(template, field)) errors[field] = '未定義の項目です。';
  return { content, errors };
}
