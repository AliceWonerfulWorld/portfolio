// 環境変数からパスワードを取得
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

// パスワードが正しいかチェック
export const verifyPassword = (password) => {
    return password === ADMIN_PASSWORD;
};

// ログイン(localStorageにトークンを保存)
export const login = (password) => {
    if (verifyPassword(password)) {
        // 簡易的なトークンを作成する
        const token = btoa(password + Date.now());
        // Base64エンコード
        localStorage.setItem('adminToken', token);
        return true;
    }
    return false;
};

// ログアウト(localStorageからトークンを削除する)
export const logout = () => {
    localStorage.removeItem('adminToken');
};

// ログイン状態をチェック
export const isAuthenticated = () => {
    return localStorage.getItem('adminToken') !== null;
};