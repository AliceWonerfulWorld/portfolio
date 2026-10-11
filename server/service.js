import { CONTENT_KINDS, SCHEMA_VERSION, publicationState, validateContent } from '../shared/content.js';
import { ApiError } from './errors.js';

export function validateIdentity(kind, id) {
  if (!CONTENT_KINDS.includes(kind) || (id !== undefined && !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(id))) throw new ApiError(400, 'INVALID_ROUTE', '種類またはIDが不正です。');
}

export class ContentService {
  constructor(repository, now = () => new Date().toISOString()) { this.repository = repository; this.now = now; }
  async mutate(actor, kind, id, action, input) {
    validateIdentity(kind, id);
    if (!['draft', 'publish', 'unpublish', 'discard', 'delete'].includes(action)) throw new ApiError(404, 'NOT_FOUND', '操作が見つかりません。');
    if (!input || !Number.isSafeInteger(input.expectedVersion) || input.expectedVersion < 0 || !/^[a-zA-Z0-9_-]{16,100}$/.test(input.requestId ?? '')) throw new ApiError(400, 'INVALID_REQUEST', '更新バージョンと一意のリクエストIDが必要です。');
    if (Object.keys(input).some(key => !['expectedVersion', 'requestId', ...(action === 'draft' ? ['content'] : [])].includes(key))) throw new ApiError(400, 'INVALID_REQUEST', '未定義のリクエスト項目です。');
    const fingerprint = JSON.stringify({kind, id, action, expectedVersion: input.expectedVersion, content: input.content});
    const replay = async () => {
      const operation = await this.repository.operation(actor, input.requestId);
      if (!operation) return null;
      if (operation.fingerprint !== fingerprint) throw new ApiError(409, 'REQUEST_REUSED', '同じリクエストIDが異なる操作に使われています。');
      return JSON.parse(operation.response);
    };
    const previous = await replay();
    if (previous) return previous;
    const existing = await this.repository.get(kind, id);
    if (!existing && (action !== 'draft' || input.expectedVersion !== 0)) throw new ApiError(404, 'NOT_FOUND', '記事が見つかりません。入力を保持してください。');
    if (existing && existing.version !== input.expectedVersion) throw new ApiError(409, 'CONFLICT', '別の編集で更新されています。入力を保持して最新の内容と比較してください。', {currentVersion: existing.version, updatedAt: existing.updatedAt});
    const now = this.now();
    const record = existing ? structuredClone(existing) : {kind, id, draft: null, published: null, createdAt: now, sortOrder: await this.repository.nextSortOrder(kind)};
    if (action === 'draft') {
      const {content, errors} = validateContent(kind, input.content);
      if (Object.keys(errors).length) throw new ApiError(422, 'VALIDATION', '入力内容を確認してください。', {fields: errors});
      record.draft = content;
    } else if (action === 'publish') {
      const {errors} = validateContent(kind, record.draft, true);
      if (Object.keys(errors).length) throw new ApiError(422, 'VALIDATION', '公開に必要な項目を確認してください。', {fields: errors});
      record.published = {content: structuredClone(record.draft), publishedAt: now};
    } else if (action === 'unpublish') {
      if (!record.published) throw new ApiError(409, 'NOT_PUBLISHED', 'この記事は未公開です。');
      record.published = null;
    } else if (action === 'discard') {
      if (!record.published) throw new ApiError(409, 'NOT_PUBLISHED', '未公開の下書きは削除操作を使ってください。');
      record.draft = structuredClone(record.published.content);
    } else if (record.published) {
      throw new ApiError(409, 'PUBLISHED_DELETE', '公開中の記事は削除できません。先に非公開化してください。');
    }
    record.version = input.expectedVersion + 1;
    record.updatedAt = now;
    record.publicationState = publicationState(record);
    let result;
    try {
      result = await this.repository.mutate({actor, requestId: input.requestId, fingerprint, record, expectedVersion: input.expectedVersion, deleting: action === 'delete'});
    } catch (error) {
      // Concurrent duplicate receipt insert rolls back the whole transaction.
      const duplicate = await replay();
      if (duplicate) return duplicate;
      throw error;
    }
    if (result) return result;
    const duplicate = await replay();
    if (duplicate) return duplicate;
    const latest = await this.repository.get(kind, id);
    throw new ApiError(409, 'CONFLICT', '更新競合が発生しました。入力を保持して最新の内容と比較してください。', {currentVersion: latest?.version ?? null, updatedAt: latest?.updatedAt ?? null});
  }
  async export() {
    return {schemaVersion: SCHEMA_VERSION, exportedAt: this.now(), records: await this.repository.export()};
  }
}
