# 管理基盤と画面・データの契約（#16・#17）

## 範囲と採用方針

既存のCloudflare Pagesを継続し、Pages Functions＋D1＋Cloudflare Accessを採用する案でローカル実装済み。本番／プレビューのCloudflareアカウント設定は未実施。ブラウザーだけで判定するパスワード認証は廃止する。

#16は共通シェルと開発専用モック、#17は認証、データ、API、移行試行を担当する。実データの編集フォームと公開ページへの接続・本番移行は#20・#21・#22。画像登録は#18、Markdownエディター／レンダラーは#19。管理画面の本番ルートは接続準備中を表示し、サンプル記事や仮の保存成功を表示しない。

### 構成と費用

- 同一オリジンの `/api/*` を `functions/` で処理し、静的ファイルはPagesで配信する。追加のCORS設定は不要。
- `CONTENT_DB` というD1バインディングを本番とプレビューで別々のDBに接続する。[PagesのD1バインディング](https://developers.cloudflare.com/pages/functions/bindings/)を使用する。
- D1 Free枠は読み取り500万行／日、書き込み10万行／日、ストレージ合計5GB。枠超過時はエラーになるため、画面で0件として扱わない。運用費用は利用量で変わり、Paidへの変更は自動で行わない。[D1料金](https://developers.cloudflare.com/d1/platform/pricing/)（2026-10-12確認）。
- FunctionsはWorkersの料金枠を使う。公開APIもリクエスト数に含まれる。[Pages Functions料金](https://developers.cloudflare.com/pages/functions/pricing/)、[Workers料金](https://developers.cloudflare.com/workers/platform/pricing/)を接続時に確認する。
- Accessには無料プランがある。利用人数・認証方式・アカウントの適用プランを接続前に確認する。[Access料金](https://www.cloudflare.com/plans/zero-trust-services/)。この変更で有料契約は作成していない。
- サービス追加を避けて既存ホスティングに合わせる判断。Supabase等に変更する場合は、HTTP／画面の契約を保ってリポジトリと認証実装を置き換える。

## 認証と権限

Accessの同一アプリに `/admin`、`/admin/*`、`/api/admin/*` のホスト／パスを登録し、管理者メールだけをAllowする。独自ドメイン、`pages.dev`、プレビューURLを含め、未保護の別ホストを残さない。公開 `/` と `/api/public/*` は保護対象から外す。接続時には実際のホストとAccessのパスマッチを確認する。

Functionsでも `Cf-Access-Jwt-Assertion` の署名（RS256）、issuer、audience、期限、必須claimsと `type=app` を検証し、`ADMIN_EMAILS` の許可リストを照合する。`adminToken` の有無、Cookieだけの存在、JWTヘッダーだけの存在では許可しない。未設定の環境は503で拒否する。[公式JWT検証手順](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)を基礎にする。

サーバー環境変数：

| 名前 | 値 |
| --- | --- |
| `ACCESS_TEAM_DOMAIN` | `https://<team>.cloudflareaccess.com`（末尾スラッシュなし） |
| `ACCESS_AUD` | 対象AccessアプリのAudience Tag |
| `ADMIN_EMAILS` | 編集可能な管理者メールをカンマ区切りで列挙 |
| `CONTENT_DB` | D1バインディング |

`VITE_ADMIN_PASSWORD` は不要。既存のローカル／ホスティング設定からの削除は接続時に行う。`VITE_*` にサーバー用秘密を置かない。API更新は同一Origin＋JSONに限定する。管理者セッションはAPIで確認し、公開ページでは認証APIを呼ばない。

## データ形式 v1

定義は `shared/content.js`、DBは `migrations/`、APIは `server/`。IDは1〜100文字の英数字・`_`・`-`（先頭は英数字）。新規IDはUUID推奨、既存ニュースのIDは文字列化し、作品IDは維持する。

```json
{
  "kind": "projects",
  "id": "nesugoshi-panic",
  "draft": {"title": "作品名", "summary": "短い説明", "body": "Markdown本文"},
  "published": {"content": {"title": "現在の公開内容"}, "publishedAt": "2026-10-12T00:00:00.000Z"},
  "version": 3,
  "sortOrder": 2,
  "createdAt": "2026-10-11T00:00:00.000Z",
  "updatedAt": "2026-10-12T00:00:00.000Z",
  "publicationState": "changed"
}
```

上記は抜粋。実際のcontentは未入力の任意項目も含む共通形に正規化する。`published=null` は未公開。公開状態はサーバーが算出する。保存状態はフォームが管理し、データの公開状態から推測しない。

| 種類 | contentの項目 |
| --- | --- |
| ニュース | `title`、`body`、`articleDate`（YYYY-MM-DD）、`link` |
| 作品 | `title`、`summary`、`body`、`titleImage`、`titleImageAlt`、`contentImage`、`contentImageAlt`、`tags`（文字列配列）、`link`、`demoLink`、`githubLink`、`detailsLink`、`production` |

本文はMarkdown文字列として保存し、生HTMLを信頼しない。#19のレンダラーは任意HTMLを解釈せず、プレビューと公開ページで共有する。既存の改行・URL・タイトルをそのまま保存する。

未完成の下書きは保存可能。入力済みのURLはhttp/https（認証情報入りは不可）でサーバー検証する。本文は10万文字、通常項目は2000文字、制作情報は5000文字、タグは50件・各200文字まで。リクエストは512KBまで。

公開には、ニュースはタイトル・本文・有効な記事日付、作品は作品名・短い説明が必要。画像・本文・技術・リンク・制作情報は作品では任意。ニュースの記事日付はAsia/Tokyoのカレンダー日付で、公開／更新時刻はUTC ISO文字列。移行時刻は実際の過去の公開時刻を意味しない。予約公開は実装しない。

公開一覧はニュースが記事日付の降順、作品が `sortOrder` の昇順。既存作品の配列順を移行時に維持する。新規作成は末尾に追加される順序値を設定し、編集・公開更新では変更しない。並び替えUIは後続の範囲。

## API

全応答はJSONで `Cache-Control: no-store`。管理APIはすべて認証必須。

| メソッド・パス | 契約 |
| --- | --- |
| `GET /api/admin/session` | サーバー検証済みの `{user: {id, email}}` |
| `GET /api/admin/{kind}` | 下書きと公開スナップショットを含む `{records}` |
| `GET /api/admin/{kind}/{id}` | `{record}`、不存在は404 |
| `PUT /api/admin/{kind}/{id}/draft` | 新規下書き／変更下書き保存 |
| `POST /api/admin/{kind}/{id}/publish` | 保存済み下書きを公開スナップショットへ原子的にコピー。新規公開と公開更新で共通 |
| `POST /api/admin/{kind}/{id}/unpublish` | 公開だけ取り下げ、下書きを残す |
| `POST /api/admin/{kind}/{id}/discard` | 公開中の内容を下書きへ戻す。公開スナップショットは変更しない |
| `POST /api/admin/{kind}/{id}/delete` | 未公開記事の削除。公開中は409。IDと版はtombstoneで保持し再利用しない |
| `GET /api/admin/export` | v1 JSONエクスポート。下書きと削除履歴を含むため非公開で保管 |
| `GET /api/public/{kind}` | 公開済みの `{records}` だけ返す |
| `GET /api/public/{kind}/{id}` | 公開済みの `{record}`、下書き／非公開／不存在は404 |

`kind` は `news` または `projects`。公開レコードは `{kind,id,content,publishedAt,sortOrder}`。下書き・更新版・編集中の時刻は含めない。取得失敗は503等のエラーで、成功した `{records:[]}` と区別する。

更新リクエスト：

```json
{
  "requestId": "a7385d26-0f50-4672-a05a-d6ba33bf0a4f",
  "expectedVersion": 2,
  "content": {"title": "変更した下書き", "body": "", "articleDate": "", "link": ""}
}
```

`content` はdraft操作だけで送る。新規は `expectedVersion=0`、以後は取得した最新のversionを送る。成功は `{record,version,updatedAt}`、削除だけrecord=null。保存・公開・非公開化・破棄・削除ごとにversionが増える。

一度の操作で生成したrequestIdとpayloadを、不明な応答の再試行でも維持する。再送が以前の成功応答を返す場合も、画面で保持しているversionを古い値に戻さない。公開状態の最終表示は必要に応じてGETで再確認する。管理者ID＋requestId単位で成功応答を記録し、同じ操作の再送には元の応答を返す。同じIDを別操作に使うと409。D1のトランザクションbatch内で版の比較・更新と成功記録をまとめ、失敗時は両方ロールバックする。[D1 batchの仕様](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch)。再送記録に自動削除期限は設けず、小規模運用で容量を監視する。

| 応答 | フォームの扱い |
| --- | --- |
| 401 認証失効 | 入力を残す。別タブで再認証し、同じリクエストで再試行する |
| 403 権限／Origin拒否 | 入力を残し、アカウント・接続先を案内する |
| 409 `CONFLICT` | `currentVersion`・`updatedAt`を提示。GETした最新と入力を比較し、利用者の選択前に上書きしない |
| 409 `REQUEST_REUSED` | 新しい操作には新しいrequestIdを発行する |
| 422 `VALIDATION` | `fields`の項目別理由を表示。入力を保持する |
| 503、通信断、応答形式異常 | 入力を保持し、結果不明を成功扱いせず同じ操作を再試行する |

APIクライアントは `src/utils/contentApi.js`。自動保存は行わず、明示的な下書き保存と未保存離脱確認を初期仕様とする。公開前は最新入力を保存してから確認ダイアログを出す。下書き保存ごとに確認を挟まない。

## 画像参照（#18との接続契約）

現行の外部画像URLは維持し、移行画像は `/content/legacy/<file>` に固定する。画像はフォームから参照を外す操作と物理削除を分け、content削除APIでは画像ファイルを削除しない。代替テキストは画像の各Alt項目、本文画像はMarkdownのaltに保存する。

新規管理画像は安定した `/api/media/<mediaId>` を参照する契約。#18がR2等の保存先と管理画像APIを実装する。アップロード済みだけでは公開しない。未公開の画像は認証済み管理者だけが同じURLで取得でき、公開スナップショットから参照される画像だけを公開取得可能にする。公開後にURLを変えない。

#18接続時に、publishとメディア参照登録の整合性を実装し、保存先の存在・所有権・参照範囲をサーバー検証する。下書き、公開スナップショット、他記事のいずれかで参照中の画像は物理削除不可。保存失敗で残った未使用画像は手動確認の対象にし、自動掃除は初期版で必須にしない。

**現段階で管理画像API・R2・アップロードは未実装。** URL形式を認識するだけで、管理画像を公開可能にしたことを意味しない。#18接続前の本番公開フォームを提供しない。Markdownツールバーとの統合は#19・#20・#21で行う。

## 接続・移行・復旧

手順は [admin-migration.md](admin-migration.md)。本番D1の作成、Accessポリシー、DNS／ホスト設定、画像配置、既存データ適用と実アカウントによる確認が必要。まだ外部アカウントや本番データに変更は加えていない。

`wrangler.example.jsonc` は設定例で、コピーした `wrangler.jsonc` はgitignore対象。Pages devは任意の設定ファイル名を受け付けないため、標準名を使う。本番はダッシュボードの環境別バインディングで設定する。プレビューに本番DBを接続しない。PagesのSPAフォールバックで直接URLと再読み込みを処理し、公開記事ルートのReact実装は#20・#21で追加する。

## 検証

- `npm run test:content`：署名付きJWTとSQLite上の本番SQLで認証・公開境界・空下書き・検証・競合・重複送信・途中失敗のロールバック・参照保持・移行・JSON復旧を検証。
- `npm run build:functions`：WranglerでFunctionsをコンパイル。
- `scripts/check-migration-live.mjs`：ローカルPages＋D1で12件／7画像の一致、非認証API拒否、SPA直接URLを確認。
- `npm run lint`、`npm run build`、`npm run test:projects`、差分の空白チェック。
- 本番ビルドは `scripts/check-admin-build.mjs` で旧パスワード認証・ブラウザートークン・開発モックが混入しないことを確認。
- `npm audit`：互換範囲内の依存更新後、脆弱性0件。
- 画面は [admin-design.md](admin-design.md) の4画面×4幅で確認。

実Accessアカウントでのログイン、実ホスティング上の保護パス、実機のソフトキーボードは未確認。これらを完了するまで本番接続済みとは扱わない。
