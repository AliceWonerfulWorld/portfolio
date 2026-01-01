import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Components
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* ホームページ */}
            <Route path="/" element={<HomePage/>}/>

            {/* ログインページ */}
            <Route path="/admin/login" element={<AdminLogin/>} />

            {/* 管理画面(ProtectedRouteで保護) */}
            <Route 
             path="/admin" 
             element= {
              <ProtectedRoute>
               <AdminDashboard/>
             </ProtectedRoute>
            }
           />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
