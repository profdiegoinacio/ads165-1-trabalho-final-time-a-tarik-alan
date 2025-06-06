// components/Sidebar.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const [role, setRole] = useState<string | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        const storedRole = localStorage.getItem('role')
        setRole(storedRole)
    }, [])

    // Se estivermos em /login ou /register (ou qualquer outra rota pública), não mostrar nada
    if (pathname === '/login' || pathname === '/register') {
        return null
    }

    // Se não há role (ainda não carregou ou usuário não logado), também não mostrar
    if (!role) {
        return null
    }

    const menuItems =
        role === 'ALUNO'
            ? [
                { label: 'Professores', href: '/professores' },
                { label: 'Minhas Aulas', href: '/aluno/aulas' },
            ]
            : [
                { label: 'Minhas Aulas', href: '/professor/aulas' },
            ]

    return (
        <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                    {role === 'ALUNO' ? 'Aluno' : 'Professor'}
                </h2>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-2">
                    {menuItems.map(item => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                                    pathname === item.href ? 'bg-gray-100 font-medium' : ''
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}
