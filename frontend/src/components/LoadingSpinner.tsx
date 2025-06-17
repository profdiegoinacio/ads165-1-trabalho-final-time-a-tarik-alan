import React from 'react'

type LoadingSpinnerProps = {
    text?: string
    size?: 'sm' | 'md' | 'lg'
    color?: 'blue' | 'gray' | 'green'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           text = "Carregando...",
                                                           size = 'md',
                                                           color = 'blue'
                                                       }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }

    const colorClasses = {
        blue: 'border-blue-600',
        gray: 'border-gray-600',
        green: 'border-green-600'
    }

    return (
        <div className="flex justify-center items-center py-8">
            <div className="text-center">
                <div
                    className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin mx-auto mb-2`}
                ></div>
                {text && <p className="text-gray-600 text-sm">{text}</p>}
            </div>
        </div>
    )
}

export default LoadingSpinner