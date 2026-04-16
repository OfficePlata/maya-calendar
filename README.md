# FLGマヤ暦診断アプリ

マヤ暦ツォルキン260日暦による生年月日診断。LINE Bot + Web UI + Lark BASE。

## 構成

| コンポーネント | 技術 | 場所 |
|------------|------|------|
| API + LINE Bot | Cloudflare Workers (TypeScript) | `worker/` |
| Web UI | React + Vite → Cloudflare Pages | `web/` |
| DB | Lark BASE (Bitable) | Lark上に作成 |
| CI/CD | GitHub Actions | `.github/workflows/` |

## セットアップ

### 1. Cloudflare Worker デプロイ

```bash
cd worker
npm install
npx wrangler secret put LINE_CHANNEL_SECRET
npx wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
npx wrangler secret put LARK_APP_ID
npx wrangler secret put LARK_APP_SECRET
npx wrangler secret put LARK_BASE_APP_TOKEN
npx wrangler secret put LARK_BASE_TABLE_ID
npx wrangler deploy
```

### 2. Web UI（Cloudflare Pages）

Cloudflare Dashboard → Pages → GitHubリポジトリ連携

- **ビルドコマンド**: `npm run build`
- **ビルド出力ディレクトリ**: `dist`
- **ルートディレクトリ**: `web`
- **環境変数**: `VITE_WORKER_URL=https://maya-calendar-api.<account>.workers.dev`

### 3. LINE Webhook URL

```
https://maya-calendar-api.<account>.workers.dev/webhook/line
```

### 4. GitHub Actions

GitHub Settings → Secrets → `CLOUDFLARE_API_TOKEN` を追加。  
`worker/` 以下を push すると自動デプロイされます。

## LINE Bot 使い方

```
1985/12/4
ささ 1990/7/15
太郎 1995年3月20日
```

## Worker API

| メソッド | パス | 説明 |
|--------|------|------|
| GET | / | ヘルスチェック |
| POST | /api/calc | KIN計算（JSON入出力） |
| POST | /api/save | KIN計算 + Lark BASE保存 |
| POST | /webhook/line | LINE Webhookハンドラ |

## Powered by OFFICE PLATA
