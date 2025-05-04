'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Professor = {
    id: number
    nome: string
    materia: string
    valorHora: number
    disponibilidade: string
}

export default function ProfessoresPage() {
    const [professores, setProfessores] = useState<Professor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState<string | null>(null)

    // estados de filtro
    const [fMateria, setFMateria]             = useState('')
    const [fMinValor, setFMinValor]           = useState('')
    const [fMaxValor, setFMaxValor]           = useState('')
    const [fDisponibilidade, setFDisponibilidade] = useState('')

    // busca dados com filtros
    const fetchProfessores = async () => {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token') || ''
        // monta query string apenas com filtros preenchidos
        const params = new URLSearchParams()
        if (fMateria) params.append('materia', fMateria)
        if (fMinValor) params.append('minValor', fMinValor)
        if (fMaxValor) params.append('maxValor', fMaxValor)
        if (fDisponibilidade) params.append('disponibilidade', fDisponibilidade)

        try {
            const res = await fetch(
                `http://localhost:8080/api/professores?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
            )
            if (!res.ok) throw new Error('Falha ao buscar professores')
            setProfessores(await res.json())
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProfessores() }, [])

    // handler do form de filtros
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        fetchProfessores()
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este professor?')) return
        const token = localStorage.getItem('token') || ''
        const res = await fetch(`http://localhost:8080/api/professores/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 204) {
            setProfessores(prev => prev.filter(p => p.id !== id))
        } else {
            alert('Erro ao excluir professor')
        }
    }

    if (loading) return <p>Carregando...</p>
    if (error)   return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleFilterSubmit} className="bg-white p-4 rounded mb-6 shadow space-y-4">
                <h2 className="font-bold">Filtros</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        placeholder="Matéria"
                        value={fMateria}
                        onChange={e => setFMateria(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        placeholder="Valor mínimo"
                        type="number"
                        value={fMinValor}
                        onChange={e => setFMinValor(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        placeholder="Valor máximo"
                        type="number"
                        value={fMaxValor}
                        onChange={e => setFMaxValor(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        placeholder="Disponibilidade"
                        value={fDisponibilidade}
                        onChange={e => setFDisponibilidade(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Aplicar Filtros
                </button>
            </form>
            <div className="flex justify-end mb-4">
                <Link href="/professores/new">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Novo Professor
                    </button>
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Lista de Professores</h1>

            {professores.length === 0 ? (
                <p className="text-gray-600">Nenhum professor cadastrado.</p>
            ) : (
                <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nome</th>
                        <th className="px-4 py-2">Matéria</th>
                        <th className="px-4 py-2">Valor/Hora</th>
                        <th className="px-4 py-2">Disponibilidade</th>
                        <th className="px-4 py-2">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {professores.map((p) => (
                        <tr key={p.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{p.id}</td>
                            <td className="px-4 py-2">{p.nome}</td>
                            <td className="px-4 py-2">{p.materia}</td>
                            <td className="px-4 py-2">{p.valorHora}</td>
                            <td className="px-4 py-2">{p.disponibilidade}</td>
                            <td className="px-4 py-2">
                                <Link href={`/professores/${p.id}/edit`} className="text-blue-600 hover:underline mr-4">
                                    Editar
                                </Link>
                                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                                    Excluir
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
