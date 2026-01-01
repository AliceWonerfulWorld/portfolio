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

    
}