'use client'

import React, { useState } from 'react'
import {
    User,
    Mail,
    Shield,
    Settings,
    LogOut,
    Edit,
    Save,
    X,
    Check,
    AlertCircle
} from 'lucide-react'

interface ProfileSectionProps {
    onLogout: () => void
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onLogout }) => {
    // Estados dos dados do usuário
    const role = localStorage.getItem('role') || 'ALUNO'
    const userId = localStorage.getItem('userId') || ''
    const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Usuário')
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '')

    // Estados para edição
    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState(userName)
    const [editedEmail, setEditedEmail] = useState(userEmail)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

    // Função para obter saudação baseada no horário
    const getSaudacao = (): string => {
        const hora = new Date().getHours()
        if (hora < 12) return 'Bom dia'
        if (hora < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    const primeiroNome = userName.split(' ')[0]

    // Função para salvar as alterações
    const handleSave = async () => {
        if (!editedName.trim()) {
            setMessage('Nome não pode estar vazio')
            setMessageType('error')
            return
        }

        if (!editedEmail.trim() || !editedEmail.includes('@')) {
            setMessage('Email inválido')
            setMessageType('error')
            return
        }

        setIsSaving(true)
        setMessage('')

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:8080/api/usuarios/${userId}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome: editedName.trim(),
                    email: editedEmail.trim()
                })
            })

            if (response.ok) {
                // Atualiza os estados locais
                setUserName(editedName.trim())
                setUserEmail(editedEmail.trim())

                // Atualiza localStorage
                localStorage.setItem('userName', editedName.trim())
                localStorage.setItem('userEmail', editedEmail.trim())

                setIsEditing(false)
                setMessage('Dados atualizados com sucesso!')
                setMessageType('success')

                // Remove mensagem após 3 segundos
                setTimeout(() => setMessage(''), 3000)
            } else {
                const errorText = await response.text()
                setMessage(errorText || 'Erro ao atualizar dados')
                setMessageType('error')
            }
        } catch (error) {
            setMessage('Erro de conexão com o servidor ' + error)
            setMessageType('error')
        } finally {
            setIsSaving(false)
        }
    }

    // Função para cancelar edição
    const handleCancel = () => {
        setEditedName(userName)
        setEditedEmail(userEmail)
        setIsEditing(false)
        setMessage('')
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header do Perfil */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Meu Perfil</h1>
                                <p className="text-blue-200 text-sm">
                                    {role === 'ALUNO' ? '🎓 Estudante' : '👨‍🏫 Professor'}
                                </p>
                                <p className="text-blue-200 text-sm">
                                    {getSaudacao()}, {primeiroNome}!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-blue-200 text-sm">ID do Usuário</p>
                        <p className="text-xl font-bold">#{userId}</p>
                        <p className="text-blue-200 text-xs">
                            Membro desde {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal - Informações Pessoais */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Informações Pessoais - EDITÁVEL */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Informações Pessoais</h2>
                            <div className="flex items-center space-x-2">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span className="text-sm font-medium">Editar</span>
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                        >
                                            {isSaving ? (
                                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            <span className="text-sm font-medium">
                                                {isSaving ? 'Salvando...' : 'Salvar'}
                                            </span>
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                            className="flex items-center space-x-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                        >
                                            <X className="w-4 h-4" />
                                            <span className="text-sm font-medium">Cancelar</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mensagem de feedback */}
                        {message && (
                            <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                                messageType === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                                {messageType === 'success' ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <AlertCircle className="w-4 h-4" />
                                )}
                                <span className="text-sm">{message}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Completo
                                    </label>
                                    {!isEditing ? (
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <User className="w-5 h-5 text-gray-500" />
                                            <span className="text-gray-800 font-medium">{userName}</span>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="Digite seu nome completo"
                                            />
                                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        E-mail
                                    </label>
                                    {!isEditing ? (
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-gray-500" />
                                            <span className="text-gray-800">
                                                {userEmail || `${primeiroNome.toLowerCase()}@email.com`}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={editedEmail}
                                                onChange={(e) => setEditedEmail(e.target.value)}
                                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="Digite seu e-mail"
                                            />
                                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <Shield className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-800">
                                            {role === 'ALUNO' ? 'Estudante' : 'Professor'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status da Conta</label>
                                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-green-800 font-medium">Ativa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna Lateral - Ações */}
                <div className="space-y-6">
                    {/* Ações Rápidas */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h3>

                        <div className="space-y-3">
                            {role === 'PROFESSOR' && (
                                <button
                                    onClick={() => {
                                        window.location.href = '/professores/config'
                                    }}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Configurar Perfil de Professor</span>
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    alert('Funcionalidade de alteração de senha em desenvolvimento')
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Shield className="w-5 h-5" />
                                <span>Alterar Senha</span>
                            </button>
                        </div>
                    </div>

                    {/* Sessão e Logout */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Sessão</h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Último acesso:</span>
                                <span className="text-gray-800">
                                    {new Date().toLocaleDateString('pt-BR')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Conectado como:</span>
                                <span className="text-gray-800 font-medium">{primeiroNome}</span>
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mt-4"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sair da Conta</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileSection