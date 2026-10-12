import { useOutletContext, Link, useSearchParams } from 'react-router-dom';
import { PUBLICATION_STATES } from '../../../../shared/content.js';
import { designRecords } from './fixtures.js';

export function PublicationBadge({state}) {
  return <span className={`admin-badge ${state}`}>{PUBLICATION_STATES[state]}</span>;
}
export function PendingConnection() {
  return <div className="admin-panel admin-empty"><h1>管理画面の接続準備中</h1><p>下書き保存・公開の基盤を準備しています。現在の公開コンテンツは引き続き公開サイトでご覧いただけます。</p><a className="admin-button secondary" href="/">公開サイトを見る</a></div>;
}
export function StateExample({children}) {
  const [search, setSearch] = useSearchParams();
  const state = search.get('state') || 'ready';
  return <><label className="admin-state-picker">表示状態の確認<select value={state} onChange={event => setSearch({state: event.target.value})}><option value="ready">通常</option><option value="empty">空</option><option value="loading">読み込み中</option><option value="error">取得失敗</option></select></label>
    {state === 'loading' ? <div className="admin-panel" role="status" aria-busy="true">コンテンツを読み込んでいます…</div> : state === 'error' ? <div className="admin-panel" role="alert"><h2>取得できませんでした</h2><p>保存先への接続を確認して再試行してください。記事の件数は確認できていません。</p><button className="admin-button secondary" onClick={() => setSearch({state: 'ready'})}>再試行</button></div> : children(state === 'empty' ? [] : designRecords)}
  </>;
}
export function DesignDashboard() {
  const {base} = useOutletContext();
  return <><div className="admin-page-heading"><div><p className="admin-eyebrow">OVERVIEW</p><h1>ダッシュボード</h1><p>活動を記録して、作品を届けましょう。</p></div></div><StateExample>{records => <>
    <div className="admin-stat-grid">{[['news', 'ニュース'], ['projects', '作品']].map(([kind, label]) => {
      const items = records.filter(record => record.kind === kind);
      return <div className="admin-panel admin-stat" key={kind}><h2>{label}</h2><strong>{items.length}<small>件</small></strong><p>公開済み {items.filter(item => item.publicationState !== 'draft').length} / 下書き {items.filter(item => item.publicationState === 'draft').length}</p><Link to={`${base}/${kind}/new`} className="admin-button primary">{label}を新規作成</Link></div>;
    })}</div>
    <div className="admin-panel"><h2>最近の編集</h2>{records.length ? <ul className="admin-recent-list">{records.map(record => <li key={`${record.kind}-${record.id}`}><Link to={`${base}/${record.kind}/${record.id}`}><span>{record.draft.title || 'タイトル未設定'}</span><time dateTime={record.updatedAt}>{new Date(record.updatedAt).toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'})}</time></Link><PublicationBadge state={record.publicationState} /></li>)}</ul> : <p>記事はまだありません。上のボタンから最初の記事を作成できます。</p>}</div>
  </>}</StateExample></>;
}
export function DesignList({kind}) {
  const {base} = useOutletContext();
  const label = kind === 'news' ? 'ニュース' : '作品';
  return <><div className="admin-page-heading"><div><p className="admin-eyebrow">CONTENT</p><h1>{label}一覧</h1><p>下書きと公開中の内容を管理します。</p></div><Link to={`${base}/${kind}/new`} className="admin-button primary">＋ {label}を新規作成</Link></div>
    <StateExample>{records => {const items = records.filter(record => record.kind === kind);return items.length ? <ul className="admin-content-list">{items.map(record => <li className="admin-panel" key={record.id}><div className="admin-list-meta"><span>{kind === 'news' ? record.draft.articleDate : 'プロジェクト'}</span><PublicationBadge state={record.publicationState} /></div><h2><Link to={`${base}/${kind}/${record.id}`}>{record.draft.title}</Link></h2><p>{kind === 'news' ? record.draft.body.split('\n')[0] : record.draft.summary}</p><div className="admin-list-footer"><span>最終更新 {new Date(record.updatedAt).toLocaleDateString('ja-JP', {timeZone: 'Asia/Tokyo'})}</span><Link to={`${base}/${kind}/${record.id}`} className="admin-button secondary">編集する</Link></div></li>)}</ul> : <div className="admin-panel admin-empty"><h2>{label}はまだありません</h2><p>未完成の内容も下書きとして保存できます。</p><Link to={`${base}/${kind}/new`} className="admin-button primary">最初の{label}を作成</Link></div>;}}</StateExample>
  </>;
}
