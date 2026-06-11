import { Eye, FileText, Info, Save } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Textarea } from '../../components/ui/Textarea'
import { api } from '../../lib/api'
import { chatTranscriptSample } from '../../lib/mockData'
import { useState } from 'react'

export function MessagesPage() {
  const { conversationId } = useParams()
  const id = Number(conversationId)
  const { data: conversation } = useQuery({ queryKey: ['conversation', id], queryFn: () => api.conversation(id) })
  const { data: messages = [] } = useQuery({ queryKey: ['messages', id], queryFn: () => api.messages(id) })
  const [transcript, setTranscript] = useState(chatTranscriptSample)
  const [error, setError] = useState('')
  const save = useMutation({ mutationFn: () => api.saveTranscript(id, transcript) })

  const submit = () => {
    setError('')
    if (!transcript.trim()) return setError('채팅 transcript를 입력해주세요.')
    save.mutate()
  }

  return (
    <PageGrid>
      <div className="space-y-5">
        <Card>
          <SectionHeader title="연결된 거래 대화" />
          <div className="grid gap-4 rounded-lg border border-zinc-200 p-4 md:grid-cols-4">
            <Summary label="대화 제목" value={conversation?.title ?? '아이폰 13 거래'} />
            <Summary label="연결 상품" value={conversation?.productTitle ?? '아이폰 13'} />
            <Summary label="상태" value={conversation?.status === 'CLOSED' ? '종료' : '진행 중'} />
            <Summary label="현재 메시지 수" value={`${messages.length}개`} />
          </div>
        </Card>
        <Card>
          <SectionHeader title="채팅 로그 붙여넣기" />
          <Textarea className="min-h-44" value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder="SELLER 18:10  아이폰 13 판매합니다..." />
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button><Eye className="h-4 w-4" />미리보기</Button>
            <Button variant="primary" onClick={submit}><Save className="h-4 w-4" />메시지로 저장</Button>
            <Button>취소</Button>
          </div>
        </Card>
        <Card>
          <SectionHeader title="파싱 미리보기" />
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-zinc-50"><tr>{['순번', '발신자', '시간', '메시지 내용'].map((head) => <th key={head} className="px-4 py-3 text-left">{head}</th>)}</tr></thead>
              <tbody>{messages.map((message, index) => <tr key={message.id} className="border-t border-zinc-200"><td className="px-4 py-3">{index + 1}</td><td className="px-4 py-3">{message.senderType}</td><td className="px-4 py-3">{message.sentAt}</td><td className="px-4 py-3">{message.content}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      </div>
      <aside className="space-y-5">
        <Card><SectionHeader title="붙여넣기 가이드" />{['사용자가 직접 복사한 대화만 입력합니다.', '외부 플랫폼을 자동 수집하거나 크롤링하지 않습니다.', '발신자와 시간이 포함되면 분석 정확도가 높아집니다.', '저장 전 미리보기로 메시지 분리를 확인하세요.', '개인정보가 포함된 내용은 직접 확인 후 입력하세요.'].map((text) => <p key={text} className="mb-6 flex gap-3 text-sm leading-6"><Info className="h-5 w-5 shrink-0" />{text}</p>)}</Card>
        <Card><SectionHeader title="분석에 사용되는 정보" /><p className="text-sm leading-6 text-zinc-600">저장된 메시지는 거래 조건 추출, 누락 조건 탐지, 모호한 표현 탐지, 가격 불일치 탐지에 사용됩니다.</p></Card>
        <Card className="flex gap-3 text-sm leading-6 text-zinc-600"><FileText className="h-5 w-5 shrink-0" />외부 플랫폼 데이터를 직접 수집하지 않고, 사용자가 붙여넣은 대화만 분석합니다.</Card>
        <Link to={`/conversations/${id}/analysis`}><Button variant="primary" className="w-full">분석 결과로 이동</Button></Link>
      </aside>
    </PageGrid>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-zinc-500">{label}</p><p className="mt-1 font-bold">{value}</p></div>
}
