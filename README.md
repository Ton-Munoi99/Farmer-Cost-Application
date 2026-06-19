# Handoff: Rice Cost Manager (คำนวณต้นทุนนาข้าว)

## Overview

A mobile-first web app for Thai rice farmers to record daily farming costs, calculate revenue, and view profit/loss per rai. The app is designed for users with limited digital literacy — large inputs, simple Thai wording, and automatic per-rai calculations from total amounts.

---

## About the Design Files

The files in this bundle (`index.html`, `components.jsx`, `RiceCostApp.jsx`) are **high-fidelity HTML prototypes** — working interactive designs that demonstrate the intended look, feel, and behavior. They are **not** production code to copy directly.

Your task is to **recreate these designs in your target codebase** (e.g. React Native, Next.js, Flutter, etc.) using its established patterns, libraries, and conventions. Use the HTML prototypes as a visual and behavioral reference — open them in a browser while building.

**Fidelity: High-fidelity.** Colors, spacing, typography, interactions, and copy should all be matched precisely.

---

## Running the Prototype Locally

Open `index.html` in a browser (requires internet for Google Fonts and React CDN). All logic is self-contained — no build step needed.

---

## Design Tokens

### Colors
```
Primary Green:     #16A34A
Deep Green:        #14532D
Green Pale:        #F0FDF4
Green Mid:         #22C55E
Green Border:      #BBF7D0

Cost Orange:       #F97316
Cost Orange Pale:  #FFF7ED
Cost Border:       #FED7AA

Revenue Green:     #16A34A (same as primary)

Profit Green text: #15803D
Loss Red text:     #DC2626
Loss Red bg:       #FEF2F2
Loss Red border:   #FECACA

Warning Gold:      #D97706
Warning Gold pale: #FFFBEB
Warning border:    #FDE68A

Neutral-900:       #1C1917
Neutral-700:       #44403C
Neutral-500:       #5C5849
Neutral-400:       #9B9585
Neutral-200:       #E8E8E0 / #EBEBDF
Neutral-100:       #F5F5EF / #F0F0EA
Background:        #FAFAF7
White:             #FFFFFF

Purple accent:     #9333EA  (ต้นทุน/กก. card)
Purple bg:         #FAF5FF
Indigo accent:     #6D28D9  (รายได้ฟาง card)
Indigo bg:         #F5F3FF
```

### Typography
```
Font family: "Sarabun" (Google Fonts) — supports Thai + Latin
  Weights used: 300, 400, 500, 600, 700, 800

Scale (mobile):
  xs:   11px
  sm:   12px
  base: 13–14px
  md:   15–16px
  lg:   18px
  xl:   22px
  2xl:  26–28px
  3xl:  36–44px (hero profit number)

All Thai body text: Sarabun 400–600
All numbers/values: Sarabun 700–800
```

### Spacing
```
Card padding:        16px
Card border-radius:  18px
Input border-radius: 12px
Button border-radius:14px
Small chip radius:   8–10px
Page side padding:   16px
Card gap:            10–12px
Section gap:         14–16px
```

### Shadows
```
Card:        0 2px 10px rgba(0,0,0,0.055)
Hero card:   0 8px 28px rgba(0,0,0,0.14)
Bottom nav:  0 -2px 16px rgba(0,0,0,0.07)
Phone shell: 0 32px 80px rgba(0,0,0,0.38)
```

### Phone Shell (prototype only)
```
Width:         390px
Min-height:    844px
Border-radius: 44px
Background:    body gradient — radial-gradient(ellipse at 30% 20%, #c8ddb5, #a8c494, #7fa87d)
```

---

## App Structure (6 Screens)

Navigation: **bottom tab bar** with 5 tabs. The "ประวัติ" (History) screen is accessible from the Summary screen.

| Tab | Screen ID | Icon | Label |
|-----|-----------|------|-------|
| 1 | `dashboard` | 🏠 | หน้าหลัก |
| 2 | `farm`      | 🌾 | แปลงนา   |
| 3 | `costs`     | 💰 | ต้นทุน   |
| 4 | `revenue`   | 📈 | รายได้   |
| 5 | `summary`   | 📊 | สรุป     |

---

## Screen 1: Dashboard (หน้าหลัก)

**Purpose:** Overview of the current season's P&L at a glance.

### Layout (top to bottom)
1. **Header strip** — gradient `#14532D → #22C55E`, 22px padding, white text
   - Sub-label: season + rice type (12px, 72% opacity)
   - Farm name: 22px/800
   - Province + area: 13px, 72% opacity

2. **Hero profit card** — pulled up `-22px` over header with `margin: -22px 16px 0`
   - White outer card, `border-radius: 20px`, `padding: 18px`, heavy shadow
   - Inner colored box (green `#F0FDF4` if profit, red `#FEF2F2` if loss)
   - Big profit number: 38px/800, animated with scale-pop on mount
   - Row of 3 sub-stats: ต่อไร่ / ต้นทุน/กก. / ราคาขาย

3. **4 Stat Cards** — `display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 14px 16px`
   - ต้นทุนรวม (orange `#F97316`, bg `#FFF7ED`)
   - รายได้รวม (green `#16A34A`, bg `#F0FDF4`)
   - ต้นทุน/กก. (purple `#9333EA`, bg `#FAF5FF`)
   - ราคาคุ้มทุน (gold `#D97706`, bg `#FFFBEB`)

4. **Cost donut chart card** — white card, full width
   - SVG donut (148px) on left, legend on right (max 7 items)
   - Legend: 9px colored square + category name + value

5. **Quick action 2×2 grid** — 4 colored cards linking to other tabs

### Stat Card Component
```
background: <bg color>
border-radius: 16px
padding: 14px
label: 12px/600, color #6B6660
value: 20px/800, <accent color>
sub: 11px, #9B9585
```

---

## Screen 2: Farm Info (แปลงนา)

**Purpose:** Enter basic plot information.

### Fields
| Field | Type | Placeholder/Options |
|-------|------|---------------------|
| ชื่อแปลงนา | Text input | "เช่น นาข้าวแปลง A" |
| จังหวัด | Text input | "เช่น สุพรรณบุรี" |
| อำเภอ | Text input | "เช่น บางปลาม้า" |
| ฤดูกาลข้าว | Radio (2 options) | 🌧️ ข้าวนาปี / ☀️ ข้าวนาปรัง |
| พันธุ์ข้าว | Select dropdown | ข้าวหอมมะลิ 105, ปทุมธานี 1, ชัยนาท 1, ไรซ์เบอร์รี่, พันธุ์อื่นๆ |
| วิธีการปลูก | Radio (3 options) | หว่าน / ดำนา / หยอด |
| พื้นที่ทั้งหมด | Number input | unit: ไร่ |
| ผลผลิตที่คาดหวัง | Number input | unit: กก./ไร่ |

### Input Style
```
border: 2px solid #E8E8E0
border-radius: 12px
padding: 13px 16px
font: Sarabun 16px
focus border: #16A34A (primary green, changes per theme)
background: white
```

### Radio Group Style
```
display: flex; gap: 8px; flex-wrap: wrap
Each option: flex: 1; min-width: 60px; padding: 10px 8px
border: 2px solid #E8E8E0 (unselected) / #16A34A (selected)
background: white (unselected) / #F0FDF4 (selected)
border-radius: 10px; text-align: center; font: 13px/600
```

### Number Input with Unit
```
Container: flex row, border: 2px solid #E8E8E0, border-radius: 12px
Input: flex:1, font 18px/600
Unit label: padding 0 14px, 13px/600, color #9B9585, bg #F5F5EF, border-left: 1px solid #E8E8E0
```

### CTA Button
- Full-width primary button: `ถัดไป: บันทึกต้นทุน →`
- Style: bg `#16A34A`, white text, 16px/700, height 52px, border-radius 14px

---

## Screen 3: Cost Input (ต้นทุน) — Daily Expense Log

**Purpose:** Record each payment made during the season. The app auto-calculates per-rai cost by dividing total by farm area.

### Key UX Principle
Farmers enter **total amount paid** (e.g. ฿8,500 for fertilizer for the whole plot). The app divides by area to show per-rai. No per-rai input needed.

### Header
- Gradient: `#92400E → #F59E0B`
- Shows: total cost + auto-calculated cost per rai (`total ÷ area`)
- Subtitle: "บันทึกทุกรายจ่าย · ระบบคำนวณต่อไร่ให้อัตโนมัติ"

### Toolbar
- Entry count label (left)
- Toggle switch (right): **ตามวันที่** | **ตามหมวด**

### Grouped Entry List
**By Date (default):** entries sorted newest-first, grouped by date. Group header shows Thai Buddhist date (day month year+543).

**By Category:** entries grouped by cost category. Group header shows icon + category name.

Each entry row:
```
background: white
border-radius: 12px
padding: 12px 14px
display: flex; align-items: center; gap: 10px
shadow: 0 1px 4px rgba(0,0,0,0.055)

[Category icon circle 36×36, border-radius 10px, bg = category_color + "28"]
[Name text 14px/600 + sub-label 11px #9B9585]
[Amount 15px/800 #F97316]
[Delete × button 28×28, bg #FEF2F2, color #DC2626]
```

### Add Entry Form (shown on button tap)
Fields:
1. **วันที่จ่ายเงิน** — `<input type="date">`, defaults to today
2. **หมวดหมู่** — Select from all 16 cost categories (12 main + 4 advanced)
3. **ชื่อรายการ** — Text, optional, placeholder "รายละเอียดเพิ่มเติม..."
4. **จำนวนเงินที่จ่ายจริง** — Number input with unit "บาท"
5. **Auto-calculation preview** (shown when amount > 0):
   `฿{amount} ÷ {area} ไร่ = {per_rai} บาท/ไร่` — bg `#FFF7ED`, border-radius 10px, 13px text

Form card style: `border: 1.5px solid #FED7AA`, `border-radius: 18px`, heavy shadow

### Cost Categories (16 total)
| Key | Name | Icon | Chart Color |
|-----|------|------|-------------|
| seed | เมล็ดพันธุ์ | 🌾 | #4ADE80 |
| chemFert | ปุ๋ยเคมี | 🧪 | #60A5FA |
| organicFert | ปุ๋ยอินทรีย์ | 🌿 | #34D399 |
| pesticide | ยาฆ่าศัตรูพืช | 🛡️ | #F87171 |
| labor | ค่าแรงงาน | 👨‍🌾 | #FBBF24 |
| machinery | ค่าเครื่องจักร | 🚜 | #A78BFA |
| landRent | ค่าเช่าที่ดิน | 🏡 | #FB923C |
| fuel | ค่าน้ำมัน | ⛽ | #F43F5E |
| water | ค่าน้ำ/ชลประทาน | 💧 | #38BDF8 |
| transport | ค่าขนส่ง | 🚛 | #818CF8 |
| drying | ค่าลดความชื้น | ☀️ | #FDE68A |
| other | อื่นๆ | 📦 | #94A3B8 |
| familyLabor | ค่าแรงครอบครัว | 👨‍👩‍👧 | #FCA5A5 |
| opportunity | ค่าโอกาสที่ดิน | 🏠 | #C4B5FD |
| interest | ดอกเบี้ยเงินกู้ | 🏦 | #93C5FD |
| maintenance | ค่าซ่อมบำรุง | 🔧 | #6EE7B7 |

---

## Screen 4: Revenue (รายได้)

**Purpose:** Enter rice paddy revenue, straw revenue, and other income.

### Section 1: Rice Revenue
- **ผลผลิตต่อไร่** — Number, unit: กก./ไร่ (hint shows total kg)
- **ราคาขายข้าวเปลือก** — Number, unit: บาท/กก.
- **หักค่าความชื้น** — Number, unit: %, default 0
- Formula: `area × yieldPerRai × price × (1 - deduction/100)`
- Auto-calculated total shown in green box

### Section 2: Straw Revenue (3 modes via radio)
- **ไม่ขายฟาง** — no additional fields
- **ขายเป็นก้อน** — shows: บาล/ไร่ + ราคา/บาล inputs. Formula: `balesPerRai × area × pricePerBale`
- **ขายเหมา** — shows single total amount input

### Section 3: Other Revenue
- Single number input, unit: บาท, optional

### Header
- Same gradient as theme header
- Shows running total revenue

---

## Screen 5: P&L Summary (สรุป)

**Purpose:** Show the complete profit/loss picture.

### Layout
1. **Color-coded header**: green gradient if profit, red gradient if loss
2. **Hero card** (pulled up -22px): large animated profit/loss number (44px/800), per-rai figure (22px/700), Thai-language contextual message in white box
3. **Breakeven alert box**: yellow bg `#FFFBEB`, border `#FDE68A`, text: "⚠️ ราคาขายข้าวเปลือกต้องไม่ต่ำกว่า X บาท/กก."
4. **6 Metric cards** in 2-col grid
5. **Bar chart**: 3 bars — ต้นทุน (orange) / รายได้ (green) / กำไร or ขาดทุน (green or red)
   - Bar height proportional to value, shows per-rai value above
6. **CTAs**: "💾 บันทึกฤดูกาลนี้" (primary) + "📅 เปรียบเทียบกับฤดูก่อน" (secondary)

### Calculations
```
totalCost     = sum of all costEntry.amount
costPerRai    = totalCost / area
riceRevenue   = area × yieldPerRai × price × (1 - deduction/100)
strawRevenue  = (mode=bale: balesPerRai×area×pricePerBale) | (mode=lumpsum: lumpsum) | 0
totalRevenue  = riceRevenue + strawRevenue + otherRevenue
profit        = totalRevenue - totalCost
profitPerRai  = profit / area
costPerKg     = costPerRai / yieldPerRai
breakeven     = costPerKg  (minimum selling price to not lose money)
```

### Contextual Thai Message
- Profit: "รอบนี้คุณมีกำไร {profitPerRai} บาทต่อไร่ 🎉"
- Loss: "ราคาขายข้าวเปลือกต้องไม่ต่ำกว่า {breakeven} บาท/กก. จึงจะไม่ขาดทุน"

---

## Screen 6: History (ประวัติ)

**Purpose:** Review past seasons and compare profitability.

### Layout
1. **Best season highlight card** (green, if history exists)
2. **Season list**: each card shows name, area, date, profit/rai, total profit, and a thin progress bar
3. **Comparison bar chart** (if ≥2 seasons): bars per season, colored green/red

### Progress bar (in each history card)
```
width: (|profitPerRai| / maxAbsValue) × 100%
color: green (#22C55E) if profit, red (#EF4444) if loss
height: 5px, border-radius: 3px
```

---

## State Management

### Core State Shape
```typescript
interface Farm {
  name: string;
  province: string;
  district: string;
  season: 'wet' | 'dry';
  variety: 'hommali' | 'pathumthani' | 'chainat' | 'riceberry' | 'other';
  method: 'broadcast' | 'transplant' | 'direct';
  area: number;        // rai
  expectedYield: number; // kg/rai
}

interface CostEntry {
  id: number;
  date: string;          // ISO: "2024-11-01"
  category: string;      // key from COST_CATS
  name: string;          // optional description
  amount: number;        // total THB paid (not per-rai)
}

interface Revenue {
  yieldPerRai: number;
  price: number;         // THB/kg
  deduction: number;     // % (0–100)
  straw: {
    mode: 'none' | 'bale' | 'lumpsum';
    balesPerRai: number;
    pricePerBale: number;
    lumpsum: number;
  };
  other: number;
}

interface SeasonHistory {
  id: number;
  name: string;
  area: number;
  profit: number;
  profitPerRai: number;
  totalCost: number;
  totalRevenue: number;
  date: string;
}
```

---

## Interactions & Behavior

### Screen Transitions
- Fade + slide up: `opacity 0→1`, `translateY 12px→0`, duration 280ms, easing `cubic-bezier(0.22,1,0.36,1)`

### Big Number Animation
- Hero profit/loss number: scale pop `scale(0.85)→scale(1.04)→scale(1)`, 450ms, on screen mount

### Bottom Nav
- Scale tap feedback: `scale(0.85)` on press, `scale(1)` on release
- Active indicator: 18×3px bar below label, colored with theme primary

### Cost Entry
- "เพิ่มรายการ" button toggles add form (Primary → Ghost style swap)
- Auto-preview of per-rai calculation when amount > 0
- Delete entry: tap × button removes from list immediately

### Per-Rai Auto-Calculation
- All cost totals shown in header update live as entries are added/removed
- No manual calculation needed from farmer

### Save Season
- Button text changes to "✅ บันทึกเรียบร้อยแล้ว" after tap (non-reversible in UI)
- New season record prepended to history array

### Theming (3 color themes)
All themes change: header gradient, primary color, nav active color.
```
green: header #14532D→#22C55E, primary #16A34A
earth: header #78350F→#F59E0B, primary #B45309
blue:  header #1E3A8A→#60A5FA, primary #1D4ED8
```

### Font Size Mode
- "ปกติ" (normal): base font-size 100%
- "ใหญ่" (large): base font-size 108% — for older/low-vision farmers

---

## Donut Chart (SVG)

The chart uses a single SVG with stacked `<circle>` elements using `stroke-dasharray`.

Each segment i:
```
ratio_i = value_i / total
dashArray = ratio_i × circumference
rotation = -90 + (sum of previous ratios × 360) degrees
transformOrigin: center of SVG
```

Center labels: "ต้นทุนรวม" + total value + "บาท"

---

## Bar Chart

3 vertical bars comparing cost / revenue / profit per season:
```
bar height = (value / maxValue) × 72px
bar width: 72% of column
border-radius: 6px 6px 0 0
Label above bar: per-rai value in accent color
Label below bar: category name
```

---

## Thai Date Formatting

Dates stored as ISO (Gregorian): `"2024-11-15"`
Displayed as Thai Buddhist Calendar: `"15 พ.ย. 2567"` (year + 543)

Month abbreviations:
```
ม.ค. ก.พ. มี.ค. เม.ย. พ.ค. มิ.ย. ก.ค. ส.ค. ก.ย. ต.ค. พ.ย. ธ.ค.
```

---

## Sample / Seed Data

The prototype pre-loads a full 20-rai season (2024–2025):
- 16 cost entries totalling ฿109,600 (= ฿5,480/rai)
- Revenue: 500 kg/rai × 14.5 THB/kg × 20 rai = ฿145,000 + ฿9,600 straw = ฿154,600
- **Profit: ฿45,000 (฿2,250/rai)**
- 3 historical seasons pre-loaded for comparison

---

## Bilingual System (Thai / English)

The app supports full TH ↔ EN switching at runtime. All UI strings are externalized into `translations.jsx`.

### How it works

```
translations.jsx  →  exports STRINGS (object) + toLocalDate() to window
RiceCostApp.jsx   →  each screen reads: const t = k => STRINGS[lang][k]
```

`lang` is stored in `tweaks.lang` (default `"th"`). It is toggled via:
1. **Status bar** — `TH | EN` pill button (always visible)
2. **Tweaks panel** — Language selector with flag labels

### Adding a new language

1. Add a new key to `STRINGS` in `translations.jsx` (e.g. `"km"` for Khmer)
2. Translate every key from the `th` or `en` block
3. Add the new option to the language toggle in `StatusBar` and `TweaksPanel`

### Date formatting

```js
toLocalDate(isoString, lang)
// lang='th' → "15 พ.ย. 2567"  (Buddhist calendar, Thai month abbrevs)
// lang='en' → "15 Nov 2024"   (Gregorian, English month abbrevs)
```

### String key conventions

| Prefix | Scope |
|--------|-------|
| `nav_*` | Bottom navigation tab labels |
| `unit_*` | Units (บาท/THB, ไร่/rai, กก./kg, etc.) |
| `cat_*` | Cost category names (16 categories) |
| `dash_*` | Dashboard screen |
| `farm_*` | Farm info screen |
| `costs_*` | Cost input screen |
| `rev_*` | Revenue screen |
| `sum_*` | P&L Summary screen |
| `hist_*` | Season history screen |
| `tweak_*` | Tweaks panel labels |
| `wet`, `dry`, `method_*`, `var_*` | Season / method / variety labels |

---

## Files in This Package

| File | Purpose |
|------|---------|
| `index.html` | App shell: phone chrome CSS, Google Fonts, TWEAK_DEFAULTS (`theme`, `fontSize`, `lang`), loads JSX files |
| `translations.jsx` | All TH + EN strings (~140 keys each) + `toLocalDate()` date formatter |
| `components.jsx` | Shared UI library: DonutChart, BarChart, StatCard, TextInput, NumberInput, SelectInput, RadioGroup, Toggle, Btn, Card |
| `RiceCostApp.jsx` | All 6 screens + state management + bottom nav + tweaks panel + language toggle |
| `README.md` | This file |

---

## Notes for Implementation

1. **Sarabun font is essential** — it's the only Google Font that looks good for both Thai and Latin at all weights. Load from Google Fonts or bundle locally.

2. **Buddhist year display** — always add 543 to Gregorian year when showing dates to Thai users.

3. **No per-rai input for costs** — farmers enter total amount paid. Per-rai is always `amount / farm.area`. This is a deliberate UX decision.

4. **Persist data locally** — use AsyncStorage (React Native), localStorage (web), or SQLite. Farmers return to the app mid-season.

5. **Input type="number" on mobile** — use `inputMode="decimal"` for numeric keyboards without the +/- buttons.

6. **Large tap targets** — all interactive elements minimum 44px height. This is critical for the target demographic.
