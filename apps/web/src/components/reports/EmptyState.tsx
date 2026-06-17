interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
}

export function EmptyState({ icon = '📊', title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="text-xs text-steel mt-1 max-w-xs">{description}</p>}
    </div>
  )
}
