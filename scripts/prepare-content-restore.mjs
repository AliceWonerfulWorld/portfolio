import { readFile, writeFile } from 'node:fs/promises';
import { restoreSql } from './restore-plan.mjs';
const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw new Error('Usage: node scripts/prepare-content-restore.mjs backup-v1.json restore.sql');
const bundle = JSON.parse(await readFile(source, 'utf8'));
await writeFile(destination, restoreSql(bundle));
console.log(`Prepared restore SQL for ${bundle.records.length} records. No database was modified. Apply only to an empty replacement database.`);
