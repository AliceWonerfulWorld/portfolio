import { useId, useLayoutEffect, useRef, useState } from 'react';
import MarkdownContent from '../content/MarkdownContent';
import './MarkdownEditor.css';

export default function MarkdownEditor({value, onChange, error, required = false}) {
  const id = useId();
  const [mode, setMode] = useState('edit');
  const textarea = useRef(null);
  const tabs = useRef({});
  const position = useRef(null);
  const selectMode = next => {
    if (mode === 'edit') {
      const input = textarea.current;
      position.current = {start: input.selectionStart, end: input.selectionEnd, scroll: input.scrollTop};
    }
    setMode(next);
  };
  useLayoutEffect(() => {
    if (mode === 'edit' && position.current) {
      textarea.current.setSelectionRange(position.current.start, position.current.end);
      textarea.current.scrollTop = position.current.scroll;
    }
  }, [mode]);
  const handleTabKey = event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'edit' : event.key === 'End' ? 'preview' : mode === 'edit' ? 'preview' : 'edit';
    selectMode(next);
    tabs.current[next].focus();
  };
  return <div className="admin-field markdown-editor">
    <label htmlFor="field-body">本文（Markdown）{required && <span className="admin-field-required">公開時に必須</span>}</label>
    <div className="markdown-tabs" role="tablist" aria-label="本文の表示モード" onKeyDown={handleTabKey}>
      {['edit', 'preview'].map(tab => <button key={tab} ref={element => {tabs.current[tab] = element;}} type="button" role="tab" id={`${id}-${tab}-tab`}
        aria-selected={mode === tab} aria-controls={`${id}-${tab}-panel`} tabIndex={mode === tab ? 0 : -1} onClick={() => selectMode(tab)}>
        {tab === 'edit' ? '編集' : 'プレビュー'}
      </button>)}
    </div>
    {/* Keep the native input mounted, preserving IME behavior, undo, and selection. */}
    <div id={`${id}-edit-panel`} className="markdown-panel" role="tabpanel" aria-labelledby={`${id}-edit-tab`} hidden={mode !== 'edit'}>
      <textarea ref={textarea} id="field-body" value={value} onChange={event => onChange(event.target.value)} rows={12}
        placeholder={'# 見出し\n\n**強調**や箇条書きを使って、紹介を書きましょう。\n\n- 内容を入力\n- プレビューで確認'}
        aria-invalid={!!error} aria-describedby={error ? 'error-body' : `${id}-help`} />
    </div>
    <div id={`${id}-preview-panel`} className="markdown-panel markdown-preview-panel" role="tabpanel" aria-labelledby={`${id}-preview-tab`} tabIndex={0} hidden={mode !== 'preview'}>
      {mode === 'preview' && <MarkdownContent text={value} />}
    </div>
    <p id={`${id}-help`} className="admin-field-help">編集とプレビューを切り替えて、保存前の本文の見た目を確認できます。</p>
    {error && <p id="error-body" className="admin-field-error">{error}</p>}
  </div>;
}
