'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '../../../src/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function ClienteForm() {
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [notes, setNotes] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')

        if (!fullName || !phone) {
            setErrorMsg('Nombre completo y teléfono son obligatorios.')
            return
        }

        setLoading(true)

        const { error } = await supabase
            .from('clients')
            .insert({ full_name: fullName, phone, email, notes })

        setLoading(false)

        if (error) {
            setErrorMsg(error.message)
        } else {
            router.replace('/clientes') // recarga la tabla de clientes
        }
    }

    const handleBack = () => {
        router.back() // vuelve a la página anterior
    }

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white flex justify-center">
            <Card className="w-full max-w-lg p-6 bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Nuevo Cliente</h1>
                    <Button
                        variant="outline"
                        className="text-white border-white hover:bg-gray-700"
                        onClick={handleBack}
                    >
                        ← Atrás
                    </Button>
                </div>

                {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1 text-white">Nombre completo *</label>
                        <Input
                            className="text-white"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-white">Teléfono *</label>
                        <Input
                            className="text-white"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="Ej: 600123456"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-white">Email</label>
                        <Input
                            className="text-white"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Ej: juan@mail.com"
                            type="email"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-white">Notas</label>
                        <Textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Notas adicionales..."
                        />
                    </div>

                    <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cliente'}
                    </Button>
                </form>
            </Card>
        </div>
    )
}