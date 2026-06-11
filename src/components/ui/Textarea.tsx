import { type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('min-h-28 w-full rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:border-zinc-500', className)} {...props} />
}
