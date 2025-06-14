// pages/dashboard.tsx - VERSÃO ATUALIZADA COM PROFILESECTION
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
    UserCheck,
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
import ProfileSection from '../../components/ProfileSection' // 👈 ADICIONAR ESTA LINHA

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
                <Header activeMenu={activeMenu} role={role} userName={userName} />

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
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                    {role === 'ALUNO' ?
                                        <BookOpen className="w-10 h-10 text-white" /> :
                                        <UserCheck className="w-10 h-10 text-white" />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Estatísticas */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <StatCard
                                        icon={BookOpen}
                                        value={aulas.length}
                                        label={role === 'ALUNO' ? 'Aulas Agendadas' : 'Aulas Marcadas'}
                                    />
                                    {role === 'ALUNO' && (
                                        <StatCard
                                            icon={DollarSign}
                                            value={`R$ ${totalGasto.toFixed(2)}`}
                                            label="Total Investido"
                                            color="green"
                                        />
                                    )}
                                    <StatCard
                                        icon={Users}
                                        value={role === 'ALUNO' ? professores.length : aulas.length}
                                        label={role === 'ALUNO' ? 'Professores Disponíveis' : 'Alunos Atendidos'}
                                    />
                                </div>

                                {/* Professores/Próximas Aulas */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-800">
                                            {role === 'ALUNO' ? 'Professores Disponíveis' : 'Próximas Aulas'}
                                        </h3>
                                        <button
                                            onClick={() => setActiveMenu(role === 'ALUNO' ? 'professors' : 'classes')}
                                            className="text-blue-600 text-sm hover:underline flex items-center"
                                        >
                                            Ver todos <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>

                                    {role === 'ALUNO' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {professores.slice(0, 4).map((professor) => (
                                                <div key={professor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-medium text-gray-800">{professor.nome}</h4>
                                                            <p className="text-sm text-gray-500">{professor.materia || 'Matéria não definida'}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-green-600">
                                                            R$ {professor.valorHora?.toFixed(2) || 'N/A'}/h
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAgendarAula(professor)}
                                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                    >
                                                        Agendar Aula
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {proximasAulas.length === 0 ? (
                                                <p className="text-gray-500 text-center py-4">Nenhuma aula agendada</p>
                                            ) : (
                                                proximasAulas.map((aula) => (
                                                    <div key={aula.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            {aula.modalidade === 'online' ?
                                                                <Video className="w-5 h-5 text-blue-600" /> :
                                                                <MapPin className="w-5 h-5 text-blue-600" />
                                                            }
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-800">{aula.aluno.nome}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(aula.dataHora).toLocaleString('pt-BR', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })} • {aula.modalidade}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar direita */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-gray-800 mb-4">Próximas Aulas</h3>
                                    {proximasAulas.length === 0 ? (
                                        <p className="text-gray-500 text-sm">Nenhuma aula agendada</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {proximasAulas.map((aula) => (
                                                <div key={aula.id} className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Clock className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-800">
                                                            {role === 'ALUNO' ? aula.professor.nome : aula.aluno.nome}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(aula.dataHora).toLocaleDateString('pt-BR')} às{' '}
                                                            {new Date(aula.dataHora).toLocaleTimeString('pt-BR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Avisos */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-gray-800 mb-4">Avisos</h3>
                                    <div className="space-y-4">
                                        {role === 'ALUNO' && (
                                            <div className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-medium text-gray-800 text-sm">Professores Disponíveis</h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {professores.length} professores disponíveis para agendamento.
                                                </p>
                                            </div>
                                        )}

                                        <div className="border-l-4 border-green-500 pl-4">
                                            <h4 className="font-medium text-gray-800 text-sm">
                                                {role === 'ALUNO' ? 'Próximas Avaliações' : 'Sistema Funcionando'}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {role === 'ALUNO'
                                                    ? 'Lembre-se de revisar o conteúdo antes das aulas.'
                                                    : 'Todas as funcionalidades estão operando normalmente.'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* SEÇÃO MINHAS AULAS */}
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
                                        <div key={aula.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                        {aula.modalidade === 'online' ?
                                                            <Video className="w-6 h-6 text-blue-600" /> :
                                                            <MapPin className="w-6 h-6 text-blue-600" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">
                                                            {role === 'ALUNO' ?
                                                                `${aula.professor.nome} - ${aula.professor.materia || 'Matéria não definida'}` :
                                                                `Aula com ${aula.aluno.nome}`
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(aula.dataHora).toLocaleDateString('pt-BR', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })} às {new Date(aula.dataHora).toLocaleTimeString('pt-BR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              aula.modalidade === 'online'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                          }`}>
                            {aula.modalidade === 'online' ? 'Online' : 'Presencial'}
                          </span>
                                                    {role === 'ALUNO' && aula.professor.valorHora && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            R$ {aula.professor.valorHora.toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {professores.map((professor) => (
                                        <div key={professor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{professor.nome}</h3>
                                                    <p className="text-sm text-gray-500">{professor.materia || 'Matéria não definida'}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Valor/hora:</span>
                                                    <span className="text-sm font-medium text-green-600">
                            R$ {professor.valorHora?.toFixed(2) || 'N/A'}
                          </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Status:</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
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

                {/* 🎯 SEÇÃO PERFIL - SUBSTITUIR O PLACEHOLDER! */}
                {activeMenu === 'profile' && (
                    <ProfileSection
                        role={role}
                        userName={userName}
                        userId={userId}
                        aulas={aulas}
                        professores={professores}
                        totalGasto={totalGasto}
                        onLogout={handleLogout}
                        onEditProfile={() => {
                            console.log('Editar perfil clicado')
                            // Implementar lógica de edição se necessário
                        }}
                    />
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
                                        className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => {
                                            const dataHora = (document.getElementById('dataHora') as HTMLInputElement).value
                                            const modalidade = (document.getElementById('modalidade') as HTMLSelectElement).value
                                            handleScheduleSubmit(dataHora, modalidade)
                                        }}
                                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                                    >
                                        Confirmar
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