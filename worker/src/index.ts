// maya-calendar-app/worker/src/index.ts
// Cloudflare Worker: LINE Bot Webhook + Lark BASE Integration

export interface Env {
  LINE_CHANNEL_SECRET: string;
  LINE_CHANNEL_ACCESS_TOKEN: string;
  LARK_APP_ID: string;
  LARK_APP_SECRET: string;
  LARK_BASE_APP_TOKEN: string;
  LARK_BASE_TABLE_ID: string;
}

// ━━━ MAYA CALCULATION ENGINE ━━━
const SEAL_NAMES = ["","赤い竜","白い風","青い夜","黄色い種","赤い蛇","白い世界の橋渡し","青い手","黄色い星","赤い月","白い犬","青い猿","黄色い人","赤い空歩く人","白い魔法使い","青い鷲","黄色い戦士","赤い地球","白い鏡","青い嵐","黄色い太陽"];
const TONE_NAMES = ["","磁気の","月の","電気の","自己存在の","倍音の","律動の","共振の","銀河の","太陽の","惑星の","スペクトルの","水晶の","宇宙の"];
const TONE_KW = ["","意志の統一","二極性の創造","くっつける","計測する","中心を定める","組織化する","神秘の力","調和的共振","意図の脈動","プロデュース","エネルギーの解放","複合的安定","超越する"];
const HEXAGRAMS = ["乾為天","沢天夬","天風姤","火天大有","沢風大過","雷天大壮","火風鼎","風天小畜","雷風恒","水天需","巽為風","山天大畜","水風井","地天泰","山風蠱","天沢履","天雷无妄","兌為沢","天水訟","火沢暌","沢水困","雷沢帰妹","火水未済","風沢中孚","雷水解","水沢節","風水渙","山沢損","坎為水","地沢臨","山水蒙","天火同人","火地晋","地水師","沢火革","天山遯","離為火","沢山咸","雷火豊","火山旅","風火家人","雷山小過","水火既済","風山漸","山火賁","水山蹇","地火明夷","艮為山","地風升","地山謙","沢雷随","天地否","火雷噬嗑","沢地萃","震為雷","火地晋","風雷益","雷地豫","水雷屯","風地観","山雷頤","水地比","地雷復","山地剥","坤為地"];
const BLACK_KINS = new Set([5,12,13,20,24,41,43,62,63,82,84,101,105,112,113,120,126,131,134,139,147,150,155,158,168,169,170,171,172,173,174,175,176,177,208,209,210,211,212,213,214,215,216,217,227,230,235,238,246,251,254,259]);
const ANALOG_MAP = [0,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,20,19];

const REF = new Date(1910, 0, 1).getTime();

function calcKIN(y: number, m: number, d: number) {
  const date = new Date(y, m - 1, d);
  const totalDays = Math.round((date.getTime() - REF) / 86400000);

  // 1912〜2016年の閏日をスキップ（2020年以降はスキップしない仕様）
  let skip = 0;
  for (let ly = 1912; ly < 2020; ly += 4) {
    if (ly % 100 !== 0 || ly % 400 === 0) {
      const feb29 = new Date(ly, 1, 29).getTime();
      if (feb29 > REF && feb29 <= date.getTime()) skip++;
    }
  }

  const adj = totalDays - skip;
  const cp = ((adj % 260) + 260) % 260;
  const kin = ((cp + 62) % 260) + 1;
  const tone = ((kin - 1) % 13) + 1;
  const seal = ((kin - 1) % 20) + 1;
  const wsK = kin - ((kin - 1) % 13);
  const wsSeal = ((wsK - 1 + 260) % 20) + 1;
  const hex = Math.floor((kin - 1) / 4);
  const mirror = 261 - kin;
  const isBlack = BLACK_KINS.has(kin);
  const cg = [[1,5,9,13,17],[2,6,10,14,18],[3,7,11,15,19],[4,8,12,16,20]];
  const g = cg[(seal - 1) % 4];
  const go = [0, 3, 1, 4, 2];
  const guide = g[(g.indexOf(seal) + go[(tone - 1) % 5]) % 5];
  const analog = ANALOG_MAP[seal];
  const antipode = ((seal + 9) % 20) + 1;
  const occult = 21 - seal;

  return { kin, tone, seal, wsSeal, hex, mirror, isBlack, guide, analog, antipode, occult };
}

// ━━━ LARK BASE ━━━
async function getLarkToken(env: Env): Promise<string> {
  const res = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: env.LARK_APP_ID, app_secret: env.LARK_APP_SECRET }),
  });
  const data = await res.json() as any;
  return data.tenant_access_token;
}

async function saveToLarkBase(env: Env, record: Record<string, any>) {
  const token = await getLarkToken(env);
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${env.LARK_BASE_APP_TOKEN}/tables/${env.LARK_BASE_TABLE_ID}/records`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: record }),
  });
  return res.json();
}

// ━━━ LINE MESSAGING ━━━
function buildFlexMessage(name: string, birthdate: string, r: ReturnType<typeof calcKIN>) {
  const sealName = SEAL_NAMES[r.seal];
  const wsName = SEAL_NAMES[r.wsSeal];
  const toneName = TONE_NAMES[r.tone];
  const hexName = HEXAGRAMS[r.hex];
  const blackLabel = r.isBlack ? " ● 黒KIN" : "";

  return {
    type: "flex",
    altText: `${name}さんのマヤ暦診断: KIN${r.kin} ${toneName}${sealName}`,
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box", layout: "vertical",
        backgroundColor: "#1E293B",
        paddingAll: "16px",
        contents: [
          { type: "text", text: "✦ FLG マヤ暦診断 ✦", size: "xs", color: "#F59E0B", align: "center", weight: "bold" },
          { type: "text", text: `${name}さん (${birthdate})`, size: "sm", color: "#94A3B8", align: "center", margin: "sm" },
        ]
      },
      body: {
        type: "box", layout: "vertical",
        backgroundColor: "#0F172A",
        paddingAll: "20px",
        contents: [
          { type: "text", text: `KIN ${r.kin}`, size: "xxl", weight: "bold", color: "#F59E0B", align: "center" },
          { type: "text", text: `${toneName}${sealName}`, size: "lg", weight: "bold", color: "#F1F5F9", align: "center", margin: "sm" },
          { type: "text", text: `音${r.tone}「${TONE_KW[r.tone]}」${blackLabel}`, size: "sm", color: "#94A3B8", align: "center", margin: "sm" },
          { type: "separator", margin: "lg", color: "#1E293B" },
          {
            type: "box", layout: "horizontal", margin: "lg", spacing: "md",
            contents: [
              { type: "box", layout: "vertical", flex: 1, contents: [
                { type: "text", text: "太陽の紋章", size: "xxs", color: "#64748B", align: "center" },
                { type: "text", text: sealName, size: "sm", weight: "bold", color: "#F1F5F9", align: "center" },
              ]},
              { type: "box", layout: "vertical", flex: 1, contents: [
                { type: "text", text: "WS", size: "xxs", color: "#64748B", align: "center" },
                { type: "text", text: wsName, size: "sm", weight: "bold", color: "#F1F5F9", align: "center" },
              ]},
              { type: "box", layout: "vertical", flex: 1, contents: [
                { type: "text", text: "卦", size: "xxs", color: "#64748B", align: "center" },
                { type: "text", text: hexName, size: "sm", weight: "bold", color: "#F1F5F9", align: "center" },
              ]},
            ]
          },
          { type: "separator", margin: "lg", color: "#1E293B" },
          {
            type: "box", layout: "vertical", margin: "lg", spacing: "sm",
            contents: [
              { type: "text", text: "関係KIN", size: "xs", color: "#64748B", weight: "bold" },
              { type: "text", text: `類似: ${SEAL_NAMES[r.analog]} / 反対: ${SEAL_NAMES[r.antipode]}`, size: "xs", color: "#94A3B8" },
              { type: "text", text: `神秘: ${SEAL_NAMES[r.occult]} / ガイド: ${SEAL_NAMES[r.guide]}`, size: "xs", color: "#94A3B8" },
              { type: "text", text: `鏡の向こう: KIN${r.mirror}`, size: "xs", color: "#94A3B8", margin: "sm" },
            ]
          },
        ]
      },
      footer: {
        type: "box", layout: "vertical",
        backgroundColor: "#1E293B",
        paddingAll: "12px",
        contents: [
          { type: "text", text: "Powered by OFFICE PLATA", size: "xxs", color: "#64748B", align: "center" },
        ]
      }
    }
  };
}

async function replyToLine(replyToken: string, messages: any[], env: Env) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
}

function parseBirthdate(text: string): { name: string; y: number; m: number; d: number } | null {
  const dateMatch = text.match(/(\d{4})[\/\-年](\d{1,2})[\/\-月](\d{1,2})日?/);
  if (!dateMatch) return null;
  const y = parseInt(dateMatch[1]), m = parseInt(dateMatch[2]), d = parseInt(dateMatch[3]);
  if (y < 1910 || y > 2030 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const name = text.replace(dateMatch[0], "").trim() || "ゲスト";
  return { name, y, m, d };
}

// ━━━ CRYPTO (LINE Signature Verification) ━━━
async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return expected === signature;
}

// ━━━ WORKER ENTRY ━━━
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // Health check
    if (url.pathname === "/") {
      return new Response(JSON.stringify({ status: "ok", service: "maya-calendar-api" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ━━━ POST /api/calc — KIN計算のみ ━━━
    if (url.pathname === "/api/calc" && request.method === "POST") {
      try {
        const { year, month, day } = await request.json() as any;
        const r = calcKIN(year, month, day);
        return new Response(JSON.stringify({
          ...r,
          sealName: SEAL_NAMES[r.seal],
          wsName: SEAL_NAMES[r.wsSeal],
          toneName: TONE_NAMES[r.tone],
          toneKw: TONE_KW[r.tone],
          hexName: HEXAGRAMS[r.hex],
          guideName: SEAL_NAMES[r.guide],
          analogName: SEAL_NAMES[r.analog],
          antipodeName: SEAL_NAMES[r.antipode],
          occultName: SEAL_NAMES[r.occult],
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: corsHeaders });
      }
    }

    // ━━━ POST /api/save — KIN計算 + Lark BASE保存 ━━━
    if (url.pathname === "/api/save" && request.method === "POST") {
      try {
        const body = await request.json() as any;
        const r = calcKIN(body.year, body.month, body.day);
        const record = {
          "名前": body.name || "ゲスト",
          "生年月日": `${body.year}/${body.month}/${body.day}`,
          "KIN": r.kin,
          "音": r.tone,
          "音キーワード": TONE_KW[r.tone],
          "太陽の紋章": SEAL_NAMES[r.seal],
          "ウェイブスペル": SEAL_NAMES[r.wsSeal],
          "卦": HEXAGRAMS[r.hex],
          "鏡の向こうKIN": r.mirror,
          "黒KIN": r.isBlack ? "★" : "",
          "ガイドKIN": SEAL_NAMES[r.guide],
          "類似KIN": SEAL_NAMES[r.analog],
          "反対KIN": SEAL_NAMES[r.antipode],
          "神秘KIN": SEAL_NAMES[r.occult],
          "チャネル": body.channel || "Web",
          "診断日時": new Date().toISOString(),
        };
        const result = await saveToLarkBase(env, record);
        return new Response(JSON.stringify({ ok: true, result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // ━━━ POST /webhook/line — LINE Webhook ━━━
    if (url.pathname === "/webhook/line" && request.method === "POST") {
      const body = await request.text();
      const signature = request.headers.get("x-line-signature") || "";

      if (env.LINE_CHANNEL_SECRET) {
        const valid = await verifySignature(body, signature, env.LINE_CHANNEL_SECRET);
        if (!valid) return new Response("Invalid signature", { status: 403 });
      }

      const data = JSON.parse(body);
      for (const event of data.events || []) {
        if (event.type !== "message" || event.message.type !== "text") continue;
        const text = event.message.text.trim();

        const parsed = parseBirthdate(text);
        if (!parsed) {
          await replyToLine(event.replyToken, [{
            type: "text",
            text: "🔮 マヤ暦診断へようこそ！\n\n生年月日を送信してください。\n\n例:\n・1985/12/4\n・ささ 1990/7/15\n・太郎 1995年3月20日",
          }], env);
          continue;
        }

        const r = calcKIN(parsed.y, parsed.m, parsed.d);
        const birthdate = `${parsed.y}/${parsed.m}/${parsed.d}`;
        const flex = buildFlexMessage(parsed.name, birthdate, r);

        await replyToLine(event.replyToken, [flex], env);

        // Lark BASE に非同期保存
        if (env.LARK_APP_ID && env.LARK_BASE_APP_TOKEN) {
          saveToLarkBase(env, {
            "名前": parsed.name,
            "生年月日": birthdate,
            "KIN": r.kin,
            "音": r.tone,
            "音キーワード": TONE_KW[r.tone],
            "太陽の紋章": SEAL_NAMES[r.seal],
            "ウェイブスペル": SEAL_NAMES[r.wsSeal],
            "卦": HEXAGRAMS[r.hex],
            "鏡の向こうKIN": r.mirror,
            "黒KIN": r.isBlack ? "★" : "",
            "ガイドKIN": SEAL_NAMES[r.guide],
            "類似KIN": SEAL_NAMES[r.analog],
            "反対KIN": SEAL_NAMES[r.antipode],
            "神秘KIN": SEAL_NAMES[r.occult],
            "チャネル": "LINE",
            "診断日時": new Date().toISOString(),
          }).catch(console.error);
        }
      }
      return new Response("OK", { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  },
};
