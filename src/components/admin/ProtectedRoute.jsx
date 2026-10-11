import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isCheckingAuth } = useAuth();

    if (isCheckingAuth) {
        return <p role="status">ログイン状態を確認しています…</p>;
    }

    // ログインしていなければログイン画面にリダイレクト
    if (!isLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    // ログインしていれば子コンポーネントを表示
    return children;
};

export default ProtectedRoute;
