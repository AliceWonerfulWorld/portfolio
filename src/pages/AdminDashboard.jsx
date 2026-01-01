import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProjectEditor from '../components/admin/ProjectEditor';
import NewsEditor from '../components/admin/NewsEditor';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('projects'); 
    // 'projects' or 'news'
 
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
       <div className="admin-dashboard">
         {/* ヘッダー */}
         <header className="admin-header">
            <h1>管理画面</h1>
            <div className="admin-actions">
              <button onClick={() => navigate('/')} className="home-btn">
                サイトを見る
              </button>
              <button onClick={handleLogout} className="logout-btn">
                ログアウト
              </button>
            </div>
         </header>

         {/* タブナビゲーション */}
         <nav className="admin-tabs">
           <button className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
           onClick={() => setActiveTab('projects')}>
            プロジェクト編集
           </button>

           <button className={`tab ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}>
                ニュース編集
            </button>
         </nav>
         
       </div>
    );
};

export default AdminDashboard;