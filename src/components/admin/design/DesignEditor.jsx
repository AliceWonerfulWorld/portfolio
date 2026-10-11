import { useEffect, useRef, useState } from 'react';
import { Link, useBlocker, useOutletContext, useParams } from 'react-router-dom';
import { emptyContent, SAVE_STATES, validateContent } from '../../../../shared/content.js';
import { PublicationBadge } from './AdminViews.jsx';
import { designRecords } from './fixtures.js';

function DesignEditor({kind}) {
  const {id} = useParams();
  const {base} = useOutletContext();
  const source = designRecords.find(record => record.kind === kind && record.id === id);
  const [content, setContent] = useState(source?.draft ?? emptyContent(kind));
  const [saved, setSaved] = useState(source?.draft ?? null);
  const [saveState, setSaveState] = useState(source ? 'saved' : 'dirty');
  const [published, setPublished] = useState(source?.publicationState === 'draft' ? null : source?.publicationState === 'changed' ? {...source.draft, body: '以前に公開した内容です。'} : source?.draft ?? null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [failure, setFailure] = useState('none');
  const [busy, setBusy] = useState(false);
  const [publishProgress, setPublishProgress] = useState('idle');
  const dialog = useRef(null);
  const publishButton = useRef(null);
  const timeout = useRef(null);
  const dirty = JSON.stringify(content) !== JSON.stringify(saved);
  const blocker = useBlocker(dirty || busy);
  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm('未保存の変更があります。破棄して移動しますか？')) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = event => {event.preventDefault(); event.returnValue = '';};
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  const label = kind === 'news' ? 'ニュース' : '作品';
  const state = !published ? 'draft' : JSON.stringify(published) === JSON.stringify(content) ? 'published' : 'changed';
  const update = (field, value) => {setContent(previous => ({...previous, [field]: value})); setSaveState('dirty'); setStatus('');};
  const field = (name, text, {multiline = false, type = 'text', required = false, help} = {}) => {
    const props = {id: `field-${name}`, value: content[name], type, onChange: event => update(name, event.target.value), 'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? `error-${name}` : help ? `help-${name}` : undefined};
    return <div className="admin-field" key={name}><label htmlFor={props.id}>{text}{required && <span className="admin-field-required">公開時に必須</span>}</label>{multiline ? <textarea {...props} rows={name === 'body' ? 12 : 3} /> : <input {...props} />}{help && <p id={`help-${name}`} className="admin-field-help">{help}</p>}{errors[name] && <p className="admin-field-error" id={`error-${name}`}>{errors[name]}</p>}</div>;
  };
  const save = () => {
    const result = validateContent(kind, content);
    setErrors(result.errors);
    if (Object.keys(result.errors).length) {setSaveState('error'); setStatus('入力形式を確認してください。入力内容は保持しています。'); return;}
    const snapshot = structuredClone(content);
    setBusy(true); setSaveState('saving');
    timeout.current = setTimeout(() => {
      setBusy(false);
      if (failure !== 'none') {
        setSaveState('error');
        setStatus(failure === 'auth' ? '認証が切れました。入力を保持しています。再認証後に保存を再試行してください。' : failure === 'conflict' ? '別の編集で更新されています。入力を保持して最新の内容と比較してください。' : '保存できませんでした。入力を保持しています。再試行してください。');
      } else {setSaved(snapshot); setSaveState('saved'); setStatus(`下書き保存済み（動作例） ${new Date().toLocaleTimeString('ja-JP')}。公開内容は変更されません。`);}
    }, 250);
  };
  const confirmPublish = () => {
    const result = validateContent(kind, content, true);
    setErrors(result.errors);
    if (Object.keys(result.errors).length) {setStatus('公開に必要な項目を確認してください。'); return;}
    dialog.current.showModal();
  };
  if (id !== 'new' && !source) return <div className="admin-panel"><h1>記事が見つかりません</h1><Link to={`${base}/${kind}`}>一覧へ戻る</Link></div>;
  return <>
    <div className="admin-page-heading"><div><Link className="admin-back" to={`${base}/${kind}`}>← {label}一覧</Link><h1>{id === 'new' ? `${label}を新規作成` : `${label}を編集`}</h1><PublicationBadge state={state} /></div></div>
    <div className="admin-editor-actions" aria-label="記事の操作">
      <p role="status">{publishProgress === 'publishing' ? '公開中…' : saveState === 'saving' ? SAVE_STATES.saving : saveState === 'error' ? SAVE_STATES.error : dirty ? SAVE_STATES.dirty : SAVE_STATES.saved}<span>（動作例）</span></p>
      <button type="button" className="admin-button secondary" onClick={save} disabled={busy}>{saveState === 'error' ? '保存を再試行' : '下書き保存'}</button>
      <button ref={publishButton} type="button" className="admin-button primary" disabled={busy || dirty || saveState === 'error'} onClick={confirmPublish}>{publishProgress === 'publishing' ? '公開中…' : published ? '公開内容を更新' : '公開する'}</button>
    </div>
    <p className="admin-editor-hint">まず下書きを保存し、内容を確認して公開します。下書き保存だけでは公開されません。</p>
    {status && <p className={`admin-feedback ${saveState === 'error' ? 'error' : ''}`} role={saveState === 'error' || publishProgress === 'error' || Object.keys(errors).length ? 'alert' : 'status'}>{status}</p>}
    <div className="admin-editor-grid">
      <form className="admin-panel" onSubmit={event => {event.preventDefault(); save();}} aria-busy={busy}>
        <h2>基本情報</h2>
        {field('title', kind === 'news' ? 'タイトル' : '作品名', {required: true})}
        {kind === 'news' ? field('articleDate', '記事の日付', {type: 'date', required: true, help: '日本時間のカレンダー日付です。公開時刻とは別に扱います。'}) : field('summary', '短い説明', {multiline: true, required: true})}
        {field('body', '本文（Markdown）', {multiline: true, required: kind === 'news', help: '見出しは ##、リンクは [表示名](URL) で記述できます。画像と詳しい制作紹介は任意です。'})}
        <h2>関連情報</h2>
        {field('link', kind === 'news' ? '関連記事URL' : '作品URL', {type: 'url'})}
        {kind === 'projects' && <>
          {field('titleImage', 'タイトル画像URL', {help: '画像の登録画面は後続の実装で接続します。'})}
          {field('titleImageAlt', 'タイトル画像の代替テキスト')}
          {field('contentImage', '本文画像URL')}
          {field('contentImageAlt', '本文画像の代替テキスト')}
          <div className="admin-field"><label htmlFor="field-tags">使用技術</label><input id="field-tags" value={content.tags.join(', ')} onChange={event => update('tags', event.target.value.split(',').map(value => value.trim()))} aria-describedby="help-tags" /><p id="help-tags" className="admin-field-help">カンマ区切りで入力します。</p>{errors.tags && <p className="admin-field-error">{errors.tags}</p>}</div>
          {field('demoLink', 'デモ動画URL', {type: 'url'})}{field('githubLink', 'ソースコードURL', {type: 'url'})}{field('detailsLink', '外部の制作記事URL', {type: 'url'})}{field('production', '制作情報', {multiline: true})}
        </>}
      </form>
      <aside className="admin-editor-aside">
        <div className="admin-panel"><h2>公開について</h2><PublicationBadge state={state} /><p>公開中の内容と下書きを分けて保持します。公開内容を更新するまで、閲覧者には現在の公開内容が表示されます。</p>{published && <button type="button" className="admin-button danger" onClick={() => {if (window.confirm('公開サイトから表示を取り下げます。下書きは残ります。非公開にしますか？')) {setPublished(null); setStatus('非公開化しました（動作例）。下書きは残っています。');}}}>非公開にする</button>}</div>
        <div className="admin-panel"><h2>動作例の確認</h2><label htmlFor="save-example">保存結果<select id="save-example" value={failure} onChange={event => setFailure(event.target.value)}><option value="none">成功</option><option value="network">保存失敗</option><option value="auth">認証失効</option><option value="conflict">更新競合</option></select></label><p>失敗時にも入力は保持します。下書き保存後の画面再読み込みでは、サンプルの初期状態に戻ります。</p></div>
      </aside>
    </div>
    <dialog ref={dialog} className="admin-publish-dialog" onClose={() => publishButton.current?.focus()} aria-labelledby="publish-dialog-title">
      <h2 id="publish-dialog-title">{published ? '公開内容を更新しますか？' : 'この内容を公開しますか？'}</h2><p>以下の保存済み下書きが閲覧者に表示されます。</p><div className="admin-preview"><h3>{content.title}</h3><p>{content.summary || content.articleDate}</p><p>{content.body}</p></div><p>この画面では公開動作の例を表示します。</p><div className="admin-dialog-actions"><button autoFocus type="button" className="admin-button secondary" onClick={() => dialog.current.close()}>編集に戻る</button><button type="button" className="admin-button primary" disabled={busy} onClick={() => {
        setBusy(true); setPublishProgress('publishing'); dialog.current.close();
        timeout.current = setTimeout(() => {
          setBusy(false);
          if (failure !== 'none') {setPublishProgress('error'); setStatus('公開できませんでした。下書きと現在の公開内容を保持しています。保存結果を成功に戻し、公開を再試行してください。');}
          else {setPublishProgress('idle'); setPublished(structuredClone(saved)); setStatus('公開しました（動作例）。実際の公開サイトは変更されていません。');}
        }, 250);
      }}>内容を確認して公開</button></div>
    </dialog>
  </>;
}

// Changing the record ID resets the form only after the route blocker approves.
export default function DesignEditorRoute({kind}) {
  const {id} = useParams();
  return <DesignEditor key={`${kind}/${id}`} kind={kind} />;
}
