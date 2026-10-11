import { useState } from 'react';
import './Contact.css';

const emailAddress = 'chebukinowashiwashi@gmail.com';

const Contact = () => {
    const [copyStatus, setCopyStatus] = useState('');
    const [isCopying, setIsCopying] = useState(false);

    const copyEmail = async () => {
        setCopyStatus('');
        setIsCopying(true);
        try {
            await navigator.clipboard.writeText(emailAddress);
            setCopyStatus('メールアドレスをコピーしました。');
        } catch {
            setCopyStatus('コピーできませんでした。メールアドレス欄を選択して、手動でコピーしてください。');
        } finally {
            setIsCopying(false);
        }
    };

    return (
        <section id="contact" className="contact-section">
            <h2>Contact</h2>
            <div className="contact-content contact-links-content">
                <div className="contact-info">
                    <h3>お問い合わせ</h3>
                    <p>ご質問やお仕事のご依頼は、メールでお気軽にご連絡ください。</p>
                </div>
                <div className="contact-methods">
                    <div className="contact-method">
                        <h3><i aria-hidden="true" className="fas fa-envelope" />メール</h3>
                        <label htmlFor="contact-email-address">メールアドレス</label>
                        <textarea id="contact-email-address" rows={2} value={emailAddress} readOnly
                            onFocus={event => event.target.select()} aria-describedby="contact-email-help" />
                        <p id="contact-email-help">アドレス欄を選択して手動でコピーすることもできます。</p>
                        <div className="contact-actions">
                            <a href={`mailto:${emailAddress}`} className="ui-button ui-primary ui-on-dark">メールアプリを開く</a>
                            <button type="button" onClick={copyEmail} disabled={isCopying} className="ui-button ui-secondary ui-on-dark">
                                {isCopying ? 'コピー中…' : 'メールアドレスをコピー'}
                            </button>
                        </div>
                        <p className="contact-copy-status" role="status" aria-live="polite" aria-atomic="true">{copyStatus}</p>
                        <p>メールアプリが開かない場合は、アドレスをコピーしてお使いのメールサービスから送信してください。</p>
                    </div>
                    <div className="contact-method">
                        <h3><i aria-hidden="true" className="fab fa-github" />GitHub</h3>
                        <p>制作した作品やソースコードはこちらからご覧いただけます。</p>
                        <a href="https://github.com/AliceWonerfulWorld" target="_blank" rel="noopener noreferrer"
                            className="ui-button ui-secondary ui-on-dark">GitHubプロフィールを見る<span aria-hidden="true">↗</span>
                            <span className="contact-new-tab">（新しいタブで開きます）</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
