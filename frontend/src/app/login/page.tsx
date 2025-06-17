'use client'
import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            })
            if (!res.ok) {
                const txt = await res.text()
                throw new Error(txt)
            }
            const data = await res.json()
            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', data.userId.toString())
            localStorage.setItem('role', data.role)
            localStorage.setItem('userName', data.userName)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
            <div className="logo">


            </div>

            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">LOGIN</h2>
                {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            name="username"
                            placeholder="E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            name="pass"
                            placeholder="Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={e => setRemember(e.target.checked)}
                                className="mr-2"
                            />
                            Lembrar-me
                        </label>
                        <a href="#" className="hover:underline">Esqueceu?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                    >
                        Entrar
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Ainda não tem conta?{' '}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Criar conta
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}
