import { useRef, useState } from 'react';
import logo from '../../assets/AliceMark.png';
import './Header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButton = useRef(null);

    const closeOnEscape = event => {
        if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false);
            menuButton.current?.focus();
        }
    };

    return (
        <header className="header" onKeyDown={closeOnEscape}>
            <div className="header-inner-container">
                <div className="logo-container">
                    <img src={logo} alt="" className="logo" />
                    <p className="title">Alice's Portfolio</p>
                </div>
                <button ref={menuButton} type="button" className="header-menu-toggle"
                    aria-expanded={menuOpen} aria-controls="header-navigation"
                    onClick={() => setMenuOpen(open => !open)}>
                    {menuOpen ? '閉じる' : 'メニュー'}
                    <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
                </button>
                <nav id="header-navigation" className={`header-nav${menuOpen ? ' is-open' : ''}`} aria-label="メインナビゲーション"
                    onClick={event => {
                        if (event.target.closest('a')) {
                            setMenuOpen(false);
                            if (window.matchMedia('(max-width: 768px)').matches) menuButton.current?.focus();
                        }
                    }}>
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
