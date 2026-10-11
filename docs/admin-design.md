# 管理画面の共通デザイン（#16）

## 4画面のモック

開発サーバーの `/admin/design` でダッシュボードと共通シェルを確認できる。以下のルートは開発環境だけに存在し、本番ビルドでは表示しない。すべてのモックに「デザイン確認用」と保存／公開の動作例であることを明記する。

| 画面 | 開発ルート | PC（1280px） | スマホ（390px） |
| --- | --- | --- | --- |
| ニュース一覧 | `/admin/design/news` | [画像](admin-mockups/news-1280.png) | [画像](admin-mockups/news-390.png) |
| ニュース編集 | `/admin/design/news/open-campus` | [画像](admin-mockups/news-open-campus-1280.png) | [画像](admin-mockups/news-open-campus-390.png) |
| 作品一覧 | `/admin/design/projects` | [画像](admin-mockups/projects-1280.png) | [画像](admin-mockups/projects-390.png) |
| 作品編集 | `/admin/design/projects/sample-game` | [画像](admin-mockups/projects-sample-game-1280.png) | [画像](admin-mockups/projects-sample-game-390.png) |

`/news/new` と `/projects/new` で新規作成を確認できる。読み込み中・空・エラーは一覧／ダッシュボードの表示状態セレクトで切り替える。編集では保存失敗・認証失効・更新競合を動作例セレクトで確認できる。サンプルは再読み込みで初期状態に戻る。

本番 `/admin` はサーバーでセッションを確認し、設定未完了を案内する。認証設定済みでも、実編集フォームの接続前は準備中を表示する。旧一時編集フォームは本番ルートから呼び出さない。

## トークンと共通部品

`src/components/admin/design/AdminDesign.css` の `.admin-design` にスコープする。公開ページの配色やレイアウトを変更しない。

| トークン | 値・用途 |
| --- | --- |
| `--admin-navy` | `#17324f`：サイドバー・見出し |
| `--admin-blue` | `#245ca6`：主要操作・現在地・フォーカス |
| `--admin-bg` | `#f3f6fa`：画面背景 |
| `--admin-surface` | `#ffffff`：入力・編集面 |
| `--admin-text` | `#213547`：本文 |
| `--admin-muted` | `#52657a`：補助情報 |
| `--admin-border` | `#aebdce`：パネル境界（入力枠は`#708297`） |
| `--admin-danger` | `#a51f35`：削除・非公開操作 |
| `--admin-radius` | 12px（パネル）、8px（操作・入力） |
| `--admin-gap` | PC24px／スマホ16px |
| 文字 | 本文1rem、補助0.875rem、見出しclampで1.5〜2rem |
| 影 | `0 2px 8px #17324f08`：パネルの弱い陰影 |

主要操作は青地＋白文字、補助操作は白地＋ネイビー文字＋境界線、破壊的操作は白地＋赤文字＋赤枠。無効状態は灰色＋`disabled`で伝える。色だけに頼らず、操作名と状態名を表示する。

シェルはPCサイドバー、現在地（`aria-current`）、パンくず、モバイルメニュー、メインへのスキップリンクを共有する。ダッシュボードは種類別件数・公開／下書きの内訳・最近の編集・新規作成を配置する。最終的な件数と更新時刻はサーバーデータを使い、取得失敗時に0件を出さない。

## 状態と操作

状態名は [admin-platform.md](admin-platform.md) と `shared/content.js` を共用する。

| 区分 | 状態・表示 | 操作 |
| --- | --- | --- |
| 保存 | `dirty`：未保存の変更 | 明示的な下書き保存。離脱時に確認 |
| 保存 | `saving`：保存中 | 重複送信を無効化し、aria-busy／role=status |
| 保存 | `saved`：下書き保存済み＋時刻 | 最新入力が保存された場合だけ未保存フラグを解除 |
| 保存 | `error`：保存失敗＋理由 | 入力保持、role=alert、再試行。認証失効時は再認証、競合時は比較 |
| 公開 | `draft`：下書き・未公開 | 保存後に公開確認を開く |
| 公開 | `published`：公開済み | 公開ページへの導線を後続で接続 |
| 公開 | `changed`：公開済み・変更下書きあり | 現在の公開内容を保持し、公開更新は別操作 |
| 公開操作 | 公開中／成功／失敗 | 応答まで成功表示しない。失敗でも下書きと既存公開内容を保持 |

公開確認は新規公開／公開更新だけに使用し、下書き保存には挟まない。モックでは保存済みのタイトル・日付／短い説明・本文を示す。本文は文字として扱い、実際のMarkdown表示と記事全体のプレビューは#19・#20・#21で接続する。Escapeで閉じ、操作元へフォーカスを戻す。初期フォーカスは「編集に戻る」。

非公開化は「公開から取り下げ、下書きは残る」と確認する。削除は公開中の記事を拒否し、未公開記事のみを対象にする。公開中の記事の変更下書きを破棄する場合はdiscard APIで公開スナップショットへ戻す。画像物理削除は記事操作と分離する。

## スマホ・入力・動き

768px以下は開閉メニュー。ボタンに操作名、`aria-expanded`、`aria-controls`を設定する。メニュー内外でEscapeを使って閉じ、ボタンにフォーカスを戻す。

PCの編集操作は上部sticky、スマホは下部fixedでsafe-area分の余白を取る。本文末尾にも操作バー分の余白を確保する。Visual Viewportでキーボードによる画面縮小を検出し、入力優先の通常フローへ切り替える。対応しない環境でも入力へのフォーカスで切り替える。

入力直後の保存ボタンへのフォーカスでは入力優先状態を維持し、押下途中にバーが移動してクリックを失うことを防ぐ。外部の操作を選ぶと固定表示へ戻る。実機IME・ソフトキーボードの統合確認は#22。

動きは120msの背景色フィードバックのみ。`prefers-reduced-motion` ではアニメーションとtransitionを停止する。主要操作／入力は44px以上、入力文字は1rem以上。

## 検証（2026-10-12）

4画面×320・390・768・1280px（900px高）をChromeで確認し、全16組で横のはみ出しなし、主要操作高さ44px以上、スマホ固定操作／PC stickyを確認。再現用の `scripts/check-admin-design-browser.js` を各画面で実行する。

```sh
npx --no-install agent-browser --session portfolio-admin-design open http://127.0.0.1:5173/admin/design/news
npx --no-install agent-browser --session portfolio-admin-design eval --stdin < scripts/check-admin-design-browser.js
```

メニューのTab移動とEscape、編集後の未保存表示、入力優先の操作位置、保存競合時の入力保持、成功への再試行、公開確認のフォーカスとEscapeを実操作で確認。保存失敗・認証失効・競合、未保存離脱キャンセル、公開失敗・再試行、新規フォームの初期化、未完成下書き保存と公開必須項目も `scripts/check-admin-design-interactions.js` で検証。表示状態のモックは実APIの成功を意味しない。

`node scripts/check-admin-contrast.mjs` でトークンの相対輝度を確認：

| 組み合わせ | 比率 |
| --- | --- |
| 本文／白 | 12.61:1 |
| 補助文字／背景 | 5.53:1 |
| 主要操作白文字／青 | 6.65:1 |
| サイドバー白文字／ネイビー | 13.08:1 |
| 公開済みバッジ | 6.49:1 |
| 変更下書きバッジ | 5.89:1 |
| 赤文字／白 | 7.38:1 |
| 入力枠／白 | 3.94:1 |

これはトークンの計測で、全要素の自動アクセシビリティ監査ではない。実機Safari・IME・ソフトキーボード、スクリーンリーダーは後続で確認する。
