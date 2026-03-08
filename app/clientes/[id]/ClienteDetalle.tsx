'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface Mascota {
  id: string
  name: string
  species: string
  breed?: string
  notes?: string
}

interface Cliente {
  id: string
  full_name: string
  phone: string
  email?: string
  notes?: string
  created_at: string
  pets?: Mascota[]
}

interface Props {
  cliente: Cliente
}

export default function ClienteDetalle({ cliente }: Props) {
  return (
    <div className="p-8 bg-gray-800 min-h-screen text-white">

      {/* Fila con botones: Regresar y Agregar Mascota */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/clientes">
          <Button className="bg-gray-300 text-gray-900 hover:bg-gray-400">
            ← Regresar
          </Button>
        </Link>

        <Link href={`/clientes/${cliente.id}/mascotas/nueva`}>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Agregar Mascota
          </Button>
        </Link>
      </div>

      {/* Detalle del cliente */}
      <Card className="bg-gray-800 p-4 mb-6 text-white">
        <h1 className="text-2xl font-bold mb-2 text-white">{cliente.full_name}</h1>
        <p><strong>Teléfono:</strong> {cliente.phone}</p>
        {cliente.email && <p><strong>Email:</strong> {cliente.email}</p>}
        {cliente.notes && <p><strong>Notas:</strong> {cliente.notes}</p>}
        <p><strong>Fecha de registro:</strong> {new Date(cliente.created_at).toLocaleDateString('es-ES')}</p>
      </Card>

      {/* Mascotas */}
      <h2 className="text-xl font-bold mb-2 text-white"> Mascotas ({cliente.pets?.length ?? 0})</h2>
      <Card className="bg-gray-800">
        {cliente.pets?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead  >Nombre</TableHead>
                <TableHead  >Especie</TableHead>
                <TableHead  >Raza</TableHead>
                <TableHead  >Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cliente.pets.map(mascota => (
                <TableRow key={mascota.id}>
                  <TableCell >{mascota.name}</TableCell>
                  <TableCell >{mascota.species}</TableCell>
                  <TableCell >{mascota.breed || '-'}</TableCell>
                  <TableCell >{mascota.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="p-4 text-white italic">No hay mascotas registradas</p>
        )}
      </Card>
    </div>
  )
}