import { BarChart3, FileText, Search } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'
import { alertTypeLabel, formatDate, formatPrice } from '../../lib/format'

export function ConversationDetailPage() {
  const { conversationId } = useParams()
  const id = Number(conversationId)
  const { data: conversation } = useQuery({ queryKey: ['conversation', id], queryFn: () => api.conversation(id) })
  const { data: product } = useQuery({ queryKey: ['product', conversation?.productPostId], queryFn: () => api.product(conversation?.productPostId ?? 1), enabled: Boolean(conversation) })
  const { data: messages = [] } = useQuery({ queryKey: ['messages', id], queryFn: () => api.messages(id) })
  const { data: analysis } = useQuery({ queryKey: ['analysis', id], queryFn: () => api.analysis(id) })
  const analyze = useMutation({ mutationFn: () => api.analyze(id) })

  return (
    <PageGrid>
      <div className="space-y-5">
        <Card>
          <SectionHeader title="상품 게시글 정보" />
          <div className="grid gap-y-6 border-t border-zinc-200 pt-6 md:grid-cols-4">
            <Info label="상품명" value={product?.title ?? '아이폰 13'} />
            <Info label="환불 정책" value={product?.refundPolicyText ?? '환불 불가'} />
            <Info label="등록 가격" value={formatPrice(product?.listedPrice ?? 150000)} />
            <Info label="거래 위치" value={product?.tradeLocationText ?? '홍대입구역'} />
            <Info label="카테고리" value={product?.category ?? '디지털기기'} />
            <Info label="택배 가능" value={product?.deliveryAvailable ? '가능' : '불가'} />
            <Info label="상품 상태" value={product?.conditionDescription ?? '생활기스 있음, 작동 정상'} />
          </div>
        </Card>
        <Card>
          <SectionHeader title="채팅 메시지" />
          <div className="space-y-5">
            {messages.map((message) => (
              <div key={message.id} className="grid gap-3 md:grid-cols-[48px_72px_52px_1fr] md:items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300">{message.senderType === 'SELLER' ? 'S' : 'B'}</div>
                <b>{message.senderType}</b>
                <span className="text-zinc-500">{message.sentAt}</span>
                <div className="rounded-md border border-zinc-200 px-4 py-3">{message.content}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 border-t border-zinc-200 pt-5 md:grid-cols-[150px_1fr_160px]">
            <select className="h-12 rounded-md border border-zinc-200 px-4"><option>BUYER</option><option>SELLER</option></select>
            <Input placeholder="메시지를 입력하세요" />
            <Button>메시지 추가</Button>
          </div>
        </Card>
      </div>
      <aside className="space-y-5">
        <Card>
          <SectionHeader title="분석 패널" />
          <Button variant="primary" className="h-12 w-full" onClick={() => analyze.mutate()}><Search className="h-5 w-5" />분석 실행</Button>
          <div className="mt-5 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
            <div className="flex justify-between p-4"><span>신뢰도 점수</span><b className="text-2xl">{analysis?.confidenceScore ?? 62}%</b></div>
            <div className="flex justify-between p-4"><span>최근 분석</span><span>{formatDate(analysis?.analyzedAt)}</span></div>
          </div>
        </Card>
        <Card>
          <SectionHeader title="주요 경고" />
          <div className="space-y-3">
            {analysis?.alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-md border border-zinc-200 p-3 text-sm">
                <span>{alertTypeLabel(alert.type)}</span>
                <Badge tone={alert.severity}>{alert.severity}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="다음 작업" />
          <div className="space-y-3">
            <Link to={`/conversations/${id}/analysis`}><Button className="w-full justify-start"><BarChart3 className="h-5 w-5" />분석 결과 보기</Button></Link>
            <Link to={`/conversations/${id}/evidence`}><Button className="w-full justify-start"><FileText className="h-5 w-5" />증거 패키지 생성</Button></Link>
            <Link to={`/conversations/${id}/messages`}><Button className="w-full justify-start"><FileText className="h-5 w-5" />채팅 붙여넣기</Button></Link>
          </div>
        </Card>
      </aside>
    </PageGrid>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="mb-2 text-sm font-bold">{label}</p><p className="text-zinc-700">{value}</p></div>
}
