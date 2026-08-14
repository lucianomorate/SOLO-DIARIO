# 🎯 COMIENZA AQUI - Setup en 15 Minutos

El proyecto está **100% listo**. Solo necesitas:
1. Crear cuenta en Supabase
2. Configurar 3 variables
3. Deploy en Vercel

## 📋 Paso a Paso Rápido

### Paso 1: Supabase Setup (5 min)

**A) Crear proyecto**
```
1. Ve a supabase.com → Sign Up
2. Create Project
   - Nombre: "Solo Diario"
   - Password: xxxxxxx (guarda bien)
   - Region: Elige la más cercana
3. Espera 2-3 min (se crea la DB)
```

**B) Crear tablas**
```
1. En dashboard → SQL Editor (izq)
2. New query
3. Copia el contenido completo de SETUP_SUPABASE.sql
4. Pégalo y Run (Cmd+Enter)
5. ✅ Verifica que aparecen 3 tablas en el lado izq
```

**C) Crear usuario**
```
1. Authentication (izq) → Users
2. Add user → Create new user
3. Email: tu@email.com
4. Password: Tu123456!
5. Create user
```

**D) Obtener credenciales**
```
1. Settings (izq) → API
2. Copia:
   - Project URL → VITE_SUPABASE_URL
   - anon key → VITE_SUPABASE_ANON_KEY
3. Guarda estos valores
```

### Paso 2: Configurar Proyecto (2 min)

**Edita .env.local:**
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Paso 3: Testear Localmente (3 min)

```bash
# En terminal (carpeta del proyecto):
npm install    # Si no lo hiciste
npm run dev
```

**Acciones a probar:**
- [ ] Login con tu email/password
- [ ] Crear cliente
- [ ] Registrar pago
- [ ] Descargar PDF
- [ ] Eliminar cliente (si está pagado)

### Paso 4: Deploy en Vercel (5 min)

**Terminal:**
```bash
git init
git add .
git commit -m "Solo Diario - Setup completo"
```

**GitHub:**
```
1. github.com/new → Create repo
2. Nombre: solo-diario
3. Copy & paste el comando de push que te da
```

**Vercel:**
```
1. vercel.com/dashboard
2. Add New Project
3. Selecciona tu repo GitHub
4. Environment Variables (agregar):
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
5. Deploy
6. ✅ Listo! En 2 min estará online
```

## ✅ Listo!

Tu app está en `https://tu-proyecto.vercel.app`

## 📖 Documentación Completa

- **INSTRUCCIONES_SETUP.md** - Guía detallada con screenshots
- **PROYECTO_COMPLETADO.md** - Resumen técnico
- **README.md** - Documentación general

## 🆘 ¿No funciona?

**"Error: VITE_SUPABASE_URL is undefined"**
→ Checkea `.env.local` existe y tiene valores

**"Email inválido al login"**
→ Verifica usuario creado en Supabase → Authentication

**"No puedo crear cliente"**
→ Ejecutaste SETUP_SUPABASE.sql? Verifica SQL Editor

**"PDF en blanco"**
→ Recarga la página (F5)

---

**¿Necesitas más ayuda?** Lee INSTRUCCIONES_SETUP.md completo.

**¿Todo funciona?** ¡Felicidades! Tu app de préstamos y cobros está lista para producción.
