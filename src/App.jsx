import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminShell from './components/admin/design/AdminShell';
import { DesignDashboard, DesignList, PendingConnection } from './components/admin/design/AdminViews';
import DesignEditor from './components/admin/design/DesignEditor';

// Components
import ProtectedRoute from './components/admin/ProtectedRoute';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin', element: <ProtectedRoute><AdminShell /></ProtectedRoute>, children: [
    { index: true, element: <PendingConnection /> },
    { path: 'news/*', element: <PendingConnection /> },
    { path: 'projects/*', element: <PendingConnection /> },
  ] },
  ...(import.meta.env.DEV ? [{ path: '/admin/design', element: <AdminShell design />, children: [
    { index: true, element: <DesignDashboard /> },
    { path: 'news', element: <DesignList kind="news" /> },
    { path: 'projects', element: <DesignList kind="projects" /> },
    { path: 'news/:id', element: <DesignEditor key="news" kind="news" /> },
    { path: 'projects/:id', element: <DesignEditor key="projects" kind="projects" /> },
  ] }] : []),
  { path: '*', element: <main className="login-container"><div className="login-card"><h1>ページが見つかりません</h1><Link to="/">公開サイトに戻る</Link></div></main> },
]);

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
