export class ContentApiError extends Error {
  constructor(status, error) { super(error.message); this.status = status; this.code = error.code; this.details = error; }
}
async function request(path, options = {}) {
  let response;
  try {response = await fetch(path, {credentials: 'same-origin', cache: 'no-store', redirect: 'manual', ...options});}
  catch {throw new ContentApiError(503, {code: 'NETWORK', message: '接続できませんでした。入力を保持して再試行してください。'});}
  if (response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400)) throw new ContentApiError(401, {code: 'SESSION_EXPIRED', message: '認証が切れました。入力を保持したまま再ログインしてください。'});
  let data;
  try {data = await response.json();}
  catch {throw new ContentApiError(503, {code: 'INVALID_RESPONSE', message: 'サーバー応答を確認できませんでした。入力を保持してください。'});}
  if (!response.ok) throw new ContentApiError(response.status, data.error ?? {code: 'UNAVAILABLE', message: '操作に失敗しました。'});
  return data;
}
export const getSession = () => request('/api/admin/session');
export const getContent = (kind, id) => request(`/api/admin/${kind}${id ? `/${encodeURIComponent(id)}` : ''}`);
export const getPublicContent = (kind, id) => request(`/api/public/${kind}${id ? `/${encodeURIComponent(id)}` : ''}`);
// Keep this request object, including requestId, when retrying an uncertain response.
export const contentMutation = (kind, id, action, expectedVersion, content) => ({kind, id, action, expectedVersion, content: content === undefined ? undefined : structuredClone(content), requestId: crypto.randomUUID()});
export const sendMutation = mutation => request(`/api/admin/${mutation.kind}/${encodeURIComponent(mutation.id)}/${mutation.action}`, {
  method: mutation.action === 'draft' ? 'PUT' : 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({requestId: mutation.requestId, expectedVersion: mutation.expectedVersion, ...(mutation.action === 'draft' ? {content: mutation.content} : {})}),
});
export const exportContent = () => request('/api/admin/export');
