import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './App.css';

function App() {
  const [currentProject, setCurrentProject] = useState(0);

  const projects = [
    {
      title: "プロジェクト1",
      description: "プロジェクトの説明をここに書きます。",
      image: "/path-to-project1.jpg",
      tags: ["React", "Node.js"],
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "プロジェクト2",
      description: "プロジェクトの説明をここに書きます。",
      image: "/path-to-project2.jpg",
      tags: ["React", "Firebase"],
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "プロジェクト3",
      description: "プロジェクトの説明をここに書きます。",
      image: "/path-to-project3.jpg",
      tags: ["React", "MongoDB"],
      demoLink: "#",
      githubLink: "#"
    }
  ];

  const nextProject = () => {
    const currentCard = document.querySelector('.project-card.active');
    currentCard.classList.add('slide-left');
    currentCard.classList.remove('active');
    
    setCurrentProject((prev) => {
      const next = (prev + 1) % projects.length;
      const nextCard = document.querySelector(`.project-card:nth-child(${next + 1})`);
      nextCard.classList.add('slide-center');
      nextCard.classList.add('active');
      return next;
    });
  };

  const prevProject = () => {
    const currentCard = document.querySelector('.project-card.active');
    currentCard.classList.add('slide-right');
    currentCard.classList.remove('active');
    
    setCurrentProject((prev) => {
      const next = (prev - 1 + projects.length) % projects.length;
      const nextCard = document.querySelector(`.project-card:nth-child(${next + 1})`);
      nextCard.classList.add('slide-center');
      nextCard.classList.add('active');
      return next;
    });
  };

  return (
    <div className="App">
      <Header />
      <main>
        <section id="hero" className="hero-section">
          <div className="hero-content">
            <h1>Welcome to My Portfolio</h1>
            <p className="hero-subtitle">Web Developer & Designer</p>
            <div className="hero-buttons">
              <a href="#projects" className="primary-btn">作品を見る</a>
              <a href="#contact" className="secondary-btn">お問い合わせ</a>
            </div>
            <div className="social-links">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          <div className="scroll-indicator">
            <span>Scroll Down</span>
            <i className="fas fa-chevron-down"></i>
          </div>
        </section>

        <section id="about" className="about-section">
          <h2>About Me</h2>
          <div className="about-content">
            <div className="about-image">
              <img src="/path-to-your-image.jpg" alt="Profile" />
            </div>
            <div className="about-text">
              <h3>自己紹介</h3>
              <p>ここにあなたの自己紹介を書きます。経歴、興味、目標などを含めると良いでしょう。</p>
              <div className="skills">
                <h3>スキル</h3>
                <div className="skill-tags">
                  <span>HTML</span>
                  <span>CSS</span>
                  <span>JavaScript</span>
                  <span>React</span>
                  <span>Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="experience-section">
          <h2>Experience</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>会社名</h3>
                <p className="timeline-date">2020 - 現在</p>
                <p>職種: フロントエンド開発者</p>
                <ul>
                  <li>Reactを使用したWebアプリケーションの開発</li>
                  <li>レスポンシブデザインの実装</li>
                  <li>チーム開発でのGit運用</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>会社名</h3>
                <p className="timeline-date">2018 - 2020</p>
                <p>職種: Webデザイナー</p>
                <ul>
                  <li>Webサイトのデザインと実装</li>
                  <li>UI/UXデザイン</li>
                  <li>クライアントとの要件定義</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="projects-section">
          <h2>Projects</h2>
          <div className="projects-carousel">
            <button className="carousel-button prev" onClick={prevProject}>
              <span className="button-text">前へ</span>
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className="projects-container">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className={`project-card ${index === currentProject ? 'active' : ''}`}
                  style={{
                    transform: `translateX(${(index - currentProject) * 100}%)`,
                  }}
                >
                  <div className="project-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {project.tags.map((tag, i) => (
                        <span key={i}>{tag}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer">デモ</a>
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="carousel-button next" onClick={nextProject}>
              <span className="button-text">次へ</span>
              <i className="fas fa-chevron-right"></i>
            </button>

            <div className="carousel-indicators">
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentProject ? 'active' : ''}`}
                  onClick={() => setCurrentProject(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="skills-section">
          <h2>Skills</h2>
          <div className="skills-container">
            <div className="skill-category">
              <h3>フロントエンド</h3>
              <div className="skill-bars">
                <div className="skill-bar">
                  <div className="skill-info">
                    <span>HTML/CSS</span>
                    <span>90%</span>
                  </div>
                  <div className="skill-progress">
                    <div className="progress" style={{width: '90%'}}></div>
                  </div>
                </div>
                <div className="skill-bar">
                  <div className="skill-info">
                    <span>JavaScript</span>
                    <span>85%</span>
                  </div>
                  <div className="skill-progress">
                    <div className="progress" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="skill-bar">
                  <div className="skill-info">
                    <span>React</span>
                    <span>80%</span>
                  </div>
                  <div className="skill-progress">
                    <div className="progress" style={{width: '80%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <h2>Contact</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>お問い合わせ</h3>
              <p>ご質問やお仕事のご依頼など、お気軽にお問い合わせください。</p>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <p>email@example.com</p>
                </div>
                <div className="contact-item">
                  <i className="fab fa-github"></i>
                  <p>github.com/username</p>
                </div>
                <div className="contact-item">
                  <i className="fab fa-linkedin"></i>
                  <p>linkedin.com/in/username</p>
                </div>
              </div>
            </div>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">お名前</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">メールアドレス</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">メッセージ</label>
                <textarea id="message" name="message" required></textarea>
              </div>
              <button type="submit" className="submit-btn">送信</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
