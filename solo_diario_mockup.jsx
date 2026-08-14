import React, { useState } from 'react';
import {
  User, Lock, Search, Plus, Wallet, Users, CheckCircle2,
  ChevronLeft, ChevronRight, Phone, Calendar as CalendarIcon,
  CheckCircle, Download, Home, UserPlus, LogOut, Banknote,
  AlertTriangle, X, FileText, Landmark, Trash2,
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

  .sd-root{
    --bg:#15130F; --surface:#1F1B14; --surface2:#29241A; --border:rgba(245,179,1,0.14);
    --amber:#F5B301; --amber-soft:#FFD666; --amber-dim:#B98A03;
    --text:#F6F1E7; --muted:#A79E8C; --green:#5CD68B; --red:#F2665A;
    background:var(--bg); color:var(--text); min-height:100vh;
  }
  .sd-display{ font-family:'Sora',sans-serif; }
  .sd-mono{ font-family:'JetBrains Mono',monospace; }

  .sd-login-wrap{ min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; }
  .sd-login-card{ width:100%; max-width:360px; background:var(--surface); border:1px solid var(--border); border-radius:24px; padding:36px 28px; }

  .sd-sidebar{ width:220px; border-right:1px solid var(--border); padding:24px 18px; flex-direction:column; gap:28px; background:var(--surface); }
  .sd-sidebar-logo{ display:flex; align-items:center; gap:10px; }
  .sd-logo-mark{ width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,var(--amber-soft),var(--amber)); display:flex; align-items:center; justify-content:center; font-family:'Sora',sans-serif; font-weight:800; color:#15130F; font-size:1rem; flex-shrink:0; }
  .sd-logo-word{ font-family:'Sora',sans-serif; font-weight:700; font-size:1.05rem; letter-spacing:-0.01em; }
  .sd-nav-link{ display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:12px; color:var(--muted); font-size:0.86rem; font-weight:600; cursor:pointer; transition:all .15s ease; background:transparent; border:none; width:100%; text-align:left; }
  .sd-nav-link:hover{ background:var(--surface2); color:var(--text); }
  .sd-nav-link.active{ background:rgba(245,179,1,0.12); color:var(--amber-soft); }

  .sd-topbar{ display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); position:sticky; top:0; background:rgba(21,19,15,0.85); backdrop-filter:blur(8px); z-index:10; }
  .sd-icon-btn{ width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:var(--surface2); border:1px solid var(--border); color:var(--text); cursor:pointer; flex-shrink:0; }
  .sd-icon-btn:hover{ border-color:var(--amber-dim); color:var(--amber-soft); }

  .sd-card{ background:var(--surface); border:1px solid var(--border); border-radius:18px; }
  .sd-stat{ display:flex; align-items:center; gap:8px; padding:10px; }
  .sd-stat-icon{ width:34px; height:34px; border-radius:10px; background:rgba(245,179,1,0.1); color:var(--amber); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sd-stat-value{ font-size:0.92rem; font-weight:600; line-height:1.1; }
  .sd-stat-label{ font-size:0.62rem; color:var(--muted); margin-top:2px; }
  .sd-stat-clickable{ cursor:pointer; text-align:left; transition:border-color .15s ease, transform .1s ease; }
  .sd-stat-clickable:hover{ border-color:var(--red); transform:translateY(-1px); }

  .sd-steps{ display:flex; flex-wrap:wrap; gap:8px; }
  .sd-step{ width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.76rem; font-weight:700; font-family:'JetBrains Mono',monospace; background:var(--surface2); color:var(--muted); border:1.5px solid var(--border); flex-shrink:0; }
  .sd-step.paid{ background:var(--amber); color:#15130F; border-color:var(--amber); }
  .sd-step.current{ background:transparent; color:var(--amber-soft); border:2px solid var(--amber); }

  .sd-hist-row{ display:flex; align-items:center; gap:10px; padding:10px 2px; border-bottom:1px solid var(--border); }
  .sd-hist-row:last-child{ border-bottom:none; }
  .sd-hist-date{ font-size:0.72rem; color:var(--muted); width:48px; flex-shrink:0; }
  .sd-hist-label{ flex:1; font-size:0.84rem; font-weight:600; }
  .sd-hist-amount{ font-size:0.82rem; font-weight:700; }

  .sd-input{ width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:12px 14px; color:var(--text); font-family:'Inter',sans-serif; font-size:0.9rem; outline:none; transition:border-color .15s ease; }
  .sd-input:focus{ border-color:var(--amber); }
  .sd-input::placeholder{ color:var(--muted); }
  .sd-label{ font-size:0.7rem; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:6px; display:flex; align-items:center; gap:5px; }

  .sd-btn-primary{ background:linear-gradient(135deg,var(--amber-soft),var(--amber)); color:#15130F; font-weight:700; border:none; border-radius:14px; padding:14px 20px; font-size:0.9rem; cursor:pointer; transition:transform .12s ease, box-shadow .12s ease; box-shadow:0 8px 20px -8px rgba(245,179,1,0.5); }
  .sd-btn-primary:hover{ transform:translateY(-1px); box-shadow:0 10px 24px -8px rgba(245,179,1,0.65); }
  .sd-btn-primary:disabled{ opacity:0.4; cursor:not-allowed; box-shadow:none; }
  .sd-btn-primary:disabled:hover{ transform:none; }
  .sd-btn-outline{ background:transparent; color:var(--amber-soft); border:1.5px solid var(--amber-dim); border-radius:14px; padding:12.5px 20px; font-size:0.88rem; font-weight:600; cursor:pointer; }
  .sd-btn-outline:hover{ background:rgba(245,179,1,0.08); }
  .sd-btn-danger{ background:transparent; color:var(--red); border:1.5px solid rgba(242,102,90,0.45); border-radius:14px; padding:12.5px 20px; font-size:0.88rem; font-weight:600; cursor:pointer; }
  .sd-btn-danger:hover{ background:rgba(242,102,90,0.1); border-color:var(--red); }
  .sd-btn-danger-solid{ background:var(--red); color:#1F0B09; font-weight:700; border:none; border-radius:14px; padding:12.5px 20px; font-size:0.88rem; cursor:pointer; }
  .sd-btn-danger-solid:hover{ filter:brightness(1.08); }

  .sd-badge{ font-size:0.62rem; font-weight:700; padding:3px 9px; border-radius:100px; text-transform:uppercase; letter-spacing:0.03em; white-space:nowrap; }
  .sd-badge.paid{ background:rgba(92,214,139,0.14); color:var(--green); }
  .sd-badge.pending{ background:rgba(245,179,1,0.14); color:var(--amber-soft); }
  .sd-badge.overdue{ background:rgba(242,102,90,0.16); color:var(--red); }

  .sd-modal-overlay{ position:fixed; inset:0; background:rgba(10,9,6,0.72); backdrop-filter:blur(2px); display:flex; align-items:center; justify-content:center; padding:20px; z-index:60; animation:sdFadeIn .18s ease; }
  @keyframes sdFadeIn{ from{ opacity:0; } to{ opacity:1; } }
  .sd-modal{ width:100%; max-width:420px; max-height:88vh; background:var(--surface); border:1px solid var(--border); border-radius:22px; display:flex; flex-direction:column; overflow:hidden; animation:sdModalIn .22s ease; }
  @keyframes sdModalIn{ from{ opacity:0; transform:scale(0.95) translateY(8px); } to{ opacity:1; transform:scale(1) translateY(0); } }
  .sd-modal-header{ display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .sd-modal-body{ overflow-y:auto; padding:16px; }
  .sd-modal-actions{ display:flex; gap:10px; padding:14px 16px; border-top:1px solid var(--border); flex-shrink:0; }

  .sd-pdf-sheet{ background:#F6F1E6; color:#221F19; border-radius:14px; padding:22px 20px; font-family:'Inter',sans-serif; box-shadow:0 10px 30px -12px rgba(0,0,0,0.5); }
  .sd-pdf-section-label{ font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6B6458; margin-bottom:6px; }
  .sd-pdf-amount-box{ background:rgba(34,31,25,0.05); border-radius:12px; padding:12px 14px; margin-bottom:14px; }
  .sd-pdf-table-head{ display:grid; grid-template-columns:1fr 1fr 1fr 1fr; font-size:0.6rem; font-weight:700; text-transform:uppercase; letter-spacing:0.03em; color:#6B6458; padding:0 2px 6px; border-bottom:1.5px solid #221F19; }
  .sd-pdf-table-row{ display:grid; grid-template-columns:1fr 1fr 1fr 1fr; font-size:0.72rem; padding:6px 2px; border-bottom:1px solid rgba(34,31,25,0.08); align-items:center; }
  .sd-pdf-table-row:last-child{ border-bottom:none; }
  .sd-pdf-summary{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:14px; }
  .sd-pdf-summary-box{ border-radius:10px; padding:10px; }
  .sd-pdf-summary-label{ font-size:0.56rem; font-weight:700; text-transform:uppercase; letter-spacing:0.03em; opacity:0.75; margin-bottom:3px; }
  .sd-pdf-summary-value{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:0.82rem; }

  .sd-client-row{ display:flex; align-items:center; gap:12px; width:100%; padding:12px; background:var(--surface); border:1px solid var(--border); border-radius:16px; cursor:pointer; text-align:left; transition:border-color .15s ease, transform .1s ease; }
  .sd-client-row:hover{ border-color:var(--amber-dim); transform:translateY(-1px); }
  .sd-avatar{ width:40px; height:40px; border-radius:12px; background:var(--surface2); color:var(--amber-soft); font-family:'Sora',sans-serif; font-weight:700; font-size:0.78rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sd-client-info{ flex:1; min-width:0; display:flex; flex-direction:column; gap:6px; }
  .sd-client-name{ font-weight:600; font-size:0.86rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sd-client-right{ display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
  .sd-client-amount{ font-size:0.8rem; font-weight:600; }

  .sd-dot{ width:7px; height:7px; border-radius:50%; background:var(--surface2); border:1px solid var(--border); display:inline-block; }
  .sd-dot-paid{ background:var(--amber); border-color:var(--amber); }
  .sd-dot-missed{ background:transparent; border:1.5px solid var(--red); }

  .sd-segmented{ display:flex; background:var(--surface2); border-radius:12px; padding:4px; gap:4px; }
  .sd-seg-btn{ flex:1; padding:9px 0; border-radius:9px; border:none; background:transparent; color:var(--muted); font-size:0.78rem; font-weight:600; cursor:pointer; }
  .sd-seg-btn.active{ background:var(--amber); color:#15130F; }

  .sd-day-cell{ aspect-ratio:1; border-radius:8px; border:none; background:transparent; color:var(--text); font-size:0.72rem; cursor:pointer; }
  .sd-day-cell:hover{ background:var(--surface2); }

  .sd-toast{ position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--surface2); border:1px solid var(--amber-dim); color:var(--text); padding:12px 20px; border-radius:100px; font-size:0.82rem; font-weight:600; z-index:50; box-shadow:0 10px 30px -10px rgba(0,0,0,0.6); animation:sdToastIn .25s ease; }
  @keyframes sdToastIn{ from{ opacity:0; transform:translate(-50%,10px); } to{ opacity:1; transform:translate(-50%,0); } }

  .sd-bottomnav{ position:fixed; bottom:0; left:0; right:0; background:rgba(31,27,20,0.94); backdrop-filter:blur(10px); border-top:1px solid var(--border); display:flex; justify-content:space-around; align-items:flex-end; padding:10px 0 16px; z-index:20; }
  .sd-bottomnav-btn{ display:flex; flex-direction:column; align-items:center; gap:3px; background:transparent; border:none; color:var(--muted); font-size:0.62rem; font-weight:600; cursor:pointer; min-width:52px; }
  .sd-bottomnav-btn.active{ color:var(--amber-soft); }
  .sd-fab{ width:46px; height:46px; border-radius:14px; background:linear-gradient(135deg,var(--amber-soft),var(--amber)); display:flex; align-items:center; justify-content:center; color:#15130F; margin-top:-26px; box-shadow:0 8px 20px -6px rgba(245,179,1,0.6); }

  .sd-option-card{ display:flex; align-items:center; gap:14px; padding:18px; background:var(--surface); border:1px solid var(--border); border-radius:18px; cursor:pointer; transition:border-color .15s ease, transform .1s ease; width:100%; text-align:left; }
  .sd-option-card:hover{ border-color:var(--amber-dim); transform:translateY(-1px); }

  .sd-success-icon{ width:64px; height:64px; border-radius:50%; background:rgba(92,214,139,0.12); color:var(--green); display:flex; align-items:center; justify-content:center; animation:sdCheckPop .4s ease; }
  @keyframes sdCheckPop{ 0%{ transform:scale(0.6); opacity:0; } 60%{ transform:scale(1.08); } 100%{ transform:scale(1); opacity:1; } }
`;

const initialClients = [
  { id: 1, name: 'Marcela Ruiz', phone: '351 555 0123', monto: 150000, cuotas: 12, cuotaPagada: 5, cuotaMonto: 14500, frecuencia: 'Semana', dueToday: true, pagadoHoy: false, atrasado: false, cuotasHoy: 0, streak: [true, true, false, true, true, null, null] },
  { id: 2, name: 'Hector Gimenez', phone: '351 555 0456', monto: 80000, cuotas: 8, cuotaPagada: 3, cuotaMonto: 11000, frecuencia: 'Semana', dueToday: true, pagadoHoy: false, atrasado: false, cuotasHoy: 0, streak: [true, true, true, true, false, null, null] },
  { id: 3, name: 'Luciana Paz', phone: '351 555 0789', monto: 200000, cuotas: 10, cuotaPagada: 10, cuotaMonto: 22000, frecuencia: 'Quincena', dueToday: false, pagadoHoy: false, atrasado: false, cuotasHoy: 0, streak: [true, true, true, true, true, true, true] },
  { id: 4, name: 'Diego Ferreyra', phone: '351 555 0222', monto: 60000, cuotas: 6, cuotaPagada: 1, cuotaMonto: 10500, frecuencia: 'Semana', dueToday: false, pagadoHoy: false, atrasado: true, cuotasHoy: 0, streak: [true, false, null, null, null, null, null] },
  { id: 5, name: 'Rosa Aguirre', phone: '351 555 0999', monto: 120000, cuotas: 12, cuotaPagada: 7, cuotaMonto: 10800, frecuencia: 'Mensual', dueToday: false, pagadoHoy: false, atrasado: true, cuotasHoy: 0, streak: [true, true, true, false, true, true, null] },
];

const fmt = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n || 0);

const INTERVALS = { Semana: 7, Quincena: 15, Mensual: 30 };

function generateCuotas(client) {
  const days = INTERVALS[client.frecuencia] || 7;
  const today = new Date(2026, 7, 14);
  const nextIndex = client.cuotaPagada + 1;
  const anchor = new Date(today);
  if (!client.dueToday) anchor.setDate(anchor.getDate() + days);
  const list = [];
  for (let i = 1; i <= client.cuotas; i++) {
    const diff = i - nextIndex;
    const d = new Date(anchor);
    d.setDate(d.getDate() + diff * days);
    list.push({ n: i, date: d, monto: client.cuotaMonto, pagada: i <= client.cuotaPagada });
  }
  return list;
}

function formatShortDate(date) {
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }).replace('.', '');
}

const backTargets = {
  agregar: 'dashboard',
  nuevoCliente: 'agregar',
  nuevoPrestamo: 'agregar',
  nuevoPrestamoForm: 'nuevoPrestamo',
  pago: 'dashboard',
};

function initials(name) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function DayDots({ streak }) {
  return (
    <div className="flex gap-1">
      {streak.map((s, i) => (
        <span key={i} className={`sd-dot ${s === true ? 'sd-dot-paid' : s === false ? 'sd-dot-missed' : ''}`} />
      ))}
    </div>
  );
}

function StepProgress({ total, paid }) {
  const items = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="sd-steps">
      {items.map((n) => {
        const isPaid = n <= paid;
        const isCurrent = n === paid + 1;
        return (
          <div key={n} className={`sd-step ${isPaid ? 'paid' : isCurrent ? 'current' : ''}`}>{n}</div>
        );
      })}
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="sd-segmented">
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)} className={`sd-seg-btn ${value === opt ? 'active' : ''}`}>{opt}</button>
      ))}
    </div>
  );
}

function formatThousands(digits) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function MoneyInput({ value, onChange, placeholder }) {
  const display = value === '' || value === undefined || value === null ? '' : formatThousands(String(value));
  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    onChange(digits === '' ? '' : Number(digits));
  };
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '0.88rem' }}>$</span>
      <input className="sd-input sd-mono" style={{ paddingLeft: '26px' }} inputMode="numeric" placeholder={placeholder} value={display} onChange={handleChange} />
    </div>
  );
}

function MiniCalendar({ selected, onSelect }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const base = new Date(2026, 7, 1);
  const viewDate = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const rawLabel = viewDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  const monthWord = rawLabel.split(' ')[0];
  const monthLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
  const weekdays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="sd-card" style={{ padding: '14px' }}>
      <div className="flex items-center justify-between mb-3">
        <button className="sd-icon-btn" style={{ width: '28px', height: '28px' }} onClick={() => setMonthOffset((m) => m - 1)}><ChevronLeft size={14} /></button>
        <span className="sd-display" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CalendarIcon size={13} style={{ color: 'var(--muted)' }} /> {monthLabel}
        </span>
        <button className="sd-icon-btn" style={{ width: '28px', height: '28px' }} onClick={() => setMonthOffset((m) => m + 1)}><ChevronRight size={14} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((w, i) => (<div key={i} style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--muted)' }}>{w}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const value = `${d} ${monthWord}`;
          const isSelected = selected === value;
          return (
            <button key={i} onClick={() => onSelect(value)} className="sd-day-cell" style={isSelected ? { background: 'var(--amber)', color: '#15130F', fontWeight: 700 } : {}}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, tone = 'amber', onClick }) {
  const bg = tone === 'red' ? 'rgba(242,102,90,0.14)' : 'rgba(245,179,1,0.1)';
  const color = tone === 'red' ? 'var(--red)' : 'var(--amber)';
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp type={onClick ? 'button' : undefined} onClick={onClick} className={`sd-card sd-stat ${onClick ? 'sd-stat-clickable' : ''}`}>
      <div className="sd-stat-icon" style={{ background: bg, color }}>{icon}</div>
      <div className="min-w-0">
        <div className="sd-mono sd-stat-value" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
        <div className="sd-stat-label">{label}</div>
      </div>
    </Comp>
  );
}

function ClientRow({ client, onClick }) {
  const badge = client.cuotaPagada >= client.cuotas
    ? { cls: 'paid', text: 'Completado' }
    : client.pagadoHoy
      ? { cls: 'paid', text: 'Pagado' }
      : client.atrasado
        ? { cls: 'overdue', text: 'Atrasado' }
        : { cls: 'pending', text: 'Pendiente' };
  return (
    <button onClick={onClick} className="sd-client-row">
      <div className="sd-avatar">{initials(client.name)}</div>
      <div className="sd-client-info">
        <div className="sd-client-name">{client.name}</div>
        <DayDots streak={client.streak} />
      </div>
      <div className="sd-client-right">
        <div className="sd-mono sd-client-amount">{fmt(client.cuotaMonto)}</div>
        <span className={`sd-badge ${badge.cls}`}>{badge.text}</span>
      </div>
    </button>
  );
}

function LoginView({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');
  return (
    <div className="sd-login-wrap">
      <div className="sd-login-card">
        <div className="flex flex-col items-center gap-3" style={{ marginBottom: '28px' }}>
          <div className="sd-logo-mark" style={{ width: '52px', height: '52px', fontSize: '1.4rem' }}>S</div>
          <div style={{ textAlign: 'center' }}>
            <div className="sd-display" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Solo Diario</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>Gestión de préstamos y cobros</div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <span className="sd-label">Usuario</span>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input className="sd-input" style={{ paddingLeft: '34px' }} value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="tu usuario" />
            </div>
          </div>
          <div>
            <span className="sd-label">Contraseña</span>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input className="sd-input" style={{ paddingLeft: '34px' }} type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <button className="sd-btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={onLogin}>Ingresar</button>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.66rem', color: 'var(--muted)', marginTop: '22px' }}>Acceso exclusivo · un solo usuario</div>
      </div>
    </div>
  );
}

function Sidebar({ screen, goTo, onLogout }) {
  return (
    <div className="sd-sidebar hidden md:flex">
      <div className="sd-sidebar-logo">
        <div className="sd-logo-mark">S</div>
        <div className="sd-logo-word">Solo Diario</div>
      </div>
      <div className="flex flex-col gap-1">
        <button className={`sd-nav-link ${screen === 'dashboard' || screen === 'pago' ? 'active' : ''}`} onClick={() => goTo('dashboard')}><Home size={16} /> Inicio</button>
        <button className={`sd-nav-link ${screen !== 'dashboard' && screen !== 'pago' ? 'active' : ''}`} onClick={() => goTo('agregar')}><Plus size={16} /> Agregar</button>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <button className="sd-nav-link" onClick={onLogout}><LogOut size={16} /> Cerrar sesión</button>
      </div>
    </div>
  );
}

function BottomNav({ screen, goTo, onLogout }) {
  return (
    <div className="sd-bottomnav md:hidden">
      <button className={`sd-bottomnav-btn ${screen === 'dashboard' || screen === 'pago' ? 'active' : ''}`} onClick={() => goTo('dashboard')}>
        <Home size={19} /> Inicio
      </button>
      <button className="sd-bottomnav-btn" onClick={() => goTo('agregar')}>
        <div className="sd-fab"><Plus size={20} /></div>
      </button>
      <button className="sd-bottomnav-btn" onClick={onLogout}>
        <LogOut size={19} /> Salir
      </button>
    </div>
  );
}

function TopBar({ screen, goBack, dateLabel }) {
  const titles = { dashboard: 'Solo Diario', agregar: 'Agregar', nuevoCliente: 'Nuevo cliente', nuevoPrestamo: 'Nuevo préstamo', nuevoPrestamoForm: 'Nuevo préstamo', pago: 'Cobro' };
  return (
    <div className="sd-topbar">
      <div className="flex items-center gap-3">
        {screen !== 'dashboard' ? (
          <button className="sd-icon-btn" onClick={goBack}><ChevronLeft size={18} /></button>
        ) : (
          <div className="sd-logo-mark md:hidden" style={{ width: '30px', height: '30px', fontSize: '0.82rem' }}>S</div>
        )}
        <div>
          <div className="sd-display" style={{ fontSize: '0.92rem', fontWeight: 700 }}>{titles[screen] || 'Solo Diario'}</div>
          {screen === 'dashboard' && <div style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{dateLabel}</div>}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ clients, dueToday, filtered, query, setQuery, openPago, goTo, totalPrestado, pagosHoy, atrasados, carteraPendiente, onOpenAtrasados }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-5 md:px-8 md:py-8 flex flex-col gap-6">
      <div>
        <h1 className="sd-display" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Clientes de hoy</h1>
        {dueToday.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.84rem', marginTop: '8px' }}>No hay cobros programados para hoy.</p>
        ) : (
          <div className="flex flex-col gap-2 mt-3">
            {dueToday.map((c) => <ClientRow key={c.id} client={c} onClick={() => openPago(c.id)} />)}
          </div>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estadísticas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 mt-3">
          <StatCard icon={<Wallet size={17} />} label="Prestado" value={fmt(totalPrestado)} />
          <StatCard icon={<Users size={17} />} label="Clientes" value={clients.length} />
          <StatCard icon={<CheckCircle2 size={17} />} label="Pagos hoy" value={pagosHoy} />
          <StatCard icon={<AlertTriangle size={17} />} label="Atrasados" value={atrasados} tone="red" onClick={atrasados > 0 ? onOpenAtrasados : undefined} />
          <StatCard icon={<Landmark size={17} />} label="Cartera pendiente" value={fmt(carteraPendiente)} />
        </div>
      </div>

      <div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="sd-input" style={{ paddingLeft: '36px' }} placeholder="Buscar cliente" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button className="sd-btn-primary" style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => goTo('agregar')}>
          <Plus size={17} /> Agregar cliente
        </button>
      </div>

      <div>
        <h2 style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>Todos los clientes</h2>
        <div className="flex flex-col gap-2">
          {filtered.map((c) => <ClientRow key={c.id} client={c} onClick={() => openPago(c.id)} />)}
        </div>
      </div>
    </div>
  );
}

function Agregar({ goTo }) {
  return (
    <div className="max-w-md mx-auto px-4 py-6 md:py-10 flex flex-col gap-3">
      <h1 className="sd-display" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>Agregar</h1>
      <button className="sd-option-card" onClick={() => goTo('nuevoCliente')}>
        <div className="sd-stat-icon" style={{ width: '44px', height: '44px' }}><UserPlus size={20} /></div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Nuevo cliente</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Cargar datos y primer préstamo</div>
        </div>
      </button>
      <button className="sd-option-card" onClick={() => goTo('nuevoPrestamo')}>
        <div className="sd-stat-icon" style={{ width: '44px', height: '44px' }}><Banknote size={20} /></div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Nuevo préstamo</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Para un cliente que ya existe</div>
        </div>
      </button>
    </div>
  );
}

function NuevoClienteForm({ onSave, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [monto, setMonto] = useState('');
  const [cuotas, setCuotas] = useState('');
  const [frecuencia, setFrecuencia] = useState('Semana');
  const [fecha, setFecha] = useState('');
  const [cuotaMonto, setCuotaMonto] = useState('');

  const canSave = nombre.trim() && telefono.trim() && Number(monto) > 0 && Number(cuotas) > 0 && Number(cuotaMonto) > 0;

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:py-10 flex flex-col gap-4 pb-10">
      <h1 className="sd-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Nuevo cliente</h1>

      <div>
        <span className="sd-label">Nombre</span>
        <input className="sd-input" placeholder="Nombre y apellido" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div>
        <span className="sd-label">Teléfono</span>
        <input className="sd-input" placeholder="351 555 0000" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </div>
      <div>
        <span className="sd-label">Cantidad prestada</span>
        <MoneyInput value={monto} onChange={setMonto} placeholder="0" />
      </div>
      <div>
        <span className="sd-label">Cuotas</span>
        <input className="sd-input" type="number" placeholder="Cantidad de cuotas" value={cuotas} onChange={(e) => setCuotas(e.target.value)} />
      </div>
      <div>
        <span className="sd-label">Frecuencia de pago</span>
        <Segmented options={['Semana', 'Quincena', 'Mensual']} value={frecuencia} onChange={setFrecuencia} />
      </div>
      <div>
        <span className="sd-label">Fecha de inicio</span>
        <MiniCalendar selected={fecha} onSelect={setFecha} />
      </div>
      <div>
        <span className="sd-label">Cantidad por cuota</span>
        <MoneyInput value={cuotaMonto} onChange={setCuotaMonto} placeholder="0" />
        {Number(monto) > 0 && Number(cuotas) > 0 && (
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '6px' }}>
            Sin interés sería {fmt(Math.round(Number(monto) / Number(cuotas)))} — cargá el valor real con interés
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-2">
        <button className="sd-btn-outline" style={{ flex: 1 }} onClick={onCancel}>Cancelar</button>
        <button className="sd-btn-primary" style={{ flex: 2 }} disabled={!canSave} onClick={() => canSave && onSave({ nombre, telefono, monto: Number(monto), cuotas: Number(cuotas), frecuencia, fecha, cuotaMonto: Number(cuotaMonto) })}>Guardar cliente</button>
      </div>
    </div>
  );
}

function NuevoPrestamoPicker({ clients, onPick }) {
  const [q, setQ] = useState('');
  const filtered = clients.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="max-w-md mx-auto px-4 py-6 md:py-10 flex flex-col gap-3">
      <h1 className="sd-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Nuevo préstamo</h1>
      <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Elegí el cliente para cargar el préstamo</p>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
        <input className="sd-input" style={{ paddingLeft: '36px' }} placeholder="Buscar cliente" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2 mt-1">
        {filtered.map((c) => (
          <button key={c.id} className="sd-client-row" onClick={() => onPick(c.id)}>
            <div className="sd-avatar">{initials(c.name)}</div>
            <div className="sd-client-info">
              <div className="sd-client-name">{c.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{c.cuotas} cuotas · {c.frecuencia}</div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function NuevoPrestamoForm({ client, onSave, onCancel }) {
  const [monto, setMonto] = useState('');
  const [cuotas, setCuotas] = useState('');
  const [frecuencia, setFrecuencia] = useState('Semana');
  const [fecha, setFecha] = useState('');
  const [cuotaMonto, setCuotaMonto] = useState('');
  const canSave = Number(monto) > 0 && Number(cuotas) > 0 && Number(cuotaMonto) > 0;

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:py-10 flex flex-col gap-4 pb-10">
      <h1 className="sd-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Nuevo préstamo</h1>
      <div className="sd-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="sd-avatar">{initials(client.name)}</div>
        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{client.name}</div>
      </div>
      <div>
        <span className="sd-label">Cantidad prestada</span>
        <MoneyInput value={monto} onChange={setMonto} placeholder="0" />
      </div>
      <div>
        <span className="sd-label">Cuotas</span>
        <input className="sd-input" type="number" placeholder="Cantidad de cuotas" value={cuotas} onChange={(e) => setCuotas(e.target.value)} />
      </div>
      <div>
        <span className="sd-label">Frecuencia de pago</span>
        <Segmented options={['Semana', 'Quincena', 'Mensual']} value={frecuencia} onChange={setFrecuencia} />
      </div>
      <div>
        <span className="sd-label">Fecha de inicio</span>
        <MiniCalendar selected={fecha} onSelect={setFecha} />
      </div>
      <div>
        <span className="sd-label">Cantidad por cuota</span>
        <MoneyInput value={cuotaMonto} onChange={setCuotaMonto} placeholder="0" />
        {Number(monto) > 0 && Number(cuotas) > 0 && (
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '6px' }}>
            Sin interés sería {fmt(Math.round(Number(monto) / Number(cuotas)))} — cargá el valor real con interés
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-2">
        <button className="sd-btn-outline" style={{ flex: 1 }} onClick={onCancel}>Cancelar</button>
        <button className="sd-btn-primary" style={{ flex: 2 }} disabled={!canSave} onClick={() => canSave && onSave({ monto: Number(monto), cuotas: Number(cuotas), frecuencia, fecha, cuotaMonto: Number(cuotaMonto) })}>Guardar préstamo</button>
      </div>
    </div>
  );
}

function PagoScreen({ client, onConfirm, onDownload, onDelete }) {
  if (!client) return null;
  const cuotas = generateCuotas(client);
  const historial = cuotas.filter((c) => c.pagada).slice().reverse();
  const sectionLabel = { fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' };
  const completed = client.cuotaPagada >= client.cuotas;

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:py-10 flex flex-col gap-5 pb-10">
      <div className="flex items-center gap-3">
        <div className="sd-avatar" style={{ width: '52px', height: '52px', fontSize: '1rem' }}>{initials(client.name)}</div>
        <div>
          <div className="sd-display" style={{ fontSize: '1.05rem', fontWeight: 700 }}>{client.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <Phone size={12} /> {client.phone}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="sd-card" style={{ padding: '14px' }}>
          <div className="sd-stat-label" style={{ marginBottom: '5px' }}>Monto</div>
          <div className="sd-mono" style={{ fontSize: '1.05rem', fontWeight: 700 }}>{fmt(client.monto)}</div>
        </div>
        <div className="sd-card" style={{ padding: '14px' }}>
          <div className="sd-stat-label" style={{ marginBottom: '5px' }}>Cuotas</div>
          <div className="sd-mono" style={{ fontSize: '1.05rem', fontWeight: 700 }}>{client.cuotas} totales</div>
        </div>
      </div>

      <div>
        <h2 style={sectionLabel}>Progreso del préstamo</h2>
        <StepProgress total={client.cuotas} paid={client.cuotaPagada} />
      </div>

      <div>
        <h2 style={sectionLabel}>Historial de pagos</h2>
        {historial.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Todavía no hay pagos registrados.</p>
        ) : (
          <div className="sd-card" style={{ padding: '4px 14px' }}>
            {historial.map((c) => (
              <div key={c.n} className="sd-hist-row">
                <span className="sd-mono sd-hist-date">{formatShortDate(c.date)}</span>
                <span className="sd-hist-label">Cuota {c.n}</span>
                <span className="sd-mono sd-hist-amount">{fmt(c.monto)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {completed ? (
        <div className="sd-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={22} style={{ color: 'var(--green)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--green)' }}>Préstamo completado</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Ya pagó las {client.cuotas} cuotas</div>
          </div>
        </div>
      ) : (
        <>
          {client.pagadoHoy && (
            <div className="sd-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--green)', fontWeight: 600 }}>
                {client.cuotasHoy} {client.cuotasHoy === 1 ? 'cuota registrada hoy' : 'cuotas registradas hoy'}
              </span>
            </div>
          )}
          <button className="sd-btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={onConfirm}>
            <CheckCircle size={18} /> {client.pagadoHoy ? 'Registrar otro pago' : 'Registrar pago'}
          </button>
          {client.pagadoHoy && (
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center', marginTop: '-8px' }}>
              ¿Quiere cancelar el préstamo? Podés seguir registrando cuotas hasta completarlo.
            </p>
          )}
        </>
      )}

      <button className="sd-btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={onDownload}>
        <FileText size={17} /> Exportar PDF
      </button>

      {completed && (
        <button className="sd-btn-danger" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={onDelete}>
          <Trash2 size={17} /> Eliminar cliente
        </button>
      )}
    </div>
  );
}

function PdfPreviewModal({ client, onClose, onDownload }) {
  if (!client) return null;
  const rows = generateCuotas(client);
  const totalPagado = client.cuotaPagada * client.cuotaMonto;
  const saldo = (client.cuotas - client.cuotaPagada) * client.cuotaMonto;

  return (
    <div className="sd-modal-overlay" onClick={onClose}>
      <div className="sd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sd-modal-header">
          <div className="flex items-center gap-2">
            <FileText size={16} style={{ color: 'var(--amber-soft)' }} />
            <span className="sd-display" style={{ fontSize: '0.85rem', fontWeight: 700 }}>Vista previa</span>
          </div>
          <button className="sd-icon-btn" style={{ width: '30px', height: '30px' }} onClick={onClose}><X size={15} /></button>
        </div>
        <div className="sd-modal-body">
          <div className="sd-pdf-sheet">
            <div className="sd-display" style={{ fontSize: '1.05rem', fontWeight: 800 }}>Solo Diario</div>
            <div style={{ fontSize: '0.72rem', color: '#6B6458', marginTop: '1px' }}>Resumen de préstamo</div>
            <div style={{ fontSize: '0.68rem', color: '#8a7d5f', marginBottom: '14px' }}>Generado el 14 ago 2026</div>

            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{client.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#6B6458', marginBottom: '12px' }}>{client.phone} · Préstamo #{String(client.id).slice(-4).padStart(4, '0')}</div>

            <div className="sd-pdf-amount-box">
              <div className="sd-pdf-section-label" style={{ marginBottom: '2px' }}>Monto</div>
              <div className="sd-mono" style={{ fontWeight: 700, fontSize: '1rem' }}>{fmt(client.monto)}</div>
            </div>

            <div className="sd-pdf-table-head">
              <span>Fecha</span><span>Cuota</span><span>Monto</span><span style={{ textAlign: 'right' }}>Estado</span>
            </div>
            {rows.map((r) => (
              <div key={r.n} className="sd-pdf-table-row">
                <span style={{ color: '#6B6458' }}>{formatShortDate(r.date)}</span>
                <span>Cuota {r.n}</span>
                <span>{fmt(r.monto)}</span>
                <span style={{ textAlign: 'right', fontWeight: 600, color: r.pagada ? '#2F8F5B' : '#8A8071' }}>{r.pagada ? 'Pagado' : 'Pendiente'}</span>
              </div>
            ))}

            <div className="sd-pdf-summary">
              <div className="sd-pdf-summary-box" style={{ background: 'rgba(92,214,139,0.22)' }}>
                <div className="sd-pdf-summary-label" style={{ color: '#1f7a4c' }}>Pagado</div>
                <div className="sd-pdf-summary-value" style={{ color: '#1f7a4c' }}>{fmt(totalPagado)}</div>
              </div>
              <div className="sd-pdf-summary-box" style={{ background: 'rgba(34,31,25,0.07)' }}>
                <div className="sd-pdf-summary-label" style={{ color: '#4a443a' }}>Cuotas pagas</div>
                <div className="sd-pdf-summary-value" style={{ color: '#221F19' }}>{client.cuotaPagada} de {client.cuotas}</div>
              </div>
              <div className="sd-pdf-summary-box" style={{ background: 'rgba(245,179,1,0.26)' }}>
                <div className="sd-pdf-summary-label" style={{ color: '#8a5c00' }}>Saldo</div>
                <div className="sd-pdf-summary-value" style={{ color: '#8a5c00' }}>{fmt(saldo)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sd-modal-actions">
          <button className="sd-btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={onDownload}>
            <Download size={17} /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function OverdueModal({ clients, onClose, onSelect }) {
  return (
    <div className="sd-modal-overlay" onClick={onClose}>
      <div className="sd-modal" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
        <div className="sd-modal-header">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} style={{ color: 'var(--red)' }} />
            <span className="sd-display" style={{ fontSize: '0.85rem', fontWeight: 700 }}>Clientes atrasados</span>
          </div>
          <button className="sd-icon-btn" style={{ width: '30px', height: '30px' }} onClick={onClose}><X size={15} /></button>
        </div>
        <div className="sd-modal-body">
          <div className="flex flex-col gap-2">
            {clients.map((c) => (
              <ClientRow key={c.id} client={c} onClick={() => onSelect(c.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ client, onCancel, onConfirm }) {
  if (!client) return null;
  return (
    <div className="sd-modal-overlay" onClick={onCancel}>
      <div className="sd-modal" style={{ maxWidth: '360px' }} onClick={(e) => e.stopPropagation()}>
        <div className="sd-modal-header">
          <div className="flex items-center gap-2">
            <Trash2 size={16} style={{ color: 'var(--red)' }} />
            <span className="sd-display" style={{ fontSize: '0.85rem', fontWeight: 700 }}>Eliminar cliente</span>
          </div>
          <button className="sd-icon-btn" style={{ width: '30px', height: '30px' }} onClick={onCancel}><X size={15} /></button>
        </div>
        <div className="sd-modal-body">
          <div className="flex items-center gap-3" style={{ marginBottom: '14px' }}>
            <div className="sd-avatar">{initials(client.name)}</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{client.name}</div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            Ya pagó las {client.cuotas} cuotas de su préstamo. Al eliminarlo vas a borrar su historial de pagos de Solo Diario. Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="sd-modal-actions">
          <button className="sd-btn-outline" style={{ flex: 1 }} onClick={onCancel}>Cancelar</button>
          <button className="sd-btn-danger-solid" style={{ flex: 1 }} onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default function SoloDiarioApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState('dashboard');
  const [clients, setClients] = useState(initialClients);
  const [selectedId, setSelectedId] = useState(null);
  const [prestamoTargetId, setPrestamoTargetId] = useState(null);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [pdfPreviewId, setPdfPreviewId] = useState(null);
  const [showAtrasados, setShowAtrasados] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const goTo = (s) => setScreen(s);
  const goBack = () => setScreen(backTargets[screen] || 'dashboard');
  const logout = () => { setLoggedIn(false); setScreen('dashboard'); };

  const dueToday = clients.filter((c) => c.dueToday);
  const filtered = clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const totalPrestado = clients.reduce((a, c) => a + c.monto, 0);
  const pagosHoy = clients.filter((c) => c.pagadoHoy).length;
  const overdueClients = clients.filter((c) => c.atrasado);
  const atrasados = overdueClients.length;
  const carteraPendiente = clients.reduce((a, c) => a + (c.cuotas - c.cuotaPagada) * c.cuotaMonto, 0);
  const selected = clients.find((c) => c.id === selectedId);
  const prestamoTarget = clients.find((c) => c.id === prestamoTargetId);
  const pdfClient = clients.find((c) => c.id === pdfPreviewId);
  const deleteTarget = clients.find((c) => c.id === deleteTargetId);

  const openPago = (id) => { setSelectedId(id); goTo('pago'); };

  const confirmPago = (id) => {
    let finished = false;
    setClients((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const nextPagada = Math.min(c.cuotaPagada + 1, c.cuotas);
      finished = nextPagada >= c.cuotas;
      return { ...c, pagadoHoy: true, cuotaPagada: nextPagada, cuotasHoy: (c.cuotasHoy || 0) + 1, streak: [...c.streak.slice(1), true] };
    }));
    showToast(finished ? 'Préstamo cancelado ✓' : 'Pago registrado ✓');
  };

  const deleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    setDeleteTargetId(null);
    showToast('Cliente eliminado ✓');
    goTo('dashboard');
  };

  const dateLabel = (() => {
    const s = new Date(2026, 7, 14).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  })();

  return (
    <div className="sd-root">
      <style>{styles}</style>
      {!loggedIn ? (
        <LoginView onLogin={() => setLoggedIn(true)} />
      ) : (
        <div className="flex min-h-screen">
          <Sidebar screen={screen} goTo={goTo} onLogout={logout} />
          <div className="flex-1 flex flex-col min-h-screen">
            <TopBar screen={screen} goBack={goBack} dateLabel={dateLabel} />
            <main className="flex-1 pb-28 md:pb-10">
              {screen === 'dashboard' && (
                <Dashboard clients={clients} dueToday={dueToday} filtered={filtered} query={query} setQuery={setQuery} openPago={openPago} goTo={goTo} totalPrestado={totalPrestado} pagosHoy={pagosHoy} atrasados={atrasados} carteraPendiente={carteraPendiente} onOpenAtrasados={() => setShowAtrasados(true)} />
              )}
              {screen === 'agregar' && <Agregar goTo={goTo} />}
              {screen === 'nuevoCliente' && (
                <NuevoClienteForm
                  onCancel={() => goTo('agregar')}
                  onSave={(data) => {
                    setClients((prev) => [...prev, {
                      id: Date.now(), name: data.nombre, phone: data.telefono, monto: data.monto, cuotas: data.cuotas,
                      cuotaPagada: 0, cuotaMonto: data.cuotaMonto, frecuencia: data.frecuencia, dueToday: false, pagadoHoy: false, atrasado: false, cuotasHoy: 0,
                      streak: [null, null, null, null, null, null, null],
                    }]);
                    showToast('Cliente agregado ✓');
                    goTo('dashboard');
                  }}
                />
              )}
              {screen === 'nuevoPrestamo' && (
                <NuevoPrestamoPicker clients={clients} onPick={(id) => { setPrestamoTargetId(id); goTo('nuevoPrestamoForm'); }} />
              )}
              {screen === 'nuevoPrestamoForm' && prestamoTarget && (
                <NuevoPrestamoForm
                  client={prestamoTarget}
                  onCancel={() => goTo('nuevoPrestamo')}
                  onSave={(data) => {
                    setClients((prev) => prev.map((c) => (
                      c.id === prestamoTargetId ? { ...c, monto: data.monto, cuotas: data.cuotas, cuotaPagada: 0, cuotaMonto: data.cuotaMonto, frecuencia: data.frecuencia, dueToday: false, pagadoHoy: false, atrasado: false, cuotasHoy: 0 } : c
                    )));
                    showToast('Préstamo agregado ✓');
                    goTo('dashboard');
                  }}
                />
              )}
              {screen === 'pago' && (
                <PagoScreen client={selected} onConfirm={() => confirmPago(selected.id)} onDownload={() => setPdfPreviewId(selected.id)} onDelete={() => setDeleteTargetId(selected.id)} />
              )}
            </main>
          </div>
          <BottomNav screen={screen} goTo={goTo} onLogout={logout} />
        </div>
      )}
      {pdfClient && (
        <PdfPreviewModal
          client={pdfClient}
          onClose={() => setPdfPreviewId(null)}
          onDownload={() => { showToast('PDF descargado ✓'); setPdfPreviewId(null); }}
        />
      )}
      {showAtrasados && (
        <OverdueModal
          clients={overdueClients}
          onClose={() => setShowAtrasados(false)}
          onSelect={(id) => { setShowAtrasados(false); openPago(id); }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          client={deleteTarget}
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => deleteClient(deleteTarget.id)}
        />
      )}
      {toast && <div className="sd-toast">{toast}</div>}
    </div>
  );
}
