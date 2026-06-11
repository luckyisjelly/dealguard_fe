import { Outlet, useMatches } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const matches = useMatches()
  const lastTitle = [...matches].reverse().find((match) => (match.handle as { title?: string } | undefined)?.title)
  const title = ((lastTitle?.handle as { title?: string } | undefined)?.title) ?? '대시보드'

  return (
    <div className="app-shell grid min-h-screen bg-zinc-50 lg:grid-cols-[256px_1fr]">
      <Sidebar />
      <div className="min-w-0">
        <Header title={title} />
        <main className="mx-auto w-full max-w-[1580px] px-5 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
