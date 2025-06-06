'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProfessorCard from '../../../components/ProfessorCard'
import ScheduleModal from '../../../components/ScheduleModal'

// ---- Se não quiser criar arquivo separado, cole estas interfaces aqui mesmo: ----
type Professor = {
    id: number
    nome: string
    materia: string | null
    valorHora: number | null
    disponibilidade: string
}

type Aula = {
    id: number
    dataHora: string
    modalidade: string
    professor: {
        id: number
        nome: string
        materia: string | null
        valorHora: number | null
        disponibilidade: string
    }
    aluno: {
        id: number
        nome: string
        email: string
    }
}

export default function DashboardPage() {
    const router = useRouter()

    // Estado geral do usuário logado
    const [role, setRole] = useState<string | null>(null)
    const [userId, setUserId] = useState<number | null>(null)
    const [token, setToken] = useState<string | null>(null)

    // Estados específicos para ALUNO
    const [professoresDisponiveis, setProfessoresDisponiveis] = useState<Professor[]>([])
    const [aulasDoAluno, setAulasDoAluno] = useState<Aula[]>([])
    const [loadingAluno, setLoadingAluno] = useState(true)
    const [errorAluno, setErrorAluno] = useState<string | null>(null)

    // Estados específicos para PROFESSOR
    const [aulasDoProfessor, setAulasDoProfessor] = useState<Aula[]>([])
    const [loadingProfessor, setLoadingProfessor] = useState(true)
    const [errorProfessor, setErrorProfessor] = useState<string | null>(null)

    // Estados de modal de agendamento (caso o aluno queira marcar ao clicar em um card)
    const [showModal, setShowModal] = useState(false)
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)

    // 1) Ao montar, pegamos role, userId e token do localStorage
    useEffect(() => {
        const storedRole = localStorage.getItem('role')
        const storedUserId = localStorage.getItem('userId')
        const storedToken = localStorage.getItem('token')

        if (!storedRole || !storedUserId || !storedToken) {
            // Se não estiver autenticado, redirecionar para login
            router.push('/login')
            return
        }

        setRole(storedRole)
        setUserId(Number(storedUserId))
        setToken(storedToken)
    }, [router])

    // 2) Se for ALUNO, buscar professores disponíveis e aulas do aluno
    useEffect(() => {
        if (role !== 'ALUNO' || !token || userId === null) {
            return
        }

        // Fetch Professores Disponíveis
        fetch('http://localhost:8080/api/professores/disponiveis', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        })
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text()
                    throw new Error(`Erro ao carregar professores: ${txt}`)
                }
                return res.json()
            })
            .then((lista: Professor[]) => {
                setProfessoresDisponiveis(lista)
            })
            .catch((err) => {
                setErrorAluno(err.message)
            })
            .finally(() => {
                // continua para buscar aulas, mas não setamos loadingAluno false aqui (esperamos pelas duas requisições)
            })

        // Fetch Aulas do Aluno
        fetch('http://localhost:8080/api/aulas/aluno', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        })
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text()
                    throw new Error(`Erro ao carregar suas aulas: ${txt}`)
                }
                return res.json()
            })
            .then((listaAulas: Aula[]) => {
                setAulasDoAluno(listaAulas)
            })
            .catch((err) => {
                setErrorAluno(err.message)
            })
            .finally(() => {
                setLoadingAluno(false)
            })
    }, [role, token, userId])

    // 3) Se for PROFESSOR, buscar apenas aulas onde ele está marcado
    useEffect(() => {
        if (role !== 'PROFESSOR' || !token) return;

        fetch('http://localhost:8080/api/aulas/professor', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store',
        })
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt);
                }
                return res.json();
            })
            .then((listaAulas: Aula[]) => {
                setAulasDoProfessor(listaAulas);
            })
            .catch((err) => {
                setErrorProfessor(err.message);
            })
            .finally(() => {
                setLoadingProfessor(false);
            });
    }, [role, token]);

    // Funções de modal de agendamento (quando o aluno clicar em “Agendar” num card)
    const handleOpenModal = (prof: Professor) => {
        setSelectedProfessor(prof)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setSelectedProfessor(null)
        setShowModal(false)
    }

    const handleConfirmSchedule = (dataHora: string, modalidade: string) => {
        if (!selectedProfessor || userId === null || !token) return

        const requestBody = {
            alunoId: userId,
            professorId: selectedProfessor.id,
            dataHora: dataHora,     // já vem no formato ISO (datetime-local)
            modalidade: modalidade, // “online” ou “presencial”
        }

        fetch('http://localhost:8080/api/aulas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text()
                    throw new Error(`Falha ao agendar: ${txt}`)
                }
                return res.json()
            })
            .then((novaAula: Aula) => {
                // Atualiza lista de aulas do aluno sem recarregar a página
                setAulasDoAluno((prev) => [...prev, novaAula])
                setShowModal(false)
            })
            .catch((err) => {
                alert(`Erro ao agendar: ${err.message}`)
            })
    }

    // 4) Renderizações condicionais (dependendo da role)
    if (role === null || userId === null || token === null) {
        // Enquanto não sabemos a role (buscando no localStorage), exibimos loading genérico
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="text-xl">Carregando…</span>
            </div>
        )
    }

    // === ROLE: ALUNO ===
    if (role === 'ALUNO') {
        return (
            <div className="p-4 space-y-6">
                <h1 className="text-2xl font-bold">Dashboard do Aluno</h1>

                {/* Se houver erro na requisição, exibe aqui */}
                {errorAluno && (
                    <p className="text-red-600">
                        Erro ao carregar dados: {errorAluno}
                    </p>
                )}

                {/* 1) Seção: Professores Disponíveis */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Professores Disponíveis</h2>
                    {loadingAluno ? (
                        <p>Carregando professores…</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {professoresDisponiveis.length === 0 ? (
                                <p className="col-span-full">Nenhum professor disponível no momento.</p>
                            ) : (
                                professoresDisponiveis.map((prof) => (
                                    <div key={prof.id} className="shadow rounded p-4">
                                        <ProfessorCard
                                            professor={prof}
                                            onSchedule={() => handleOpenModal(prof)}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>

                {/* Modal para o aluno escolher data/hora ao clicar em “Agendar” */}
                {showModal && selectedProfessor && (
                    <ScheduleModal
                        professor={selectedProfessor}
                        onClose={handleCloseModal}
                        onSubmit={handleConfirmSchedule}
                    />
                )}

                {/* 2) Seção: Minhas Aulas Agendadas */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Minhas Aulas Agendadas</h2>
                    {loadingAluno ? (
                        <p>Carregando suas aulas…</p>
                    ) : aulasDoAluno.length === 0 ? (
                        <p>Você ainda não tem aulas agendadas.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 border">ID</th>
                                    <th className="px-4 py-2 border">Professor</th>
                                    <th className="px-4 py-2 border">Data / Hora</th>
                                    <th className="px-4 py-2 border">Modalidade</th>
                                </tr>
                                </thead>
                                <tbody>
                                {aulasDoAluno.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 border">{a.id}</td>
                                        <td className="px-4 py-2 border">{a.professor.nome}</td>
                                        <td className="px-4 py-2 border">
                                            {new Date(a.dataHora).toLocaleString('pt-BR', {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </td>
                                        <td className="px-4 py-2 border">{a.modalidade}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        )
    }

    // === ROLE: PROFESSOR ===
    if (role === 'PROFESSOR') {
        return (
            <div className="p-4 space-y-6">
                <h1 className="text-2xl font-bold">Dashboard do Professor</h1>

                {/* Exibe erro, se existir */}
                {errorProfessor && (
                    <p className="text-red-600">
                        Erro ao carregar dados: {errorProfessor}
                    </p>
                )}

                {/* 1) Seção: Link para Configuração de Perfil */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Configuração de Perfil</h2>
                    <p className="mb-2">
                        Para editar matéria e valor/hora, acesse:
                    </p>
                    <Link
                        href="/professores/config"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Ir para Configuração
                    </Link>
                </section>

                {/* 2) Seção: Minhas Aulas como Professor */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Minhas Aulas Marcadas</h2>
                    {loadingProfessor ? (
                        <p>Carregando suas aulas…</p>
                    ) : aulasDoProfessor.length === 0 ? (
                        <p>Você não possui aulas agendadas para ministrar.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 border">ID</th>
                                    <th className="px-4 py-2 border">Aluno</th>
                                    <th className="px-4 py-2 border">Data / Hora</th>
                                    <th className="px-4 py-2 border">Modalidade</th>
                                </tr>
                                </thead>
                                <tbody>
                                {aulasDoProfessor.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 border">{a.id}</td>
                                        <td className="px-4 py-2 border">{a.aluno.nome}</td>
                                        <td className="px-4 py-2 border">
                                            {new Date(a.dataHora).toLocaleString('pt-BR', {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </td>
                                        <td className="px-4 py-2 border">{a.modalidade}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        )
    }

    // Se tiver qualquer outra role (por via das dúvidas)
    return (
        <div className="p-4">
            <p>Role desconhecida: {role}</p>
        </div>
    )
}
