import React, { useState } from 'react'
import { User, ChevronDown, Settings, LogOut } from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'

type MenuId = 'dashboard' | 'classes' | 'professors' | 'schedule' | 'profile'

type HeaderProps = {
    activeMenu: MenuId
    role: string | null
    userName: string
    onLogout?: () => void
    onProfileClick?: () => void
}

const Header: React.FC<HeaderProps> = ({
                                           activeMenu,
                                           role,
                                           userName,
                                           onLogout,
                                           onProfileClick
                                       }) => {
    const [showUserMenu, setShowUserMenu] = useState(false)

    const getTitle = (): string => {
        switch(activeMenu) {
            case 'dashboard':
                return 'Dashboard'
            case 'classes':
                return role === 'ALUNO' ? 'Minhas Aulas' : 'Aulas Marcadas'
            case 'professors':
                return 'Professores'
            case 'schedule':
                return 'Calendário'
            case 'profile':
                return 'Perfil'
            default:
                return 'Dashboard'
        }
    }

    const getGreeting = (): string => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Bom dia'
        if (hour < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left side - Title and greeting */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
                    <p className="text-sm text-gray-500">
                        {getGreeting()}, {userName}!
                    </p>
                </div>

                {/* Right side - Notifications and user menu */}
                <div className="flex items-center space-x-4">
                    {/* 👈 COMPONENTE DE NOTIFICAÇÕES */}
                    <NotificationDropdown />

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium text-gray-800">{userName}</p>
                                <p className="text-xs text-gray-500">
                                    {role === 'ALUNO' ? 'Estudante' : 'Professor'}
                                </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-800">{userName}</p>
                                    <p className="text-xs text-gray-500">
                                        {role === 'ALUNO' ? 'Estudante' : 'Professor'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        onProfileClick?.()
                                        setShowUserMenu(false)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Meu Perfil</span>
                                </button>

                                <button
                                    onClick={() => {
                                        // Configurações
                                        setShowUserMenu(false)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Configurações</span>
                                </button>

                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button
                                        onClick={() => {
                                            onLogout?.()
                                            setShowUserMenu(false)
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sair</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header