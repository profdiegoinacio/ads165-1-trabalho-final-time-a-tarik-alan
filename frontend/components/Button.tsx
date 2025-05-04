import React from 'react'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger' | 'accent'
}

const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'border border-primary text-primary hover:bg-primary/10',
    accent: 'bg-accent text-white hover:bg-accent/90',
    danger: 'bg-red-600 text-white hover:bg-red-700',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    return (
        <button
            className={[
                'px-4 py-2 rounded-lg font-medium shadow-sm transition',
                variantClasses[variant],
                className,
            ].join(' ')}
            {...props}
        />
    )
}
