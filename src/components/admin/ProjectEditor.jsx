import React, { useState, useEffect } from 'react';
import { projects as initialProjects } from '../../data/projects';
import './ProjectEditor.css';

const ProjectEditor = () => {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [isAdding, setAdding] = useState(false);

    // 初回レンダリング時に既存データを読み込み
    useEffect(() => {
        setProjects(initialProjects);
    }, []);

    // 新規プロジェクトのテンプレート
    const createEmptyProject = () => ({
        title: '',
        description: '',
        titleImage: '',
        tags: [],
        link: '',
        demoLink: '',
        githubLink: '',
        detailsLink: '',
    });

    // 追加モード開始
    const handleAdd = () => {
        setEditingProject(createEmptyProject());
        setIsAdding(true);
    };

    // 編集モード開始
    const handleEdit = (project, index) => {
        setEditingProject({ ...project, index });
        setIsAdding(false);
    };

    // 保存 (新規 or 更新)
    const handleSave = () => {
        if (isAdding) {
            // 新規追加
            setProjects([...projects, editingProject]); 
        } else {
            // 更新
            const newProjects = [...projects];
            newProjects[editingProject.index] = editingProject;
            setProjects(newProjects)
        }
        setEditingProject(null);
        setIsAdding(false);
    };

    // 削除
    const handleDelete = (index) => {
        if (window.confirm('本当に削除しますか?')) {
            const newProjects = projects.filter((_, i) => i !== index);
            setProjects(newProjects);
        }
    };

    // キャンセル
    const handleCancel = () => {
        setEditingProject(null);
        setIsAdding(false);
    };

    // フォーム入力の変更
    const handleChange = (field, value) => {
        setEditingProject({ ...editingProject, [field]: value});
    };

    // タグの変更 (カンマ区切り文字列を配列に変換)
    const handleTagsChange = (value) => {
        const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setEditingProject({ ...editingProject, tags: tagsArray });
    };

    // JSONエクスポート
    const handleExport = () => {
        const dataStr = JSON.stringify(projects, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `projects_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="editor-container">
          <div className="editor-header">
            <h2>プロジェクト管理</h2>
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
          {editingProject && (
            <div className="edit-form">
                <h3>{isAdding ? '新規プロジェクト' : 'プロジェクト編集'}</h3>

                <div className="form-row">
                  <label>タイトル *</label>
                  <input
                   type="text"
                   value={editingProject.title}
                   onChange={(e) =>
                    handleChange('title', e.target.value)}
                    placeholder="クイズマスター"/>
                </div>

                <div className="form-row">
                  <label>説明 *</label>
                  <textarea
                    value={editingProject.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="プロジェクトの説明を入力..."
                    rows={4} />
                </div>

                <div className="form-row">
                  <label>タイトル画像URL</label>
                  <input
                   type="text"
                   value={editingProject.titleImage}
                   onChange={(e) => handleChange('titleImage', e.target.value)}
                   placeholder="https://example.com/image.jpg"/>
                </div>

                <div className="form-row">
                  <label>タグ(カンマ区切り)</label>
                  <input
                   type="text"
                   value={editingProject.tags.join(',')}
                   onChange={(e) => handleTagsChange(e.target.value)}
                   placeholder="React, Firebase, TypeScript"
                  />
                </div>

                <div className="form-row">
                  <label>プロジェクトリンク</label>
                  <input
                   type="url"
                   value={editingProject.link || ''}
                   onChange={(e) => handleChange('link', e.target.value)}
                   placeholder="https://..."
                  />
                </div>

                <div className="form-row">
                  <label>デモ動画リンク</label>
                  <input
                   type="url"
                   value={editingProject.demoLink || ''}
                   onChange={(e) => handleChange('demoLink' , e.target.value)}
                   placeholder="https://..."
                  />
                </div>

                <div className="form-row">
                    <label>Githubリンク</label>
                    <input
                     type="url"
                     value={editingProject.githubLink || ''}
                     onChange={(e) => handleChange('githubLink', e.target.value)}
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


}