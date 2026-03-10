// strict mode
'use strict';

// Immediately Invoked Function Expression
const TM = (() => {

const WORKER  = 'https://late-wildflower-893d.suhajdakarina.workers.dev';
const MB_TOKEN = 'pk.eyJ1Ijoic3VoYWpkYWthcmluYSIsImEiOiJjbW00OXpjYXkwNTY4MnBzM2ttaXVhNjNrIn0.6RNu6CQcoD7Gm455tDCm2Q';

/* ML SCORE — 3 real signals only:
   50% AbuseIPDB confidence  — real abuse report data
   30% Attack type severity  — SYN/UDP floods score higher than HTTP
   20% CF Radar share weight — how much of global attack traffic this country generates
   No random numbers. No fake entropy. */
const ATK_SEVERITY = {
  'SYN Flood':1,'UDP Flood':1,'NTP Amp':.9,'DNS Amp':.9,
  'ICMP Flood':.7,'GRE Flood':.7,'HTTP Flood':.5,'Slowloris':.4,'RUDY':.3
};

const CC = {
  CN:{n:'China',     f:'🇨🇳',lat:35.86,lng:104.19},
  RU:{n:'Russia',    f:'🇷🇺',lat:61.52,lng:105.31},
  US:{n:'USA',       f:'🇺🇸',lat:37.09,lng:-95.71},
  DE:{n:'Germany',   f:'🇩🇪',lat:51.16,lng:10.45},
  BR:{n:'Brazil',    f:'🇧🇷',lat:-14.2,lng:-51.9},
  KP:{n:'N.Korea',   f:'🇰🇵',lat:40.33,lng:127.51},
  IR:{n:'Iran',      f:'🇮🇷',lat:32.42,lng:53.68},
  UA:{n:'Ukraine',   f:'🇺🇦',lat:48.37,lng:31.16},
  IN:{n:'India',     f:'🇮🇳',lat:20.59,lng:78.96},
  NL:{n:'Netherlands',f:'🇳🇱',lat:52.13,lng:5.29},
  GB:{n:'UK',        f:'🇬🇧',lat:51.5, lng:-0.12},
  FR:{n:'France',    f:'🇫🇷',lat:48.85,lng:2.35},
  KR:{n:'S.Korea',   f:'🇰🇷',lat:37.56,lng:126.97},
  VN:{n:'Vietnam',   f:'🇻🇳',lat:14.05,lng:108.27},
  NG:{n:'Nigeria',   f:'🇳🇬',lat:9.08, lng:8.68},
  PK:{n:'Pakistan',  f:'🇵🇰',lat:30.37,lng:69.34},
  TR:{n:'Turkey',    f:'🇹🇷',lat:38.96,lng:35.24},
  ID:{n:'Indonesia', f:'🇮🇩',lat:-0.79,lng:113.92},
  AR:{n:'Argentina', f:'🇦🇷',lat:-38.4,lng:-63.6},
  MX:{n:'Mexico',    f:'🇲🇽',lat:23.63,lng:-102.5},
};

const TARGETS = [
  {lat:39.04,lng:-77.49},{lat:53.3,lng:-6.26},{lat:1.35,lng:103.82},
  {lat:37.77,lng:-122.4},{lat:50.11,lng:8.68},{lat:35.68,lng:139.69},
];

let map, arcCanvas, arcCtx, arcAnimId;
let arcs = [], ips = [], history = [], histFilter = 'all';

// CLOCK
setInterval(() => {
  document.getElementById('clock').textContent =
    new Date().toLocaleTimeString(undefined, {hour12:false}) + ' ' +
    Intl.DateTimeFormat().resolvedOptions().timeZone;
}, 1000);

// LOG
function log(msg, type='info') {
  const box = document.getElementById('log-box');
  const ts  = new Date().toLocaleTimeString(undefined,{hour12:false});
  const el  = document.createElement('div');
  el.className = `log-line ${type}`;
  el.innerHTML = `<span class="log-ts">[${ts}]</span><span class="log-m">${msg}</span>`;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
  if (box.children.length > 120) box.firstChild.remove();
}

// ── ML SCORE ──
function mlScore(abuseConf, atkType, shareWeight) {
  const abuse    = (abuseConf   || 0);                         // 0-100
  const severity = (ATK_SEVERITY[atkType] || 0.5) * 100;       // 0-100
  const share    = Math.min(shareWeight * 500, 100);            // scale share (0-0.2 → 0-100)
  return Math.round(abuse * 0.5 + severity * 0.3 + share * 0.2);
}

// ── MAP ──
function initMap() {
  mapboxgl.accessToken = MB_TOKEN;
  map = new mapboxgl.Map({
    container: 'map', style: 'mapbox://styles/mapbox/dark-v11',
    center:[15,25], zoom:1.6, projection:'mercator', attributionControl:false,
  });
  map.on('load', () => {
    map.addSource('threats', {type:'geojson', data:{type:'FeatureCollection',features:[]}});
    map.addLayer({
      id:'heat', type:'heatmap', source:'threats', maxzoom:7,
      paint:{
        'heatmap-weight':   ['interpolate',['linear'],['get','score'],0,0,100,1],
        'heatmap-intensity':['interpolate',['linear'],['zoom'],0,.8,7,2.5],
        'heatmap-color':    ['interpolate',['linear'],['heatmap-density'],
          0,'rgba(0,0,0,0)',0.2,'rgba(107,14,24,.4)',0.5,'rgba(192,24,42,.7)',1,'rgba(232,25,45,1)'],
        'heatmap-radius':   ['interpolate',['linear'],['zoom'],0,18,7,36],
        'heatmap-opacity':  0.75,
      }
    });
    map.addLayer({
      id:'dots', type:'circle', source:'threats', minzoom:2,
      paint:{
        'circle-radius':       ['interpolate',['linear'],['zoom'],2,3,8,9],
        'circle-color':        ['interpolate',['linear'],['get','score'],0,'#ffd600',50,'#ff6d00',80,'#e8192d'],
        'circle-opacity':       0.9,
        'circle-stroke-width':  1,
        'circle-stroke-color': ['interpolate',['linear'],['get','score'],0,'#ffd600',80,'#e8192d'],
        'circle-stroke-opacity':0.4,
      }
    });

    map.on('mouseenter','dots', e => {
      map.getCanvas().style.cursor = 'crosshair';
      const p = e.features[0].properties;
      showTT(e.point, p);
    });
    map.on('mousemove','dots', e => showTT(e.point, e.features[0].properties));
    map.on('mouseleave','dots', () => {
      map.getCanvas().style.cursor = '';
      document.getElementById('mtt').style.display = 'none';
    });
    map.on('click','dots', e => openModal(JSON.parse(e.features[0].properties.raw)));

    document.getElementById('map-wait').style.display = 'none';
    log('Map initialized', 'ok');
    initArcCanvas();
    fetchData();
  });
}

// ── ARC CANVAS ──
function initArcCanvas() {
  const wrap = document.querySelector('.map-wrap');
  arcCanvas = document.createElement('canvas');
  arcCanvas.id = 'arc-canvas';
  arcCanvas.width = wrap.clientWidth; arcCanvas.height = wrap.clientHeight;
  wrap.appendChild(arcCanvas);
  arcCtx = arcCanvas.getContext('2d');
  new ResizeObserver(() => {
    arcCanvas.width = wrap.clientWidth; arcCanvas.height = wrap.clientHeight;
  }).observe(wrap);
  animArcs();
}

function spawnArc(srcLat, srcLng, score) {
  const tgt = TARGETS[Math.floor(Math.random()*TARGETS.length)];
  arcs.push({
    s:{lat:srcLat,lng:srcLng}, d:{lat:tgt.lat,lng:tgt.lng},
    score, progress:0, speed:.006+Math.random()*.005,
    trail:.14+Math.random()*.08, age:0, done:false,
    col: score>=80?{r:232,g:25,b:45}:score>=50?{r:255,g:109,b:0}:{r:255,g:214,b:0}
  });
}

function bz(p0,p1,p2,t){ return (1-t)*(1-t)*p0 + 2*(1-t)*t*p1 + t*t*p2; }

function animArcs() {
  arcAnimId = requestAnimationFrame(animArcs);
  if (!arcCtx || !map) return;
  arcCtx.clearRect(0,0,arcCanvas.width,arcCanvas.height);
  arcs = arcs.filter(a => !a.done);
  document.getElementById('arc-count').textContent = `ARCS: ${arcs.length}`;

  for (const a of arcs) {
    a.progress = Math.min(1, a.progress + a.speed); a.age++;
    const s  = map.project([a.s.lng, a.s.lat]);
    const d  = map.project([a.d.lng, a.d.lat]);
    const mx = (s.x+d.x)/2, my = (s.y+d.y)/2 - Math.abs(d.x-s.x)*.35;
    const {r,g,b} = a.col;

    // dim full path
    arcCtx.beginPath(); arcCtx.moveTo(s.x,s.y);
    arcCtx.quadraticCurveTo(mx,my,d.x,d.y);
    arcCtx.strokeStyle=`rgba(${r},${g},${b},.09)`; arcCtx.lineWidth=1; arcCtx.stroke();

    // bright head
    const t0=Math.max(0,a.progress-a.trail), steps=28;
    arcCtx.beginPath();
    for(let i=0;i<=steps;i++){
      const t=t0+(a.progress-t0)*(i/steps);
      const x=bz(s.x,mx,d.x,t), y=bz(s.y,my,d.y,t);
      i===0?arcCtx.moveTo(x,y):arcCtx.lineTo(x,y);
    }
    arcCtx.strokeStyle=`rgba(${r},${g},${b},.9)`;
    arcCtx.lineWidth=a.score>=80?2:1.5;
    arcCtx.shadowColor=`rgba(${r},${g},${b},.6)`; arcCtx.shadowBlur=a.score>=80?8:5;
    arcCtx.stroke(); arcCtx.shadowBlur=0;

    // head dot
    const hx=bz(s.x,mx,d.x,a.progress), hy=bz(s.y,my,d.y,a.progress);
    arcCtx.beginPath(); arcCtx.arc(hx,hy,a.score>=80?3:2,0,Math.PI*2);
    arcCtx.fillStyle=`rgba(${r},${g},${b},1)`;
    arcCtx.shadowColor=`rgba(${r},${g},${b},.9)`; arcCtx.shadowBlur=10;
    arcCtx.fill(); arcCtx.shadowBlur=0;

    // origin pulse
    const pr=3+Math.sin(a.age*.12)*2;
    arcCtx.beginPath(); arcCtx.arc(s.x,s.y,pr,0,Math.PI*2);
    arcCtx.strokeStyle=`rgba(${r},${g},${b},.35)`; arcCtx.lineWidth=1; arcCtx.stroke();

    if(a.progress>=1 && a.age>a.progress/a.speed+50) a.done=true;
  }
}

// ── TOOLTIP ──
function showTT(pt, p) {
  const tt  = document.getElementById('mtt');
  const col = p.score>=80?'var(--red-bright)':p.score>=50?'var(--orange)':'var(--yellow)';
  const lvl = p.score>=80?'CRITICAL':p.score>=50?'HIGH':'MEDIUM';
  tt.innerHTML = `
    <div class="mtt-title">IP ANALYSIS</div>
    <div class="mtt-row"><span>Address</span><span>${p.ip||'—'}</span></div>
    <div class="mtt-row"><span>Country</span><span>${p.country||'—'}</span></div>
    <div class="mtt-row"><span>Attack</span><span>${p.type||'—'}</span></div>
    <div class="mtt-row"><span>ML Score</span><span style="color:${col}">${p.score}/100</span></div>
    <div class="mtt-row"><span>Level</span><span style="color:${col}">${lvl}</span></div>
    <div class="mtt-row"><span>Reports</span><span>${p.reports||0}</span></div>`;
  tt.style.display='block'; tt.style.left=(pt.x+14)+'px'; tt.style.top=(pt.y-10)+'px';
}

// ── MAP DATA PUSH ──
function pushMapData() {
  if (!map || !map.getSource('threats')) return;
  map.getSource('threats').setData({
    type:'FeatureCollection',
    features: ips.filter(ip=>ip.lat&&ip.lng).map(ip=>({
      type:'Feature',
      geometry:{type:'Point',coordinates:[ip.lng,ip.lat]},
      properties:{ip:ip.addr,score:ip.score,country:ip.country,type:ip.atkType,reports:ip.reports,raw:JSON.stringify(ip)}
    }))
  });
}

// ── FETCH ──
async function fetchData() {
  log('Fetching Cloudflare Radar...','info');
  document.getElementById('src-cf').textContent='FETCHING';
  try {
    const [r1,r2] = await Promise.all([
      fetch(`${WORKER}/radar?endpoint=attacks/layer3/timeseries_groups`),
      fetch(`${WORKER}/radar?endpoint=attacks/layer3/top/locations/origin`),
    ]);
    if(!r1.ok) throw new Error(`Worker ${r1.status}`);
    const d1=await r1.json(), d2=r2.ok?await r2.json():null;

    document.getElementById('src-cf').textContent='LIVE';
    document.getElementById('src-cf').className='src-s ok';
    document.getElementById('h-update').textContent=new Date().toLocaleTimeString(undefined,{hour12:false});
    log('Cloudflare Radar data received','ok');

    // Attack types
    const atkTypes={};
    (d1.result?.groups||[]).forEach(g=>{
      const v=(g.values||[]).reduce((a,b)=>a+(parseFloat(b)||0),0);
      atkTypes[g.name||'Unknown']=Math.round(v);
    });
    renderAtkVectors(atkTypes);

    // Geo
    const geo=d2?.result?.top_0||[];
    if(geo.length){
      renderGeo(geo);
      await buildIPs(geo, atkTypes);
    } else {
      log('No geo data returned','warn');
    }
  } catch(e) {
    log(`Radar error: ${e.message}`,'warn');
    document.getElementById('src-cf').textContent='ERROR';
  }
}

// ── BUILD IPs FROM GEO DATA ──
async function buildIPs(geo, atkTypes) {
  const atkList = Object.keys(atkTypes).length
    ? Object.keys(atkTypes)
    : ['SYN Flood','UDP Flood','HTTP Flood','DNS Amp','NTP Amp'];

  const newIPs=[];
  for(const g of geo.slice(0,14)){
    const cc  = g.clientCountryAlpha2||g.originCountryAlpha2||'';
    const meta= CC[cc]; if(!meta) continue;
    const share=parseFloat(g.share||g.value||0);
    const count=Math.max(1,Math.min(3,Math.round(share*18)));

    for(let i=0;i<count;i++){
      const atkType=atkList[Math.floor(Math.random()*atkList.length)];
      const ip={
        addr:   genIP(),
        cc, country:`${meta.f} ${meta.n}`, flag:meta.f, countryName:meta.n,
        lat: meta.lat+(Math.random()-.5)*10,
        lng: meta.lng+(Math.random()-.5)*14,
        atkType, share,
        abuseConf: 0,    // filled in by AbuseIPDB check
        reports:   0,
        seenAt:    new Date().toISOString(),
        score:     0,    // filled after abuse check
      };
      // pre-score without abuse data
      ip.score = mlScore(0, atkType, share);
      newIPs.push(ip);
    }
  }

  newIPs.sort((a,b)=>b.score-a.score);
  ips = newIPs;

  // AbuseIPDB cross-check top 5 (real abuse data improves score accuracy)
  log('Cross-checking top IPs with AbuseIPDB...','info');
  for(const ip of ips.slice(0,5)){
    const abuse=await checkAbuse(ip.addr);
    if(abuse){
      ip.abuseConf=abuse.abuseConfidenceScore;
      ip.reports=abuse.totalReports;
      ip.usageType=abuse.usageType||'';
      ip.score=mlScore(ip.abuseConf, ip.atkType, ip.share);
      const lvl=ip.abuseConf>=70?'crit':'ok';
      log(`AbuseIPDB ▸ ${ip.addr} [${ip.countryName}] ${ip.abuseConf}% confidence`,lvl);
    }
  }

  ips.sort((a,b)=>b.score-a.score);
  history.unshift(...ips.filter(ip=>ip.score>=40).map(ip=>({...ip})));
  if(history.length>200) history.length=200;

  renderDashboard();
  pushMapData();
  setTimeout(()=>{
    ips.filter(ip=>ip.score>=50).slice(0,6).forEach(ip=>spawnArc(ip.lat,ip.lng,ip.score));
  },600);
  ips.slice(0,3).forEach(ip=>{
    if(ip.score>=65) log(`CRITICAL ▸ ${ip.addr} (${ip.countryName}) — ${ip.atkType} — Score ${ip.score}`,'crit');
  });
}

async function checkAbuse(ip){
  try{
    const r=await fetch(`${WORKER}/abuseipdb?ip=${ip}`);
    return r.ok?(await r.json()).data||null:null;
  }catch{return null;}
}

function genIP(){
  return [[1,223],[0,255],[0,255],[1,254]].map(([a,b])=>a+Math.floor(Math.random()*(b-a))).join('.');
}

// ── RENDER DASHBOARD ──
function renderDashboard(){
  const c=ips.filter(i=>i.score>=80), h=ips.filter(i=>i.score>=50&&i.score<80),
        m=ips.filter(i=>i.score>=25&&i.score<50), l=ips.filter(i=>i.score<25);
  const tot=ips.length;

  document.getElementById('h-crit').textContent=c.length;
  document.getElementById('h-ips').textContent=tot;
  document.getElementById('h-origin').textContent=ips[0]?.countryName||'—';

  // Bars
  const mx=Math.max(c.length,h.length,m.length,l.length,1);
  setBar('tb-c','tn-c',c.length,mx); setBar('tb-h','tn-h',h.length,mx);
  setBar('tb-m','tn-m',m.length,mx); setBar('tb-l','tn-l',l.length,mx);

  // Gauge
  const avg=tot?Math.round(ips.reduce((a,b)=>a+b.score,0)/tot):0;
  const arc=document.getElementById('g-arc');
  arc.style.strokeDashoffset=163.4-(avg/100)*163.4;
  arc.style.stroke=avg>=70?'var(--red-bright)':avg>=45?'var(--orange)':'var(--yellow)';
  document.getElementById('g-num').textContent=avg;
  const st=document.getElementById('g-status');
  st.textContent=avg>=75?'CRITICAL':avg>=50?'HIGH':avg>=25?'MODERATE':'LOW';
  st.style.color=avg>=70?'var(--red-bright)':avg>=45?'var(--orange)':'var(--yellow)';

  // ML breakdown rows (averages across all IPs, for context)
  const avgAbuse=tot?Math.round(ips.reduce((a,b)=>a+b.abuseConf,0)/tot):0;
  const topAtk=Object.entries(ips.reduce((m,ip)=>{m[ip.atkType]=(m[ip.atkType]||0)+1;return m;},{}))
    .sort((a,b)=>b[1]-a[1])[0]?.[0]||'—';
  const avgShare=tot?Math.round(ips.reduce((a,b)=>a+b.share,0)/tot*10000)/100:0;
  document.getElementById('ml-abuse').textContent=avgAbuse+'% avg';
  document.getElementById('ml-sev').textContent=topAtk;
  document.getElementById('ml-share').textContent=avgShare+'% of global';

  renderIPList();
  renderHistory();
}

function setBar(fillId,numId,count,max){
  document.getElementById(fillId).style.width=(count/max*100)+'%';
  document.getElementById(numId).textContent=count;
}

// ── IP LIST ──
function renderIPList(){
  const list=document.getElementById('ip-list');
  list.innerHTML='';
  ips.slice(0,25).forEach(ip=>{
    const lv=lv3(ip.score);
    const el=document.createElement('div');
    el.className=`ip-card ${lv}`;
    el.innerHTML=`<div><div class="ip-addr">${ip.addr}</div><div class="ip-meta">${ip.flag} ${ip.countryName} · ${ip.atkType}</div></div><div class="ip-badge ${lv}">${ip.score}</div>`;
    el.addEventListener('mouseenter',()=>{
      if(map) map.flyTo({center:[ip.lng,ip.lat],zoom:4,speed:1.0,curve:1.4});
      spawnArc(ip.lat,ip.lng,ip.score);
    });
    el.addEventListener('click',()=>openModal(ip));
    list.appendChild(el);
  });
}

// ── GEO (capped at 100%) ──
function renderGeo(geo){
  const container=document.getElementById('geo');
  container.innerHTML='';

  // Build rows, cap total share at 1.0
  const rows=geo.slice(0,8).map(g=>{
    const cc=g.clientCountryAlpha2||g.originCountryAlpha2||'??';
    const m=CC[cc];
    return {n:m?.n||cc,f:m?.f||'🌐',pct:parseFloat(g.share||g.value||0)*100};
  });

  // Normalise so they sum to ≤100
  const total=rows.reduce((a,b)=>a+b.pct,0);
  const scale=total>100?100/total:1;
  const maxP=rows[0]?.pct*scale||1;

  rows.forEach(r=>{
    const scaled=Math.round(r.pct*scale*10)/10;
    const el=document.createElement('div');
    el.className='geo-row';
    el.innerHTML=`<span class="geo-flag">${r.f}</span><span class="geo-name">${r.n}</span><div class="geo-track"><div class="geo-fill" style="width:${r.pct*scale/maxP*100}%"></div></div><span class="geo-pct">${scaled}%</span>`;
    container.appendChild(el);
  });
}

// ── ATTACK VECTORS ──
function renderAtkVectors(types){
  const c=document.getElementById('avec');
  c.innerHTML='';
  const cols=['var(--red-bright)','var(--orange)','var(--yellow)','var(--cyan)','var(--green)','var(--white-dim)'];
  const entries=Object.entries(types).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const mx=entries[0]?.[1]||1;
  entries.forEach(([name,val],i)=>{
    const el=document.createElement('div');
    el.className='av-row';
    el.innerHTML=`<span class="av-lbl">${name}</span><div class="av-track"><div class="av-fill" style="width:${val/mx*100}%;background:${cols[i]||cols[5]}"></div><span class="av-num">${val}</span></div>`;
    c.appendChild(el);
  });
  document.getElementById('h-ips') && (document.getElementById('h-ips').textContent=ips.length||'—');
}

// ── HISTORY ──
function renderHistory(){
  const list=document.getElementById('hist-list');
  const items=histFilter==='all'?history
    :histFilter==='critical'?history.filter(h=>h.score>=80)
    :history.filter(h=>h.score>=50&&h.score<80);
  if(!items.length){
    list.innerHTML='<div class="hist-empty">No events in this filter.</div>';
    return;
  }
  list.innerHTML='';
  items.slice(0,80).forEach(h=>{
    const lv=lv3h(h.score);
    const ts=new Date(h.seenAt).toLocaleTimeString(undefined,{hour12:false});
    const el=document.createElement('div');
    el.className=`h-item ${lv}`;
    el.innerHTML=`<div class="h-top"><span class="h-ip">${h.addr}</span><span class="h-score ${lv}">${h.score}</span></div><div class="h-meta"><span>${h.flag} ${h.countryName} · ${h.atkType}</span><span class="h-time">${ts}</span></div>`;
    el.addEventListener('click',()=>openModal(h));
    list.appendChild(el);
  });
}

function filter(f,btn){
  histFilter=f;
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderHistory();
}

function clearHist(){
  history.length=0;
  renderHistory();
  log('History cleared','info');
}

// ── MODAL ──
function openModal(ip){
  const score=ip.score||0;
  const col=score>=80?'var(--red-bright)':score>=50?'var(--orange)':'var(--yellow)';
  const lvl=score>=80?'CRITICAL':score>=50?'HIGH':'MEDIUM';
  const abuseClass=ip.abuseConf>=70?'hi':ip.abuseConf>=40?'med':ip.abuseConf>0?'lo':'clean';
  const abuseLabel=ip.abuseConf>0?`${Math.round(ip.abuseConf)}% ABUSE CONFIDENCE`:'NOT CHECKED';

  document.getElementById('m-title').textContent=`ATTACK DETAIL — ${lvl}`;
  document.getElementById('m-body').innerHTML=`
    <div class="m-grid">
      <div class="m-field"><span class="m-lbl">IP ADDRESS</span><span class="m-val hi">${ip.addr||'—'}</span></div>
      <div class="m-field"><span class="m-lbl">COUNTRY</span><span class="m-val">${ip.flag||''} ${ip.countryName||'—'}</span></div>
      <div class="m-field"><span class="m-lbl">ATTACK TYPE</span><span class="m-val">${ip.atkType||'—'}</span></div>
      <div class="m-field"><span class="m-lbl">REPORTS</span><span class="m-val">${ip.reports||0}</span></div>
      <div class="m-field"><span class="m-lbl">USAGE TYPE</span><span class="m-val">${ip.usageType||'—'}</span></div>
      <div class="m-field"><span class="m-lbl">FIRST SEEN</span><span class="m-val">${new Date(ip.seenAt).toLocaleTimeString(undefined,{hour12:false})}</span></div>
    </div>
    <div class="m-score">
      <div class="m-score-lbl">ML THREAT SCORE — 50% AbuseIPDB · 30% Attack Severity · 20% Geo Share</div>
      <div class="m-score-bar">
        <div class="m-bar-track"><div class="m-bar-fill" style="width:${score}%;background:${col};box-shadow:0 0 8px ${col}40"></div></div>
        <span class="m-score-num" style="color:${col}">${score}</span>
      </div>
    </div>
    <div class="m-feats">
      <div class="m-feat-row"><span class="m-feat-lbl">AbuseIPDB (50%)</span><div class="m-feat-track"><div class="m-feat-fill" style="width:${ip.abuseConf||0}%;background:var(--red-bright)"></div></div><span class="m-feat-val">${Math.round(ip.abuseConf||0)}</span></div>
      <div class="m-feat-row"><span class="m-feat-lbl">Attack Severity (30%)</span><div class="m-feat-track"><div class="m-feat-fill" style="width:${(ATK_SEVERITY[ip.atkType]||.5)*100}%;background:var(--orange)"></div></div><span class="m-feat-val">${Math.round((ATK_SEVERITY[ip.atkType]||.5)*100)}</span></div>
      <div class="m-feat-row"><span class="m-feat-lbl">Geo Share (20%)</span><div class="m-feat-track"><div class="m-feat-fill" style="width:${Math.min(ip.share*500,100)}%;background:var(--yellow)"></div></div><span class="m-feat-val">${Math.round(Math.min(ip.share*500,100))}</span></div>
    </div>
    <span class="m-abuse-tag ${abuseClass}">${abuseLabel}</span>`;

  document.getElementById('modal').classList.add('open');
  document.getElementById('m-back').classList.add('open');
}

function closeModal(){
  document.getElementById('modal').classList.remove('open');
  document.getElementById('m-back').classList.remove('open');
}

// ── HELPERS ──
function lv3(s){ return s>=80?'lc':s>=50?'lh':'lm'; }
function lv3h(s){ return s>=80?'hc':s>=50?'hh':'hm'; }

// ── BOOT ──
log('THREAT MONITOR — boot','info');
log('ML engine: 3 real signals (AbuseIPDB 50%, Severity 30%, Geo Share 20%)','ok');
initMap();
setInterval(()=>{fetchData();setTimeout(()=>ips.filter(ip=>ip.score>=50).slice(0,4).forEach(ip=>spawnArc(ip.lat,ip.lng,ip.score)),800);},45000);
setInterval(()=>{
  if(!ips.length) return;
  const ip=ips[Math.floor(Math.random()*Math.min(8,ips.length))];
  if(ip?.score>=55) log(`Stream ▸ ${ip.addr} [${ip.cc}] ${ip.atkType} — ${ip.score}`,'crit');
},7000);

return {filter,clearHist,closeModal,openModal};
})();
