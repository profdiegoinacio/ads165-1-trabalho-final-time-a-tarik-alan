'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

type Usuario = {
    id: number
    nome: string
    email: string
}

export default function UsersPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Busca a lista de usuários
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token') || ''
            const res = await fetch('http://localhost:8080/api/usuarios', {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store'
            })
            if (!res.ok) throw new Error('Falha ao buscar usuários')
            const data: Usuario[] = await res.json()
            setUsuarios(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Função de exclusão
    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return

        try {
            const token = localStorage.getItem('token') || ''
            const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.status === 204) {
                // remove da lista sem recarregar
                setUsuarios((prev) => prev.filter((u) => u.id !== id))
            } else {
                throw new Error('Erro ao excluir usuário')
            }
        } catch (err: any) {
            alert(err.message)
        }
    }

    if (loading) return <p>Carregando...</p>
    if (error)   return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-4">
                <Link href="/users/new">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Novo Usuário
                    </button>
                </Link>
            </div>

            {usuarios.length === 0 ? (
                <p className="text-gray-600">Nenhum usuário cadastrado.</p>
            ) : (
                <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Nome</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{u.id}</td>
                            <td className="px-4 py-2">{u.nome}</td>
                            <td className="px-4 py-2">{u.email}</td>
                            <td className="px-4 py-2">

                                <Link href={`/users/${u.id}/edit`} className="text-blue-600 hover:underline mr-4">
                                        Editar
                                      </Link>
                                  <button
                                    onClick={() => handleDelete(u.id)}
                                    className="text-red-600 hover:underline"
                                  >
                                    Excluir
                                  </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
