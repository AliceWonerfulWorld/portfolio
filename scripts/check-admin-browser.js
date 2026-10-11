(async () => {
 const passed = [];
 const assert = (v, m) => { if (!v) throw new Error(m); passed.push(m); };
 const settle = () => new Promise(r => setTimeout(r, 100));
 const click = async text => { const b = [...document.querySelectorAll('button')].find(e => e.getClientRects().length && e.textContent.trim() === text); if (!b) throw new Error('Missing '+text); b.click(); await settle(); };
 const fill = async (id, value) => { const e=document.getElementById(id); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(e,value); e.dispatchEvent(new Event('input',{bubbles:true})); await settle(); };
 const originalConfirm = window.confirm;
 let accepted=false, confirmations=[];
 window.confirm=m=>{confirmations.push(m);return accepted;};
 const unloading = () => { const e=new Event('beforeunload',{cancelable:true});window.dispatchEvent(e);return e.defaultPrevented; };
 try {
 assert(location.pathname==='/admin','Authenticated reload stays on admin');
 assert(!unloading(),'Clean editor does not block unload');
 await click('新規追加');
 await fill('project-title','Issue9 project');
 assert(unloading(),'Draft blocks reload');
 await click('キャンセル');
 assert(document.getElementById('project-title').value==='Issue9 project','Rejected cancel preserves input');
 await click('ニュース編集');
 await click('新規追加');
 await fill('news-title','Issue9 news');
 await click('プロジェクト編集');
 assert(document.getElementById('project-title').value==='Issue9 project','Tab switch preserves project draft');
 await click('一覧に一時反映');
 assert(document.querySelector('.projects-list').textContent.includes('Issue9 project'),'Apply updates temporary list');
 await click('ニュース編集');
 assert(document.getElementById('news-title').value==='Issue9 news','Tab switch preserves news draft');
 accepted=true; await click('キャンセル'); accepted=false;
 assert(!document.getElementById('news-title'),'Confirmed cancel closes news form');
 await click('サイトを見る');
 assert(location.pathname==='/admin','Rejected route leave stays in admin');
 assert(unloading(),'Applied but unexported changes block reload');
 await click('プロジェクト編集');
 // Capture the actual exported Blob while preventing a test download.
 const originalCreate=URL.createObjectURL, originalClick=HTMLAnchorElement.prototype.click;
 let exportedBlob;
 URL.createObjectURL=blob=>{exportedBlob=blob;return originalCreate(blob);};
 HTMLAnchorElement.prototype.click=function(){};
 try { await click('JSONエクスポート'); } finally {URL.createObjectURL=originalCreate;HTMLAnchorElement.prototype.click=originalClick;}
 const exported=JSON.parse(await exportedBlob.text());
 assert(exported.some(p=>p.title==='Issue9 project'),'JSON includes temporary applied data');
 assert(exported.every(p=>!Object.hasOwn(p,'index')),'JSON excludes editor positions');
 assert(!unloading(),'Exported changes no longer block reload');
 await click('ニュース編集'); await click('新規追加'); await fill('news-title','news applied'); await click('一覧に一時反映');
 await click('ログアウト'); assert(location.pathname==='/admin'&&localStorage.getItem('adminToken'),'Rejected logout preserves session');
 confirmations=[]; accepted=true; await click('ログアウト');
 assert(location.pathname==='/'&&!localStorage.getItem('adminToken'),'Confirmed logout exits and clears session');
 assert(confirmations.length===1,'Logout confirms exactly once');
 return passed;
 } finally {window.confirm=originalConfirm;}
})()
