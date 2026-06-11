import { AlertTriangle, Box, FileText, Lock, LogOut, MessageCircle, Pencil, User, CheckCircle, Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { api } from '../../lib/api'
import { authStore } from '../../lib/auth'
import { formatDate } from '../../lib/format'

export function MePage() {
  const navigate = useNavigate()
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: api.me })
  const logout = () => {
    authStore.clear()
    navigate('/login')
  }

  return (
    <PageGrid>
      <div className="space-y-5">
        <Card>
          <SectionHeader title="사용자 정보" />
          <div className="grid gap-8 md:grid-cols-[170px_1fr_220px] md:items-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-zinc-200"><User className="h-20 w-20" /></div>
            <div className="grid gap-4 md:grid-cols-[120px_1fr]">
              <b className="text-zinc-500">이메일</b><span>{user?.email}</span>
              <b className="text-zinc-500">닉네임</b><span>{user?.nickname}</span>
              <b className="text-zinc-500">역할</b><span>{user?.role}</span>
              <b className="text-zinc-500">가입일</b><span>{formatDate(user?.createdAt).slice(0, 10)}</span>
              <b className="text-zinc-500">최근 로그인</b><span>{formatDate(user?.lastLoginAt)}</span>
            </div>
            <div className="space-y-3"><Button className="w-full"><Pencil className="h-4 w-4" />닉네임 수정</Button><Button className="w-full"><Lock className="h-4 w-4" />비밀번호 변경</Button></div>
          </div>
        </Card>
        <Card>
          <SectionHeader title="내 활동 요약" />
          <div className="grid gap-4 md:grid-cols-4">
            <Activity icon={Box} label="등록 상품 수" value="12" />
            <Activity icon={MessageCircle} label="진행 중 거래 대화" value="5" />
            <Activity icon={FileText} label="생성한 증거 패키지" value="3" />
            <Activity icon={AlertTriangle} label="미해결 경고" value="8" />
          </div>
        </Card>
        <Card>
          <SectionHeader title="최근 활동" />
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-zinc-50"><tr>{['활동', '대상', '일시', '상태'].map((head) => <th key={head} className="px-4 py-3 text-left">{head}</th>)}</tr></thead>
              <tbody>{[['상품 게시글 등록', '아이폰 13', '2026-05-23 14:10'], ['거래 대화 분석', '아이폰 13 거래', '2026-05-23 18:20'], ['증거 패키지 생성', '아이폰13_거래증거.pdf', '2026-05-23 18:25'], ['채팅 붙여넣기', '노트북 직거래', '2026-05-22 11:00']].map((row) => <tr key={row[0]} className="border-t border-zinc-200"><td className="px-4 py-3">{row[0]}</td><td className="px-4 py-3">{row[1]}</td><td className="px-4 py-3">{row[2]}</td><td className="px-4 py-3"><Badge tone="green">완료</Badge></td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      </div>
      <aside className="space-y-5">
        <Card><SectionHeader title="계정 관리" /><div className="space-y-3"><Button className="w-full justify-start"><User className="h-5 w-5" />내 정보 수정</Button><Button className="w-full justify-start"><Lock className="h-5 w-5" />비밀번호 변경</Button><Button className="w-full justify-start" onClick={logout}><LogOut className="h-5 w-5" />로그아웃</Button></div></Card>
        <Card><SectionHeader title="보안 안내" />{['비밀번호는 8자 이상으로 설정하세요.', 'JWT access token은 Swagger Authorize에서 사용할 수 있습니다.', '민감한 개인정보는 채팅 입력 전 직접 확인하세요.', '외부 플랫폼 데이터는 자동 수집하지 않습니다.'].map((item) => <p key={item} className="mb-5 flex gap-3 text-sm leading-6"><CheckCircle className="h-5 w-5 shrink-0" />{item}</p>)}</Card>
        <Card className="flex gap-3 text-sm leading-6 text-zinc-600"><Info className="h-5 w-5 shrink-0" />DealGuard는 사용자가 입력한 상품 게시글과 채팅 메시지를 기반으로 거래 조건 분석과 증거 패키지 생성을 제공합니다.</Card>
      </aside>
    </PageGrid>
  )
}

function Activity({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="rounded-lg border border-zinc-200 p-4"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200"><Icon className="h-7 w-7" /></div><div><p className="text-sm text-zinc-500">{label}</p><p className="text-2xl font-bold">{value}</p></div></div></div>
}
