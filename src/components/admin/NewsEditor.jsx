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
}