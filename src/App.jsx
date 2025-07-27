import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './App.css';
import nesupaniImage from './assets/nesupani.png';
import quizmasterImage from './assets/quizmaster.png';
import aliceMarkImage from './assets/AliceMark.png';

function App() {
  const [currentProject, setCurrentProject] = useState(0);

  const projects = [
    {
      title: "クイズマスター",
      description: "4択のシンプルなクイズアプリです。昔学校の授業で作ったものを自分なりにブラッシュアップしました。",
      titleImage: quizmasterImage,
      contentImage: "https://via.placeholder.com/600x400?text=Quiz+App+Screenshot",
      tags: ["Flutter"],
      link: "https://quizmasters-7aecd.web.app/",
      demoLink: "#",
      githubLink: "https://github.com/AliceWonerfulWorld/quizappFlutter"
    },
    {
      title: "ニセッチ2",
      description: "ハックツハッカソン ギガノトカップにて作成しました。",
      titleImage: "https://via.placeholder.com/600x400?text=Project+Title+2",
      contentImage: "https://via.placeholder.com/600x400?text=Project+Content+2",
      tags: ["React", "GCP", "JavaScript", "Terraform"],
      link: "https://giganoto-front.pages.dev/",
      demoLink: "#",
      githubLink: "https://github.com/Yanai1005/giganoto-front",
      detailsLink: "https://topaz.dev/projects/d561c6a5ba98b6cf9f78"
    },
    {
      title: "寝過ごしパニック！",
      description: "部内ハッカソンにて作成しました。「Flutter,React,JavaScript,LineMessagingAPIを必ず使用する」という技術縛りの中開発したプロダクトだったので非常に開発が大変でした。",
      titleImage: nesupaniImage,
      contentImage: "https://via.placeholder.com/600x400?text=Nesupani+App+Screenshot",
      tags: ["Flutter", "Firebase", "React", "JavaScript", "LineMessagingAPI", "Unity", "MediaPipe"],
      link: "https://nesupani-react.vercel.app/",
      demoLink: "#",
      githubLink: "https://github.com/RiTa-23/NesugoshiPanic",
      detailsLink: "https://topaz.dev/projects/ca07b33b0dfd1afac98b"
    },
    {
      title: "アニ名刺",
      description: "データ分析と視覚化に焦点を当てたプロジェクトです。D3.jsなどのライブラリを活用しています。",
      titleImage: "https://via.placeholder.com/600x400?text=Project+Title+4",
      contentImage: "https://via.placeholder.com/600x400?text=Project+Content+4",
      tags: ["Flutter", "Firebase"],
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
            <h1>My Portfolio</h1>
            <p className="hero-roman">佐野 優人</p>
            <p className="hero-subtitle">福岡工業大学 情報工学部 情報工学科 3年 <br/> 情報技術研究部 所属</p>
            <p className="hero-catch">好奇心と技術で未来を創る</p>
            <div className="hero-buttons">
              <a href="#projects" className="primary-btn">作品一覧</a>
              <a href="#contact" className="secondary-btn">お問い合わせ</a>
            </div>
            <div className="social-links">
              <a href="https://github.com/AliceWonerfulWorld" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://x.com/Yuto03944691" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>

          </div>
          <div className="scroll-indicator">
            <span>下へスクロール</span>
            <i className="fas fa-chevron-down"></i>
          </div>
        </section>

        <section id="about" className="about-section">
          <h2>About Me</h2>
          <div className="about-content">
            <div className="about-card">
              <div className="about-header">
                <div className="profile-image-container">
                  <img src={aliceMarkImage} alt="Alice's Profile" className="profile-image" />
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">佐野  優人</h3>
                  <p className="profile-roman">Sano Yuto</p>
                  <p className="profile-title">福岡工業大学 情報工学部 情報工学科 3年</p>
                  <div className="profile-details">
                    <div className="detail-item">
                      <i className="fas fa-birthday-cake"></i>
                      <span>21歳</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>福岡県 柳川市</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-users"></i>
                      <span>情報技術研究部 所属</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="about-body">
                <div className="about-section-item">
                  <h4 className="section-title">
                    <i className="fas fa-code"></i>
                    得意領域・技術スタック
                  </h4>
                  <div className="tech-stack">
                    <div className="tech-category">
                      <span className="category-label">Frontend</span>
                      <div className="tech-tags">
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">Vue.js</span>
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">Tailwind CSS</span>
                      </div>
                    </div>
                    <div className="tech-category">
                      <span className="category-label">Backend</span>
                      <div className="tech-tags">
                        <span className="tech-tag">Node.js</span>
                        <span className="tech-tag">Express</span>
                        <span className="tech-tag">Python</span>
                        <span className="tech-tag">PostgreSQL</span>
                      </div>
                    </div>
                    <div className="tech-category">
                      <span className="category-label">Mobile</span>
                      <div className="tech-tags">
                        <span className="tech-tag">Flutter</span>
                      </div>
                    </div>
                    <div className="tech-category">
                      <span className="category-label">Tools</span>
                      <div className="tech-tags">
                        <span className="tech-tag">Git</span>
                        <span className="tech-tag">Firebase</span>
                        <span className="tech-tag">Figma</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="about-section-item">
                  <h4 className="section-title">
                    <i className="fas fa-heart"></i>
                    趣味・興味
                  </h4>
                  <div className="hobbies-grid">
                    <div className="hobby-item">
                      <div className="hobby-icon">
                        <i className="fas fa-book"></i>
                      </div>
                      <span>読書</span>
                    </div>
                    <div className="hobby-item">
                      <div className="hobby-icon">
                        <i className="fas fa-microphone"></i>
                      </div>
                      <span>カラオケ</span>
                    </div>
                    <div className="hobby-item">
                      <div className="hobby-icon">
                        <i className="fas fa-utensils"></i>
                      </div>
                      <span>グルメ探索</span>
                    </div>
                    <div className="hobby-item">
                      <div className="hobby-icon">
                        <i className="fas fa-music"></i>
                      </div>
                      <span>音楽鑑賞</span>
                    </div>
                    <div className="hobby-item">
                      <div className="hobby-icon">
                        <i className="fas fa-gamepad"></i>
                      </div>
                      <span>ゲーム開発</span>
                    </div>
                    <div className="hobby-item">
                      <div className="hobby-icon">
                        <i className="fas fa-tv"></i>
                      </div>
                      <span>アニメ鑑賞</span>
                    </div>
                  </div>
                </div>

                <div className="about-section-item">
                  <h4 className="section-title">
                    <i className="fas fa-lightbulb"></i>
                    自己紹介
                  </h4>
                  <p className="about-description">
                    こんにちは！佐野 優人と申します。<br />
                    福岡工業大学 情報工学部 情報工学科の3年生です！<br/>
                    現在、27卒としてエンジニア職を目指して就職活動中です。<br/>
                    個人・チーム問わずアプリやゲームの開発に取り組んでおり、特にUI/UX周りの開発が得意です。<br/>
                    新しい技術の学習も楽しんでおり、常に成長し続けることを心がけています。<br/>
                    将来は、技術を通じて人と人のつながりを生み出すエンジニアになりたい <br/>

                  </p>
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
                <h3>福岡工業大学  情報工学部  情報工学科</h3>
                <p className="timeline-date">2025 - 現在</p>
                <p>職種: フロントエンド開発者</p>
                <ul>
                  <li>情報技術研究部に所属</li>
                  <li>フロントエンドを中心に開発を行っている</li>
                  <li>チーム開発でのGit運用</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>福岡工業大学短期大学部  情報メディア学科</h3>
                <p className="timeline-date">2023 - 2025</p>
                <p>学位: 短期大学士</p>
                <ul>
                  <li>Flutterでのモバイルアプリ開発</li>
                  <li>2年前期 学年首席</li>
                  <li>大学への編入へ向けて勉強</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>福岡県立筑前高等学校  普通科</h3>
                <p className="timeline-date">2020 - 2023</p>
                <ul>
                  <li>生徒会執行部に所属</li>
                  <li>学生チームでのプロジェクトリーダー</li>
                  <li>優秀論文賞受賞</li>
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
                    <img src={project.titleImage} alt={project.title} className="project-image" />
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    
                    <div className="project-tech">
                      <h4>使用技術</h4>
                      <div className="tech-tags">
                        {project.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tech-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="project-buttons">
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">View Project</a>
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link demo-link">Demo Video</a>
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link github-link">GitHub</a>
                      {project.detailsLink && project.detailsLink !== "#" && (
                        <a href={project.detailsLink} target="_blank" rel="noopener noreferrer" className="project-link details-link">Details</a>
                      )}
                    </div>
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
