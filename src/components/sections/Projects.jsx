import { projects } from '../../data/projects';
import './Projects.css';

// Render descriptions as text, keeping URLs clickable without injecting HTML.
const Description = ({ text }) => (
    <p className="project-tile-description">
        {text.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
            /^https?:\/\//.test(part)
                ? <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
                : part
        )}
    </p>
);

const ProjectCard = ({ project }) => {
    const tags = project.tags ?? [];
    const description = project.description ?? '';
    const summary = project.summary || description.split('\n')[0];
    const links = [
        [project.link, '作品を開く', 'ui-primary'],
        [project.demoLink, 'デモ動画', 'ui-secondary'],
        [project.githubLink, 'ソースコード', 'ui-secondary'],
        [project.detailsLink, '制作記事を読む', 'ui-secondary'],
    ].filter(([url]) => url && url !== '#');

    return (
        <li className="project-tile">
            <article>
                <div className="project-tile-media">
                    {project.titleImage
                        ? <img src={project.titleImage} alt={`${project.title}の画面`} loading="lazy" />
                        : <span className="project-image-placeholder">画像準備中</span>}
                </div>
                <div className="project-tile-content">
                    <h3>{project.title}</h3>
                    {summary && <p className="project-tile-summary">{summary}</p>}
                    {tags.length > 0 && (
                        <div className="project-tile-technologies">
                            <h4>主な使用技術</h4>
                            <ul className="project-tile-tags">
                                {tags.slice(0, 3).map((tag, index) => <li className="tech-tag" key={`${tag}-${index}`}>{tag}</li>)}
                            </ul>
                        </div>
                    )}
                    {(description || tags.length > 3) && (
                        <details className="project-tile-details">
                            <summary>作品の詳細を見る<span className="project-detail-context">：{project.title}</span></summary>
                            {description && <Description text={description} />}
                            {tags.length > 3 && (
                                <div className="project-tile-technologies">
                                    <h4>使用技術一覧</h4>
                                    <ul className="project-tile-tags">
                                        {tags.map((tag, index) => <li className="tech-tag" key={`${tag}-${index}`}>{tag}</li>)}
                                    </ul>
                                </div>
                            )}
                        </details>
                    )}
                    {links.length > 0 && (
                        <div className="project-tile-links" aria-label={`${project.title}の外部リンク`}>
                            {links.map(([url, label, variant]) => (
                                <a key={label} href={url} target="_blank" rel="noopener noreferrer" className={`ui-button ${variant}`}>
                                    {label}<span aria-hidden="true">↗</span>
                                    <span className="project-detail-context">（新しいタブで開きます）</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </li>
    );
};

const Projects = ({ items = projects }) => {
    return (
        <section id="projects" className="projects-section">
            <h2>Projects</h2>
            <p className="projects-intro">制作した作品 <strong>{items.length}件</strong>。気になる作品の詳細やデモをご覧ください。</p>
            {items.length === 0
                ? <p className="projects-empty">作品は準備中です。公開までお待ちください。</p>
                : <ul className="projects-grid">
                    {items.map((project, index) => <ProjectCard key={project.id ?? `${project.title}-${index}`} project={project} />)}
                </ul>}
        </section>
    );
};

export default Projects;
