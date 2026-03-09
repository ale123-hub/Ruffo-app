'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// Importamos el cliente que ya configuraste en tu proyecto
import { supabase } from '../../src/lib/supabase/client' 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita recarga de página
    setLoading(true)
    setErrorMsg('')
    
    // DEBUG: Mira tu consola del navegador (F12) al dar click
    console.log("Enviando a Supabase:", { email, password });

    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), // Limpiamos espacios accidentales
      password: password 
    })
    
    if (error) {
      console.error("Error de Supabase:", error.message);
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      console.log("Login exitoso, redirigiendo...");
      router.push('/clientes')
    }
  }

  return (
    <Card className="p-8 max-w-md mx-auto mt-20">
      <h1 className="text-xl mb-4 font-bold text-center">Login Ruffo App</h1>
      
      {errorMsg && (
        <p className="text-red-500 bg-red-50 p-2 rounded border border-red-200 mb-4 text-sm">
          {errorMsg}
        </p>
      )}

      {/* Cambiamos el div por un FORM */}
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <Button 
          type="submit" // Importante: tipo submit
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Ingresar'}
        </Button>
      </form>
    </Card>
  )
}