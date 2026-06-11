import { FileText, MessageCircle, Package, Tag, Search, ClipboardPlus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { StatCard } from '../../components/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { api } from '../../lib/api'
import { formatDate } from '../../lib/format'

export function DashboardPage() {
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: api.products })
  const { data: conversations = [] } = useQuery({ queryKey: ['conversations'], queryFn: api.conversations })
  const { data: evidence = [] } = useQuery({ queryKey: ['evidence', 1], queryFn: () => api.evidencePackages(1) })

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Tag} label="등록 상품 수" value={products.length} />
        <StatCard icon={MessageCircle} label="진행 중 대화 수" value={conversations.filter((item) => item.status === 'ACTIVE').length} />
        <StatCard icon={Search} label="미해결 경고 수" value={8} />
        <StatCard icon={FileText} label="생성된 증거 패키지 수" value={evidence.length} />
      </div>
      <PageGrid>
        <div className="space-y-6">
          <Card>
            <SectionHeader title="최근 거래 대화" />
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-zinc-50 text-left">
                  <tr>{['대화 제목', '상품명', '상태', '최근 분석일', '경고 개수', '상세 보기'].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}</tr>
                </thead>
                <tbody>
                  {conversations.slice(0, 3).map((item) => (
                    <tr key={item.id} className="border-t border-zinc-200">
                      <td className="px-5 py-4">{item.title}</td>
                      <td className="px-5 py-4">{item.productTitle}</td>
                      <td className="px-5 py-4"><Badge tone={item.status === 'ACTIVE' ? 'blue' : 'gray'}>{item.status === 'ACTIVE' ? '진행 중' : '종료'}</Badge></td>
                      <td className="px-5 py-4">{formatDate(item.lastAnalyzedAt)}</td>
                      <td className="px-5 py-4">{item.alertSummary}</td>
                      <td className="px-5 py-4"><Link to={`/conversations/${item.id}`}><Button>보기</Button></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card>
            <SectionHeader title="최근 생성된 증거 패키지" />
            <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200">
              {evidence.slice(0, 2).map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="flex items-center gap-3"><FileText className="h-5 w-5" />{item.fileName}</div>
                  <span>{formatDate(item.createdAt)}</span>
                  <Button>다운로드</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <SectionHeader title="빠른 작업" />
            <div className="space-y-3">
              <Link to="/products/new"><Button className="w-full justify-start"><Tag className="h-5 w-5" />상품 등록</Button></Link>
              <Link to="/conversations"><Button className="w-full justify-start"><MessageCircle className="h-5 w-5" />대화 생성</Button></Link>
              <Link to="/conversations/1/messages"><Button className="w-full justify-start"><ClipboardPlus className="h-5 w-5" />채팅 붙여넣기</Button></Link>
              <Link to="/conversations/1/analysis"><Button className="w-full justify-start"><Search className="h-5 w-5" />분석 실행</Button></Link>
            </div>
          </Card>
          <Card>
            <SectionHeader title="DealGuard 가치" />
            <ul className="space-y-3 text-sm leading-6 text-zinc-700">
              {['거래 전 위험 요소 확인', '채팅 속 거래 조건 자동 정리', '게시글과 채팅 내용 불일치 탐지', '환불 정책, 상품 상태, 거래 방식 누락 확인', '조건 변경 이력 추적', 'PDF 증거 패키지 생성'].map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </Card>
        </div>
      </PageGrid>
    </div>
  )
}
