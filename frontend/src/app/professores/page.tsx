'use client'

import React, { useState, useEffect } from 'react'
import ProfessorCard, { Professor } from '../../../components/ProfessorCard'
import ScheduleModal from '../../../components/ScheduleModal'

export default function ProfessoresCardsPage() {
    const [professores, setProfessores] = useState<Professor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [fMateria, setFMateria] = useState('')
    const [fDisponibilidade, setFDisponibilidade] = useState('')

    const [showModal, setShowModal] = useState(false)
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)

    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

    const fetchProfessores = async () => {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token') || ''
        try {
            const res = await fetch('http://localhost:8080/api/professores', {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store'
            })
            if (!res.ok) throw new Error('Erro ao carregar professores')
            setProfessores(await res.json())
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProfessores() }, [])

    const handleSchedule = (prof: Professor) => {
        setSelectedProfessor(prof)
        setShowModal(true)
        setMessage('')
        setIsSuccess(null)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedProfessor(null)
    }

    const handleConfirmSchedule = async (data: { date: string; time: string; modalidade: string }) => {
        if (!selectedProfessor) return
        const token = localStorage.getItem('token') || ''
        const payload = {
            alunoId: parseInt(localStorage.getItem('userId') || '0'),
            professorId: selectedProfessor.id,
            dataHora: `${data.date}T${data.time}`,
            modalidade: data.modalidade
        }
        try {
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
            if (res.ok) setTimeout(() => handleCloseModal(), 1000)
        } catch (err: any) {
            setMessage('Erro ao agendar aula')
            setIsSuccess(false)
        }
    }

    const materias = Array.from(new Set(professores.map(p => p.materia)))
    const disponibilidades = Array.from(new Set(professores.map(p => p.disponibilidade)))

    const filtered = professores.filter(p => {
        const matchesSearch =
            p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.materia.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMateria = !fMateria || p.materia === fMateria
        const matchesDisp = !fDisponibilidade || p.disponibilidade === fDisponibilidade
        return matchesSearch && matchesMateria && matchesDisp
    })

    if (loading) return <p>Carregando professores...</p>
    if (error) return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Professores</h1>
            <div className="flex gap-6">
                <aside className="w-1/4 bg-white p-6 rounded-xl shadow space-y-4">
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou matéria"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />
                    <select
                        value={fMateria}
                        onChange={e => setFMateria(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="">Todas Matérias</option>
                        {materias.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <select
                        value={fDisponibilidade}
                        onChange={e => setFDisponibilidade(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="">Todas Disponibilidades</option>
                        {disponibilidades.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </aside>
                <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length === 0 ? (
                        <p className="text-gray-600">Nenhum professor encontrado.</p>
                    ) : (
                        filtered.map(p => (
                            <ProfessorCard
                                key={p.id}
                                professor={p}
                                onSchedule={handleSchedule}
                            />
                        ))
                    )}
                </main>
            </div>
            {message && (
                <p className={`mt-4 text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
            )}
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
