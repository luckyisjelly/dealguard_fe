import { FormEvent, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle, Info, FileText } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { api } from '../../lib/api'

const emptyForm = {
  title: '',
  category: '디지털기기',
  listedPrice: 0,
  tradeLocationText: '',
  deliveryAvailable: true,
  description: '',
  conditionDescription: '',
  defectDescription: '',
  refundPolicyText: '',
  tradeMethod: '직거래 또는 택배',
}

export function ProductFormPage() {
  const { productId } = useParams()
  const isEdit = Boolean(productId)
  const navigate = useNavigate()
  const { data } = useQuery({ queryKey: ['product', productId], queryFn: () => api.product(Number(productId)), enabled: isEdit })
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const mutation = useMutation({
    mutationFn: () => isEdit ? api.updateProduct(Number(productId), form) : api.createProduct(form),
    onSuccess: (product) => navigate(`/products/${product.id}`),
  })

  useEffect(() => {
    if (data) setForm({ ...emptyForm, ...data })
  }, [data])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!form.title.trim()) return setError('상품 제목을 입력해주세요.')
    if (Number(form.listedPrice) <= 0) return setError('가격은 0보다 큰 숫자로 입력해주세요.')
    if (!form.conditionDescription.trim()) return setError('상품 상태 설명을 입력해주세요.')
    mutation.mutate()
  }

  return (
    <PageGrid>
      <form onSubmit={submit} className="space-y-5">
        <Card>
          <SectionHeader title="상품 기본 정보" />
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="상품 제목"><Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="아이폰 13" /></Field>
            <Field label="카테고리"><select className="h-11 w-full rounded-md border border-zinc-200 px-3" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>디지털기기</option><option>패션</option><option>생활용품</option></select></Field>
            <Field label="등록 가격"><Input type="number" value={form.listedPrice || ''} onChange={(event) => setForm({ ...form, listedPrice: Number(event.target.value) })} placeholder="150000" /></Field>
            <Field label="거래 위치"><Input value={form.tradeLocationText} onChange={(event) => setForm({ ...form, tradeLocationText: event.target.value })} placeholder="홍대입구역" /></Field>
            <label className="flex items-center gap-3 font-semibold"><span>택배 가능 여부</span><input type="checkbox" checked={form.deliveryAvailable} onChange={(event) => setForm({ ...form, deliveryAvailable: event.target.checked })} />가능</label>
          </div>
        </Card>
        <Card>
          <SectionHeader title="상품 상태 및 거래 조건" />
          <div className="space-y-4">
            <Field label="상품 설명"><Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
            <Field label="상품 상태 설명"><Textarea value={form.conditionDescription} onChange={(event) => setForm({ ...form, conditionDescription: event.target.value })} /></Field>
            <Field label="하자 설명"><Textarea value={form.defectDescription} onChange={(event) => setForm({ ...form, defectDescription: event.target.value })} /></Field>
            <Field label="환불 정책"><Textarea value={form.refundPolicyText} onChange={(event) => setForm({ ...form, refundPolicyText: event.target.value })} /></Field>
            <Field label="거래 방식"><select className="h-11 w-full rounded-md border border-zinc-200 px-3" value={form.tradeMethod} onChange={(event) => setForm({ ...form, tradeMethod: event.target.value })}><option>직거래 또는 택배</option><option>직거래</option><option>택배 가능</option></select></Field>
          </div>
        </Card>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <div className="flex gap-3"><Button variant="primary" type="submit">저장</Button><Button type="button" onClick={() => navigate('/products')}>취소</Button></div>
      </form>
      <aside className="space-y-5">
        <Card>
          <SectionHeader title="입력 가이드" />
          <Guide text="등록 가격은 채팅 분석 가격과 비교됩니다." />
          <Guide text="상품 상태는 모호한 표현 탐지 기준이 됩니다." />
          <Guide text="하자 설명은 분쟁 예방에 중요합니다." />
          <Guide text="환불 정책은 반드시 명확하게 입력하는 것이 좋습니다." />
          <Guide text="거래 위치와 택배 가능 여부는 거래 방식 판단에 사용됩니다." />
        </Card>
        <Card>
          <SectionHeader title="분석 기준 정보" />
          <p className="flex gap-3 text-sm leading-6 text-zinc-600"><Info className="h-5 w-5 shrink-0" />이 상품 게시글 정보는 이후 채팅 메시지에서 추출된 거래 조건과 비교됩니다.</p>
        </Card>
        <Card className="flex gap-3 text-sm leading-6 text-zinc-600"><FileText className="h-5 w-5 shrink-0" />외부 플랫폼 데이터를 직접 수집하지 않고, 사용자가 입력한 정보만 저장합니다.</Card>
      </aside>
    </PageGrid>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold md:grid-cols-[150px_1fr] md:items-start"><span className="pt-3">{label}</span>{children}</label>
}

function Guide({ text }: { text: string }) {
  return <p className="mb-8 flex gap-3 text-sm leading-6 last:mb-0"><CheckCircle className="h-5 w-5 shrink-0" />{text}</p>
}
