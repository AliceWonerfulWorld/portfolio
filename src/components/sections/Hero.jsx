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
                    <a href="#projects" className="primary-btn ui-button ui-primary ui-on-dark">作品を見る</a>
                    <a href="#contact" className="secondary-btn ui-button ui-secondary ui-on-dark">お問い合わせ</a>
                </div>
                <div className="social-links">
                    <a aria-label="GitHub（新しいタブで開きます）" href="https://github.com/AliceWonerfulWorld" target="_blank" rel="noopener noreferrer">
                        <i aria-hidden="true" className="fab fa-github"></i>
                    </a>
                    <a aria-label="X（新しいタブで開きます）" href="https://x.com/Yuto03944691" target="_blank" rel="noopener noreferrer">
                        <i aria-hidden="true" className="fab fa-twitter"></i>
                    </a>
                </div>

            </div>
            <div className="scroll-indicator">
                <span>下へスクロール</span>
                <i aria-hidden="true" className="fas fa-chevron-down"></i>
            </div>
        </section>
    );
};

export default Hero;
