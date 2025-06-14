// types/index.ts
export type Professor = {
    id: number
    nome: string
    materia: string | null
    valorHora: number | null
    disponibilidade: string
}

export type Aula = {
    id: number
    dataHora: string
    modalidade: string
    professor: {
        id: number
        nome: string
        materia: string | null
        valorHora: number | null
        disponibilidade: string
    }
    aluno: {
        id: number
        nome: string
        email: string
    }
}

export type UserData = {
    role: string | null
    userId: number | null
    token: string | null
    userName: string
}

export type MenuId = 'dashboard' | 'classes' | 'professors' | 'schedule' | 'profile'