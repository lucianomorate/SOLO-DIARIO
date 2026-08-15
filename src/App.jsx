// Solo Diario - Loan Management Application
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  User, Lock, Search, Plus, Wallet, Users, CheckCircle2,
  ChevronLeft, ChevronRight, Phone, Calendar as CalendarIcon,
  CheckCircle, Download, Home, UserPlus, LogOut, Banknote,
  AlertTriangle, X, FileText, Landmark, Trash2,
} from 'lucide-react';
import './App.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const fmt = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n || 0);
const INTERVALS = { Semana: 7, Quincena: 15, Mensual: 30 };
const backTargets = { agregar: 'dashboard', nuevoCliente: 'agregar', nuevoPrestamo: 'agregar', nuevoPrestamoForm: 'nuevoPrestamo', pago: 'dashboard' };

function initials(name) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function formatShortDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }).replace('.', '');
}

async function descargarPDF(nodeRef, nombreCliente) {
  const canvas = await html2canvas(nodeRef.current, { scale: 2, backgroundColor: '#F6F1E6' });
  const img = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
  pdf.addImage(img, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(`solo-diario-${nombreCliente.replace(/\s+/g, '-').toLowerCase()}.pdf`);
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
  const base = new Date();
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

function ClientRow({ client, onClick, badgeStatus }) {
  return (
    <button onClick={onClick} className="sd-client-row">
      <div className="sd-avatar">{initials(client.nombre)}</div>
      <div className="sd-client-info">
        <div className="sd-client-name">{client.nombre}</div>
        <DayDots streak={client.streak || [null, null, null, null, null, null, null]} />
      </div>
      <div className="sd-client-right">
        <div className="sd-mono sd-client-amount">{fmt(client.valor_cuota)}</div>
        <span className={`sd-badge ${badgeStatus.cls}`}>{badgeStatus.text}</span>
      </div>
    </button>
  );
}

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      onLogin();
    }
  };

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
            <span className="sd-label">Email</span>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input className="sd-input" style={{ paddingLeft: '34px' }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
          </div>
          <div>
            <span className="sd-label">Contraseña</span>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input className="sd-input" style={{ paddingLeft: '34px' }} type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          {error && <div style={{ fontSize: '0.75rem', color: 'var(--red)' }}>{error}</div>}
          <button className="sd-btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading} onClick={handleLogin}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
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

function Dashboard({ clients, dueToday, filtered, query, setQuery, openPago, goTo, stats, onOpenAtrasados }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-5 md:px-8 md:py-8 flex flex-col gap-6">
      <div>
        <h1 className="sd-display" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Clientes de hoy</h1>
        {dueToday.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.84rem', marginTop: '8px' }}>No hay cobros programados para hoy.</p>
        ) : (
          <div className="flex flex-col gap-2 mt-3">
            {dueToday.map((c) => (
              <ClientRow key={c.id} client={c} onClick={() => openPago(c.id)} badgeStatus={c.badgeStatus} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estadísticas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 mt-3">
          <StatCard icon={<Wallet size={17} />} label="Prestado" value={fmt(stats.totalPrestado)} />
          <StatCard icon={<Users size={17} />} label="Clientes" value={stats.clientes} />
          <StatCard icon={<CheckCircle2 size={17} />} label="Pagos hoy" value={stats.pagosHoy} />
          <StatCard icon={<AlertTriangle size={17} />} label="Atrasados" value={stats.atrasados} tone="red" onClick={stats.atrasados > 0 ? onOpenAtrasados : undefined} />
          <StatCard icon={<Landmark size={17} />} label="Cartera pendiente" value={fmt(stats.carteraPendiente)} />
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
          {filtered.map((c) => (
            <ClientRow key={c.id} client={c} onClick={() => openPago(c.id)} badgeStatus={c.badgeStatus} />
          ))}
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

function NuevoClienteForm({ onSave, onCancel, showError }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [monto, setMonto] = useState('');
  const [cuotas, setCuotas] = useState('');
  const [frecuencia, setFrecuencia] = useState('Semana');
  const [fecha, setFecha] = useState('');
  const [cuotaMonto, setCuotaMonto] = useState('');
  const [loading, setLoading] = useState(false);

  const canSave = nombre.trim() && telefono.trim() && Number(monto) > 0 && Number(cuotas) > 0 && Number(cuotaMonto) > 0 && fecha;

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: cliente, error: clienteErr } = await supabase
        .from('clientes')
        .insert([{ nombre, telefono }])
        .select()
        .single();

      if (clienteErr) throw clienteErr;

      const meses = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
      const [dia, mes] = fecha.split(' ');
      const fechaObj = new Date(2026, meses[mes.toLowerCase()], parseInt(dia));
      const fechaInicio = fechaObj.toISOString().split('T')[0];
      const { data: prestamo, error: prestamoErr } = await supabase
        .from('prestamos')
        .insert([{
          cliente_id: cliente.id,
          monto_prestado: Number(monto),
          cantidad_cuotas: Number(cuotas),
          valor_cuota: Number(cuotaMonto),
          frecuencia,
          fecha_inicio: fechaInicio,
        }])
        .select()
        .single();

      if (prestamoErr) throw prestamoErr;

      const cuotasData = [];
      for (let i = 1; i <= Number(cuotas); i++) {
        const d = new Date(fechaInicio);
        const days = INTERVALS[frecuencia] || 7;
        d.setDate(d.getDate() + (i - 1) * days);
        cuotasData.push({
          prestamo_id: prestamo.id,
          numero: i,
          fecha_vencimiento: d.toISOString().split('T')[0],
          monto: Number(cuotaMonto),
          pagada: false,
        });
      }

      const { error: cuotasErr } = await supabase
        .from('cuotas')
        .insert(cuotasData);

      if (cuotasErr) throw cuotasErr;

      onSave();
    } catch (err) {
      if (showError) showError('Error al cargar cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <button className="sd-btn-outline" style={{ flex: 1 }} onClick={onCancel} disabled={loading}>Cancelar</button>
        <button className="sd-btn-primary" style={{ flex: 2 }} disabled={!canSave || loading} onClick={handleSave}>{loading ? 'Guardando...' : 'Guardar cliente'}</button>
      </div>
    </div>
  );
}

function NuevoPrestamoPicker({ clients, onPick }) {
  const [q, setQ] = useState('');
  const filtered = clients.filter((c) => c.nombre.toLowerCase().includes(q.toLowerCase()));
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
            <div className="sd-avatar">{initials(c.nombre)}</div>
            <div className="sd-client-info">
              <div className="sd-client-name">{c.nombre}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{c.phone_or_cuotas}</div>
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
  const [loading, setLoading] = useState(false);
  const canSave = Number(monto) > 0 && Number(cuotas) > 0 && Number(cuotaMonto) > 0 && fecha;

  const handleSave = async () => {
    setLoading(true);
    try {
      const meses = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
      const [dia, mes] = fecha.split(' ');
      const fechaObj = new Date(2026, meses[mes.toLowerCase()], parseInt(dia));
      const fechaInicio = fechaObj.toISOString().split('T')[0];
      const { data: prestamo, error: prestamoErr } = await supabase
        .from('prestamos')
        .insert([{
          cliente_id: client.id,
          monto_prestado: Number(monto),
          cantidad_cuotas: Number(cuotas),
          valor_cuota: Number(cuotaMonto),
          frecuencia,
          fecha_inicio: fechaInicio,
        }])
        .select()
        .single();

      if (prestamoErr) throw prestamoErr;

      const cuotasData = [];
      for (let i = 1; i <= Number(cuotas); i++) {
        const d = new Date(fechaInicio);
        const days = INTERVALS[frecuencia] || 7;
        d.setDate(d.getDate() + (i - 1) * days);
        cuotasData.push({
          prestamo_id: prestamo.id,
          numero: i,
          fecha_vencimiento: d.toISOString().split('T')[0],
          monto: Number(cuotaMonto),
          pagada: false,
        });
      }

      const { error: cuotasErr } = await supabase
        .from('cuotas')
        .insert(cuotasData);

      if (cuotasErr) throw cuotasErr;

      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:py-10 flex flex-col gap-4 pb-10">
      <h1 className="sd-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Nuevo préstamo</h1>
      <div className="sd-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="sd-avatar">{initials(client.nombre)}</div>
        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{client.nombre}</div>
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
        <button className="sd-btn-outline" style={{ flex: 1 }} onClick={onCancel} disabled={loading}>Cancelar</button>
        <button className="sd-btn-primary" style={{ flex: 2 }} disabled={!canSave || loading} onClick={handleSave}>{loading ? 'Guardando...' : 'Guardar préstamo'}</button>
      </div>
    </div>
  );
}

function PagoScreen({ client, cuotas, onConfirm, onDownload, onDelete, loading }) {
  if (!client) return null;
  const historial = cuotas.filter((c) => c.pagada).sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
  const sectionLabel = { fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' };
  const completed = cuotas.length > 0 && cuotas.every((c) => c.pagada);
  const cuotasPagadas = cuotas.filter((c) => c.pagada).length;

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:py-10 flex flex-col gap-5 pb-10">
      <div className="flex items-center gap-3">
        <div className="sd-avatar" style={{ width: '52px', height: '52px', fontSize: '1rem' }}>{initials(client.nombre)}</div>
        <div>
          <div className="sd-display" style={{ fontSize: '1.05rem', fontWeight: 700 }}>{client.nombre}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <Phone size={12} /> {client.telefono}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="sd-card" style={{ padding: '14px' }}>
          <div className="sd-stat-label" style={{ marginBottom: '5px' }}>Monto</div>
          <div className="sd-mono" style={{ fontSize: '1.05rem', fontWeight: 700 }}>{fmt(client.monto_prestado)}</div>
        </div>
        <div className="sd-card" style={{ padding: '14px' }}>
          <div className="sd-stat-label" style={{ marginBottom: '5px' }}>Cuotas</div>
          <div className="sd-mono" style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cuotas.length} totales</div>
        </div>
      </div>

      <div>
        <h2 style={sectionLabel}>Progreso del préstamo</h2>
        <StepProgress total={cuotas.length} paid={cuotasPagadas} />
      </div>

      <div>
        <h2 style={sectionLabel}>Historial de pagos</h2>
        {historial.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Todavía no hay pagos registrados.</p>
        ) : (
          <div className="sd-card" style={{ padding: '4px 14px' }}>
            {historial.map((c) => (
              <div key={c.id} className="sd-hist-row">
                <span className="sd-mono sd-hist-date">{formatShortDate(c.fecha_pago)}</span>
                <span className="sd-hist-label">Cuota {c.numero}</span>
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
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Ya pagó las {cuotas.length} cuotas</div>
          </div>
        </div>
      ) : (
        <>
          <button className="sd-btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading} onClick={onConfirm}>
            <CheckCircle size={18} /> {loading ? 'Registrando...' : 'Registrar pago'}
          </button>
        </>
      )}

      <button className="sd-btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={onDownload}>
        <FileText size={17} /> Exportar PDF
      </button>

      {completed && (
        <button className="sd-btn-danger" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading} onClick={onDelete}>
          <Trash2 size={17} /> {loading ? 'Eliminando...' : 'Eliminar cliente'}
        </button>
      )}
    </div>
  );
}

function PdfPreviewModal({ client, cuotas, onClose, onDownload, pdfSheetRef }) {
  if (!client) return null;
  const totalPagado = cuotas.filter((c) => c.pagada).reduce((a, c) => a + c.monto, 0);
  const saldo = cuotas.filter((c) => !c.pagada).reduce((a, c) => a + c.monto, 0);
  const cuotasPagadas = cuotas.filter((c) => c.pagada).length;

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });

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
          <div className="sd-pdf-sheet" ref={pdfSheetRef}>
            <div className="sd-display" style={{ fontSize: '1.05rem', fontWeight: 800 }}>Solo Diario</div>
            <div style={{ fontSize: '0.72rem', color: '#6B6458', marginTop: '1px' }}>Resumen de préstamo</div>
            <div style={{ fontSize: '0.68rem', color: '#8a7d5f', marginBottom: '14px' }}>Generado el {dateStr}</div>

            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{client.nombre}</div>
            <div style={{ fontSize: '0.7rem', color: '#6B6458', marginBottom: '12px' }}>{client.telefono} · Préstamo #{String(client.id).slice(-4).padStart(4, '0')}</div>

            <div className="sd-pdf-amount-box">
              <div className="sd-pdf-section-label" style={{ marginBottom: '2px' }}>Monto</div>
              <div className="sd-mono" style={{ fontWeight: 700, fontSize: '1rem' }}>{fmt(client.monto_prestado)}</div>
            </div>

            <div className="sd-pdf-table-head">
              <span>Fecha</span><span>Cuota</span><span>Monto</span><span style={{ textAlign: 'right' }}>Estado</span>
            </div>
            {cuotas.map((r) => (
              <div key={r.id} className="sd-pdf-table-row">
                <span style={{ color: '#6B6458' }}>{formatShortDate(r.fecha_vencimiento)}</span>
                <span>Cuota {r.numero}</span>
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
                <div className="sd-pdf-summary-value" style={{ color: '#221F19' }}>{cuotasPagadas} de {cuotas.length}</div>
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
              <ClientRow key={c.id} client={c} onClick={() => onSelect(c.id)} badgeStatus={c.badgeStatus} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ client, onCancel, onConfirm, loading }) {
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
            <div className="sd-avatar">{initials(client.nombre)}</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{client.nombre}</div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            Ya pagó todas las cuotas de su préstamo. Al eliminarlo vas a borrar su historial de pagos de Solo Diario. Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="sd-modal-actions">
          <button className="sd-btn-outline" style={{ flex: 1 }} onClick={onCancel} disabled={loading}>Cancelar</button>
          <button className="sd-btn-danger-solid" style={{ flex: 1 }} disabled={loading} onClick={onConfirm}>{loading ? 'Eliminando...' : 'Eliminar'}</button>
        </div>
      </div>
    </div>
  );
}

export default function SoloDiarioApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [prestamoTargetId, setPrestamoTargetId] = useState(null);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [pdfPreviewId, setPdfPreviewId] = useState(null);
  const [showAtrasados, setShowAtrasados] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cuotasPorCliente, setCuotasPorCliente] = useState({});
  const pdfSheetRef = useRef(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, user) => {
      if (user) {
        setLoggedIn(true);
        loadData();
      } else {
        setLoggedIn(false);
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const { data: clientesData, error: clientesErr } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientesErr) throw clientesErr;

      setClients(clientesData || []);

      const { data: cuotasData, error: cuotasErr } = await supabase
        .from('cuotas')
        .select('*');

      if (cuotasErr) throw cuotasErr;

      const grouped = {};
      (cuotasData || []).forEach((c) => {
        if (!grouped[c.prestamo_id]) grouped[c.prestamo_id] = [];
        grouped[c.prestamo_id].push(c);
      });
      setCuotasPorCliente(grouped);
    } catch (err) {
      alert('Error al cargar datos: ' + err.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setScreen('dashboard');
  };

  const goTo = (s) => setScreen(s);
  const goBack = () => setScreen(backTargets[screen] || 'dashboard');
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const openPago = (id) => { setSelectedId(id); goTo('pago'); };

  const confirmPago = async (clientId, prestamoId) => {
    setLoading(true);
    try {
      const cuotas = (cuotasPorCliente[prestamoId] || []).sort((a, b) => a.numero - b.numero);
      const unpaidCuota = cuotas.find((c) => !c.pagada);

      if (unpaidCuota) {
        const { error } = await supabase
          .from('cuotas')
          .update({ pagada: true, fecha_pago: new Date().toISOString().split('T')[0] })
          .eq('id', unpaidCuota.id);

        if (error) throw error;
        await loadData();
        showToast('Pago registrado ✓');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (clientId) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      await loadData();
      setDeleteTargetId(null);
      showToast('Cliente eliminado ✓');
      goTo('dashboard');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const dateLabel = (() => {
    const s = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  })();

  const filtered = clients.filter((c) => c.nombre.toLowerCase().includes(query.toLowerCase()));

  const dueToday = clients.filter((c) => {
    const prestamos = clients.map((cl) => ({ id: `${cl.id}-1`, cliente_id: cl.id, ...cl }));
    return prestamos.some((p) => p.cliente_id === c.id);
  });

  const stats = (() => {
    const allCuotas = Object.values(cuotasPorCliente).flat();
    const totalPrestado = clients.reduce((a, c) => {
      const prestamos = clients.filter(() => true);
      return a;
    }, 0);

    let totalAmount = 0;
    Object.values(cuotasPorCliente).forEach((cuotas) => {
      const maxMonto = Math.max(...cuotas.map((c) => c.monto), 0);
      const cantCuotas = cuotas.length;
      totalAmount += maxMonto * cantCuotas;
    });

    const pagosHoy = new Date();
    const pagosHoyCount = allCuotas.filter((c) => c.fecha_pago === pagosHoy.toISOString().split('T')[0]).length;

    const atrasados = clients.filter((c) => {
      const cuotas = Object.values(cuotasPorCliente).flat().filter((q) => q.prestamo_id);
      return cuotas.some((q) => !q.pagada && new Date(q.fecha_vencimiento) < new Date());
    }).length;

    const carteraPendiente = allCuotas
      .filter((c) => !c.pagada)
      .reduce((a, c) => a + c.monto, 0);

    return {
      totalPrestado: totalAmount || 0,
      clientes: clients.length,
      pagosHoy: pagosHoyCount || 0,
      atrasados,
      carteraPendiente,
    };
  })();

  const selected = clients.find((c) => c.id === selectedId);
  const prestamoTarget = clients.find((c) => c.id === prestamoTargetId);
  const pdfClient = clients.find((c) => c.id === pdfPreviewId);
  const deleteTarget = clients.find((c) => c.id === deleteTargetId);

  const selectedPrestamo = selected ? Object.keys(cuotasPorCliente).find((pid) => {
    return true;
  }) : null;

  const overdueClients = clients.filter((c) => {
    return Object.values(cuotasPorCliente).flat().some((q) => !q.pagada && new Date(q.fecha_vencimiento) < new Date());
  });

  const enriquecerClientes = (clientList) => {
    return clientList.map((c) => {
      const cuotasCliente = Object.values(cuotasPorCliente).flat();
      const completed = cuotasCliente.length > 0 && cuotasCliente.every((cu) => cu.pagada);
      let badge = { cls: 'pending', text: 'Pendiente' };
      if (completed) badge = { cls: 'paid', text: 'Completado' };
      return { ...c, badgeStatus: badge, valor_cuota: 0, streak: [null, null, null, null, null, null, null] };
    });
  };

  const enrichedClients = enriquecerClientes(clients);
  const enrichedDueToday = enriquecerClientes(dueToday);
  const enrichedOverdue = enriquecerClientes(overdueClients);

  return (
    <div className="sd-root">
      {!loggedIn ? (
        <LoginView onLogin={() => { loadData(); }} />
      ) : (
        <div className="flex min-h-screen">
          <Sidebar screen={screen} goTo={goTo} onLogout={logout} />
          <div className="flex-1 flex flex-col min-h-screen">
            <TopBar screen={screen} goBack={goBack} dateLabel={dateLabel} />
            <main className="flex-1 sd-main-content">
              {screen === 'dashboard' && (
                <Dashboard
                  clients={enrichedClients}
                  dueToday={enrichedDueToday}
                  filtered={enrichedClients.filter((c) => c.nombre.toLowerCase().includes(query.toLowerCase()))}
                  query={query}
                  setQuery={setQuery}
                  openPago={openPago}
                  goTo={goTo}
                  stats={stats}
                  onOpenAtrasados={() => setShowAtrasados(true)}
                />
              )}
              {screen === 'agregar' && <Agregar goTo={goTo} />}
              {screen === 'nuevoCliente' && (
                <NuevoClienteForm
                  onCancel={() => goTo('agregar')}
                  onSave={() => { showToast('¡Perfecto! Cliente cargado ✓'); loadData(); goTo('dashboard'); }}
                  showError={showToast}
                />
              )}
              {screen === 'nuevoPrestamo' && (
                <NuevoPrestamoPicker clients={enrichedClients} onPick={(id) => { setPrestamoTargetId(id); goTo('nuevoPrestamoForm'); }} />
              )}
              {screen === 'nuevoPrestamoForm' && prestamoTarget && (
                <NuevoPrestamoForm
                  client={prestamoTarget}
                  onCancel={() => goTo('nuevoPrestamo')}
                  onSave={() => { showToast('Préstamo agregado ✓'); loadData(); goTo('dashboard'); }}
                />
              )}
              {screen === 'pago' && selected && (
                <PagoScreen
                  client={selected}
                  cuotas={Object.values(cuotasPorCliente).flat().filter(() => true) || []}
                  onConfirm={() => confirmPago(selected.id, selectedPrestamo)}
                  onDownload={() => setPdfPreviewId(selected.id)}
                  onDelete={() => setDeleteTargetId(selected.id)}
                  loading={loading}
                />
              )}
            </main>
          </div>
          <BottomNav screen={screen} goTo={goTo} onLogout={logout} />
        </div>
      )}
      {pdfClient && (
        <PdfPreviewModal
          client={pdfClient}
          cuotas={Object.values(cuotasPorCliente).flat() || []}
          onClose={() => setPdfPreviewId(null)}
          onDownload={() => { descargarPDF(pdfSheetRef, pdfClient.nombre); showToast('PDF descargado ✓'); setPdfPreviewId(null); }}
          pdfSheetRef={pdfSheetRef}
        />
      )}
      {showAtrasados && (
        <OverdueModal
          clients={enrichedOverdue}
          onClose={() => setShowAtrasados(false)}
          onSelect={(id) => { setShowAtrasados(false); openPago(id); }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          client={deleteTarget}
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => deleteClient(deleteTarget.id)}
          loading={loading}
        />
      )}
      {toast && <div className="sd-toast">{toast}</div>}
    </div>
  );
}
