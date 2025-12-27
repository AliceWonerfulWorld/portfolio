import React, { useState } from 'react';
import { projects } from '../../data/projects';

const Projects = () => {
    const [currentProject, setCurrentProject] = useState(0);
    const numProjects = projects.length;

    const nextProject = () => {
        setCurrentProject((prev) => (prev + 1) % projects.length);
    };

    const prevProject = () => {
        setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
    };

    // URLを自動検出してリンクに変換する関数
    const formatDescription = (description) => {
        // URLを検出してリンクに変換
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const formattedText = description.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        // 改行を<br>タグに変換
        return formattedText.replace(/\n/g, '<br />');
    };

    return (
        <section id="projects" className="projects-section">
            <h2>Projects</h2>
            <div className="projects-carousel">
                <button className="carousel-button prev" onClick={prevProject}><i className="fas fa-chevron-left">&#8249;</i></button>
                <div className="project-viewport">
                    <div
                        className="projects-container"
                        style={{
                            width: `${numProjects * 100}%`,
                            transform: `translateX(-${currentProject * (100 / numProjects)}%)`,
                        }}
                    >
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="project-card"
                                style={{
                                    width: `${100 / numProjects}%`, // Each card takes 1/numProjects of the container width
                                }}
                            >
                                <img src={project.titleImage} alt={project.title} className="project-image" />
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description" style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: formatDescription(project.description) }}></p>

                                <div className="project-tech">
                                    <h4>使用技術</h4>
                                    <div className="tech-tags">
                                        {project.tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="tech-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="project-buttons">
                                    {project.link && project.link !== "#" && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">View Project</a>
                                    )}
                                    {project.demoLink && project.demoLink !== "#" && (
                                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link demo-link">Demo Video</a>
                                    )}
                                    {project.githubLink && project.githubLink !== "#" && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link github-link">GitHub</a>
                                    )}
                                    {project.detailsLink && project.detailsLink !== "#" && (
                                        <a href={project.detailsLink} target="_blank" rel="noopener noreferrer" className="project-link details-link">Details</a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="carousel-button next" onClick={nextProject}><i className="fas fa-chevron-right">&#8250;</i></button>
            </div>
        </section>
    );
};

export default Projects;
