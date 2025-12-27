import React, { useState } from 'react';
import { newsItems } from '../../data/news';

const News = () => {
    const [showAllNews, setShowAllNews] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // News用のテキストフォーマット関数
    const formatNewsText = (text) => {
        // URLを検出してリンクに変換
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const formattedText = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        // 改行を<br>タグに変換
        return formattedText.replace(/\n/g, '<br />');
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
    );
};

export default News;
