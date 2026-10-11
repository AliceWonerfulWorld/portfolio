import React from 'react'
import logo from '../../assets/AliceMark.png';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-inner-container">
                <div className="logo-container">
                    <img src={logo} alt="" className="logo" />
                    <p className="title">Alice's Portfolio</p>
                </div>
                <nav className="header-nav" aria-label="メインナビゲーション">
                    <ul className="header-nav-list">
                        <li><a href="#about" className="nav-link">自己紹介</a></li>
                        <li><a href="#projects" className="nav-link">作品</a></li>
                        <li><a href="#contact" className="nav-link">お問い合わせ</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
