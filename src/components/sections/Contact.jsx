import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="contact-section">
            <h2>Contact</h2>
            <div className="contact-content">
                <div className="contact-info">
                    <h3>お問い合わせ</h3>
                    <p>ご質問やお仕事のご依頼など、お気軽にお問い合わせください。</p>
                    <div className="contact-details">
                        <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <p>chebukinowashiwashi@gmail.com</p>
                        </div>
                        <div className="contact-item">
                            <i className="fab fa-github"></i>
                            <p>https://github.com/AliceWonerfulWorld</p>
                        </div>
                    </div>
                </div>
                <form className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">お名前</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">メールアドレス</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">メッセージ</label>
                        <textarea id="message" name="message" required></textarea>
                    </div>
                    <button type="submit" className="submit-btn">送信</button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
