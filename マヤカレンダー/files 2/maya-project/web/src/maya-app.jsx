import React, { useState, useEffect } from "react";

// ━━━ DATA ━━━
const S=[null,
  {n:"赤い竜",c:"red",e:"🐉",p:"命を育む、命を大切にする",ng:"自己愛、プライド高い",t:"常識にとらわれない発想。ひらめきに敏感。",ch:"頭",cr:"父性・高次の世界とのコンタクター"},
  {n:"白い風",c:"white",e:"🌬️",p:"霊性や繊細な感性",ng:"世界と遊離しやすい、頑固",t:"伝達能が旺盛。共感本能が強い。",ch:"喉",cr:"メッセンジャー・チャレンジャー"},
  {n:"青い夜",c:"blue",e:"🌙",p:"豊かさ、夢見る力",ng:"お金や物への執着",t:"物質的豊かさに恵まれる。夢を語り希望を与える。",ch:"心臓",cr:"愛・博愛・自由と安定を結ぶ"},
  {n:"黄色い種",c:"yellow",e:"🌱",p:"イデア、開花の力、目覚め",ng:"理想に現実がついてこない",t:"知識を与えることが生きがい。理想が高い。",ch:"太陽神経叢",cr:"権力と支配から秩序と平等へ"},
  {n:"赤い蛇",c:"red",e:"🐍",p:"本能、血と情熱",ng:"こだわりが強い",t:"本能的な直感力。情熱と執念で目標達成。",ch:"仙骨",cr:"母性・見えざる存在に托信"},
  {n:"白い世界の橋渡し",c:"white",e:"🌉",p:"橋渡し、死と再生",ng:"二面性を持つ",t:"異なる世界を結びつける橋渡し的存在。",ch:"頭",cr:"コミュニケーションの架け橋"},
  {n:"青い手",c:"blue",e:"✋",p:"理解し把握する、癒し",ng:"理屈が多い",t:"体験を通じて物事を理解。癒しの力。",ch:"喉",cr:"癒しと理解のマスター"},
  {n:"黄色い星",c:"yellow",e:"⭐",p:"姿形を美しくする、調和の美",ng:"外面だけのつくろい",t:"美的センスに優れている。芸術的能力。",ch:"心臓",cr:"美と調和の実現"},
  {n:"赤い月",c:"red",e:"🌕",p:"浄化、新しい流れ",ng:"突然の嵐に見まわれる",t:"浄化の力。新しい流れを生み出す。使命感。",ch:"太陽神経叢",cr:"浄化と再生の力"},
  {n:"白い犬",c:"white",e:"🐕",p:"誠実さ、忠実さ、家族愛",ng:"イエスマン",t:"誠実で忠実。家族や仲間への愛が深い。",ch:"仙骨",cr:"誠実さと愛の象徴"},
  {n:"青い猿",c:"blue",e:"🐒",p:"高い精神性、トリックスター",ng:"孤独、独善",t:"遊び心と高い精神性。困難を笑いに変える。",ch:"頭",cr:"遊びと精神性の融合"},
  {n:"黄色い人",c:"yellow",e:"🧑",p:"自由意志",ng:"自分勝手、協調性の損失",t:"自由な意志で自分の道を切り開く。影響力。",ch:"喉",cr:"自由意志のマスター"},
  {n:"赤い空歩く人",c:"red",e:"🚶",p:"人々の成長を手助け",ng:"支配と従属",t:"人々の成長を支援する教育者的存在。",ch:"心臓",cr:"探究と支援のガイド"},
  {n:"白い魔法使い",c:"white",e:"🧙",p:"魔法の力、赦す女神",ng:"相手に痛みを押し付ける",t:"魅力的で人を惹きつける。許しの力。",ch:"太陽神経叢",cr:"魔法と赦しの力"},
  {n:"青い鷲",c:"blue",e:"🦅",p:"見通す力、ビジョン、クールな知性",ng:"裏切り、自己陶酔、不正",t:"俯瞰的な視野。先を見通す力。",ch:"仙骨",cr:"ビジョンと先見の明"},
  {n:"黄色い戦士",c:"yellow",e:"⚔️",p:"困難を突破する力、知性",ng:"独善的、頑固",t:"知性と勇気で困難を突破。挑戦者の精神。",ch:"頭",cr:"知性と突破力"},
  {n:"赤い地球",c:"red",e:"🌍",p:"共時性、心の連帯",ng:"翼動家",t:"シンクロニシティを感じる力。心と心をつなぐ。",ch:"喉",cr:"共時性のナビゲーター"},
  {n:"白い鏡",c:"white",e:"🪞",p:"永遠性、秩序、調和、美",ng:"ギャンブル好き、支配的",t:"真実を映し出す鏡。秩序と調和を愛する。",ch:"心臓",cr:"真実と永遠の秩序"},
  {n:"青い嵐",c:"blue",e:"⛈️",p:"変容のエネルギー、家族の団欒",ng:"誇大表現、協調性のなさ",t:"変容の力。エネルギッシュで周囲を巻き込む。",ch:"太陽神経叢",cr:"変容と再生のパワー"},
  {n:"黄色い太陽",c:"yellow",e:"☀️",p:"円満、円熟、太陽の心",ng:"遊び人、ルーズ",t:"太陽のように周囲を照らす。円満で包容力。",ch:"仙骨",cr:"円熟と太陽の心"},
];
const TN=[null,{w:"意志の統一",a:"始動させる",nm:"磁気の"},{w:"二極性の創造",a:"分ける・整理する",nm:"月の"},{w:"くっつける",a:"動く・繋ぎ止める",nm:"電気の"},{w:"計測する、定義する",a:"計測する・観察する",nm:"自己存在の"},{w:"中心を定める",a:"動機と目的を定める",nm:"倍音の"},{w:"組織化する",a:"秩序づける",nm:"律動の"},{w:"神秘の力",a:"決定する",nm:"共振の"},{w:"調和的共振",a:"共感する",nm:"銀河の"},{w:"意図の脈動",a:"躍動させる",nm:"太陽の"},{w:"プロデュース",a:"具現させる",nm:"惑星の"},{w:"エネルギーの解放",a:"改革の旗手",nm:"スペクトルの"},{w:"複合的安定",a:"物事にこだわらない",nm:"水晶の"},{w:"超越する",a:"耐え忍ぶ",nm:"宇宙の"}];
const HX=["乾為天","沢天夬","天風姤","火天大有","沢風大過","雷天大壮","火風鼎","風天小畜","雷風恒","水天需","巽為風","山天大畜","水風井","地天泰","山風蠱","天沢履","天雷无妄","兌為沢","天水訟","火沢暌","沢水困","雷沢帰妹","火水未済","風沢中孚","雷水解","水沢節","風水渙","山沢損","坎為水","地沢臨","山水蒙","天火同人","火地晋","地水師","沢火革","天山遯","離為火","沢山咸","雷火豊","火山旅","風火家人","雷山小過","水火既済","風山漸","山火賁","水山蹇","地火明夷","艮為山","地風升","地山謙","沢雷随","天地否","火雷噬嗑","沢地萃","震為雷","火地晋","風雷益","雷地豫","水雷屯","風地観","山雷頤","水地比","地雷復","山地剥","坤為地"];
const BK=new Set([5,12,13,20,24,41,43,62,63,82,84,101,105,112,113,120,126,131,134,139,147,150,155,158,168,169,170,171,172,173,174,175,176,177,208,209,210,211,212,213,214,215,216,217,227,230,235,238,246,251,254,259]);
const AM=[0,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,20,19];
const CM={red:{bg:"#DC2626",tx:"#fff",ac:"#B91C1C"},white:{bg:"#CBD5E1",tx:"#1E293B",ac:"#94A3B8"},blue:{bg:"#2563EB",tx:"#fff",ac:"#1D4ED8"},yellow:{bg:"#EAB308",tx:"#1E293B",ac:"#CA8A04"}};

// ━━━ ENGINE ━━━
const REF=new Date(1910,0,1);
const dd=d=>Math.round((new Date(d.getFullYear(),d.getMonth(),d.getDate())-REF)/864e5);
const sl=d=>{let s=0,t=d.getTime(),r=REF.getTime();for(let y=1912;y<2020;y+=4)if(y%100||y%400===0){let f=new Date(y,1,29).getTime();if(f>r&&f<=t)s++}return s};

function calc(d){
  const a=dd(d)-sl(d),cp=((a%260)+260)%260,kin=((cp+62)%260)+1;
  const tone=((kin-1)%13)+1,seal=((kin-1)%20)+1;
  const wsK=kin-((kin-1)%13),wsSeal=(((wsK-1+260)%20))+1;
  const hex=Math.floor((kin-1)/4),mirror=261-kin,isBlack=BK.has(kin);
  const cg=[[1,5,9,13,17],[2,6,10,14,18],[3,7,11,15,19],[4,8,12,16,20]];
  const g=cg[(seal-1)%4],go=[0,3,1,4,2];
  const guide=g[(g.indexOf(seal)+go[(tone-1)%5])%5];
  return{kin,tone,seal,wsSeal,hex,mirror,isBlack,guide,analog:AM[seal],antipode:((seal+9)%20)+1,occult:21-seal,date:d};
}

const fd=d=>`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;

function cycle13(bd){
  const r=[];
  for(let i=0;i<52;i++){
    let y=bd.getFullYear()+i,m=bd.getMonth(),d=bd.getDate();
    if(m===1&&d===29){const il=(y%4===0&&y%100!==0)||(y%400===0);if(!il)d=28}
    const dt=new Date(y,m,d),c=calc(dt);
    r.push({age:i,year:y,...c});
  }
  return r;
}

function weekly(bd){
  const now=new Date(),sy=now.getFullYear();
  let start=new Date(sy,bd.getMonth(),bd.getDate());
  if(start>now)start=new Date(sy-1,bd.getMonth(),bd.getDate());
  const w=[];
  for(let i=0;i<26;i++){
    const d=new Date(start.getTime()+i*7*864e5);
    const e=new Date(d.getTime()+6*864e5);
    const c=calc(d);
    w.push({wk:i+1,sd:d,ed:e,cur:now>=d&&now<=e,...c});
  }
  return w;
}

// ━━━ UI ━━━
const Dot=({s,sz=30})=>{const d=S[s];if(!d)return null;const c=CM[d.c];return<div style={{width:sz,height:sz,borderRadius:"50%",background:c.bg,color:c.tx,display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*.5,flexShrink:0,border:`1.5px solid ${c.ac}`}}>{d.e}</div>};

const Th=({children})=><th style={{padding:"7px 5px",textAlign:"center",color:"#64748B",fontWeight:600,fontSize:10,borderBottom:"1px solid #1E293B",whiteSpace:"nowrap",position:"sticky",top:0,background:"#141927",zIndex:1}}>{children}</th>;

function ResultTab({r}){
  const s=S[r.seal],tn=TN[r.tone],ws=S[r.wsSeal],c=CM[s.c];
  return<div>
    <div style={{background:`linear-gradient(145deg,${c.bg}20,#141927)`,borderRadius:16,padding:22,marginBottom:12,border:`1px solid ${c.bg}40`,textAlign:"center",position:"relative"}}>
      {r.isBlack&&<div style={{position:"absolute",top:10,right:10,background:"#1E293B",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,color:"#F59E0B",border:"1px solid #F59E0B44"}}>● 黒KIN</div>}
      <div style={{fontSize:11,color:"#64748B"}}>{fd(r.date)}</div>
      <div style={{fontFamily:"'Zen Antique Soft',serif",fontSize:46,background:`linear-gradient(135deg,${c.bg},${c.ac})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>KIN {r.kin}</div>
      <div style={{fontSize:46,margin:"2px 0"}}>{s.e}</div>
      <div style={{fontSize:19,fontWeight:700}}>{tn.nm}{s.n}</div>
      <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:12,flexWrap:"wrap"}}>
        {[["太陽の紋章",s.n],["WS",ws.n],["音",r.tone],["卦",HX[r.hex]]].map(([l,v],i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:9,color:"#64748B",fontWeight:600}}>{l}</div><div style={{fontSize:12,fontWeight:700}}>{v}</div></div>)}
      </div>
    </div>
    <div style={{background:"#141927",borderRadius:12,padding:14,marginBottom:12,border:"1px solid #1E293B"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#0B0F1A"}}>{r.tone}</div>
        <div><div style={{fontSize:10,color:"#64748B",fontWeight:600}}>銀河の音</div><div style={{fontSize:14,fontWeight:700}}>音{r.tone}「{tn.w}」</div></div>
      </div>
      <div style={{fontSize:12,color:"#94A3B8"}}>{tn.a}</div>
    </div>
    <div style={{background:"#141927",borderRadius:12,padding:14,marginBottom:12,border:"1px solid #1E293B"}}>
      <div style={{fontSize:10,color:"#64748B",fontWeight:600,marginBottom:8}}>太陽の紋章</div>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <div style={{flex:1,background:`${c.bg}18`,borderRadius:8,padding:10,borderLeft:`3px solid ${c.bg}`}}><div style={{fontSize:9,color:"#F59E0B",fontWeight:600}}>✦ 可能性</div><div style={{fontSize:11,lineHeight:1.6,marginTop:2}}>{s.p}</div></div>
        <div style={{flex:1,background:"#1E293B44",borderRadius:8,padding:10,borderLeft:"3px solid #64748B"}}><div style={{fontSize:9,color:"#64748B",fontWeight:600}}>▾ 制約</div><div style={{fontSize:11,lineHeight:1.6,marginTop:2,color:"#94A3B8"}}>{s.ng}</div></div>
      </div>
      <div style={{fontSize:11,color:"#94A3B8",lineHeight:1.6}}>{s.t}</div>
      <div style={{marginTop:6,fontSize:10,color:"#64748B"}}>チャクラ：{s.ch} — {s.cr}</div>
    </div>
    <div style={{background:"#141927",borderRadius:12,padding:14,marginBottom:12,border:"1px solid #1E293B",display:"flex",alignItems:"center",gap:10}}>
      <Dot s={r.wsSeal} sz={40}/><div><div style={{fontSize:10,color:"#64748B",fontWeight:600}}>ウェイブスペル（潜在意識）</div><div style={{fontSize:14,fontWeight:700}}>{ws.n}</div><div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{ws.p}</div></div>
    </div>
    <div style={{background:"#141927",borderRadius:12,padding:14,marginBottom:12,border:"1px solid #1E293B"}}>
      <div style={{fontSize:10,color:"#64748B",fontWeight:600,marginBottom:8}}>関係KIN</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {[["類似",r.analog,"協力者"],["反対",r.antipode,"学びの相手"],["神秘",r.occult,"不思議な縁"],["ガイド",r.guide,"導く存在"]].map(([l,n,d])=><div key={l} style={{background:"#0B0F1A",borderRadius:10,padding:10,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:9,color:"#64748B",fontWeight:600}}>{l}KIN</div><Dot s={n} sz={28}/><div style={{fontSize:11,fontWeight:600}}>{S[n].n}</div><div style={{fontSize:9,color:"#64748B"}}>{d}</div>
        </div>)}
      </div>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:12}}>
      <div style={{flex:1,background:"#141927",borderRadius:12,padding:12,border:"1px solid #1E293B",textAlign:"center"}}><div style={{fontSize:20}}>🪞</div><div style={{fontSize:9,color:"#64748B",fontWeight:600}}>鏡の向こう</div><div style={{fontSize:14,fontWeight:700}}>KIN {r.mirror}</div></div>
      <div style={{flex:1,background:"#141927",borderRadius:12,padding:12,border:"1px solid #1E293B",textAlign:"center"}}><div style={{fontSize:20}}>☰</div><div style={{fontSize:9,color:"#64748B",fontWeight:600}}>卦</div><div style={{fontSize:14,fontWeight:700}}>{HX[r.hex]}</div></div>
    </div>
  </div>;
}

function CycleTab({bd}){
  const rows=cycle13(bd),now=new Date(),curAge=now.getFullYear()-bd.getFullYear();
  return<div>
    <div style={{fontSize:12,color:"#64748B",marginBottom:10,textAlign:"center"}}>誕生日から52年間の年運KIN</div>
    <div style={{maxHeight:480,overflowY:"auto",borderRadius:10,border:"1px solid #1E293B"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr><Th>齢</Th><Th>西暦</Th><Th>KIN</Th><Th>音</Th><Th>紋章</Th><Th>WS</Th><Th>卦</Th><Th>黒</Th></tr></thead>
        <tbody>{rows.map((r,i)=>{
          const cur=r.age>=curAge-1&&r.age<=curAge;
          const sd=S[r.seal],wd=S[r.wsSeal],co=CM[sd.c];
          return<tr key={i} style={{background:cur?"#F59E0B18":i%2?"#141927":"transparent",borderLeft:cur?"3px solid #F59E0B":"3px solid transparent"}}>
            <td style={{padding:"6px 4px",textAlign:"center",fontWeight:cur?700:400,color:cur?"#F59E0B":"#F1F5F9",fontSize:11}}>{r.age}</td>
            <td style={{padding:"6px 3px",textAlign:"center",fontSize:10,color:"#94A3B8"}}>{r.year}</td>
            <td style={{padding:"6px 3px",textAlign:"center",fontWeight:700,fontSize:12}}>{r.kin}</td>
            <td style={{padding:"6px 3px",textAlign:"center"}}>{r.tone}</td>
            <td style={{padding:"6px 2px"}}><div style={{display:"flex",alignItems:"center",gap:2,justifyContent:"center"}}><Dot s={r.seal} sz={18}/><span style={{fontSize:9,color:co.bg,whiteSpace:"nowrap"}}>{sd.n}</span></div></td>
            <td style={{padding:"6px 2px",textAlign:"center",fontSize:9,color:"#94A3B8",whiteSpace:"nowrap"}}>{wd.n}</td>
            <td style={{padding:"6px 3px",textAlign:"center",fontSize:9,color:"#94A3B8",whiteSpace:"nowrap"}}>{HX[r.hex]}</td>
            <td style={{padding:"6px 3px",textAlign:"center",color:"#F59E0B"}}>{r.isBlack?"★":""}</td>
          </tr>})}</tbody>
      </table>
    </div>
  </div>;
}

function WeekTab({bd}){
  const weeks=weekly(bd);
  return<div>
    <div style={{fontSize:12,color:"#64748B",marginBottom:10,textAlign:"center"}}>直近の誕生日から26週間</div>
    <div style={{maxHeight:480,overflowY:"auto",borderRadius:10,border:"1px solid #1E293B"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr><Th>週</Th><Th>期間</Th><Th>KIN</Th><Th>音</Th><Th>紋章</Th><Th>WS</Th><Th>卦</Th><Th>黒</Th></tr></thead>
        <tbody>{weeks.map((w,i)=>{
          const sd=S[w.seal],wd=S[w.wsSeal],co=CM[sd.c];
          return<tr key={i} style={{background:w.cur?"#F59E0B18":i%2?"#141927":"transparent",borderLeft:w.cur?"3px solid #F59E0B":"3px solid transparent"}}>
            <td style={{padding:"6px 4px",textAlign:"center",fontWeight:w.cur?700:400,color:w.cur?"#F59E0B":"#F1F5F9"}}>{w.wk}</td>
            <td style={{padding:"6px 2px",textAlign:"center",fontSize:9,color:"#94A3B8",whiteSpace:"nowrap"}}>{`${w.sd.getMonth()+1}/${w.sd.getDate()}～${w.ed.getMonth()+1}/${w.ed.getDate()}`}</td>
            <td style={{padding:"6px 3px",textAlign:"center",fontWeight:700,fontSize:12}}>{w.kin}</td>
            <td style={{padding:"6px 3px",textAlign:"center"}}>{w.tone}</td>
            <td style={{padding:"6px 2px"}}><div style={{display:"flex",alignItems:"center",gap:2,justifyContent:"center"}}><Dot s={w.seal} sz={18}/><span style={{fontSize:9,color:co.bg,whiteSpace:"nowrap"}}>{sd.n}</span></div></td>
            <td style={{padding:"6px 2px",textAlign:"center",fontSize:9,color:"#94A3B8",whiteSpace:"nowrap"}}>{wd.n}</td>
            <td style={{padding:"6px 3px",textAlign:"center",fontSize:9,color:"#94A3B8",whiteSpace:"nowrap"}}>{HX[w.hex]}</td>
            <td style={{padding:"6px 3px",textAlign:"center",color:"#F59E0B"}}>{w.isBlack?"★":""}</td>
          </tr>})}</tbody>
      </table>
    </div>
  </div>;
}

// ━━━ MAIN ━━━
export default function App(){
  const[yr,setYr]=useState("");
  const[mo,setMo]=useState("");
  const[dy,setDy]=useState("");
  const[nm,setNm]=useState("");
  const[res,setRes]=useState(null);
  const[tab,setTab]=useState("result");
  const[sv,setSv]=useState(null);
  const[hist,setHist]=useState([]);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("maya_hist");if(r)setHist(JSON.parse(r.value))}catch(e){}})()},[]);

  const go=()=>{
    const y=+yr,m=+mo,d=+dy;
    if(!y||!m||!d||y<1910||y>2030)return;
    setRes(calc(new Date(y,m-1,d)));setTab("result");setSv(null);
  };

  const save=async()=>{
    if(!res)return;
    const s=S[res.seal],tn=TN[res.tone],ws=S[res.wsSeal];
    const e={name:nm||"名前未入力",bd:fd(res.date),kin:res.kin,tone:res.tone,tnm:tn.nm,seal:s.n,sealIdx:res.seal,ws:ws.n,hex:HX[res.hex],mirror:res.mirror,black:res.isBlack,guide:S[res.guide].n,analog:S[res.analog].n,antipode:S[res.antipode].n,occult:S[res.occult].n,at:new Date().toISOString()};
    try{
      const h=[e,...hist.filter(x=>x.bd!==e.bd||x.name!==e.name)].slice(0,50);
      await window.storage.set("maya_hist",JSON.stringify(h));
      setHist(h);setSv("ok");setTimeout(()=>setSv(null),2000);
    }catch(er){setSv("err")}
  };

  const load=(h)=>{
    const[y,m,d]=h.bd.split("/").map(Number);
    setYr(""+y);setMo(""+m);setDy(""+d);setNm(h.name);
    setRes(calc(new Date(y,m-1,d)));setTab("result");
  };

  const del=async(idx)=>{
    const h=[...hist];h.splice(idx,1);
    try{await window.storage.set("maya_hist",JSON.stringify(h))}catch(e){}
    setHist(h);
  };

  const today=calc(new Date()),ts=S[today.seal],tt=TN[today.tone];

  return<div style={{
    fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif",background:"#0B0F1A",color:"#F1F5F9",minHeight:"100vh",maxWidth:520,margin:"0 auto",padding:0
  }}>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;600;700;900&family=Zen+Antique+Soft&display=swap" rel="stylesheet"/>

    <div style={{background:"linear-gradient(180deg,#0F172A,#0B0F1A)",padding:"26px 18px 14px",textAlign:"center",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"radial-gradient(ellipse at 50% 0%,#F59E0B11,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{fontSize:11,color:"#F59E0B",letterSpacing:".2em",fontWeight:600}}>✦ FLG MAYA CALENDAR ✦</div>
      <h1 style={{fontFamily:"'Zen Antique Soft',serif",fontSize:24,margin:"2px 0",background:"linear-gradient(135deg,#F59E0B,#FCD34D,#F59E0B)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>マヤ暦診断</h1>
    </div>

    <div style={{padding:"0 14px 40px"}}>
      {/* Today */}
      <div style={{background:`linear-gradient(135deg,${CM[ts.c].bg}18,${CM[ts.c].bg}08)`,borderRadius:10,padding:"10px 14px",border:`1px solid ${CM[ts.c].bg}30`,display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <span style={{fontSize:26}}>{ts.e}</span>
        <div style={{flex:1}}><div style={{fontSize:9,color:"#64748B",fontWeight:600}}>今日 {fd(new Date())}</div><div style={{fontSize:13,fontWeight:700}}>KIN {today.kin}　{tt.nm}{ts.n}</div><div style={{fontSize:10,color:"#94A3B8"}}>音{today.tone}「{tt.w}」{today.isBlack?" ● 黒KIN":""}</div></div>
      </div>

      {/* Input */}
      <div style={{background:"#141927",borderRadius:12,padding:16,border:"1px solid #1E293B",marginBottom:14}}>
        <div style={{marginBottom:8}}><label style={{fontSize:9,color:"#64748B",fontWeight:600}}>名前</label><input placeholder="ささ" value={nm} onChange={e=>setNm(e.target.value)} style={{width:"100%",padding:9,borderRadius:8,background:"#0B0F1A",border:"1px solid #1E293B",color:"#F1F5F9",fontSize:14,fontWeight:600,textAlign:"center",outline:"none",boxSizing:"border-box",marginTop:3}}/></div>
        <div style={{display:"flex",gap:6,marginBottom:10}}>
          {[[yr,setYr,"年","1985",2],[mo,setMo,"月","12",1],[dy,setDy,"日","4",1]].map(([v,fn,l,ph,fl])=>
            <div key={l} style={{flex:fl}}><label style={{fontSize:9,color:"#64748B",fontWeight:600}}>{l}</label><input type="number" placeholder={ph} value={v} onChange={e=>fn(e.target.value)} style={{width:"100%",padding:9,borderRadius:8,background:"#0B0F1A",border:"1px solid #1E293B",color:"#F1F5F9",fontSize:16,fontWeight:600,textAlign:"center",outline:"none",boxSizing:"border-box",marginTop:3}}/></div>)}
        </div>
        <button onClick={go} style={{width:"100%",padding:11,borderRadius:10,border:"none",background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"#0B0F1A",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px #F59E0B44"}}>🔮 診断する</button>
      </div>

      {res&&<>
        {/* Tabs */}
        <div style={{display:"flex",gap:3,marginBottom:12,background:"#141927",borderRadius:9,padding:3,border:"1px solid #1E293B"}}>
          {[["result","診断結果"],["cycle","13年サイクル"],["weekly","週間KIN"]].map(([k,l])=>
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 2px",borderRadius:7,border:"none",background:tab===k?"#F59E0B":"transparent",color:tab===k?"#0B0F1A":"#94A3B8",fontSize:11,fontWeight:tab===k?700:500,cursor:"pointer",transition:"all .2s"}}>{l}</button>)}
        </div>

        <div style={{animation:"fadeIn .4s ease"}}>
          {tab==="result"&&<ResultTab r={res}/>}
          {tab==="cycle"&&<CycleTab bd={res.date}/>}
          {tab==="weekly"&&<WeekTab bd={res.date}/>}
        </div>

        {/* Save */}
        <button onClick={save} style={{width:"100%",marginTop:14,padding:11,borderRadius:10,border:"1px solid #F59E0B",background:sv==="ok"?"#F59E0B22":"transparent",color:sv==="ok"?"#F59E0B":"#94A3B8",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .3s"}}>
          {sv==="ok"?"✅ 保存しました！":"💾 診断結果を保存"}
        </button>
      </>}

      {/* History */}
      {hist.length>0&&<div style={{marginTop:18}}>
        <div style={{fontSize:10,color:"#64748B",fontWeight:600,marginBottom:6}}>📋 保存済み ({hist.length}件)</div>
        {hist.slice(0,15).map((h,i)=><div key={i} style={{background:"#141927",borderRadius:8,padding:"8px 10px",border:"1px solid #1E293B",marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
          <Dot s={h.sealIdx||1} sz={26}/>
          <div style={{flex:1,cursor:"pointer"}} onClick={()=>load(h)}><div style={{fontSize:12,fontWeight:600}}>{h.name}</div><div style={{fontSize:10,color:"#94A3B8"}}>{h.bd} — KIN{h.kin} {h.seal}</div></div>
          <div style={{fontSize:9,color:"#64748B",marginRight:4}}>音{h.tone}</div>
          <button onClick={()=>del(i)} style={{background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:14,padding:2}}>×</button>
        </div>)}
      </div>}
    </div>
    <style>{`
      @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      input:focus{border-color:#F59E0B!important;box-shadow:0 0 0 2px #F59E0B22}
      input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}
      input[type=number]{-moz-appearance:textfield}
      button:hover{opacity:.9}*{box-sizing:border-box}
      td{border-bottom:1px solid #1E293B30}
      ::-webkit-scrollbar{width:4px;height:4px}
      ::-webkit-scrollbar-thumb{background:#1E293B;border-radius:4px}
    `}</style>
  </div>;
}
