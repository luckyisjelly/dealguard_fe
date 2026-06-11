import { Search, UserCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'

export function Header({ title }: { title: string }) {
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: api.me })
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-zinc-200 bg-white/95 px-5 backdrop-blur lg:px-8">
      <h1 className="min-w-0 text-2xl font-bold tracking-normal">{title}</h1>
      <div className="ml-4 flex min-w-0 items-center gap-5">
        <label className="hidden h-11 w-[min(520px,34vw)] items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-500 md:flex">
          <Search className="h-5 w-5 shrink-0" />
          <input className="w-full outline-none" placeholder="상품명 또는 대화 검색" />
        </label>
        <div className="flex shrink-0 items-center gap-2 text-sm font-semibold">
          <UserCircle className="h-8 w-8 text-zinc-500" />
          <span>{user?.nickname ?? '홍길동'}님</span>
        </div>
      </div>
    </header>
  )
}
