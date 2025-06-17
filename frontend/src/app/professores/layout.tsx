'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ProfessoresLayout({
                                              children,
                                          }: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [role, setRole] = useState<string | null>(null)

    useEffect(() => {
        const storedRole = localStorage.getItem('role')
        setRole(storedRole)
    }, [])

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-100 p-4">
                <nav className="space-y-2">


                    {role === 'PROFESSOR' && (
                        <Link
                            href="/professores/config"
                            className={`block px-2 py-1 rounded ${
                                pathname === '/professores/config' ? 'bg-blue-200' : ''
                            }`}
                        >
                            Configurar Meu Perfil
                        </Link>
                    )}
                </nav>
            </aside>

            <main className="flex-1 bg-white">{children}</main>
        </div>
    )
}
