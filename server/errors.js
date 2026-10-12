export class ApiError extends Error {
  constructor(status, code, message, details = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
export function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
export function errorResponse(error) {
  if (error instanceof ApiError) return json({ error: { code: error.code, message: error.message, ...error.details } }, error.status);
  return json({ error: { code: 'UNAVAILABLE', message: 'サーバーに接続できませんでした。入力を保持して再試行してください。' } }, 503);
}
