// frontend/src/app/layout.tsx
import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
        <head />
        <body className="font-sans min-h-screen bg-neutral-50 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-primary">Aula Fácil</h1>
            <nav className="space-x-4 text-sm">
                <Link href="/login" className="text-neutral-700 hover:text-primary">
                    Login
                </Link>
                <Link href="/register" className="text-neutral-700 hover:text-primary">
                    Registrar
                </Link>
                <Link href="/users" className="text-neutral-700 hover:text-primary">
                    Usuários
                </Link>
                <Link href="/professores" className="text-neutral-700 hover:text-primary">
                    Professores
                </Link>
                <Link href="/aluno/aulas" className="text-neutral-700 hover:text-primary">
                    Aulas
                </Link>
                <Link href="/add_professor" className="text-neutral-700 hover:text-primary">
                    Adicionar Professor
                </Link>
            </nav>
        </header>
        <main className="flex-1 container mx-auto p-6">
            {children}
        </main>
        <footer className="bg-white text-center p-4 text-sm text-neutral-400">
            © 2025 Aula Fácil
        </footer>
        </body>
        </html>
    )
}
