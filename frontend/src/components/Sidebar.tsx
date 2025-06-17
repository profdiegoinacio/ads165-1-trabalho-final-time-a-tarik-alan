import React from 'react'
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    Users,
    User,
    LogOut
} from 'lucide-react'

type MenuId = 'dashboard' | 'classes' | 'professors' | 'schedule' | 'profile'

type SidebarProps = {
    activeMenu: MenuId
    setActiveMenu: (menu: MenuId) => void
    role: string | null
    onLogout: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
                                             activeMenu,
                                             setActiveMenu,
                                             role,
                                             onLogout
                                         }) => {
    const menuItems = [
        {
            id: 'dashboard' as MenuId,
            label: 'Dashboard',
            icon: LayoutDashboard
        },
        {
            id: 'classes' as MenuId,
            label: role === 'ALUNO' ? 'Minhas Aulas' : 'Aulas Marcadas',
            icon: BookOpen
        },
        {
            id: 'professors' as MenuId,
            label: 'Professores',
            icon: Users,
            hideFor: role === 'PROFESSOR' // Oculta para professores
        },
        {
            id: 'schedule' as MenuId,
            label: 'Calendário',
            icon: Calendar
        },
        {
            id: 'profile' as MenuId,
            label: 'Perfil',
            icon: User
        },
    ]

    return (
        <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col">
            <div className="p-6">
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-18 h-18 bg-transparent rounded-lg flex items-center justify-center p-1">
                        <img
                            src="/images/logo2.png"
                            alt="Aula Fácil Logo"
                            className="w-64 h-64 object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.parentElement!.innerHTML = '📚'
                            }}
                        />
                    </div>
                    <div>
                        <span className="text-xl font-bold">Aula Fácil</span>
                        <p className="text-blue-200 text-xs">
                            {role === 'ALUNO' ? 'Portal do Estudante' : 'Portal do Professor'}
                        </p>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-2">
                    {menuItems
                        .filter(item => !item.hideFor) // Remove itens ocultos
                        .map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveMenu(item.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        activeMenu === item.id
                                            ? 'bg-white/20 text-white shadow-lg'
                                            : 'text-blue-200 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            )
                        })}
                </nav>
            </div>

            {/* Footer - Logout */}
            <div className="mt-auto p-6 border-t border-white/10">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sair</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar