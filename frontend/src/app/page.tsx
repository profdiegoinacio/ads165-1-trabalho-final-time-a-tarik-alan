"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  // Cadastro
  const [nome, setNome] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [mensagemCadastro, setMensagemCadastro] = useState("");

  // Login
  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");
  const [mensagemLogin, setMensagemLogin] = useState("");

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email: emailCadastro, senha: senhaCadastro }),
      });
      if (response.ok) {
        setMensagemCadastro("Usuário cadastrado com sucesso!");
        setNome("");
        setEmailCadastro("");
        setSenhaCadastro("");
      } else {
        const erro = await response.json();
        setMensagemCadastro(erro.message || "Erro ao cadastrar.");
      }
    } catch (error) {
      console.error(error);
      setMensagemCadastro("Erro na requisição.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailLogin, senha: senhaLogin }),
      });
      if (response.ok) {
        const data = await response.json();
        setMensagemLogin("Login realizado com sucesso! Token: " + data.token);
        localStorage.setItem("token", data.token);
        setEmailLogin("");
        setSenhaLogin("");
      } else {
        const erro = await response.json();
        setMensagemLogin(erro.message || "Erro no login.");
      }
    } catch (error) {
      console.error(error);
      setMensagemLogin("Erro na requisição.");
    }
  };

  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
          />

          {/* Formulário de Cadastro */}
          <form onSubmit={handleCadastro} className="flex flex-col gap-4 border p-4 rounded">
            <h2 className="text-lg font-bold">Cadastro</h2>
            <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={emailCadastro}
                onChange={(e) => setEmailCadastro(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={senhaCadastro}
                onChange={(e) => setSenhaCadastro(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
              Cadastrar
            </button>
            {mensagemCadastro && <p>{mensagemCadastro}</p>}
          </form>

          {/* Formulário de Login */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4 border p-4 rounded">
            <h2 className="text-lg font-bold">Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={senhaLogin}
                onChange={(e) => setSenhaLogin(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Login
            </button>
            {mensagemLogin && <p>{mensagemLogin}</p>}
          </form>
        </main>

        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org/learn"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
            Learn
          </a>
        </footer>
      </div>
  );
}

