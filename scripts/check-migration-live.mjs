import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const origin = process.argv[2] ?? 'http://127.0.0.1:8788';
const bundlePath = process.argv[3] ?? '/private/tmp/portfolio-migration-trial';
const bundle = JSON.parse(await readFile(resolve(bundlePath, 'content-v1.json'), 'utf8'));
for (const kind of ['news', 'projects']) {
  const response = await fetch(`${origin}/api/public/${kind}`);
  assert.equal(response.status, 200);
  const {records} = await response.json();
  const expected = bundle.records.filter(record => record.kind === kind);
  assert.equal(records.length, expected.length);
  assert.deepEqual(records.map(record => record.id), expected.map(record => record.id));
  for (const record of records) {
    assert.deepEqual(record.content, expected.find(item => item.id === record.id).published.content);
    assert.equal(record.sortOrder, expected.find(item => item.id === record.id).sortOrder);
    assert.deepEqual(Object.keys(record).sort(), ['content', 'id', 'kind', 'publishedAt', 'sortOrder']);
    const detail = await fetch(`${origin}/api/public/${kind}/${record.id}`);
    assert.deepEqual((await detail.json()).record, record);
  }
}
const assets = JSON.parse(await readFile(resolve(bundlePath, 'assets-manifest.json'), 'utf8'));
for (const asset of assets) {
  const response = await fetch(`${origin}${asset.destination}`);
  assert.equal(response.status, 200);
  assert.equal(createHash('sha256').update(new Uint8Array(await response.arrayBuffer())).digest('hex'), asset.sha256);
}
for (const path of ['session', 'news', 'projects', 'export']) {
  const response = await fetch(`${origin}/api/admin/${path}`, {headers: {Cookie: 'adminToken=forged'}});
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error.code, 'UNAUTHENTICATED');
}
const write = await fetch(`${origin}/api/admin/news/1/draft`, {method: 'PUT', headers: {'Content-Type': 'application/json', Origin: origin}, body: JSON.stringify({expectedVersion: 1, requestId: crypto.randomUUID(), content: {title: 'unauthorized'}})});
assert.equal(write.status, 401);
for (const path of ['/', '/admin', '/admin/news/1']) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /id="root"/);
}
console.log(`PASS: ${bundle.records.length} migrated snapshots, ${assets.length} exact image files, private API denies forged cookie and unauthenticated writes, SPA deep-link HTML`);
