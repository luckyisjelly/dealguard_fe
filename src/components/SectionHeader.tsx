import type { ReactNode } from 'react'

export function SectionHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  )
}
