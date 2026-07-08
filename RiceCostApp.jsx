// RiceCostApp.jsx — Bilingual Rice Cost Manager (TH / EN)
const { useState, useMemo, useEffect } = window.React;
const { fmt, DonutChart, BarChart, StatCard, InputGroup, TextInput, NumberInput, SelectInput, RadioGroup, Toggle, Btn, Card } = window;
const { STRINGS, toLocalDate } = window;

// ─── Theme palette ─────────────────────────────────────────────────────────
const THEMES = {
  green: { primary:'#16A34A', dark:'#14532D', navActive:'#16A34A', headerA:'#14532D', headerB:'#22C55E' },
  earth: { primary:'#B45309', dark:'#78350F', navActive:'#D97706', headerA:'#78350F', headerB:'#F59E0B' },
  blue:  { primary:'#1D4ED8', dark:'#1E3A8A', navActive:'#3B82F6', headerA:'#1E3A8A', headerB:'#60A5FA' },
};

// ─── Cost categories (icon + color; name via t()) ──────────────────────────
const COST_CATS = [
  { key:'seed',        icon:'🌾', color:'#4ADE80' },
  { key:'chemFert',    icon:'🧪', color:'#60A5FA' },
  { key:'organicFert', icon:'🌿', color:'#34D399' },
  { key:'pesticide',   icon:'🛡️', color:'#F87171' },
  { key:'labor',       icon:'👨‍🌾', color:'#FBBF24' },
  { key:'machinery',   icon:'🚜', color:'#A78BFA' },
  { key:'landRent',    icon:'🏡', color:'#FB923C' },
  { key:'fuel',        icon:'⛽', color:'#F43F5E' },
  { key:'water',       icon:'💧', color:'#38BDF8' },
  { key:'transport',   icon:'🚛', color:'#818CF8' },
  { key:'drying',      icon:'☀️', color:'#FDE68A' },
  { key:'other',       icon:'📦', color:'#94A3B8' },
];
const ADV_CATS = [
  { key:'familyLabor', icon:'👨‍👩‍👧', color:'#FCA5A5' },
  { key:'opportunity', icon:'🏠',    color:'#C4B5FD' },
  { key:'interest',    icon:'🏦',    color:'#93C5FD' },
  { key:'maintenance', icon:'🔧',    color:'#6EE7B7' },
];
const ALL_CAT_MAP = Object.fromEntries([...COST_CATS, ...ADV_CATS].map(c => [c.key, c]));
const REVENUE_CATS = [
  { key:'rice',  icon:'🌾', color:'#22C55E' },
  { key:'straw', icon:'🌿', color:'#84CC16' },
  { key:'other', icon:'💼', color:'#38BDF8' },
];
const REVENUE_CAT_MAP = Object.fromEntries(REVENUE_CATS.map(c => [c.key, c]));

// ─── Initial data ──────────────────────────────────────────────────────────
const INIT_FARM = {
  name:'นาข้าวหมู่บ้านท่าช้าง', province:'สุพรรณบุรี', district:'บางปลาม้า',
  season:'wet', variety:'hommali', method:'transplant', area:20, expectedYield:500,
};
const INIT_ENTRIES = [
  { id:1,  date:'2024-11-01', category:'seed',        name:'เมล็ดพันธุ์ข้าวหอมมะลิ',  amount:2400  },
  { id:2,  date:'2024-11-03', category:'landRent',    name:'ค่าเช่าที่นา 20 ไร่',      amount:30000 },
  { id:3,  date:'2024-11-05', category:'chemFert',    name:'ปุ๋ยยูเรีย 46-0-0',        amount:8500  },
  { id:4,  date:'2024-11-05', category:'chemFert',    name:'ปุ๋ยสูตร 16-20-0',         amount:5100  },
  { id:5,  date:'2024-11-08', category:'organicFert', name:'ปุ๋ยหมัก 5 กระสอบ',        amount:4000  },
  { id:6,  date:'2024-11-12', category:'machinery',   name:'ค่าไถนา',                  amount:8000  },
  { id:7,  date:'2024-11-15', category:'pesticide',   name:'ยากำจัดวัชพืช',            amount:3500  },
  { id:8,  date:'2024-11-20', category:'labor',       name:'ค่าแรงดำนา',               amount:8000  },
  { id:9,  date:'2024-11-20', category:'labor',       name:'ค่าแรงพ่นยา',              amount:8000  },
  { id:10, date:'2024-11-25', category:'water',       name:'ค่าสูบน้ำ',                amount:3000  },
  { id:11, date:'2024-12-10', category:'pesticide',   name:'ยาฆ่าแมลง รอบ 2',         amount:3500  },
  { id:12, date:'2024-12-20', category:'fuel',        name:'ค่าน้ำมันเชื้อเพลิง',      amount:1600  },
  { id:13, date:'2025-01-15', category:'machinery',   name:'ค่าเกี่ยวข้าว',            amount:16000 },
  { id:14, date:'2025-01-15', category:'drying',      name:'ค่าลดความชื้นข้าว',        amount:3600  },
  { id:15, date:'2025-01-16', category:'transport',   name:'ค่าขนส่งข้าว',             amount:2400  },
  { id:16, date:'2025-01-16', category:'other',       name:'อื่นๆ',                   amount:2000  },
];
const INIT_REVENUE = {
  yieldPerRai:500, price:14.5, deduction:0,
  straw:{ mode:'bale', balesPerRai:12, pricePerBale:40, lumpsum:0 },
  other:0,
  entries:[
    { id:1, date:'2025-01-16', category:'rice',  name:'ขายข้าวเปลือก', amount:145000 },
    { id:2, date:'2025-01-16', category:'straw', name:'ขายฟางข้าว', amount:9600 },
  ],
};
const INIT_HISTORY = [
  { id:1, name:'นาปี 2566',   area:20, profit:39700,  profitPerRai:1985,  totalCost:110000, totalRevenue:149700, date:'15/11/2566' },
  { id:2, name:'นาปรัง 2567', area:20, profit:23000,  profitPerRai:1150,  totalCost:98000,  totalRevenue:121000, date:'20/4/2567'  },
  { id:3, name:'นาปี 2565',   area:18, profit:-5400,  profitPerRai:-300,  totalCost:97200,  totalRevenue:91800,  date:'10/11/2565' },
];

const STORAGE_KEY = 'ricecost_v1';
const SEED_STATE = {
  farm: INIT_FARM,
  costEntries: INIT_ENTRIES,
  revenue: INIT_REVENUE,
  history: INIT_HISTORY,
  tweaks: TWEAK_DEFAULTS,
};

function getLegacyRevenueEntries(revenue) {
  const area = INIT_FARM.area || 1;
  const riceRev = area * (revenue?.yieldPerRai || 0) * (revenue?.price || 0) * (1 - (revenue?.deduction || 0) / 100);
  let strawRev = 0;
  if (revenue?.straw?.mode === 'bale') strawRev = (revenue.straw.balesPerRai || 0) * area * (revenue.straw.pricePerBale || 0);
  if (revenue?.straw?.mode === 'lumpsum') strawRev = revenue.straw.lumpsum || 0;
  const otherRev = revenue?.other || 0;
  return [
    riceRev > 0 && { id:1, date:'2025-01-16', category:'rice', name:'ขายข้าวเปลือก', amount:riceRev },
    strawRev > 0 && { id:2, date:'2025-01-16', category:'straw', name:'ขายฟางข้าว', amount:strawRev },
    otherRev > 0 && { id:3, date:'2025-01-16', category:'other', name:'รายได้อื่นๆ', amount:otherRev },
  ].filter(Boolean);
}

function normalizeRevenue(revenue) {
  const base = { ...INIT_REVENUE, ...(revenue || {}) };
  return {
    ...base,
    straw: { ...INIT_REVENUE.straw, ...(base.straw || {}) },
    entries: Array.isArray(base.entries) ? base.entries : getLegacyRevenueEntries(base),
  };
}

function loadPersistedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_STATE;
    const parsed = JSON.parse(raw);
    return {
      farm: parsed?.farm || INIT_FARM,
      costEntries: Array.isArray(parsed?.costEntries) ? parsed.costEntries : INIT_ENTRIES,
      revenue: normalizeRevenue(parsed?.revenue),
      history: Array.isArray(parsed?.history) ? parsed.history : INIT_HISTORY,
      tweaks: parsed?.tweaks || TWEAK_DEFAULTS,
    };
  } catch (err) {
    console.warn('RiceCost localStorage data is invalid; falling back to seed data.', err);
    return SEED_STATE;
  }
}

function savePersistedState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Unable to persist RiceCost state.', err);
  }
}

function excelEscape(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function exportExcelFile(filename, title, sections) {
  const sectionHtml = sections.map(section => `
    <h2>${excelEscape(section.title)}</h2>
    <table>
      <thead><tr>${section.headers.map(h => `<th>${excelEscape(h)}</th>`).join('')}</tr></thead>
      <tbody>${section.rows.map(row => `<tr>${row.map(cell => `<td>${excelEscape(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
  `).join('');
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Sarabun, Arial, sans-serif; }
    h1 { color: #14532D; }
    h2 { color: #166534; margin-top: 24px; }
    table { border-collapse: collapse; margin-bottom: 16px; }
    th, td { border: 1px solid #C8D5C0; padding: 8px 10px; }
    th { background: #DCFCE7; font-weight: 700; }
    td.number { mso-number-format:"0.00"; }
  </style>
</head>
<body>
  <h1>${excelEscape(title)}</h1>
  ${sectionHtml}
</body>
</html>`;
  const blob = new Blob(['\ufeff', html], { type:'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.xls') ? filename : `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── Calculation engine ────────────────────────────────────────────────────
function calcTotals(farm, entries, revenue) {
  const area = farm.area || 1;
  const totalCost = entries.reduce((s,e) => s + (e.amount||0), 0);
  const costPerRai = totalCost / area;
  const revenueEntries = Array.isArray(revenue.entries) ? revenue.entries : [];
  const riceRev = revenueEntries.filter(e=>e.category==='rice').reduce((s,e)=>s+(e.amount||0),0);
  const strawRev = revenueEntries.filter(e=>e.category==='straw').reduce((s,e)=>s+(e.amount||0),0);
  const otherRev = revenueEntries.filter(e=>e.category==='other').reduce((s,e)=>s+(e.amount||0),0);
  const totalRevenue = riceRev + strawRev + otherRev;
  const profit = totalRevenue - totalCost;
  const profitPerRai = profit / area;
  const costPerKg = revenue.yieldPerRai > 0 ? costPerRai / revenue.yieldPerRai : 0;
  const chartData = COST_CATS.map(c => ({
    key: c.key, color: c.color,
    value: entries.filter(e=>e.category===c.key).reduce((s,e)=>s+(e.amount||0),0),
  })).filter(d=>d.value>0);
  return { totalCost, costPerRai, riceRev, strawRev, totalRevenue, profit, profitPerRai, costPerKg, breakeven:costPerKg, chartData };
}

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

// ─── Status bar with TH|EN toggle ─────────────────────────────────────────
function StatusBar({ theme, lang, onToggleLang }) {
  return (
    <div style={{ background:theme.dark, color:'white', flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px 10px', fontSize:13, fontWeight:700 }}>
      <span>9:41</span>
      <div onClick={onToggleLang}
        style={{ background:'rgba(255,255,255,0.18)', borderRadius:20, padding:'4px 12px', cursor:'pointer', display:'flex', gap:8, alignItems:'center', userSelect:'none' }}>
        <span style={{ fontSize:12, fontWeight:800, opacity:lang==='th'?1:0.4, transition:'opacity 0.2s' }}>TH</span>
        <span style={{ fontSize:10, opacity:0.5 }}>|</span>
        <span style={{ fontSize:12, fontWeight:800, opacity:lang==='en'?1:0.4, transition:'opacity 0.2s' }}>EN</span>
      </div>
      <span style={{ fontSize:12 }}>●●●● WiFi 🔋</span>
    </div>
  );
}

// ─── Bottom nav ────────────────────────────────────────────────────────────
function BottomNav({ screen, setScreen, theme, lang }) {
  const T = STRINGS[lang] || STRINGS.th;
  const tabs = [
    { id:'dashboard', icon:'🏠', lk:'nav_home'    },
    { id:'farm',      icon:'🌾', lk:'nav_farm'    },
    { id:'costs',     icon:'💰', lk:'nav_costs'   },
    { id:'revenue',   icon:'📈', lk:'nav_revenue' },
    { id:'summary',   icon:'📊', lk:'nav_summary' },
  ];
  return (
    <div style={{ background:'white', borderTop:'1px solid #EBEBDF', display:'flex', padding:'8px 0 20px', flexShrink:0, boxShadow:'0 -2px 16px rgba(0,0,0,0.07)' }}>
      {tabs.map(tab => {
        const active = screen===tab.id;
        return (
          <div key={tab.id} onClick={()=>setScreen(tab.id)}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'6px 2px', cursor:'pointer' }}
            onMouseDown={e=>e.currentTarget.style.transform='scale(0.85)'}
            onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
            <div style={{ fontSize:22, lineHeight:1 }}>{tab.icon}</div>
            <div style={{ fontSize:10, fontWeight:700, color:active?theme.navActive:'#9B9585' }}>{T[tab.lk]}</div>
            {active && <div style={{ width:18, height:3, borderRadius:2, background:theme.navActive }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SCREEN: DASHBOARD
// ═══════════════════════════════════════════════════════
function DashboardScreen({ farm, totals, setScreen, theme, lang }) {
  const T = STRINGS[lang] || STRINGS.th;
  const t = k => T[k] || k;
  const { totalCost, totalRevenue, profit, profitPerRai, costPerKg, breakeven, chartData } = totals;
  const isP = profit>=0;
  const pColor = isP?'#15803D':'#DC2626';
  const pBg    = isP?'#F0FDF4':'#FEF2F2';
  const pBdr   = isP?'#BBF7D0':'#FECACA';

  // Translate chart data names
  const namedChart = chartData.map(d => ({ ...d, name: t('cat_'+d.key) }));

  return (
    <div>
      <div style={{ background:`linear-gradient(145deg,${theme.headerA},${theme.headerB})`, padding:'22px 20px 34px', color:'white' }}>
        <div style={{ fontSize:12, opacity:0.72, marginBottom:4 }}>🌾 {t('dash_season')} · {t(farm.season)}</div>
        <div style={{ fontSize:22, fontWeight:800, lineHeight:1.2 }}>{farm.name}</div>
        <div style={{ fontSize:13, opacity:0.72, marginTop:3 }}>{farm.province} · {farm.area} {t('unit_rai')}</div>
      </div>

      {/* Hero profit */}
      <div style={{ margin:'-22px 16px 0' }}>
        <div style={{ background:'white', borderRadius:20, padding:18, boxShadow:'0 8px 28px rgba(0,0,0,0.14)' }}>
          <div style={{ background:pBg, borderRadius:14, padding:'14px 16px', border:`1.5px solid ${pBdr}` }}>
            <div style={{ fontSize:13, color:pColor, fontWeight:700, marginBottom:4 }}>{isP?t('dash_profit'):t('dash_loss')}</div>
            <div className="pop" style={{ fontSize:38, fontWeight:800, color:pColor, lineHeight:1 }}>
              {isP?'+':''}{fmt(profit)} <span style={{ fontSize:15, fontWeight:500 }}>{t('unit_baht')}</span>
            </div>
            <div style={{ display:'flex', gap:20, marginTop:12 }}>
              {[
                { l:t('dash_per_rai'),      v:`${fmt(profitPerRai)} ${t('unit_baht')}`, c:pColor },
                { l:t('dash_cost_per_kg'),  v:`${costPerKg.toFixed(2)} ${t('unit_baht')}`, c:'#F97316' },
                { l:t('dash_sell_price'),   v:`${INIT_REVENUE.price} ${t('unit_baht_kg')}`, c:'#44403C' },
              ].map((x,i)=>(
                <div key={i}><div style={{fontSize:11,color:'#9B9585'}}>{x.l}</div><div style={{fontSize:14,fontWeight:700,color:x.c}}>{x.v}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI cards */}
      <div style={{ padding:'14px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <StatCard label={t('dash_total_cost')}   value={`฿${fmt(totalCost)}`}              sub={`${fmt(totals.costPerRai)} ${t('unit_baht_rai')}`}  color="#F97316" bg="#FFF7ED"/>
        <StatCard label={t('dash_total_rev')}    value={`฿${fmt(totalRevenue)}`}            sub={`${fmt(totalRevenue/farm.area)} ${t('unit_baht_rai')}`} color="#16A34A" bg="#F0FDF4"/>
        <StatCard label={t('dash_cost_kg')}      value={`${costPerKg.toFixed(2)} ${t('unit_baht')}`} sub={t('dash_cost_kg_sub')}  color="#9333EA" bg="#FAF5FF"/>
        <StatCard label={t('dash_breakeven')}    value={`${breakeven.toFixed(2)} ${t('unit_baht_kg')}`} sub={t('dash_breakeven_sub')} color="#D97706" bg="#FFFBEB"/>
      </div>

      {/* Donut chart */}
      <div style={{ padding:'12px 16px 0' }}>
        <Card>
          <div style={{ fontSize:15, fontWeight:700, color:'#1C1917', marginBottom:14 }}>{t('dash_chart_title')}</div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <DonutChart data={namedChart} size={148} centerLabel={t('dash_donut_center')} centerUnit={t('dash_donut_unit')} noDataText={t('dash_no_data')}/>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:7 }}>
              {namedChart.slice(0,7).map((d,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:9, height:9, borderRadius:3, background:d.color, flexShrink:0 }}/>
                  <div style={{ fontSize:12, color:'#44403C', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#1C1917' }}>{fmt(d.value)}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div style={{ padding:'0 16px 28px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[
          { id:'costs',   icon:'💰', lk:'dash_link_cost', color:'#F97316', bg:'#FFF7ED', border:'#FED7AA' },
          { id:'revenue', icon:'📈', lk:'dash_link_rev',  color:'#16A34A', bg:'#F0FDF4', border:'#BBF7D0' },
          { id:'farm',    icon:'🌾', lk:'dash_link_farm', color:'#9333EA', bg:'#FAF5FF', border:'#DDD6FE' },
          { id:'summary', icon:'📊', lk:'dash_link_pl',   color:'#D97706', bg:'#FFFBEB', border:'#FDE68A' },
        ].map(a=>(
          <div key={a.id} onClick={()=>setScreen(a.id)}
            style={{ background:a.bg, borderRadius:14, padding:'14px', cursor:'pointer', border:`1.5px solid ${a.border}` }}>
            <div style={{ fontSize:22, marginBottom:5 }}>{a.icon}</div>
            <div style={{ fontSize:13, fontWeight:700, color:a.color }}>{t(a.lk)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SCREEN: FARM INFO
// ═══════════════════════════════════════════════════════
function FarmInfoScreen({ farm, setFarm, setScreen, theme, lang }) {
  const T = STRINGS[lang] || STRINGS.th;
  const t = k => T[k] || k;
  const upd = (k,v) => setFarm(p=>({...p,[k]:v}));
  return (
    <div>
      <div style={{ background:`linear-gradient(145deg,${theme.headerA},${theme.headerB})`, padding:'22px 20px 28px', color:'white' }}>
        <div style={{ fontSize:22, fontWeight:800 }}>{t('farm_title')}</div>
        <div style={{ fontSize:14, opacity:0.75, marginTop:4 }}>{t('farm_sub')}</div>
      </div>
      <div style={{ padding:16 }}>
        <Card>
          <InputGroup label={t('farm_name')}>
            <TextInput value={farm.name} onChange={v=>upd('name',v)} placeholder={t('farm_name_ph')}/>
          </InputGroup>
          <InputGroup label={t('farm_province')}>
            <TextInput value={farm.province} onChange={v=>upd('province',v)} placeholder={t('farm_province_ph')}/>
          </InputGroup>
          <InputGroup label={t('farm_district')}>
            <TextInput value={farm.district} onChange={v=>upd('district',v)} placeholder={t('farm_district_ph')}/>
          </InputGroup>
        </Card>
        <Card>
          <InputGroup label={t('farm_season_lbl')}>
            <RadioGroup value={farm.season} onChange={v=>upd('season',v)} options={[
              {value:'wet', label:t('wet_icon')},
              {value:'dry', label:t('dry_icon')},
            ]}/>
          </InputGroup>
          <InputGroup label={t('farm_variety')}>
            <SelectInput value={farm.variety} onChange={v=>upd('variety',v)} options={[
              {value:'hommali',     label:t('var_hommali')},
              {value:'pathumthani', label:t('var_pathumthani')},
              {value:'chainat',     label:t('var_chainat')},
              {value:'riceberry',   label:t('var_riceberry')},
              {value:'other',       label:t('var_other')},
            ]}/>
          </InputGroup>
          <InputGroup label={t('farm_method')}>
            <RadioGroup value={farm.method} onChange={v=>upd('method',v)} options={[
              {value:'broadcast', label:t('method_broadcast')},
              {value:'transplant',label:t('method_transplant')},
              {value:'direct',    label:t('method_direct')},
            ]}/>
          </InputGroup>
        </Card>
        <Card>
          <InputGroup label={t('farm_area')} hint={t('farm_area_hint')}>
            <NumberInput value={farm.area} onChange={v=>upd('area',parseFloat(v)||0)} unit={t('unit_rai')}/>
          </InputGroup>
          <InputGroup label={t('farm_yield')} hint={t('farm_yield_hint')}>
            <NumberInput value={farm.expectedYield} onChange={v=>upd('expectedYield',parseFloat(v)||0)} unit={t('unit_kg_rai')}/>
          </InputGroup>
        </Card>
        <Btn onClick={()=>setScreen('costs')}>{t('farm_next')}</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SCREEN: COST INPUT
// ═══════════════════════════════════════════════════════
function CostInputScreen({ costEntries, setCostEntries, farm, setScreen, theme, lang }) {
  const T = STRINGS[lang] || STRINGS.th;
  const t = k => T[k] || k;
  const [showForm, setShowForm] = useState(false);
  const [groupBy, setGroupBy]   = useState('date');
  const [newEntry, setNewEntry] = useState({ date:todayISO(), category:'seed', name:'', amount:'' });
  const area = farm.area || 1;
  const totalCost  = costEntries.reduce((s,e)=>s+(e.amount||0),0);
  const costPerRai = totalCost / area;

  const addEntry = () => {
    const num = parseFloat(newEntry.amount);
    if (!num || num<=0) return;
    setCostEntries(p=>[...p,{id:Date.now(),...newEntry,amount:num}]);
    setNewEntry(p=>({...p,name:'',amount:''}));
    setShowForm(false);
  };
  const delEntry = id => setCostEntries(p=>p.filter(e=>e.id!==id));

  const sorted = [...costEntries].sort((a,b)=>b.date.localeCompare(a.date));
  let groups = [];
  if (groupBy==='date') {
    const byDate = {};
    sorted.forEach(e=>{if(!byDate[e.date])byDate[e.date]=[];byDate[e.date].push(e);});
    groups = Object.entries(byDate).map(([date,entries])=>({key:date,label:toLocalDate(date,lang),entries,total:entries.reduce((s,e)=>s+e.amount,0)}));
  } else {
    const byCat = {};
    sorted.forEach(e=>{
      const c = ALL_CAT_MAP[e.category]||{key:e.category,icon:'📦',color:'#94A3B8'};
      if(!byCat[e.category]) byCat[e.category]={...c,entries:[]};
      byCat[e.category].entries.push(e);
    });
    groups = Object.values(byCat).map(g=>({key:g.key,label:`${g.icon} ${t('cat_'+g.key)}`,entries:g.entries,total:g.entries.reduce((s,e)=>s+e.amount,0)}));
  }

  const catOptions = [
    ...COST_CATS.map(c=>({value:c.key,label:`${c.icon} ${t('cat_'+c.key)}`})),
    ...ADV_CATS.map(c=>({value:c.key,label:`${c.icon} ${t('cat_'+c.key)}`})),
  ];
  const exportCosts = () => {
    const rows = sorted.map(e => [
      toLocalDate(e.date, lang),
      t('cat_'+e.category),
      e.name || t('cat_'+e.category),
      e.amount || 0,
      ((e.amount || 0) / area).toFixed(2),
    ]);
    exportExcelFile('rice-costs.xls', t('costs_export_title'), [
      {
        title: t('costs_export_summary'),
        headers: [t('export_metric'), t('export_value')],
        rows: [
          [t('costs_total_lbl'), totalCost],
          [t('costs_per_rai_lbl'), costPerRai.toFixed(2)],
          [t('costs_entries'), costEntries.length],
        ],
      },
      {
        title: t('costs_title'),
        headers: [t('export_date'), t('export_category'), t('export_name'), t('export_amount'), t('export_per_rai')],
        rows,
      },
    ]);
  };

  return (
    <div>
      <div style={{ background:'linear-gradient(145deg,#92400E,#F59E0B)', padding:'22px 20px 28px', color:'white' }}>
        <div style={{ fontSize:22, fontWeight:800 }}>{t('costs_title')}</div>
        <div style={{ fontSize:14, opacity:0.75, marginTop:4 }}>{t('costs_sub')}</div>
        <div style={{ marginTop:14, background:'rgba(255,255,255,0.18)', borderRadius:14, padding:'13px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, opacity:0.8 }}>{t('costs_total_lbl')}</div>
            <div style={{ fontSize:26, fontWeight:800 }}>฿{fmt(totalCost)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, opacity:0.8 }}>{t('costs_per_rai_lbl')} (÷{area} {t('unit_rai')})</div>
            <div style={{ fontSize:26, fontWeight:800 }}>฿{fmt(costPerRai)}</div>
          </div>
        </div>
      </div>

      <div style={{ padding:'14px 16px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ fontSize:13, color:'#9B9585', fontWeight:600 }}>{costEntries.length} {t('costs_entries')}</div>
          <div style={{ width:172 }}>
            <Toggle options={[{value:'date',label:t('costs_by_date')},{value:'category',label:t('costs_by_cat')}]} value={groupBy} onChange={setGroupBy}/>
          </div>
        </div>
        <Btn onClick={exportCosts} variant="secondary" disabled={!costEntries.length} style={{ marginBottom:12 }}>{t('export_costs')}</Btn>

        {groups.length===0 && (
          <div style={{ textAlign:'center', padding:'40px 20px', color:'#9B9585' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📝</div>
            <div style={{ fontSize:15, fontWeight:600 }}>{t('costs_empty_title')}</div>
            <div style={{ fontSize:13, marginTop:4 }}>{t('costs_empty_sub')}</div>
          </div>
        )}

        {groups.map(group=>(
          <div key={group.key} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7, padding:'0 2px' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#44403C' }}>{group.label}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#F97316' }}>฿{fmt(group.total)}</div>
            </div>
            {group.entries.map(entry=>{
              const cat = ALL_CAT_MAP[entry.category]||{icon:'📦',color:'#94A3B8'};
              return (
                <div key={entry.id} style={{ background:'white', borderRadius:12, padding:'12px 14px', marginBottom:6, display:'flex', alignItems:'center', gap:10, boxShadow:'0 1px 4px rgba(0,0,0,0.055)' }}>
                  <div style={{ width:36,height:36,borderRadius:10,flexShrink:0,background:(cat.color||'#94A3B8')+'28',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17 }}>{cat.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14,fontWeight:600,color:'#1C1917',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{entry.name || t('cat_'+entry.category)}</div>
                    <div style={{ fontSize:11, color:'#9B9585' }}>{groupBy==='date'?t('cat_'+entry.category):toLocalDate(entry.date,lang)}</div>
                  </div>
                  <div style={{ fontSize:15,fontWeight:800,color:'#F97316',flexShrink:0 }}>฿{fmt(entry.amount)}</div>
                  <div onClick={()=>delEntry(entry.id)} style={{ flexShrink:0,width:28,height:28,borderRadius:8,background:'#FEF2F2',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:16,color:'#DC2626',fontWeight:700 }}>×</div>
                </div>
              );
            })}
          </div>
        ))}

        <Btn onClick={()=>setShowForm(!showForm)} variant={showForm?'ghost':'primary'} style={{ marginBottom:12 }}>
          {showForm ? t('costs_cancel') : t('costs_add')}
        </Btn>

        {showForm && (
          <div style={{ background:'white', borderRadius:18, padding:16, marginBottom:14, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', border:'1.5px solid #FED7AA' }}>
            <div style={{ fontSize:15,fontWeight:700,color:'#92400E',marginBottom:14 }}>{t('costs_form_title')}</div>
            <InputGroup label={t('costs_date_lbl')}>
              <input type="date" value={newEntry.date}
                onChange={e=>setNewEntry(p=>({...p,date:e.target.value}))}
                style={{ width:'100%',padding:'12px 14px',fontFamily:'Sarabun,sans-serif',fontSize:16,border:'2px solid #E8E8E0',borderRadius:12,background:'white',color:'#1C1917',outline:'none',appearance:'none',WebkitAppearance:'none' }}
                onFocus={e=>e.target.style.borderColor='#F97316'}
                onBlur={e=>e.target.style.borderColor='#E8E8E0'}
              />
            </InputGroup>
            <InputGroup label={t('costs_cat_lbl')}>
              <SelectInput value={newEntry.category} onChange={v=>setNewEntry(p=>({...p,category:v}))} options={catOptions}/>
            </InputGroup>
            <InputGroup label={t('costs_name_lbl')} hint={t('costs_name_hint')}>
              <TextInput value={newEntry.name} onChange={v=>setNewEntry(p=>({...p,name:v}))} placeholder={t('costs_name_ph')}/>
            </InputGroup>
            <InputGroup label={t('costs_amount_lbl')}>
              <NumberInput value={newEntry.amount} onChange={v=>setNewEntry(p=>({...p,amount:v}))} unit={t('unit_baht')} placeholder="0"/>
            </InputGroup>
            {newEntry.amount && parseFloat(newEntry.amount)>0 && (
              <div style={{ background:'#FFF7ED',borderRadius:10,padding:'10px 12px',marginBottom:12,fontSize:13,color:'#92400E',lineHeight:1.7 }}>
                ฿{fmt(parseFloat(newEntry.amount))} ÷ {area} {t('costs_divide_suffix')} <strong style={{ fontSize:15 }}>{(parseFloat(newEntry.amount)/area).toFixed(2)} {t('unit_baht_rai')}</strong>
              </div>
            )}
            <Btn onClick={addEntry} disabled={!newEntry.amount||parseFloat(newEntry.amount)<=0}>{t('costs_save')}</Btn>
          </div>
        )}

        <div style={{ paddingBottom:28 }}>
          <Btn onClick={()=>setScreen('revenue')} variant="secondary">{t('costs_next')}</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SCREEN: REVENUE
// ═══════════════════════════════════════════════════════
function RevenueScreen({ revenue, setRevenue, farm, setScreen, theme, lang }) {
  const T = STRINGS[lang] || STRINGS.th;
  const t = k => T[k] || k;
  const [showForm, setShowForm] = useState(false);
  const [groupBy, setGroupBy] = useState('date');
  const [newEntry, setNewEntry] = useState({ date:todayISO(), category:'rice', name:'', amount:'' });
  const area = farm.area||1;
  const revenueEntries = Array.isArray(revenue.entries) ? revenue.entries : [];
  const sorted = [...revenueEntries].sort((a,b)=>b.date.localeCompare(a.date));
  const totalRev = revenueEntries.reduce((s,e)=>s+(e.amount||0),0);
  const revPerRai = totalRev / area;

  const addEntry = () => {
    const num = parseFloat(newEntry.amount);
    if (!num || num<=0) return;
    setRevenue(p=>({
      ...p,
      entries:[...(Array.isArray(p.entries) ? p.entries : []), { id:Date.now(), ...newEntry, amount:num }],
    }));
    setNewEntry(p=>({...p,name:'',amount:''}));
    setShowForm(false);
  };
  const delEntry = id => setRevenue(p=>({
    ...p,
    entries:(Array.isArray(p.entries) ? p.entries : []).filter(e=>e.id!==id),
  }));

  let groups = [];
  if (groupBy==='date') {
    const byDate = {};
    sorted.forEach(e=>{if(!byDate[e.date])byDate[e.date]=[];byDate[e.date].push(e);});
    groups = Object.entries(byDate).map(([date,entries])=>({key:date,label:toLocalDate(date,lang),entries,total:entries.reduce((s,e)=>s+e.amount,0)}));
  } else {
    const byCat = {};
    sorted.forEach(e=>{
      const c = REVENUE_CAT_MAP[e.category]||{key:e.category,icon:'💼',color:'#38BDF8'};
      if(!byCat[e.category]) byCat[e.category]={...c,entries:[]};
      byCat[e.category].entries.push(e);
    });
    groups = Object.values(byCat).map(g=>({key:g.key,label:`${g.icon} ${t('rev_cat_'+g.key)}`,entries:g.entries,total:g.entries.reduce((s,e)=>s+e.amount,0)}));
  }

  const catOptions = REVENUE_CATS.map(c=>({value:c.key,label:`${c.icon} ${t('rev_cat_'+c.key)}`}));

  return (
    <div>
      <div style={{ background:`linear-gradient(145deg,${theme.headerA},${theme.headerB})`, padding:'22px 20px 28px', color:'white' }}>
        <div style={{ fontSize:22, fontWeight:800 }}>{t('rev_title')}</div>
        <div style={{ fontSize:14, opacity:0.75, marginTop:4 }}>{t('rev_sub')}</div>
        <div style={{ marginTop:14, background:'rgba(255,255,255,0.18)', borderRadius:14, padding:'13px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, opacity:0.8 }}>{t('rev_total_lbl')}</div>
            <div style={{ fontSize:26, fontWeight:800 }}>฿{fmt(totalRev)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, opacity:0.8 }}>{t('rev_per_rai_lbl')} (÷{area} {t('unit_rai')})</div>
            <div style={{ fontSize:26, fontWeight:800 }}>฿{fmt(revPerRai)}</div>
          </div>
        </div>
      </div>
      <div style={{ padding:'14px 16px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ fontSize:13, color:'#9B9585', fontWeight:600 }}>{revenueEntries.length} {t('rev_entries')}</div>
          <div style={{ width:172 }}>
            <Toggle options={[{value:'date',label:t('costs_by_date')},{value:'category',label:t('costs_by_cat')}]} value={groupBy} onChange={setGroupBy}/>
          </div>
        </div>

        {groups.length===0 && (
          <div style={{ textAlign:'center', padding:'40px 20px', color:'#9B9585' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📈</div>
            <div style={{ fontSize:15, fontWeight:600 }}>{t('rev_empty_title')}</div>
            <div style={{ fontSize:13, marginTop:4 }}>{t('rev_empty_sub')}</div>
          </div>
        )}

        {groups.map(group=>(
          <div key={group.key} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7, padding:'0 2px' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#44403C' }}>{group.label}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#16A34A' }}>฿{fmt(group.total)}</div>
            </div>
            {group.entries.map(entry=>{
              const cat = REVENUE_CAT_MAP[entry.category]||{icon:'💼',color:'#38BDF8'};
              return (
                <div key={entry.id} style={{ background:'white', borderRadius:12, padding:'12px 14px', marginBottom:6, display:'flex', alignItems:'center', gap:10, boxShadow:'0 1px 4px rgba(0,0,0,0.055)' }}>
                  <div style={{ width:36,height:36,borderRadius:10,flexShrink:0,background:(cat.color||'#38BDF8')+'28',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17 }}>{cat.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14,fontWeight:600,color:'#1C1917',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{entry.name || t('rev_cat_'+entry.category)}</div>
                    <div style={{ fontSize:11, color:'#9B9585' }}>{groupBy==='date'?t('rev_cat_'+entry.category):toLocalDate(entry.date,lang)}</div>
                  </div>
                  <div style={{ fontSize:15,fontWeight:800,color:'#16A34A',flexShrink:0 }}>฿{fmt(entry.amount)}</div>
                  <div onClick={()=>delEntry(entry.id)} style={{ flexShrink:0,width:28,height:28,borderRadius:8,background:'#FEF2F2',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:16,color:'#DC2626',fontWeight:700 }}>×</div>
                </div>
              );
            })}
          </div>
        ))}

        <Btn onClick={()=>setShowForm(!showForm)} variant={showForm?'ghost':'primary'} style={{ marginBottom:12 }}>
          {showForm ? t('costs_cancel') : t('rev_add')}
        </Btn>

        {showForm && (
          <div style={{ background:'white', borderRadius:18, padding:16, marginBottom:14, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', border:'1.5px solid #BBF7D0' }}>
            <div style={{ fontSize:15,fontWeight:700,color:'#166534',marginBottom:14 }}>{t('rev_form_title')}</div>
            <InputGroup label={t('rev_date_lbl')}>
              <input type="date" value={newEntry.date}
                onChange={e=>setNewEntry(p=>({...p,date:e.target.value}))}
                style={{ width:'100%',padding:'12px 14px',fontFamily:'Sarabun,sans-serif',fontSize:16,border:'2px solid #E8E8E0',borderRadius:12,background:'white',color:'#1C1917',outline:'none',appearance:'none',WebkitAppearance:'none' }}
                onFocus={e=>e.target.style.borderColor='#16A34A'}
                onBlur={e=>e.target.style.borderColor='#E8E8E0'}
              />
            </InputGroup>
            <InputGroup label={t('rev_cat_lbl')}>
              <SelectInput value={newEntry.category} onChange={v=>setNewEntry(p=>({...p,category:v}))} options={catOptions}/>
            </InputGroup>
            <InputGroup label={t('rev_name_lbl')} hint={t('rev_name_hint')}>
              <TextInput value={newEntry.name} onChange={v=>setNewEntry(p=>({...p,name:v}))} placeholder={t('rev_name_ph')}/>
            </InputGroup>
            <InputGroup label={t('rev_amount_lbl')}>
              <NumberInput value={newEntry.amount} onChange={v=>setNewEntry(p=>({...p,amount:v}))} unit={t('unit_baht')} placeholder="0"/>
            </InputGroup>
            {newEntry.amount && parseFloat(newEntry.amount)>0 && (
              <div style={{ background:'#F0FDF4',borderRadius:10,padding:'10px 12px',marginBottom:12,fontSize:13,color:'#166534',lineHeight:1.7 }}>
                ฿{fmt(parseFloat(newEntry.amount))} ÷ {area} {t('costs_divide_suffix')} <strong style={{ fontSize:15 }}>{(parseFloat(newEntry.amount)/area).toFixed(2)} {t('unit_baht_rai')}</strong>
              </div>
            )}
            <Btn onClick={addEntry} disabled={!newEntry.amount||parseFloat(newEntry.amount)<=0}>{t('rev_save')}</Btn>
          </div>
        )}

        <div style={{ paddingBottom:28 }}>
          <Btn onClick={()=>setScreen('summary')} variant="secondary">{t('rev_next')}</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SCREEN: SUMMARY
// ═══════════════════════════════════════════════════════
function SummaryScreen({ farm, costEntries, revenueEntries, totals, setHistory, setScreen, theme, lang }) {
  const T = STRINGS[lang] || STRINGS.th;
  const t = k => T[k] || k;
  const { totalCost,costPerRai,totalRevenue,profit,profitPerRai,costPerKg,breakeven,riceRev,strawRev } = totals;
  const isP = profit>=0;
  const pColor = isP?'#15803D':'#DC2626';
  const area = farm.area||1;
  const [saved,setSaved] = useState(false);

  const msg = isP
    ? `${t('sum_msg_profit')} ${fmt(profitPerRai)} ${t('sum_msg_profit2')}`
    : `${t('sum_msg_loss')} ${breakeven.toFixed(2)} ${t('sum_msg_loss2')}`;

  const handleSave = () => {
    const name = lang==='en' ? `Wet Season ${new Date().getFullYear()}` : `นาปี ${new Date().getFullYear()+543}`;
    setHistory(p=>[{id:Date.now(),name,area,profit,profitPerRai,totalCost,totalRevenue,date:new Date().toLocaleDateString(lang==='en'?'en-GB':'th-TH')},...p]);
    setSaved(true);
  };
  const exportSummary = () => {
    const costRows = [...costEntries].sort((a,b)=>b.date.localeCompare(a.date)).map(e => [
      toLocalDate(e.date, lang),
      t('cat_'+e.category),
      e.name || t('cat_'+e.category),
      e.amount || 0,
    ]);
    const revenueRows = [...revenueEntries].sort((a,b)=>b.date.localeCompare(a.date)).map(e => [
      toLocalDate(e.date, lang),
      t('rev_cat_'+e.category),
      e.name || t('rev_cat_'+e.category),
      e.amount || 0,
    ]);
    exportExcelFile('rice-summary.xls', t('sum_export_title'), [
      {
        title: t('sum_title'),
        headers: [t('export_metric'), t('export_value')],
        rows: [
          [t('farm_name'), farm.name],
          [t('farm_area'), `${farm.area} ${t('unit_rai')}`],
          [t('sum_total_cost'), totalCost],
          [t('sum_total_rev'), totalRevenue],
          [isP ? t('sum_profit_lbl') : t('sum_loss_lbl'), profit],
          [t('dash_per_rai'), profitPerRai.toFixed(2)],
          [t('sum_cost_kg'), costPerKg.toFixed(2)],
          [t('sum_breakeven_card'), breakeven.toFixed(2)],
        ],
      },
      {
        title: t('costs_title'),
        headers: [t('export_date'), t('export_category'), t('export_name'), t('export_amount')],
        rows: costRows,
      },
      {
        title: t('rev_title'),
        headers: [t('export_date'), t('export_category'), t('export_name'), t('export_amount')],
        rows: revenueRows,
      },
    ]);
  };

  return (
    <div>
      <div style={{ background:isP?'linear-gradient(145deg,#14532D,#22C55E)':'linear-gradient(145deg,#7F1D1D,#EF4444)', padding:'22px 20px 34px', color:'white' }}>
        <div style={{ fontSize:22, fontWeight:800 }}>{t('sum_title')}</div>
        <div style={{ fontSize:14, opacity:0.75, marginTop:4 }}>{t('sum_sub')}</div>
      </div>
      <div style={{ margin:'-22px 16px 0' }}>
        <div style={{ background:isP?'#F0FDF4':'#FEF2F2', borderRadius:20, padding:20, boxShadow:'0 8px 28px rgba(0,0,0,0.13)', border:`1.5px solid ${isP?'#86EFAC':'#FECACA'}` }}>
          <div style={{ fontSize:13, color:pColor, fontWeight:700 }}>{isP?t('sum_profit_lbl'):t('sum_loss_lbl')}</div>
          <div className="pop" style={{ fontSize:44,fontWeight:800,color:pColor,lineHeight:1.1,marginTop:4 }}>
            {isP?'+':'-'}฿{fmt(Math.abs(profit))}
          </div>
          <div style={{ fontSize:22,fontWeight:700,color:pColor,marginTop:2 }}>
            {isP?'+':'-'}{fmt(Math.abs(profitPerRai))} {t('unit_baht_rai')}
          </div>
          <div style={{ marginTop:12,fontSize:13,color:pColor,lineHeight:1.6,background:'white',borderRadius:10,padding:'10px 12px',fontWeight:500 }}>💬 {msg}</div>
        </div>
      </div>
      <div style={{ padding:'14px 16px 0' }}>
        <div style={{ background:'#FFFBEB',border:'1.5px solid #FDE68A',borderRadius:12,padding:'12px 14px',fontSize:13,color:'#92400E',lineHeight:1.6 }}>
          {t('sum_be_prefix')} <strong>{breakeven.toFixed(2)} {t('unit_baht_kg')}</strong> {t('sum_be_suffix')}
        </div>
      </div>
      <div style={{ padding:'12px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <StatCard label={t('sum_total_cost')}    value={`฿${fmt(totalCost)}`}            sub={`${fmt(costPerRai)} ${t('unit_baht_rai')}`}  color="#F97316" bg="#FFF7ED"/>
        <StatCard label={t('sum_total_rev')}     value={`฿${fmt(totalRevenue)}`}          sub={`${fmt(totalRevenue/area)} ${t('unit_baht_rai')}`} color="#16A34A" bg="#F0FDF4"/>
        <StatCard label={t('sum_rice_rev')}      value={`฿${fmt(riceRev)}`}               sub={t('sum_rice_sub')}   color="#059669" bg="#ECFDF5"/>
        <StatCard label={t('sum_straw_rev')}     value={`฿${fmt(strawRev)}`}              sub={t('sum_straw_sub')}  color="#6D28D9" bg="#F5F3FF"/>
        <StatCard label={t('sum_cost_kg')}       value={`${costPerKg.toFixed(2)} ${t('unit_baht')}`} sub={t('sum_cost_kg_sub')} color="#7C3AED" bg="#FAF5FF"/>
        <StatCard label={t('sum_breakeven_card')} value={`${breakeven.toFixed(2)} ${t('unit_baht_kg')}`} sub={t('sum_be_sub')} color="#B45309" bg="#FFFBEB"/>
      </div>
      <div style={{ padding:'12px 16px 0' }}>
        <Card>
          <div style={{ fontSize:15,fontWeight:700,color:'#1C1917',marginBottom:14 }}>{t('sum_chart_title')}</div>
          <BarChart
            unitLabel={t('unit_baht_rai')}
            items={[
              {label:t('sum_bar_cost'), value:totalCost,         subValue:costPerRai,        color:'#F97316'},
              {label:t('sum_bar_rev'),  value:totalRevenue,       subValue:totalRevenue/area, color:'#22C55E'},
              {label:isP?t('sum_bar_profit'):t('sum_bar_loss'), value:Math.abs(profit), subValue:Math.abs(profitPerRai), color:isP?'#16A34A':'#EF4444'},
            ]}/>
        </Card>
      </div>
      <div style={{ padding:'0 16px 28px', display:'flex', flexDirection:'column', gap:10 }}>
        <Btn onClick={exportSummary} variant="secondary">{t('export_summary')}</Btn>
        {!saved
          ? <Btn onClick={handleSave}>{t('sum_save')}</Btn>
          : <div style={{ textAlign:'center',padding:'14px',background:'#F0FDF4',borderRadius:14,fontSize:15,fontWeight:700,color:'#16A34A' }}>{t('sum_saved')}</div>
        }
        <Btn onClick={()=>setScreen('history')} variant="secondary">{t('sum_compare')}</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SCREEN: HISTORY
// ═══════════════════════════════════════════════════════
function HistoryScreen({ history, theme, lang }) {
  const T = STRINGS[lang] || STRINGS.th;
  const t = k => T[k] || k;
  const best = history.length ? history.reduce((b,h)=>h.profitPerRai>b.profitPerRai?h:b,history[0]) : null;
  const maxAbs = Math.max(...history.map(h=>Math.abs(h.profitPerRai)),1);
  return (
    <div>
      <div style={{ background:`linear-gradient(145deg,${theme.headerA},${theme.headerB})`, padding:'22px 20px 28px', color:'white' }}>
        <div style={{ fontSize:22, fontWeight:800 }}>{t('hist_title')}</div>
        <div style={{ fontSize:14, opacity:0.75, marginTop:4 }}>{history.length} {t('hist_seasons_suffix')}</div>
      </div>
      <div style={{ padding:16 }}>
        {best && (
          <Card style={{ background:'#F0FDF4', border:'1.5px solid #BBF7D0', marginBottom:14 }}>
            <div style={{ fontSize:12,color:'#16A34A',fontWeight:700,marginBottom:4 }}>{t('hist_best')}</div>
            <div style={{ fontSize:18,fontWeight:800,color:'#1C1917' }}>{best.name}</div>
            <div style={{ fontSize:15,color:'#16A34A',fontWeight:700,marginTop:2 }}>+{fmt(best.profitPerRai)} {t('hist_per_rai')}</div>
          </Card>
        )}
        <div style={{ fontSize:12,color:'#9B9585',fontWeight:700,marginBottom:8,letterSpacing:0.5 }}>{t('hist_all')}</div>
        {history.map(h=>{
          const isP=h.profitPerRai>=0;
          return (
            <Card key={h.id} style={{ marginBottom:8 }}>
              <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15,fontWeight:700,color:'#1C1917' }}>{h.name}</div>
                  <div style={{ fontSize:12,color:'#9B9585',marginTop:2 }}>{h.area} {t('unit_rai')} · {h.date}</div>
                  <div style={{ marginTop:8,height:5,borderRadius:3,background:'#F0F0EA',overflow:'hidden' }}>
                    <div style={{ height:'100%',width:`${(Math.abs(h.profitPerRai)/maxAbs)*100}%`,background:isP?'#22C55E':'#EF4444',borderRadius:3 }}/>
                  </div>
                </div>
                <div style={{ textAlign:'right',flexShrink:0 }}>
                  <div style={{ fontSize:17,fontWeight:800,color:isP?'#16A34A':'#DC2626' }}>{isP?'+':''}{fmt(h.profitPerRai)}</div>
                  <div style={{ fontSize:11,color:'#9B9585' }}>{t('hist_per_rai')}</div>
                  <div style={{ fontSize:11,fontWeight:600,color:'#9B9585',marginTop:1 }}>{isP?'+':''}{fmt(h.profit)} {t('hist_total_suffix')}</div>
                </div>
              </div>
            </Card>
          );
        })}
        {history.length>1 && (
          <Card>
            <div style={{ fontSize:15,fontWeight:700,color:'#1C1917',marginBottom:14 }}>{t('hist_chart_title')}</div>
            <div style={{ display:'flex',gap:10,alignItems:'flex-end',height:110 }}>
              {history.map(h=>{
                const isP=h.profitPerRai>=0;
                const barH=Math.max(4,(Math.abs(h.profitPerRai)/maxAbs)*80);
                return (
                  <div key={h.id} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:isP?'#16A34A':'#DC2626',textAlign:'center' }}>{isP?'+':''}{fmt(h.profitPerRai)}</div>
                    <div style={{ width:'75%',height:`${barH}px`,background:isP?'#22C55E':'#EF4444',borderRadius:'5px 5px 0 0' }}/>
                    <div style={{ fontSize:10,color:'#9B9585',textAlign:'center',lineHeight:1.3 }}>{h.name}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TWEAKS PANEL
// ═══════════════════════════════════════════════════════
function TweaksPanel({ tweaks, setTweak, onClose, theme }) {
  const lang = tweaks.lang || 'th';
  const T = STRINGS[lang] || STRINGS.th;
  const t = k => T[k] || k;
  return (
    <div style={{ position:'absolute',bottom:88,right:12,width:220,background:'white',borderRadius:20,boxShadow:'0 12px 40px rgba(0,0,0,0.2)',padding:18,zIndex:999,border:'1.5px solid #E8E8E0' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
        <div style={{ fontSize:15,fontWeight:800,color:'#1C1917' }}>Tweaks</div>
        <div onClick={onClose} style={{ fontSize:18,cursor:'pointer',color:'#9B9585' }}>✕</div>
      </div>

      {/* Language */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:12,fontWeight:700,color:'#9B9585',marginBottom:8,letterSpacing:0.5 }}>{t('tweak_lang')}</div>
        <div style={{ display:'flex',gap:6 }}>
          {[{v:'th',l:'🇹🇭 ไทย'},{v:'en',l:'🇬🇧 English'}].map(l=>(
            <div key={l.v} onClick={()=>setTweak('lang',l.v)}
              style={{ flex:1,padding:'8px 4px',borderRadius:10,textAlign:'center',fontSize:12,fontWeight:700,cursor:'pointer',background:tweaks.lang===l.v?theme.primary:'#F5F5EF',color:tweaks.lang===l.v?'white':'#44403C',transition:'all 0.15s' }}>{l.l}</div>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:12,fontWeight:700,color:'#9B9585',marginBottom:8,letterSpacing:0.5 }}>{t('tweak_theme')}</div>
        <div style={{ display:'flex',gap:6 }}>
          {[{v:'green',c:'#16A34A',lk:'tweak_green'},{v:'earth',c:'#D97706',lk:'tweak_earth'},{v:'blue',c:'#1D4ED8',lk:'tweak_blue'}].map(th=>(
            <div key={th.v} onClick={()=>setTweak('theme',th.v)}
              style={{ flex:1,padding:'8px 4px',borderRadius:10,textAlign:'center',fontSize:12,fontWeight:700,cursor:'pointer',background:tweaks.theme===th.v?th.c:'#F5F5EF',color:tweaks.theme===th.v?'white':'#44403C',transition:'all 0.15s' }}>{t(th.lk)}</div>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <div style={{ fontSize:12,fontWeight:700,color:'#9B9585',marginBottom:8,letterSpacing:0.5 }}>{t('tweak_font')}</div>
        <div style={{ display:'flex',gap:6 }}>
          {[{v:'normal',lk:'tweak_normal'},{v:'large',lk:'tweak_large'}].map(f=>(
            <div key={f.v} onClick={()=>setTweak('fontSize',f.v)}
              style={{ flex:1,padding:'8px',borderRadius:10,textAlign:'center',fontSize:13,fontWeight:700,cursor:'pointer',background:tweaks.fontSize===f.v?theme.primary:'#F5F5EF',color:tweaks.fontSize===f.v?'white':'#44403C',transition:'all 0.15s' }}>{t(f.lk)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
function App() {
  const initialState = useMemo(loadPersistedState, []);
  const [screen, setScreen]           = useState('dashboard');
  const [farm, setFarm]               = useState(initialState.farm);
  const [costEntries, setCostEntries] = useState(initialState.costEntries);
  const [revenue, setRevenue]         = useState(initialState.revenue);
  const [history, setHistory]         = useState(initialState.history);
  const [tweaks, setTweaks]           = useState(initialState.tweaks);
  const [showTweaks, setShowTweaks]   = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(() =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  );

  const lang   = tweaks.lang || 'th';
  const theme  = THEMES[tweaks.theme] || THEMES.green;
  const totals = useMemo(()=>calcTotals(farm,costEntries,revenue),[farm,costEntries,revenue]);

  useEffect(()=>{
    savePersistedState({ farm, costEntries, revenue, history, tweaks });
  },[farm,costEntries,revenue,history,tweaks]);

  useEffect(()=>{
    const handler = e=>{
      if(e.data?.type==='__activate_edit_mode')   setShowTweaks(true);
      if(e.data?.type==='__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message',handler);
    window.parent.postMessage({type:'__edit_mode_available'},'*');
    return ()=>window.removeEventListener('message',handler);
  },[]);

  useEffect(()=>{
    const promptHandler = e=>{
      e.preventDefault();
      setInstallPrompt(e);
    };
    const installedHandler = ()=>{
      setInstallPrompt(null);
      setIsStandalone(true);
    };
    window.addEventListener('beforeinstallprompt', promptHandler);
    window.addEventListener('appinstalled', installedHandler);
    return ()=>{
      window.removeEventListener('beforeinstallprompt', promptHandler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  },[]);

  const setTweak = (key,val) => setTweaks(p=>{
    const next={...p,[key]:val};
    window.parent.postMessage({type:'__edit_mode_set_keys',edits:next},'*');
    return next;
  });
  const onToggleLang = () => setTweak('lang', lang==='th'?'en':'th');
  const closeTweaks = () => { setShowTweaks(false); window.parent.postMessage({type:'__edit_mode_dismissed'},'*'); };
  const promptInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice?.outcome !== 'dismissed') setInstallPrompt(null);
  };

  const shared = { theme, lang };
  const SCREENS = {
    dashboard: <DashboardScreen  farm={farm} totals={totals} setScreen={setScreen} {...shared}/>,
    farm:      <FarmInfoScreen   farm={farm} setFarm={setFarm} setScreen={setScreen} {...shared}/>,
    costs:     <CostInputScreen  costEntries={costEntries} setCostEntries={setCostEntries} farm={farm} setScreen={setScreen} {...shared}/>,
    revenue:   <RevenueScreen    revenue={revenue} setRevenue={setRevenue} farm={farm} setScreen={setScreen} {...shared}/>,
    summary:   <SummaryScreen    farm={farm} costEntries={costEntries} revenueEntries={revenue.entries || []} totals={totals} setHistory={setHistory} setScreen={setScreen} {...shared}/>,
    history:   <HistoryScreen    history={history} {...shared}/>,
  };

  const fz = tweaks.fontSize==='large'?{fontSize:'108%'}:{};
  return (
    <div style={{ height:'100%',display:'flex',flexDirection:'column',fontFamily:'Sarabun,sans-serif',position:'relative',...fz }}>
      <StatusBar theme={theme} lang={lang} onToggleLang={onToggleLang}/>
      <div className="screen-scroll">
        <div key={`${screen}-${lang}`} className="screen-enter">{SCREENS[screen]||SCREENS.dashboard}</div>
      </div>
      {installPrompt && !isStandalone && (
        <button
          onClick={promptInstall}
          style={{
            position:'absolute',
            top:58,
            right:12,
            zIndex:998,
            border:'1px solid rgba(255,255,255,0.42)',
            background:'rgba(20,83,45,0.84)',
            color:'white',
            borderRadius:999,
            padding:'8px 12px',
            fontFamily:'Sarabun,sans-serif',
            fontSize:12,
            fontWeight:700,
            boxShadow:'0 8px 20px rgba(20,83,45,0.24)',
            backdropFilter:'blur(10px)',
            cursor:'pointer',
          }}
        >
          {lang==='en' ? 'Install app' : 'ติดตั้งแอป'}
        </button>
      )}
      <BottomNav screen={screen} setScreen={setScreen} theme={theme} lang={lang}/>
      {showTweaks && <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={closeTweaks} theme={theme}/>}
    </div>
  );
}

window.ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
