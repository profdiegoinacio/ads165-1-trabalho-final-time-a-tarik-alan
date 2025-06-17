'use client'

import React, { useState } from 'react'
import {
    Video,
    MapPin,
    Clock,
    Calendar,
    X,
    AlertTriangle
} from 'lucide-react'

interface Aula {
    id: number
    aluno: { id: number; nome: string }
    professor: { id: number; nome: string; materia?: string | null; valorHora?: number | null }
    dataHora: string
    modalidade: string
}

interface AulaCardProps {
    aula: Aula
    userRole: 'ALUNO' | 'PROFESSOR'
    onCancelSuccess: (aulaId: number) => void
}

const AulaCard: React.FC<AulaCardProps> = ({ aula, userRole, onCancelSuccess }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString)
        return {
            date: date.toLocaleDateString('pt-BR'),
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
    }

    const isPastDate = (dateTimeString: string) => {
        return new Date(dateTimeString) < new Date()
    }

    const handleCancelClick = () => {
        setShowConfirmModal(true)
    }

    const handleConfirmCancel = async () => {
        setIsLoading(true)

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:8080/api/aulas/${aula.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 204 || response.ok) {
                onCancelSuccess(aula.id)
                setShowConfirmModal(false)
            } else {
                throw new Error('Erro ao cancelar aula')
            }
        } catch (error) {
            alert('Erro ao cancelar aula. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const { date, time } = formatDateTime(aula.dataHora)
    const isPast = isPastDate(aula.dataHora)

    return (
        <>
            <div className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                isPast ? 'bg-gray-50 opacity-75' : 'bg-white'
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                        {/* Ícone da modalidade */}
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            {aula.modalidade?.toLowerCase() === 'online' ? (
                                <Video className="w-6 h-6 text-blue-600" />
                            ) : (
                                <MapPin className="w-6 h-6 text-blue-600" />
                            )}
                        </div>

                        {/* Informações da aula */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-800">
                                    {userRole === 'ALUNO'
                                        ? `Aula com ${aula.professor.nome}`
                                        : `Aula com ${aula.aluno.nome}`
                                    }
                                </h3>
                                {isPast && (
                                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                                        Finalizada
                                    </span>
                                )}
                            </div>

                            {aula.professor.materia && (
                                <p className="text-sm text-gray-600 mb-1">
                                    Matéria: {aula.professor.materia}
                                </p>
                            )}

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{date}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {aula.modalidade?.toLowerCase() === 'online' ? (
                                        <>
                                            <Video className="w-4 h-4" />
                                            <span>Online</span>
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="w-4 h-4" />
                                            <span>Presencial</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {aula.professor.valorHora && (
                                <div className="mt-2">
                                    <span className="text-sm font-medium text-green-600">
                                        R$ {aula.professor.valorHora.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botão de cancelar */}
                    {!isPast && (
                        <div className="ml-4">
                            <button
                                onClick={handleCancelClick}
                                disabled={isLoading}
                                className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                title="Cancelar aula"
                            >
                                <X className="w-4 h-4" />
                                <span className="text-sm font-medium">Cancelar</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmação */}
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Cancelar Aula
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Esta ação não pode ser desfeita
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-700 mb-2">
                                <strong>Detalhes da aula:</strong>
                            </p>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                    {userRole === 'ALUNO'
                                        ? `Professor: ${aula.professor.nome}`
                                        : `Aluno: ${aula.aluno.nome}`
                                    }
                                </p>
                                <p>Data: {date} às {time}</p>
                                <p>Modalidade: {aula.modalidade}</p>
                                {aula.professor.materia && (
                                    <p>Matéria: {aula.professor.materia}</p>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Tem certeza que deseja cancelar esta aula?
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isLoading}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Manter Aula
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={isLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        <span>Cancelando...</span>
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4" />
                                        <span>Sim, Cancelar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AulaCard