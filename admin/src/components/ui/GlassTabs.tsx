'use client'

import { type ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface GlassTabsProps {
  tabs: {
    id: string
    label: string
    icon?: ReactNode
    content: ReactNode
  }[]
  defaultTab?: string
  className?: string
}

export function GlassTabs({ tabs, defaultTab, className }: GlassTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={cn('w-full', className)}>
      <div className="ds-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn('ds-tab', activeTab === tab.id && 'ds-tab-active')}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}
