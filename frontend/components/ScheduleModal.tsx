'use client'

import React, { FC, useState } from 'react'
import { Professor } from './ProfessorCard'

interface ScheduleModalProps {
    professor: Professor
    onClose: () => void
    onSubmit: (data: { date: string; time: string; modalidade: string }) => void
}

const ScheduleModal: FC<ScheduleModalProps> = ({ professor, onClose, onSubmit }) => {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [modalidade, setModalidade] = useState('online')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ date, time, modalidade })
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Agendar aula com {professor.nome}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Data</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="mt-1 block w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Hora</label>
                        <input
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="mt-1 block w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Modalidade</label>
                        <select
                            value={modalidade}
                            onChange={e => setModalidade(e.target.value)}
                            className="mt-1 block w-full border rounded p-2"
                        >
                            <option value="online">Online</option>
                            <option value="presencial">Presencial</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ScheduleModal