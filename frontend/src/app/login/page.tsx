// frontend/src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Input, Button } from '../../../components'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [msg, setMsg] = useState('')
    const [isSuccess, setIsSuccess] = useState<boolean|null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        })
        const textOrJson = await res.text()
        if (!res.ok) {
            setMsg(textOrJson); setIsSuccess(false); return
        }
        const { token, userId } = JSON.parse(textOrJson)
        localStorage.setItem('token', token)
        localStorage.setItem('userId', userId)
        setMsg('Login bem-sucedido!'); setIsSuccess(true)
        setTimeout(() => router.push('/users'), 800)
    }

    return (
        <div className="flex justify-center items-center h-full">
            <Card className="w-full max-w-md">
                <h2 className="text-xl font-medium mb-4 text-center">Entrar</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full">
                        Entrar
                    </Button>
                    {msg && (
                        <p className={`text-center mt-2 ${
                            isSuccess ? 'text-secondary' : 'text-danger'
                        }`}>
                            {msg}
                        </p>
                    )}
                </form>
            </Card>
        </div>
    )
}
