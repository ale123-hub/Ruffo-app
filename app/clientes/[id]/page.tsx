'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Mascota {
    id: string
    name: string
    species: string
    breed?: string
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

export default function ClienteDetalle() {
    const params = useParams() // obtiene [id] de la URL
    const clientId = params.id
    const [cliente, setCliente] = useState<Cliente | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchCliente = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('clients')
            .select(`
                id,
                full_name,
                phone,
                email,
                notes,
                created_at,
                pets (id, name, species, breed)
            `)
            .eq('id', clientId)
            .single()
        setLoading(false)

        if (error) {
            console.error(error)
        } else {
            setCliente(data)
        }
    }

    useEffect(() => {
        fetchCliente()
    }, [clientId])

    if (loading || !cliente) return <p className="p-8 text-white">Cargando cliente...</p>

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            {/* Botón Regresar */}
            <div className="mb-4">
                <Link href="/clientes">
                    <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                        ← Regresar
                    </Button>
                </Link>
            </div>

            <Card className="mb-6 p-6 bg-gray-800">
                <h1 className="text-2xl font-bold mb-2">{cliente.full_name}</h1>
                <p>Teléfono: {cliente.phone}</p>
                {cliente.email && <p>Email: {cliente.email}</p>}
                {cliente.notes && <p>Notas: {cliente.notes}</p>}
                <p>Registrado: {new Date(cliente.created_at).toLocaleDateString('es-ES')}</p>

                <div className="mt-4">
                    <Link href={`/clientes/${cliente.id}/mascotas/nueva`}>
                        <Button className="bg-green-500 hover:bg-green-600">Agregar Mascota</Button>
                    </Link>
                </div>
            </Card>

            <Card className="p-6 bg-gray-800">
                <h2 className="text-xl font-bold mb-4">Mascotas ({cliente.pets?.length ?? 0})</h2>
                {cliente.pets && cliente.pets.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Especie</TableHead>
                                <TableHead>Raza</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cliente.pets.map(pet => (
                                <TableRow key={pet.id}>
                                    <TableCell>{pet.name}</TableCell>
                                    <TableCell>{pet.species}</TableCell>
                                    <TableCell>{pet.breed || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>No hay mascotas registradas.</p>
                )}
            </Card>
        </div>
    )
}