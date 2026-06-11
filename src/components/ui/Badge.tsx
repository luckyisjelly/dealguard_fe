import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import type { AlertSeverity } from '../../types/api'

export function Badge({ children, tone = 'gray' }: { children: ReactNode; tone?: 'gray' | 'green' | 'blue' | 'amber' | 'red' | AlertSeverity }) {
  const normalized = tone === 'HIGH' ? 'red' : tone === 'MEDIUM' ? 'amber' : tone === 'LOW' ? 'green' : tone
  return (
    <span
      className={cn(
        'inline-flex min-w-14 items-center justify-center rounded-md border px-2 py-1 text-xs font-semibold',
        normalized === 'gray' && 'border-zinc-200 bg-zinc-100 text-zinc-700',
        normalized === 'green' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
        normalized === 'blue' && 'border-blue-200 bg-blue-50 text-blue-700',
        normalized === 'amber' && 'border-amber-200 bg-amber-50 text-amber-700',
        normalized === 'red' && 'border-red-200 bg-red-50 text-red-700',
      )}
    >
      {children}
    </span>
  )
}
