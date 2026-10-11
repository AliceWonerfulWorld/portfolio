import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProjectEditor from '../components/admin/ProjectEditor';
import NewsEditor from '../components/admin/NewsEditor';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout, isLoggedIn } = useAuth();
    const [activeTab, setActiveTab] = useState('projects'); 
    // 'projects' or 'news'
 
    const [projectRisk, setProjectRisk] = useState(false);
    const [newsRisk, setNewsRisk] = useState(false);
    const hasRisk = projectRisk || newsRisk;
    const reportProjectRisk = useCallback(value => setProjectRisk(value), []);
    const reportNewsRisk = useCallback(value => setNewsRisk(value), []);
    const leaveMessage = '入力途中、またはJSON未出力の変更があります。ページを離れると失われます。離れますか？';
    const approvedLogout = useRef(false);
    const blocker = useBlocker(() => hasRisk && isLoggedIn && !approvedLogout.current);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            if (window.confirm(leaveMessage)) blocker.proceed();
            else blocker.reset();
        }
    }, [blocker]);

    useEffect(() => {
        if (!hasRisk) return;
        const handleBeforeUnload = event => {
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasRisk]);

    const handleLogout = () => {
        if (hasRisk && !window.confirm(leaveMessage)) return;
        approvedLogout.current = true;
        navigate('/', { flushSync: true });
        logout();
    };

    return (
       <div className="admin-dashboard">
         {/* ヘッダー */}
         <header className="admin-header">
            <h1>管理画面</h1>
            <div className="admin-actions">
              <button onClick={() => navigate('/')} className="home-btn ui-button ui-secondary">
                サイトを見る
              </button>
              <button onClick={handleLogout} className="logout-btn ui-button ui-secondary">
                ログアウト
              </button>
            </div>
         </header>

         <aside className="admin-editing-notice" aria-label="編集と公開について">
           <strong>この管理画面は一時編集用です。</strong>
           <p>「一覧に一時反映」はこの画面内だけの変更です。再読み込みやページ離脱で消え、公開ページには反映されません。変更を残すにはJSONをエクスポートし、ダウンロードしたファイルを確認してください。画像の保存・アップロードも行いません。</p>
           <p>タブを切り替えても入力と一覧は保持されます。JSONには一時反映済みの一覧だけが含まれます。編集中は一覧の削除を操作できません。</p>
         </aside>

         {/* タブナビゲーション */}
         <nav className="admin-tabs">
           <button className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
           aria-pressed={activeTab === 'projects'} onClick={() => setActiveTab('projects')}>
            プロジェクト編集
           </button>

           <button className={`tab ${activeTab === 'news' ? 'active' : ''}`}
            aria-pressed={activeTab === 'news'} onClick={() => setActiveTab('news')}>
                ニュース編集
            </button>
         </nav>

         {/* コンテンツエリア */}
         <main className="admin-content">
            <div hidden={activeTab !== 'projects'}><ProjectEditor onRiskChange={reportProjectRisk} /></div>
            <div hidden={activeTab !== 'news'}><NewsEditor onRiskChange={reportNewsRisk} /></div>
         </main>
       </div>
    );
};

export default AdminDashboard;