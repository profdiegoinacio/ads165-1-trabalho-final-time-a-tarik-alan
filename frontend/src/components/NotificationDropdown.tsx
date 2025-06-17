'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
    Bell,
    Check,
    BookOpen,
    Calendar,
    AlertCircle,
    CheckCheck,
    Trash2
} from 'lucide-react'
import { useNotifications, type Notification } from '../hooks/useNotifications'

const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotifications()

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getNotificationIcon = (tipo: string) => {
        switch (tipo) {
            case 'AULA_AGENDADA':
                return <BookOpen className="w-4 h-4 text-blue-600" />
            case 'AULA_CANCELADA':
                return <Calendar className="w-4 h-4 text-red-600" />
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />
        }
    }

    const getNotificationColor = (tipo: string) => {
        switch (tipo) {
            case 'AULA_AGENDADA':
                return 'border-l-blue-500 bg-blue-50'
            case 'AULA_CANCELADA':
                return 'border-l-red-500 bg-red-50'
            default:
                return 'border-l-gray-500 bg-gray-50'
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Agora mesmo'
        if (diffInHours < 24) return `${diffInHours}h atrás`
        if (diffInHours < 48) return 'Ontem'
        return date.toLocaleDateString('pt-BR')
    }

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.lida) {
            await markAsRead(notification.id)
        }
    }

    const recentNotifications = notifications.slice(0, 5)

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botão de notificação */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown de notificações */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Notificações</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
                            >
                                <CheckCheck className="w-3 h-3" />
                                <span>Marcar todas como lidas</span>
                            </button>
                        )}
                    </div>

                    {/* Lista de notificações */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-sm text-gray-500 mt-2">Carregando...</p>
                            </div>
                        ) : recentNotifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                            </div>
                        ) : (
                            recentNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`border-l-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                        getNotificationColor(notification.tipo)
                                    } ${!notification.lida ? 'bg-blue-50' : 'bg-white'}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.tipo)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h4 className="text-sm font-medium text-gray-800 truncate">
                                                        {notification.titulo}
                                                    </h4>
                                                    {!notification.lida && (
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {notification.mensagem}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDate(notification.dataCriacao)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Ações */}
                                        <div className="flex items-center space-x-1 ml-2">
                                            {!notification.lida && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        markAsRead(notification.id)
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded"
                                                    title="Marcar como lida"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteNotification(notification.id)
                                                }}
                                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
                                                title="Deletar"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 5 && (
                        <div className="px-4 py-3 border-t border-gray-200 text-center">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    // Aqui você pode navegar para uma página de notificações completa
                                }}
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                Ver todas as notificações ({notifications.length})
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotificationDropdown