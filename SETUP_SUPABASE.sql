-- Solo Diario - Setup Supabase Database
-- Copia y pega esto en el SQL Editor de tu proyecto Supabase

-- Crear tabla clientes
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  created_at timestamptz default now()
);

-- Crear tabla prestamos
create table prestamos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  monto_prestado numeric not null,
  cantidad_cuotas int not null,
  valor_cuota numeric not null,
  frecuencia text not null check (frecuencia in ('Semana','Quincena','Mensual')),
  fecha_inicio date not null,
  created_at timestamptz default now()
);

-- Crear tabla cuotas
create table cuotas (
  id uuid primary key default gen_random_uuid(),
  prestamo_id uuid not null references prestamos(id) on delete cascade,
  numero int not null,
  fecha_vencimiento date not null,
  monto numeric not null,
  pagada boolean not null default false,
  fecha_pago date,
  created_at timestamptz default now()
);

-- Crear índices
create index idx_prestamos_cliente on prestamos(cliente_id);
create index idx_cuotas_prestamo on cuotas(prestamo_id);

-- Habilitar Row Level Security
alter table clientes enable row level security;
alter table prestamos enable row level security;
alter table cuotas enable row level security;

-- Crear políticas RLS (solo usuario autenticado)
create policy "solo usuario autenticado" on clientes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "solo usuario autenticado" on prestamos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "solo usuario autenticado" on cuotas
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
