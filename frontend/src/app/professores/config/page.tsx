'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type Professor = {
    id: number
    nome: string
    materia: string | null
    valorHora: number | null
    disponibilidade: string
}

export default function ConfigProfessorPage() {
    const router = useRouter()

    // Estados de formulário
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Campos que o professor vai preencher
    const [materia, setMateria] = useState<string>('')
    const [valorHora, setValorHora] = useState<string>('')

    const [professorId, setProfessorId] = useState<number | null>(null)
    const [nome, setNome] = useState<string>('') // Apenas para exibir nome do professor

    // 1) Ao montar, vamos recuperar userId e token do localStorage
    useEffect(() => {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')

        if (!token || !userId) {
            // Se não estiver logado, redireciona para a tela de login
            router.push('/login')
            return
        }

        // 2) Chama o backend para buscar dados do professor pelo usuário
        fetch(`http://localhost:8080/api/professores/usuario/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text()
                    throw new Error(`Erro ao buscar professor: ${text}`)
                }
                return res.json()
            })
            .then((data: Professor) => {
                // Se o backend não retornar um professor (404), vamos forçar a página de erro
                if (!data || !data.id) {
                    throw new Error('Nenhum professor encontrado para este usuário.')
                }
                setProfessorId(data.id)
                setNome(data.nome)
                setMateria(data.materia ?? '')      // Pode vir null se não configurado ainda
                setValorHora(data.valorHora?.toString() ?? '') // Pode vir null
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [router])

    // 3) Função de submissão do formulário (PUT /api/professores/{id})
    const handleSubmit = (evt: FormEvent) => {
        evt.preventDefault()
        if (!professorId) {
            setError('ID do professor não encontrado.')
            return
        }

        const token = localStorage.getItem('token')
        if (!token) {
            setError('Usuário não autenticado.')
            return
        }

        // Prepara o corpo somente com os campos que o professor quer configurar
        const corpoAtualizacao: Partial<Professor> = {
            materia: materia.trim(),
            valorHora: valorHora ? parseFloat(valorHora) : null,
            // Se o professor quiser também alterar a disponibilidade, poderia adicionar aqui
        }

        fetch(`http://localhost:8080/api/professores/${professorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(corpoAtualizacao),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text()
                    throw new Error(`Falha ao atualizar: ${text}`)
                }
                return res.json()
            })
            .then((dadosAtualizados: Professor) => {
                // Redireciona o professor para a listagem de aulas ou perfil
            })
            .catch((err) => {
                setError(err.message)
            })
    }

    if (loading) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-semibold">Carregando dados do seu perfil…</h2>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-semibold text-red-600">Erro:</h2>
                <p className="text-red-700">{error}</p>
            </div>
        )
    }

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Configurar Perfil de Professor</h1>
            <p className="mb-6">
                Olá, <strong>{nome}</strong>. Preencha abaixo a matéria que você ministra e seu valor/hora.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Matéria */}
                <div>
                    <label htmlFor="materia" className="block font-medium mb-1">
                        Matéria
                    </label>
                    <input
                        id="materia"
                        type="text"
                        value={materia}
                        onChange={(e) => setMateria(e.target.value)}
                        placeholder="Ex: Matemática, Física, Portguês..."
                        required
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Valor Hora */}
                <div>
                    <label htmlFor="valorHora" className="block font-medium mb-1">
                        Valor/Hora (R$)
                    </label>
                    <input
                        id="valorHora"
                        type="number"
                        step="0.01"
                        value={valorHora}
                        onChange={(e) => setValorHora(e.target.value)}
                        placeholder="Ex: 80.00"
                        required
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Botão de Salvar */}
                <div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Salvar Configurações
                    </button>
                </div>

                {error && (
                    <p className="mt-2 text-red-700">Erro ao atualizar: {error}</p>
                )}
            </form>
        </div>
    )
}
