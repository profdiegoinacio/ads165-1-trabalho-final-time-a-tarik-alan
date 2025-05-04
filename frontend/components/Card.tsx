import React from 'react'

export type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className = '', children, ...props }: CardProps) {
    return (
        <div
            className={`bg-white shadow-sm rounded-lg p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
