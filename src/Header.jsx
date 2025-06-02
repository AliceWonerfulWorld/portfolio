import React from 'react'
import logo from './assets/logo.svg';
import './Header.css';

const Header = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector('header').offsetHeight;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="header">
      <div className="header-inner-container">
        <div className="logo-container">
            <img src={logo} alt="Logo" className="logo"/>
            <h1 className="title">Alice's Portfolio</h1>
        </div>
        <nav className="header-nav">
            <ul className="header-nav-list">
                <li><a onClick={() => scrollToSection('about')} className="nav-link">About</a></li>
                <li><a onClick={() => scrollToSection('projects')} className="nav-link">Projects</a></li>
                <li><a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a></li>
            </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;