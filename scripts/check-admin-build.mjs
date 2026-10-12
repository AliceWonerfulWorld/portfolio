import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
const files = (await readdir('dist/assets')).filter(file => file.endsWith('.js'));
const code = (await Promise.all(files.map(file => readFile(`dist/assets/${file}`, 'utf8')))).join('\n');
for (const forbidden of ['VITE_ADMIN_PASSWORD', 'adminToken', 'open-campus', 'new-event', 'sample-game', '表示状態の確認']) assert.ok(!code.includes(forbidden), `Production bundle includes ${forbidden}`);
assert.deepEqual(JSON.parse(await readFile('dist/_routes.json', 'utf8')), {version: 1, include: ['/api/*'], exclude: []});
console.log('PASS: development mock routes/data and legacy password/token auth excluded from production, API-only Functions routing');
