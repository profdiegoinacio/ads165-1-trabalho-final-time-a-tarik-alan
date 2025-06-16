// frontend/src/app/dashboard/page.tsx - Seção das Aulas Marcadas Atualizada
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    BookOpen,
    DollarSign,
    Users,
    Clock,
    Video,
    MapPin,
    ChevronRight,
    User
} from 'lucide-react'

// Imports dos hooks customizados
import { useUserData } from '../../hooks/useUserData'
import { useProfessores } from '../../hooks/useProfessores'
import { useAulas } from '../../hooks/useAulas'

// Imports dos componentes
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import StatCard from '../../components/StatCard'
import ProfileSection from '../../components/ProfileSection'
import AulaCard from '../../components/AulaCard'

// Imports dos tipos
import type { MenuId, Professor, Aula } from '../../types'

const Dashboard: React.FC = () => {
    const router = useRouter()

    // Estados dos hooks customizados
    const { role, userId, token, userName } = useUserData()
    const { professores, loading: loadingProfs } = useProfessores(token, role)
    const { aulas, setAulas, loading: loadingAulas } = useAulas(token, role)

    // Estados locais
    const [activeMenu, setActiveMenu] = useState<MenuId>('dashboard')
    const [showModal, setShowModal] = useState(false)
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)

    // Cálculos derivados
    const totalGasto = aulas.reduce((acc, aula) => acc + (aula.professor.valorHora || 0), 0)
    const proximasAulas = aulas
        .filter(aula => new Date(aula.dataHora) > new Date())
        .slice(0, 3)

    // Handlers
    const handleLogout = (): void => {
        const items = ['token', 'role', 'userId', 'userName']
        items.forEach(item => localStorage.removeItem(item))
        router.push('/')
    }

    const handleAgendarAula = (professor: Professor): void => {
        setSelectedProfessor(professor)
        setShowModal(true)
    }

    // 👈 NOVA FUNÇÃO PARA CANCELAMENTO
    const handleCancelSuccess = (aulaId: number): void => {
        setAulas(prev => prev.filter(aula => aula.id !== aulaId))
    }

    const handleScheduleSubmit = async (dataHora: string, modalidade: string): Promise<void> => {
        if (!selectedProfessor || !userId || !token) return

        try {
            const response = await fetch('http://localhost:8080/api/aulas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    alunoId: userId,
                    professorId: selectedProfessor.id,
                    dataHora,
                    modalidade
                })
            })

            if (!response.ok) {
                throw new Error('Falha ao agendar')
            }

            const novaAula: Aula = await response.json()
            setAulas(prev => [...prev, novaAula])
            setShowModal(false)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido'
            alert(`Erro ao agendar: ${message}`)
        }
    }

    // Loading state
    if (!role || !userId || !token) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <LoadingSpinner text="Carregando..." />
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                role={role}
                onLogout={handleLogout}
            />

            <div className="flex-1 overflow-auto">
                <Header activeMenu={activeMenu} role={role} userName={userName} onLogout={handleLogout} />

                {/* DASHBOARD */}
                {activeMenu === 'dashboard' && (
                    <>
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white mx-6 mt-6 rounded-2xl p-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-blue-200 text-sm mb-2">
                                    {new Date().toLocaleDateString('pt-BR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <h1 className="text-2xl font-bold mb-2">
                                    Bem-vindo de volta, {userName}!
                                </h1>
                                <p className="text-blue-200">
                                    {role === 'ALUNO' ? 'Sempre seja otimista em seus estudos!' : 'Inspire seus alunos hoje!'}
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                            <div className="absolute bottom-0 right-8 w-16 h-16 bg-white/10 rounded-full translate-y-4"></div>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Stats Cards - Altura fixa */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-42"> {/* 👈 ALTURA FIXA */}
                                    <StatCard
                                        label={role === 'ALUNO' ? 'Aulas Agendadas' : 'Aulas Marcadas'}
                                        value={aulas.length.toString()}
                                        icon={BookOpen}
                                        color="blue"
                                    />
                                </div>
                                <div className="h-42"> {/* 👈 ALTURA FIXA */}
                                    <StatCard
                                        label={role === 'ALUNO' ? 'Total Investido' : 'Professores Disponíveis'}
                                        value={role === 'ALUNO' ? `R$ ${totalGasto.toFixed(2)}` : professores.filter(p => p.disponibilidade === 'DISPONIVEL').length.toString()}
                                        icon={role === 'ALUNO' ? DollarSign : Users}
                                        color="green"
                                    />
                                </div>
                            </div>

                            {/* Próximas Aulas - Altura flexível */}
                            <div className="flex flex-col"> {/* 👈 FLEX COLUMN PARA CRESCER NATURALMENTE */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Próximas Aulas</h3>
                                        <Clock className="w-5 h-5 text-gray-400" />
                                    </div>

                                    {loadingAulas ? (
                                        <LoadingSpinner text="Carregando..." size="sm" />
                                    ) : proximasAulas.length === 0 ? (
                                        <div className="text-center py-6">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <BookOpen className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 text-sm">
                                                {role === 'ALUNO' ? 'Nenhuma aula agendada' : 'Nenhuma aula marcada'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {proximasAulas.map((aula) => (
                                                <div key={aula.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        {aula.modalidade?.toLowerCase() === 'online' ? (
                                                            <Video className="w-5 h-5 text-blue-600" />
                                                        ) : (
                                                            <MapPin className="w-5 h-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 truncate">
                                                            {role === 'ALUNO' ? aula.professor.nome : aula.aluno.nome}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(aula.dataHora).toLocaleDateString('pt-BR')} às {' '}
                                                            {new Date(aula.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* 🎯 SEÇÃO MINHAS AULAS - ATUALIZADA COM AULACARD */}
                {activeMenu === 'classes' && (
                    <div className="p-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                {role === 'ALUNO' ? 'Minhas Aulas Agendadas' : 'Aulas Marcadas'}
                            </h2>

                            {loadingAulas ? (
                                <LoadingSpinner text="Carregando aulas..." />
                            ) : aulas.length === 0 ? (
                                <EmptyState
                                    icon={BookOpen}
                                    title={role === 'ALUNO' ? 'Você ainda não tem aulas agendadas' : 'Nenhuma aula marcada ainda'}
                                    description={role === 'ALUNO' ? 'Que tal agendar uma aula?' : 'Aguarde os alunos agendarem aulas'}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {aulas.map((aula) => (
                                        <AulaCard
                                            key={aula.id}
                                            aula={aula}
                                            userRole={role as 'ALUNO' | 'PROFESSOR'}
                                            onCancelSuccess={handleCancelSuccess}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SEÇÃO PROFESSORES */}
                {activeMenu === 'professors' && role === 'ALUNO' && (
                    <div className="p-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Professores Disponíveis</h2>

                            {loadingProfs ? (
                                <LoadingSpinner text="Carregando professores..." />
                            ) : professores.length === 0 ? (
                                <EmptyState
                                    icon={Users}
                                    title="Nenhum professor encontrado"
                                    description="Aguarde novos professores se cadastrarem"
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {professores.map((professor) => (
                                        <div key={professor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{professor.nome}</h3>
                                                    <p className="text-sm text-gray-600">{professor.materia || 'Matéria não informada'}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Valor/hora:</span>
                                                    <span className="font-medium text-gray-800">
                                                        {professor.valorHora ? `R$ ${professor.valorHora.toFixed(2)}` : 'Não informado'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        professor.disponibilidade === 'DISPONIVEL'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {professor.disponibilidade === 'DISPONIVEL' ? 'Disponível' : 'Indisponível'}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleAgendarAula(professor)}
                                                disabled={professor.disponibilidade !== 'DISPONIVEL'}
                                                className={`w-full py-2 rounded-lg transition-colors text-sm font-medium ${
                                                    professor.disponibilidade === 'DISPONIVEL'
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                {professor.disponibilidade === 'DISPONIVEL' ? 'Agendar Aula' : 'Indisponível'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SEÇÃO CALENDÁRIO */}
                {activeMenu === 'schedule' && (
                    <div className="p-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Calendário</h2>
                            <p className="text-gray-600">Esta seção será implementada em breve.</p>
                        </div>
                    </div>
                )}

                {/* SEÇÃO PERFIL */}
                {activeMenu === 'profile' && (
                    <ProfileSection onLogout={handleLogout} />
                )}

                {/* MODAL DE AGENDAMENTO */}
                {showModal && selectedProfessor && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4">
                                Agendar Aula com {selectedProfessor.nome}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Data e Hora</label>
                                    <input
                                        id="dataHora"
                                        type="datetime-local"
                                        required
                                        className="mt-1 w-full border rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Modalidade</label>
                                    <select id="modalidade" className="mt-1 w-full border rounded p-2">
                                        <option value="online">Online</option>
                                        <option value="presencial">Presencial</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2 mt-6">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => {
                                            const dataHoraInput = document.getElementById('dataHora') as HTMLInputElement
                                            const modalidadeInput = document.getElementById('modalidade') as HTMLSelectElement

                                            if (dataHoraInput.value && modalidadeInput.value) {
                                                handleScheduleSubmit(dataHoraInput.value, modalidadeInput.value)
                                            } else {
                                                alert('Preencha todos os campos')
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Agendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard