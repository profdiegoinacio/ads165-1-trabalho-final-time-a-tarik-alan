// hooks/useProfessores.ts
import { useState, useEffect } from 'react'
import type { Professor } from '../types'

type UseProfessoresReturn = {
    professores: Professor[]
    loading: boolean
    error: string | null
}

export const useProfessores = (
        token: string | null,
    role: string | null
): UseProfessoresReturn => {
    const [professores, setProfessores] = useState<Professor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (role !== 'ALUNO' || !token) {
            setLoading(false)
            return
        }

        const fetchProfessores = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/professores/disponiveis', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    cache: 'no-store'
                })

                if (!response.ok) {
                    throw new Error('Erro ao carregar professores')
                }

                const data = await response.json()
                setProfessores(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido')
            } finally {
                setLoading(false)
            }
        }

        fetchProfessores()
    }, [role, token])

    return { professores, loading, error }
}