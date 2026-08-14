# 🚀 Setup Completo de Solo Diario

## Paso 1: Configurar Supabase

### 1.1 Crear Proyecto
1. Ve a https://supabase.com y crea una cuenta (gratis)
2. Haz click en "New Project"
3. Llena los datos:
   - **Project Name**: "Solo Diario" (o el que prefieras)
   - **Database Password**: elige una contraseña segura
   - **Region**: Elige la más cercana a ti
4. Click "Create new project" (espera 2-3 minutos)

### 1.2 Crear Tablas y RLS
1. En el dashboard, ve a **SQL Editor** (panel izquierdo)
2. Click "New query"
3. Copia COMPLETAMENTE el contenido de `SETUP_SUPABASE.sql`
4. Pégalo en el editor
5. Click "Run" (o Cmd+Enter)
6. Verifica que las 3 tablas aparecen en el panel izquierdo: `clientes`, `prestamos`, `cuotas`

### 1.3 Crear Usuario
1. Ve a **Authentication** → **Users** (panel izquierdo)
2. Click "Add user" → "Create new user"
3. Carga:
   - **Email**: tu@email.com (ej: tumail@gmail.com)
   - **Password**: elige una contraseña (ej: MiPassword123!)
4. Click "Create user"

**IMPORTANTE**: Memoriza este email y contraseña — los usarás para iniciar sesión en la app.

### 1.4 Obtener Credenciales API
1. Ve a **Settings** → **API** (panel izquierdo)
2. Copia estos valores (están bajo "Project API keys"):
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

Ejemplo:
```
VITE_SUPABASE_URL=https://abcdefg1234.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 2: Configurar Proyecto Localmente

### 2.1 Variables de Entorno
1. Abre `.env.local` en la carpeta del proyecto
2. Reemplaza los valores con los que copiaste:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_aqui
```
3. Guarda el archivo

### 2.2 Instalar Dependencias
```bash
npm install
```

### 2.3 Ejecutar Desarrollo
```bash
npm run dev
```

Se abrirá http://localhost:5173

**Inicia sesión** con el email y contraseña que creaste en Supabase.

## Paso 3: Testing Local

Prueba estas acciones:

1. **Crear cliente**
   - Ve a "Agregar" → "Nuevo cliente"
   - Carga: Nombre, Teléfono, Cantidad, Cuotas, Frecuencia, Fecha, Cantidad por cuota
   - Haz click "Guardar cliente"
   - ✅ Debe aparecer en el dashboard

2. **Registrar pago**
   - Haz click en el cliente del dashboard
   - Haz click "Registrar pago"
   - ✅ Debe avanzar en el progreso

3. **Exportar PDF**
   - En la pantalla del cliente, click "Exportar PDF"
   - Click "Descargar PDF"
   - ✅ Debe descargar un PDF con el resumen

4. **Eliminar cliente** (solo si préstamo está 100% pagado)
   - Después de pagar todas las cuotas, aparece botón "Eliminar cliente"
   - Click y confirma
   - ✅ Debe borrarlo del dashboard

## Paso 4: Deploy en Vercel

### 4.1 Preparar Git
```bash
git init
git add .
git commit -m "Initial commit: Solo Diario setup"
```

### 4.2 Crear Repositorio en GitHub
1. Ve a https://github.com/new
2. Crea repo: `solo-diario` (o el nombre que prefieras)
3. Copia las instrucciones de "push an existing repository"
4. Ejecuta en terminal:
```bash
git remote add origin https://github.com/tu-usuario/solo-diario.git
git branch -M main
git push -u origin main
```

### 4.3 Conectar a Vercel
1. Ve a https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Selecciona tu repo `solo-diario`
4. En **Environment Variables**, agrega:
   ```
   VITE_SUPABASE_URL = https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY = tu_clave_anon
   ```
5. Click "Deploy"
6. Espera ~2 minutos
7. ✅ Tu app estará en línea en `https://tu-proyecto.vercel.app`

## ✅ Checklist Final

- [ ] Proyecto Supabase creado
- [ ] Tablas SQL ejecutadas sin errores
- [ ] Usuario creado en Authentication
- [ ] `.env.local` rellenado con credenciales
- [ ] `npm install` ejecutado
- [ ] `npm run dev` funciona en localhost:5173
- [ ] Puedo iniciar sesión con el usuario de Supabase
- [ ] Puedo crear un cliente y préstamo
- [ ] Puedo registrar pagos
- [ ] Puedo descargar PDF
- [ ] Git repo creado y pusheado a GitHub
- [ ] Vercel conectado y desplegado
- [ ] App online funciona correctamente

## 🆘 Troubleshooting

**Error: "VITE_SUPABASE_URL is not defined"**
→ Verifica que `.env.local` existe en la raíz y contiene los valores

**Error: "Email/contraseña inválida"**
→ Asegúrate que el usuario fue creado en Supabase → Authentication → Users

**Error: "Cannot read properties of undefined"**
→ Limpia `node_modules` y reinstala: `rm -rf node_modules && npm install`

**PDF se descarga en blanco**
→ Recarga la página (Ctrl+R)
→ Intenta en otra pestaña

**Vercel deployment falla**
→ Verifica en **Deployment** → **Logs** qué error tiene
→ Asegúrate que las env vars están correctas
→ Haz un nuevo push a GitHub

---

**¿Dudas?** El proyecto está completamente funcional. Solo sigue los pasos en orden y debería funcionar sin problemas.
