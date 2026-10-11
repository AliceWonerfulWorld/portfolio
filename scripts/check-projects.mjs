import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

// SSR exercises empty/single-item data and escaping without a browser or port.
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
});

try {
  const { default: Projects } = await server.ssrLoadModule('/src/components/sections/Projects.jsx');
  const { projects } = await server.ssrLoadModule('/src/data/projects.js');
  const render = items => renderToStaticMarkup(React.createElement(Projects, { items }));
  const originalOrder = projects.map(project => project.id);
  const all = render(projects);

  for (const project of projects) {
    const title = renderToStaticMarkup(React.createElement('h3', null, project.title));
    assert.equal(all.split(title).length - 1, 1, 'Every project has exactly one visible heading');
  }
  assert.ok(all.indexOf('クイズマスター') < all.indexOf('寝過ごしパニック！'));
  assert.ok(!all.includes('代表作'));
  assert.deepEqual(projects.map(project => project.id), originalOrder, 'Rendering does not reorder editor data');
  assert.match(render([]), /作品は準備中/);
  assert.ok(!render([]).includes('<article>'));
  const single = render([projects[0]]);
  assert.equal((single.match(/<article>/g) ?? []).length, 1);
  assert.match(single, /<details/);
  assert.match(single, /<summary/);
  assert.match(single, /作品を開く/);
  assert.ok(!all.includes('carousel'));

  const missingOptionalFields = render([{ title: '画像なし', description: '' }]);
  assert.match(missingOptionalFields, /画像準備中/);
  assert.ok(!missingOptionalFields.includes('<details'));
  assert.ok(!missingOptionalFields.includes('href='));

  const unusualContent = render([{
    title: '長い作品名'.repeat(50),
    description: '<script>alert(1)</script>\nhttps://example.com',
    tags: ['long-tag'.repeat(80)],
    link: '#',
  }]);
  assert.ok(!unusualContent.includes('<script>'));
  assert.match(unusualContent, /&lt;script&gt;/);
  assert.match(unusualContent, /href="https:\/\/example.com"/);
  assert.ok(!unusualContent.includes('href="#"'));

  console.log('PASS: all projects, source order, immutable data, empty/single states, optional fields, safe descriptions');
} finally {
  await server.close();
}
