// components.jsx — Shared UI library for Rice Cost Manager
import React, { useState } from 'react';

// ─── Formatter ────────────────────────────────────────────────────────────────
export const fmt = (n, decimals = 0) => {
  if (n === undefined || n === null || isNaN(n)) return '–';
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// ─── Donut Chart (SVG) ────────────────────────────────────────────────────────
export function DonutChart({ data = [], size = 148, centerLabel, centerUnit, noDataText }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  const cx = size / 2, cy = size / 2;
  const r = size * 0.32, sw = size * 0.14;
  const C = 2 * Math.PI * r;

  if (!total) {
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8E8E0" strokeWidth={sw} />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#B0AA9A"
          fontSize={11} fontFamily="Sarabun,sans-serif">{noDataText || 'No data'}</text>
      </svg>
    );
  }

  let cumRatio = 0;
  const segs = data.filter(d => d.value > 0).map(d => {
    const ratio = d.value / total;
    const seg = { ...d, ratio, startRatio: cumRatio };
    cumRatio += ratio;
    return seg;
  });

  return (
    <svg width={size} height={size}>
      {segs.map((seg, i) => {
        const dash = seg.ratio * C;
        const rot = -90 + seg.startRatio * 360;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={sw}
            strokeDasharray={`${dash} ${C}`}
            strokeLinecap="butt"
            style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
      <text x={cx} y={cy - 7} textAnchor="middle" fill="#7A756A"
        fontSize={size * 0.079} fontFamily="Sarabun,sans-serif" fontWeight="500">
        {centerLabel || 'Total Cost'}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill="#1C1917"
        fontSize={size * 0.106} fontFamily="Sarabun,sans-serif" fontWeight="800">{fmt(total)}</text>
      <text x={cx} y={cy + 26} textAnchor="middle" fill="#9B9585"
        fontSize={size * 0.072} fontFamily="Sarabun,sans-serif">{centerUnit || 'THB'}</text>
    </svg>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
export function BarChart({ items = [], unitLabel = 'THB/rai' }) {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 130 }}>
      {items.map((item, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: item.color, textAlign: 'center', lineHeight: 1.3 }}>
            {fmt(item.subValue)}<br />
            <span style={{ fontSize: 10, fontWeight: 500, color: '#9B9585' }}>{unitLabel}</span>
          </div>
          <div style={{
            width: '72%',
            height: `${Math.max(4, (item.value / max) * 72)}px`,
            background: item.color,
            borderRadius: '6px 6px 0 0',
            transition: 'height 0.7s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: `0 -2px 8px ${item.color}44`,
          }} />
          <div style={{ fontSize: 12, fontWeight: 600, color: '#44403C', textAlign: 'center' }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color, bg }) {
  return (
    <div style={{ background: bg || '#F0FDF4', borderRadius: 16, padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#6B6660', lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: color || '#16A34A', lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#9B9585', marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

// ─── Input Group ──────────────────────────────────────────────────────────────
export function InputGroup({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#44403C', marginBottom: hint ? 3 : 7 }}>{label}</div>
      {hint && <div style={{ fontSize: 12, color: '#9B9585', marginBottom: 7 }}>{hint}</div>}
      {children}
    </div>
  );
}

// ─── Text Input ───────────────────────────────────────────────────────────────
export function TextInput({ value, onChange, placeholder }) {
  return (
    <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', padding: '13px 16px', fontFamily: 'Sarabun,sans-serif', fontSize: 16, border: '2px solid #E8E8E0', borderRadius: 12, background: 'white', color: '#1C1917', outline: 'none', WebkitAppearance: 'none', transition: 'border-color 0.2s' }}
      onFocus={e => e.target.style.borderColor = '#16A34A'}
      onBlur={e => e.target.style.borderColor = '#E8E8E0'}
    />
  );
}

// ─── Number Input ─────────────────────────────────────────────────────────────
export function NumberInput({ value, onChange, placeholder, unit }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', border: `2px solid ${focused ? '#16A34A' : '#E8E8E0'}`, borderRadius: 12, overflow: 'hidden', background: 'white', transition: 'border-color 0.2s' }}>
      <input type="number" inputMode="decimal"
        value={value === 0 ? '' : (value || '')}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '0'}
        style={{ flex: 1, padding: '13px 16px', fontFamily: 'Sarabun,sans-serif', fontSize: 18, fontWeight: 600, border: 'none', background: 'transparent', color: '#1C1917', outline: 'none', minWidth: 0 }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      />
      {unit && (
        <div style={{ padding: '0 14px', fontSize: 13, color: '#9B9585', fontWeight: 600, borderLeft: '1px solid #E8E8E0', background: '#F5F5EF', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{unit}</div>
      )}
    </div>
  );
}

// ─── Select Input ─────────────────────────────────────────────────────────────
export function SelectInput({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '13px 40px 13px 16px', fontFamily: 'Sarabun,sans-serif', fontSize: 16, border: '2px solid #E8E8E0', borderRadius: 12, background: 'white', color: '#1C1917', outline: 'none', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9B9585', pointerEvents: 'none' }}>▼</div>
    </div>
  );
}

// ─── Radio Group ──────────────────────────────────────────────────────────────
export function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map(opt => (
        <div key={opt.value} onClick={() => onChange(opt.value)}
          style={{ flex: 1, minWidth: 60, padding: '10px 8px', border: `2px solid ${value === opt.value ? '#16A34A' : '#E8E8E0'}`, borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: value === opt.value ? '#16A34A' : '#44403C', background: value === opt.value ? '#F0FDF4' : 'white', transition: 'all 0.15s' }}>
          {opt.label}
        </div>
      ))}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: '#F0F0EA', borderRadius: 10, padding: 3 }}>
      {options.map(opt => (
        <div key={opt.value} onClick={() => onChange(opt.value)}
          style={{ flex: 1, padding: '8px 6px', textAlign: 'center', fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: 'pointer', background: value === opt.value ? 'white' : 'transparent', color: value === opt.value ? '#16A34A' : '#9B9585', boxShadow: value === opt.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
          {opt.label}
        </div>
      ))}
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Btn({ onClick, children, variant = 'primary', disabled, style: extra = {} }) {
  const V = {
    primary:   { background: '#16A34A', color: 'white', border: 'none' },
    secondary: { background: '#F0FDF4', color: '#16A34A', border: '2px solid #BBF7D0' },
    ghost:     { background: 'transparent', color: '#9B9585', border: '2px solid #E8E8E0' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: '100%', padding: '15px', fontFamily: 'Sarabun,sans-serif', fontSize: 16, fontWeight: 700, borderRadius: 14, cursor: disabled ? 'default' : 'pointer', transition: 'all 0.15s', opacity: disabled ? 0.5 : 1, ...(V[variant] || V.primary), ...extra }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >{children}</button>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style: s = {} }) {
  return (
    <div style={{ background: 'white', borderRadius: 18, padding: 16, marginBottom: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.055)', ...s }}>{children}</div>
  );
}
