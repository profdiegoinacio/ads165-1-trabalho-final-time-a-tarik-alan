'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Aula = {
    id: number
    aluno: { id: number; nome: string }
    professor: { id: number; nome: string }
    dataHora: string
    modalidade: string
}

export default function AulasPage() {
    const [aulas, setAulas]     = useState<Aula[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState<string | null>(null)

    const fetchAulas = async () => {
        const token = localStorage.getItem('token') || ''
        try {
            const res = await fetch('http://localhost:8080/api/aulas', {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
            })
            if (!res.ok) throw new Error('Falha ao buscar agendamentos')
            setAulas(await res.json())
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAulas() }, [])

    const handleCancel = async (id: number) => {
        if (!confirm('Cancelar este agendamento?')) return
        const token = localStorage.getItem('token') || ''
        const res = await fetch(`http://localhost:8080/api/aulas/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 204) {
            setAulas(prev => prev.filter(a => a.id !== id))
        } else {
            alert('Erro ao cancelar agendamento')
        }
    }

    if (loading) return <p>Carregando agendamentos...</p>
    if (error)   return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-4">
                <Link href="/aulas/new">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Novo Agendamento
                    </button>
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Meus Agendamentos</h1>

            {aulas.length === 0 ? (
                <p className="text-gray-600">Nenhum agendamento.</p>
            ) : (
                <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Aluno</th>
                        <th className="px-4 py-2">Professor</th>
                        <th className="px-4 py-2">Data/Hora</th>
                        <th className="px-4 py-2">Modalidade</th>
                        <th className="px-4 py-2">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {aulas.map(a => (
                        <tr key={a.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{a.id}</td>
                            <td className="px-4 py-2">{a.aluno.nome}</td>
                            <td className="px-4 py-2">{a.professor.nome}</td>
                            <td className="px-4 py-2">{new Date(a.dataHora).toLocaleString()}</td>
                            <td className="px-4 py-2">{a.modalidade}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleCancel(a.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Cancelar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
