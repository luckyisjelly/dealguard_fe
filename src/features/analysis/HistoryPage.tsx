import { BarChart3, FileText, MessageCircle, Clock, Layers, RefreshCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/States'
import { api } from '../../lib/api'
import { formatDate } from '../../lib/format'

export function HistoryPage() {
  const { conversationId } = useParams()
  const id = Number(conversationId)
  const { data: conversation } = useQuery({ queryKey: ['conversation', id], queryFn: () => api.conversation(id) })
  const { data: changes = [] } = useQuery({ queryKey: ['history', id], queryFn: () => api.conditionHistory(id) })

  return (
    <PageGrid>
      <div className="space-y-5">
        <Card>
          <SectionHeader title="분석 대상 대화" />
          <div className="grid gap-4 md:grid-cols-5">
            <Mini label="대화 제목" value={conversation?.title ?? '아이폰 13 거래'} icon={MessageCircle} />
            <Mini label="연결 상품" value={conversation?.productTitle ?? '아이폰 13'} icon={Layers} />
            <Mini label="현재 상태" value={conversation?.status === 'CLOSED' ? '종료' : '진행 중'} icon={RefreshCw} />
            <Mini label="마지막 분석" value={formatDate(conversation?.lastAnalyzedAt)} icon={Clock} />
            <Mini label="전체 스냅샷 수" value="3개" icon={Layers} />
          </div>
        </Card>
        <Card>
          <SectionHeader title="조건 변경 타임라인" />
          {changes.length === 0 ? <EmptyState title="감지된 조건 변경이 없습니다." /> : (
            <div className="space-y-4">
              {changes.slice(0, 3).map((change, index) => (
                <div key={change.id} className="relative grid gap-4 rounded-lg border border-zinc-200 p-4 md:grid-cols-[40px_1fr]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 font-bold">{index + 1}</div>
                  <div>
                    <div className="grid gap-4 md:grid-cols-5">
                      <MiniText label="분석 시간" value={formatDate(change.analyzedAt)} />
                      <MiniText label={change.field} value={change.afterValue} highlight={index > 0} />
                      <MiniText label="변경 전" value={change.beforeValue} />
                      <MiniText label="변경 후" value={change.afterValue} highlight />
                      <MiniText label="관련 메시지" value={change.relatedMessage} />
                    </div>
                    <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm"><b>변경 사항</b> {change.field} {change.beforeValue} → <span className="font-bold text-red-600">{change.afterValue}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <SectionHeader title="변경 감지 목록" />
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-zinc-50"><tr>{['변경 항목', '이전 값', '이후 값', '심각도', '관련 메시지', '감지 시각'].map((head) => <th key={head} className="px-4 py-3 text-left">{head}</th>)}</tr></thead>
              <tbody>{changes.map((change) => <tr key={change.id} className="border-t border-zinc-200"><td className="px-4 py-3">{change.field}</td><td className="px-4 py-3">{change.beforeValue}</td><td className="px-4 py-3">{change.afterValue}</td><td className="px-4 py-3"><Badge tone={change.severity}>{change.severity}</Badge></td><td className="px-4 py-3">{change.relatedMessage}</td><td className="px-4 py-3">{formatDate(change.analyzedAt).slice(-5)}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      </div>
      <aside className="space-y-5">
        <Card><SectionHeader title="변경 요약" />{['전체 변경 4개', 'HIGH 1개', 'MEDIUM 2개', 'LOW 1개', '미해결 변경 4개'].map((item) => <div key={item} className="flex justify-between border-b border-zinc-200 py-3 last:border-b-0"><span>{item.split(' ')[0]}</span><b>{item.split(' ')[1]}</b></div>)}</Card>
        <Card><SectionHeader title="주요 변경" /><div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">가격이 게시글 기준 150,000원에서 채팅 중 170,000원으로 변경되었습니다.</div></Card>
        <Card><SectionHeader title="다음 작업" /><div className="space-y-3"><Link to={`/conversations/${id}/analysis`}><Button className="w-full justify-start"><BarChart3 className="h-5 w-5" />분석 결과 보기</Button></Link><Link to={`/conversations/${id}/evidence`}><Button className="w-full justify-start"><FileText className="h-5 w-5" />증거 패키지 생성</Button></Link><Link to={`/conversations/${id}`}><Button className="w-full justify-start"><MessageCircle className="h-5 w-5" />채팅 메시지 보기</Button></Link></div></Card>
        <Card className="text-sm leading-6 text-zinc-600">조건 변경 이력은 이전 분석 스냅샷과 현재 분석 결과를 비교해 생성됩니다.</Card>
      </aside>
    </PageGrid>
  )
}

function Mini({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="flex items-center gap-3"><Icon className="h-6 w-6" /><MiniText label={label} value={value} /></div>
}

function MiniText({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div><p className="text-xs text-zinc-500">{label}</p><p className={highlight ? 'font-bold text-red-600' : 'font-bold'}>{value}</p></div>
}
