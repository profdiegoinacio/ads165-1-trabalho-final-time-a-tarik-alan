// components/ProfileSection.tsx - VERSÃO SIMPLES (SEM BUSCA NO BANCO)
import React from 'react'
import {
    User,
    Mail,
    Calendar,
    BookOpen,
    DollarSign,
    Users,
    Settings,
    Award,
    Clock,
    TrendingUp,
    Shield,
    LogOut,
    Camera
} from 'lucide-react'
import StatCard from './StatCard'

type ProfileSectionProps = {
    role: string | null
    userName: string
    userId: number | null
    aulas: any[]
    professores?: any[]
    totalGasto?: number
    onLogout: () => void
    onEditProfile?: () => void
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
                                                           role,
                                                           userName, // 👈 USANDO O NOME REAL AO INVÉS DE "Usuário"
                                                           userId,
                                                           aulas,
                                                           professores = [],
                                                           totalGasto = 0,
                                                           onLogout
                                                       }) => {
    // Cálculos de estatísticas
    const proximasAulas = aulas.filter(aula => new Date(aula.dataHora) > new Date()).length
    const aulasPassadas = aulas.filter(aula => new Date(aula.dataHora) <= new Date()).length
    const alunosAtendidos = role === 'PROFESSOR'
        ? new Set(aulas.map(aula => aula.aluno.id)).size
        : 0

    // Função para obter saudação baseada no horário
    const getSaudacao = () => {
        const hora = new Date().getHours()
        if (hora < 12) return 'Bom dia'
        if (hora < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    // Pegar primeiro nome para saudação
    const primeiroNome = userName ? userName.split(' ')[0] : 'Usuário'

    return (
        <div className="p-6 space-y-6">
            {/* Header do Perfil */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600">
                                <Camera className="w-3 h-3" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{userName}</h1>
                            <p className="text-blue-200">
                                {role === 'ALUNO' ? '🎓 Estudante' : '👨‍🏫 Professor'}
                            </p>
                            <p className="text-blue-200 text-sm">
                                {getSaudacao()}, {primeiroNome}!
                            </p>
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
                    {/* Informações Pessoais - APENAS VISUALIZAÇÃO */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Informações Pessoais</h2>
                            <div className="flex items-center space-x-2 text-green-600">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">Dados Protegidos</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-800 font-medium">{userName}</span> {/* 👈 NOME REAL */}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <Mail className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-800">
                      {/* Usando email do localStorage ou placeholder */}
                                            {localStorage.getItem('userEmail') || `${primeiroNome.toLowerCase()}@email.com`}
                    </span>
                                    </div>
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

                        {/* Informação sobre edição */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start space-x-3">
                                <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-blue-800">Alterar Dados Pessoais</h4>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Entre em contato com o suporte para alterar seu nome ou e-mail.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Histórico de Atividades */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Histórico de Atividades</h2>

                        <div className="space-y-4">
                            {aulas.length === 0 ? (
                                <div className="text-center py-8">
                                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Nenhuma atividade registrada</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {role === 'ALUNO'
                                            ? 'Suas aulas agendadas aparecerão aqui'
                                            : 'Suas aulas marcadas aparecerão aqui'
                                        }
                                    </p>
                                </div>
                            ) : (
                                aulas.slice(0, 5).map((aula, index) => (
                                    <div key={aula.id || index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            new Date(aula.dataHora) > new Date() ? 'bg-blue-100' : 'bg-green-100'
                                        }`}>
                                            {new Date(aula.dataHora) > new Date() ?
                                                <Calendar className="w-5 h-5 text-blue-600" /> :
                                                <Award className="w-5 h-5 text-green-600" />
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">
                                                {role === 'ALUNO' ?
                                                    `Aula com ${aula.professor.nome}` :
                                                    `Aula com ${aula.aluno.nome}`
                                                }
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(aula.dataHora).toLocaleDateString('pt-BR', {
                                                    weekday: 'long',
                                                    day: '2-digit',
                                                    month: 'long'
                                                })} às{' '}
                                                {new Date(aula.dataHora).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            new Date(aula.dataHora) > new Date()
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                      {new Date(aula.dataHora) > new Date() ? 'Agendada' : 'Concluída'}
                    </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Coluna Lateral - Estatísticas e Ações */}
                <div className="space-y-6">
                    {/* Estatísticas do Usuário */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800">Suas Estatísticas</h3>

                        <StatCard
                            icon={BookOpen}
                            value={aulas.length}
                            label={role === 'ALUNO' ? 'Total de Aulas' : 'Aulas Ministradas'}
                            color="blue"
                        />

                        {role === 'ALUNO' ? (
                            <>
                                <StatCard
                                    icon={DollarSign}
                                    value={`R$ ${totalGasto.toFixed(2)}`}
                                    label="Total Investido"
                                    color="green"
                                />
                                <StatCard
                                    icon={Users}
                                    value={professores.length}
                                    label="Professores Disponíveis"
                                    color="purple"
                                />
                            </>
                        ) : (
                            <>
                                <StatCard
                                    icon={Users}
                                    value={alunosAtendidos}
                                    label="Alunos Atendidos"
                                    color="green"
                                />
                                <StatCard
                                    icon={TrendingUp}
                                    value={aulasPassadas}
                                    label="Aulas Realizadas"
                                    color="purple"
                                />
                            </>
                        )}

                        <StatCard
                            icon={Clock}
                            value={proximasAulas}
                            label="Próximas Aulas"
                            color="yellow"
                        />
                    </div>

                    {/* Ações Rápidas */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h3>

                        <div className="space-y-3">
                            {role === 'PROFESSOR' && (
                                <button
                                    onClick={() => {
                                        // Navegar para configuração de professor
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

                            <button
                                onClick={() => {
                                    alert('Entre em contato com o suporte para alterar dados pessoais')
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <User className="w-5 h-5" />
                                <span>Solicitar Alteração de Dados</span>
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
                                <span className="text-gray-800 font-medium">{primeiroNome}</span> {/* 👈 NOME REAL */}
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