import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // ログイン試行
        const success = login(password);

        if (success) {
            // 成功したら管理画面へ
            navigate('/admin');
        } else {
            // 失敗したらエラーメッセージを表示
            setError('パスワードが正しくありません');
            setPassword(''); // 入力をクリア
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>管理画面ログイン</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">
                            パスワード
                        </label>
                        
                        <input 
                         type="password"
                         id="password"
                         value={password}
                         onChange={(e) =>
                            setPassword(e.target.value)}
                         placeholder="パスワードを入力"
                         autoFocus
                        />
                    </div>

                    {error && <p className="error-message">
                        {error}</p>}
                    
                    <button type="submit" className="login-button">
                        ログイン
                    </button>
                </form>

                <a href="/" className="back-link">
                   ← サイトに戻る 
               </a>
            </div>
        </div>
    );
};

export default AdminLogin;