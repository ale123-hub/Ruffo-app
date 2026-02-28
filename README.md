# 🐾 Ruffo App - Gestión Veterinaria

Sistema moderno para la administración de clientes y mascotas, optimizado para veterinarias y peluquerías caninas. Construido con el stack más actual de Next.js y Supabase.

**Demo en vivo:** [https://ruffo-app-gilt.vercel.app/clientes](https://ruffo-app-gilt.vercel.app/clientes)

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** Next.js 15 (App Router)
* **Base de Datos & Auth:** Supabase
* **Estilos:** Tailwind CSS
* **Componentes:** Shadcn UI
* **Iconos:** Lucide React

---

##  Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/ale123-hub/Ruffo-app](https://github.com/ale123-hub/Ruffo-app)
cd Ruffo-app

npm install

NEXT_PUBLIC_SUPABASE_URL=[https://orqsjvdfyjuipsjevrln.supabase.co](https://orqsjvdfyjuipsjevrln.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_mXLLk-hHXTNp7C_PUFbJiw_MHO61N6-

npm run dev
Accede a: http://localhost:3000


SQL
-- Tabla de Clientes
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamp with time zone default now()
);

-- Tabla de Mascotas
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  name text not null,
  species text not null check (species in ('canino','felino','otro')),
  breed text,
  behavior_notes text,
  created_at timestamp with time zone default now()
);

SEGURIDAD RLS
alter table public.clients enable row level security;
alter table public.pets enable row level security;

-- Política para Clientes: Solo usuarios autenticados
create policy "Allow all for authenticated users"
on public.clients
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Política para Mascotas: Solo usuarios autenticados
create policy "Allow all for authenticated users"
on public.pets
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

npx shadcn@latest add card button table input
