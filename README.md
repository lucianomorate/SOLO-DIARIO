# Solo Diario - Gestión de Préstamos y Cobros

Aplicación React + Vite conectada a Supabase para gestionar préstamos y cobros diarios con exportación de PDF.

## 🚀 Instalación y Setup

### 1. Preparar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** → **New Query**
3. Copia y pega el contenido de `SETUP_SUPABASE.sql`
4. Ejecuta (Cmd + Enter)
5. Crea un usuario en **Authentication** → **Add user** con tu email y contraseña

### 2. Configurar Variables de Entorno

1. Copia el archivo `.env.local`
2. Ve a tu proyecto Supabase → **Settings** → **API**
3. Obtén:
   - `VITE_SUPABASE_URL`: "Project URL"
   - `VITE_SUPABASE_ANON_KEY`: "anon public" key
4. Pega en `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Instalar y Ejecutar

```bash
npm install
npm run dev
```

Se abrirá en http://localhost:5173

Inicia sesión con el usuario que creaste en Supabase.

## 📦 Build y Deploy en Vercel

### 1. Preparar Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### 2. Conectar a Vercel

1. Entra en [vercel.com](https://vercel.com)
2. **Import Project** → selecciona tu repo
3. Framework: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
7. **Deploy**

## 📋 Características

- ✅ Login con Supabase Auth
- ✅ Crear clientes y préstamos
- ✅ Registrar pagos (repetible)
- ✅ Generar cuotas automáticamente según frecuencia
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Exportar PDF de cada préstamo
- ✅ Responsive (sidebar desktop, bottom nav mobile)
- ✅ Eliminar clientes (solo cuando préstamo está pagado)

## 🔧 Troubleshooting

**"Error: Cannot find module '@supabase/supabase-js'"**
→ Ejecuta `npm install`

**"VITE_SUPABASE_URL is undefined"**
→ Verifica que `.env.local` existe y tiene las claves correctas
→ Reinicia el servidor dev (Ctrl+C y `npm run dev`)

**"401 Unauthorized"**
→ Verifica que creaste el usuario en Supabase → Authentication
→ Comprueba que copias el email y contraseña correctos

**PDF se descarga en blanco**
→ Asegúrate que `pdfSheetRef` está correcto en `App.jsx`
→ Prueba con `scale: 2` en `html2canvas`

## 📝 Arquitectura

```
src/
├── App.jsx          # Componente principal con lógica Supabase
├── App.css          # Estilos (mockup original)
├── main.jsx         # Punto de entrada React
└── index.css        # Tailwind + Reset global
```

Stack:
- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + estilos custom
- **DB**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **PDF**: jsPDF + html2canvas
- **Deploy**: Vercel

## 🎨 Diseño

Todos los estilos y componentes mantienen exactamente el look & feel del mockup original (`solo_diario_mockup.jsx`):
- Paleta: Ámbar/Marrón/Verde/Rojo
- Tipografía: Sora (display), Inter (body), JetBrains Mono (datos)
- Responsive: Sidebar en desktop (220px), bottom nav en mobile
- Animaciones smooth y transiciones

---

Made with ❤️ for Solo Diario
