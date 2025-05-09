import React from 'react'
import logo from './assets/react.svg';
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
    <header style={styles.header}>
      <div style={styles.innerContainer}>
        <div style={styles.logoContainer}>
            <img src={logo} alt="Logo" style={styles.logo}/>
            <h1 style={styles.title}>My Portfolio</h1>
        </div>
        <nav style={styles.nav}>
            <ul style={styles.navList}>
                <li><a onClick={() => scrollToSection('about')} className="nav-link">About</a></li>
                <li><a onClick={() => scrollToSection('projects')} className="nav-link">Projects</a></li>
                <li><a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a></li>
            </ul>
        </nav>
      </div>
    </header>
  );
};

const styles = {
    header: {
        backgroundColor: '#282c34',
        color: 'white',
        padding: '0.8rem 2rem',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    innerContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      height: '40px',
      marginRight: '1rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    nav: {
        marginLeft: 'auto'
    },
    navList: {
      listStyle: 'none',
      display: 'flex',
      gap: '1.5rem',
      margin: 0,
      padding: 0,
    }
};

export default Header;