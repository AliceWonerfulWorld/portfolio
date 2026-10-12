// Run on a design news/project editor. This script changes only mock input.
(async () => {
  const checks = [];
  const check = (name, pass) => {checks.push({name, pass}); if (!pass) throw new Error(name);};
  const settle = () => new Promise(resolve => setTimeout(resolve, 40));
  const editor = document.querySelector('.markdown-editor');
  const [edit, preview] = editor.querySelectorAll('[role=tab]');
  const textarea = editor.querySelector('textarea');
  const sample = '# タブの確認\n\n**太字** と [リンク](https://example.com)\n\n- 項目\n\n| 項目 | 説明 |\n| --- | --- |\n| React | UI |\n\n```js\n' + 'const longCode = "' + 'x'.repeat(400) + '";\n```';
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(textarea, sample);
  textarea.dispatchEvent(new Event('input', {bubbles: true}));
  await settle();
  textarea.focus(); textarea.setSelectionRange(3, 8); textarea.scrollTop = 120;
  const scroll = textarea.scrollTop;
  const before = document.querySelector('.admin-editor-actions p').textContent;
  preview.click(); await settle();
  const panel = document.getElementById(preview.getAttribute('aria-controls'));
  check('preview selected and visible', preview.getAttribute('aria-selected') === 'true' && !panel.hidden && document.getElementById(edit.getAttribute('aria-controls')).hidden);
  check('rendered Markdown before saving', !!panel.querySelector('h3') && !!panel.querySelector('strong') && !!panel.querySelector('table') && !!panel.querySelector('pre code'));
  check('tab switch does not save or clear dirty state', document.querySelector('.admin-editor-actions p').textContent === before && before.includes('未保存'));
  check('long code scrolls inside preview', panel.querySelector('pre').scrollWidth > panel.querySelector('pre').clientWidth && document.documentElement.scrollWidth <= innerWidth);
  edit.click(); await settle();
  check('original input node and content retained', editor.querySelector('textarea') === textarea && textarea.value === sample);
  check('selection and scroll retained', textarea.selectionStart === 3 && textarea.selectionEnd === 8 && textarea.scrollTop === scroll);
  edit.focus();
  edit.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true})); await settle();
  check('arrow key selects and focuses preview', document.activeElement === preview && preview.getAttribute('aria-selected') === 'true');
  preview.dispatchEvent(new KeyboardEvent('keydown', {key: 'Home', bubbles: true})); await settle();
  check('Home returns focus to edit', document.activeElement === edit && edit.getAttribute('aria-selected') === 'true');
  check('tab targets at least 44px', [edit, preview].every(tab => tab.getBoundingClientRect().height >= 44));
  return {width: innerWidth, path: location.pathname, checks};
})()
