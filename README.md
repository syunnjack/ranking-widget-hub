# ranking-widget-hub

地域サイト向けのランキング表示ウィジェットを、ジャンルごとに切り替えながら作成・プレビューできる RankKit のデモアプリです。

## 主な機能

- 40 以上のジャンルを切り替えてランキングを表示
- 市区町村や駅名を入れ替えてローカル向けの見せ方を確認
- テーマカラーを変更してウィジェット見た目を即時プレビュー
- 埋め込みコードをコピーして外部サイト掲載を想定した導線を確認
- 表示回数、CTR、通知登録率、推定報酬のダッシュボード表示

## セットアップ

前提:

- Node.js `>=22.13.0`

手順:

```bash
npm install
npm run dev
```

ビルド確認:

```bash
npm run build
npm test
```

## 技術構成

- Next.js 16
- React 19
- Vinext
- Tailwind CSS 4
- Cloudflare Workers 想定の worker エントリ

## 補足

- `app/page.tsx` にウィジェットビルダー本体があります
- `app/globals.css` にページ全体のスタイルがあります
- `worker/index.ts` は Cloudflare Workers 向けエントリです

## コマンド

- `npm run dev`: ローカル起動
- `npm run build`: 本番ビルド
- `npm run start`: ビルド済みアプリ起動
- `npm run lint`: ESLint 実行
- `npm test`: ビルド + HTML レンダリング確認
- `npm run db:generate`: Drizzle migration 生成
