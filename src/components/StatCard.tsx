import type { LucideIcon } from 'lucide-react'
import { Card } from './ui/Card'

export function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <Card className="flex min-h-28 items-center gap-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-zinc-200">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-600">{label}</p>
        <p className="mt-1 text-3xl font-bold">{value}</p>
      </div>
    </Card>
  )
}
