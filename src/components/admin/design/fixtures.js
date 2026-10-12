import { emptyContent } from '../../../../shared/content.js';

// Deliberately separate from public data: these are UI examples, never server records.
export const designRecords = [
  {kind: 'news', id: 'open-campus', draft: {...emptyContent('news'), title: 'オープンキャンパスに参加しました', articleDate: '2026-10-10', body: '個別相談のスタッフとして参加しました。\n\n学びや制作の活動を、これからも記録していきます。'}, publicationState: 'changed', updatedAt: '2026-10-11T06:20:00Z'},
  {kind: 'news', id: 'new-event', draft: {...emptyContent('news'), title: '次のイベントに向けて', articleDate: '2026-10-11', body: '現在準備中です。'}, publicationState: 'draft', updatedAt: '2026-10-11T04:10:00Z'},
  {kind: 'projects', id: 'sample-game', draft: {...emptyContent('projects'), title: '寝過ごしパニック！', summary: 'アプリとゲームを組み合わせたチーム作品。', body: '## 制作のきっかけ\n\n部内ハッカソンで制作したゲームです。', tags: ['Flutter', 'React', 'Unity'], detailsLink: 'https://topaz.dev/'}, publicationState: 'published', updatedAt: '2026-10-10T09:00:00Z'},
  {kind: 'projects', id: 'sample-app', draft: {...emptyContent('projects'), title: '新しいアプリ', summary: '制作中の作品です。'}, publicationState: 'draft', updatedAt: '2026-10-09T03:00:00Z'},
];
