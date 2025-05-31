import React from 'react'

export type Professor = {
    id: number
    nome: string
    materia: string
    valorHora: number
    disponibilidade: string
}

type Props = {
    professor: Professor
    onSchedule: (professor: Professor) => void
}

export default function ProfessorCard({ professor, onSchedule }: Props) {
    const isDisponivel = true;//professor.disponibilidade.toLowerCase() === 'disponivel'

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Se quiser exibir uma imagem ou ícone: você pode colocar aqui */}
            <div className="p-5 space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">{professor.nome}</h3>
                <p className="text-gray-600">
                    <span className="font-medium">Matéria: </span>
                    {professor.materia}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Valor/Hora: </span>R$ {professor.valorHora.toFixed(2)}
                </p>
                <p
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        isDisponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                    {isDisponivel ? 'Disponível' : 'Indisponível'}
                </p>

                <button
                    onClick={() => onSchedule(professor)}
                    disabled={!isDisponivel}
                    className={`mt-4 w-full text-center py-2 rounded-full text-white font-medium transition-colors ${
                        isDisponivel
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    Agendar Aula
                </button>
            </div>
        </div>
    )
}
