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

    
}