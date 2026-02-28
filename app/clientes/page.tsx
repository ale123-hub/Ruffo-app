// app/clientes/page.tsx
import { createClient } from '../../src/lib/supabase/server'
import ClientesTabla from './ClientesTabla'

export default async function PageClientes() {
    
  const supabase = await createClient()

  
  const { data: clientes, error } = await supabase
    .from('clients')
    .select('id, full_name, phone, created_at, pets(id)')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen text-red-500">
        <p>Error: {error.message}</p>
      </div>
    )
  }

  return <ClientesTabla clientes={clientes ?? []} />
}