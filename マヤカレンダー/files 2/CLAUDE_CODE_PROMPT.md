# FLGマヤ暦診断アプリ — Claude Code 実装指示書

## プロジェクト概要

Google スプレッドシート「FLGマヤ暦シート KIN1570」をWeb/LINE Bot化する。
生年月日を入力すると、マヤ暦ツォルキン260日暦に基づく診断結果を表示・保存するアプリ。

### 提供チャネル
1. **Web App** — React (JSX) → Cloudflare Pages でホスティング
2. **LINE Bot** — Cloudflare Workers で Webhook 受信 → Flex Message で返信
3. **Lark BASE** — 診断結果を蓄積するDB

### 技術スタック
- Cloudflare Workers (TypeScript) — API + LINE webhook
- Cloudflare Pages — React Web UI
- Lark BASE (Bitable) — データ保存
- LINE Messaging API — Flex Message
- GitHub + GitHub Actions — CI/CD

---

## KIN計算エンジン仕様（最重要）

### 基本ルール

1. **基準日**: 1910/1/1 = KIN 63
2. **KIN範囲**: 1〜260 の循環（260の次は1に戻る）
3. **閏日スキップ**: **1912年〜2016年の2月29日はKINカウンターを進めない**（2/28と同じKINを割り当てる）。2020年以降の閏日はスキップしない。
4. **音・紋章・WS・卦はすべてKIN番号から導出する**（日数からではない）

### 計算式（TypeScript）

```typescript
const REF = new Date(1910, 0, 1).getTime();

function calcKIN(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const totalDays = Math.round((date.getTime() - REF) / 86400000);

  // 1912〜2016年の閏日をスキップ
  let skip = 0;
  for (let y = 1912; y < 2020; y += 4) {
    if (y % 100 !== 0 || y % 400 === 0) {
      const feb29 = new Date(y, 1, 29).getTime();
      if (feb29 > REF && feb29 <= date.getTime()) skip++;
    }
  }

  const adj = totalDays - skip;
  const cp = ((adj % 260) + 260) % 260;

  // KIN番号（オフセット+62でスプレッドシートと一致）
  const kin = ((cp + 62) % 260) + 1;

  // 以下すべてKIN番号から導出
  const tone = ((kin - 1) % 13) + 1;       // 銀河の音 1-13
  const seal = ((kin - 1) % 20) + 1;       // 太陽の紋章 1-20
  const wsK = kin - ((kin - 1) % 13);       // WS開始KIN
  const wsSeal = ((wsK - 1 + 260) % 20) + 1; // WS紋章
  const hex = Math.floor((kin - 1) / 4);    // 卦インデックス 0-64
  const mirror = 261 - kin;                  // 鏡の向こうKIN
  const isBlack = BLACK_KINS.has(kin);       // 黒KIN判定

  // ガイドKIN
  const colorGroups = [[1,5,9,13,17],[2,6,10,14,18],[3,7,11,15,19],[4,8,12,16,20]];
  const g = colorGroups[(seal - 1) % 4];
  const guideOffsets = [0, 3, 1, 4, 2];
  const guide = g[(g.indexOf(seal) + guideOffsets[(tone - 1) % 5]) % 5];

  // 関係KIN
  const ANALOG_MAP = [0,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,20,19];
  const analog = ANALOG_MAP[seal];           // 類似KIN
  const antipode = ((seal + 9) % 20) + 1;   // 反対KIN
  const occult = 21 - seal;                  // 神秘KIN

  return { kin, tone, seal, wsSeal, hex, mirror, isBlack, guide, analog, antipode, occult };
}
```

### 検証データ（スプレッドシートと照合済み）

| 生年月日 | KIN | 音 | 太陽の紋章 | WS | 卦 | 鏡の向こう |
|---------|-----|---|----------|-----|-----|----------|
| 1910/1/1 | 63 | 11 | 青い夜 | 白い世界の橋渡し | 天沢履 | 198 |
| 1985/12/4 | 215 | 7 | 青い鷲 | 赤い月 | 沢地萃 | 46 |
| 2000/1/1 | 153 | 10 | 赤い空歩く人 | 黄色い種 | 水火既済 | 108 |
| 2025/4/15 | 24 | 11 | 黄色い種 | 白い魔法使い | 雷天大壮 | 237 |

---

## データ定義

### 20の太陽の紋章

```
1:赤い竜, 2:白い風, 3:青い夜, 4:黄色い種, 5:赤い蛇,
6:白い世界の橋渡し, 7:青い手, 8:黄色い星, 9:赤い月, 10:白い犬,
11:青い猿, 12:黄色い人, 13:赤い空歩く人, 14:白い魔法使い, 15:青い鷲,
16:黄色い戦士, 17:赤い地球, 18:白い鏡, 19:青い嵐, 20:黄色い太陽
```

色: 1,5,9,13,17=赤 / 2,6,10,14,18=白 / 3,7,11,15,19=青 / 4,8,12,16,20=黄

### 13の銀河の音

| 音 | 名前 | キーワード | アクション |
|---|------|---------|---------|
| 1 | 磁気の | 意志の統一 | 始動させる |
| 2 | 月の | 二極性の創造 | 分ける・整理する |
| 3 | 電気の | くっつける | 動く・繋ぎ止める |
| 4 | 自己存在の | 計測する、定義する | 計測する・観察する |
| 5 | 倍音の | 中心を定める | 動機と目的を定める |
| 6 | 律動の | 組織化する | 秩序づける |
| 7 | 共振の | 神秘の力 | 決定する |
| 8 | 銀河の | 調和的共振 | 共感する |
| 9 | 太陽の | 意図の脈動 | 躍動させる |
| 10 | 惑星の | プロデュース | 具現させる |
| 11 | スペクトルの | エネルギーの解放 | 改革の旗手 |
| 12 | 水晶の | 複合的安定 | 物事にこだわらない |
| 13 | 宇宙の | 超越する | 耐え忍ぶ |

### 65の卦（易経）

KIN 1-4 = 卦0, KIN 5-8 = 卦1, ... KIN 257-260 = 卦64（4KINごとに1つの卦）

```
乾為天,沢天夬,天風姤,火天大有,沢風大過,雷天大壮,火風鼎,風天小畜,
雷風恒,水天需,巽為風,山天大畜,水風井,地天泰,山風蠱,天沢履,
天雷无妄,兌為沢,天水訟,火沢暌,沢水困,雷沢帰妹,火水未済,風沢中孚,
雷水解,水沢節,風水渙,山沢損,坎為水,地沢臨,山水蒙,天火同人,
火地晋,地水師,沢火革,天山遯,離為火,沢山咸,雷火豊,火山旅,
風火家人,雷山小過,水火既済,風山漸,山火賁,水山蹇,地火明夷,艮為山,
地風升,地山謙,沢雷随,天地否,火雷噬嗑,沢地萃,震為雷,火地晋,
風雷益,雷地豫,水雷屯,風地観,山雷頤,水地比,地雷復,山地剥,坤為地
```

### 黒KIN（52個）

```
5,12,13,20,24,41,43,62,63,82,84,101,105,112,113,120,126,131,134,139,
147,150,155,158,168,169,170,171,172,173,174,175,176,177,208,209,210,
211,212,213,214,215,216,217,227,230,235,238,246,251,254,259
```

### 類似KIN対応表

```
1↔18, 2↔17, 3↔16, 4↔15, 5↔14, 6↔13, 7↔12, 8↔11, 9↔10, 19↔20
```

---

## 機能要件

### Web App（React / Cloudflare Pages）

#### 画面1: 診断入力
- 名前（任意）、生年月日（年/月/日）の入力フォーム
- 「診断する」ボタン
- 今日のKINバナー表示

#### 画面2: 診断結果（タブ切り替え）

**タブ1: 診断結果**
- KIN番号、太陽の紋章（絵文字＋名前）、銀河の音、ウェイブスペル
- 紋章の可能性/制約キーワード、特性
- チャクラ情報
- 関係KIN（類似/反対/神秘/ガイド）
- 鏡の向こうKIN、卦
- 黒KIN表示

**タブ2: 13年サイクル表**
- 0歳〜51歳の年運KIN（年齢/西暦/KIN/音/紋章/WS/卦/黒KIN）
- 現在の年齢をハイライト

**タブ3: 週間KIN表**
- 直近の誕生日から26週間のKIN
- 今週をハイライト

#### 保存機能
- 「💾 保存」ボタンでローカルストレージ + Lark BASEにも送信
- 保存済みリストから再表示、削除

### デザイン
- ダーク基調（#0B0F1A）、ゴールドアクセント（#F59E0B）
- フォント: Noto Sans JP + Zen Antique Soft
- モバイルファースト（max-width: 520px）

---

### LINE Bot（Cloudflare Workers）

#### Webhook URL
`https://<worker-name>.<account>.workers.dev/webhook/line`

#### 動作フロー
1. ユーザーがテキスト送信
2. 生年月日パターンを検出: `1985/12/4`, `ささ 1990年7月15日` 等
3. 検出できない場合: 使い方を案内するテキスト返信
4. 検出した場合:
   - KIN計算実行
   - Flex Messageで診断結果を返信
   - Lark BASEにレコード追加（非同期）

#### Flex Message構成
- ヘッダー: 「FLGマヤ暦診断」+ 名前/生年月日
- ボディ: KIN番号、紋章名、音/キーワード、関係KIN、卦
- フッター: Powered by OFFICE PLATA

#### LINE署名検証
- `x-line-signature` ヘッダーを HMAC-SHA256 で検証

---

### Lark BASE連携

#### テーブル構造（16フィールド）

| フィールド名 | 型 |
|------------|-----|
| 名前 | テキスト |
| 生年月日 | テキスト |
| KIN | 数値 |
| 音 | 数値 |
| 音キーワード | テキスト |
| 太陽の紋章 | テキスト |
| ウェイブスペル | テキスト |
| 卦 | テキスト |
| 鏡の向こうKIN | 数値 |
| 黒KIN | テキスト |
| ガイドKIN | テキスト |
| 類似KIN | テキスト |
| 反対KIN | テキスト |
| 神秘KIN | テキスト |
| チャネル | テキスト（LINE / Web） |
| 診断日時 | テキスト（ISO 8601） |

#### API
- `POST /open-apis/auth/v3/tenant_access_token/internal` でトークン取得
- `POST /open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records` でレコード追加

---

### Worker API エンドポイント

| メソッド | パス | 説明 |
|--------|------|------|
| GET | / | ヘルスチェック |
| POST | /api/calc | KIN計算のみ（JSON入出力） |
| POST | /api/save | KIN計算 + Lark BASEに保存 |
| POST | /webhook/line | LINE Webhookハンドラ |

すべてのAPIに CORS ヘッダーを付与。

---

## 環境変数（Cloudflare Workers Secrets）

```
LINE_CHANNEL_SECRET       # LINE チャネルシークレット
LINE_CHANNEL_ACCESS_TOKEN # LINE チャネルアクセストークン
LARK_APP_ID               # Lark アプリID (cli_xxx)
LARK_APP_SECRET           # Lark アプリシークレット
LARK_BASE_APP_TOKEN       # Lark BASE の app_token（URLから取得）
LARK_BASE_TABLE_ID        # Lark BASE の table_id（URLから取得）
```

---

## プロジェクト構成

```
maya-calendar-app/
├── CLAUDE_CODE_PROMPT.md   # この指示書
├── README.md               # セットアップガイド
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions (Worker自動デプロイ)
├── worker/
│   ├── src/
│   │   └── index.ts        # Worker本体（LINE + API + Lark）
│   ├── wrangler.toml       # Cloudflare設定
│   ├── package.json
│   └── tsconfig.json
└── web/
    └── src/
        └── maya-app.jsx    # React Web UI（検証済み）
```

---

## デプロイ手順

### 1. Lark BASE準備
- 新規テーブル作成、上記16フィールドを追加
- Lark Open Platform でアプリ作成、`bitable:app` 権限付与
- BASE URLから `app_token`, `table_id` を控える

### 2. LINE Bot準備
- LINE Developers でMessaging APIチャネル作成
- チャネルシークレット、アクセストークンを控える

### 3. Cloudflare Worker
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

### 4. LINE Webhook URL設定
```
https://maya-calendar-api.<account>.workers.dev/webhook/line
```

### 5. GitHub リポジトリ + Actions
```bash
git init && git add . && git commit -m "init"
gh repo create maya-calendar-app --private --push
```
GitHub Settings → Secrets に `CLOUDFLARE_API_TOKEN` を追加。

### 6. Web UI（Cloudflare Pages）
Cloudflare Dashboard → Pages → GitHub連携 → maya-calendar-app → デプロイ

---

## 注意事項

- KIN計算の閏日スキップは**1912年〜2016年のみ**。2020年以降はスキップしない。この仕様を変更しないこと。
- 音・紋章・WSは**KIN番号から導出**する。日数のcycle positionから計算するとズレる。
- web/src/maya-app.jsx は **42,369件のスプレッドシートデータと照合済み**。計算ロジックを変更する場合は必ず検証データで確認すること。
- フッター等に「OFFICE PLATA」のクレジットを入れること。
