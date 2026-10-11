import { getSession } from './contentApi.js';

// Identity is checked by the server; browser-local tokens are never trusted.
export const isAuthenticated = async () => {
  try { await getSession(); return true; }
  catch { return false; }
};
export const login = () => { window.location.assign('/admin'); };
export const logout = () => { window.location.assign('/cdn-cgi/access/logout'); };
