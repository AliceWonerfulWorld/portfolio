import { CONTENT_KINDS } from '../shared/content.js';
import { authenticate, validateWriteOrigin } from './auth.js';
import { ApiError, errorResponse, json } from './errors.js';
import { ContentRepository } from './repository.js';
import { ContentService, validateIdentity } from './service.js';

async function readJson(request) {
  if (!request.body) throw new ApiError(400, 'INVALID_JSON', 'JSONを送信してください。');
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const {value, done} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 512000) { await reader.cancel(); throw new ApiError(413, 'TOO_LARGE', '入力データが大きすぎます。'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.byteLength;}
  try { return JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes)); }
  catch { throw new ApiError(400, 'INVALID_JSON', 'JSON形式が不正です。'); }
}

export async function adminRequest({request, env}, resolveKeys) {
  try {
    const actor = await authenticate(request, env, resolveKeys);
    const path = new URL(request.url).pathname.replace(/^\/api\/admin\/?/, '').split('/').filter(Boolean);
    if (path.join('/') === 'session' && request.method === 'GET') return json({user: actor});
    if (!env.CONTENT_DB) throw new ApiError(503, 'STORAGE_UNCONFIGURED', '保存先の設定が完了していません。');
    const repository = new ContentRepository(env.CONTENT_DB);
    const service = new ContentService(repository);
    if (path.join('/') === 'export' && request.method === 'GET') {
      const response = json(await service.export());
      response.headers.set('Content-Disposition', 'attachment; filename="portfolio-content-v1.json"');
      return response;
    }
    if (path.length === 1 && CONTENT_KINDS.includes(path[0]) && request.method === 'GET') return json({records: await repository.list(path[0])});
    const [kind, id, action] = path;
    validateIdentity(kind, id);
    if (path.length === 2 && request.method === 'GET') {
      const record = await repository.get(kind, id);
      if (!record) throw new ApiError(404, 'NOT_FOUND', '記事が見つかりません。');
      return json({record});
    }
    if (path.length !== 3 || (action === 'draft' ? request.method !== 'PUT' : request.method !== 'POST')) throw new ApiError(405, 'METHOD', 'この操作は利用できません。');
    validateWriteOrigin(request);
    return json(await service.mutate(actor.id, kind, id, action, await readJson(request)));
  } catch (error) { return errorResponse(error); }
}

export async function publicRequest({request, env}) {
  try {
    if (request.method !== 'GET') throw new ApiError(405, 'METHOD', '読み取り専用です。');
    const path = new URL(request.url).pathname.replace(/^\/api\/public\/?/, '').split('/').filter(Boolean);
    if (path.length < 1 || path.length > 2) throw new ApiError(404, 'NOT_FOUND', 'ページが見つかりません。');
    const [kind, id] = path;
    validateIdentity(kind, id);
    if (!env.CONTENT_DB) throw new ApiError(503, 'STORAGE_UNCONFIGURED', '公開データを取得できませんでした。再試行してください。');
    const records = await new ContentRepository(env.CONTENT_DB).publicList(kind, id);
    if (id && records.length === 0) throw new ApiError(404, 'NOT_FOUND', '公開記事が見つかりません。');
    return json(id ? {record: records[0]} : {records});
  } catch (error) { return errorResponse(error); }
}
