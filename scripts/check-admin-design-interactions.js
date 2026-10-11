// Start on /admin/design/news/open-campus with the default fixture.
(async () => {
  const checks = [];
  const check = (name, pass) => {checks.push({name, pass}); if (!pass) throw new Error(name);};
  const settle = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));
  const originalConfirm = window.confirm;
  const change = async (selector, value) => {
    const element = document.querySelector(selector);
    const prototype = element.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value);
    element.dispatchEvent(new Event(element.tagName === 'SELECT' ? 'change' : 'input', {bubbles: true}));
    await settle(30);
  };
  try {
    const title = '入力を保持して再試行するニュース';
    await change('#field-title', title);
    check('dirty disables publication', document.querySelector('.admin-editor-actions .primary').disabled);
    for (const failure of ['network', 'auth', 'conflict']) {
      await change('#save-example', failure);
      document.querySelector('.admin-editor-actions .secondary').click();
      await settle(30);
      check(`${failure}: saving announced`, document.querySelector('.admin-editor-actions p').textContent.includes('保存中'));
      await settle();
      check(`${failure}: input retained and failure announced`, document.querySelector('#field-title').value === title && !!document.querySelector('[role=alert]'));
    }
    window.confirm = () => false;
    const before = location.pathname;
    document.querySelector('.admin-back').click(); await settle(60);
    check('unsaved navigation cancel keeps input and route', location.pathname === before && document.querySelector('#field-title').value === title);
    window.confirm = originalConfirm;
    await change('#save-example', 'none');
    document.querySelector('.admin-editor-actions .secondary').click(); await settle();
    check('save retry clears dirty but keeps publication separate', !document.querySelector('.admin-editor-actions .primary').disabled && document.querySelector('.admin-badge').textContent.includes('変更下書き'));
    await change('#save-example', 'network');
    document.querySelector('.admin-editor-actions .primary').click(); await settle(30);
    check('publish requires confirmation', document.querySelector('dialog').open);
    document.querySelector('dialog .primary').click(); await settle(30);
    check('publication waits for completion', document.querySelector('.admin-editor-actions p').textContent.includes('公開中'));
    await settle();
    check('publish failure keeps existing publication and draft', document.querySelector('#field-title').value === title && document.querySelector('.admin-badge').textContent.includes('変更下書き') && document.querySelector('[role=alert]').textContent.includes('公開できません'));
    await change('#save-example', 'none');
    document.querySelector('.admin-editor-actions .primary').click(); await settle(30);
    document.querySelector('dialog .primary').click(); await settle();
    check('publication retry succeeds separately', document.querySelector('.admin-badge').textContent === '公開済み' && document.querySelector('.admin-feedback').textContent.includes('動作例'));
    document.querySelector('.admin-back').click(); await settle(60);
    document.querySelector('.admin-page-heading .primary').click(); await settle(60);
    check('new record has fresh empty input and dirty state', location.pathname.endsWith('/new') && document.querySelector('#field-title').value === '' && document.querySelector('.admin-editor-actions p').textContent.includes('未保存'));
    document.querySelector('.admin-editor-actions .secondary').click(); await settle();
    check('incomplete draft can be saved', document.querySelector('.admin-feedback').textContent.includes('下書き保存済み'));
    document.querySelector('.admin-editor-actions .primary').click(); await settle(30);
    check('publication validates required fields', !document.querySelector('dialog').open && document.querySelectorAll('.admin-field-error').length === 3);
    return {checks};
  } finally {window.confirm = originalConfirm;}
})()
