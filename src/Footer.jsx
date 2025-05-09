import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>My Portfolio</h3>
          <p>ポートフォリオサイトへようこそ。私の作品やスキルをご覧ください。</p>
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
          <ul>
            <li>Email: example@email.com</li>
            <li>GitHub: github.com/username</li>
            <li>LinkedIn: linkedin.com/in/username</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 