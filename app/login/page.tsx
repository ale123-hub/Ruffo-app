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
  const [loading, setLoading] = useState(false) // Estado para feedback visual
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setErrorMsg('')
    
    // Usamos el 'supabase' que viene del import de arriba
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
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

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <Button 
          className="w-full" 
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Ingresar'}
        </Button>
      </div>
    </Card>
  )
}