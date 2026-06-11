import { CheckCircle, FileText, MessageCircle, Plus, Search, TriangleAlert } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { StatCard } from '../../components/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { api } from '../../lib/api'

export function ConversationListPage() {
  const { data: conversations = [] } = useQuery({ queryKey: ['conversations'], queryFn: api.conversations })
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard icon={MessageCircle} label="전체 대화 수" value={conversations.length} />
        <StatCard icon={MessageCircle} label="진행 중 대화 수" value={conversations.filter((item) => item.status === 'ACTIVE').length} />
        <StatCard icon={CheckCircle} label="종료된 대화 수" value={conversations.filter((item) => item.status === 'CLOSED').length} />
      </div>
      <PageGrid>
        <Card>
          <SectionHeader title="거래 대화"><Button variant="primary"><Plus className="h-4 w-4" />대화 생성</Button></SectionHeader>
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 p-4">
            <span className="font-semibold">상태 필터</span>
            {['전체', '진행 중', '종료'].map((item, index) => <Button key={item} variant={index === 0 ? 'primary' : 'secondary'}>{item}</Button>)}
            <span className="ml-3 font-semibold">경고 필터</span>
            {['전체', 'HIGH', 'MEDIUM', 'LOW'].map((item, index) => <Button key={item} variant={index === 0 ? 'primary' : 'secondary'}>{item}</Button>)}
            <select className="ml-auto h-10 rounded-md border border-zinc-200 px-4"><option>최근 분석순</option></select>
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full min-w-[940px] text-sm">
              <thead className="bg-zinc-50"><tr>{['대화 제목', '연결 상품', '상태', '메시지 수', '최근 분석 결과', '경고 개수', '마지막 업데이트', '상세 보기'].map((head) => <th key={head} className="px-4 py-4 text-left">{head}</th>)}</tr></thead>
              <tbody>
                {conversations.map((item) => (
                  <tr key={item.id} className="border-t border-zinc-200">
                    <td className="px-4 py-4">{item.title}</td>
                    <td className="px-4 py-4">{item.productTitle}</td>
                    <td className="px-4 py-4"><Badge tone={item.status === 'ACTIVE' ? 'blue' : 'gray'}>{item.status === 'ACTIVE' ? '진행 중' : '종료'}</Badge></td>
                    <td className="px-4 py-4">{item.messageCount}개</td>
                    <td className="px-4 py-4"><Badge tone={item.analysisStatus === 'DONE' ? 'green' : 'amber'}>{item.analysisStatus === 'DONE' ? '분석 완료' : '분석 필요'}</Badge></td>
                    <td className="px-4 py-4">{item.alertSummary}</td>
                    <td className="px-4 py-4">{item.updatedAt}</td>
                    <td className="px-4 py-4"><Link to={`/conversations/${item.id}`}><Button>보기</Button></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <aside className="space-y-6">
          <Card>
            <SectionHeader title="대화 관리" />
            <div className="space-y-3">
              <Button className="w-full justify-start"><Plus className="h-5 w-5" />새 대화 생성</Button>
              <Link to="/conversations/1/messages"><Button className="w-full justify-start"><FileText className="h-5 w-5" />채팅 붙여넣기</Button></Link>
              <Link to="/conversations/1/analysis"><Button className="w-full justify-start"><Search className="h-5 w-5" />분석 실행</Button></Link>
              <Link to="/conversations/1/evidence"><Button className="w-full justify-start"><FileText className="h-5 w-5" />증거 패키지 보기</Button></Link>
            </div>
          </Card>
          <Card>
            <SectionHeader title="경고 현황" />
            {['HIGH 1개', 'MEDIUM 3개', 'LOW 1개', '미분석 대화 1개'].map((item) => <div key={item} className="flex items-center justify-between border-b border-zinc-100 py-3 last:border-b-0"><span className="flex items-center gap-2"><TriangleAlert className="h-4 w-4 text-red-500" />{item.split(' ')[0]}</span><b>{item.split(' ')[1]}</b></div>)}
          </Card>
          <Card className="text-sm leading-6 text-zinc-600">거래 대화는 상품 게시글과 연결되며, 저장된 메시지를 기반으로 거래 조건 분석을 실행할 수 있습니다.</Card>
        </aside>
      </PageGrid>
    </div>
  )
}
