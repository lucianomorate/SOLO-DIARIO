# Prompt para Claude Code — Solo Diario

Pegá este documento completo como primer mensaje en Claude Code, junto con el archivo `solo_diario_mockup.jsx` adjunto.

---

## Contexto

Estoy construyendo **Solo Diario**, una app de gestión de préstamos y cobros diarios para un solo usuario (el dueño del negocio). Ya tengo un prototipo de interfaz funcional y aprobado en React (`solo_diario_mockup.jsx`, adjunto) con datos de prueba en memoria. Tu trabajo NO es rediseñar nada — es tomar ese prototipo como fuente de verdad del diseño, la paleta de colores, la tipografía y el comportamiento de cada pantalla, y convertirlo en una aplicación real conectada a una base de datos, con login real y exportación de PDF, lista para deployar.

**No cambies el look & feel.** Colores, fuentes (Sora / Inter / JetBrains Mono), textos en español, layout responsive (sidebar en desktop, bottom nav en mobile) y componentes ya están validados por el cliente. Reusá el CSS y la estructura de componentes del prototipo lo más posible.

## Stack

- **React + Vite**
- **Tailwind CSS** (clases core, ya usadas en el prototipo)
- **Supabase** — Postgres + Auth (plan free)
- **jsPDF + html2canvas** — exportación de PDF (ambas gratis, client-side)
- **Vercel** — deploy

## 1. Modelo de datos (Supabase)

Tres tablas. Uso `prestamos` como nombre de tabla porque es el término que se usa en toda la interfaz ("Nuevo préstamo", "Préstamo completado") — es lo mismo que yo llamo "plan".

```sql
-- Clientes
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  created_at timestamptz default now()
);

-- Préstamos (el "plan": cuánta plata se prestó, en cuántas cuotas, etc.)
create table prestamos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  monto_prestado numeric not null,
  cantidad_cuotas int not null,
  valor_cuota numeric not null,       -- lo carga el usuario a mano (incluye interés)
  frecuencia text not null check (frecuencia in ('Semana','Quincena','Mensual')),
  fecha_inicio date not null,
  created_at timestamptz default now()
);

-- Cuotas (una fila por cuota de cada préstamo)
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

create index idx_prestamos_cliente on prestamos(cliente_id);
create index idx_cuotas_prestamo on cuotas(prestamo_id);
```

### Row Level Security

Como es de un solo usuario, alcanza con exigir que haya sesión activa:

```sql
alter table clientes enable row level security;
alter table prestamos enable row level security;
alter table cuotas enable row level security;

create policy "solo usuario autenticado" on clientes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "solo usuario autenticado" on prestamos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "solo usuario autenticado" on cuotas
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
```

## 2. Autenticación

Es para una sola persona, así que no hace falta pantalla de registro. Usá **Supabase Auth con email/password**, es gratis en el plan free y mucho más seguro que hardcodear una contraseña en el código del cliente (eso quedaría visible en el bundle de JS).

- Creá el usuario una sola vez desde el dashboard de Supabase (Authentication → Add user), no desde la app.
- La pantalla de login del prototipo (usuario/contraseña) debe llamar a `supabase.auth.signInWithPassword({ email, password })`. Si el campo "usuario" no es un email, agregá un mapeo simple (por ejemplo guardar el email real en una variable de entorno y usar el campo "usuario" solo como label visual, o simplemente pedir el email directamente — decisión tuya, lo importante es que la auth real sea con Supabase).
- Protegé todas las rutas: si no hay sesión activa (`supabase.auth.getSession()`), redirigir al login.
- Botón "Cerrar sesión" → `supabase.auth.signOut()`.

## 3. Lógica de negocio

### Crear cliente + primer préstamo (pantalla "Nuevo cliente")
1. Insertar en `clientes`.
2. Insertar en `prestamos` con los datos del form (`monto_prestado`, `cantidad_cuotas`, `valor_cuota` tal cual lo carga el usuario, `frecuencia`, `fecha_inicio`).
3. Generar automáticamente las filas de `cuotas`: `cantidad_cuotas` filas, con `numero` de 1 a N, y `fecha_vencimiento` = `fecha_inicio + (numero - 1) * intervalo`, donde intervalo es 7 días (Semana), 15 (Quincena) o 30 (Mensual). `monto` = `valor_cuota` en todas.

### Nuevo préstamo para cliente existente
Mismo paso 2 y 3 de arriba, sin crear cliente nuevo.

### Registrar pago (repetible)
Al tocar "Registrar pago" en la pantalla de un cliente:
1. Buscar la cuota **no pagada** con el `numero` más bajo de ese préstamo.
2. Marcarla `pagada = true`, `fecha_pago = hoy`.
3. El botón queda habilitado para seguir registrando pagos en la misma visita (por si el cliente cancela el préstamo pagando varias cuotas de una) — repetir el paso hasta que no queden cuotas pendientes.
4. Cuando ya no queden cuotas pendientes, la UI pasa al estado "Préstamo completado" (como en el prototipo) y habilita el botón "Eliminar cliente".

### Eliminar cliente
Solo visible/habilitado cuando el préstamo está 100% pagado. Pide confirmación (como en el prototipo) y borra el cliente (el `on delete cascade` se encarga de préstamos y cuotas).

### Cálculo de atraso
Un cliente está **atrasado** si tiene alguna cuota no pagada cuya `fecha_vencimiento` sea **anterior a hoy** (es decir, al día siguiente del vencimiento y sin pago, ya cuenta como atraso). No es un campo guardado, se calcula al vuelo:

```sql
select distinct p.cliente_id
from prestamos p
join cuotas c on c.prestamo_id = p.id
where c.pagada = false
  and c.fecha_vencimiento < current_date;
```

### "Clientes de hoy" (dueToday)
Clientes con alguna cuota no pagada cuya `fecha_vencimiento = current_date`.

### Estadísticas del dashboard
- **Prestado**: `sum(monto_prestado)` de todos los préstamos.
- **Clientes**: `count(*)` de clientes.
- **Pagos hoy**: cantidad de clientes con al menos una cuota con `fecha_pago = current_date`.
- **Atrasados**: cantidad de clientes que cumplen la condición de atraso de arriba (tocar esta tarjeta abre la lista, como en el prototipo).
- **Cartera pendiente**: `sum(monto)` de todas las cuotas con `pagada = false`.

## 4. Exportación de PDF

Clave: tiene que descargarse **tal cual se ve en pantalla**, no un PDF generado por separado con otro layout. Usá `html2canvas` para capturar el nodo del DOM que tiene la clase `.sd-pdf-sheet` (la "hoja" clara dentro del modal de vista previa) y `jsPDF` para meter esa imagen en un PDF del tamaño correspondiente:

```js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

async function descargarPDF(nodeRef, nombreCliente) {
  const canvas = await html2canvas(nodeRef.current, { scale: 2, backgroundColor: '#F6F1E6' });
  const img = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
  pdf.addImage(img, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(`solo-diario-${nombreCliente.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
```

El botón "Descargar PDF" del modal debe llamar a esta función apuntando al `ref` del div `.sd-pdf-sheet` (no del modal completo, solo la hoja clara).

## 5. Variables de entorno (Vite)

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Cargar con `import.meta.env.VITE_SUPABASE_URL` etc. No commitear el `.env` — agregarlo a `.gitignore` y configurar las mismas variables en Vercel (Project Settings → Environment Variables).

## 6. Deploy en Vercel

1. Repo en GitHub, conectado a un nuevo proyecto de Vercel.
2. Framework preset: Vite.
3. Variables de entorno cargadas en Vercel (paso anterior).
4. Confirmar que el build (`npm run build`) corre sin errores antes del primer deploy.

## 7. Checklist de aceptación

- [ ] Login real contra Supabase Auth, rutas protegidas sin sesión
- [ ] Crear cliente + préstamo genera las cuotas correctas según frecuencia
- [ ] Nuevo préstamo para cliente existente funciona igual
- [ ] Registrar pago avanza una cuota, y se puede tocar varias veces seguidas para cancelar el préstamo
- [ ] Al completar todas las cuotas aparece "Préstamo completado" y el botón de eliminar
- [ ] Eliminar cliente pide confirmación y borra cliente + préstamo + cuotas
- [ ] "Atrasados" calcula bien (día siguiente al vencimiento sin pago) y la tarjeta abre la lista
- [ ] Las 5 estadísticas del dashboard reflejan datos reales de Supabase
- [ ] El PDF descargado es una réplica exacta de la vista previa en pantalla
- [ ] Responsive: sidebar en desktop, bottom nav en mobile, igual que el prototipo
- [ ] Deploy funcionando en Vercel con las variables de entorno cargadas
