import React, { useState } from 'react';
import { newsItems as initialNews } from '../../data/news';
import useTemporaryEditor from '../../hooks/useTemporaryEditor';
import './NewsEditor.css';

const NewsEditor = ({ onRiskChange }) => {
    const [newsItems, setNewsItems] = useState(initialNews);
    const [editingNews, setEditingNews] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const editor = useTemporaryEditor(newsItems, editingNews, onRiskChange);

    // 新規ニュースのテンプレート
    const createEmptyNews = () => ({
        id: Date.now(),
        date: new Date().toLocaleDateString('ja-JP'),
        title: '',
        content: '',
    });

    // 追加モード開始
    const handleAdd = () => {
        if (!editor.confirmDiscard()) return;
        const draft = createEmptyNews();
        editor.startEditing(draft);
        setEditingNews(draft);
        setIsAdding(true);
    };

    // 編集モード開始
    const handleEdit = (news, index) => {
        if (!editor.confirmDiscard()) return;
        const draft = { ...news, index };
        editor.startEditing(draft);
        setEditingNews(draft);
        setIsAdding(false);
    };

    // 保存 (新規 or 更新)
    const handleSave = () => {
        // Editor-only positions must not leak into exported content.
        const record = { ...editingNews };
        delete record.index;
        if (isAdding) {
            setNewsItems([record, ...newsItems]);
        } else {
          const newNewsItems = [...newsItems];
          newNewsItems[editingNews.index] = record;
          setNewsItems(newNewsItems);
        }
        setEditingNews(null);
        setIsAdding(false);
        editor.markApplied();
    };

    // 削除
    const handleDelete = (index) => {
        if (window.confirm('本当に削除しますか?')) {
            const newNewsItems = newsItems.filter((_, i) => i !== index);
            setNewsItems(newNewsItems);
            editor.markDeleted();
        }
    };

    // キャンセル
    const handleCancel = () => {
        if (!editor.confirmDiscard()) return;
        editor.markCancelled();
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
        editor.markExported();
    };

    return (
        <div className="editor-container">
          <div className="editor-header">
            <h2>ニュース管理</h2>
            <div className="header-actions">
                <button onClick={handleExport} className="export-btn ui-button ui-secondary">
                    JSONエクスポート
                </button>
                <button onClick={handleAdd} className="add-btn ui-button ui-primary">
                    新規追加
                </button>
            </div>
          </div>

          <p className="editor-status" role="status" aria-live="polite">{editor.status} {editor.needsExport && '一時反映した変更はJSON未出力です。'}</p>

          {/* 編集フォーム */}
          {editingNews && (
            <div className="edit-form">
              <h3>{isAdding ? '新規ニュース' : 'ニュース編集'} </h3>

              <div className="form-row">
                <label htmlFor="news-date">日付 *</label>
                <input
 id="news-date"                  type="text"
                 value={editingNews.date}
                 onChange={(e) => handleChange('date', e.target.value)}
                 placeholder="2025年7月26日"
                />
              </div>

              <div className="form-row">
                <label htmlFor="news-title">タイトル *</label>
                <input
 id="news-title"                  type="text"
                 value={editingNews.title}
                 onChange={(e) => handleChange('title', e.target.value)}
                 placeholder="イベント名など"
                 />
              </div>

              <div className="form-row">
                <label htmlFor="news-content">内容 *</label>
                <textarea id="news-content"
                 value={editingNews.content}
                 onChange={(e) => handleChange('content', e.target.value)}
                 placeholder="ニュースの内容を入力..."
                 rows={6}
                />
              </div>

              <div className="form-row">
                <label htmlFor="news-link">リンク(オプション)</label>
                <input id="news-link"
                 type="url"
                 value={editingNews.link || ''}
                 onChange={(e) => handleChange('link', e.target.value)}
                 placeholder="https://..."
                />
              </div>

              <div className="form-actions">
                <button onClick={handleSave} className="save-btn ui-button ui-primary">
                    一覧に一時反映
                </button>
                <button onClick={handleCancel} className="cancel-btn ui-button ui-secondary">
                    キャンセル
                </button>
              </div>
            </div>
          )}

          {/* ニュース一覧 */}
          <div className="news-list">
            <h3>ニュース一覧 ({newsItems.length}件)</h3>
            {newsItems.map((news, index) => (
              <div key={index} className="news-item-card">
                <div className="news-info">
                  <div className="news-date">{news.date}</div>
                  <h4>{news.title}</h4>
                  <p>{news.content.substring(0, 150)}...</p>
                  {news.link && news.link !== '#' && (
                    <a href={news.link} target="_blank" rel="noopener noreferrer" className="news-link-preview">
                        リンクあり
                    </a>
                  )}
                 </div>
                 <div className="news-actions">
                  <button onClick={() => handleEdit(news, index)} className="edit-btn-small ui-button ui-secondary">
                    編集
                  </button>
                  <button disabled={editingNews !== null} onClick={() => handleDelete(index)} className="delete-btn ui-button ui-danger">
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
    );
};

export default NewsEditor;