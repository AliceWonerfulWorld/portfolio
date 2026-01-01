import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import News from '../components/sections/News';
import Contact from '../components/sections/Contact';

const HomePage = () => {
    return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <News />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;