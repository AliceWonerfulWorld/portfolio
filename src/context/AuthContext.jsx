import React, { createContext, useContext, useState, useEffect} from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated } from '../utils/auth';

// Contextを作成
const AuthContext = createContext();

// カスタムフック (他のコンポーネントから使いやすくする)
export const useAuth = () => { 
   const context = useContext(AuthContext);
   if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
   }
   return context;
};

// Providerコンポーネント (アプリ全体を包む)
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // 初回レンダリング時にログイン状態をチェックする
    useEffect(() => {
        try {
            setIsLoggedIn(isAuthenticated());
        } finally {
            setIsCheckingAuth(false);
        }
    }, []);

    const login = (password) => {
        const success = authLogin(password);
        if (success) {
            setIsLoggedIn(true);
        }
        return success;
    };

    const logout = () => {
        authLogout();
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isCheckingAuth, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};