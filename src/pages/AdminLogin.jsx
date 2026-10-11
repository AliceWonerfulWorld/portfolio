import { Link } from 'react-router-dom';
import './AdminLogin.css';

export default function AdminLogin() {
  return <div className="login-container"><div className="login-card"><h1>管理画面ログイン</h1><p>Cloudflare Accessで管理者のメールアドレスを確認してログインします。</p><a href="/admin" className="ui-button ui-primary">管理者としてログイン</a><p>認証や保存先の設定が完了していない環境では、管理画面は利用できません。</p><Link to="/" className="back-link">← 公開サイトに戻る</Link></div></div>;
}
