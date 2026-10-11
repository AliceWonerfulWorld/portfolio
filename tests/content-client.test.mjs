import test from 'node:test';
import assert from 'node:assert/strict';
import { contentMutation, sendMutation, getPublicContent } from '../src/utils/contentApi.js';

test('retry keeps a stable payload and request ID even if the caller changes input', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => {globalThis.fetch = originalFetch;});
  const input = {title: '保存する内容'};
  const mutation = contentMutation('news', '1', 'draft', 3, input);
  input.title = '新しい入力';
  const sent = [];
  globalThis.fetch = async (url, options) => {
    sent.push({url, options});
    if (sent.length === 1) throw new Error('Connection lost');
    return Response.json({version: 4, updatedAt: '2026-10-12T00:00:00.000Z'});
  };
  await assert.rejects(sendMutation(mutation), error => error.code === 'NETWORK');
  await sendMutation(mutation);
  assert.equal(sent[0].options.body, sent[1].options.body);
  assert.equal(JSON.parse(sent[0].options.body).content.title, '保存する内容');
  assert.equal(JSON.parse(sent[0].options.body).requestId, mutation.requestId);
});

test('Access login redirect is recognized as expired auth without following it', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => {globalThis.fetch = originalFetch;});
  globalThis.fetch = async (url, options) => {
    assert.equal(options.redirect, 'manual');
    return new Response(null, {status: 302, headers: {Location: 'https://team.cloudflareaccess.com/login'}});
  };
  await assert.rejects(sendMutation(contentMutation('news', '1', 'publish', 2)), error => error.status === 401 && error.code === 'SESSION_EXPIRED');
});

test('public read failure is never returned as an empty list', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => {globalThis.fetch = originalFetch;});
  globalThis.fetch = async () => Response.json({error: {code: 'UNAVAILABLE', message: '取得に失敗しました'}}, {status: 503});
  await assert.rejects(getPublicContent('news'), error => error.status === 503);
  globalThis.fetch = async () => new Response('<html>error</html>');
  await assert.rejects(getPublicContent('news'), error => error.code === 'INVALID_RESPONSE');
});
