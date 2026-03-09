'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../..//src/lib/supabase/client' // Ajusta esta ruta
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

interface ClientesTablaProps {
    clientes: Cliente[]
}

export default function ClientesTabla({ clientes: initialClientes }: ClientesTablaProps) {
    const router = useRouter()
    const [clientes, setClientes] = useState<Cliente[]>(initialClientes)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [sessionChecked, setSessionChecked] = useState(false)

    // Sincronizar con datos del servidor si cambian
    useEffect(() => {
        setClientes(initialClientes)
    }, [initialClientes])

    // Verificar sesión al entrar
    useEffect(() => {
        const check = async () => {
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                router.replace('/login')
            } else {
                setSessionChecked(true)
            }
        }
        check()
    }, [router])

    const filteredClientes = clientes.filter(c => {
        const busqueda = search.toLowerCase()
        return (
            c.full_name?.toLowerCase().includes(busqueda) ||
            c.phone?.includes(busqueda)
        )
    })

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar este cliente?')) return

        setLoading(true)
        const { error } = await supabase.from('clients').delete().eq('id', id)

        if (error) {
            alert('Error: ' + error.message)
            setLoading(false)
        } else {
            setClientes(prev => prev.filter(c => c.id !== id))
            setLoading(false)
        }
    }

    if (!sessionChecked) return (
        <div className="p-8 bg-gray-900 min-h-screen text-white text-center">Verificando...</div>
    )

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-black">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 items-center">
                <h1 className="text-3xl font-bold">Clientes ({clientes.length})</h1>
                <div className="flex gap-3">
                    <Link href="/clientes/nuevo">
                        <Button className="bg-green-600 hover:bg-green-700 font-semibold">+ Nuevo</Button>
                    </Link>
                    <Button variant="destructive" onClick={handleLogout}>Cerrar Sesión</Button>
                </div>
            </div>

            <Input
                placeholder="Buscar cliente..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-6 max-w-sm bg-gray-800 border-gray-700 text-white"
            />

            <Card className="bg-gray-800 border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-700">
                            <TableHead className="text-gray-400">Nombre</TableHead>
                            <TableHead className="text-gray-400">Teléfono</TableHead>
                            <TableHead className="text-gray-400">Mascotas</TableHead>
                            <TableHead className="text-gray-400">Registro</TableHead>
                            <TableHead className="text-right text-gray-400">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClientes.length > 0 ? (
                            filteredClientes.map(cliente => (
                                <TableRow key={cliente.id} className="border-gray-700 hover:bg-gray-750">
                                    <TableCell className="font-medium text-white">
                                        <Link href={`/clientes/${cliente.id}`}>{cliente.full_name}</Link>
                                    </TableCell>
                                    <TableCell className="text-white">{cliente.phone}</TableCell>
                                    <TableCell>
                                        <span className="bg-gray-700 px-2 py-1 rounded text-xs text-white">
                                            {cliente.pets?.length ?? 0}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-white text-sm">
                                        {new Date(cliente.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" variant="outline" className="border-green-600 text-white" onClick={() => router.push(`/clientes/${cliente.id}`)}>Ver</Button>
                                        <Button size="sm" variant="destructive" disabled={loading} onClick={() => handleDelete(cliente.id)}>Borrar</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500 italic">
                                    No se encontraron clientes.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}