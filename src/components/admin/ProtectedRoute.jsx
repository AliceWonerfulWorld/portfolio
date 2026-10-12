import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({children}) {
  const {isLoggedIn, isCheckingAuth, authError, checkAuth} = useAuth();
  useEffect(() => {checkAuth();}, [checkAuth]);
  if (isCheckingAuth) return <p role="status">ログイン状態を確認しています…</p>;
  if (authError && authError.status !== 401) return <div className="login-container"><div className="login-card"><h1>管理画面を利用できません</h1><p role="alert">{authError.message}</p><button className="ui-button ui-secondary" onClick={checkAuth}>再試行</button><a className="back-link" href="/">公開サイトに戻る</a></div></div>;
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;
  return children;
}
