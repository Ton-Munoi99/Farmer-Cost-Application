# Claude Code Prompts — Rice Cost Manager

ไฟล์นี้มี prompt สำเร็จรูป 2 ชุด สำหรับเอาดีไซน์ prototype ไปทำต่อใน Claude Code
ก๊อปทั้งบล็อกไปวางใน Claude Code ได้เลย (หลังจากลากโฟลเดอร์ `design_handoff_rice_cost_manager/` เข้าไปแล้ว)

> **เตรียมก่อนเริ่ม:** แตก ZIP แล้วลากโฟลเดอร์ทั้งหมด (มี `README.md`, `index.html`, `translations.jsx`, `components.jsx`, `RiceCostApp.jsx`) เข้า Claude Code เพื่อให้มันอ่าน spec และโค้ดต้นแบบได้

---

# ════════════════════════════════════════════
# ข้อ 1 — React Native + Expo (แอปจริง iOS + Android)
# ════════════════════════════════════════════

## Prompt #1 — เริ่มโปรเจกต์ + วางโครงสร้าง

```
ฉันมีดีไซน์ prototype ของแอป "Rice Cost Manager" (แอปคำนวณต้นทุนนาข้าวสำหรับชาวนาไทย) อยู่ในโฟลเดอร์นี้ — เป็น HTML/React prototype พร้อม README.md ที่อธิบาย spec ครบทุกหน้า

ช่วยอ่าน README.md และไฟล์ RiceCostApp.jsx, translations.jsx, components.jsx ให้ละเอียดก่อน จากนั้นสร้างเป็นแอป React Native + Expo (TypeScript) ใหม่

ข้อกำหนด:
- ใช้ Expo (managed workflow) + TypeScript
- Navigation: ใช้ React Navigation แบบ bottom tabs 5 แท็บ (Home, Farm, Costs, Revenue, Summary) + stack สำหรับหน้า History
- ฟอนต์: Sarabun (ใช้ expo-font หรือ expo-google-fonts/sarabun) รองรับน้ำหนัก 400/500/600/700/800
- โครงสร้างโฟลเดอร์:
    /src
      /screens     (DashboardScreen, FarmScreen, CostsScreen, RevenueScreen, SummaryScreen, HistoryScreen)
      /components  (StatCard, DonutChart, BarChart, NumberInput, TextInput, SelectInput, RadioGroup, Toggle, Button, Card)
      /i18n        (strings.ts จาก translations.jsx, + hook useTranslation)
      /theme       (colors.ts, spacing.ts ตาม design tokens ใน README)
      /state       (AppContext หรือ Zustand store สำหรับ farm/costs/revenue/history)
      /utils       (calc.ts สำหรับสูตรคำนวณ, date.ts สำหรับ toLocalDate)

ตอนนี้ยังไม่ต้องทำทุกหน้า — ขอให้:
1. ตั้งค่าโปรเจกต์ + navigation + ฟอนต์ + theme tokens
2. ย้าย translations.jsx → src/i18n/strings.ts และทำ hook useTranslation() ที่อ่านภาษาจาก global state
3. ทำ calc.ts (สูตรใน README section "Calculations") + date.ts
4. ทำ state store (farm, costEntries, revenue, history) พร้อม seed data จาก README

แล้วให้ฉันรันดูใน Expo Go ก่อน ค่อยทำหน้าถัดไป
```

## Prompt #2 — ทำ component library

```
ต่อไปช่วยสร้าง shared components ใน src/components ให้ตรงกับ design tokens ใน README และดูโค้ดต้นแบบใน components.jsx เป็น reference:

- Button (variant: primary/secondary/ghost) — สีเขียว #16A34A, radius 14, สูง ≥52
- Card — white, radius 18, shadow ตาม README
- StatCard — label/value/sub/color/bg props
- TextInput, NumberInput (มี unit suffix), SelectInput (ใช้ @react-native-picker/picker), RadioGroup, Toggle
- DonutChart — ใช้ react-native-svg วาด stroke-dasharray ตามสูตรใน README
- BarChart — แท่งแนวตั้ง 3 แท่ง

ทุก component ต้อง:
- รองรับ font scale (props fontSize จาก tweaks)
- hit target ≥44px (กลุ่มผู้ใช้คือชาวนา บางคนสูงอายุ)
- ใช้ StyleSheet.create ไม่ใช้ inline style

ทำเสร็จแล้วทำ Storybook-style demo screen ให้ฉันเช็คทุก component ก่อน
```

## Prompt #3 — ทำทีละหน้า

```
ตอนนี้ทำหน้าจอทีละหน้า เริ่มจาก CostsScreen (หน้าบันทึกต้นทุนรายวัน) เพราะเป็นหน้าหลักที่ชาวนาใช้บ่อยสุด

ดู spec ใน README section "Screen 3: Cost Input" และโค้ดต้นแบบ CostInputScreen ใน RiceCostApp.jsx

ฟีเจอร์ที่ต้องมี:
- header ส้ม-เหลือง gradient แสดงต้นทุนรวม + เฉลี่ยต่อไร่ (auto = total ÷ area)
- toggle "ตามวันที่ / ตามหมวด"
- รายการต้นทุน group ตามวันหรือหมวด พร้อมปุ่มลบ
- ฟอร์มเพิ่มรายการ: วันที่ (date picker), หมวดหมู่ (16 หมวด), ชื่อ (optional), จำนวนเงินรวม
- แสดง preview การหารต่อไร่แบบ real-time
- ใช้ i18n ทุก string

หลักการสำคัญ: ชาวนากรอก "จำนวนเงินที่จ่ายจริงทั้งหมด" — ระบบหารด้วยจำนวนไร่ให้เอง ไม่ต้องกรอกต่อไร่

ทำเสร็จให้ฉันรันดูแล้วค่อยทำหน้าถัดไป (Revenue → Summary → Dashboard → Farm → History)
```

## Prompt #4 — เก็บข้อมูลถาวร + ขัดเกลา

```
ตอนนี้เพิ่มการเก็บข้อมูลถาวร (ชาวนากลับมาใช้กลางฤดู ข้อมูลต้องไม่หาย):
- ใช้ AsyncStorage persist state ทั้งหมด (farm, costEntries, revenue, history, ภาษา, theme)
- โหลดกลับตอนเปิดแอป + กันสถานะ loading ตอนเริ่ม

แล้วเพิ่ม:
- ภาษา TH/EN toggle ใน header (ตาม StatusBar ใน prototype) + persist
- หน้า Settings ง่ายๆ สำหรับ theme + font size + ภาษา
- haptic feedback ตอนกดปุ่มหลัก (expo-haptics)

ทดสอบ: ปิดแล้วเปิดแอปใหม่ ข้อมูลต้องอยู่ครบ
```

---

# ════════════════════════════════════════════
# ข้อ 2 — PWA (ติดตั้งบนมือถือจาก HTML เดิม)
# ════════════════════════════════════════════

> ข้อนี้ใช้ HTML prototype เดิมได้เลย ไม่ต้อง rewrite — แค่ทำให้ติดตั้งบนหน้าจอมือถือได้ + ทำงาน offline + เก็บข้อมูลในเครื่อง

## Prompt #1 — แปลงเป็น PWA

```
ฉันมี web app "Rice Cost Manager" (HTML + React ผ่าน Babel CDN) ในโฟลเดอร์นี้ — index.html โหลด translations.jsx, components.jsx, RiceCostApp.jsx

ช่วยทำให้มันเป็น PWA ที่ติดตั้งบนมือถือได้ (Add to Home Screen) และทำงาน offline:

1. สร้าง manifest.json:
   - name: "Rice Cost Manager", short_name: "RiceCost"
   - theme_color: #16A34A, background_color: #FAFAF7
   - display: standalone, orientation: portrait
   - icons: 192x192 + 512x512 (สร้าง icon รูปรวงข้าวง่ายๆ เป็น PNG หรือ SVG-based)

2. สร้าง service worker (sw.js):
   - cache index.html + ไฟล์ jsx ทั้งหมด + ฟอนต์ Sarabun + React/Babel CDN
   - strategy: cache-first สำหรับ assets, ทำงาน offline ได้เต็มที่

3. แก้ index.html:
   - เพิ่ม <link rel="manifest"> + meta tags สำหรับ iOS (apple-mobile-web-app-capable, apple-touch-icon, theme-color)
   - register service worker

4. เพิ่มปุ่ม "ติดตั้งแอป" (beforeinstallprompt) แบบ subtle ที่มุมจอ แสดงเฉพาะตอนยังไม่ติดตั้ง

อธิบายวิธีทดสอบบนมือถือจริงด้วย (ต้อง serve ผ่าน HTTPS)
```

## Prompt #2 — เก็บข้อมูลถาวร (สำคัญ)

```
ตอนนี้แอปยัง refresh แล้วข้อมูลหาย ช่วยเพิ่มการเก็บข้อมูลถาวรด้วย localStorage:

- ใน RiceCostApp.jsx เซฟ state ทั้งหมด (farm, costEntries, revenue, history, tweaks) ลง localStorage ทุกครั้งที่เปลี่ยน
- โหลดกลับตอนเปิดแอป (อ่านจาก localStorage ก่อน ถ้าไม่มีค่อยใช้ seed data)
- ใช้ key เดียว เช่น "ricecost_v1" เก็บเป็น JSON ก้อนเดียว
- กันกรณี JSON พัง (try/catch, fallback เป็น seed data)

อย่าทำลายโครงสร้าง state เดิม — แค่ wrap useState ด้วย logic persist
ทดสอบ: เพิ่มรายการต้นทุน → refresh → ข้อมูลต้องอยู่
```

## Prompt #3 — Production build (ถ้าจะ deploy จริง)

```
ตอนนี้แอปใช้ Babel transform ใน browser (ช้าตอนโหลด) ช่วยทำ production build:

- ตั้งค่า Vite (หรือ esbuild) bundle ไฟล์ jsx ทั้งหมดเป็น JS ก้อนเดียว pre-compiled
- bundle React + ReactDOM แบบ production (ไม่ใช่ development CDN)
- inline หรือ self-host ฟอนต์ Sarabun (ไม่พึ่ง Google Fonts ตอน offline)
- output เป็น static files พร้อม deploy

แนะนำที่ deploy ฟรีที่รองรับ HTTPS + PWA (เช่น Netlify, Vercel, GitHub Pages) พร้อมขั้นตอน
```

---

# เทียบ 2 ทาง

| | React Native + Expo (ข้อ 1) | PWA (ข้อ 2) |
|---|---|---|
| ขึ้น App Store / Play Store | ✅ ได้ | ❌ ไม่ได้ (ติดตั้งผ่าน browser) |
| ความเร็ว / ความรู้สึก native | สูงสุด | ดี |
| งานที่ต้องทำ | rewrite เป็น RN | แทบไม่แก้ code เดิม |
| เวลาที่ใช้ | หลายวัน | ไม่กี่ชั่วโมง |
| Offline | ✅ | ✅ (ผ่าน service worker) |
| เหมาะกับ | แอปจริงระยะยาว | ทดสอบเร็ว / MVP / แจกลิงก์ให้ลองใช้ |

**แนะนำ:** เริ่มจาก **ข้อ 2 (PWA)** ก่อนเพื่อให้ชาวนากลุ่มทดลองได้ลองใช้เร็วๆ บนมือถือจริง → ถ้า feedback ดีค่อยลงทุนทำ **ข้อ 1 (React Native)** เพื่อขึ้น store
