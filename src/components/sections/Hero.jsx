import React from 'react';
import { projects } from '../../data/projects';

const featuredProject = projects.find(project => project.id === 'nesugoshi-panic');

const Hero = () => {
    return (
        <section id="hero" className="hero-section">
            <div className="hero-layout">
                <div className="hero-content">
                    <p className="hero-eyebrow">Alice / Sano Yuto</p>
                    <h1>佐野 優人</h1>
                    <p className="hero-catch">UI/UXを中心に、<br />アプリとゲームをつくる。</p>
                    <p className="hero-description">人と人のつながりを生む体験を目指して、個人・チームで開発に取り組んでいます。</p>
                    <p className="hero-subtitle">福岡工業大学 情報工学部 情報工学科 3年 <br /> 情報技術研究部 所属</p>
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
                {featuredProject && (
                    <a className="hero-featured" href={`#project-${featuredProject.id}`}>
                        <img src={featuredProject.titleImage} alt={`${featuredProject.title}の画面`} fetchPriority="high" />
                        <div className="hero-featured-caption">
                            <span className="hero-featured-label">代表作 / 部内ハッカソン 最優秀賞</span>
                            <h2>{featuredProject.title}</h2>
                            <p>{featuredProject.summary}</p>
                            <span className="hero-featured-action">この作品の詳細を見る <span aria-hidden="true">→</span></span>
                        </div>
                    </a>
                )}
            </div>
            <div className="scroll-indicator">
                <span>下へスクロール</span>
                <i aria-hidden="true" className="fas fa-chevron-down"></i>
            </div>
        </section>
    );
};

export default Hero;
