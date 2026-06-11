import { Calendar, Download, FileText, Plus, ShieldCheck } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { StatCard } from '../../components/StatCard'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { api } from '../../lib/api'
import { formatDate } from '../../lib/format'
import { queryClient } from '../../app/queryClient'
import { useState } from 'react'

export function EvidencePage() {
  const { conversationId } = useParams()
  const id = Number(conversationId)
  const { data: packages = [] } = useQuery({ queryKey: ['evidence', id], queryFn: () => api.evidencePackages(id) })
  const [error, setError] = useState('')
  const createPackage = useMutation({
    mutationFn: () => api.createEvidencePackage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['evidence', id] }),
  })

  const download = async (packageId: number, fileName: string) => {
    setError('')
    try {
      const blob = await api.downloadEvidencePdf(packageId)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = fileName
      anchor.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('PDF 다운로드에 실패했습니다. 백엔드가 실행 중인지 확인해주세요.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard icon={FileText} label="생성된 패키지 수" value={packages.length} />
        <StatCard icon={Calendar} label="최근 생성일" value={packages[0]?.createdAt.slice(0, 10) ?? '미확인'} />
        <StatCard icon={ShieldCheck} label="검증 해시 생성" value="완료" />
      </div>
      <PageGrid>
        <div className="space-y-5">
          <Card>
            <SectionHeader title="증거 패키지 목록">
              <Button variant="primary" onClick={() => createPackage.mutate()}><Plus className="h-4 w-4" />새 증거 패키지 생성</Button>
            </SectionHeader>
            {error && <p className="mb-3 text-sm font-semibold text-red-600">{error}</p>}
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-zinc-50"><tr>{['파일명', '연결 대화', '생성일', 'SHA-256 해시', '다운로드'].map((head) => <th key={head} className="px-4 py-4 text-left">{head}</th>)}</tr></thead>
                <tbody>{packages.map((item) => <tr key={item.id} className="border-t border-zinc-200"><td className="px-4 py-4">{item.fileName}</td><td className="px-4 py-4">{item.conversationTitle}</td><td className="px-4 py-4">{formatDate(item.createdAt)}</td><td className="px-4 py-4">{item.hash}</td><td className="px-4 py-4"><Button onClick={() => download(item.id, item.fileName)}>다운로드</Button></td></tr>)}</tbody>
              </table>
            </div>
          </Card>
          <Card>
            <SectionHeader title="포함 정보" />
            <div className="grid gap-5 md:grid-cols-2">
              {['상품 게시글 스냅샷', '최종 거래 조건 요약', '게시글-채팅 불일치 경고', '조건 변경 경고', '누락 조건 경고', '모호한 표현 경고', '위험 결제 경고', '원본 채팅 타임라인', '생성 시각과 SHA-256 해시', '면책 문구'].map((item) => <p key={item} className="flex items-center gap-3"><span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-900 text-xs">✓</span>{item}</p>)}
            </div>
          </Card>
        </div>
        <aside>
          <Card>
            <SectionHeader title="PDF 미리보기" />
            <div className="rounded-md border border-zinc-300 bg-white p-6">
              {['제목 페이지', '상품 게시글 정보', '거래 조건 요약', '경고 목록', '채팅 메시지 타임라인', 'SHA-256 해시', '면책 문구'].map((item, index) => (
                <div key={item} className="mb-5">
                  <b>{index + 1}. {item}</b>
                  <div className="mt-3 h-2 w-4/5 bg-zinc-200" />
                  <div className="mt-2 h-2 w-3/5 bg-zinc-200" />
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button variant="primary" onClick={() => createPackage.mutate()}><FileText className="h-4 w-4" />PDF 생성</Button>
              <Button onClick={() => packages[0] && download(packages[0].id, packages[0].fileName)}><Download className="h-4 w-4" />PDF 다운로드</Button>
            </div>
            <p className="mt-5 rounded-md border border-zinc-200 p-4 text-sm leading-6 text-zinc-600">This document is a structured reference based on transaction records and does not replace legal judgment.</p>
          </Card>
        </aside>
      </PageGrid>
    </div>
  )
}
