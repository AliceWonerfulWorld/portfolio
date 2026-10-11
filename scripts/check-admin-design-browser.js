// Run with agent-browser eval --stdin on each /admin/design page and viewport.
(() => {
  const checks = [];
  const check = (name, pass) => {checks.push({name, pass}); if (!pass) throw new Error(name);};
  const root = document.querySelector('.admin-design');
  check('design notice is present', !!document.querySelector('.admin-design-notice'));
  check('one page heading', document.querySelectorAll('h1').length === 1);
  check('current location announced', !!document.querySelector('[aria-current="page"]'));
  check('no horizontal page overflow', document.documentElement.scrollWidth <= innerWidth);
  const outside = [...root.querySelectorAll('*')].filter(element => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
  });
  check('content fits viewport', outside.length === 0);
  const controls = [...root.querySelectorAll('button,input,select,a')].filter(element => element.getClientRects().length && !element.matches('.admin-skip'));
  check('controls have 44px target height', controls.every(element => element.getBoundingClientRect().height >= 44));
  if (innerWidth <= 768) {
    check('mobile menu closed', getComputedStyle(document.querySelector('.admin-sidebar')).display === 'none');
    const bar = document.querySelector('.admin-editor-actions');
    if (bar) check('mobile action bar fixed', getComputedStyle(bar).position === 'fixed' && Math.abs(bar.getBoundingClientRect().bottom - innerHeight) <= 1);
  } else {
    check('desktop sidebar visible', getComputedStyle(document.querySelector('.admin-sidebar')).display !== 'none');
    const bar = document.querySelector('.admin-editor-actions');
    if (bar) check('desktop action bar sticky', getComputedStyle(bar).position === 'sticky');
  }
  return {width: innerWidth, path: location.pathname, checks};
})()
