import React from 'react';

const Hero = () => {
    return (
        <section id="hero" className="hero-section">
            <div className="hero-content">
                <h1>Alice’s Portfolio</h1>
                <p className="hero-roman">佐野 優人</p>
                <p className="hero-subtitle">福岡工業大学 情報工学部 情報工学科 3年 <br /> 情報技術研究部 所属</p>
                <p className="hero-catch">好奇心と技術で未来を創る</p>
                <div className="hero-buttons">
                    <a href="#projects" className="primary-btn">作品一覧</a>
                    <a href="#contact" className="secondary-btn">お問い合わせ</a>
                </div>
                <div className="social-links">
                    <a href="https://github.com/AliceWonerfulWorld" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://x.com/Yuto03944691" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter"></i>
                    </a>
                </div>

            </div>
            <div className="scroll-indicator">
                <span>下へスクロール</span>
                <i className="fas fa-chevron-down"></i>
            </div>
        </section>
    );
};

export default Hero;
