'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

type Usuario = {
    id: number
    nome: string
    email: string
    senha: string
}

export default function EditUserPage() {
    const { id } = useParams()           // id dinâmico da rota
    const router = useRouter()

    const [form, setForm] = useState<Partial<Usuario>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState<string | null>(null)
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

    // Carrega dados atuais do usuário
    useEffect(() => {
        const token = localStorage.getItem('token') || ''
               fetch(`http://localhost:8080/api/usuarios/${id}`, {
                   cache: 'no-store',
                   headers: {
                   'Authorization': `Bearer ${token}`
                 }
           })
            .then(res => {
                if (!res.ok) throw new Error('Usuário não encontrado')
                return res.json()
            })
            .then((data: Usuario) => {
                setForm({ nome: data.nome, email: data.email, senha: data.senha })
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token') || ''
        console.log(id)
        const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form),
        })

        const text = await res.text()
        setMessage(text)
        setIsSuccess(res.ok)

        if (res.ok) {
            setTimeout(() => router.push('/users'), 1000)
        }
    }

    if (loading) return <p>Carregando usuário...</p>
    if (error)   return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <form onSubmit={handleSubmit}
                  className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-center">Editar Usuário</h2>

                <input
                    name="nome"
                    type="text"
                    placeholder="Nome"
                    value={form.nome || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    name="senha"
                    type="password"
                    placeholder="Senha"
                    value={form.senha || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <button type="submit"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded w-full">
                    Atualizar
                </button>

                {message && (
                    <p className={`text-sm text-center mt-2 ${
                        isSuccess ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    )
}
