import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './App.css';

function App() {
  const [currentProject, setCurrentProject] = useState(0);

  const projects = [
    {
      title: "サンプルプロジェクト 1",
      description: "これはサンプルプロジェクトの説明です。ここにプロジェクトの概要が入ります。このプロジェクトはReactとNode.jsを使用して開発されました。",
      image: "https://via.placeholder.com/600x400?text=Project+Image+1",
      tags: ["React", "Node.js", "Express"],
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "サンプルプロジェクト 2",
      description: "これはサンプルプロジェクトの説明です。最新のWeb技術を駆使して作られた、インタラクティブなアプリケーションです。",
      image: "https://via.placeholder.com/600x400?text=Project+Image+2",
      tags: ["JavaScript", "HTML5", "CSS3", "API"],
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "サンプルプロジェクト 3",
      description: "このプロジェクトは、ユーザー中心の設計を重視し、直感的なUI/UXを提供することを目的としています。",
      image: "https://via.placeholder.com/600x400?text=Project+Image+3",
      tags: ["Vue.js", "Firebase", "PWA"],
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "サンプルプロジェクト 4",
      description: "データ分析と視覚化に焦点を当てたプロジェクトです。D3.jsなどのライブラリを活用しています。",
      image: "https://via.placeholder.com/600x400?text=Project+Image+4",
      tags: ["Python", "Flask", "D3.js"],
      demoLink: "#",
      githubLink: "#"
    }
  ];

  const numProjects = projects.length;

  // Sample News Items
  const newsItems = [
    {
      id: 1,
      date: "2025年5月28日",
      title: "ハッカソン「CodeWave 2025」に参加しました！",
      content: "先日開催されたCodeWave 2025ハッカソンにチームで参加し、革新的なWebアプリケーションのプロトタイプを開発しました。惜しくも入賞は逃しましたが、多くの学びと素晴らしい経験を得ることができました。",
      link: "#" // Optional link to a blog post or more details
    },
    {
      id: 2,
      date: "2025年4月15日",
      title: "新しいスキルとしてGraphQLの学習を開始",
      content: "現代的なAPI開発のトレンドを追い、GraphQLの学習を始めました。効率的なデータ取得と柔軟なクエリに感銘を受けています。今後のプロジェクトで活用していく予定です。",
      link: "#"
    },
    {
      id: 3,
      date: "2025年3月1日",
      title: "ポートフォリオサイトをリニューアル！",
      content: "このポートフォリオサイトを、よりモダンで洗練されたデザインにアップデートしました。新しい技術スタックも導入し、パフォーマンスも向上しています。ぜひご覧ください。",
      link: "#"
    }
  ];

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
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
            <button className="carousel-button prev" onClick={prevProject}><i className="fas fa-chevron-left">&#8249;</i></button>
            <div className="project-viewport">
              <div
                className="projects-container"
                style={{
                  width: `${numProjects * 100}%`,
                  transform: `translateX(-${currentProject * (100 / numProjects)}%)`,
                }}
              >
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="project-card"
                    style={{
                      width: `${100 / numProjects}%`, // Each card takes 1/numProjects of the container width
                    }}
                  >
                    <img src={project.image} alt={project.title} className="project-image" />
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">View Project</a>
                  </div>
                ))}
              </div>
            </div>
            <button className="carousel-button next" onClick={nextProject}><i className="fas fa-chevron-right">&#8250;</i></button>
          </div>
        </section>

        {/* News Section - ADDED */}
        <section id="news" className="news-section">
          <h2>News</h2>
          <div className="news-container">
            {newsItems.map((item) => (
              <div key={item.id} className="news-item">
                <p className="news-date">{item.date}</p>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-content">{item.content}</p>
                {item.link && item.link !== "#" && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-link">
                    続きを読む <i className="fas fa-arrow-right"></i>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
        {/* END News Section */}

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
