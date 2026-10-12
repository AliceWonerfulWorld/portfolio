import Markdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownContent.css';

// No raw-HTML plugin: authored HTML stays text, never executable markup.
function safeUrl(value, key) {
  const url = defaultUrlTransform(value);
  if (!url || url.includes('\\') || [...url].some(char => char.charCodeAt(0) <= 32) || url.startsWith('//')) return undefined;
  try {
    const parsed = new URL(url, 'https://markdown.invalid/');
    if (parsed.username || parsed.password) return undefined;
    if (['http:', 'https:'].includes(parsed.protocol) && !(key === 'src' && url.startsWith('#'))) return url;
    if (key === 'href' && parsed.protocol === 'mailto:') return url;
  } catch { /* Invalid URLs are rendered as plain text. */ }
  return undefined;
}

const components = {
  h1: ({children}) => <h3>{children}</h3>,
  h2: ({children}) => <h4>{children}</h4>,
  h3: ({children}) => <h5>{children}</h5>,
  h4: ({children}) => <h6>{children}</h6>,
  h5: ({children}) => <h6>{children}</h6>,
  h6: ({children}) => <h6>{children}</h6>,
  a: ({href, children}) => href
    ? <a href={href} {...(/^https?:\/\//i.test(href) ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>{children}</a>
    : <span>{children}</span>,
  img: ({src, alt}) => src ? <img src={src} alt={alt ?? ''} loading="lazy" /> : <span>{alt || '画像URLを確認してください'}</span>,
  pre: ({children}) => <pre tabIndex={0} aria-label="コードブロック">{children}</pre>,
  table: ({children}) => <div className="markdown-table" role="region" aria-label="表" tabIndex={0}><table>{children}</table></div>,
};

// Reuse this renderer for the public article body when API integration is ready.
export default function MarkdownContent({text}) {
  return <div className="markdown-content">
    {text.trim() ? <Markdown remarkPlugins={[remarkGfm]} urlTransform={safeUrl} components={components}>{text}</Markdown>
      : <p className="markdown-empty">本文を入力すると、ここで見た目を確認できます。</p>}
  </div>;
}
