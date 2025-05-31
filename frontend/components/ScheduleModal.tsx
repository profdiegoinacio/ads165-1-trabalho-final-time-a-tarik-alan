// components/ScheduleModal.tsx
import React, { useState } from 'react'
import { Professor } from './ProfessorCard'

type Props = {
    professor: Professor
    onClose: () => void
    onSubmit: (alunoId: number, dataHora: string, modalidade: string) => void
}

export default function ScheduleModal({ professor, onClose, onSubmit }: Props) {
    const [dataHora, setDataHora] = useState('')
    const [modalidade, setModalidade] = useState('online')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const alunoIdStr = localStorage.getItem('userId')
        if (!alunoIdStr) {
            alert('Não foi possível identificar o usuário logado.')
            return
        }
        if (!dataHora) {
            alert('Por favor, selecione data e hora.')
            return
        }
        const alunoId = Number(alunoIdStr)
        onSubmit(alunoId, dataHora, modalidade)
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
            {/* Fundo semitransparente */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal em si */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">
                        Agendar aula com:
                    </h2>
                    <p className="text-lg text-center text-gray-600">{professor.nome}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="dataHora" className="block text-sm font-medium text-gray-700">
                                Data e Hora
                            </label>
                            <input
                                id="dataHora"
                                type="datetime-local"
                                value={dataHora}
                                onChange={e => setDataHora(e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="modalidade" className="block text-sm font-medium text-gray-700">
                                Modalidade
                            </label>
                            <select
                                id="modalidade"
                                value={modalidade}
                                onChange={e => setModalidade(e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="online">Online</option>
                                <option value="presencial">Presencial</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Confirmar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
