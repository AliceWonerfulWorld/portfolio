import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, exportJWK, SignJWT, createLocalJWKSet } from 'jose';
import { emptyContent } from '../shared/content.js';
import { adminRequest, publicRequest } from '../server/http.js';
import { ContentRepository } from '../server/repository.js';
import { ContentService } from '../server/service.js';
import { LocalD1 } from './d1-adapter.mjs';
import { migrationRecords, migrationSql } from '../scripts/migration-plan.mjs';

const {privateKey, publicKey} = await generateKeyPair('RS256');
const jwk = await exportJWK(publicKey);
jwk.kid = 'test';
const resolveKeys = createLocalJWKSet({keys: [jwk]});
const auth = {ACCESS_TEAM_DOMAIN: 'https://portfolio-test.cloudflareaccess.com', ACCESS_AUD: 'portfolio-app', ADMIN_EMAILS: 'editor@example.com'};
const jwt = (overrides = {}) => new SignJWT({email: 'editor@example.com', type: 'app', ...overrides})
  .setProtectedHeader({alg: 'RS256', kid: 'test'}).setIssuer(auth.ACCESS_TEAM_DOMAIN).setAudience(auth.ACCESS_AUD).setSubject('editor-1').setIssuedAt().setExpirationTime('1h').sign(privateKey);
const token = await jwt();
const requestId = () => crypto.randomUUID();
const draft = (version, content) => ({expectedVersion: version, content, requestId: requestId()});
const action = version => ({expectedVersion: version, requestId: requestId()});
function setup() {
  const db = new LocalD1();
  const repository = new ContentRepository(db);
  const service = new ContentService(repository);
  const env = {...auth, CONTENT_DB: db};
  const call = (path, {method = 'GET', body, assertion = token, origin = 'https://portfolio.example', cookie, type = 'application/json'} = {}) => {
    const headers = {'Content-Type': type, Origin: origin};
    if (assertion) headers['Cf-Access-Jwt-Assertion'] = assertion;
    if (cookie) headers.Cookie = cookie;
    return adminRequest({env, request: new Request(`https://portfolio.example/api/admin/${path}`, {method, headers, ...(body ? {body: JSON.stringify(body)} : {})})}, resolveKeys);
  };
  return {db, repository, service, env, call};
}

test('authentication verifies real signatures, expiration, audience, issuer and admin rights', async t => {
  const {db, call} = setup(); t.after(() => db.close());
  assert.equal((await call('session')).status, 200);
  assert.equal((await call('session', {assertion: null, cookie: 'adminToken=forged'})).status, 401);
  assert.equal((await call('news', {assertion: 'forged'})).status, 401);
  assert.equal((await call('projects/p1/draft', {method: 'PUT', body: draft(0, emptyContent('projects')), assertion: null})).status, 401);
  const wrongAudience = await new SignJWT({email: 'editor@example.com', type: 'app'}).setProtectedHeader({alg: 'RS256', kid: 'test'}).setIssuer(auth.ACCESS_TEAM_DOMAIN).setAudience('different-app').setSubject('editor-1').setIssuedAt().setExpirationTime('1h').sign(privateKey);
  assert.equal((await call('news', {assertion: wrongAudience})).status, 401);
  const wrongIssuer = await new SignJWT({email: 'editor@example.com', type: 'app'}).setProtectedHeader({alg: 'RS256', kid: 'test'}).setIssuer('https://wrong.cloudflareaccess.com').setAudience(auth.ACCESS_AUD).setSubject('editor-1').setIssuedAt().setExpirationTime('1h').sign(privateKey);
  assert.equal((await call('news', {assertion: wrongIssuer})).status, 401);
  const expired = await new SignJWT({email: 'editor@example.com', type: 'app'}).setProtectedHeader({alg: 'RS256', kid: 'test'}).setIssuer(auth.ACCESS_TEAM_DOMAIN).setAudience(auth.ACCESS_AUD).setSubject('editor-1').setIssuedAt().setExpirationTime('0s').sign(privateKey);
  assert.equal((await call('news', {assertion: expired})).status, 401);
  assert.equal((await call('news', {assertion: await jwt({email: 'other@example.com'})})).status, 403);
  assert.equal((await call('news', {assertion: await jwt({type: 'service'})})).status, 403);
});

test('drafts can be incomplete; publishing validates dates, required fields and URLs', async t => {
  const {db, call} = setup(); t.after(() => db.close());
  assert.equal((await call('news/n1/draft', {method: 'PUT', body: draft(0, emptyContent('news'))})).status, 200);
  const incomplete = await call('news/n1/publish', {method: 'POST', body: action(1)});
  assert.equal(incomplete.status, 422);
  assert.deepEqual(Object.keys((await incomplete.json()).error.fields).sort(), ['articleDate', 'body', 'title']);
  assert.equal((await call('news/n1/draft', {method: 'PUT', body: draft(1, {...emptyContent('news'), articleDate: '2026-02-30'})})).status, 422);
  assert.equal((await call('news/n1/draft', {method: 'PUT', body: draft(1, {...emptyContent('news'), link: 'javascript:alert(1)'})})).status, 422);
  assert.equal((await call('projects/p1/draft', {method: 'PUT', body: draft(0, {...emptyContent('projects'), title: '作品', summary: '短い説明'})})).status, 200);
  assert.equal((await call('projects/p1/publish', {method: 'POST', body: action(1)})).status, 200);
});

test('public snapshots stay unchanged until atomic publish; private fields never leak', async t => {
  const {db, call, env, repository} = setup(); t.after(() => db.close());
  const content = {...emptyContent('news'), title: '公開版', articleDate: '2026-10-11', body: '<script>unsafe</script>\nhttps://example.com'};
  await call('news/n1/draft', {method: 'PUT', body: draft(0, content)});
  const publicRead = () => publicRequest({env, request: new Request('https://portfolio.example/api/public/news')});
  assert.deepEqual((await (await publicRead()).json()).records, []);
  await call('news/n1/publish', {method: 'POST', body: action(1)});
  const published = (await (await publicRead()).json()).records[0];
  assert.equal(published.content.body, content.body);
  assert.ok(!('draft' in published) && !('version' in published) && !('updatedAt' in published));
  await call('news/n1/draft', {method: 'PUT', body: draft(2, {...content, title: '非公開の変更'})});
  assert.equal((await repository.get('news', 'n1')).publicationState, 'changed');
  assert.equal((await (await publicRead()).json()).records[0].content.title, '公開版');
  await call('news/n1/publish', {method: 'POST', body: action(3)});
  assert.equal((await (await publicRead()).json()).records[0].content.title, '非公開の変更');
  await call('news/n1/unpublish', {method: 'POST', body: action(4)});
  assert.deepEqual((await (await publicRead()).json()).records, []);
  assert.equal((await repository.get('news', 'n1')).draft.title, '非公開の変更');
});

test('uncertain retries replay original responses; changed reuse and stale writes conflict', async t => {
  const {db, service, repository} = setup(); t.after(() => db.close());
  const input = draft(0, {...emptyContent('projects'), title: '入力を保持'});
  const first = await service.mutate('editor', 'projects', 'p1', 'draft', input);
  assert.deepEqual(await service.mutate('editor', 'projects', 'p1', 'draft', input), first);
  assert.equal((await repository.get('projects', 'p1')).version, 1);
  await assert.rejects(service.mutate('editor', 'projects', 'p1', 'draft', {...input, content: emptyContent('projects')}), error => error.code === 'REQUEST_REUSED');
  const candidates = await Promise.allSettled([service.mutate('editor', 'projects', 'p1', 'draft', draft(1, {...input.content, title: 'A'})), service.mutate('editor', 'projects', 'p1', 'draft', draft(1, {...input.content, title: 'B'}))]);
  assert.equal(candidates.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(candidates.find(result => result.status === 'rejected').reason.code, 'CONFLICT');
  assert.equal((await repository.get('projects', 'p1')).version, 2);
  assert.equal(input.content.title, '入力を保持');
  const duplicated = draft(2, {...input.content, title: 'same request'});
  const simultaneous = await Promise.all([service.mutate('editor', 'projects', 'p1', 'draft', duplicated), service.mutate('editor', 'projects', 'p1', 'draft', duplicated)]);
  assert.deepEqual(simultaneous[0], simultaneous[1]);
  assert.equal((await repository.get('projects', 'p1')).version, 3);
});

test('storage failure rolls back data and retry receipt together', async t => {
  const {db, service, repository} = setup(); t.after(() => db.close());
  const input = draft(0, {...emptyContent('projects'), title: '失われない入力'});
  db.failNextBatch = true;
  await assert.rejects(service.mutate('editor', 'projects', 'p1', 'draft', input));
  assert.equal(await repository.get('projects', 'p1'), null);
  assert.equal(await repository.operation('editor', input.requestId), null);
  assert.equal((await service.mutate('editor', 'projects', 'p1', 'draft', input)).version, 1);
});

test('discard and delete respect live content, media references and stable IDs', async t => {
  const {db, service, repository} = setup(); t.after(() => db.close());
  const content = {...emptyContent('projects'), title: '公開中', summary: '説明', titleImage: '/content/legacy/image.png'};
  await service.mutate('editor', 'projects', 'p1', 'draft', draft(0, content));
  await service.mutate('editor', 'projects', 'p1', 'publish', action(1));
  await service.mutate('editor', 'projects', 'p1', 'draft', draft(2, {...content, titleImage: ''}));
  await assert.rejects(service.mutate('editor', 'projects', 'p1', 'delete', action(3)), error => error.code === 'PUBLISHED_DELETE');
  await service.mutate('editor', 'projects', 'p1', 'discard', action(3));
  assert.equal((await repository.get('projects', 'p1')).draft.titleImage, content.titleImage);
  await service.mutate('editor', 'projects', 'p1', 'unpublish', action(4));
  const deletion = action(5);
  await service.mutate('editor', 'projects', 'p1', 'delete', deletion);
  assert.equal(await repository.get('projects', 'p1'), null);
  assert.equal((await service.mutate('editor', 'projects', 'p1', 'delete', deletion)).version, 6);
  await assert.rejects(service.mutate('editor', 'projects', 'p1', 'draft', draft(0, content)), error => error.code === 'CONFLICT');
  const backup = await service.export();
  assert.equal(backup.records[0].deleted, true);
  assert.equal(backup.records[0].draft.titleImage, content.titleImage);
});

test('same origin and JSON required; missing storage is an error, not an empty list', async t => {
  const {db, call} = setup(); t.after(() => db.close());
  const options = {method: 'PUT', body: draft(0, emptyContent('projects'))};
  assert.equal((await call('projects/p1/draft', {...options, origin: 'https://evil.example'})).status, 403);
  assert.equal((await call('projects/p1/draft', {...options, type: 'text/plain'})).status, 415);
  const response = await publicRequest({env: {}, request: new Request('https://portfolio.example/api/public/news')});
  assert.equal(response.status, 503);
  assert.ok(!('records' in await response.json()));
});

test('migration preserves titles, newlines, URLs and external articles; reruns never overwrite', t => {
  const db = new LocalD1(); t.after(() => db.close());
  const news = [{id: 1, title: '見出し\n続き', content: '本文\nhttps://example.com/a', date: '2025年7月5日', link: '#'}];
  const projects = [{id: 'p1', title: '作品', summary: '説明', description: '詳しい\n紹介', titleImage: '/content/legacy/a.png', detailsLink: 'https://topaz.dev/projects/p1'}];
  const bundle = migrationRecords(news, projects);
  db.sqlite.exec(migrationSql(bundle)); db.sqlite.exec(migrationSql(bundle));
  const rows = db.sqlite.prepare('SELECT * FROM content ORDER BY kind').all();
  assert.equal(rows.length, 2);
  assert.equal(JSON.parse(rows[0].draft).body, news[0].content);
  assert.equal(JSON.parse(rows[0].draft).title, news[0].title);
  assert.equal(JSON.parse(rows[0].draft).articleDate, '2025-07-05');
  assert.equal(JSON.parse(rows[1].draft).detailsLink, projects[0].detailsLink);
  db.sqlite.exec("UPDATE content SET version = 2 WHERE id = 'p1'");
  db.sqlite.exec(migrationSql(bundle));
  assert.equal(db.sqlite.prepare("SELECT version FROM content WHERE id = 'p1'").get().version, 2);
});

test('JSON export restores drafts, snapshots, versions and tombstones into an empty database', async t => {
  const {restoreSql} = await import('../scripts/restore-plan.mjs');
  const {db, service} = setup();
  const restored = new LocalD1();
  t.after(() => {db.close(); restored.close();});
  const content = {...emptyContent('projects'), title: "作品's", summary: '説明', body: '本文\nhttps://example.com'};
  await service.mutate('editor', 'projects', 'p1', 'draft', draft(0, content));
  await service.mutate('editor', 'projects', 'p1', 'publish', action(1));
  await service.mutate('editor', 'projects', 'p1', 'draft', draft(2, {...content, title: '未公開の変更'}));
  await service.mutate('editor', 'projects', 'deleted', 'draft', draft(0, content));
  await service.mutate('editor', 'projects', 'deleted', 'delete', action(1));
  const backup = await service.export();
  restored.sqlite.exec(restoreSql(backup));
  assert.deepEqual(await new ContentRepository(restored).export(), backup.records);
  assert.throws(() => restored.sqlite.exec(restoreSql(backup)), /UNIQUE/);
  assert.throws(() => restoreSql({...backup, schemaVersion: 2}), /Unsupported/);
});
