'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase/client'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Cliente {
  id: string
  full_name: string
  phone: string
  created_at: string
  pets?: { id: string }[]
}

export default function ClientesTabla() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)

  // Verificar sesión al montar
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace('/login')
      } else {
        setSessionChecked(true)
      }
    }
    checkSession()
  }, [router])

  // Traer clientes
  const fetchClientes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('id, full_name, phone, created_at, pets(id)')
      .order('created_at', { ascending: false })
    setLoading(false)

    if (error) {
      console.error(error)
    } else {
      setClientes(data || [])
    }
  }

  useEffect(() => {
    if (sessionChecked) {
      fetchClientes()
    }
  }, [sessionChecked])

  // Filtrado por búsqueda
  const filteredClientes = clientes.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  // Eliminar cliente
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      '¿Está seguro de que desea eliminar este cliente y todas sus mascotas?'
    )
    if (!confirmDelete) return

    setLoading(true)
    const { error } = await supabase.from('clients').delete().eq('id', id)
    setLoading(false)

    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      // actualizar la lista en memoria
      setClientes(prev => prev.filter(c => c.id !== id))
    }
  }

  if (!sessionChecked)
    return <p className="p-8 text-white">Verificando sesión...</p>

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div className="flex gap-2">
          <Link href="/clientes/nuevo">
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Nuevo Cliente
            </Button>
          </Link>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar por nombre o teléfono..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm"
        />
      </div>

      <Card className="bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre completo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Cantidad de mascotas</TableHead>
              <TableHead>Fecha de registro</TableHead>
              <TableHead>Acciones</TableHead> {/* Nueva columna */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Cargando clientes...
                </TableCell>
              </TableRow>
            ) : filteredClientes.length > 0 ? (
              filteredClientes.map(cliente => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    <Link
                      href={`/clientes/${cliente.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {cliente.full_name}
                    </Link>
                  </TableCell>
                  <TableCell>{cliente.phone}</TableCell>
                  <TableCell>{cliente.pets?.length ?? 0}</TableCell>
                  <TableCell>{new Date(cliente.created_at).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => router.push(`/clientes/${cliente.id}`)}
                    >
                      Ver
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDelete(cliente.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay clientes que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}