import React from 'react';
import aliceMarkImage from '../../assets/AliceMark.png';

const About = () => {
    return (
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
                                福岡工業大学 情報工学部 情報工学科の3年生です！<br />
                                現在、27卒としてエンジニア職を目指して就職活動中です。<br />
                                大学では、情報技術研究部というサークルに所属しており、みんなからAlice(アリス)と呼ばれています。<br />
                                (不思議の国のアリスが好きなので、アリスです)<br />
                                個人・チーム問わずアプリやゲームの開発に取り組んでおり、特にUI/UX周りの開発が得意です。<br />
                                新しい技術の学習も楽しんでおり、常に成長し続けることを心がけています。<br />
                                将来は、技術を通じて人と人のつながりを生み出すエンジニアになりたいです！！ <br />

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
