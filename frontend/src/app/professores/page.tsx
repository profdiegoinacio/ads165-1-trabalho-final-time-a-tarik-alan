'use client'

import React, { useState, useEffect } from 'react'
import ProfessorCard, { Professor } from '../../../components/ProfessorCard'
import ScheduleModal from '../../../components/ScheduleModal'

export default function ProfessoresCardsPage() {
    // Estados principais
    const [professores, setProfessores] = useState<Professor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Estados de busca e filtros
    const [searchTerm, setSearchTerm] = useState('')
    const [fMateria, setFMateria] = useState('')
    const [fDisponibilidade, setFDisponibilidade] = useState('')

    // Modal de agendamento
    const [showModal, setShowModal] = useState(false)
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)

    // Estados de mensagem de agendamento
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

    // Busca inicial dos professores (sem filtros)
    useEffect(() => {
        const token = localStorage.getItem('token') || ''
        fetch('http://localhost:8080/api/professores/disponiveis', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
            .then(async res => {
                if (!res.ok) throw new Error('Falha ao carregar professores.')
                const txt = await res.text();
                console.log('JSON bruto do servidor:', txt);
                return JSON.parse(txt); // ou return res.json()
            })
            .then(lista => {
                setProfessores(lista);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [])

    // Função para abrir modal ao clicar em “Agendar”
    const handleOpenModal = (prof: Professor) => {
        setSelectedProfessor(prof)
        setShowModal(true)
        setMessage('')
        setIsSuccess(null)
    }
    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedProfessor(null)
    }

    // Enviar agendamento para backend
    const handleConfirmSchedule = async (alunoId: number, dataHora: string, modalidade: string) => {
        if (!selectedProfessor) return
        setMessage('')
        setIsSuccess(null)
        const token = localStorage.getItem('token') || ''

        try {
            const payload = {
                alunoId,
                professorId: selectedProfessor.id,
                dataHora,
                modalidade,
            }
            const res = await fetch('http://localhost:8080/api/aulas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })
            const text = await res.text()

            if (res.ok) {
                setIsSuccess(true)
                setMessage('Aula agendada com sucesso!')
                // Opcional: feche o modal após 1s
                setTimeout(() => {
                    handleCloseModal()
                }, 1000)
            } else {
                setIsSuccess(false)
                setMessage(text)
            }
        } catch (err: any) {
            setIsSuccess(false)
            setMessage('Erro ao agendar: ' + err.message)
        }
    }

    // Aplicar busca e filtros localmente antes de renderizar
    const filteredProfessores = professores.filter(p => {
        // Busca por nome ou matéria (case-insensitive)
        const term = searchTerm.trim().toLowerCase()
        if (term) {
            const matchesNome = p.nome.toLowerCase().includes(term)
            const matchesMat = p.materia.toLowerCase().includes(term)
            if (!matchesNome && !matchesMat) return false
        }
        // Filtro por matéria exata (case-insensitive, se preenchido)
        if (fMateria && !p.materia.toLowerCase().includes(fMateria.trim().toLowerCase())) {
            return false
        }
        // Filtro por disponibilidade exata (se preenchido)
        if (fDisponibilidade) {
            // Assumindo que p.disponibilidade seja 'DISPONIVEL' ou 'INDISPONIVEL'
            if (p.disponibilidade.toLowerCase() !== fDisponibilidade.trim().toLowerCase()) {
                return false
            }
        }
        return true
    })

    if (loading) return <p className="text-center mt-8">Carregando professores...</p>
    if (error) return <p className="text-center mt-8 text-red-600">Erro: {error}</p>

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
                {/* ===== SIDEBAR (filtros) ===== */}
                <aside className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Filtros</h2>

                    {/* Campo de busca geral */}
                    <div className="mb-6">
                        <label htmlFor="search" className="block text-sm font-medium mb-1">
                            Buscar
                        </label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Nome ou matéria"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filtro por matéria */}
                    <div className="mb-6">
                        <label htmlFor="fMateria" className="block text-sm font-medium mb-1">
                            Matéria
                        </label>
                        <input
                            id="fMateria"
                            type="text"
                            placeholder="Ex: Matemática"
                            value={fMateria}
                            onChange={e => setFMateria(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filtro por disponibilidade */}
                    <div className="mb-6">
                        <label htmlFor="fDisponibilidade" className="block text-sm font-medium mb-1">
                            Disponibilidade
                        </label>
                        <select
                            id="fDisponibilidade"
                            value={fDisponibilidade}
                            onChange={e => setFDisponibilidade(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas</option>
                            <option value="DISPONIVEL">Disponível</option>
                            <option value="INDISPONIVEL">Indisponível</option>
                        </select>
                    </div>

                    {/* Botão para limpar filtros */}
                    <button
                        onClick={() => {
                            setSearchTerm('')
                            setFMateria('')
                            setFDisponibilidade('')
                        }}
                        className="w-full mt-4 text-center text-sm text-blue-600 hover:underline"
                    >
                        Limpar filtros
                    </button>
                </aside>

                {/* ===== MAIN CONTENT (cards) ===== */}
                <main className="flex-1">
                    {filteredProfessores.length === 0 ? (
                        <p className="text-center text-gray-600 mt-8">
                            Nenhum professor encontrado.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProfessores.map(prof => (
                                <ProfessorCard
                                    key={prof.id}
                                    professor={prof}
                                    onSchedule={() => handleOpenModal(prof)}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Mensagem de sucesso/erro de agendamento */}
            {message && (
                <p className={`mt-6 text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}

            {/* Modal de agendamento */}
            {showModal && selectedProfessor && (
                <ScheduleModal
                    professor={selectedProfessor}
                    onClose={handleCloseModal}
                    onSubmit={handleConfirmSchedule}
                />
            )}
        </div>
    )
}
