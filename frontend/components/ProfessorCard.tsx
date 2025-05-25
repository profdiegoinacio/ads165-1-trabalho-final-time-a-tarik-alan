'use client'

import React, { FC } from 'react'

export interface Professor {
    id: number
    nome: string
    materia: string
    valorHora: number
    disponibilidade: string
}

interface ProfessorCardProps {
    professor: Professor
    onSchedule: (professor: Professor) => void
}

const ProfessorCard: FC<ProfessorCardProps> = ({ professor, onSchedule }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow">
        <div>
            <h3 className="text-2xl font-semibold mb-2">{professor.nome}</h3>
            <p className="text-gray-600"><strong>Matéria:</strong> {professor.materia}</p>
            <p className="text-gray-600"><strong>Valor/Hora:</strong> R$ {professor.valorHora.toFixed(2)}</p>
            <p className="text-gray-600"><strong>Disponibilidade:</strong> {professor.disponibilidade}</p>
        </div>
        <button
            onClick={() => onSchedule(professor)}
            className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
        >
            Agendar Aula
        </button>
    </div>
)

export default ProfessorCard