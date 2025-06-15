// frontend/src/app/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [role, setRole] = useState('ALUNO') // estado para tipo de usuário
    const [msg, setMsg] = useState('')
    const [isSuccess, setOk] = useState<boolean | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = { nome, email, senha, role }

        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const text = await res.text()
            setMsg(text)
            setOk(res.ok)

            if (res.ok) {
                setTimeout(() => router.push('/login'), 1500)
            }
        } catch (error) {
            setMsg('Erro ao conectar com o servidor ' + error)
            setOk(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
            {/* Logo no canto superior esquerdo - mesmo local da tela de login */}
            <div className="logo">
                {/* Aqui você pode adicionar sua logo quando tiver */}
            </div>

            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">CRIAR CONTA</h2>

                {/* Mensagem de feedback */}
                {msg && (
                    <div className={`mb-4 p-3 rounded-lg text-center text-sm ${
                        isSuccess
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="text"
                            placeholder="Nome completo"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <input
                            type="email"
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
                            placeholder="Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Você é:
                        </label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-gray-700 bg-transparent"
                        >
                            <option value="ALUNO">Aluno</option>
                            <option value="PROFESSOR">Professor</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                    >
                        Criar Conta
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Já tem conta?{' '}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Faça login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}