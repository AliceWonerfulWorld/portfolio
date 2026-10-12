import { createServer } from 'vite';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { migrationRecords, migrationSql } from './migration-plan.mjs';

const output = process.argv[2];
if (!output) throw new Error('Usage: npm run migration:prepare -- /private/tmp/portfolio-migration');
const server = await createServer({server: {middlewareMode: true, hmr: false, ws: false}, appType: 'custom', optimizeDeps: {noDiscovery: true, include: []}});
try {
  const {newsItems} = await server.ssrLoadModule('/src/data/news.js');
  const {projects} = await server.ssrLoadModule('/src/data/projects.js');
  const images = new Map();
  const imagePath = value => {
    if (!value.startsWith('/src/assets/')) return value;
    const destination = `/content/legacy/${basename(value)}`;
    images.set(destination, value.slice(1));
    return destination;
  };
  const bundle = migrationRecords(newsItems, projects, undefined, imagePath);
  await mkdir(resolve(output, 'assets/content/legacy'), {recursive: true});
  const assetManifest = [];
  for (const [destination, source] of images) {
    const bytes = await readFile(source);
    await copyFile(source, resolve(output, `assets${destination}`));
    assetManifest.push({source, destination, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex')});
  }
  await writeFile(resolve(output, 'content-v1.json'), JSON.stringify(bundle, null, 2) + '\n');
  await writeFile(resolve(output, 'import.sql'), migrationSql(bundle));
  await writeFile(resolve(output, 'legacy-backup.json'), JSON.stringify({newsItems, projects}, null, 2) + '\n');
  await writeFile(resolve(output, 'assets-manifest.json'), JSON.stringify(assetManifest, null, 2) + '\n');
  console.log(`Prepared ${bundle.records.length} records and ${images.size} image files in ${resolve(output)}. No database was modified.`);
} finally {await server.close();}
