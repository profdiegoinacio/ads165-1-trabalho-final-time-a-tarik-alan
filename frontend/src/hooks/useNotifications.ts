// frontend/src/hooks/useNotifications.ts
'use client'
import { useState, useEffect, useCallback } from 'react'

export interface Notification {
    id: number
    titulo: string
    mensagem: string
    tipo: 'AULA_AGENDADA' | 'AULA_CANCELADA' | 'SISTEMA'
    lida: boolean
    dataCriacao: string
    aulaId?: number
}

interface UseNotificationsReturn {
    notifications: Notification[]
    unreadCount: number
    loading: boolean
    markAsRead: (id: number) => Promise<void>
    markAllAsRead: () => Promise<void>
    deleteNotification: (id: number) => Promise<void>
    refreshNotifications: () => Promise<void>
}

export const useNotifications = (): UseNotificationsReturn => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const getToken = () => localStorage.getItem('token')

    const fetchNotifications = useCallback(async () => {
        try {
            const token = getToken()
            if (!token) return

            const response = await fetch('http://localhost:8080/api/notificacoes', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                setNotifications(data)

                // Conta não lidas
                const unread = data.filter((n: Notification) => !n.lida).length
                setUnreadCount(unread)
            }
        } catch (error) {
            console.error('Erro ao buscar notificações:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchUnreadCount = useCallback(async () => {
        try {
            const token = getToken()
            if (!token) return

            const response = await fetch('http://localhost:8080/api/notificacoes/count', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                setUnreadCount(data.count)
            }
        } catch (error) {
            console.error('Erro ao buscar contador de notificações:', error)
        }
    }, [])

    const markAsRead = async (id: number) => {
        try {
            const token = getToken()
            if (!token) return

            const response = await fetch(`http://localhost:8080/api/notificacoes/${id}/lida`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, lida: true } : n)
                )
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            const token = getToken()
            if (!token) return

            const response = await fetch('http://localhost:8080/api/notificacoes/marcar-todas-lidas', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => ({ ...n, lida: true }))
                )
                setUnreadCount(0)
            }
        } catch (error) {
            console.error('Erro ao marcar todas como lidas:', error)
        }
    }

    const deleteNotification = async (id: number) => {
        try {
            const token = getToken()
            if (!token) return

            const response = await fetch(`http://localhost:8080/api/notificacoes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id))
                // Atualiza contador se a notificação deletada não estava lida
                const notification = notifications.find(n => n.id === id)
                if (notification && !notification.lida) {
                    setUnreadCount(prev => Math.max(0, prev - 1))
                }
            }
        } catch (error) {
            console.error('Erro ao deletar notificação:', error)
        }
    }

    const refreshNotifications = async () => {
        setLoading(true)
        await fetchNotifications()
    }

    useEffect(() => {
        fetchNotifications()

        // Atualizar notificações a cada 30 segundos
        const interval = setInterval(fetchUnreadCount, 30000)

        return () => clearInterval(interval)
    }, [fetchNotifications, fetchUnreadCount])

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications
    }
}