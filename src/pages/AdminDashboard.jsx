import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{ padding: '40px', minHeight: '100vh'}}>
            <h1>管理画面</h1>
            <p>ログインに成功しました！</p>
            <button onClick={handleLogout}>ログアウト</button>
            <hr />
            <p>ここに後でプロジェクト・ニュース編集機能を追加します</p>
        </div>
    );
};

export default AdminDashboard;