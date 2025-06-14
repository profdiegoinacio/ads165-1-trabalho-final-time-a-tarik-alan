// components/ProfessorCard.tsx
import React from 'react'

export type Professor = {
    id: number
    nome: string
    materia: string | null
    valorHora: number | null
    disponibilidade: string
}

type Props = {
    professor: Professor
    onSchedule: (professor: Professor) => void
}

export default function ProfessorCard({ professor, onSchedule }: Props) {
    // Verifica se o professor está disponível
    const isDisponivel =
        professor.disponibilidade.toLowerCase() === 'disponivel'

    return (
        <div className="border rounded-lg shadow-sm p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{professor.nome}</h3>
            <p className="text-sm mb-1">
                <span className="font-medium">Matéria:</span>{' '}
                {professor.materia ?? 'Não definida'}
            </p>
            <p className="text-sm mb-1">
                <span className="font-medium">Valor/Hora:</span>{' '}
                {professor.valorHora != null
                    ? `R$ ${professor.valorHora.toFixed(2)}`
                    : 'Não definido'}
            </p>
            <p className="text-sm mb-4">
                <span className="font-medium">Disponibilidade:</span>{' '}
                {professor.disponibilidade}
            </p>

            <button
                onClick={() => onSchedule(professor)}
                disabled={!isDisponivel}
                className={`mt-auto w-full py-2 rounded-full text-white font-medium transition-colors ${
                    isDisponivel
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                Agendar Aula
            </button>
        </div>
    )
}
