'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Input, Button } from '../../components'

export default function RegisterPage() {
    const [nome, setNome]     = useState('')
    const [email, setEmail]   = useState('')
    const [senha, setSenha]   = useState('')
    const [role, setRole]     = useState('aluno') // estado para tipo de usuário
    const [msg, setMsg]       = useState('')
    const [isSuccess, setOk]  = useState<boolean|null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = { nome, email, senha, role }
        const res = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        const text = await res.text()
        setMsg(text)
        setOk(res.ok)
        if (res.ok) setTimeout(() => router.push('/login'), 1000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Crie sua conta</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Nome completo"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                    />
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Você é:</label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="aluno">Aluno</option>
                            <option value="professor">Professor</option>
                        </select>
                    </div>
                    <Button type="submit" className="w-full">
                        Registrar
                    </Button>
                    {msg && (
                        <p className={`text-center mt-2 ${
                            isSuccess ? 'text-secondary' : 'text-danger'
                        }`}>
                            {msg}
                        </p>
                    )}
                </form>
                <p className="text-center text-sm mt-4">
                    Já tem conta?{' '}
                    <a href="/login" className="text-primary hover:underline">
                        Faça login
                    </a>
                </p>
            </Card>
        </div>
    )
}