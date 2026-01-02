import React, { useState, useEffect } from 'react';
import { newsItems as initialNews } from '../../data/news';
import './NewsEditor.css';

const NewsEditor = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [editingNews, setEditingNews] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    // 初回レンダリング時に既存データを読み込み
    useEffect(() => {
        setNewsItems(initialNews);
    }, []);

    // 新規ニュースのテンプレート
    const createEmptyNews = () => ({
        id: Date.now(),
        date: new Date().toLocaleDateString('ja-JP'),
        title: '',
        content: '',
        image: '',
    });

    // 追加モード開始
    const handleAdd = () => {
        setEditingNews(createEmptyNews());
        setIsAdding(true);
    };

    // 編集モード開始
    const handleEdit = (news, index) => {
        setEditingNews({ ...news, index });
        setIsAdding(false);
    };

    // 保存 (新規 or 更新)
    const handleSave = () => {
        if (isAdding) {
            setNewsItems([editingNews, ...newsItems]);
        } else {
          const newNewsItems = [...newsItems];
          newNewsItems[editingNews.index] = editingNews;
          setNewsItems(newNewsItems);
        }
        setEditingNews(null);
        setIsAdding(false);
    };

    // 削除
    const handleDelete = (index) => {
        if (window.confirm('本当に削除しますか?')) {
            const newNewsItems = newsItems.filter((_, i) => i !== index);
            setNewsItems(newNewsItems);
        }
    };
}