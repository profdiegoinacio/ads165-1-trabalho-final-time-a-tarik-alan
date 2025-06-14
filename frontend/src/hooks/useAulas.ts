// hooks/useAulas.ts
import { useState, useEffect } from 'react'
import type { Aula } from '../types'

type UseAulasReturn = {
    aulas: Aula[]
    setAulas: React.Dispatch<React.SetStateAction<Aula[]>>
        loading: boolean
error: string | null
}

export const useAulas = (
        token: string | null,
    role: string | null
): UseAulasReturn => {
    const [aulas, setAulas] = useState<Aula[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!token || !role) {
            setLoading(false)
            return
        }

        const endpoint = role === 'ALUNO' ? '/api/aulas/aluno' : '/api/aulas/professor'

        const fetchAulas = async () => {
            try {
                const response = await fetch(`http://localhost:8080${endpoint}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    cache: 'no-store'
                })

                if (!response.ok) {
                    throw new Error('Erro ao carregar aulas')
                }

                const data = await response.json()
                setAulas(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido')
            } finally {
                setLoading(false)
            }
        }

        fetchAulas()
    }, [role, token])

    return { aulas, setAulas, loading, error }
}