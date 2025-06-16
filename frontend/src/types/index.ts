// frontend/src/types/index.ts
export type MenuId = 'dashboard' | 'classes' | 'professors' | 'schedule' | 'profile'

export interface Professor {
    id: number
    nome: string
    materia?: string | null
    valorHora?: number | null
    disponibilidade: 'DISPONIVEL' | 'INDISPONIVEL'
    usuario?: {
        id: number
        nome: string
        email: string
        role: string
    }
}

export interface Usuario {
    id: number
    nome: string
    email: string
    role: 'ALUNO' | 'PROFESSOR'
}

export interface Aula {
    id: number
    aluno: {
        id: number
        nome: string
    }
    professor: {
        id: number
        nome: string
        materia?: string | null
        valorHora?: number | null
    }
    dataHora: string
    modalidade: string
}

export interface UseUserDataReturn {
    role: string | null
    userId: string | null
    token: string | null
    userName: string
}

export interface UseProfessoresReturn {
    professores: Professor[]
    loading: boolean
    error: string | null
}

export interface UseAulasReturn {
    aulas: Aula[]
    setAulas: React.Dispatch<React.SetStateAction<Aula[]>>
    loading: boolean
    error: string | null
}