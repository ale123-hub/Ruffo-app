'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '../../../../../src/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '../../../../../src/components/ui/textarea'

export default function MascotaForm() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id

  const [name, setName] = useState('')
  const [species, setSpecies] = useState('canino')
  const [breed, setBreed] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name || !species) {
      setErrorMsg('Nombre y especie son obligatorios.')
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('pets')
      .insert({ name, species, breed, behavior_notes: notes, client_id: clientId })

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      router.replace(`/clientes/${clientId}`) // vuelve al detalle del cliente
    }
  }

  // Función para manejar el botón de regresar
  const handleBack = () => {
    // Verificamos si hay cambios en el formulario
    if (name || species !== 'canino' || breed || notes) {
      const confirmExit = window.confirm(
        'Hay cambios sin guardar. ¿Desea salir sin guardar los cambios?'
      )
      if (!confirmExit) return
    }
    // Si no hay cambios o confirma salir
    router.push(`/clientes/${clientId}`)
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      {/* Botón de regresar */}
      <div className="w-full max-w-lg mb-6">
        <Button
          onClick={handleBack}
          className="bg-gray-300 text-gray-900 hover:bg-gray-400"
        >
          ← Regresar
        </Button>
      </div>

      {/* Formulario */}
      <Card className="w-full max-w-lg p-6 bg-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-white">Nueva Mascota</h1>
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-white">Nombre *</label>
            <Input value={name} onChange={e => setName(e.target.value)} className="text-white"required />
          </div>

          <div>
            <label className="block mb-1 text-white">Especie *</label>
            <select
              value={species}
              onChange={e => setSpecies(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="canino">Canino</option>
              <option value="felino">Felino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-white">Raza</label>
            <Input value={breed} onChange={e => setBreed(e.target.value)} className=" text-white" required />
          </div>

          <div>
            <label className="block mb-1 text-white">Notas de comportamiento</label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Mascota'}
          </Button>
        </form>
      </Card>
    </div>
  )
}