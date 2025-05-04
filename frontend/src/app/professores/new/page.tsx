'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProfessorPage() {
    const [form, setForm] = useState({
        nome: '',
        materia: '',
        valorHora: '',
        disponibilidade: ''
    })
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token') || ''
        const body = {
            nome: form.nome,
            materia: form.materia,
            valorHora: parseFloat(form.valorHora),
            disponibilidade: form.disponibilidade,
        }
        const res = await fetch('http://localhost:8080/api/professores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        const text = await res.text()
        setMessage(text)
        setIsSuccess(res.ok)
        if (res.ok) setTimeout(() => router.push('/professores'), 1000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <form onSubmit={handleSubmit}
                  className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-center">Novo Professor</h2>
                <input
                    name="nome" type="text" placeholder="Nome"
                    value={form.nome} onChange={handleChange}
                    className="w-full p-2 border rounded" required
                />
                <input
                    name="materia" type="text" placeholder="Matéria"
                    value={form.materia} onChange={handleChange}
                    className="w-full p-2 border rounded" required
                />
                <input
                    name="valorHora" type="number" placeholder="Valor por Hora"
                    value={form.valorHora} onChange={handleChange}
                    className="w-full p-2 border rounded" required
                />
                <input
                    name="disponibilidade" type="text" placeholder="Disponibilidade"
                    value={form.disponibilidade} onChange={handleChange}
                    className="w-full p-2 border rounded" required
                />
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                >
                    Criar
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
