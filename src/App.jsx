import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './App.css';
import nesupaniImage from './assets/nesupani.png';
import quizmasterImage from './assets/quizmaster.png';
import aliceMarkImage from './assets/AliceMark.png';
import nisettiImage from './assets/nisetti.png';
import animeishiImage from './assets/Animeishi.png';
import sikapokeImage from './assets/sikapoke2.png';
import seitouImage from './assets/oneforall.png';
import listen39Image from './assets/Listen39.png';

function App() {
  const [currentProject, setCurrentProject] = useState(0);
  const [showAllNews, setShowAllNews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const projects = [
    {
      title: "クイズマスター",
      description: "4択のシンプルなクイズアプリです。\n昔学校の授業で作ったものを自分なりにブラッシュアップしました。",
      titleImage: quizmasterImage,
      contentImage: "https://via.placeholder.com/600x400?text=Quiz+App+Screenshot",
      tags: ["Flutter"],
      link: "https://quizmasters-7aecd.web.app/",
      demoLink: "#",
      githubLink: "https://github.com/AliceWonerfulWorld/quizappFlutter"
    },
    {
      title: "ニセッチ2",
      description: "ハックツハッカソン ギガノトカップにて作成しました。\n今話題のあのゲーム機っぽいものを作ってみました。Joy-conを使って遊べるゲームも入っています。",
      titleImage: nisettiImage,
      contentImage: "https://via.placeholder.com/600x400?text=Project+Content+2",
      tags: ["React", "GCP", "JavaScript", "Terraform"],
      link: "https://giganoto-front.pages.dev/",
      demoLink: "#",
      githubLink: "https://github.com/Yanai1005/giganoto-front",
      detailsLink: "https://topaz.dev/projects/d561c6a5ba98b6cf9f78"
    },
    {
      title: "寝過ごしパニック！",
      description: "部内ハッカソンにて作成しました。\n「Flutter,React,JavaScript,LineMessagingAPIを必ず使用する」という技術縛りの中開発したプロダクトだったので非常に開発が大変でした。\n部内ハッカソン 最優秀賞受賞 \n2025/07/05開催 技育博 vol3 展示",
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
      description: "2025.2.1～2.2の技育CAMPハッカソン 2024年度 Vol.21にて製作しました。\n初対面の人と会話をするときに会話のネタがない.....そんなときに役立つようなアプリを目指して作りました。\nあなただけのアニ名刺を作って、QRコードで交換しよう！",
      titleImage: animeishiImage,
      contentImage: "https://via.placeholder.com/600x400?text=Project+Content+4",
      tags: ["Flutter", "Firebase"],
      link: "https://animeishi-73560.firebaseapp.com/",
      demoLink: "#",
      githubLink: "https://github.com/KOU050223/Animeishi"
    },
    {
      title: "SIKAPOKE(Sikaku mounting Card Game Pocket)",
      description: "2025.3.26～3.27 技育CAMPハッカソン 2025年度 vol1にて制作しました。\n今話題のあのカードゲームをオマージュして作ってみました。\nパックを引いて、カードを5枚選んで自分だけのデッキを作ろう！ \n技育CAMPハッカソン 2025年度 vol1 努力賞 受賞",
      titleImage: sikapokeImage,
      contentImage: "https://via.placeholder.com/600x400?text=Project+Content+4",
      tags: ["Flutter", "Firebase"],
      link: "https://sikapoke-42416.web.app/",
      demoLink: "https://www.youtube.com/watch?app=desktop&v=V33WS5e4fNQ&list=PLxw0gD-pIxZfvlgVJBUwSeMR5snLB64y9&index=14",
      githubLink: "https://github.com/RiTa-23/SIKAPOKE_flutter"
    },
    {
      title: "政党まとめサイト",
      description: "2023年9月 カラビナテクノロジー株式会社の2weeksインターンシップに参加した際に作成しました。\nWeb制作には、NotionとStudioという2つのノーコードツールを使用しました",
      titleImage: seitouImage,
      contentImage: "https://via.placeholder.com/600x400?text=Project+Content+4",
      tags: ["Notion", "Studio"],
      link: "https://seitou2023.studio.site/",
    },
    {
      title: "Listen With 39",
      description: "初音ミク「マジカルミライ 2025」プログラミング・コンテスト 応募作品 \n曲に合わせてミクが動くMVを作成しました。\n使用した楽曲 「ストリートライト」\nhttps://www.youtube.com/watch?v=NPOhKU5VTrQ",
      titleImage: listen39Image,
      contentImage: "https://via.placeholder.com/600x400?text=Project+Content+4",
      tags: ["Typescript", "Babylon.js","Blender"],
      link: "https://magimira2025-henon.pages.dev/?k=magimira39",
      githubLink: "https://github.com/henohenon/magimira2025"
    },
    
  ];

  const numProjects = projects.length;

  // URLを自動検出してリンクに変換する関数
  const formatDescription = (description) => {
    // URLを検出してリンクに変換
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const formattedText = description.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    // 改行を<br>タグに変換
    return formattedText.replace(/\n/g, '<br />');
  };

  // News用のテキストフォーマット関数
  const formatNewsText = (text) => {
    // URLを検出してリンクに変換
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const formattedText = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    // 改行を<br>タグに変換
    return formattedText.replace(/\n/g, '<br />');
  };

  // Sample News Items
  const newsItems = [
    {
      id: 1,
      date: "2025年7月26日",
      title: "福岡工業大学 \nオープンキャンパス 参加",
      content: "福岡工業大学のオープンキャンパスにスタッフとして参加しました。\nB棟5階の個別相談ブースにて、短大への入学、大学への編入相談を担当しました。\n多くの方に「とても参考になった」、「ぜひここの短大を受験したい」との声をいただき、非常に嬉しかったです。",
      link: "#" // Optional link to a blog post or more details
    },
    {
      id: 2,
      date: "2025年7月25日",
      title: "ウイングアーク1st株式会社さんのLT会に参加",
      content: "「生成AIについて語ろう」ということで、テーマは生成AIについてでした。\n生成AIを使ってのHPの制作、モデルごとの比較、AIを使うときの心構えなど、どのLTも内容が濃く、有意義な時間を過ごせました。\n(特に同じプロンプトを投げてモデルごとに比較するやつが面白かったです)",
      link: "https://wingarc1st-techevent.connpass.com/event/358566/"
    },
    {
      id: 3,
      date: "2025年7月12日",
      title: "チャレキャラ\nアイデア発表会 参加",
      content: "天神で開催されたチャレキャラのアイデア発表会に参加してきました。\n私たちは「V-chat」という互いにVRアバターの姿で会話ができるコミュニケーションアプリを発表しました。\n発表後、企業の方からフィードバックを頂き、今後の開発において非常に参考になりました。",
      link: "https://www.canva.com/design/DAGsfj57PDY/6TeQMZyRVilRWeCg9VSutg/edit"
    },
    {
      id: 4,
      date: "2025年7月8日",
      title: "初音ミク「マジカルミライ 2025」プログラミング・コンテスト 作品応募",
      content: "締め切りギリギリまで開発してました。\n4月から3か月間の開発でしたが、チームで一丸となってなんとか作品を作り上げることが出来ました。\nコンテストの入選発表は8月9日に発表なので是非お楽しみに～",
      link: "https://magicalmirai.com/2025/procon/"
    },
    {
      id: 5,
      date: "2025年7月5日",
      title: "技育博 vol3 参加",
      content: "このポートフォリオサイトを、よりモダンで洗練されたデザインにアップデートしました。新しい技術スタックも導入し、パフォーマンスも向上しています。ぜひご覧ください。",
      link: "#"
    },
    {
      id: 6,
      date: "2025年7月12日",
      title: "チャレキャラ アイデア発表 & 21歳の誕生日",
      content: "このポートフォリオサイトを、よりモダンで洗練されたデザインにアップデートしました。新しい技術スタックも導入し、パフォーマンスも向上しています。ぜひご覧ください。",
      link: "#"
    },
    {
      id: 7,
      date: "2025年7月12日",
      title: "チャレキャラ アイデア発表 & 21歳の誕生日",
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

  // News表示用のデータを取得
  const displayedNews = showAllNews ? newsItems : newsItems.slice(0, 6);

  const handleShowMoreClick = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setShowAllNews(!showAllNews);
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="App">
      <Header />
      <main>
        <section id="hero" className="hero-section">
          <div className="hero-content">
            <h1>Alice’s Portfolio</h1>
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
                        <span className="tech-tag">JavaScript</span>
                      </div>
                    </div>
                    <div className="tech-category">
                      <span className="category-label">Backend</span>
                      <div className="tech-tags">
                        <span className="tech-tag">Ruby</span>
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
                    大学では、情報技術研究部というサークルに所属しており、みんなからAlice(アリス)と呼ばれています。<br/>
                    (不思議の国のアリスが好きなので、アリスです)<br/>
                    個人・チーム問わずアプリやゲームの開発に取り組んでおり、特にUI/UX周りの開発が得意です。<br/>
                    新しい技術の学習も楽しんでおり、常に成長し続けることを心がけています。<br/>
                    将来は、技術を通じて人と人のつながりを生み出すエンジニアになりたいです！！ <br/>

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
                <p>短大より3年次編入</p>
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
                  <li>各学校行事の運営を担当</li>
                  <li>3年次に実用英語技能検定2級を取得</li>
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
                    <p className="project-description" style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: formatDescription(project.description) }}></p>
                    
                    <div className="project-tech">
                      <h4>使用技術</h4>
                      <div className="tech-tags">
                        {project.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tech-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="project-buttons">
                    {project.link && project.link !== "#" && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">View Project</a>
                      )}
                      {project.demoLink && project.demoLink !== "#" && (
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link demo-link">Demo Video</a>
                      )}
                      {project.githubLink && project.githubLink !== "#" && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link github-link">GitHub</a>
                      )}
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
            {displayedNews.map((item, index) => (
              <div 
                key={item.id} 
                className="news-item"
                style={{ 
                  animationDelay: `${(index + 1) * 0.1}s`
                }}
              >
                <p className="news-date">{item.date}</p>
                <h3 className="news-title" dangerouslySetInnerHTML={{ __html: formatNewsText(item.title) }}></h3>
                <p className="news-content" dangerouslySetInnerHTML={{ __html: formatNewsText(item.content) }}></p>
                {item.link && item.link !== "#" && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-link">
                    詳細を見る <i className="fas fa-arrow-right"></i>
                  </a>
                )}
              </div>
            ))}
          </div>
          {newsItems.length > 6 && (
            <div className="news-show-more">
              <button 
                className={`show-more-btn ${isLoading ? 'loading' : ''}`}
                onClick={handleShowMoreClick}
                disabled={isLoading}
              >
                {showAllNews ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
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
                  <p>chebukinowashiwashi@gmail.com</p>
                </div>
                <div className="contact-item">
                  <i className="fab fa-github"></i>
                  <p>https://github.com/AliceWonerfulWorld</p>
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
