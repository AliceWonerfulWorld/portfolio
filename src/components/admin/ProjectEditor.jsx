import React, { useState } from 'react';
import { projects as initialProjects } from '../../data/projects';
import useTemporaryEditor from '../../hooks/useTemporaryEditor';
import './ProjectEditor.css';

const ProjectEditor = ({ onRiskChange }) => {
    const [projects, setProjects] = useState(initialProjects);
    const [editingProject, setEditingProject] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const editor = useTemporaryEditor(projects, editingProject, onRiskChange);

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
        if (!editor.confirmDiscard()) return;
        const draft = createEmptyProject();
        editor.startEditing(draft);
        setEditingProject(draft);
        setIsAdding(true);
    };

    // 編集モード開始
    const handleEdit = (project, index) => {
        if (!editor.confirmDiscard()) return;
        const draft = { ...project, index };
        editor.startEditing(draft);
        setEditingProject(draft);
        setIsAdding(false);
    };

    // 保存 (新規 or 更新)
    const handleSave = () => {
        // Editor-only positions must not leak into exported content.
        const record = { ...editingProject };
        delete record.index;
        if (isAdding) {
            // 新規追加
            setProjects([...projects, record]);
        } else {
            // 更新
            const newProjects = [...projects];
            newProjects[editingProject.index] = record;
            setProjects(newProjects)
        }
        setEditingProject(null);
        setIsAdding(false);
        editor.markApplied();
    };

    // 削除
    const handleDelete = (index) => {
        if (window.confirm('本当に削除しますか?')) {
            const newProjects = projects.filter((_, i) => i !== index);
            setProjects(newProjects);
            editor.markDeleted();
        }
    };

    // キャンセル
    const handleCancel = () => {
        if (!editor.confirmDiscard()) return;
        editor.markCancelled();
        setEditingProject(null);
        setIsAdding(false);
    };

    // フォーム入力の変更
    const handleChange = (field, value) => {
        setEditingProject({ ...editingProject, [field]: value });
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
        editor.markExported();
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <h2>プロジェクト管理</h2>
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
            {editingProject && (
                <div className="edit-form">
                    <h3>{isAdding ? '新規プロジェクト' : 'プロジェクト編集'}</h3>

                    <div className="form-row">
                        <label htmlFor="project-title">タイトル *</label>
                        <input
 id="project-title"                             type="text"
                            value={editingProject.title}
                            onChange={(e) =>
                                handleChange('title', e.target.value)}
                            placeholder="クイズマスター" />
                    </div>

                    <div className="form-row">
                        <label htmlFor="project-description">説明 *</label>
                        <textarea
 id="project-description"                             value={editingProject.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="プロジェクトの説明を入力..."
                            rows={4} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="project-titleImage">タイトル画像URL</label>
                        <input
 id="project-titleImage"                             type="text"
                            value={editingProject.titleImage}
                            onChange={(e) => handleChange('titleImage', e.target.value)}
                            placeholder="https://example.com/image.jpg" />
                    </div>

                    <div className="form-row">
                        <label htmlFor="project-tags">タグ(カンマ区切り)</label>
                        <input
 id="project-tags"                             type="text"
                            value={editingProject.tags.join(', ')}
                            onChange={(e) => handleTagsChange(e.target.value)}
                            placeholder="React, Firebase, TypeScript"
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="project-link">プロジェクトリンク</label>
                        <input
 id="project-link"                             type="url"
                            value={editingProject.link || ''}
                            onChange={(e) => handleChange('link', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="project-demoLink">デモ動画リンク</label>
                        <input
 id="project-demoLink"                             type="url"
                            value={editingProject.demoLink || ''}
                            onChange={(e) => handleChange('demoLink', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="project-githubLink">GitHubリンク</label>
                        <input
 id="project-githubLink"                             type="url"
                            value={editingProject.githubLink || ''}
                            onChange={(e) => handleChange('githubLink', e.target.value)}
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

            {/* プロジェクト一覧 */}
            <div className="projects-list">
                <h3>プロジェクト一覧 ({projects.length}件)</h3>
                {projects.map((project, index) => (
                    <div key={index} className="project-item">
                        <div className="project-info">
                            <h4>{project.title}</h4>
                            <p>{project.description.substring(0, 100)}...</p>
                            <div className="tags">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="project-actions">
                            <button onClick={() => handleEdit(project, index)} className="edit-btn-small ui-button ui-secondary">
                                ✏️ 編集
                            </button>
                            <button disabled={editingProject !== null} onClick={() => handleDelete(index)} className="delete-btn ui-button ui-danger">
                                🗑️ 削除
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectEditor;