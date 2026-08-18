-- FIX: Row Level Security para cuotas
-- El problema es que la política original bloquea UPDATE

-- Primero, eliminar la política antigua (ejecutar en Supabase SQL Editor)
-- drop policy "solo usuario autenticado" on cuotas;

-- Crear nuevas políticas más explícitas para cada operación
-- IMPORTANTE: Ejecuta esto en el SQL Editor de Supabase

-- Política para SELECT (leer): Permitir si está autenticado
create policy "SELECT - solo usuario autenticado" on cuotas
  for select using (auth.role() = 'authenticated');

-- Política para INSERT (crear): Permitir si está autenticado
create policy "INSERT - solo usuario autenticado" on cuotas
  for insert with check (auth.role() = 'authenticated');

-- Política para UPDATE (actualizar): Permitir si está autenticado (SIN using clause)
create policy "UPDATE - solo usuario autenticado" on cuotas
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Política para DELETE (eliminar): Permitir si está autenticado
create policy "DELETE - solo usuario autenticado" on cuotas
  for delete using (auth.role() = 'authenticated');
