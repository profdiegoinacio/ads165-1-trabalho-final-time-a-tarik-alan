// components/Header.tsx
import React, { useState } from 'react'
import { Bell, User, ChevronDown, Settings, LogOut } from 'lucide-react'

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
                    {/* Notifications */}
                    <div className="relative">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                            {/* Notification badge */}
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                        </button>
                    </div>

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
                                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Configurações</span>
                                </button>

                                <button
                                    onClick={() => {
                                        onLogout?.()
                                        setShowUserMenu(false)
                                    }}
                                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sair</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                ></div>
            )}
        </div>
    )
}

export default Header