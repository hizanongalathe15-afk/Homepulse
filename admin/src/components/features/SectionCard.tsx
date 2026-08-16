'use client'

interface SectionCardProps {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SectionCard({ title, description, action, children, className = '' }: SectionCardProps) {
  return (
    <div className={`glass-card stat-card-hover stat-card-glow ${className}`}>
      <div className="admin-card-header flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div className="admin-card-body">{children}</div>
    </div>
  )
}
