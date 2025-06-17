import { useState, useEffect } from 'react'
import {UseUserDataReturn} from '../types'

export const useUserData = (): UseUserDataReturn => {
    const [role, setRole] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [userName, setUserName] = useState<string>('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedRole = localStorage.getItem('role')
            const storedUserId = localStorage.getItem('userId')
            const storedToken = localStorage.getItem('token')
            const storedUserName = localStorage.getItem('userName') || 'Usuário'

            setRole(storedRole)
            setUserId(storedUserId ? storedUserId: null)
            setToken(storedToken)
            setUserName(storedUserName)
        }
    }, [])

    return { role, userId, token, userName }
}