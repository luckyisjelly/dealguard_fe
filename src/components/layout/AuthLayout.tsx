import { FileText, MessageCircle, Package, Shield, TriangleAlert } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { Card } from '../ui/Card'

export function AuthLayout({ mode }: { mode: 'login' | 'signup' }) {
  const cards =
    mode === 'login'
      ? [
          { icon: FileText, title: '거래 조건 분석', text: '채팅 메시지에서 가격, 거래 방식, 환불 정책, 상품 상태 등 핵심 조건을 자동 추출합니다.' },
          { icon: TriangleAlert, title: '위험 경고 탐지', text: '가격 불일치, 모호한 표현, 누락 조건 등 분쟁 가능성을 자동으로 감지합니다.' },
          { icon: Package, title: 'PDF 증거 패키지', text: '분석 결과와 채팅 기록을 기반으로 PDF 증거 패키지를 생성하고 관리합니다.' },
        ]
      : [
          { icon: Package, title: '상품 게시글 관리', text: '거래 기준이 되는 상품 정보와 환불 정책을 기록합니다.' },
          { icon: MessageCircle, title: '채팅 분석', text: '거래 메시지에서 가격, 거래 방식, 결제 방식, 환불 정책을 추출합니다.' },
          { icon: FileText, title: '분쟁 대비 자료', text: '분석 결과와 채팅 기록을 PDF 증거 패키지로 정리합니다.' },
        ]
  return (
    <div className="min-h-screen border border-zinc-200 bg-white">
      <div className="mx-auto flex min-h-[calc(100vh-82px)] max-w-[1280px] flex-col px-6 py-10">
        <div className="mb-12 flex items-center gap-3 text-3xl font-bold">
          <Shield className="h-9 w-9" />
          DealGuard
        </div>
        <div className="grid flex-1 items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <Outlet />
          <div className="space-y-6">
            {cards.map((item) => (
              <Card key={item.title} className="flex items-center gap-7 p-7">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-zinc-200">
                  <item.icon className="h-12 w-12" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p className="mt-3 leading-7 text-zinc-600">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <footer className="flex h-20 items-center justify-center gap-10 border-t border-zinc-200 text-sm text-zinc-500">
        <span>© 2026 DealGuard. All rights reserved.</span>
        <span>서비스 이용약관</span>
        <span>개인정보처리방침</span>
      </footer>
    </div>
  )
}
