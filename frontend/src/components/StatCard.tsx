// components/StatCard.tsx
import React from 'react'

type StatCardProps = {
    icon: React.ComponentType<{ className?: string }>
    value: string | number
    label: string
    color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo' | 'pink'
    trend?: {
        value: number
        isPositive: boolean
    }
    onClick?: () => void
}

const StatCard: React.FC<StatCardProps> = ({
                                               icon: Icon,
                                               value,
                                               label,
                                               color = "blue",
                                               trend,
                                               onClick
                                           }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        pink: 'bg-pink-100 text-pink-600'
    }

    const cardClasses = onClick
        ? 'bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow'
        : 'bg-white rounded-xl p-6 shadow-sm border border-gray-100'

    return (
        <div className={cardClasses} onClick={onClick}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>

                {trend && (
                    <div className={`text-xs font-medium ${
                        trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-800">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </h3>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    )
}

export default StatCard