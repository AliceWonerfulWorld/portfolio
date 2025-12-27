import React from 'react';

const Experience = () => {
    return (
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
    );
};

export default Experience;
