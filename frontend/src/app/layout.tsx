// src/app/layout.tsx
import './globals.css'   // importe aqui o seu CSS global, se houver
import React from 'react'
import { ReactNode } from 'react'

export const metadata = {
    title: 'Meu Projeto',
    description: 'Aplicação de Agendamento de Aulas',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode
}) {
    return (
        <html lang="pt-BR">
        <head>
            {/* Aqui você pode colocar <meta>, <link> de favicons, fontes, etc. */}
            {/* Exemplo: */}
            {/* <link rel="icon" href="/favicon.ico" /> */}
        </head>
        <body>
        {/* Se você tiver um componente de Menu ou Header global, pode incluí-lo aqui */}
        {children}
        {/* Se tiver um footer global, coloque abaixo: */}
        {/* <Footer /> */}
        </body>
        </html>
    )
}
