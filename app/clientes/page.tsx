// app/clientes/page.tsx
import { supabaseServer } from '../../src/lib/supabase/server'
import ClientesTabla from './ClientesTabla'

export default async function PageClientes() {
  // Server Component: trae los clientes directamente desde Supabase
  const { data: clientes, error } = await supabaseServer
    .from('clients')
    .select('id, full_name, phone, created_at, pets(id)')

  if (error) return <p className="text-red-500">Error: {error.message}</p>

  // Pasamos los datos al Client Component como prop
  return <ClientesTabla clientes={clientes || []} />
}