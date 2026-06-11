import { BarChart3, FileText, Grid2X2, LogOut, MessageCircle, Package, Shield, User, ClipboardList } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { authStore } from '../../lib/auth'
import { cn } from '../../lib/utils'

const items = [
  { label: '대시보드', path: '/dashboard', icon: Grid2X2 },
  { label: '상품 게시글', path: '/products', icon: ClipboardList },
  { label: '거래 대화', path: '/conversations', icon: MessageCircle },
  { label: '분석 결과', path: '/conversations/1/analysis', icon: BarChart3 },
  { label: '증거 패키지', path: '/conversations/1/evidence', icon: FileText },
  { label: '내 정보', path: '/me', icon: User },
]

export function Sidebar() {
  const navigate = useNavigate()
  const logout = () => {
    authStore.clear()
    navigate('/login')
  }

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-zinc-200 bg-white px-4 py-7 lg:block">
      <div className="mb-10 flex items-center gap-2 px-2 text-2xl font-bold">
        <Shield className="h-8 w-8" />
        DealGuard
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex h-12 items-center gap-3 rounded-md px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100',
                isActive && 'border border-zinc-200 bg-zinc-100 text-zinc-950',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
        <button onClick={logout} className="flex h-12 w-full items-center gap-3 rounded-md px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100">
          <LogOut className="h-5 w-5" />
          로그아웃
        </button>
      </nav>
    </aside>
  )
}
