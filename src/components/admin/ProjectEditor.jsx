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
}