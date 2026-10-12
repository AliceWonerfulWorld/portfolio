import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { getSession } from '../utils/contentApi.js';
import { login, logout } from '../utils/auth.js';

const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const generation = useRef(0);
  const checkAuth = useCallback(async () => {
    const current = ++generation.current;
    setIsCheckingAuth(true);
    try {
      const session = await getSession();
      if (current === generation.current) {setUser(session.user); setAuthError(null);}
    } catch (error) {
      if (current === generation.current) {setUser(null); setAuthError(error);}
    } finally {if (current === generation.current) setIsCheckingAuth(false);}
  }, []);
  return <AuthContext.Provider value={{isLoggedIn: !!user, user, isCheckingAuth, authError, checkAuth, login, logout}}>{children}</AuthContext.Provider>;
};
