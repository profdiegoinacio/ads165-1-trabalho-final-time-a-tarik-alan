# Sistema de Agendamento de Aulas

Um sistema completo para agendamento de aulas particulares, desenvolvido com Spring Boot no backend e Next.js no frontend. O sistema permite que alunos agendem aulas com professores, com recursos de notificações em tempo real, autenticação segura e interface moderna.

## 🚀 Funcionalidades Principais

### Para Alunos
- **Cadastro e Login**: Sistema de autenticação com JWT
- **Busca de Professores**: Visualização de professores disponíveis com informações sobre matérias e valores
- **Agendamento de Aulas**: Interface intuitiva para agendar aulas presenciais ou online
- **Gerenciamento de Aulas**: Visualização e cancelamento de aulas agendadas
- **Notificações**: Recebimento de notificações sobre confirmações e cancelamentos
- **Dashboard Personalizado**: Resumo de aulas e informações importantes

### Para Professores
- **Perfil Profissional**: Configuração de matérias, valores por hora e disponibilidade
- **Gerenciamento de Aulas**: Visualização de todas as aulas agendadas pelos alunos
- **Sistema de Notificações**: Notificações instantâneas sobre novos agendamentos
- **Controle de Disponibilidade**: Possibilidade de alterar status de disponibilidade

### Recursos Técnicos
- **Autenticação JWT**: Sistema seguro de autenticação e autorização
- **Notificações em Tempo Real**: Sistema completo de notificações com contadores e marcação de lidas
- **Interface Responsiva**: Design moderno com Tailwind CSS
- **API RESTful**: Backend robusto com Spring Boot
- **Validação de Dados**: Validação tanto no frontend quanto no backend

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21**: Linguagem de programação principal
- **Spring Boot**: Framework principal para desenvolvimento da API
- **Spring Security**: Autenticação e autorização com JWT
- **Spring Data JPA**: Persistência de dados com Hibernate
- **H2/MySQL**: Sistema de banco de dados
- **Gradle**: Gerenciamento de dependências

### Frontend
- **Next.js 14**: Framework React para desenvolvimento web
- **TypeScript**: Linguagem de programação para maior segurança de tipos
- **Tailwind CSS**: Framework CSS para estilização
- **Lucide React**: Biblioteca de ícones
- **React Hooks**: Gerenciamento de estado e efeitos

## 📋 Estrutura do Projeto

```
sistema-agendamento-aulas/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/backend/
│   │   │   │   ├── controller/         # Controllers da API REST
│   │   │   │   │   ├── AulaController.java
│   │   │   │   │   ├── UsuarioController.java
│   │   │   │   │   ├── ProfessorController.java
│   │   │   │   │   └── NotificacaoController.java
│   │   │   │   ├── domain/             # Entidades JPA
│   │   │   │   │   ├── Usuario.java
│   │   │   │   │   ├── Professor.java
│   │   │   │   │   ├── Aula.java
│   │   │   │   │   └── Notificacao.java
│   │   │   │   ├── repository/         # Repositórios JPA
│   │   │   │   ├── service/            # Lógica de negócio
│   │   │   │   ├── security/           # Configurações de segurança
│   │   │   │   └── BackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                       # Testes automatizados
│   └── build.gradle                    # Configuração do Gradle
├── frontend/
│   ├── src/
│   │   ├── app/                        # Páginas do Next.js
│   │   │   ├── dashboard/              # Dashboard principal
│   │   │   ├── login/                  # Página de login
│   │   │   ├── register/               # Página de cadastro
│   │   │   ├── professores/            # Área dos professores
│   │   │   └── aulas/                  # Gerenciamento de aulas
│   │   ├── components/                 # Componentes React reutilizáveis
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── AulaCard.tsx
│   │   │   └── NotificationDropdown.tsx
│   │   ├── hooks/                      # Hooks personalizados
│   │   │   ├── useAuth.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── useAulas.ts
│   │   ├── types/                      # Definições de tipos TypeScript
│   │   └── styles/                     # Estilos CSS
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Java 21 ou superior** (JDK)
- **Gradle 8.0+**
- **Node.js 18.0+**
- **npm ou yarn**
- **Git**

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd sistema-agendamento-aulas
```

### 2. Configuração do Backend

```bash
cd backend

# Instalar dependências e compilar
./gradlew build

# Executar o servidor backend
./gradlew bootRun
```

O backend estará disponível em `http://localhost:8080`

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 🎯 Como Usar

### Primeiro Acesso

1. **Cadastre-se** como aluno ou professor em `/register`
2. **Faça login** em `/login`
3. **Complete seu perfil** (especialmente professores devem configurar matérias e valores)

### Para Alunos

1. Acesse o **Dashboard** para ver a visão geral
2. Vá para **Professores** para ver todos os professores disponíveis
3. **Agende uma aula** clicando no professor desejado
4. Acompanhe suas aulas em **Minhas Aulas**
5. Receba **notificações** sobre confirmações e atualizações

### Para Professores

1. Configure seu **perfil profissional** em Configurações
2. Visualize **aulas agendadas** pelos alunos
3. Receba **notificações** sobre novos agendamentos
4. Gerencie sua **disponibilidade**

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Tokens** são armazenados no localStorage do navegador
- **Autorização** baseada em roles (ALUNO/PROFESSOR)
- **Middleware** de autenticação em todas as rotas protegidas
- **Expiração automática** dos tokens por segurança

## 📊 API Endpoints

### Usuários
- `POST /api/usuarios/register` - Cadastro de usuário
- `POST /api/usuarios/login` - Login de usuário
- `GET /api/usuarios/profile` - Perfil do usuário logado

### Professores
- `GET /api/professores` - Listar professores
- `PUT /api/professores/{id}` - Atualizar perfil do professor

### Aulas
- `POST /api/aulas` - Agendar aula
- `GET /api/aulas/aluno` - Aulas do aluno
- `GET /api/aulas/professor` - Aulas do professor
- `DELETE /api/aulas/{id}` - Cancelar aula

### Notificações
- `GET /api/notificacoes` - Listar notificações
- `GET /api/notificacoes/count` - Contar não lidas
- `PUT /api/notificacoes/{id}/lida` - Marcar como lida

## 🎨 Interface e Design

- **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **Componentes Reutilizáveis**: Arquitetura modular com componentes React
- **Feedback Visual**: Loading states, notificações toast e validações em tempo real
- **Acessibilidade**: Implementada seguindo boas práticas de UX/UI

## 🔄 Fluxo de Dados

1. **Autenticação**: Login → Token JWT → Armazenamento local
2. **Agendamento**: Aluno seleciona professor → Preenche dados → API cria aula → Notificação enviada
3. **Notificações**: Sistema cria notificação → Frontend busca periodicamente → Atualiza contador
4. **Tempo Real**: Hooks personalizados mantêm dados sincronizados

## 🧪 Testes

```bash
# Backend
cd backend
./gradlew test

# Frontend
cd frontend
npm run test
```

## 🚀 Deploy

### Backend
```bash
./gradlew build
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
npm run build
npm start
```

## 📝 Próximas Funcionalidades

- [ ] Sistema de avaliações de professores
- [ ] Calendário visual para agendamentos
- [ ] Integração com sistemas de pagamento
- [ ] Chat em tempo real entre aluno e professor
- [ ] Relatórios e analytics
- [ ] Notificações push

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
