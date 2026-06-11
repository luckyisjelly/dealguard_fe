import { type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export function Button({ className, variant = 'secondary', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800',
        variant === 'secondary' && 'border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50',
        variant === 'ghost' && 'border-transparent bg-transparent text-zinc-700 hover:bg-zinc-100',
        variant === 'danger' && 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
        className,
      )}
      {...props}
    />
  )
}
