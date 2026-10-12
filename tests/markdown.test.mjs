import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({server: {middlewareMode: true, hmr: false, ws: false}, appType: 'custom', optimizeDeps: {noDiscovery: true, include: []}});
const {default: MarkdownContent} = await server.ssrLoadModule('/src/components/content/MarkdownContent.jsx');
const render = text => renderToStaticMarkup(React.createElement(MarkdownContent, {text}));
test.after(async () => {await server.close();});

test('preview renders Markdown and GFM with nested heading levels', () => {
  const output = render('# 見出し\n\n**強調**と~~打消~~\n\n- ひとつ\n- ふたつ\n\n[リンク](https://example.com)\n\n| 技術 | 用途 |\n| --- | --- |\n| React | UI |\n\n```js\nconst x = 1;\n```');
  assert.match(output, /<h3>見出し<\/h3>/);
  assert.match(output, /<strong>強調<\/strong>/);
  assert.match(output, /<del>打消<\/del>/);
  assert.match(output, /<li>ひとつ<\/li>/);
  assert.match(output, /<table>/);
  assert.match(output, /<pre tabindex="0"/);
  assert.match(output, /class="language-js"/);
  assert.match(output, /target="_blank" rel="noopener noreferrer"/);
});

test('raw HTML stays inert and unsafe link or image schemes are rejected', () => {
  const output = render('<script>alert(1)</script>\n\n[危険](javascript:alert(1))\n\n[危険2](javascript&#58;alert(1))\n\n![画像](data:image/svg+xml;base64,PHN2Zz4=)\n\n[認証情報](https://user:password@example.com)\n\n<img src=x onerror=alert(1)>');
  assert.doesNotMatch(output, /<script|<img\b|href="javascript|src="data:|user:password/);
  assert.match(output, /&lt;script&gt;/);
  assert.match(output, /&lt;img/);
});

test('safe images, local media references, literal empty state and tables remain usable', () => {
  const output = render('![作品](/api/media/image-1)\n\n![外部](https://example.com/image.png)\n\n[メール](mailto:editor@example.com)');
  assert.match(output, /src="\/api\/media\/image-1" alt="作品" loading="lazy"/);
  assert.match(output, /src="https:\/\/example.com\/image.png"/);
  assert.match(output, /href="mailto:editor@example.com"/);
  assert.match(render('  \n '), /本文を入力すると/);
});
