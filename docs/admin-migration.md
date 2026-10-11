# 既存コンテンツの移行・復旧（#17）

## 設定とローカル試行

本番／プレビューで異なるD1を用意する。Access設定とサーバー変数は [admin-platform.md](admin-platform.md) の認証契約を使う。ローカル検証で認証を迂回するフラグは設けない。単体テストの署名鍵はテスト内だけで生成する。

```sh
cp wrangler.example.jsonc wrangler.jsonc
# 自分のDBとAccess設定に書き換える。ローカル検証のDB IDも本番と分ける。
npx wrangler d1 migrations apply portfolio-preview --local
npm run migration:prepare -- /private/tmp/portfolio-migration
npx wrangler d1 execute portfolio-preview --local --file /private/tmp/portfolio-migration/import.sql
# 再実行しても既存IDを上書きしないことを確認
npx wrangler d1 execute portfolio-preview --local --file /private/tmp/portfolio-migration/import.sql
npm run build
cp -R /private/tmp/portfolio-migration/assets/content dist/content
npx wrangler pages dev dist --port 8788
# 別のターミナルで実行
node scripts/check-migration-live.mjs http://127.0.0.1:8788 /private/tmp/portfolio-migration
```

`migration:prepare` はDBに書き込まず、以下の試行用ファイルを生成する。

| 成果物 | 用途 |
| --- | --- |
| `legacy-backup.json` | 現行ニュース・作品の元データ（改行・URL等を保持） |
| `content-v1.json` | 変換後の下書き・公開スナップショット |
| `import.sql` | 安定したIDでINSERT。存在するIDはDO NOTHING |
| `assets/content/legacy/` | ソース画像の同一内容コピー |
| `assets-manifest.json` | 画像のSHA-256、サイズ、移行先の照合 |

ニュースは日付をYYYY-MM-DDへ変換し、本文・タイトルの改行を保持する。作品の外部制作記事リンク、タグ、説明、元の並び順を維持する。リンク未設定の `#` は空文字へ変換する。移行日時はサンプルの固定値であり、実際の過去の公開日時ではない。必要なら初回適用前に決定して固定する。再実行は既存の編集・公開・削除履歴を上書きしない。

## 本番適用（#20・#21・#22）

1. 実DBへの接続前に、既存静的データと画像のバックアップ、既存DBがあればSQLエクスポートを保管する。
2. 本番と別のプレビューDBでスキーマ移行、import、再実行、件数／内容／画像照合を行う。ニュース5件・作品7件・画像7枚が基準。
3. `assets/content` を公開ビルドで恒久配信できる場所（例：`public/content`）へ配置する。importだけ先行して画像URLを壊さない。既存のViteハッシュ画像に永続データを依存させない。
4. 本番Accessアプリで実際の管理者のログインを確認する。全ホストの `/admin`、`/admin/*`、`/api/admin/*` を保護し、未認証／別アカウントの下書き取得と更新が拒否されることを確認する。
5. 本番DBでmigration／importを適用する。ローカル試行の手順から機械的に `--remote` に切り替えず、対象アカウント・DB・件数を確認する。
6. 公開フォームと公開ページをAPIへ接続し、保存→再読み込み→再編集、公開更新、非公開化、公開URLの直接アクセス／再読み込みを実ホスティングで検証する。
7. 公開読み取り失敗を0件表示にせず、再試行を案内することを確認してから切り替える。

この作業では本番への適用を行っていない。新しいモックを本番の編集可能画面として公開しない。

## JSONエクスポート・復旧

`GET /api/admin/export` は `{schemaVersion:1, exportedAt, records}` を返す。recordsには編集中の下書き、公開スナップショット、版、時刻、順序、削除tombstoneを含む。フォームの未保存入力は含まない。エクスポート成功はファイル内容と保管先を確認してから扱う。JSON／DBバックアップには非公開記事が含まれるため公開ディレクトリやGitへ保存しない。

```sh
node scripts/prepare-content-restore.mjs backup-v1.json /private/tmp/restore.sql
# 新しい空の復旧用DBにスキーマを適用した後に実行する
npx wrangler d1 execute portfolio-recovery --local --file /private/tmp/restore.sql
```

restore用SQLは既存IDがあるとエラーになり、稼働中DBの上書きには使わない。復旧用DBで件数・本文・公開境界・版・時刻・順序を照合し、画像ファイルもバックアップから復元する。API再送記録はJSONに含まれないため、復旧後は最新レコードを再取得して新しい操作IDで編集する。完全なDB復旧にはD1のSQLエクスポートを使い、再送記録も保持する。

## 切り戻し

切り替え前のPagesデプロイとDBのバックアップを記録する。API接続で問題が起きたら、接続前の静的公開ページへ戻す。DBを即削除せず、書き込みを停止して状況を保管し、復旧用の別DBで確認してから接続先を切り替える。切り替え後の編集を含むDBを古いJSONで無条件に上書きしない。

## 試行記録（2026-10-12）

- ローカルWrangler D1で2つのスキーマmigrationを適用。
- 実ソースから12件／7画像を生成し、INSERTを2回実行して重複なし。
- ローカルPagesの公開APIと各詳細APIで本文・タイトル・URLを照合。
- 移行画像をビルド出力へ一時配置し、配信内容のSHA-256が元画像と一致。
- 未認証GET／PUTと偽のブラウザートークンが401。
- `/`、`/admin`、`/admin/news/1` のSPA HTMLを直接取得できる。
- JSONエクスポートから空DBへの復旧、tombstoneと版の保持をテスト。

実アカウントのAccessと本番Pages／D1の接続は未実施。
