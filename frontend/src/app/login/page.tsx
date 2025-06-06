'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault()
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }), // supondo que o DTO seja { email, senha }
            })

            if (!res.ok) {
                const txt = await res.text()
                throw new Error(txt)
            }

            const data = await res.json()
            // data = { token: "...", userId: 5, role: "PROFESSOR" } (por exemplo)
            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', data.userId.toString())
            localStorage.setItem('role', data.role)

            // Redireciona ao dashboard ou lista de professores
            router.push('/dashboard') // ou onde quiser
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="max-w-sm mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block mb-1">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label htmlFor="senha" className="block mb-1">
                        Senha
                    </label>
                    <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Entrar
                </button>
            </form>
        </div>
    )
}
