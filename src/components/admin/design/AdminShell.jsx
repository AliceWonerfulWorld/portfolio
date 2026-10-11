import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import './AdminDesign.css';

export default function AdminShell({design = false}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputPriority, setInputPriority] = useState(false);
  const toggle = useRef(null);
  const location = useLocation();
  const base = design ? '/admin/design' : '/admin';
  useEffect(() => {
    const viewport = window.visualViewport;
    const update = () => document.documentElement.classList.toggle('admin-keyboard-open', !!viewport && window.innerHeight - viewport.height > 120);
    viewport?.addEventListener('resize', update);
    return () => { viewport?.removeEventListener('resize', update); document.documentElement.classList.remove('admin-keyboard-open'); };
  }, []);
  const section = location.pathname.includes('/news') ? 'ニュース' : location.pathname.includes('/projects') ? '作品' : 'ダッシュボード';
  return (
    <div className={`admin-design${inputPriority ? ' input-priority' : ''}`}
      onFocusCapture={event => {
        if (event.target.matches('input,textarea,select')) setInputPriority(true);
        else if (!event.target.closest('.admin-editor-actions')) setInputPriority(false);
      }}
      onPointerDownCapture={event => {
        if (!event.target.closest('input,textarea,select,.admin-editor-actions')) setInputPriority(false);
      }} onKeyDown={event => {if (event.key === 'Escape' && menuOpen) {setMenuOpen(false); toggle.current?.focus();}}}>
      <a className="admin-skip" href="#admin-main">メインコンテンツへ</a>
      <header className="admin-mobile-header">
        <Link to={base}>Alice / 管理画面</Link>
        <button ref={toggle} type="button" aria-controls="admin-sidebar" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>{menuOpen ? '閉じる ×' : 'メニュー ☰'}</button>
      </header>
      <aside id="admin-sidebar" className={`admin-sidebar${menuOpen ? ' is-open' : ''}`}>
        <Link className="admin-brand" to={base}>Alice<span>Portfolio Manager</span></Link>
        <p className="admin-nav-label">コンテンツ</p>
        <nav aria-label="管理画面">
          {[[base, 'ダッシュボード', true], [`${base}/news`, 'ニュース', false], [`${base}/projects`, '作品', false]].map(([to, label, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => {setMenuOpen(false); if (window.matchMedia('(max-width: 768px)').matches) toggle.current?.focus();}}>{label}</NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-bottom"><a href="/">公開サイトを見る ↗</a>{!design && <a href="/cdn-cgi/access/logout">ログアウト</a>}</div>
      </aside>
      <main id="admin-main" className="admin-workspace" tabIndex={-1}>
        <div className="admin-breadcrumb">管理画面 <span aria-hidden="true">/</span> {section}</div>
        {design && <div className="admin-design-notice"><strong>デザイン確認用</strong> サンプルデータを使っています。保存・公開の操作は動作例で、サーバーや公開サイトには反映されません。</div>}
        <Outlet context={{base, design}} />
      </main>
    </div>
  );
}
