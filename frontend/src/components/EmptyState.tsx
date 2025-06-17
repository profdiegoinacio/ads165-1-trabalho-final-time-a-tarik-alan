import React from 'react'

type EmptyStateProps = {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
    }
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   icon: Icon,
                                                   title,
                                                   description,
                                                   action
                                               }) => (
    <div className="text-center py-12">
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-gray-500 text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">{description}</p>

        {action && (
            <button
                onClick={action.onClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
                {action.label}
            </button>
        )}
    </div>
)

export default EmptyState