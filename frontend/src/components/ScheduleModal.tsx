import React, { useState } from 'react'
import { Professor } from './ProfessorCard'

type Props = {
    professor: Professor
    onClose: () => void
    /**
     * Ajustamos onSubmit para receber apenas (dataHora, modalidade).
     * O Dashboard que consome este modal é responsável por decidir
     * qual aluno e qual ID de professor devem ser enviados ao backend.
     */
    onSubmit: (dataHora: string, modalidade: string) => void
}

export default function ScheduleModal({
                                          professor,
                                          onClose,
                                          onSubmit,
                                      }: Props) {
    const [dataHora, setDataHora] = useState('')
    const [modalidade, setModalidade] = useState('online')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Passa apenas dataHora e modalidade para o parent
        onSubmit(dataHora, modalidade)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                    Agendar Aula com {professor.nome}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo de Data e Hora */}
                    <div>
                        <label
                            htmlFor="dataHora"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Data e Hora
                        </label>
                        <input
                            id="dataHora"
                            type="datetime-local"
                            value={dataHora}
                            onChange={(e) => setDataHora(e.target.value)}
                            required
                            className="mt-1 w-full border rounded p-2"
                        />
                    </div>

                    {/* Campo de Modalidade */}
                    <div>
                        <label
                            htmlFor="modalidade"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Modalidade
                        </label>
                        <select
                            id="modalidade"
                            value={modalidade}
                            onChange={(e) => setModalidade(e.target.value)}
                            className="mt-1 w-full border rounded p-2"
                        >
                            <option value="online">Online</option>
                            <option value="presencial">Presencial</option>
                        </select>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
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
    )
}
