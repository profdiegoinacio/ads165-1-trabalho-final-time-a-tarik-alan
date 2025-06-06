'use client'

import React, { useState, useEffect } from 'react'

type Aula = {
    id: number
    aluno: { id: number; nome: string }
    professor: { id: number; nome: string }
    dataHora: string
    modalidade: string
}

export default function AulasProfessorPage() {
    const [aulas, setAulas] = useState<Aula[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token') || ''
        fetch('http://localhost:8080/api/aulas/professor', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 403) throw new Error('Acesso negado. Faça login de professor.')
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
        <div className="px-6 py-8">
            <h1 className="text-2xl font-semibold mb-4">Aulas Marcadas</h1>

            {aulas.length === 0 ? (
                <p className="text-gray-600">Nenhuma aula agendada para você no momento.</p>
            ) : (
                <ul className="space-y-4">
                    {aulas.map(aula => (
                        <li
                            key={aula.id}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                        >
                            <p>
                                <span className="font-medium">Aluno: </span>
                                {aula.aluno.nome}
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
    )
}
