import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ApiError } from './errors.js';

const keys = new Map();
export function accessConfig(env) {
  if (!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_TEAM_DOMAIN ?? '') || !env.ACCESS_AUD || !env.ADMIN_EMAILS) throw new ApiError(503, 'AUTH_UNCONFIGURED', '管理者認証の設定が完了していません。');
  return {issuer: env.ACCESS_TEAM_DOMAIN, audience: env.ACCESS_AUD, emails: env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase()).filter(Boolean)};
}
export async function authenticate(request, env, resolveKeys) {
  const {issuer, audience, emails} = accessConfig(env);
  // An untrusted header or a browser-local token alone never establishes identity.
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) throw new ApiError(401, 'UNAUTHENTICATED', '管理者としてログインしてください。入力は保持されています。');
  if (!keys.has(issuer)) keys.set(issuer, createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`)));
  let payload;
  try {
    ({payload} = await jwtVerify(token, resolveKeys ?? keys.get(issuer), {issuer, audience, algorithms: ['RS256'], requiredClaims: ['exp', 'iat', 'sub', 'email']}));
  } catch {
    throw new ApiError(401, 'SESSION_EXPIRED', '認証を確認できませんでした。入力を保持したまま再ログインしてください。');
  }
  if (typeof payload.email !== 'string' || !emails.includes(payload.email.toLowerCase()) || payload.type !== 'app') throw new ApiError(403, 'FORBIDDEN', 'このアカウントには編集権限がありません。');
  return {id: payload.sub, email: payload.email};
}
export function validateWriteOrigin(request) {
  const origin = request.headers.get('Origin');
  if (origin !== new URL(request.url).origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') throw new ApiError(403, 'ORIGIN', '同じサイトから操作してください。');
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new ApiError(415, 'CONTENT_TYPE', 'JSON形式で送信してください。');
}
