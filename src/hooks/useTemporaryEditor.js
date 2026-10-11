import { useEffect, useState } from 'react';

// Track form edits separately from in-memory changes awaiting JSON export.
export default function useTemporaryEditor(items, editingItem, onRiskChange) {
    const [baseline, setBaseline] = useState(null);
    const [exported, setExported] = useState(() => JSON.stringify(items));
    const [message, setMessage] = useState('公開データを読み込みました。変更はまだありません。');
    const draftDirty = editingItem !== null && JSON.stringify(editingItem) !== baseline;
    const needsExport = JSON.stringify(items) !== exported;

    useEffect(() => {
        onRiskChange(draftDirty || needsExport);
    }, [draftDirty, needsExport, onRiskChange]);

    const confirmDiscard = () => !draftDirty || window.confirm('入力途中の変更を破棄しますか？ この操作は取り消せません。');

    return {
        draftDirty,
        confirmDiscard,
        startEditing: item => setBaseline(JSON.stringify(item)),
        markApplied: () => setMessage('一覧に一時反映しました。永続保存・公開反映はされていません。JSONをエクスポートしてください。'),
        markDeleted: () => setMessage('一覧から一時的に削除しました。公開データは変更されていません。JSONをエクスポートしてください。'),
        markCancelled: () => setMessage('入力を取り消しました。一時反映済みの一覧は保持されています。'),
        markExported: () => {
            setExported(JSON.stringify(items));
            setMessage('JSONのダウンロードを開始しました。ファイルを確認してください。公開ページには反映されません。入力途中の内容はJSONに含まれません。');
        },
        status: draftDirty ? '入力途中の変更があります。一覧への一時反映とJSONエクスポートはまだです。' : message,
        needsExport,
    };
}
