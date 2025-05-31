'use client'

import React, { useState, useEffect } from 'react'

type Aula = {
    id: number
    aluno: { id: number; nome: string }        // já popula via JSON do backend
    professor: { id: number; nome: string }
    dataHora: string                           // ex: "2025-05-30T14:00"
    modalidade: string                         // "online" ou "presencial"
}

export default function MinhasAulasPage() {
    const [aulas, setAulas] = useState<Aula[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token') || ''
        fetch('http://localhost:8080/api/aulas/aluno', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 403) throw new Error('Acesso negado. Faça login de aluno.')
                    throw new Error('Falha ao buscar suas aulas.')
                }
                return res.json()
            })
            .then((data: Aula[]) => {
                setAulas(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    if (loading) return <p className="text-center mt-8">Carregando suas aulas...</p>
    if (error) return <p className="text-center mt-8 text-red-600">Erro: {error}</p>

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
                <h1 className="text-2xl font-semibold mb-4">Minhas Aulas Agendadas</h1>

                {aulas.length === 0 ? (
                    <p className="text-gray-600">Você ainda não agendou nenhuma aula.</p>
                ) : (
                    <ul className="space-y-4">
                        {aulas.map(aula => (
                            <li
                                key={aula.id}
                                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                            >
                                <p>
                                    <span className="font-medium">Professor: </span>
                                    {aula.professor.nome}
                                </p>
                                <p>
                                    <span className="font-medium">Data & Hora: </span>
                                    {new Date(aula.dataHora).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                                <p>
                                    <span className="font-medium">Modalidade: </span>
                                    {aula.modalidade === 'online' ? 'Online' : 'Presencial'}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
