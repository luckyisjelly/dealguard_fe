import type { ReactNode } from 'react'

export function PageGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 xl:grid-cols-[1fr_360px]">{children}</div>
}
