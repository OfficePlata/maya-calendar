# FLGマヤ暦診断アプリ

マヤ暦ツォルキン260日暦による診断アプリ。LINE Bot + Web + Lark BASE。

## 構成

| コンポーネント | 技術 | 場所 |
|------------|-----|------|
| API + LINE Bot | Cloudflare Workers (TS) | `worker/` |
| Web UI | React (JSX) | `web/` |
| DB | Lark BASE | Lark上に作成 |
| CI/CD | GitHub Actions | `.github/` |

## セットアップ

詳細は `CLAUDE_CODE_PROMPT.md` を参照。

```bash
# 1. Worker デプロイ
cd worker && npm install
npx wrangler secret put LINE_CHANNEL_SECRET
npx wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
npx wrangler secret put LARK_APP_ID
npx wrangler secret put LARK_APP_SECRET
npx wrangler secret put LARK_BASE_APP_TOKEN
npx wrangler secret put LARK_BASE_TABLE_ID
npx wrangler deploy

# 2. Web デプロイ（Cloudflare Pages）
# Dashboard → Pages → GitHub連携
```

## LINE Bot 使い方

友だち追加後、生年月日を送信：
```
1985/12/4
ささ 1990年7月15日
```

## Powered by OFFICE PLATA
