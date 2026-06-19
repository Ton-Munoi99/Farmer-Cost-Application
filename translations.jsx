// translations.jsx — All TH/EN strings for Rice Cost Manager

const THAI_MONTHS = ['','ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const ENG_MONTHS  = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function toLocalDate(iso, lang) {
  if (!iso) return '';
  const [y,m,d] = iso.split('-').map(Number);
  return lang === 'en'
    ? `${d} ${ENG_MONTHS[m]} ${y}`
    : `${d} ${THAI_MONTHS[m]} ${y+543}`;
}

const STRINGS = {
  th: {
    // ── Nav ──
    nav_home:'หน้าหลัก', nav_farm:'แปลงนา', nav_costs:'ต้นทุน', nav_revenue:'รายได้', nav_summary:'สรุป',

    // ── Units ──
    unit_baht:'บาท', unit_rai:'ไร่', unit_kg:'กก.', unit_pct:'%',
    unit_baht_rai:'บาท/ไร่', unit_baht_kg:'บาท/กก.', unit_kg_rai:'กก./ไร่',
    unit_bale_rai:'ก้อน/ไร่', unit_baht_bale:'บาท/ก้อน',

    // ── Season / variety / method ──
    wet:'ข้าวนาปี', dry:'ข้าวนาปรัง',
    wet_icon:'🌧️ ข้าวนาปี', dry_icon:'☀️ ข้าวนาปรัง',
    method_broadcast:'หว่าน', method_transplant:'ดำนา', method_direct:'หยอด',
    var_hommali:'ข้าวหอมมะลิ 105', var_pathumthani:'ข้าวปทุมธานี 1',
    var_chainat:'ข้าวชัยนาท 1', var_riceberry:'ข้าวไรซ์เบอร์รี่', var_other:'พันธุ์อื่นๆ',

    // ── Category names ──
    cat_seed:'เมล็ดพันธุ์', cat_chemFert:'ปุ๋ยเคมี', cat_organicFert:'ปุ๋ยอินทรีย์',
    cat_pesticide:'ยาฆ่าศัตรูพืช', cat_labor:'ค่าแรงงาน', cat_machinery:'ค่าเครื่องจักร',
    cat_landRent:'ค่าเช่าที่ดิน', cat_fuel:'ค่าน้ำมัน', cat_water:'ค่าน้ำ/ชลประทาน',
    cat_transport:'ค่าขนส่ง', cat_drying:'ค่าลดความชื้น', cat_other:'อื่นๆ',
    cat_familyLabor:'ค่าแรงครอบครัว', cat_opportunity:'ค่าโอกาสที่ดิน',
    cat_interest:'ดอกเบี้ยเงินกู้', cat_maintenance:'ค่าซ่อมบำรุง',

    // ── Dashboard ──
    dash_season:'ฤดูกาล 2567/68',
    dash_profit:'📈 กำไรสุทธิฤดูกาลนี้', dash_loss:'📉 ขาดทุนฤดูกาลนี้',
    dash_per_rai:'ต่อไร่', dash_cost_per_kg:'ต้นทุน/กก.', dash_sell_price:'ราคาขาย',
    dash_total_cost:'ต้นทุนรวม', dash_total_rev:'รายได้รวม',
    dash_cost_kg:'ต้นทุน/กก.', dash_breakeven:'ราคาคุ้มทุน',
    dash_cost_kg_sub:'ต้นทุนต่อกิโลกรัม', dash_breakeven_sub:'ราคาขั้นต่ำที่ไม่ขาดทุน',
    dash_chart_title:'สัดส่วนต้นทุนการผลิต',
    dash_donut_center:'ต้นทุนรวม', dash_donut_unit:'บาท', dash_no_data:'ยังไม่มีข้อมูล',
    dash_link_cost:'บันทึกต้นทุน', dash_link_rev:'บันทึกรายได้',
    dash_link_farm:'ข้อมูลแปลงนา', dash_link_pl:'ดูสรุป P&L',
    dash_rai_unit:'บาท/ไร่',

    // ── Farm ──
    farm_title:'🌾 ข้อมูลแปลงนา', farm_sub:'กรอกข้อมูลพื้นฐานของแปลงนา',
    farm_name:'ชื่อแปลงนา', farm_name_ph:'เช่น นาข้าวแปลง A',
    farm_province:'จังหวัด', farm_province_ph:'เช่น สุพรรณบุรี',
    farm_district:'อำเภอ', farm_district_ph:'เช่น บางปลาม้า',
    farm_season_lbl:'ฤดูกาลข้าว', farm_variety:'พันธุ์ข้าว', farm_method:'วิธีการปลูก',
    farm_area:'พื้นที่ทั้งหมด', farm_area_hint:'จำนวนไร่ที่ทำนาในฤดูกาลนี้',
    farm_yield:'ผลผลิตที่คาดหวัง', farm_yield_hint:'เฉลี่ยต่อ 1 ไร่',
    farm_next:'ถัดไป: บันทึกต้นทุน →',

    // ── Costs ──
    costs_title:'💰 บันทึกต้นทุนรายวัน',
    costs_sub:'บันทึกทุกรายจ่าย · ระบบคำนวณต่อไร่ให้อัตโนมัติ',
    costs_total_lbl:'ต้นทุนรวมทั้งหมด', costs_per_rai_lbl:'เฉลี่ยต่อไร่',
    costs_entries:'รายการ', costs_by_date:'ตามวันที่', costs_by_cat:'ตามหมวด',
    costs_empty_title:'ยังไม่มีรายการต้นทุน', costs_empty_sub:'กดปุ่มด้านล่างเพื่อเพิ่มรายการ',
    costs_add:'+ เพิ่มรายการต้นทุน', costs_cancel:'✕ ยกเลิก',
    costs_form_title:'📝 บันทึกรายจ่าย',
    costs_date_lbl:'วันที่จ่ายเงิน', costs_cat_lbl:'หมวดหมู่',
    costs_name_lbl:'ชื่อรายการ (ไม่บังคับ)', costs_name_hint:'เช่น ปุ๋ยยูเรีย 2 กระสอบ',
    costs_name_ph:'รายละเอียดเพิ่มเติม...',
    costs_amount_lbl:'จำนวนเงินที่จ่ายจริง (รวมทั้งหมด)',
    costs_save:'✓ บันทึกรายการนี้', costs_next:'ถัดไป: กรอกรายได้ →',
    costs_divide_suffix:'ไร่ =',

    // ── Revenue ──
    rev_title:'📈 รายได้จากนาข้าว', rev_sub:'กรอกรายได้ข้าวและฟางข้าว',
    rev_total_lbl:'รายได้รวมทั้งหมด',
    rev_rice_title:'🌾 รายได้จากข้าวเปลือก',
    rev_yield_lbl:'ผลผลิตต่อไร่', rev_price_lbl:'ราคาขายข้าวเปลือก',
    rev_deduct_lbl:'หักค่าความชื้น/ค่าใช้จ่าย (ถ้ามี)',
    rev_rice_result:'รายได้จากข้าว',
    rev_straw_title:'🌿 รายได้จากฟางข้าว',
    rev_straw_none:'ไม่ขายฟาง', rev_straw_bale:'ขายเป็นก้อน', rev_straw_lump:'ขายเหมา',
    rev_bales_lbl:'จำนวนก้อนต่อไร่', rev_bale_price_lbl:'ราคาต่อก้อน',
    rev_lump_lbl:'รายได้ฟางรวมทั้งแปลง', rev_straw_result:'รายได้จากฟาง',
    rev_other_title:'💼 รายได้อื่นๆ (ถ้ามี)', rev_next:'ถัดไป: ดูสรุป P&L →',

    // ── Summary ──
    sum_title:'📊 สรุปกำไร–ขาดทุน', sum_sub:'ภาพรวมผลประกอบการฤดูนี้',
    sum_profit_lbl:'📈 กำไรสุทธิ', sum_loss_lbl:'📉 ขาดทุนสุทธิ',
    sum_be_prefix:'⚠️ ราคาขายข้าวเปลือกต้องไม่ต่ำกว่า',
    sum_be_suffix:'บาท/กก. จึงจะไม่ขาดทุน',
    sum_total_cost:'ต้นทุนรวม', sum_total_rev:'รายได้รวม',
    sum_rice_rev:'รายได้ข้าว', sum_straw_rev:'รายได้ฟาง',
    sum_cost_kg:'ต้นทุน/กก.', sum_breakeven_card:'ราคาคุ้มทุน',
    sum_rice_sub:'จากการขายข้าวเปลือก', sum_straw_sub:'จากการขายฟางข้าว',
    sum_cost_kg_sub:'ต้นทุนต่อกิโลกรัม', sum_be_sub:'ขั้นต่ำที่ไม่ขาดทุน',
    sum_chart_title:'เปรียบเทียบต้นทุน vs รายได้',
    sum_bar_cost:'ต้นทุน', sum_bar_rev:'รายได้', sum_bar_profit:'กำไร', sum_bar_loss:'ขาดทุน',
    sum_save:'💾 บันทึกฤดูกาลนี้', sum_saved:'✅ บันทึกเรียบร้อยแล้ว',
    sum_compare:'📅 เปรียบเทียบกับฤดูก่อน',
    sum_msg_profit:'รอบนี้คุณมีกำไร', sum_msg_profit2:'บาทต่อไร่ 🎉',
    sum_msg_loss:'ราคาขายข้าวเปลือกต้องไม่ต่ำกว่า', sum_msg_loss2:'บาท/กก. จึงจะไม่ขาดทุน',

    // ── History ──
    hist_title:'📅 ประวัติฤดูกาล',
    hist_seasons_suffix:'ฤดูกาล ที่บันทึกไว้',
    hist_best:'⭐ ฤดูกาลที่ดีที่สุด',
    hist_all:'ประวัติทั้งหมด', hist_chart_title:'กำไร/ไร่ เปรียบเทียบแต่ละฤดู',
    hist_per_rai:'บาท/ไร่', hist_total_suffix:'บาท',

    // ── Tweaks ──
    tweak_theme:'สีธีม', tweak_green:'เขียว', tweak_earth:'ดิน', tweak_blue:'น้ำเงิน',
    tweak_font:'ขนาดตัวอักษร', tweak_normal:'ปกติ', tweak_large:'ใหญ่',
    tweak_lang:'ภาษา',
  },

  en: {
    // ── Nav ──
    nav_home:'Home', nav_farm:'Farm', nav_costs:'Costs', nav_revenue:'Revenue', nav_summary:'Summary',

    // ── Units ──
    unit_baht:'THB', unit_rai:'rai', unit_kg:'kg', unit_pct:'%',
    unit_baht_rai:'THB/rai', unit_baht_kg:'THB/kg', unit_kg_rai:'kg/rai',
    unit_bale_rai:'bales/rai', unit_baht_bale:'THB/bale',

    // ── Season / variety / method ──
    wet:'Wet Season', dry:'Dry Season',
    wet_icon:'🌧️ Wet Season', dry_icon:'☀️ Dry Season',
    method_broadcast:'Broadcasting', method_transplant:'Transplanting', method_direct:'Direct Seeding',
    var_hommali:'Hom Mali 105', var_pathumthani:'Pathum Thani 1',
    var_chainat:'Chai Nat 1', var_riceberry:'Riceberry', var_other:'Other Variety',

    // ── Category names ──
    cat_seed:'Seeds', cat_chemFert:'Chemical Fertilizer', cat_organicFert:'Organic Fertilizer',
    cat_pesticide:'Pesticides', cat_labor:'Labor Cost', cat_machinery:'Machinery',
    cat_landRent:'Land Rental', cat_fuel:'Fuel', cat_water:'Water/Irrigation',
    cat_transport:'Transportation', cat_drying:'Drying Cost', cat_other:'Other',
    cat_familyLabor:'Family Labor', cat_opportunity:'Land Opportunity Cost',
    cat_interest:'Loan Interest', cat_maintenance:'Maintenance',

    // ── Dashboard ──
    dash_season:'Season 2024/25',
    dash_profit:'📈 Net Profit This Season', dash_loss:'📉 Net Loss This Season',
    dash_per_rai:'per rai', dash_cost_per_kg:'Cost/kg', dash_sell_price:'Sell Price',
    dash_total_cost:'Total Cost', dash_total_rev:'Total Revenue',
    dash_cost_kg:'Cost/kg', dash_breakeven:'Break-even',
    dash_cost_kg_sub:'Cost per kilogram', dash_breakeven_sub:'Minimum selling price',
    dash_chart_title:'Production Cost Breakdown',
    dash_donut_center:'Total Cost', dash_donut_unit:'THB', dash_no_data:'No data yet',
    dash_link_cost:'Record Costs', dash_link_rev:'Record Revenue',
    dash_link_farm:'Farm Info', dash_link_pl:'View P&L',
    dash_rai_unit:'THB/rai',

    // ── Farm ──
    farm_title:'🌾 Farm Plot Info', farm_sub:'Enter basic information about your plot',
    farm_name:'Plot Name', farm_name_ph:'e.g. North Field A',
    farm_province:'Province', farm_province_ph:'e.g. Suphanburi',
    farm_district:'District', farm_district_ph:'e.g. Bang Pla Ma',
    farm_season_lbl:'Rice Season', farm_variety:'Rice Variety', farm_method:'Cultivation Method',
    farm_area:'Total Area', farm_area_hint:'Total rai cultivated this season',
    farm_yield:'Expected Yield', farm_yield_hint:'Average per 1 rai',
    farm_next:'Next: Record Costs →',

    // ── Costs ──
    costs_title:'💰 Daily Cost Log',
    costs_sub:'Record every payment · Auto-calculated per rai',
    costs_total_lbl:'Total Costs', costs_per_rai_lbl:'Average per rai',
    costs_entries:'entries', costs_by_date:'By Date', costs_by_cat:'By Category',
    costs_empty_title:'No cost entries yet', costs_empty_sub:'Tap below to add your first entry',
    costs_add:'+ Add Cost Entry', costs_cancel:'✕ Cancel',
    costs_form_title:'📝 Record a Payment',
    costs_date_lbl:'Date Paid', costs_cat_lbl:'Category',
    costs_name_lbl:'Description (optional)', costs_name_hint:'e.g. Urea fertilizer 2 bags',
    costs_name_ph:'Additional details...',
    costs_amount_lbl:'Total Amount Paid (whole plot)',
    costs_save:'✓ Save Entry', costs_next:'Next: Record Revenue →',
    costs_divide_suffix:'rai =',

    // ── Revenue ──
    rev_title:'📈 Farm Revenue', rev_sub:'Enter rice and straw income',
    rev_total_lbl:'Total Revenue',
    rev_rice_title:'🌾 Paddy Rice Revenue',
    rev_yield_lbl:'Yield per Rai', rev_price_lbl:'Paddy Selling Price',
    rev_deduct_lbl:'Moisture deduction (if any)',
    rev_rice_result:'Rice Revenue',
    rev_straw_title:'🌿 Straw Revenue',
    rev_straw_none:'No straw sale', rev_straw_bale:'Sell by bale', rev_straw_lump:'Lump sum',
    rev_bales_lbl:'Bales per rai', rev_bale_price_lbl:'Price per bale',
    rev_lump_lbl:'Total straw revenue (whole plot)', rev_straw_result:'Straw Revenue',
    rev_other_title:'💼 Other Revenue (optional)', rev_next:'Next: View P&L Summary →',

    // ── Summary ──
    sum_title:'📊 Profit & Loss Summary', sum_sub:'Full season financial overview',
    sum_profit_lbl:'📈 Net Profit', sum_loss_lbl:'📉 Net Loss',
    sum_be_prefix:'⚠️ Selling price must be at least',
    sum_be_suffix:'THB/kg to break even',
    sum_total_cost:'Total Cost', sum_total_rev:'Total Revenue',
    sum_rice_rev:'Rice Revenue', sum_straw_rev:'Straw Revenue',
    sum_cost_kg:'Cost/kg', sum_breakeven_card:'Break-even',
    sum_rice_sub:'From paddy rice sales', sum_straw_sub:'From straw sales',
    sum_cost_kg_sub:'Cost per kilogram', sum_be_sub:'Minimum to avoid loss',
    sum_chart_title:'Cost vs Revenue Comparison',
    sum_bar_cost:'Cost', sum_bar_rev:'Revenue', sum_bar_profit:'Profit', sum_bar_loss:'Loss',
    sum_save:'💾 Save This Season', sum_saved:'✅ Season Saved!',
    sum_compare:'📅 Compare with Previous Seasons',
    sum_msg_profit:'You made a profit of', sum_msg_profit2:'THB/rai this season 🎉',
    sum_msg_loss:'Selling price must be at least', sum_msg_loss2:'THB/kg to break even.',

    // ── History ──
    hist_title:'📅 Season History',
    hist_seasons_suffix:'season(s) recorded',
    hist_best:'⭐ Best Season',
    hist_all:'All Seasons', hist_chart_title:'Profit/rai by Season',
    hist_per_rai:'THB/rai', hist_total_suffix:'THB',

    // ── Tweaks ──
    tweak_theme:'Color Theme', tweak_green:'Green', tweak_earth:'Earth', tweak_blue:'Blue',
    tweak_font:'Font Size', tweak_normal:'Normal', tweak_large:'Large',
    tweak_lang:'Language',
  },
};

Object.assign(window, { STRINGS, toLocalDate });
