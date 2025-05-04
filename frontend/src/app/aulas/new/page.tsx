'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Professor = { id: number; nome: string }
export default function NewAulaPage() {
    const [professores, setProfessores] = useState<Professor[]>([])
    const [form, setForm] = useState({
        alunoId: '',
        professorId: '',
        dataHora: '',
        modalidade: 'online'
    })
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState<boolean|null>(null)
    const router = useRouter()

    // carrega lista de professores
    useEffect(() => {
        const token = localStorage.getItem('token') || ''
        fetch('http://localhost:8080/api/professores', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        })
            .then(res => res.json())
            .then(setProfessores)
            .catch(console.error)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token') || ''
        const payload = {
            alunoId: parseInt(form.alunoId),
            professorId: parseInt(form.professorId),
            dataHora: form.dataHora,
            modalidade: form.modalidade
        }
        const res = await fetch('http://localhost:8080/api/aulas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        const text = await res.text()
        setMessage(text)
        setIsSuccess(res.ok)
        if (res.ok) setTimeout(() => router.push('/aulas'), 1000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <form onSubmit={handleSubmit}
                  className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-center">Novo Agendamento</h2>

                <input
                    name="alunoId"
                    type="number"
                    placeholder="Seu ID de Aluno"
                    value={form.alunoId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <select
                    name="professorId"
                    value={form.professorId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Selecione um professor</option>
                    {professores.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nome}
                        </option>
                    ))}
                </select>

                <input
                    name="dataHora"
                    type="datetime-local"
                    value={form.dataHora}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <select
                    name="modalidade"
                    value={form.modalidade}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="online">Online</option>
                    <option value="presencial">Presencial</option>
                </select>

                <button type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
                    Agendar
                </button>

                {message && (
                    <p className={`text-sm text-center mt-2 ${
                        isSuccess ? 'text-green-600' : 'text-red-600'
                    }`}>{message}</p>
                )}
            </form>
        </div>
    )
}
