'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../src/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMsg(error.message)
    } else {
      router.push('/clientes')
    }
  }

  return (
    <Card className="p-8 max-w-md mx-auto mt-20">
      <h1 className="text-xl mb-4">Login Ruffo App</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleLogin}>Ingresar</Button>
    </Card>
  )
}