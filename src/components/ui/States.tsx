import { AlertCircle, Inbox, Loader2 } from 'lucide-react'
import { Card } from './Card'

export function LoadingState({ text = '불러오는 중입니다.' }: { text?: string }) {
  return (
    <Card className="flex items-center gap-3 text-sm text-zinc-600">
      <Loader2 className="h-5 w-5 animate-spin" />
      {text}
    </Card>
  )
}

export function EmptyState({ title = '표시할 데이터가 없습니다.', description }: { title?: string; description?: string }) {
  return (
    <Card className="flex items-start gap-3 text-sm">
      <Inbox className="mt-0.5 h-5 w-5 text-zinc-500" />
      <div>
        <p className="font-semibold">{title}</p>
        {description && <p className="mt-1 text-zinc-500">{description}</p>}
      </div>
    </Card>
  )
}

export function ErrorState({ message = '요청 처리 중 오류가 발생했습니다.' }: { message?: string }) {
  return (
    <Card className="flex items-center gap-3 text-sm text-red-700">
      <AlertCircle className="h-5 w-5" />
      {message}
    </Card>
  )
}
