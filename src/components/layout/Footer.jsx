import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Alice's Portfolio</h3>
                    <p>ポートフォリオサイトへようこそ。<br /> ゆっくりしていってね。</p>
                </div>

                <div className="footer-section">
                    <h3>リンク</h3>
                    <ul>
                        <li><a href="#about">About</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>コンタクト</h3>
                    <ul className="footer-contact-list">
                        <li>
                            <i className="fas fa-envelope"></i>
                            <a href="mailto:chebukinowashiwashi@gmail.com">chebukinowashiwashi@gmail.com</a>
                        </li>
                        <li>
                            <i className="fab fa-github"></i>
                            <a href="https://github.com/AliceWonerfulWorld" target="_blank" rel="noopener noreferrer">github.com/AliceWonerfulWorld</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Alice’s Portfolio. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer; 
