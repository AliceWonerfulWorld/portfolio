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

    // キャンセル
    const handleCancel = () => {
        setEditingNews(null);
        setIsAdding(false);
    };

    // フォーム入力の変更
    const handleChange = (field, value) => {
        setEditingNews({ ...editingNews, [field]: value });
    };

    // JSONエクスポート
    const handleExport = () => {
        const dataStr = JSON.stringify(newsItems, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `news_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="editor-container">
          <div className="editor-header">
            <h2>ニュース管理</h2>
            <div className="header-actions">
                <button onClick={handleExport} className="export-btn">
                    JSONエクスポート
                </button>
                <button onClick={handleAdd} className="add-btn">
                    新規追加
                </button>
            </div>
          </div>

          {/* 編集フォーム */}  
          {editingNews && (
            <div className="edit-form">
              <h3>{isAdding ? '新規ニュース' : 'ニュース編集'} </h3>

              <div className="form-row">
                <label>日付 *</label>
                <input
                 type="text"
                 value={editingNews.date}
                 onChange={(e) => handleChange('date', e.target.value)}
                 placeholder="2025年7月26日"
                />
              </div>

              <div className="form-row">
                <label>タイトル *</label>
                <input
                 type="text"
                 value={editingNews.title}
                 onChange={(e) => handleChange('title', e.target.value)}
                 placeholder="イベント名など"
                 />
              </div>

              <div className="form-row">
                <label>内容 *</label>
                <textarea 
                 value={editingNews.context}
                 onChange={(e) => handleChange('context', e.target.value)}
                 placeholder="ニュースの内容を入力..."
                 row={6}
                />
              </div>

              <div className="form-row">
                <label>リンク(オプション)</label>
                <input 
                 type="url"
                 value={editingNews.link || ''}
                 onChange={(e) => handleChange('link', e.target.value)}
                 placeholder="https://..."
                />     
              </div>

              <div className="form-actions">
                <button onClick={handleSave} className="save-btn">
                    保存
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                    キャンセル
                </button>
              </div>
            </div>
          )}        
          
        </div>
    )
}