import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Components
import ProtectedRoute from './components/admin/ProtectedRoute';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin', element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> },
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
