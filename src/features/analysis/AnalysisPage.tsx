import { BarChart3, CalendarClock, CheckSquare, Clock, FileText, History, ShieldCheck } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { StatCard } from '../../components/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { api } from '../../lib/api'
import { alertTypeLabel, formatDate } from '../../lib/format'

export function AnalysisPage() {
  const { conversationId } = useParams()
  const id = Number(conversationId)
  const { data: analysis } = useQuery({ queryKey: ['analysis', id], queryFn: () => api.analysis(id) })
  const analyze = useMutation({ mutationFn: () => api.analyze(id) })
  const alerts = analysis?.alerts ?? []

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard icon={CheckSquare} label="분석 상태" value={analysis?.status ?? '완료'} />
        <StatCard icon={ShieldCheck} label="신뢰도 점수" value={`${analysis?.confidenceScore ?? 62}%`} />
        <StatCard icon={Clock} label="분석 실행 시간" value={formatDate(analysis?.analyzedAt)} />
      </div>
      <PageGrid>
        <div className="space-y-5">
          <Card>
            <SectionHeader title="거래 조건 요약" />
            <div className="overflow-hidden rounded-lg border border-zinc-200">
              <div className="grid md:grid-cols-2">
                {Object.entries(analysis?.conditions ?? {}).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-[160px_1fr] border-b border-zinc-200 px-4 py-4 text-sm last:border-b-0 md:last:border-b">
                    <b>{key}</b>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <SectionHeader title="경고 목록" />
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-zinc-50"><tr>{['심각도', '경고 유형', '항목', '설명', '이전 값', '이후 값', '관련 메시지', '해결 여부'].map((head) => <th key={head} className="px-4 py-4 text-left">{head}</th>)}</tr></thead>
                <tbody>{alerts.map((alert) => <tr key={alert.id} className="border-t border-zinc-200"><td className="px-4 py-4"><Badge tone={alert.severity}>{alert.severity}</Badge></td><td className="px-4 py-4">{alertTypeLabel(alert.type)}</td><td className="px-4 py-4">{alert.item}</td><td className="px-4 py-4">{alert.description}</td><td className="px-4 py-4">{alert.beforeValue ?? '-'}</td><td className="px-4 py-4">{alert.afterValue ?? '-'}</td><td className="px-4 py-4">{alert.relatedMessage ?? '-'}</td><td className="px-4 py-4"><Badge>미해결</Badge></td></tr>)}</tbody>
              </table>
            </div>
          </Card>
        </div>
        <aside className="space-y-5">
          <Card>
            <SectionHeader title="분석 요약" />
            <Summary label="전체 경고" value={`${alerts.length}개`} />
            <Summary label="HIGH" value={`${alerts.filter((item) => item.severity === 'HIGH').length}개`} tone="red" />
            <Summary label="MEDIUM" value={`${alerts.filter((item) => item.severity === 'MEDIUM').length}개`} tone="amber" />
            <Summary label="LOW" value={`${alerts.filter((item) => item.severity === 'LOW').length}개`} tone="green" />
            <Summary label="미해결" value={`${alerts.length}개`} />
          </Card>
          <Card>
            <SectionHeader title="다음 작업" />
            <div className="space-y-3">
              <Link to={`/conversations/${id}/history`}><Button className="w-full justify-start"><History className="h-5 w-5" />조건 변경 이력 보기</Button></Link>
              <Link to={`/conversations/${id}/evidence`}><Button className="w-full justify-start"><FileText className="h-5 w-5" />증거 패키지 생성</Button></Link>
              <Button className="w-full justify-start" onClick={() => analyze.mutate()}><BarChart3 className="h-5 w-5" />분석 다시 실행</Button>
            </div>
          </Card>
          <Card>
            <SectionHeader title="분석 메모" />
            <p className="text-sm leading-6 text-zinc-600">이 분석은 저장된 상품 게시글과 채팅 메시지를 기반으로 생성된 참고 자료이며, 법적 판단을 대체하지 않습니다.</p>
          </Card>
        </aside>
      </PageGrid>
    </div>
  )
}

function Summary({ label, value, tone = 'gray' }: { label: string; value: string; tone?: 'gray' | 'red' | 'amber' | 'green' }) {
  const color = tone === 'red' ? 'text-red-600' : tone === 'amber' ? 'text-amber-600' : tone === 'green' ? 'text-emerald-600' : ''
  return <div className="flex items-center justify-between border-b border-zinc-200 py-3 last:border-b-0"><span className={color}>{label}</span><b>{value}</b></div>
}
